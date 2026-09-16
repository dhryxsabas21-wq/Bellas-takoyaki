"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { productRowsFromCode } from "@/lib/menu-server";

export type ActionResult = { ok: boolean; message: string };

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

  const { error } = await supabase
    .from("products")
    .update({ available })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return {
    ok: true,
    message: available ? "Back on the menu." : "Marked sold out.",
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

export async function signOut() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/login");
}
