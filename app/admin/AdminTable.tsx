"use client";

import { useState, useTransition } from "react";
import { Check, RefreshCw, Save, X } from "lucide-react";
import type { Category, MenuItem } from "@/lib/menu";
import { peso } from "@/lib/format";
import { setAvailability, setPrices, syncFromCode } from "./actions";

export default function AdminTable({ menu }: { menu: Category[] }) {
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [syncing, startSync] = useTransition();

  function flash(result: { ok: boolean; message: string }) {
    setToast(result);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/60">
          Toggle an item off and it greys out on the site within a minute.
        </p>
        <button
          type="button"
          disabled={syncing}
          onClick={() => startSync(async () => flash(await syncFromCode()))}
          className="flex min-h-11 items-center gap-2 rounded-full bg-accent-500 px-5 text-sm font-bold text-brand-950 transition hover:bg-accent-400 disabled:opacity-60"
        >
          <RefreshCw
            className={`size-4 ${syncing ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          {syncing ? "Syncing…" : "Sync from menu file"}
        </button>
      </div>

      {toast && (
        <p
          role="status"
          className={`mt-4 rounded-2xl p-3 text-sm font-semibold ${
            toast.ok
              ? "bg-green-500/15 text-green-200 ring-1 ring-green-500/30"
              : "bg-brand-500/20 text-brand-100 ring-1 ring-brand-400/40"
          }`}
        >
          {toast.message}
        </p>
      )}

      <div className="mt-5 space-y-6">
        {menu.map((category) => (
          <section key={category.id}>
            <h2 className="font-display text-sm font-bold tracking-[0.18em] text-accent-400 uppercase">
              {category.label}
            </h2>
            <ul className="mt-2 space-y-2">
              {category.items.map((item) => (
                <ItemRow key={item.id} item={item} onResult={flash} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function ItemRow({
  item,
  onResult,
}: {
  item: MenuItem;
  onResult: (r: { ok: boolean; message: string }) => void;
}) {
  const [available, setAvail] = useState(item.available);
  const [basePrice, setBasePrice] = useState(String(item.basePrice));
  const [variantPrices, setVariantPrices] = useState<Record<string, string>>(
    Object.fromEntries((item.variants ?? []).map((v) => [v.id, String(v.price)]))
  );
  const [pending, startTransition] = useTransition();

  const dirty =
    basePrice !== String(item.basePrice) ||
    (item.variants ?? []).some(
      (v) => variantPrices[v.id] !== String(v.price)
    );

  function toggle() {
    const next = !available;
    setAvail(next); // optimistic
    startTransition(async () => {
      const result = await setAvailability(item.id, next);
      if (!result.ok) setAvail(!next);
      onResult(result);
    });
  }

  function save() {
    startTransition(async () => {
      const variants = item.variants?.length
        ? Object.fromEntries(
            Object.entries(variantPrices).map(([k, v]) => [k, Number(v)])
          )
        : null;
      // "from ₱X" on the card reads basePrice, so keep it pinned to the
      // cheapest size rather than letting the two drift apart.
      const nextBase = variants
        ? Math.min(...Object.values(variants))
        : Number(basePrice);
      onResult(await setPrices(item.id, nextBase, variants));
    });
  }

  return (
    <li
      className={`rounded-2xl bg-white/5 p-4 ring-1 transition ${
        available ? "ring-white/10" : "ring-brand-500/40 bg-brand-950/60"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-white">{item.name}</p>
          <p className="text-xs text-white/45">
            {available ? `On the menu · from ${peso(item.basePrice)}` : "Sold out today"}
          </p>
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          role="switch"
          aria-checked={available}
          aria-label={`${item.name} — ${
            available ? "mark sold out" : "put back on the menu"
          }`}
          className={`flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition disabled:opacity-60 ${
            available
              ? "bg-green-500/20 text-green-200 hover:bg-green-500/30"
              : "bg-brand-600 text-white hover:bg-brand-500"
          }`}
        >
          {available ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <X className="size-4" aria-hidden="true" />
          )}
          {available ? "Available" : "Sold out"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        {item.variants?.length ? (
          item.variants.map((v) => (
            <label key={v.id} className="block">
              <span className="text-[0.65rem] font-bold tracking-[0.15em] text-white/40 uppercase">
                {v.label}
              </span>
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={variantPrices[v.id] ?? ""}
                onChange={(e) =>
                  setVariantPrices((p) => ({ ...p, [v.id]: e.target.value }))
                }
                aria-label={`${item.name} ${v.label} price in pesos`}
                className="mt-1 min-h-11 w-24 rounded-xl border-2 border-white/15 bg-brand-950 px-3 text-sm font-semibold text-white outline-none focus:border-accent-500"
              />
            </label>
          ))
        ) : (
          <label className="block">
            <span className="text-[0.65rem] font-bold tracking-[0.15em] text-white/40 uppercase">
              Price
            </span>
            <input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              aria-label={`${item.name} price in pesos`}
              className="mt-1 min-h-11 w-24 rounded-xl border-2 border-white/15 bg-brand-950 px-3 text-sm font-semibold text-white outline-none focus:border-accent-500"
            />
          </label>
        )}

        {dirty && (
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="flex min-h-11 items-center gap-2 rounded-full bg-accent-500 px-4 text-sm font-bold text-brand-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            <Save className="size-4" aria-hidden="true" />
            {pending ? "Saving…" : "Save"}
          </button>
        )}
      </div>
    </li>
  );
}
