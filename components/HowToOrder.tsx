import Reveal from "./Reveal";
import { HAS_WHATSAPP } from "@/lib/business";

const STEPS = [
  {
    number: "01",
    title: "Build your basket",
    body: "Tap through the menu, pick your sizes and flavours, and add everything you want to the order.",
  },
  {
    number: "02",
    title: "Send it to us",
    body: `Hit ${
      HAS_WHATSAPP ? "Messenger or WhatsApp" : "Order via Messenger"
    }. Your full order is written out for you — just add your name and preferred time.`,
  },
  {
    number: "03",
    title: "Pay and collect",
    body: "We confirm the total, you send GCash or pay cash on pickup, and we start cooking so it's hot when you arrive.",
  },
];

export default function HowToOrder() {
  return (
    <section id="how-to-order" className="bg-brand-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-accent-400 uppercase">
            How to Order
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
            Three taps and you&apos;re eating.
          </h2>
        </Reveal>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connecting line, desktop only */}
          <div
            className="absolute top-8 right-[16%] left-[16%] hidden h-0.5 bg-gradient-to-r from-brand-700 via-accent-500/60 to-brand-700 md:block"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <li key={step.number} className="relative">
              <Reveal
                delay={i * 0.1}
                className="flex flex-col items-center text-center"
              >
                <span className="grid size-16 shrink-0 place-items-center rounded-full border-4 border-brand-950 bg-accent-500 font-display text-xl font-extrabold text-brand-950 shadow-lg">
                  {step.number}
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
