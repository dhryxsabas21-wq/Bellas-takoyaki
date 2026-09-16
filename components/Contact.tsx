import { Clock, Facebook, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import Reveal from "./Reveal";
import {
  BUSINESS,
  HAS_WHATSAPP,
  isUnset,
  MESSENGER_URL,
  TEL_URL,
  WHATSAPP_URL,
} from "@/lib/business";

/** The WhatsApp card only appears once a number is set in lib/business.ts. */
const CHANNELS = [
  {
    icon: MessageCircle,
    label: "Messenger",
    subtitle: "Fastest reply — send your order straight to our inbox",
    action: "Open chat",
    href: MESSENGER_URL,
    tone: "bg-[#0866FF]",
  },
  ...(HAS_WHATSAPP
    ? [
        {
          icon: Send,
          label: "WhatsApp",
          subtitle: "Prefilled orders, straight to the griddle",
          action: "Message us",
          href: WHATSAPP_URL,
          tone: "bg-[#25D366]",
        },
      ]
    : []),
  {
    icon: Facebook,
    label: "Facebook Page",
    subtitle: "Daily flavours, sold-out updates and photos",
    action: "Follow us",
    href: BUSINESS.facebookUrl,
    tone: "bg-[#1877F2]",
  },
  {
    icon: Phone,
    label: "Call or text",
    subtitle: BUSINESS.phoneDisplay,
    action: "Call now",
    href: TEL_URL,
    tone: "bg-brand-600",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-brand-600 uppercase">
            Contact
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-5xl">
            Come say hi.
          </h2>
        </Reveal>

        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 ${
            CHANNELS.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {CHANNELS.map((channel, i) => (
            <Reveal key={channel.label} delay={i * 0.06}>
              <article className="flex h-full flex-col rounded-3xl bg-cream p-6 ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/10">
                <span
                  className={`grid size-12 place-items-center rounded-2xl text-white ${channel.tone}`}
                >
                  <channel.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {channel.label}
                </h3>
                <p className="mt-1 flex-1 text-sm text-ink/60">
                  {channel.subtitle}
                </p>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-bold text-white transition hover:bg-brand-700"
                >
                  {channel.action}
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-4 rounded-3xl bg-brand-50 p-6 sm:grid-cols-2 sm:p-8">
            <div className="flex gap-3">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  Where to find us
                </h3>
                <address className="mt-1 text-sm leading-relaxed text-ink/65 not-italic">
                  {!isUnset(BUSINESS.address.street) && (
                    <>
                      {BUSINESS.address.street}
                      <br />
                    </>
                  )}
                  {BUSINESS.address.locality}, {BUSINESS.address.region}
                  <br />
                  <span className="text-ink/50">
                    {isUnset(BUSINESS.address.serviceArea)
                      ? "Message us on Facebook for directions and delivery."
                      : BUSINESS.address.serviceArea}
                  </span>
                </address>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock
                className="mt-0.5 size-5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  Opening hours
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">
                  {isUnset(BUSINESS.hours.display) ? (
                    "Message us on Facebook for today's hours."
                  ) : (
                    <>
                      {BUSINESS.hours.display}
                      <br />
                      <span className="text-ink/50">
                        Last orders 30 minutes before closing.
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
