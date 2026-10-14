"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function InteractionPolish() {
  const pathname = usePathname();

  useEffect(() => {
    const timers: number[] = [];
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
      return timer;
    };

    const centerServiceTrigger = (trigger: HTMLElement) => {
      trigger.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
        inline: "nearest",
      });
    };

    const refreshDoodles = () => {
      window.dispatchEvent(new Event("resize"));
    };

    const onServiceClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest<HTMLElement>(
        ".services-page-s3 .service-trigger",
      );
      if (!trigger) return;

      const isOpening = trigger.getAttribute("aria-expanded") !== "true";
      if (!isOpening) return;

      schedule(() => centerServiceTrigger(trigger), 120);
      schedule(refreshDoodles, 920);
    };

    if (pathname.startsWith("/services")) {
      document.addEventListener("click", onServiceClick, true);

      schedule(() => {
        const trigger = document.querySelector<HTMLElement>(
          ".services-page-s3 .service-row.open .service-trigger",
        );
        if (trigger) centerServiceTrigger(trigger);
      }, 220);
      schedule(refreshDoodles, 980);
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
      document.removeEventListener("click", onServiceClick, true);
      warmers.length = 0;
    };
  }, [pathname]);

  return null;
}
