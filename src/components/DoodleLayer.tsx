"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { mountDoodles } from "@/lib/doodles";

export function DoodleLayer() {
  const path = usePathname();

  useEffect(() => {
    const cleanupDoodles = mountDoodles(path);
    let settleTimer = 0;

    const soften = (delay = 220) => {
      document.documentElement.classList.add("doodles-resizing");
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("doodles-resizing");
      }, delay);
    };

    const onResize = () => soften(220);
    const onInteractiveResize = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest(
          ".service-trigger,.appointment-s3-modebar button,.filters button,.portfolio-types button",
        )
      ) {
        soften(760);
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("click", onInteractiveResize, true);

    return () => {
      cleanupDoodles?.();
      window.clearTimeout(settleTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onInteractiveResize, true);
      document.documentElement.classList.remove("doodles-resizing");
    };
  }, [path]);

  return null;
}
