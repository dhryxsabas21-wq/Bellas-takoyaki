"use client";

import { create } from "zustand";
import type { Category, MenuItem } from "./menu";

/**
 * Live sold-out state, fetched in the browser.
 *
 * The page HTML is cached so it loads fast, which means the availability baked
 * into it can be a few seconds behind. Sold-out is the one thing that must
 * never be wrong — taking an order you can't cook is a real cost — so the
 * browser re-checks it directly against the database on load.
 *
 * The query is two columns for eighteen rows, so it's far cheaper than
 * rendering the page uncached, and it makes the staleness window zero.
 */
type AvailabilityState = {
  /** itemId -> available. Empty until the first fetch lands. */
  overrides: Record<string, boolean>;
  loaded: boolean;
  setOverrides: (next: Record<string, boolean>) => void;
};

export const useAvailability = create<AvailabilityState>((set) => ({
  overrides: {},
  loaded: false,
  setOverrides: (next) => set({ overrides: next, loaded: true }),
}));

/** Live availability for one item, falling back to the server-rendered value. */
export function isAvailable(
  item: MenuItem,
  overrides: Record<string, boolean>
): boolean {
  const live = overrides[item.id];
  return typeof live === "boolean" ? live : item.available;
}

/** Applies live availability across a whole menu. */
export function applyAvailability(
  menu: Category[],
  overrides: Record<string, boolean>
): Category[] {
  if (!Object.keys(overrides).length) return menu;
  return menu.map((category) => ({
    ...category,
    items: category.items.map((item) => {
      const live = overrides[item.id];
      return typeof live === "boolean" && live !== item.available
        ? { ...item, available: live }
        : item;
    }),
  }));
}
