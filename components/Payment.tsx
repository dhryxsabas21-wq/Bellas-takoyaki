"use client";

import { useEffect, useState } from "react";
import { Banknote, Check, ChevronDown, Copy, Phone, Smartphone } from "lucide-react";
import FoodImage from "./FoodImage";
import { BUSINESS, isUnset, TEL_URL } from "@/lib/business";
import { copyText } from "@/lib/order";

export default function Payment() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function copyNumber() {
    const ok = await copyText(BUSINESS.gcash.number.replace(/\s/g, ""));
    if (ok) setCopied(true);
  }

  return (
    <section id="payment" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-brand-600 uppercase">
            Payment
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-5xl">
            GCash or cash. <span className="text-brand-600">Your call.</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* GCash */}
          <article className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#0072FF] text-white">
              <Smartphone className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">GCash</h3>
            <p className="mt-1 text-sm text-ink/60">
              Send payment after we confirm your total, then screenshot the receipt
              in the chat.
            </p>

            <div className="mt-6 rounded-2xl bg-cream p-4">
              <p className="text-[0.7rem] font-bold tracking-[0.18em] text-ink/45 uppercase">
                GCash number
              </p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="font-display text-2xl font-bold tracking-wide text-ink sm:text-3xl">
                  {BUSINESS.gcash.number}
                </span>
                <button
                  type="button"
                  onClick={copyNumber}
                  aria-label="Copy GCash number"
                  className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition ${
                    copied
                      ? "bg-green-600 text-white"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {copied ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              {!isUnset(BUSINESS.gcash.accountName) && (
                <>
                  <p className="mt-3 text-[0.7rem] font-bold tracking-[0.18em] text-ink/45 uppercase">
                    Account name
                  </p>
                  <p className="mt-0.5 font-semibold text-ink">
                    {BUSINESS.gcash.accountName}
                  </p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowQR((v) => !v)}
              aria-expanded={showQR}
              aria-controls="gcash-qr"
              className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-100 px-5 text-sm font-bold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
            >
              {showQR ? "Hide QR code" : "Show QR code"}
              <ChevronDown
                className={`size-4 transition-transform ${showQR ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            <div id="gcash-qr" hidden={!showQR} className="mt-4">
              <FoodImage
                src="/images/gcash-qr.png"
                alt={`GCash QR code for ${
                  isUnset(BUSINESS.gcash.accountName)
                    ? BUSINESS.name
                    : BUSINESS.gcash.accountName
                }`}
                width={600}
                height={600}
                className="mx-auto aspect-square w-full max-w-[260px] rounded-2xl bg-cream object-contain p-2 ring-1 ring-brand-100"
              />
            </div>
          </article>

          {/* Cash */}
          <article className="flex flex-col rounded-3xl bg-brand-600 p-6 text-white sm:p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent-500 text-brand-950">
              <Banknote className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold">Cash on pickup</h3>
            <p className="mt-1 text-sm text-white/80">
              The classic. Order ahead in the chat, tell us your pickup time, and
              pay at the stall when you collect.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/90">
              {[
                "Message your order ahead so we can start the griddle before you arrive.",
                "We confirm your total in the chat — no surprises at the stall.",
                "Big trays and party orders: just tell us the pickup time and we'll time it hot.",
              ].map((line) => (
                <li key={line} className="flex gap-2.5">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-accent-400"
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <p className="mt-auto pt-6 text-xs text-white/60">
              Have a downpayment rule for big orders? Add it in{" "}
              <code className="rounded bg-white/15 px-1">components/Payment.tsx</code>.
            </p>
          </article>
        </div>

        <p className="mt-8 text-center text-sm text-ink/60">
          Payment question, or want to settle a big order? Call or text{" "}
          <a
            href={TEL_URL}
            className="inline-flex items-center gap-1 font-bold text-brand-600 underline underline-offset-4 hover:text-brand-700"
          >
            <Phone className="size-4" aria-hidden="true" />
            {BUSINESS.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  );
}
