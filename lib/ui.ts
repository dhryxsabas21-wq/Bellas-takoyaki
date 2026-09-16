"use client";

import { create } from "zustand";

type UIState = {
  cartOpen: boolean;
  chatOpen: boolean;
  /** MenuItem id currently shown in the item modal, or null. */
  modalItemId: string | null;
  /** Toggles a short animation on the header cart badge. */
  badgePulse: number;
  toast: string | null;
  /** Raw order text shown in a copy-it-yourself panel when clipboard fails. */
  manualCopy: string | null;

  openCart: () => void;
  closeCart: () => void;
  openChat: () => void;
  closeChat: () => void;
  openItem: (id: string) => void;
  closeItem: () => void;
  pulseBadge: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  setManualCopy: (text: string | null) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  chatOpen: false,
  modalItemId: null,
  badgePulse: 0,
  toast: null,
  manualCopy: null,

  openCart: () => set({ cartOpen: true, modalItemId: null }),
  closeCart: () => set({ cartOpen: false }),
  openChat: () => set({ chatOpen: true }),
  closeChat: () => set({ chatOpen: false }),
  openItem: (id) => set({ modalItemId: id }),
  closeItem: () => set({ modalItemId: null }),
  pulseBadge: () => set((s) => ({ badgePulse: s.badgePulse + 1 })),
  showToast: (message) => set({ toast: message }),
  hideToast: () => set({ toast: null }),
  setManualCopy: (text) => set({ manualCopy: text }),
}));
