import Link from "next/link";
import { studios } from "@/data/studios";
import { BranchAtmosphere } from "./BranchAtmosphere";
import styles from "./BranchExplorer.module.css";

export function StudiosPage() {
  return (
    <main className={styles.explorer} data-branch-explorer>
      <header className={`${styles.shell} ${styles.entryHeader}`}>
        <div className={styles.entryMeta}>
          <span>KÖPRÜALTI / BRANCH EXPLORER</span>
          <span>İZMİR · 02 LOKASYON</span>
        </div>
        <div className={styles.entryTitle}>
          <h1>
            Şehrin iki yakası.
            <br />
            <em>Aynı kültür.</em>
          </h1>
          <p>
            Bir lokasyon seç.
            <br />
            Kapının ardındaki dünyayı keşfet.
          </p>
        </div>
        <BranchAtmosphere />
      </header>
      <section className={styles.locations} aria-label="Köprüaltı lokasyonları">
        {studios.map((studio) => (
          <Link
            key={studio.slug}
            href={`/studios/${studio.slug}/`}
            className={styles.location}
            data-no-transition
            data-location={studio.slug}
          >
            <img
              className={styles.locationImage}
              src={studio.hero.src}
              alt={studio.hero.alt}
              width={studio.hero.width}
              height={studio.hero.height}
              loading={studio.number === "01" ? "eager" : "lazy"}
              decoding="async"
            />
            <div className={styles.locationTop}>
              <span>LOCATION {studio.number}</span>
              <span className={styles.status}>STATUS — ACTIVE</span>
            </div>
            <div className={styles.locationCopy}>
              <span className={styles.meta}>
                {studio.district.toLocaleUpperCase("tr-TR")} / İZMİR
              </span>
              <h2>{studio.name}</h2>
              <div className={styles.locationHud}>
                <span>ACTIVE ARTISTS</span>
                <b>{studio.artists.map((artist) => artist.name).join(" / ")}</b>
              </div>
              <span className={styles.locationAction}>
                LOKASYONU KEŞFET <b aria-hidden="true">↗</b>
              </span>
            </div>
            <span className={styles.locationIndex} aria-hidden="true">
              {studio.number}
            </span>
          </Link>
        ))}
      </section>
      <div className={`${styles.shell} ${styles.entryFoot}`}>
        <span>İKİ ADRES / TEK KÖPRÜALTI</span>
        <p>
          Görseller mevcut stüdyo seçkisinden. Şubelere özel çekimlerle
          güncellenecek.
        </p>
      </div>
    </main>
  );
}
