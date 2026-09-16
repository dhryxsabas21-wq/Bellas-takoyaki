"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FoodImage from "./FoodImage";
import { MENU, startingPrice, type MenuItem } from "@/lib/menu";
import { peso } from "@/lib/format";
import { useUI } from "@/lib/ui";
import { HAS_WHATSAPP } from "@/lib/business";

export default function MenuSection() {
  const [activeId, setActiveId] = useState(MENU[0].id);
  const openItem = useUI((s) => s.openItem);
  const reduced = useReducedMotion();

  const active = MENU.find((c) => c.id === activeId) ?? MENU[0];

  return (
    <section id="menu" className="bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-brand-600 uppercase">
            The Menu
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-5xl">
            Pick your poison. <span className="text-brand-600">All of it, ideally.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-ink/65">
            Everything is cooked to order. Tap an item to choose your size and
            flavour, then send us the basket on{" "}
            {HAS_WHATSAPP ? "Messenger or WhatsApp" : "Messenger"}.
          </p>
        </div>

        {/* Category tabs — scrollable strip on mobile, centred row on desktop */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="no-scrollbar mt-9 -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0"
        >
          {MENU.map((cat) => {
            const selected = cat.id === activeId;
            return (
              <button
                key={cat.id}
                role="tab"
                type="button"
                id={`tab-${cat.id}`}
                aria-selected={selected}
                aria-controls={`panel-${cat.id}`}
                onClick={() => setActiveId(cat.id)}
                className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-bold whitespace-nowrap transition ${
                  selected
                    ? "bg-brand-600 text-white shadow-md shadow-brand-900/25"
                    : "bg-white text-ink/70 ring-1 ring-brand-100 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {active.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.05 }}
            >
              <Card item={item} onChoose={() => openItem(item.id)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ item, onChoose }: { item: MenuItem; onChoose: () => void }) {
  const soldOut = !item.available;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-brand-100 transition ${
        soldOut
          ? "opacity-60 grayscale"
          : "hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10 hover:ring-brand-200"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <FoodImage
          src={item.image}
          alt={item.name}
          width={600}
          height={450}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        {item.badge && !soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-accent-500 px-3 py-1 text-[0.7rem] font-extrabold tracking-wide text-brand-950 uppercase shadow">
            {item.badge}
          </span>
        )}
        {soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-3 py-1 text-[0.7rem] font-extrabold tracking-wide text-white uppercase">
            Sold out today
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight font-bold text-ink">
            {item.name}
          </h3>
          <p className="shrink-0 text-right">
            <span className="block text-[0.65rem] font-semibold tracking-wide text-ink/45 uppercase">
              from
            </span>
            <span className="font-display text-lg font-bold text-brand-600">
              {peso(startingPrice(item))}
            </span>
          </p>
        </div>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
          {item.description}
        </p>

        <button
          type="button"
          onClick={onChoose}
          disabled={soldOut}
          className="mt-5 min-h-11 w-full rounded-full bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink/25 disabled:active:scale-100"
        >
          {soldOut ? "Sold out today" : "Choose & Add"}
        </button>
      </div>
    </article>
  );
}
