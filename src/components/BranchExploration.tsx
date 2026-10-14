"use client";

import { useEffect, useRef, useState } from "react";
import type { BranchCategory, Studio } from "@/data/studios";
import styles from "./BranchExplorer.module.css";

const steps: {
  category: BranchCategory;
  label: string;
  title: string;
  text: string;
  pending: string;
}[] = [
  {
    category: "exterior",
    label: "Dış Cephe",
    title: "Sokaktan başla.",
    text: "Her keşif bir adresle başlar. Şehrin akışından Köprüaltı’nın kapısına.",
    pending: "Dış cephe fotoğrafı yakında.",
  },
  {
    category: "entrance",
    label: "Giriş",
    title: "İçeriye bir adım.",
    text: "Eşiğin ötesinde çizgilerin, mürekkebin ve insanın dünyası var.",
    pending: "Giriş fotoğrafı yakında.",
  },
  {
    category: "interior",
    label: "İç Mekân",
    title: "Duvarları oku.",
    text: "Çizimler, çerçeveler, objeler. Bir stüdyonun karakteri detaylarında saklı.",
    pending: "İç mekân fotoğrafı yakında.",
  },
  {
    category: "workspace",
    label: "Çalışma Alanı",
    title: "İzin başladığı yer.",
    text: "Fikirlerin çizgiye dönüştüğü çalışma alanı. Her iş, bir konuşmayla başlar.",
    pending: "Çalışma alanı fotoğrafı yakında.",
  },
  {
    category: "details",
    label: "Detaylar",
    title: "Biraz daha yakından.",
    text: "İlk bakışta görünmeyen küçük parçalar. Mekânın kendine özgü dili.",
    pending: "Detay fotoğrafı yakında.",
  },
];

export function BranchExploration({ studio }: { studio: Studio }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [loadedThrough, setLoadedThrough] = useState(1);

  useEffect(() => {
    setActive(0);
    setLoadedThrough(1);
    if (!root.current || !("IntersectionObserver" in window)) return;
    let observer: IntersectionObserver | undefined;
    let resizeTimer = 0;
    const observe = () => {
      observer?.disconnect();
      const visible = new Map<number, number>();
      // A viewport band selects the chapter under the fixed showcase. Native
      // document scroll stays in charge: no wheel interception or scrollTo.
      const edge = Math.round(window.innerHeight * 0.35);
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visible.set(
              Number((entry.target as HTMLElement).dataset.chapter),
              entry.isIntersecting ? entry.intersectionRatio : 0,
            );
          }
          const best = [...visible]
            .filter(([, ratio]) => ratio > 0)
            .sort((a, b) => b[1] - a[1])[0];
          if (best) {
            setActive(best[0]);
            // Keep visited images mounted and warm only the next scene.
            setLoadedThrough((current) => Math.max(current, best[0] + 1));
          }
        },
        {
          rootMargin: `-${edge}px 0px -${edge}px 0px`,
          threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5],
        },
      );
      root.current
        ?.querySelectorAll("[data-chapter]")
        .forEach((el) => observer?.observe(el));
    };
    const resize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(observe, 120);
    };
    observe();
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      observer?.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
    };
  }, [studio.slug]);

  return (
    <div ref={root} className={styles.exploration} data-branch-showcase>
      <aside className={styles.exploreIndex}>
        <span className={styles.meta}>01 / MEKÂN KEŞFİ</span>
        <h2 id="explore-title">
          Mekânı <br />
          keşfet.
        </h2>
        <p>
          Bir sokak, bir kapı, <br />
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
              {step.label}
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </nav>
        <span className={styles.indexFoot}>
          ŞUBE {studio.number} / BÖLÜM {String(active + 1).padStart(2, "0")} /
          05
        </span>
      </aside>
      <div className={styles.showcase}>
        <div className={styles.showcaseStage} data-showcase-stage>
          <div className={styles.showcaseMeta}>
            <span>{studio.name.toLocaleUpperCase("tr-TR")} / KÖPRÜALTI</span>
            <span>{String(active + 1).padStart(2, "0")} / 05</span>
          </div>
          {steps.map((step, i) => {
            const image = studio.images[step.category][0];
            return (
              <div
                key={step.category}
                className={`${styles.showcaseScene}${image ? "" : ` ${styles.showcasePending}`}`}
                data-scene={step.category}
                data-active={active === i}
                aria-hidden={active !== i}
                inert={active !== i}
              >
                {image && i <= loadedThrough && (
                  <img
                    className={styles.showcaseImage}
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                {!image && (
                  <span className={styles.showcaseNumber} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <div className={styles.sceneCopy}>
                  <span className={styles.meta}>
                    {image ? "KÖPRÜALTI SEÇKİSİ" : "ŞUBEYE ÖZEL ÇEKİM YAKINDA"}
                  </span>
                  <h3>{step.label}</h3>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
                <div className={styles.sceneFoot}>
                  <span>
                    {image ? image.caption : step.pending}
                    <small>
                      {image
                        ? "TEMSİLİ SEÇKİ"
                        : `${studio.district} / ${studio.city}`}
                    </small>
                  </span>
                  {image && (
                    <button
                      type="button"
                      className={styles.showcaseZoom}
                      data-lightbox-image
                      data-full={image.src}
                      data-title={image.alt}
                      data-type="Köprüaltı / geçici görsel seçkisi"
                      aria-label={`${image.alt} görselini büyüt`}
                    >
                      GÖRSELİ BÜYÜT <span aria-hidden="true">↗</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <nav className={styles.showcaseNav} aria-label="Vitrin bölümleri">
            {steps.map((step, i) => (
              <a
                key={step.category}
                href={`#space-${step.category}`}
                aria-current={active === i ? "step" : undefined}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>{step.label}</b>
              </a>
            ))}
          </nav>
          <span className={styles.showcaseHint}>KEŞFETMEK İÇİN KAYDIR ↓</span>
        </div>
        <div className={styles.showcaseTrack} aria-hidden="true">
          {steps.map((step, i) => (
            <div
              key={step.category}
              id={`space-${step.category}`}
              className={styles.showcaseStep}
              data-chapter={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
