"use client";

import { useEffect } from "react";

const DURATION = 1250;
const GESTURE_GAP = 200;

// Kept local to studio details; other routes retain their own scrolling.
export function BranchMotion({ slug }: { slug: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-studio="${slug}"]`);
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let moving = false;
    let direction = 0;
    let releaseAt = 0;
    let accumulated = 0;
    let lastWheel = 0;

    const cancel = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      moving = false;
      releaseAt = 0;
      accumulated = 0;
      delete root.dataset.scrollMoving;
    };
    const headerHeight = () =>
      document.querySelector(".header-v38")?.getBoundingClientRect().height ??
      100;
    const animateTo = (destination: number) => {
      cancel();
      const start = window.scrollY;
      const left = window.scrollX;
      const target = Math.max(
        0,
        Math.min(
          destination,
          document.documentElement.scrollHeight - window.innerHeight,
        ),
      );
      if (preference.matches || Math.abs(target - start) < 2) {
        window.scrollTo({ top: target, left, behavior: "instant" });
        return;
      }
      const started = performance.now();
      moving = true;
      root.dataset.scrollMoving = "true";
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / DURATION);
        // Gentle acceleration and deceleration, with an exact final landing.
        const eased =
          progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        window.scrollTo({
          top: start + (target - start) * eased,
          left,
          behavior: "instant",
        });
        if (progress < 1) frame = requestAnimationFrame(tick);
        else {
          moving = false;
          frame = 0;
          releaseAt = performance.now() + GESTURE_GAP;
          delete root.dataset.scrollMoving;
        }
      };
      frame = requestAnimationFrame(tick);
    };
    const stops = () => {
      const offset = headerHeight();
      const viewport = Math.max(200, window.innerHeight - offset - 24);
      const y = window.scrollY;
      const sections = [
        ...root.querySelectorAll<HTMLElement>("[data-scroll-stop]"),
      ];
      const positions = sections.map((el) =>
        Math.max(0, el.getBoundingClientRect().top + y - offset),
      );
      positions.push(root.getBoundingClientRect().bottom + y - offset);
      const result: number[] = [];
      positions.forEach((position, i) => {
        result.push(position);
        const next = positions[i + 1];
        if (sections[i]?.dataset.scrollStop !== "long") return;
        // Tall artist/archive sections must remain readable on small screens.
        for (
          let extra = position + viewport;
          next && next - extra > 100;
          extra += viewport
        )
          result.push(extra);
      });
      return result;
    };
    const scrollableChild = (target: Element) => {
      for (
        let el: Element | null = target;
        el && el !== root;
        el = el.parentElement
      ) {
        if (
          el.matches(
            "input,textarea,select,[contenteditable=true],[role=dialog]",
          )
        )
          return true;
        const style = getComputedStyle(el);
        if (
          /(auto|scroll)/.test(style.overflowY) &&
          el.scrollHeight > el.clientHeight + 2
        )
          return true;
      }
      return false;
    };
    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        !event.cancelable ||
        preference.matches ||
        event.ctrlKey ||
        event.metaKey ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY) ||
        document.body.classList.contains("image-viewer-open") ||
        document.documentElement.classList.contains("page-transition-lock") ||
        root.querySelector("[data-branch-discovery]") ||
        !(event.target instanceof Element) ||
        scrollableChild(event.target)
      )
        return;
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1);
      if (!delta) return;
      const nextDirection = Math.sign(delta);
      const now = performance.now();
      if ((moving || now < releaseAt) && nextDirection === direction) {
        event.preventDefault();
        releaseAt = now + GESTURE_GAP;
        return;
      }
      if (moving) cancel();
      if (now - lastWheel > GESTURE_GAP || nextDirection !== direction)
        accumulated = 0;
      direction = nextDirection;
      lastWheel = now;
      accumulated += delta;
      const points = stops();
      const destination =
        direction > 0
          ? points.find((point) => point > window.scrollY + 8)
          : points.findLast((point) => point < window.scrollY - 8);
      // At either boundary, hand back to native scrolling (including Footer).
      if (destination === undefined) return;
      event.preventDefault();
      if (Math.abs(accumulated) < 12) return;
      animateTo(destination);
    };
    const onClick = (event: MouseEvent) => {
      cancel();
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        !root.contains(anchor) ||
        anchor.target ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href, location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      const section = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!section || !root.contains(section)) return;
      event.preventDefault();
      // A chapter is not a new page: do not create hash history entries.
      animateTo(
        section.getBoundingClientRect().top + window.scrollY - headerHeight(),
      );
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
          "Escape",
          "Tab",
        ].includes(event.key)
      )
        cancel();
    };

    // One observer, no scroll-time React state updates. Reveals run once so
    // returning to a section never hides content or remounts its doodles.
    const items = root.querySelectorAll<HTMLElement>(
      "[data-branch-reveal],[data-branch-doodles]",
    );
    const reveal = (element: HTMLElement) => {
      element.dataset.entered = "true";
      // Fully clipped lazy motifs can otherwise be deferred until the user
      // revisits. Warm only the visible motifs when their section arrives.
      if (element.hasAttribute("data-branch-doodles")) {
        element.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
          if (getComputedStyle(image).display !== "none")
            image.loading = "eager";
        });
      }
    };
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target as HTMLElement);
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.08 },
      );
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) reveal(el);
        observer?.observe(el);
      });
      root.dataset.motionReady = "true";
    }
    root.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("pointerdown", cancel, { passive: true });
    window.addEventListener("resize", cancel, { passive: true });
    window.addEventListener("popstate", cancel);
    preference.addEventListener("change", cancel);
    return () => {
      cancel();
      observer?.disconnect();
      delete root.dataset.motionReady;
      root.removeEventListener("wheel", onWheel);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("resize", cancel);
      window.removeEventListener("popstate", cancel);
      preference.removeEventListener("change", cancel);
    };
  }, [slug]);
  return null;
}
