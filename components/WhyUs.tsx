import { Flame, MapPin, MessageCircle, Users } from "lucide-react";
import FoodImage from "./FoodImage";
import Reveal from "./Reveal";
import { BUSINESS } from "@/lib/business";

const VALUES = [
  {
    icon: Flame,
    title: "Freshly griddled",
    body: "Nothing sits under a heat lamp. Your batter hits the pan after you order, so the shell is still crackling when you open the box.",
  },
  {
    icon: MapPin,
    title: "Baler famous",
    body: `Serving Baler since ${BUSINESS.since}. Ten takoyaki flavours, plus skewers, tako-fries, yakisoba and okonomiyaki off the same griddle.`,
  },
  {
    icon: Users,
    title: "Built for the barkada",
    body: "16-piece trays and 24-stick San-Yaki platters. Order big, split it on the table, argue over the last one.",
  },
  {
    icon: MessageCircle,
    title: "Order by chat",
    body: "Tap through the menu, hit Messenger, and your whole basket is written out for you. No forms, no app to install.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-brand-600 uppercase">
            Why Bella&apos;s
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-5xl">
            Small stall. <span className="text-brand-600">Serious standards.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.06}>
                <article className="h-full rounded-3xl bg-cream p-6 ring-1 ring-brand-100">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-white">
                    <value.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {value.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <figure className="relative overflow-hidden rounded-3xl bg-brand-50">
              <FoodImage
                src="/images/why-us.jpg"
                alt="Boxes of takoyaki lined up on the prep counter mid-service, loaded with bonito flakes"
                width={900}
                height={1100}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/90 to-transparent p-6 pt-16">
                <p className="font-display text-lg font-bold text-white">
                  &ldquo;Turn it at 40 seconds, not 45.&rdquo;
                </p>
                <p className="mt-1 text-sm text-white/75">
                  The one rule we&apos;ve never broken since {BUSINESS.since}.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
