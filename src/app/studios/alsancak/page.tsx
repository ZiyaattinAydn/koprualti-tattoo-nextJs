import { StudioIntro } from "@/components/StudioIntro";
import { getStudio } from "@/data/studios";
export const metadata = { title: "Alsancak" };
export default function Page() {
  return <StudioIntro studio={getStudio("alsancak")} />;
}
