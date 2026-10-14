import Link from "next/link";
import { studios, type Studio } from "@/data/studios";
import { BranchDiscovery } from "./BranchDiscovery";
import { BranchExploration } from "./BranchExploration";
import { BranchMotion } from "./BranchMotion";
import { BranchAtmosphere } from "./BranchAtmosphere";
import styles from "./BranchExplorer.module.css";

export function StudioIntro({ studio }: { studio: Studio }) {
  const other = studios.find((item) => item.slug !== studio.slug)!;
  const appointment = `/appointment/?branch=${studio.slug}`;
  return (
    <main className={styles.explorer} data-studio={studio.slug}>
      <BranchMotion slug={studio.slug} />
      <BranchDiscovery
        slug={studio.slug}
        name={studio.name}
        number={studio.number}
      />
      <section
        data-scroll-stop
        className={styles.branchHero}
        aria-labelledby="branch-title"
      >
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
            <span className={styles.status}>DURUM — AKTİF</span>
          </div>
          <div className={styles.heroTitle}>
            <span className={styles.meta}>
              ŞUBE {studio.number} / KÖPRÜALTI
            </span>
            <h1 id="branch-title">{studio.name}</h1>
            <p>
              {studio.district.toLocaleUpperCase("tr-TR")} /{" "}
              {studio.city.toLocaleUpperCase("tr-TR")}
            </p>
          </div>
          <div className={styles.heroBottom}>
            <a href="#explore">MEKÂNI KEŞFET ↓</a>
            <span>STÜDYO SEÇKİSİ / TEMSİLİ GÖRSEL</span>
          </div>
        </div>
      </section>
      <div className={styles.shell}>
        <p className={styles.selectionNote}>
          STÜDYO SEÇKİSİ / Bu sayfadaki mevcut görseller Köprüaltı atmosferini
          temsil eder. Şubeye özel fotoğraflar geldikçe seçki güncellenecek.
        </p>
      </div>
      <section
        id="explore"
        className={styles.exploreSection}
        aria-labelledby="explore-title"
      >
        <BranchExploration studio={studio} />
      </section>
      <div className={styles.shell}>
        <section
          id="artists"
          data-scroll-stop="long"
          className={styles.artistsSection}
          aria-labelledby="artists-title"
        >
          <BranchAtmosphere variant="artists" background />
          <div data-branch-reveal className={styles.sectionHeading}>
            <div>
              <span className={styles.meta}>02 / ŞUBE SANATÇILARI</span>
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
                data-branch-reveal
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
                    SANATÇI {String(i + 1).padStart(2, "0")} /{" "}
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
          data-scroll-stop="long"
          className={styles.archiveSection}
          aria-labelledby="archive-title"
        >
          <BranchAtmosphere variant="archive" background />
          <div data-branch-reveal className={styles.sectionHeading}>
            <div>
              <span className={styles.meta}>03 / KÖPRÜALTI ARŞİVİ</span>
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
              <figure
                data-branch-reveal
                key={image.src}
                className={styles.archiveEntry}
              >
                <button
                  type="button"
                  className={styles.imageButton}
                  data-lightbox-image
                  data-full={image.src}
                  data-title={image.caption}
                  data-type="TARİH BİLİNMİYOR / KÖPRÜALTI ARŞİVİ"
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
                  <span>ARŞİV KAYDI / {String(i + 1).padStart(2, "0")}</span>
                  <strong>{image.caption}</strong>
                  <span>TARİH BİLİNMİYOR / TEMSİLİ SEÇKİ</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section
          id="story"
          data-scroll-stop
          className={styles.storySection}
          aria-labelledby="story-title"
        >
          <BranchAtmosphere variant="story" background />
          <span data-branch-reveal className={styles.meta}>
            04 / HİKÂYE
          </span>
          <div data-branch-reveal>
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
          data-scroll-stop
          className={styles.addressSection}
          aria-labelledby="location-title"
        >
          <BranchAtmosphere variant="location" background />
          <div data-branch-reveal>
            <span className={styles.meta}>05 / KONUM BİLGİSİ</span>
            <h2 id="location-title">Bizi bul.</h2>
            <p>
              Çizgiye giden yol
              <br />
              buradan geçiyor.
            </p>
          </div>
          <div data-branch-reveal className={styles.addressPanel}>
            <div className={styles.addressPanelTop}>
              <span>ŞUBE {studio.number}</span>
              <span className={styles.status}>AKTİF</span>
            </div>
            <dl>
              <div>
                <dt>İLÇE</dt>
                <dd>{studio.district}</dd>
              </div>
              <div>
                <dt>ŞEHİR</dt>
                <dd>{studio.city}</dd>
              </div>
              <div className={styles.addressRow}>
                <dt>ADRES</dt>
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
              YOL TARİFİ / Google Haritalar’da açılır.
            </span>
          </div>
        </section>
        <section
          id="booking"
          data-scroll-stop
          className={styles.bookingSection}
          aria-labelledby="booking-title"
        >
          <BranchAtmosphere variant="booking" background />
          <div data-branch-reveal>
            <span className={styles.meta}>06 / SIRADAKİ ADIM</span>
            <h2 id="booking-title">Sıradaki iz senin.</h2>
            <p>{studio.name} şubesi için fikrini paylaş.</p>
          </div>
          <Link
            href={appointment}
            data-branch-reveal
            className={styles.primaryCta}
          >
            RANDEVU AL <span aria-hidden="true">↗</span>
          </Link>
        </section>
        <div className={styles.otherLocation}>
          <span className={styles.meta}>DİĞER YAKAYI KEŞFET</span>
          <Link href={`/studios/${other.slug}/`} data-no-transition>
            ŞUBE {other.number} / {other.name} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/studios/">← Tüm lokasyonlar</Link>
        </div>
      </div>
    </main>
  );
}
