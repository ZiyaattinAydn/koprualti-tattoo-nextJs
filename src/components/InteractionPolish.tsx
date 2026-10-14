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

    resetRouteScroll();

    const centerServiceTrigger = (trigger: HTMLElement) => {
      const rect = trigger.getBoundingClientRect();
      const target =
        window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
      window.scrollTo({
        top: Math.max(0, target),
        left: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
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

      // Accordion yaklaşık .78s sürüyor. Önce layout tamamen yerine otursun,
      // sonra hedef başlığı gerçek viewport merkezine taşı.
      schedule(refreshDoodles, 820);
      schedule(() => centerServiceTrigger(trigger), 860);
    };

    if (pathname.startsWith("/services")) {
      document.addEventListener("click", onServiceClick, true);

      // Sabit alt route / hash ile açılan hizmetlerde de açılma tamamlandıktan
      // sonra başlık ekranın merkezine gelsin.
      schedule(() => {
        const trigger = document.querySelector<HTMLElement>(
          ".services-page-s3 .service-row.open .service-trigger",
        );
        if (trigger) centerServiceTrigger(trigger);
      }, 900);
      schedule(refreshDoodles, 820);
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
