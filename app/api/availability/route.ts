import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Current sold-out state as { itemId: available }.
 *
 * Exists so the browser can check availability without shipping the Supabase
 * SDK to every customer — importing it client-side added ~70 kB to the page,
 * which is real money on mobile data.
 *
 * Edge-cached for 2 seconds only. The response is ~500 bytes and the query is
 * two columns across eighteen rows, so this is cheap — and the cache still
 * caps the database at ~30 requests a minute however many people are browsing.
 *
 * Deliberately no stale-while-revalidate: serving one stale response to save a
 * round trip is exactly what made sold-out items linger on the menu.
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
        headers: { "Cache-Control": "public, s-maxage=2" },
      }
    );
  } catch {
    // Never surface an error here — the page falls back to what it rendered.
    return empty;
  }
}
