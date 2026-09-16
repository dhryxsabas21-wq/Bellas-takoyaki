"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { selectTotal, useCart } from "@/lib/cart";
import { peso } from "@/lib/format";
import { useUI } from "@/lib/ui";
import { useDialog } from "@/lib/dialog";
import { checkoutMessenger, checkoutWhatsApp } from "@/lib/order";
import { HAS_WHATSAPP } from "@/lib/business";

export default function CartDrawer() {
  const cartOpen = useUI((s) => s.cartOpen);
  return <AnimatePresence>{cartOpen && <DrawerBody />}</AnimatePresence>;
}

function DrawerBody() {
  const closeCart = useUI((s) => s.closeCart);
  const showToast = useUI((s) => s.showToast);
  const setManualCopy = useUI((s) => s.setManualCopy);

  const lines = useCart((s) => s.lines);
  const total = useCart(selectTotal);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(panelRef, true, closeCart);

  const deps = { showToast, setManualCopy };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <motion.button
        type="button"
        aria-label="Close order"
        onClick={closeCart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 size-full cursor-default bg-brand-950/60 backdrop-blur-sm"
      />

      <motion.aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-brand-100 bg-white px-5 py-4">
          <h2
            id="cart-title"
            className="flex items-center gap-2 font-display text-xl font-bold text-ink"
          >
            <ShoppingBag className="size-5 text-brand-600" aria-hidden="true" />
            Your Order
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close order"
            className="grid size-11 place-items-center rounded-full text-ink/60 transition hover:bg-brand-50 hover:text-brand-700"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-brand-50">
              <ShoppingBag className="size-9 text-brand-300" aria-hidden="true" />
            </div>
            <p className="font-display text-lg font-bold text-ink">
              Nothing here yet.
            </p>
            <p className="text-sm text-ink/60">
              The griddle&apos;s hot and the bonito is dancing. Go pick something.
            </p>
            <a
              href="#menu"
              onClick={closeCart}
              className="mt-2 inline-flex min-h-12 items-center rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Browse the menu
            </a>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-brand-100 overflow-y-auto px-5">
              {lines.map((line) => (
                <li key={line.key} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{line.name}</p>
                      {(line.variant || line.options?.length) && (
                        <p className="mt-0.5 text-xs text-ink/55">
                          {[line.variant, line.options?.join(", ")]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-ink/45">
                        {peso(line.unitPrice)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      aria-label={`Remove ${line.name}`}
                      className="grid size-11 shrink-0 place-items-center rounded-full text-ink/40 transition hover:bg-brand-50 hover:text-brand-600"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-brand-100">
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty - 1)}
                        aria-label={`Decrease ${line.name} quantity`}
                        className="grid size-10 place-items-center rounded-full text-brand-700 transition hover:bg-brand-50"
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-ink">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty + 1)}
                        aria-label={`Increase ${line.name} quantity`}
                        className="grid size-10 place-items-center rounded-full text-brand-700 transition hover:bg-brand-50"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="font-display text-lg font-bold text-brand-600">
                      {peso(line.qty * line.unitPrice)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-brand-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold tracking-wide text-ink/60 uppercase">
                  Total
                </span>
                <span
                  aria-live="polite"
                  className="font-display text-3xl font-bold text-brand-600"
                >
                  {peso(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink/50">
                We&apos;ll confirm your total and timing in the chat before cooking.
              </p>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={() => checkoutMessenger(lines, total, deps)}
                  className="min-h-13 w-full rounded-full bg-[#0866FF] px-6 text-base font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
                >
                  Order via Messenger
                </button>
                {HAS_WHATSAPP && (
                  <button
                    type="button"
                    onClick={() => checkoutWhatsApp(lines, total, deps)}
                    className="min-h-13 w-full rounded-full bg-[#25D366] px-6 text-base font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
                  >
                    Order via WhatsApp
                  </button>
                )}
                <button
                  type="button"
                  onClick={clear}
                  className="min-h-11 w-full rounded-full text-sm font-semibold text-ink/50 transition hover:text-brand-600"
                >
                  Clear order
                </button>
              </div>
            </footer>
          </>
        )}
      </motion.aside>
    </div>
  );
}
