import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cookie-free client for the PUBLIC menu read.
 *
 * Deliberately not the @supabase/ssr client: that one calls cookies(), which
 * opts the whole page out of static rendering, so every visitor would hit the
 * database and `revalidate` would be silently ignored. The public menu has no
 * user session to read, so it doesn't need cookies — and without them the page
 * caches properly and revalidatePath() from /admin can bust it on demand.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
