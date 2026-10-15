import { supabaseConfig } from "@/lib/supabase/config";
import { AuthForm } from "@/components/artist-studio/AuthForm";
export default function Page() {
  return <AuthForm ready={!!supabaseConfig()} />;
}
