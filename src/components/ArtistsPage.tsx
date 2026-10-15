import Link from "next/link";
import { branchNames } from "@/data/artists";
import type { LiveProfile } from "@/lib/studio/model";
export function ArtistsPage({
  artists,
  urls,
}: {
  artists: LiveProfile[];
  urls: Record<string, string>;
}) {
  return (
    <div className="artists-page-view">
      <main className="artists-page-v2">
        <section className="pagehero">
          <div className="container">
            <div className="crumb">ANASAYFA / SANATÇILAR</div>
            <h1>İşi yapan insanlar.</h1>
            <p>
              Her çizginin arkasında bir insan var. Köprüaltı sanatçıları ve
              seçili çalışmaları.
            </p>
          </div>
        </section>
        {artists.map((a, i) => (
          <section
            key={a.artist_id}
            id={a.slug}
            className={`artist-spotlight ${a.slug}-spotlight`}
          >
            <div className="wrap artist-spotlight-grid reveal">
              <div
                className={`artist-media ${urls[a.profile.profile_image] ? "artist-media-photo" : "artist-media-placeholder"}`}
              >
                {urls[a.profile.profile_image] ? (
                  <img
                    src={urls[a.profile.profile_image]}
                    alt={`${a.profile.display_name} — Köprüaltı`}
                    loading="lazy"
                  />
                ) : (
                  <div className="artist-profile-sheet">
                    <div className="artist-profile-sheet__inner">
                      <div className="artist-profile-sheet__eyebrow">
                        KÖPRÜALTI / SANATÇI
                      </div>
                      <div className="artist-profile-sheet__mono">
                        {a.profile.display_name.slice(0, 1)}
                      </div>
                      <h3 className="artist-profile-sheet__name">
                        {a.profile.display_name}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
              <div className="artist-copy">
                <div className="eyebrow">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {branchNames[a.profile.branch]}
                </div>
                <h2 className="heritage artist-title">
                  {a.profile.display_name}
                </h2>
                <p className="artist-lead">{a.profile.bio}</p>
                <div className="artist-focus-list">
                  {[...a.profile.specialties, ...a.profile.styles].map(
                    (t, i) => (
                      <span key={`${t}-${i}`}>{t}</span>
                    ),
                  )}
                </div>
                <div className="artist-profile-action">
                  <Link className="btn light" href={`/artists/${a.slug}/`}>
                    Profili gör ↗
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
