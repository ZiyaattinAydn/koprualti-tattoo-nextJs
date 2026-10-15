import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";
import type { Account } from "./model";
export const studioSession = cache(async () => {
  if (!supabaseConfig()) return null;
  const db = await serverClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) return null;
  const { data: account } = await db
    .from("artist_accounts")
    .select("id,auth_user_id,slug,display_name,branch,role,is_active")
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .single();
  return account ? { db, user, account: account as Account } : null;
});
export async function requireStudio() {
  const session = await studioSession();
  if (!session) redirect("/artist-studio/login/");
  return session;
}
