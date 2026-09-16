import Link from "next/link";
import { Facebook, MessageCircle, Phone } from "lucide-react";
import FoodImage from "./FoodImage";
import {
  BUSINESS,
  isUnset,
  MESSENGER_URL,
  NAV_LINKS,
  TEL_URL,
} from "@/lib/business";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 pt-14 pb-8 text-white/70">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <FoodImage
                src="/images/logo.png"
                alt=""
                width={56}
                height={56}
                className="size-12 rounded-full object-contain"
              />
              <span className="font-display text-xl font-bold text-white">
                {BUSINESS.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              {BUSINESS.tagline}
            </p>
            <p className="mt-3 text-sm">
              {BUSINESS.address.locality}, {BUSINESS.address.region}
              {!isUnset(BUSINESS.hours.display) && ` · ${BUSINESS.hours.display}`}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-sm font-bold tracking-[0.18em] text-accent-400 uppercase">
              Explore
            </h2>
            <ul className="mt-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex min-h-10 items-center text-sm transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-sm font-bold tracking-[0.18em] text-accent-400 uppercase">
              Get in touch
            </h2>
            <ul className="mt-4 flex gap-3">
              <li>
                <a
                  href={BUSINESS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bella's Takoyaki on Facebook"
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-brand-600 hover:text-white"
                >
                  <Facebook className="size-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Bella's Takoyaki on Messenger"
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-brand-600 hover:text-white"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={TEL_URL}
                  aria-label={`Call ${BUSINESS.phoneDisplay}`}
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-brand-600 hover:text-white"
                >
                  <Phone className="size-5" aria-hidden="true" />
                </a>
              </li>
            </ul>
            <p className="mt-4 text-sm">{BUSINESS.phoneDisplay}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BUSINESS.name}. All rights reserved.
          </p>
          <Link
            href="/login"
            className="flex min-h-10 items-center text-white/40 transition hover:text-white/80"
          >
            Staff sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
