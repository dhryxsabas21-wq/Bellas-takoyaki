"use client";

import Image from "next/image";
import { useState } from "react";
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

/**
 * next/image with a branded fallback. Photos are dropped into /public/images
 * later, so a missing file shows a red-gold placeholder instead of a broken
 * image icon — the layout never shifts because the box keeps its dimensions.
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
  const [failed, setFailed] = useState(false);

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
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
