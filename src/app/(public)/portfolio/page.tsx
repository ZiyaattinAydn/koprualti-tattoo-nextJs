import {PortfolioPage} from "@/components/PortfolioPage";
import {publishedArtists,mediaUrls} from "@/lib/studio/public";
export const metadata={title:"Portfolyo"};
export const dynamic="force-dynamic";
export default async function Page(){const artists=await publishedArtists();const urls=await mediaUrls(artists.flatMap(a=>a.works.map(w=>w.storage_path)));return <PortfolioPage roster={artists.map(a=>({slug:a.slug,name:a.profile.display_name}))} published={artists.flatMap(a=>a.works.filter(w=>urls[w.storage_path]).map(w=>({src:urls[w.storage_path],title:w.title||a.profile.display_name,description:w.description,artist:a.slug,artistName:a.profile.display_name,types:["tattoo"]})))}/>;}
