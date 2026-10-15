import {PublicArtistPage,artistMetadata} from "@/components/artist-studio/PublicArtistPage";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){return artistMetadata((await params).slug);}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <PublicArtistPage slug={(await params).slug}/>;}
