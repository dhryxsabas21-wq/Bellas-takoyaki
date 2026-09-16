"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import FoodImage from "./FoodImage";
import { findItem, type Category, type MenuItem } from "@/lib/menu";
import { peso } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui";
import { useDialog } from "@/lib/dialog";

export default function ItemModal({ menu }: { menu?: Category[] }) {
  const modalItemId = useUI((s) => s.modalItemId);
  // Resolve against the live menu when the page passed one, so prices set in
  // /admin are what the customer actually adds to their basket.
  const lookup = menu?.flatMap((c) => c.items);
  const item = modalItemId
    ? (lookup?.find((i) => i.id === modalItemId) ?? findItem(modalItemId))
    : undefined;

  return (
    <AnimatePresence>
      {item && <ModalBody key={item.id} item={item} />}
    </AnimatePresence>
  );
}

function ModalBody({ item }: { item: MenuItem }) {
  const closeItem = useUI((s) => s.closeItem);
  const pulseBadge = useUI((s) => s.pulseBadge);
  const showToast = useUI((s) => s.showToast);
  const add = useCart((s) => s.add);

  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(panelRef, true, closeItem);

  const [variantId, setVariantId] = useState(item.variants?.[0]?.id ?? "");
  const [picked, setPicked] = useState<string[]>([]);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const maxOptions = item.maxOptions ?? 1;

  // Reset the picker whenever a different item is opened.
  useEffect(() => {
    setVariantId(item.variants?.[0]?.id ?? "");
    setPicked([]);
    setAddOnIds([]);
    setQty(1);
  }, [item]);

  const variant = item.variants?.find((v) => v.id === variantId);

  const chosenAddOns = useMemo(
    () => (item.addOns ?? []).filter((a) => addOnIds.includes(a.id)),
    [item.addOns, addOnIds]
  );

  // Add-ons are priced per unit, so they fold into unitPrice and the cart's
  // per-line maths stays a single multiplication.
  const unitPrice =
    (variant?.price ?? item.basePrice) +
    chosenAddOns.reduce((sum, a) => sum + a.price, 0);

  const lineTotal = unitPrice * qty;

  const needsOption = Boolean(item.options?.length) && picked.length === 0;

  function toggleOption(option: string) {
    setPicked((current) => {
      if (maxOptions === 1) return [option];
      if (current.includes(option)) return current.filter((o) => o !== option);
      if (current.length >= maxOptions) return current;
      return [...current, option];
    });
  }

  function handleAdd() {
    if (needsOption) return;
    // Chosen add-ons ride along in `options` so they show in the cart line and
    // in the order message you receive.
    const detail = [...picked, ...chosenAddOns.map((a) => a.label)];
    add({
      itemId: item.id,
      name: item.name,
      variant: variant?.label,
      options: detail.length ? detail : undefined,
      qty,
      unitPrice,
      image: item.image,
    });
    pulseBadge();
    showToast(`${qty}× ${item.name} added to your order`);
    closeItem();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <motion.button
        type="button"
        aria-label="Close"
        onClick={closeItem}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 size-full cursor-default bg-brand-950/60 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={closeItem}
          aria-label="Close item"
          className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-ink/55 text-white backdrop-blur-sm transition hover:bg-ink/75"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto">
          <div className="relative aspect-[16/9] bg-brand-50">
            <FoodImage
              src={item.image}
              alt={item.name}
              width={800}
              height={450}
              sizes="(max-width: 640px) 100vw, 512px"
              className="size-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-6">
            <h2
              id="item-modal-title"
              className="font-display text-2xl font-bold text-ink"
            >
              {item.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              {item.description}
            </p>

            {item.variants?.length ? (
              <fieldset className="mt-6">
                <legend className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase">
                  Choose a size
                </legend>
                <div className="mt-3 grid gap-2">
                  {item.variants.map((v) => {
                    const selected = v.id === variantId;
                    return (
                      <label
                        key={v.id}
                        className={`flex min-h-12 cursor-pointer items-center justify-between rounded-2xl border-2 px-4 transition ${
                          selected
                            ? "border-brand-600 bg-brand-50"
                            : "border-brand-100 bg-white hover:border-brand-200"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="variant"
                            value={v.id}
                            checked={selected}
                            onChange={() => setVariantId(v.id)}
                            className="size-4 accent-brand-600"
                          />
                          <span className="text-sm font-semibold text-ink">
                            {v.label}
                          </span>
                        </span>
                        <span className="font-display text-base font-bold text-brand-600">
                          {peso(v.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {item.options?.length ? (
              <fieldset className="mt-6">
                <legend className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase">
                  {item.optionsLabel ?? "Pick your flavour"}
                  {maxOptions > 1 && (
                    <span className="ml-2 normal-case opacity-70">
                      ({picked.length}/{maxOptions})
                    </span>
                  )}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.options.map((option) => {
                    const selected = picked.includes(option);
                    const full = !selected && picked.length >= maxOptions;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(option)}
                        aria-pressed={selected}
                        disabled={full && maxOptions > 1}
                        className={`min-h-11 rounded-full border-2 px-4 text-sm font-semibold transition disabled:opacity-40 ${
                          selected
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-brand-100 bg-white text-ink/75 hover:border-brand-300"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {needsOption && (
                  <p className="mt-2 text-xs font-semibold text-brand-600">
                    Pick at least one to continue.
                  </p>
                )}
              </fieldset>
            ) : null}

            {item.addOns?.length ? (
              <fieldset className="mt-6">
                <legend className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase">
                  Add-ons
                </legend>
                <div className="mt-3 grid gap-2">
                  {item.addOns.map((addOn) => {
                    const selected = addOnIds.includes(addOn.id);
                    return (
                      <label
                        key={addOn.id}
                        className={`flex min-h-12 cursor-pointer items-center justify-between rounded-2xl border-2 px-4 transition ${
                          selected
                            ? "border-brand-600 bg-brand-50"
                            : "border-brand-100 bg-white hover:border-brand-200"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              setAddOnIds((current) =>
                                current.includes(addOn.id)
                                  ? current.filter((id) => id !== addOn.id)
                                  : [...current, addOn.id]
                              )
                            }
                            className="size-4 accent-brand-600"
                          />
                          <span className="text-sm font-semibold text-ink">
                            {addOn.label}
                          </span>
                        </span>
                        <span className="font-display text-base font-bold text-brand-600">
                          +{peso(addOn.price)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase">
                Quantity
              </span>
              <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-brand-100">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="grid size-11 place-items-center rounded-full text-brand-700 transition hover:bg-brand-50 disabled:opacity-35"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span
                  aria-live="polite"
                  className="w-8 text-center font-display text-lg font-bold text-ink"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="grid size-11 place-items-center rounded-full text-brand-700 transition hover:bg-brand-50"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleAdd}
            disabled={needsOption}
            className="flex min-h-13 w-full items-center justify-between rounded-full bg-brand-600 px-6 text-base font-bold text-white transition hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/25 disabled:active:scale-100"
          >
            <span>Add to Order</span>
            <span className="font-display">{peso(lineTotal)}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
