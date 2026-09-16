"use client";

import { create } from "zustand";

export type CartLine = {
  /** Stable identity for a specific item + variant + options combination. */
  key: string;
  itemId: string;
  name: string;
  variant?: string;
  options?: string[];
  qty: number;
  unitPrice: number;
  image: string;
};

export type NewCartLine = Omit<CartLine, "key">;

function lineKey(line: NewCartLine): string {
  const opts = [...(line.options ?? [])].sort().join("+");
  return `${line.itemId}|${line.variant ?? ""}|${opts}`;
}

type CartState = {
  lines: CartLine[];
  add: (line: NewCartLine) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>((set) => ({
  lines: [],

  add: (line) =>
    set((state) => {
      const key = lineKey(line);
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, qty: l.qty + line.qty } : l
          ),
        };
      }
      return { lines: [...state.lines, { ...line, key }] };
    }),

  setQty: (key, qty) =>
    set((state) => ({
      lines:
        qty <= 0
          ? state.lines.filter((l) => l.key !== key)
          : state.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
    })),

  remove: (key) =>
    set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),

  clear: () => set({ lines: [] }),
}));

/* Selectors — kept as plain functions so components subscribe narrowly. */
export const selectCount = (s: CartState) =>
  s.lines.reduce((n, l) => n + l.qty, 0);

export const selectTotal = (s: CartState) =>
  s.lines.reduce((n, l) => n + l.qty * l.unitPrice, 0);
