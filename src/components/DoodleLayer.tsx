"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { mountDoodles } from "@/lib/doodles";

export function DoodleLayer() {
  const path = usePathname();

  useEffect(() => {
    const cleanupDoodles = mountDoodles(path);
    let settleTimer = 0;
    let lastWidth = window.innerWidth;

    const soften = (delay = 200) => {
      document.documentElement.classList.add("doodles-resizing");
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("doodles-resizing");
      }, delay);
    };

    const onResize = () => {
      const nextWidth = window.innerWidth;
      const isShrinking = nextWidth < lastWidth - 2;
      lastWidth = nextWidth;

      if (isShrinking) soften(200);
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cleanupDoodles?.();
      window.clearTimeout(settleTimer);
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("doodles-resizing");
    };
  }, [path]);

  return null;
}
