"use client";

import { useEffect } from "react";
import { useAvailability } from "@/lib/availability";

/** How often to re-check while the customer is actually looking at the menu. */
const POLL_MS = 6000;

/**
 * Renders nothing. Keeps sold-out state current in the customer's browser.
 *
 * Checks on load, every few seconds while the tab is visible, and again the
 * moment they come back to it. So marking something sold out at the stall
 * reaches someone already browsing the menu within a few seconds — they don't
 * have to reload, and you don't have to press anything.
 *
 * Polling stops entirely while the tab is hidden, so a menu left open in a
 * background tab costs nothing in battery or mobile data.
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
    let timer: ReturnType<typeof setInterval> | null = null;

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

    function startPolling() {
      if (timer) return;
      timer = setInterval(refresh, POLL_MS);
    }

    function stopPolling() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        refresh(); // catch up immediately, then resume the interval
        startPolling();
      } else {
        stopPolling();
      }
    }

    refresh();
    if (document.visibilityState === "visible") startPolling();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", refresh);

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", refresh);
    };
  }, [setOverrides]);

  return null;
}
