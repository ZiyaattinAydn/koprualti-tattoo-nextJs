import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";
import { artistRoster } from "@/data/artists";
import { blankProfile, type LiveProfile } from "./model";
export const publishedArtists = cache(async (): Promise<LiveProfile[]> => {
  const c = supabaseConfig();
  if (!c)
    return artistRoster.map((a) => ({
      artist_id: a.id,
      slug: a.slug,
      profile: {
        ...blankProfile(a.name),
        branch: a.branch,
        profile_image: a.image,
        bio:
          a.slug === "doktor"
            ? "Köprüaltı’nın kurucusu Doktor, stüdyoda dövme çalışmalarına devam ediyor."
            : "Biyografi ve seçili çalışmalar yakında.",
        appointment_url: `/appointment/?artist=${a.slug}`,
        theme: a.slug === "doktor" ? "chaos" : "archive",
      },
      works: [],
      published_at: "",
    }));
  const db = createClient(c.url, c.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await db
    .from("artist_public_profiles")
    .select("artist_id,slug,profile,works,published_at")
    .eq("is_active", true)
    .order("published_at");
  if (error) throw new Error("Sanatçı profilleri şu anda yüklenemiyor.");
  return (data ?? []) as LiveProfile[];
});
export async function mediaUrls(
  paths: string[],
  draft = false,
): Promise<Record<string, string>> {
  const c = supabaseConfig();
  const result: Record<string, string> = {};
  for (const p of paths) if (p.startsWith("/assets/")) result[p] = p;
  const remote = [...new Set(paths.filter((p) => p.startsWith("artists/")))];
  if (!c || !remote.length) return result;
  const db = draft
    ? await (await import("@/lib/supabase/server")).serverClient()
    : createClient(c.url, c.key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
  const { data, error } = await db.storage
    .from("artist-media")
    .createSignedUrls(remote, 3600);
  if (error) throw new Error("Görseller yüklenemedi.");
  for (const item of data ?? [])
    if (item.path && item.signedUrl) result[item.path] = item.signedUrl;
  return result;
}

export async function publishedStudios() {
  const { studios } = await import("@/data/studios");
  const artists = await publishedArtists();
  const urls = await mediaUrls(artists.map((a) => a.profile.profile_image));
  return studios.map((studio) => ({
    ...studio,
    artists: artists
      .filter((a) => a.profile.branch === studio.slug)
      .map((a) => ({
        name: a.profile.display_name,
        href: `/artists/${a.slug}/`,
        image: urls[a.profile.profile_image]
          ? {
              src: urls[a.profile.profile_image],
              alt: a.profile.display_name,
              width: 900,
              height: 1200,
              caption: a.profile.display_name,
              provisional: false,
            }
          : undefined,
      })),
  }));
}
