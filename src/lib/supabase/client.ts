"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "./config";
export function browserClient() {
  const c = supabaseConfig();
  if (!c) throw new Error("Studio bağlantısı henüz yapılandırılmadı.");
  return createBrowserClient(c.url, c.key);
}
