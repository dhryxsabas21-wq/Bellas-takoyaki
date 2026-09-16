"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null };

export async function signIn(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Supabase isn't set up yet. See the README, step 7." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Don't echo Supabase's wording — it leaks whether an account exists.
    return { error: "That email and password don't match. Try again." };
  }

  // Only allow same-origin paths, so ?next= can't be used to bounce staff
  // off to another site.
  redirect(next.startsWith("/") ? next : "/admin");
}
