import { MARQUEE_WORDS } from "@/lib/menu";

/**
 * The list renders twice inside a max-content flex track so translating the
 * track by -50% lands exactly on the start of the second copy — a seamless
 * loop. Pauses on hover/focus; frozen entirely under prefers-reduced-motion.
 */
export default function Marquee({ words: live }: { words?: string[] }) {
  const source = live?.length ? live : MARQUEE_WORDS;
  const words = [...source, ...source];

  return (
    <div
      className="marquee-pause overflow-hidden border-y-4 border-brand-950/20 bg-brand-600 py-3 sm:py-4"
      aria-hidden="true"
    >
      <div className="marquee-track">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex shrink-0 items-center font-display text-sm font-bold tracking-wide text-white uppercase sm:text-lg"
          >
            {word}
            <span className="mx-4 text-accent-400 sm:mx-6" aria-hidden="true">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
