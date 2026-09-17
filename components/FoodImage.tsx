"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UtensilsCrossed } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/** How many times to retry before showing the placeholder. */
const MAX_RETRIES = 2;

/**
 * next/image with a branded fallback for photos that don't exist yet.
 *
 * Retries before giving up. Next's image optimizer cache is wiped whenever the
 * server restarts or redeploys, so the first request for a photo afterwards can
 * fail transiently — without a retry a perfectly good photo would be replaced
 * by the placeholder until the visitor reloaded the page.
 */
export default function FoodImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes,
}: Props) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A different photo is a fresh start — clear any previous failure.
  useEffect(() => {
    setAttempt(0);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleError() {
    setAttempt((current) => {
      if (current >= MAX_RETRIES) {
        setFailed(true);
        return current;
      }
      // Back off a little before remounting: an optimizer that's still warming
      // up needs a moment, and hammering it makes things worse.
      timer.current = setTimeout(
        () => setAttempt((a) => a + 1),
        300 * (current + 1)
      );
      return current;
    });
  }

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 ${className}`}
      >
        <UtensilsCrossed
          className="size-1/4 max-h-16 min-h-8 text-accent-400/80"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <Image
      // Remounting on each attempt is what makes the browser re-request it.
      key={attempt}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      className={className}
      onError={handleError}
    />
  );
}
