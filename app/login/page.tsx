import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Staff sign in",
  description: "Staff access for managing daily availability.",
  robots: { index: false, follow: false },
};

/**
 * Phase 1 stub. Phase 2 wires this to Supabase auth + Next.js middleware and
 * adds /admin for toggling availability and editing prices.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-950 px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl bg-cream p-8 text-center shadow-2xl">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-600 text-white">
          <Lock className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">
          Staff sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">
          Coming in Phase 2. For now, daily availability is set in{" "}
          <code className="rounded bg-brand-50 px-1 py-0.5 text-brand-700">
            lib/menu.ts
          </code>{" "}
          by switching an item&apos;s{" "}
          <code className="rounded bg-brand-50 px-1 py-0.5 text-brand-700">
            available
          </code>{" "}
          flag.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to {BUSINESS.shortName}
        </Link>
      </div>
    </main>
  );
}
