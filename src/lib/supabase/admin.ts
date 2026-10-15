import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config";
export function adminClient() {
  const c = supabaseConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!c || !key) throw new Error("Sunucu bağlantısı henüz yapılandırılmadı.");
  return createClient(c.url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export function siteUrl() {
  const value = process.env.SITE_URL;
  if (!value) throw new Error("SITE_URL yapılandırılmadı.");
  const url = new URL(value);
  if (url.protocol !== "https:" && url.hostname !== "localhost")
    throw new Error("HTTPS site adresi gerekli.");
  return url.origin;
}
