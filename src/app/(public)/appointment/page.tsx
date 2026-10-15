import {AppointmentPage} from "@/components/AppointmentPage";
import {publishedArtists} from "@/lib/studio/public";
export const metadata={title:"Randevu"};
export const dynamic="force-dynamic";
export default async function Page(){const artists=await publishedArtists();return <AppointmentPage roster={artists.map(a=>({id:a.artist_id,slug:a.slug,name:a.profile.display_name,branch:a.profile.branch}))}/>;}
