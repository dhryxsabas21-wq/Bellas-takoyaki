"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { useUI } from "@/lib/ui";
import { copyText } from "@/lib/order";
import { MESSENGER_URL, HAS_MESSENGER } from "@/lib/business";

/**
 * Two safety nets in one place:
 *  1. Toasts for "added to cart" / "order copied".
 *  2. The manual-copy panel shown when navigator.clipboard is blocked — which
 *     it routinely is inside the Facebook and Instagram in-app browsers.
 */
export default function Toaster() {
  return (
    <>
      <Toast />
      <ManualCopyPanel />
    </>
  );
}

function Toast() {
  const toast = useUI((s) => s.toast);
  const hideToast = useUI((s) => s.hideToast);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(hideToast, 3200);
    return () => clearTimeout(id);
  }, [toast, hideToast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4 sm:bottom-8"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            <Check className="size-4 text-accent-400" aria-hidden="true" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ManualCopyPanel() {
  const manualCopy = useUI((s) => s.manualCopy);
  const setManualCopy = useUI((s) => s.setManualCopy);
  const showToast = useUI((s) => s.showToast);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (manualCopy) textareaRef.current?.select();
  }, [manualCopy]);

  if (!manualCopy) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={() => setManualCopy(null)}
        className="absolute inset-0 size-full cursor-default bg-brand-950/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-copy-title"
        className="relative w-full max-w-md rounded-t-3xl bg-cream p-5 shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={() => setManualCopy(null)}
          aria-label="Close"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-ink/50 hover:bg-brand-50"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <h2
          id="manual-copy-title"
          className="pr-10 font-display text-xl font-bold text-ink"
        >
          Copy your order
        </h2>
        <p className="mt-1 text-sm text-ink/65">
          Your browser blocked automatic copying. Select the text below, copy it,
          and paste it into our chat.
        </p>

        <textarea
          ref={textareaRef}
          readOnly
          value={manualCopy}
          rows={9}
          aria-label="Your order message"
          className="mt-3 w-full resize-none rounded-2xl border-2 border-brand-100 bg-white p-3 font-mono text-xs leading-relaxed text-ink"
        />

        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={async () => {
              const ok = await copyText(manualCopy);
              if (ok) showToast("Order copied!");
              else textareaRef.current?.select();
            }}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <Copy className="size-4" aria-hidden="true" />
            Try copying again
          </button>
          {HAS_MESSENGER && (
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#0866FF] px-6 text-sm font-bold text-white transition hover:brightness-110"
            >
              Open Messenger
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
