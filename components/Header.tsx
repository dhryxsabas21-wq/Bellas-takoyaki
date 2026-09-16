"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import FoodImage from "./FoodImage";
import { BUSINESS, NAV_LINKS } from "@/lib/business";
import { selectCount, useCart } from "@/lib/cart";
import { useUI } from "@/lib/ui";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const count = useCart(selectCount);
  const openCart = useUI((s) => s.openCart);
  const badgePulse = useUI((s) => s.badgePulse);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setNavOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || navOpen
          ? "bg-cream/95 shadow-lg shadow-brand-950/10 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20">
        <a
          href="#top"
          className="flex min-h-11 items-center gap-2.5"
          aria-label={`${BUSINESS.name} — back to top`}
        >
          <FoodImage
            src="/images/logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="size-10 rounded-full object-contain sm:size-12"
          />
          <span
            className={`font-display text-base leading-tight font-bold sm:text-lg ${
              scrolled || navOpen ? "text-brand-700" : "text-white drop-shadow-md"
            }`}
          >
            {BUSINESS.shortName}
            <span className="block text-[0.65rem] font-semibold tracking-[0.18em] uppercase opacity-80">
              Takoyaki
            </span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                    scrolled
                      ? "text-ink/75 hover:bg-brand-50 hover:text-brand-700"
                      : "text-white/90 drop-shadow hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open your order — ${count} ${
              count === 1 ? "item" : "items"
            }`}
            className="relative flex min-h-11 items-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-bold text-white shadow-md shadow-brand-900/25 transition hover:bg-brand-700 active:scale-95"
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline">Order</span>
            {/* Decorative badge — remounted on each pulse to restart the
                animation, so the live region below is kept separate. */}
            <span
              key={badgePulse}
              aria-hidden="true"
              className={`grid size-6 place-items-center rounded-full bg-accent-500 text-xs font-extrabold text-brand-950 ${
                badgePulse > 0 ? "badge-pop" : ""
              }`}
            >
              {count}
            </span>
          </button>

          <span aria-live="polite" aria-atomic="true" className="sr-only">
            {count} {count === 1 ? "item" : "items"} in your order
          </span>

          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            className={`grid size-11 place-items-center rounded-full transition lg:hidden ${
              scrolled || navOpen
                ? "bg-brand-50 text-brand-700"
                : "bg-white/15 text-white backdrop-blur-sm"
            }`}
          >
            {navOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!navOpen}
        className="border-t border-brand-100 bg-cream lg:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setNavOpen(false)}
                className="flex min-h-12 items-center border-b border-brand-100/70 text-base font-semibold text-ink/80 last:border-0"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
