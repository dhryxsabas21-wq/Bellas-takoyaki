import "server-only";

import { MENU, type Category, type MenuItem } from "./menu";
import { createClient } from "./supabase/server";

/**
 * One row per menu item. Only the fields staff can actually change live here —
 * names, descriptions, photos and badges stay in lib/menu.ts, where they belong
 * in version control.
 */
export type ProductRow = {
  id: string;
  name: string;
  available: boolean;
  base_price: number;
  /** { "5pcs": 95, "8pcs": 135 } — keyed by Variant.id. */
  variant_prices: Record<string, number> | null;
};

/** Applies Supabase overrides onto the static menu. Structure always wins. */
function applyOverrides(menu: Category[], rows: ProductRow[]): Category[] {
  const byId = new Map(rows.map((r) => [r.id, r]));

  return menu.map((category) => ({
    ...category,
    items: category.items.map((item): MenuItem => {
      const row = byId.get(item.id);
      if (!row) return item;

      const variants = item.variants?.map((v) => {
        const price = row.variant_prices?.[v.id];
        return typeof price === "number" && price > 0 ? { ...v, price } : v;
      });

      return {
        ...item,
        available: row.available,
        basePrice: row.base_price > 0 ? row.base_price : item.basePrice,
        ...(variants ? { variants } : {}),
      };
    }),
  }));
}

/**
 * The menu the public site renders.
 *
 * Reads live availability and prices from Supabase, falling back to the static
 * MENU on any failure — not configured, network down, table missing, RLS
 * misconfigured. The storefront must never break because the database did.
 */
export async function getMenu(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return MENU;

    const { data, error } = await supabase
      .from("products")
      .select("id, name, available, base_price, variant_prices");

    if (error || !data?.length) return MENU;

    return applyOverrides(MENU, data as ProductRow[]);
  } catch {
    return MENU;
  }
}

/** Every row the admin table should show, derived from the static menu. */
export function productRowsFromCode(): ProductRow[] {
  return MENU.flatMap((c) => c.items).map((item) => ({
    id: item.id,
    name: item.name,
    available: item.available,
    base_price: item.basePrice,
    variant_prices: item.variants
      ? Object.fromEntries(item.variants.map((v) => [v.id, v.price]))
      : null,
  }));
}
