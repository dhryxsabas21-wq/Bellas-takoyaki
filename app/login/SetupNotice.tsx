import { AlertCircle } from "lucide-react";

/** Shown until NEXT_PUBLIC_SUPABASE_* are set. Never visible to customers. */
export default function SetupNotice() {
  return (
    <div className="mt-6 rounded-2xl bg-accent-400/20 p-4 ring-1 ring-accent-500/40">
      <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
        <AlertCircle className="size-4 text-brand-600" aria-hidden="true" />
        Not set up yet
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        Staff sign-in needs a free Supabase project. Follow{" "}
        <strong>step 7 of the README</strong> — it takes about ten minutes, and
        you only do it once.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-ink/55">
        Until then the public menu runs from{" "}
        <code className="rounded bg-white/70 px-1">lib/menu.ts</code>, so the
        site works normally — you just edit sold-out items in code.
      </p>
    </div>
  );
}
