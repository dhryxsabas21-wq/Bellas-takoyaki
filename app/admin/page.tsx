import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ExternalLink, LogOut } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { MENU } from "@/lib/menu";
import { getMenu } from "@/lib/menu-server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient, getUser } from "@/lib/supabase/server";
import { signOut } from "./actions";
import AdminTable from "./AdminTable";

export const metadata: Metadata = {
  title: "Menu admin",
  robots: { index: false, follow: false },
};

/** Always fresh — staff need to see what they just changed. */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured) return <NotConfigured />;

  const user = await getUser();
  const menu = await getMenu();

  // Detect an empty/missing products table so we can prompt the first sync
  // instead of showing a table that silently saves nothing.
  const supabase = await createClient();
  const { count, error } = (await supabase
    ?.from("products")
    .select("id", { count: "exact", head: true })) ?? { count: null, error: null };

  const needsSync = !error && (count ?? 0) === 0;
  const tableMissing = Boolean(error);

  return (
    <main className="min-h-dvh bg-brand-950 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Menu admin
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {BUSINESS.name}
              {user?.email ? ` · signed in as ${user.email}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              View site
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </header>

        {tableMissing && (
          <Banner>
            The <code>products</code> table doesn&apos;t exist yet. Run the SQL in{" "}
            <code>supabase/schema.sql</code> in your Supabase SQL editor, then
            reload this page.
          </Banner>
        )}

        {needsSync && !tableMissing && (
          <Banner>
            The table is empty. Hit <strong>Sync from menu file</strong> below to
            load all {MENU.flatMap((c) => c.items).length} items.
          </Banner>
        )}

        <AdminTable menu={menu} />
      </div>
    </main>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 flex items-start gap-2 rounded-2xl bg-accent-400/20 p-4 text-sm leading-relaxed text-white ring-1 ring-accent-500/40">
      <AlertCircle
        className="mt-0.5 size-4 shrink-0 text-accent-400"
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  );
}

function NotConfigured() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-950 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-cream p-8">
        <h1 className="font-display text-2xl font-bold text-ink">
          Admin not set up yet
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          This page needs a free Supabase project. Follow{" "}
          <strong>step 7 of the README</strong> — about ten minutes, done once.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          Until then, edit sold-out items and prices directly in{" "}
          <code className="rounded bg-brand-50 px-1 text-brand-700">
            lib/menu.ts
          </code>
          . The public site works exactly as it does now.
        </p>
        <Link
          href="/"
          className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          Back to the site
        </Link>
      </div>
    </main>
  );
}
