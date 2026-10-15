import {StudioIntro} from "@/components/StudioIntro";
import {publishedStudios} from "@/lib/studio/public";
export const metadata={title:"Karşıyaka"};
export const dynamic="force-dynamic";
export default async function Page(){const studio=(await publishedStudios()).find(s=>s.slug==="karsiyaka")!;return <StudioIntro studio={studio}/>;}
