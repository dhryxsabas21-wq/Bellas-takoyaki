"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircleHeart } from "lucide-react";
import FoodImage from "./FoodImage";
import { BUSINESS } from "@/lib/business";
import { MENU_STATS } from "@/lib/menu";
import { peso } from "@/lib/format";
import { useUI } from "@/lib/ui";

const STATS = [
  { value: `${MENU_STATS.takoyakiFlavors}`, label: "Takoyaki flavours" },
  { value: peso(MENU_STATS.startingPrice), label: "Starting price" },
  { value: MENU_STATS.biggestTray, label: "Biggest barkada tray" },
];

export default function Hero() {
  const openChat = useUI((s) => s.openChat);
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <FoodImage
        src="/images/hero.webp"
        alt="A tray of freshly griddled takoyaki topped with sauce and bonito flakes"
        width={1600}
        height={1100}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      {/* Dark gradient keeps the headline legible over any photo. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/80 via-brand-950/70 to-brand-950/95"
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-6xl flex-col px-4 pt-28 pb-14 sm:pt-36 sm:pb-20 lg:min-h-[88vh] lg:justify-center lg:pt-40 lg:pb-28">
        <motion.p
          {...rise(0)}
          className="text-xs font-bold tracking-[0.28em] text-accent-400 uppercase sm:text-sm"
        >
          Baler · Authentic Japanese street food
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-4 max-w-3xl text-[2.5rem] leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl"
        >
          Takoyaki worth
          <span className="text-accent-400"> queueing for.</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
        >
          {BUSINESS.pitch}
        </motion.p>

        <motion.div
          {...rise(0.24)}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#menu"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brand-600 px-7 text-base font-bold text-white shadow-xl shadow-brand-950/40 transition hover:bg-brand-500 active:scale-95"
          >
            See the menu
            <ArrowRight className="size-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={openChat}
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
          >
            <MessageCircleHeart className="size-5" aria-hidden="true" />
            Ask a question
          </button>
        </motion.div>

        <motion.dl
          {...rise(0.32)}
          className="mt-12 grid grid-cols-3 gap-2 border-t border-white/15 pt-6 sm:gap-6 sm:pt-8"
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-2xl font-bold text-accent-400 sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 block text-[0.7rem] leading-snug text-white/70 sm:text-sm">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
