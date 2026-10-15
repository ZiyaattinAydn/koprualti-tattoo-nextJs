import Link from "next/link";
import { branchNames } from "@/data/artists";
import type { Profile, Work } from "@/lib/studio/model";
import s from "./Profile.module.css";
export function ArtistProfile({
  profile,
  works,
  branch,
  urls,
  preview = false,
}: {
  profile: Profile;
  works: Work[];
  branch: string;
  urls: Record<string, string>;
  preview?: boolean;
}) {
  const image = (path: string) =>
    urls[path] || (path.startsWith("/assets/") ? path : undefined);
  const ordered = [...works].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order,
  );
  return (
    <article
      className={`${s.profile} ${s[profile.theme]}`}
      data-theme={profile.theme}
    >
      <div className={s.hero}>
        {image(profile.cover_image) && (
          <img className={s.cover} src={image(profile.cover_image)} alt="" />
        )}
        <div className={s.heroContent}>
          <span className={s.eyebrow}>
            KÖPRÜALTI / {branchNames[branch] ?? branch}
          </span>
          <div className={s.identity}>
            {image(profile.profile_image) ? (
              <img
                className={s.portrait}
                src={image(profile.profile_image)}
                alt={profile.display_name}
                width={220}
                height={260}
              />
            ) : (
              <div className={s.monogram} aria-hidden="true">
                {profile.display_name.slice(0, 1)}
              </div>
            )}
            <div>
              <p className={s.nickname}>
                {profile.nickname || "TATTOO ARTIST"}
              </p>
              <h1>{profile.display_name}</h1>
              <span className={s.stamp}>
                {profile.theme.toUpperCase()} / K6
              </span>
            </div>
          </div>
          <p className={s.bio}>{profile.bio || "Biyografi yakında."}</p>
          <div className={s.tags}>
            {[...profile.specialties, ...profile.styles].map((tag, i) => (
              <span key={`${tag}-${i}`}>{tag}</span>
            ))}
          </div>
          <div className={s.actions}>
            {preview ? (
              <span>Randevu talebi ↗</span>
            ) : (
              <Link href={profile.appointment_url || "/appointment/"}>
                Randevu talebi ↗
              </Link>
            )}
            {profile.instagram_url &&
              (preview ? (
                <span>Instagram ↗</span>
              ) : (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram ↗
                </a>
              ))}
          </div>
        </div>
      </div>
      <section className={s.works}>
        <div className={s.sectionHead}>
          <h2>
            Çizginin
            <br />
            <em>arkasında.</em>
          </h2>
          <span>{String(works.length).padStart(2, "0")} ÇALIŞMA / SEÇKİ</span>
        </div>
        {!works.length ? (
          <p className={s.empty}>Seçili çalışmalar yakında burada.</p>
        ) : (
          <div className={s.grid}>
            {ordered.map((work, i) => (
              <figure
                key={work.id}
                className={work.featured ? s.featured : undefined}
              >
                {image(work.storage_path) && (
                  <img
                    src={image(work.storage_path)}
                    alt={
                      work.title || `${profile.display_name} çalışması ${i + 1}`
                    }
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={1000}
                  />
                )}
                <figcaption>
                  <span>
                    {work.featured ? "★ ÖNE ÇIKAN" : "PORTFOLIO"} / {work.style}
                  </span>
                  <h3>{work.title}</h3>
                  {work.description && <p>{work.description}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
