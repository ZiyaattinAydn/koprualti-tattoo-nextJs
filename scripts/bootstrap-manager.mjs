// One-time bootstrap. Credentials come only from the runtime environment.
import { createClient } from "@supabase/supabase-js";
const {
  NEXT_PUBLIC_SUPABASE_URL: url,
  SUPABASE_SERVICE_ROLE_KEY: key,
  DOKTOR_EMAIL: email,
  SITE_URL: site,
} = process.env;
if (!url || !key || !email || !site)
  throw new Error(
    "Required env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DOKTOR_EMAIL, SITE_URL",
  );
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: artist, error } = await db
  .from("artist_accounts")
  .select("id,auth_user_id,role")
  .eq("slug", "doktor")
  .single();
if (error || !artist || artist.role !== "manager")
  throw new Error("Run and verify the Artist Studio migration first.");
if (artist.auth_user_id)
  throw new Error(
    "Doktor is already linked. Bootstrap will not replace that identity.",
  );
// For recovery of an already-created invitation, explicitly provide its user ID.
let userId = process.env.DOKTOR_EXISTING_AUTH_USER_ID;
if (userId) {
  const { data, error } = await db.auth.admin.getUserById(userId);
  if (error || data.user?.email?.toLowerCase() !== email.toLowerCase())
    throw new Error("Existing identity does not match DOKTOR_EMAIL.");
} else {
  const { data, error } = await db.auth.admin.inviteUserByEmail(email, {
    redirectTo: new URL("/artist-studio/auth/callback/", site).href,
  });
  if (error || !data.user)
    throw new Error("Invitation failed. Verify SMTP delivery and retry.");
  userId = data.user.id;
}
const { data: linked, error: linkError } = await db
  .from("artist_accounts")
  .update({ auth_user_id: userId })
  .eq("id", artist.id)
  .is("auth_user_id", null)
  .select("id")
  .single();
if (linkError || !linked)
  throw new Error(
    "Identity created but linking failed. Retry with DOKTOR_EXISTING_AUTH_USER_ID; no auth user was deleted.",
  );
console.log(
  "Doktor manager identity linked. Verify the invitation email and set a password.",
);
