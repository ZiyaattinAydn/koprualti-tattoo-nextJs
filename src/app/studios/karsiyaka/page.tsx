import { StudioIntro } from "@/components/StudioIntro";
import { getStudio } from "@/data/studios";
export const metadata = { title: "Karşıyaka" };
export default function Page() {
  return <StudioIntro studio={getStudio("karsiyaka")} />;
}
