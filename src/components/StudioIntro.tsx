import Link from "next/link";
import type { Studio } from "@/data/studios";

export function StudioIntro({ studio }: { studio: Studio }) {
  return (
    <div className={`branch-page branch-page--${studio.slug}`}>
      <main data-studio={studio.slug}>
        <section className="branch-intro">
          <div className="container branch-intro-grid">
            <div className="branch-intro-copy">
              <div className="crumb">
                <Link href="/studios/">ŞUBELER</Link> /{" "}
                {studio.name.toLocaleUpperCase("tr-TR")}
              </div>
              <span className="branch-kicker">
                KÖPRÜALTI / {studio.district.toLocaleUpperCase("tr-TR")}
              </span>
              <h1>{studio.name}</h1>
              <p className="branch-lead">{studio.intro}</p>
              <address>{studio.address}</address>
              <div className="branch-actions">
                <a
                  className="branch-action branch-action--filled"
                  href={studio.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Yol Tarifi ↗
                </a>
                <Link
                  className="branch-action branch-action--outline"
                  href={`/appointment/?branch=${encodeURIComponent(studio.name)}`}
                >
                  Randevu Al →
                </Link>
              </div>
              <Link className="branch-back" href="/studios/">
                ← Şubelere dön
              </Link>
            </div>
            <figure className="branch-intro-photo">
              <img
                src={studio.photo}
                alt={studio.photoAlt}
                data-lightbox-image
                role="button"
                tabIndex={0}
                aria-label={`${studio.name} stüdyo fotoğrafını büyüt`}
                data-title={`${studio.name} / stüdyo`}
                data-type="Stüdyo arşivi"
              />
              <figcaption>
                {studio.name.toLocaleUpperCase("tr-TR")} / STÜDYO ARŞİVİ
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="branch-future">
          <div className="container">
            <span aria-hidden="true">✳</span>
            <div>
              <div className="eyebrow">SONRAKİ DURAK</div>
              <h2>Bu hikâye büyüyecek.</h2>
              <p>
                Bu şube yakında daha fazla fotoğraf, stüdyodan ayrıntılar ve
                keşfedilecek köşelerle genişletilecek.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
