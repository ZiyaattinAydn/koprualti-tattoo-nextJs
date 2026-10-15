import {StudiosPage} from "@/components/StudiosPage";
import {publishedStudios} from "@/lib/studio/public";
export const metadata={title:"Şubeler"};
export const dynamic="force-dynamic";
export default async function Page(){return <StudiosPage items={await publishedStudios()}/>;}
