"use client";

import { useEffect, useRef, useState } from "react";
import type { BranchCategory, Studio } from "@/data/studios";
import styles from "./BranchExplorer.module.css";

const steps: {
  category: BranchCategory;
  title: string;
  text: string;
  pending: string;
}[] = [
  {
    category: "exterior",
    title: "Sokaktan başla.",
    text: "Her keşif bir adresle başlar. Şehrin akışından Köprüaltı’nın kapısına.",
    pending: "Dış cephe fotoğrafı yakında.",
  },
  {
    category: "entrance",
    title: "İçeriye bir adım.",
    text: "Eşiğin ötesinde çizgilerin, mürekkebin ve insanın dünyası var.",
    pending: "Giriş fotoğrafı yakında.",
  },
  {
    category: "interior",
    title: "Duvarları oku.",
    text: "Çizimler, çerçeveler, objeler. Bir stüdyonun karakteri detaylarında saklı.",
    pending: "İç mekân fotoğrafı yakında.",
  },
  {
    category: "workspace",
    title: "İzin başladığı yer.",
    text: "Fikirlerin çizgiye dönüştüğü çalışma alanı. Her iş, bir konuşmayla başlar.",
    pending: "Çalışma alanı fotoğrafı yakında.",
  },
  {
    category: "details",
    title: "Biraz daha yakından.",
    text: "İlk bakışta görünmeyen küçük parçalar. Mekânın kendine özgü dili.",
    pending: "Detay fotoğrafı yakında.",
  },
];

export function BranchExploration({ studio }: { studio: Studio }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    setActive(0);
    if (!root.current || !("IntersectionObserver" in window)) return;
    // Observe a small marker in each chapter. Only the index changes; image
    // dimensions, DOM nodes and scroll position remain untouched.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.chapter));
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );
    root.current
      .querySelectorAll("[data-chapter]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [studio.slug]);

  return (
    <div ref={root} className={styles.exploration}>
      <aside className={styles.exploreIndex}>
        <span className={styles.meta}>01 / SPACE EXPLORATION</span>
        <h2 id="explore-title">
          Mekânı
          <br />
          keşfet.
        </h2>
        <p>
          Bir sokak, bir kapı,
          <br />
          içeride başka bir dünya.
        </p>
        <nav aria-label="Mekân keşif adımları">
          {steps.map((step, i) => (
            <a
              key={step.category}
              href={`#space-${step.category}`}
              aria-current={active === i ? "step" : undefined}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {step.category.toUpperCase()}
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </nav>
        <span className={styles.indexFoot}>
          LOCATION {studio.number} / {String(active + 1).padStart(2, "0")} OF 05
        </span>
      </aside>
      <div className={styles.chapters}>
        {steps.map((step, i) => {
          const image = studio.images[step.category][0];
          return (
            <article
              key={step.category}
              id={`space-${step.category}`}
              className={styles.chapter}
            >
              <span
                className={styles.chapterMarker}
                data-chapter={i}
                aria-hidden="true"
              />
              <div className={styles.chapterHead}>
                <span className={styles.meta}>
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {step.category.toUpperCase()}
                </span>
                <span>{image ? "STUDIO SELECTION" : "PHOTO PENDING"}</span>
              </div>
              {image ? (
                <figure className={styles.chapterPhoto}>
                  <button
                    type="button"
                    className={styles.imageButton}
                    data-lightbox-image
                    data-full={image.src}
                    data-title={image.caption}
                    data-type="Köprüaltı / geçici görsel seçkisi"
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
                    {image.caption}
                    {image.provisional && <span>TEMSİLİ SEÇKİ</span>}
                  </figcaption>
                </figure>
              ) : (
                <div className={styles.pendingPhoto}>
                  <span aria-hidden="true" className={styles.pendingNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className={styles.meta}>
                      {studio.district} / {studio.city}
                    </span>
                    <strong>{step.title}</strong>
                    <p>{step.pending}</p>
                  </div>
                </div>
              )}
              <div className={styles.chapterCopy}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
