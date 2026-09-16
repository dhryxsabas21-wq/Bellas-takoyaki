/**
 * Supabase is optional. Until both env vars are set, every Supabase code path
 * short-circuits and the site runs on the static MENU exactly as it did in
 * Phase 1 — nothing breaks, nothing 500s.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;
