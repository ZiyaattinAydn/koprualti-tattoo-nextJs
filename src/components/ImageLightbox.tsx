"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
type Picture = {
  src: string;
  alt: string;
  title: string;
  meta: string;
  description: string;
};
export function ImageLightbox() {
  const [picture, setPicture] = useState<Picture | null>(null);
  const previous = useRef<HTMLElement | null>(null),
    scroll = useRef(0),
    closeRef = useRef<HTMLButtonElement>(null);
  const openedPath = useRef(""),
    pathname = usePathname();
  const close = () => setPicture(null);
  useEffect(() => {
    setPicture(null);
  }, [pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const trigger = target?.closest<HTMLElement>(
        "[data-lightbox], [data-lightbox-image]",
      );
      if (!trigger) return;
      const img = trigger.matches("img")
        ? (trigger as HTMLImageElement)
        : trigger.querySelector("img");
      const src = trigger.dataset.full || img?.currentSrc || img?.src;
      if (!src) return;
      if (trigger instanceof HTMLAnchorElement) event.preventDefault();
      previous.current = document.activeElement as HTMLElement;
      scroll.current = window.scrollY;
      openedPath.current = location.pathname;
      const details = [
        trigger.dataset.type,
        trigger.dataset.artistLabel ||
          (trigger.dataset.artist !== "unknown" ? trigger.dataset.artist : ""),
      ].filter(Boolean);
      setPicture({
        src,
        alt: img?.alt || trigger.dataset.title || "Görsel",
        title: trigger.dataset.title || img?.alt || "Stüdyo arşivi",
        meta: details.join("  /  "),
        description: trigger.dataset.description || "",
      });
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        (event.target as Element)?.matches?.("[data-lightbox-image]")
      ) {
        event.preventDefault();
        (event.target as HTMLElement).click();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  useEffect(() => {
    if (!picture) return;
    document.body.style.top = `-${scroll.current}px`;
    document.body.classList.add("image-viewer-open");
    closeRef.current?.focus({ preventScroll: true });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.classList.remove("image-viewer-open");
      document.body.style.top = "";
      if (openedPath.current === location.pathname) {
        const old = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, scroll.current);
        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = old;
        });
        previous.current?.focus({ preventScroll: true });
      }
    };
  }, [picture]);
  if (!picture) return null;
  return (
    <div
      className="image-viewer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-viewer-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="image-viewer-panel">
        <button
          ref={closeRef}
          className="image-viewer-close"
          type="button"
          aria-label="Görseli kapat"
          onClick={close}
        >
          ×
        </button>
        <div className="image-viewer-media">
          <img src={picture.src} alt={picture.alt} />
        </div>
        <div className="image-viewer-info">
          {picture.meta && (
            <p className="image-viewer-kicker">{picture.meta}</p>
          )}
          <h2 id="image-viewer-title">{picture.title}</h2>
          {picture.description && (
            <p className="image-viewer-description">{picture.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
