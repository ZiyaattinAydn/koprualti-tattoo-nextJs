import { requireStudio } from "@/lib/studio/session";
import { AuthForm } from "@/components/artist-studio/AuthForm";
export default async function Page() {
  await requireStudio();
  return <AuthForm ready passwordMode />;
}
