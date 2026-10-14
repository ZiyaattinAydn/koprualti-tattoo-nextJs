import Link from "next/link";
import { studios, type Studio } from "@/data/studios";
import { BranchDiscovery } from "./BranchDiscovery";
import { BranchExploration } from "./BranchExploration";
import { BranchAtmosphere } from "./BranchAtmosphere";
import styles from "./BranchExplorer.module.css";

const sections = [
  ["explore", "Mekânı Keşfet"],
  ["artists", "Sanatçılar"],
  ["archive", "Arşiv"],
  ["story", "Hikâye"],
  ["location", "Konum"],
  ["booking", "Randevu"],
] as const;

export function StudioIntro({ studio }: { studio: Studio }) {
  const other = studios.find((item) => item.slug !== studio.slug)!;
  const appointment = `/appointment/?branch=${studio.slug}`;
  return (
    <main className={styles.explorer} data-studio={studio.slug}>
      <BranchDiscovery
        slug={studio.slug}
        name={studio.name}
        number={studio.number}
      />
      <section className={styles.branchHero} aria-labelledby="branch-title">
        <img
          className={styles.heroImage}
          src={studio.hero.src}
          alt={studio.hero.alt}
          width={studio.hero.width}
          height={studio.hero.height}
          fetchPriority="high"
          decoding="async"
        />
        <div className={`${styles.shell} ${styles.heroContent}`}>
          <div className={styles.heroTop}>
            <Link href="/studios/">← ŞUBE KEŞİF MODU</Link>
            <span className={styles.status}>STATUS — ACTIVE</span>
          </div>
          <div className={styles.heroTitle}>
            <span className={styles.meta}>
              LOCATION {studio.number} / KÖPRÜALTI
            </span>
            <h1 id="branch-title">{studio.name}</h1>
            <p>
              {studio.district.toLocaleUpperCase("tr-TR")} /{" "}
              {studio.city.toLocaleUpperCase("tr-TR")}
            </p>
          </div>
          <div className={styles.heroBottom}>
            <a href="#explore">MEKÂNI KEŞFET ↓</a>
            <span>STUDIO SELECTION / TEMSİLİ GÖRSEL</span>
          </div>
        </div>
      </section>
      <nav
        className={`${styles.shell} ${styles.sectionNav}`}
        aria-label={`${studio.name} keşif bölümleri`}
      >
        {sections.map(([id, title], i) => (
          <a key={id} href={`#${id}`}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {title}
          </a>
        ))}
      </nav>
      <div className={styles.shell}>
        <p className={styles.selectionNote}>
          STÜDYO SEÇKİSİ / Bu sayfadaki mevcut görseller Köprüaltı atmosferini
          temsil eder. Şubeye özel fotoğraflar geldikçe seçki güncellenecek.
        </p>
        <section
          id="explore"
          className={styles.exploreSection}
          aria-labelledby="explore-title"
        >
          <BranchExploration studio={studio} />
        </section>
        <BranchAtmosphere variant="story" />
        <section
          id="artists"
          className={styles.artistsSection}
          aria-labelledby="artists-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.meta}>02 / ACTIVE ARTISTS</span>
              <h2 id="artists-title">İzi bırakanlar.</h2>
            </div>
            <p>
              {studio.name} / {studio.artists.length} sanatçı
            </p>
          </div>
          <div className={styles.artistList}>
            {studio.artists.map((artist, i) => (
              <Link
                href={artist.href}
                key={artist.name}
                className={styles.artist}
              >
                <div className={styles.artistPhoto}>
                  {artist.image ? (
                    <img
                      src={artist.image.src}
                      alt={artist.image.alt}
                      width={artist.image.width}
                      height={artist.image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.artistPlaceholder}>
                      <span>{artist.name.charAt(0)}</span>
                      <small>PORTRE YAKINDA</small>
                    </div>
                  )}
                </div>
                <div className={styles.artistInfo}>
                  <span className={styles.meta}>
                    ARTIST {String(i + 1).padStart(2, "0")} /{" "}
                    {studio.name.toLocaleUpperCase("tr-TR")}
                  </span>
                  <h3>{artist.name}</h3>
                  <span>
                    SANATÇIYI TANI <b aria-hidden="true">↗</b>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section
          id="archive"
          className={styles.archiveSection}
          aria-labelledby="archive-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.meta}>03 / KÖPRÜALTI ARCHIVE</span>
              <h2 id="archive-title">İzlerin arşivi.</h2>
            </div>
            <p>
              Duvarlar, çizgiler, hatıralar.
              <br />
              Tarihi bilinmeyen bir seçki.
            </p>
          </div>
          <div className={styles.archiveEntries}>
            {studio.images.archive.map((image, i) => (
              <figure key={image.src} className={styles.archiveEntry}>
                <button
                  type="button"
                  className={styles.imageButton}
                  data-lightbox-image
                  data-full={image.src}
                  data-title={image.caption}
                  data-type="DATE UNKNOWN / KÖPRÜALTI ARCHIVE"
                  aria-label={`${image.alt} görselini büyüt`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span aria-hidden="true">↗</span>
                </button>
                <figcaption>
                  <span>ARCHIVE ENTRY / {String(i + 1).padStart(2, "0")}</span>
                  <strong>{image.caption}</strong>
                  <span>DATE UNKNOWN / TEMSİLİ SEÇKİ</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section
          id="story"
          className={styles.storySection}
          aria-labelledby="story-title"
        >
          <span className={styles.meta}>04 / STORY</span>
          <div>
            <h2 id="story-title">
              Aynı ruh.
              <br />
              Başka bir sokak.
            </h2>
            <p>{studio.intro}</p>
            {studio.story.length > 0 && (
              <ol className={styles.timeline}>
                {studio.story.map((entry) => (
                  <li key={entry.id}>
                    <span className={styles.meta}>
                      {entry.label}
                      {entry.date && ` / ${entry.date}`}
                    </span>
                    <p>{entry.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
        <section
          id="location"
          className={styles.addressSection}
          aria-labelledby="location-title"
        >
          <div>
            <span className={styles.meta}>05 / LOCATION DATA</span>
            <h2 id="location-title">Bizi bul.</h2>
            <p>
              Çizgiye giden yol
              <br />
              buradan geçiyor.
            </p>
          </div>
          <div className={styles.addressPanel}>
            <div className={styles.addressPanelTop}>
              <span>LOCATION {studio.number}</span>
              <span className={styles.status}>ACTIVE</span>
            </div>
            <dl>
              <div>
                <dt>DISTRICT</dt>
                <dd>{studio.district}</dd>
              </div>
              <div>
                <dt>CITY</dt>
                <dd>{studio.city}</dd>
              </div>
              <div className={styles.addressRow}>
                <dt>LOCATION</dt>
                <dd>
                  <address>{studio.address}</address>
                </dd>
              </div>
            </dl>
            <a
              href={studio.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.routeCta}
            >
              YOL TARİFİ AL <span aria-hidden="true">↗</span>
            </a>
            <span className={styles.mapNote}>
              ROUTE / Google Haritalar’da açılır.
            </span>
          </div>
        </section>
        <section
          id="booking"
          className={styles.bookingSection}
          aria-labelledby="booking-title"
        >
          <div>
            <span className={styles.meta}>06 / NEXT STEP</span>
            <h2 id="booking-title">Sıradaki iz senin.</h2>
            <p>{studio.name} şubesi için fikrini paylaş.</p>
          </div>
          <Link href={appointment} className={styles.primaryCta}>
            RANDEVU AL <span aria-hidden="true">↗</span>
          </Link>
        </section>
        <div className={styles.otherLocation}>
          <span className={styles.meta}>DİĞER YAKAYI KEŞFET</span>
          <Link href={`/studios/${other.slug}/`} data-no-transition>
            LOCATION {other.number} / {other.name}{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/studios/">← Tüm lokasyonlar</Link>
        </div>
      </div>
    </main>
  );
}
