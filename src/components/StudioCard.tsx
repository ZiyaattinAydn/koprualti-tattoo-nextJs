import Link from "next/link";
import type { Studio } from "@/data/studios";
export function StudioCard({
  studio,
  number,
}: {
  studio: Studio;
  number: number;
}) {
  const heading = `branch-card-${studio.slug}`;
  return (
    <article
      className={`branch-card branch-card--${studio.slug} reveal`}
      aria-labelledby={heading}
    >
      <div className="branch-card-image">
        <img
          src={studio.photo}
          alt={studio.photoAlt}
          loading="lazy"
          decoding="async"
          data-lightbox-image
          role="button"
          tabIndex={0}
          aria-label={`${studio.name} stüdyo fotoğrafını büyüt`}
          data-title={`${studio.name} / stüdyo`}
          data-type="Stüdyo arşivi"
        />
        <span className="branch-card-number" aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
      </div>
      <div className="branch-card-content">
        <span className="branch-kicker">KÖPRÜALTI / İZMİR</span>
        <h2 id={heading}>{studio.name}</h2>
        <p className="branch-location">{studio.district}</p>
        <p className="branch-description">{studio.intro}</p>
        <address>{studio.address}</address>
        <div className="branch-actions">
          <a
            className="branch-action branch-action--filled"
            href={studio.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${studio.name} yol tarifini Google Haritalar'da aç`}
          >
            Yol Tarifi ↗
          </a>
          <Link
            className="branch-action branch-action--outline"
            href={`/studios/${studio.slug}/`}
          >
            Şubeyi Tanı →
          </Link>
        </div>
      </div>
    </article>
  );
}
