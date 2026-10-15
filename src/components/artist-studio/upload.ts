"use client";
import {browserClient} from "@/lib/supabase/client";
import {prepareImage} from "@/lib/studio/image";
export async function uploadImage(file:File,artistId:string,folder:"profile"|"covers"|"portfolio"){
 const blob=await prepareImage(file),path=`artists/${artistId}/${folder}/${crypto.randomUUID()}.webp`,db=browserClient();
 const {error}=await db.storage.from("artist-media").upload(path,blob,{contentType:"image/webp",upsert:false,cacheControl:"3600"});if(error)throw new Error("Yüklenemedi. Bağlantını kontrol edip tekrar dene.");
 const {data,error:se}=await db.storage.from("artist-media").createSignedUrl(path,3600);if(se)throw new Error("Önizleme alınamadı. Tekrar dene.");return {path,url:data.signedUrl};
}
