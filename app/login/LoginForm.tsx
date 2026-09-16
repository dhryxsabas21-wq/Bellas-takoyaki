"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, LogIn } from "lucide-react";
import { signIn, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
    >
      <LogIn className="size-4" aria-hidden="true" />
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(signIn, INITIAL);

  return (
    <form action={formAction} className="mt-6 space-y-3">
      <input type="hidden" name="next" value={next} />

      <div>
        <label
          htmlFor="email"
          className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1.5 min-h-12 w-full rounded-2xl border-2 border-brand-100 bg-white px-4 text-sm text-ink outline-none focus:border-brand-400"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-xs font-bold tracking-[0.18em] text-ink/50 uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 min-h-12 w-full rounded-2xl border-2 border-brand-100 bg-white px-4 text-sm text-ink outline-none focus:border-brand-400"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-brand-50 p-3 text-sm font-semibold text-brand-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
