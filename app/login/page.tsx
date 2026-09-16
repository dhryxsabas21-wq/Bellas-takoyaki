import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";
import SetupNotice from "./SetupNotice";

export const metadata: Metadata = {
  title: "Staff sign in",
  description: "Staff access for managing daily availability.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  if (isSupabaseConfigured) {
    const user = await getUser();
    if (user) redirect(next ?? "/admin");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-950 px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl bg-cream p-8 shadow-2xl">
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-600 text-white">
            <Lock className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">
            Staff sign in
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            {BUSINESS.name} — manage today&apos;s menu.
          </p>
        </div>

        {isSupabaseConfigured ? (
          <LoginForm next={next ?? "/admin"} />
        ) : (
          <SetupNotice />
        )}

        <Link
          href="/"
          className="mt-6 flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-ink/50 transition hover:text-brand-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the site
        </Link>
      </div>
    </main>
  );
}
