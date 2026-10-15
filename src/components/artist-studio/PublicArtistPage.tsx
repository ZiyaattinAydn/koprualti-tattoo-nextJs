import { notFound } from "next/navigation";
import { publishedArtists, mediaUrls } from "@/lib/studio/public";
import { ArtistProfile } from "./ArtistProfile";
export async function artistMetadata(slug: string) {
  const artist = (await publishedArtists()).find((a) => a.slug === slug);
  return {
    title: artist?.profile.display_name ?? "Sanatçı",
    description: artist?.profile.bio.slice(0, 160),
  };
}
export async function PublicArtistPage({ slug }: { slug: string }) {
  const artist = (await publishedArtists()).find((a) => a.slug === slug);
  if (!artist) notFound();
  const urls = await mediaUrls([
    artist.profile.profile_image,
    artist.profile.cover_image,
    ...artist.works.map((w) => w.storage_path),
  ]);
  return (
    <main>
      <ArtistProfile
        profile={artist.profile}
        works={artist.works}
        branch={artist.profile.branch}
        urls={urls}
      />
    </main>
  );
}
