import {ArtistsPage} from "@/components/ArtistsPage";
import {publishedArtists,mediaUrls} from "@/lib/studio/public";
export const metadata={title:"Sanatçılar"};
export const dynamic="force-dynamic";
export default async function Page(){const artists=await publishedArtists();const urls=await mediaUrls(artists.map(a=>a.profile.profile_image));return <ArtistsPage artists={artists} urls={urls}/>;}
