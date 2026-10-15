import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "./config";
export async function serverClient() {
  const config = supabaseConfig();
  if (!config) throw new Error("Studio bağlantısı henüz yapılandırılmadı.");
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(items) {
        try {
          items.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* Server components cannot set cookies; proxy refreshes sessions. */
        }
      },
    },
  });
}
