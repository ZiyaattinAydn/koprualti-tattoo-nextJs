import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import { publishedArtists } from "@/lib/studio/public";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.SITE_URL) return [];
  const routes = [
    "",
    "about",
    "ataturk",
    "portfolio",
    "artists",
    "studios",
    "studios/alsancak",
    "studios/karsiyaka",
    "services",
    "services/tattoo",
    "services/piercing",
    "services/cover-up",
    "appointment",
    ...(await publishedArtists()).map((a) => `artists/${a.slug}`),
  ];
  return routes.map((route) => ({
    url: new URL(`/${route}${route ? "/" : ""}`, process.env.SITE_URL).href,
  }));
}
