import { requireStudio } from "@/lib/studio/session";
import { loadDraft } from "./actions";
import { StudioWorkspace } from "@/components/artist-studio/StudioWorkspace";
export default async function Page() {
  const { account } = await requireStudio();
  const result = await loadDraft();
  return <StudioWorkspace account={account} initial={result} />;
}
