"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function InteractionPolish() {
  const pathname = usePathname();

  useEffect(() => {
    const timers: number[] = [];
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
      return timer;
    };

    const resetRouteScroll = () => {
      const old = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = old;
      });
    };

    // Yalnızca gerçek route değişiminde sayfayı üste al.
    // Hizmet accordion etkileşimleri scroll pozisyonuna dokunmaz.
    // Next's navigation handles explorer scroll restoration. Respect profile
    // anchors as well; delayed resets must not pull them back to the page top.
    if (!pathname.startsWith("/studios") && !window.location.hash) {
      resetRouteScroll();
    }

    const isHeavyGalleryPage =
      pathname === "/artists" || pathname === "/ataturk";

    const warmers: HTMLImageElement[] = [];
    if (isHeavyGalleryPage) {
      const sources =
        pathname === "/artists"
          ? ["/assets/doctor-live.png", "/assets/birsu-studio.jpeg"]
          : ["/assets/ataturk-portrait.png", "/assets/ataturk-editorial.png"];

      for (const src of sources) {
        const image = new Image();
        image.decoding = "async";
        image.loading = "eager";
        image.src = src;
        void image.decode().catch(() => undefined);
        warmers.push(image);
      }

      const prepareInteractiveImages = () => {
        document
          .querySelectorAll<HTMLImageElement>(
            ".artists-page-v2 [data-lightbox-image], .ataturk-page [data-lightbox-image]",
          )
          .forEach((image) => {
            image.draggable = false;
            image.decoding = "async";
            image.loading = "eager";
            image.classList.add("image-interaction-ready");
          });
      };

      prepareInteractiveImages();
      schedule(prepareInteractiveImages, 120);
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      warmers.length = 0;
    };
  }, [pathname]);

  return null;
}
