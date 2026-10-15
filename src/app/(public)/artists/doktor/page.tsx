import {PublicArtistPage,artistMetadata} from "@/components/artist-studio/PublicArtistPage";
export const dynamic="force-dynamic";
export async function generateMetadata(){return artistMetadata("doktor");}
export default function Page(){return <PublicArtistPage slug="doktor"/>;}
