"use client";

import { useEffect, useRef } from "react";
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
  const available = steps.filter((step) => studio.images[step.category].length);
  const pending = steps.filter((step) => !studio.images[step.category].length);

  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    // CSS view timelines handle supported browsers. A one-time reveal is the
    // fallback; neither path measures layout on scroll or moves the document.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      CSS.supports("animation-timeline", "view()")
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    element.dataset.revealFallback = "true";
    element
      .querySelectorAll("[data-scene]")
      .forEach((scene) => observer.observe(scene));
    return () => {
      observer.disconnect();
      delete element.dataset.revealFallback;
    };
  }, [studio.slug]);

  return (
    <div ref={root} className={styles.exploration} data-branch-showcase>
      <div className={`${styles.shell} ${styles.exploreIntro}`}>
        <div>
          <span className={styles.meta}>01 / MEKÂN KEŞFİ</span>
          <h2 id="explore-title">
            İçeride başka
            <br />
            bir dünya.
          </h2>
          <p>
            Bir sokak, bir kapı, binlerce çizgi. Aşağı kaydır, Köprüaltı
            seçkisine biraz daha yaklaş.
          </p>
          <nav className={styles.sceneLinks} aria-label="Mekân keşif adımları">
            {available.map((step) => (
              <a key={step.category} href={`#space-${step.category}`}>
                {step.label} <span aria-hidden="true">↓</span>
              </a>
            ))}
          </nav>
        </div>
        <div className={styles.pendingList}>
          <span className={styles.meta}>SIRADAKİ ÇEKİMLER</span>
          {pending.map((step) => (
            <div
              id={`space-${step.category}`}
              data-chapter={steps.indexOf(step)}
              key={step.category}
            >
              <span>{String(steps.indexOf(step) + 1).padStart(2, "0")}</span>
              <strong>{step.label}</strong>
              <small>Fotoğraf yakında</small>
            </div>
          ))}
          <p>Şubeye özel fotoğraflar geldikçe bu yolculuğa eklenecek.</p>
        </div>
      </div>
      {available.map((step, index) => {
        const image = studio.images[step.category][0];
        const next = available[index + 1];
        return (
          <section
            key={step.category}
            id={`space-${step.category}`}
            className={`${styles.showcaseScene}${index % 2 ? ` ${styles.sceneLight}` : ""}`}
            data-scene={step.category}
            data-chapter={steps.indexOf(step)}
            aria-labelledby={`title-${step.category}`}
          >
            <div className={styles.sceneVisual}>
              <img
                className={styles.showcaseImage}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={`${styles.shell} ${styles.sceneInner}`}>
              <div className={styles.showcaseMeta}>
                <span>
                  ŞUBE {studio.number} /{" "}
                  {studio.name.toLocaleUpperCase("tr-TR")}
                </span>
                <span>
                  {String(steps.indexOf(step) + 1).padStart(2, "0")} /{" "}
                  {step.label.toLocaleUpperCase("tr-TR")}
                </span>
              </div>
              <div className={styles.sceneCopy}>
                <span className={styles.meta}>KÖPRÜALTI SEÇKİSİ</span>
                <h3 id={`title-${step.category}`}>{step.title}</h3>
                <p>{step.text}</p>
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
              </div>
              <div className={styles.sceneFoot}>
                <span>
                  {image.caption}
                  <small>TEMSİLİ STÜDYO SEÇKİSİ</small>
                </span>
                <a href={next ? `#space-${next.category}` : "#artists"}>
                  {next ? next.label : "Sanatçıları tanı"}{" "}
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
