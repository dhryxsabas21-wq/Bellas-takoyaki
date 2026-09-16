"use client";

import type { CartLine } from "./cart";
import {
  BUSINESS,
  HAS_MESSENGER,
  HAS_WHATSAPP,
  MESSENGER_URL,
  WHATSAPP_URL,
} from "./business";

/** The exact text the customer sends you. Keep it plain — no markdown. */
export function buildOrderMessage(cart: CartLine[], total: number): string {
  const lines = cart
    .map(
      (l) =>
        `• ${l.qty}x ${l.name}${l.variant ? ` (${l.variant})` : ""}` +
        `${l.options?.length ? ` — ${l.options.join(", ")}` : ""} — ₱${
          l.qty * l.unitPrice
        }`
    )
    .join("\n");

  return (
    `Hi ${BUSINESS.name}! I'd like to order:\n\n${lines}\n\n` +
    `TOTAL: ₱${total}\n\nName:\nPickup/Delivery:\nPreferred time:`
  );
}

/**
 * Clipboard writes fail often inside the Facebook and Instagram in-app
 * browsers, so this never throws — the caller shows a manual-copy panel when
 * it returns false.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path below */
  }

  // Legacy fallback: works in a few in-app browsers where the async API is
  // blocked but execCommand still runs inside a user gesture.
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.top = "-1000px";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Opened synchronously from the click handler so mobile popup blockers and
 * in-app browsers don't swallow it.
 */
function openExternal(url: string) {
  window.open(url, "_blank", "noopener");
}

type CheckoutDeps = {
  showToast: (message: string) => void;
  setManualCopy: (text: string | null) => void;
};

/** WhatsApp supports prefilled text, so the whole order goes in the URL. */
export function checkoutWhatsApp(
  lines: CartLine[],
  total: number,
  { showToast, setManualCopy }: CheckoutDeps
) {
  const message = buildOrderMessage(lines, total);

  if (!HAS_WHATSAPP) {
    setManualCopy(message);
    return;
  }

  openExternal(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`);
  showToast("Opening WhatsApp with your order…");
}

/**
 * Messenger does NOT support prefilled text. Copy first, open second, and if
 * the copy fails show the message so the customer can select it by hand.
 * Checkout must never dead-end.
 */
export function checkoutMessenger(
  lines: CartLine[],
  total: number,
  { showToast, setManualCopy }: CheckoutDeps
) {
  const message = buildOrderMessage(lines, total);

  if (!HAS_MESSENGER) {
    setManualCopy(message);
    return;
  }

  // Open in the same tick as the click, before awaiting the clipboard.
  openExternal(MESSENGER_URL);

  copyText(message).then((ok) => {
    if (ok) {
      // Without a Page ID we land on the Page, not the inbox, so the wording
      // tells them the extra tap they need.
      showToast(
        BUSINESS.messengerPageId
          ? "Order copied — just paste it in the chat!"
          : "Order copied — tap Message on our Page and paste it!"
      );
    } else {
      setManualCopy(message);
    }
  });
}
