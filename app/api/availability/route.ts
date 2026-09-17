import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Current sold-out state as { itemId: available }.
 *
 * Exists so the browser can check availability without shipping the Supabase
 * SDK to every customer — importing it client-side added ~70 kB to the page,
 * which is real money on mobile data.
 *
 * Edge-cached for 5 seconds: a customer is never more than 5s behind on a
 * sold-out item, and the database sees at most ~12 requests a minute no matter
 * how much traffic arrives.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const empty = NextResponse.json(
    {},
    { headers: { "Cache-Control": "no-store" } }
  );

  try {
    const supabase = createPublicClient();
    if (!supabase) return empty;

    const { data, error } = await supabase
      .from("products")
      .select("id, available");

    if (error || !data) return empty;

    return NextResponse.json(
      Object.fromEntries(data.map((r) => [r.id as string, Boolean(r.available)])),
      {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
        },
      }
    );
  } catch {
    // Never surface an error here — the page falls back to what it rendered.
    return empty;
  }
}
