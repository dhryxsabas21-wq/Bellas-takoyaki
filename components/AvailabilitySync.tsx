"use client";

import { useEffect } from "react";
import { useAvailability } from "@/lib/availability";

/**
 * Renders nothing. Pulls current sold-out state from /api/availability on load,
 * and again whenever the customer returns to the tab — so a basket left open
 * while they walked to the stall still reflects what's actually available.
 *
 * Uses plain fetch rather than the Supabase SDK: importing the SDK here added
 * ~70 kB to every page load, and this needs exactly one tiny query.
 *
 * Every failure path is silent on purpose. If this can't reach the server, the
 * page keeps the availability it was rendered with — the menu must never break
 * because a background refresh failed.
 */
export default function AvailabilitySync() {
  const setOverrides = useAvailability((s) => s.setOverrides);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch("/api/availability", { cache: "no-store" });
        if (!res.ok || cancelled) return;

        const data = (await res.json()) as Record<string, boolean>;
        if (cancelled || !data || typeof data !== "object") return;

        setOverrides(data);
      } catch {
        // Offline or blocked — keep what we have.
      }
    }

    refresh();

    const onFocus = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [setOverrides]);

  return null;
}
