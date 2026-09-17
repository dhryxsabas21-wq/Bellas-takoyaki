"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { productRowsFromCode } from "@/lib/menu-server";

export type ActionResult = {
  ok: boolean;
  message: string;
  /** What the database actually holds after the write. */
  available?: boolean;
};

/**
 * Every action re-checks the session server-side. Middleware protects the
 * route, but a Server Action is its own endpoint and must guard itself.
 */
async function requireStaff() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return supabase;
}

export async function setAvailability(
  id: string,
  available: boolean
): Promise<ActionResult> {
  const supabase = await requireStaff();
  if (!supabase) return { ok: false, message: "Not signed in." };

  // Read the row back so the UI reflects what was actually stored, not what we
  // hoped was stored. A silent no-op (wrong id, RLS block) is otherwise
  // indistinguishable from success, which is how a toggle appears to "not work".
  const { data, error } = await supabase
    .from("products")
    .update({ available })
    .eq("id", id)
    .select("id, available");

  if (error) return { ok: false, message: error.message };

  if (!data?.length) {
    return {
      ok: false,
      message: `"${id}" isn't in the database. Press "Sync from menu file".`,
    };
  }

  const saved = Boolean(data[0].available);

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    ok: true,
    available: saved,
    message: saved
      ? "Back on the menu — customers can order it again."
      : "Marked sold out — customers can't order it now.",
  };
}

export async function setPrices(
  id: string,
  basePrice: number,
  variantPrices: Record<string, number> | null
): Promise<ActionResult> {
  const supabase = await requireStaff();
  if (!supabase) return { ok: false, message: "Not signed in." };

  if (!Number.isInteger(basePrice) || basePrice <= 0) {
    return { ok: false, message: "Price must be a whole number above zero." };
  }
  if (
    variantPrices &&
    Object.values(variantPrices).some((p) => !Number.isInteger(p) || p <= 0)
  ) {
    return { ok: false, message: "Every size needs a whole number above zero." };
  }

  const { error } = await supabase
    .from("products")
    .update({ base_price: basePrice, variant_prices: variantPrices })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: "Prices saved." };
}

/**
 * Pushes every item from lib/menu.ts into the products table. Run once after
 * setup, and again whenever you add an item in code. Existing availability and
 * prices are overwritten by what's in the file — that's the point: code is the
 * source of truth for structure.
 */
export async function syncFromCode(): Promise<ActionResult> {
  const supabase = await requireStaff();
  if (!supabase) return { ok: false, message: "Not signed in." };

  const rows = productRowsFromCode();
  const { error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "id" });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: `Synced ${rows.length} items from the menu file.` };
}

/**
 * Force the public site to rebuild its menu from the database right now.
 *
 * Toggling availability already calls revalidatePath, so this is a safety net:
 * if a customer ever reports seeing an old price or a sold-out item still on
 * the menu, one tap here guarantees a fresh page for everyone.
 */
export async function pushToCustomers(): Promise<ActionResult> {
  const supabase = await requireStaff();
  if (!supabase) return { ok: false, message: "Not signed in." };

  // Confirm the database is actually reachable before claiming success —
  // otherwise we'd tell staff it worked when the menu never reloaded.
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  if (error) return { ok: false, message: `Database error: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    ok: true,
    message: `Live menu refreshed — ${count ?? 0} items pushed to customers.`,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/login");
}
