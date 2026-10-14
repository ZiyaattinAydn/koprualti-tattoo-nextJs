"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type TransitionKind = "brand" | "ataturk";

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

const isSpecialAtaturkRoute = (pathname: string) =>
  normalizePath(pathname) === "/ataturk";

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [kind, setKind] = useState<TransitionKind>("brand");
  const navigating = useRef(false);
  const routeStartedFrom = useRef("");
  const timers = useRef<number[]>([]);

  const addTimer = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
    return timer;
  };

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const finishTransition = () => {
    setLeaving(true);
    addTimer(() => {
      setActive(false);
      setLeaving(false);
      navigating.current = false;
      routeStartedFrom.current = "";
      document.documentElement.classList.remove("page-transition-lock");
    }, 320);
  };

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.dataset.noTransition !== undefined) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const currentPath = normalizePath(window.location.pathname);
      const nextPath = normalizePath(destination.pathname);
      const sameDocument =
        currentPath === nextPath &&
        destination.search === window.location.search;

      if (sameDocument) return;

      // Branch discovery owns the arrival reveal. Do not stack a brand
      // transition or lock/scroll the page while that reveal is visible.
      if (/^\/studios(?:\/(alsancak|karsiyaka))?$/.test(nextPath)) return;

      event.preventDefault();
      if (navigating.current) return;

      navigating.current = true;
      routeStartedFrom.current = currentPath;
      clearTimers();

      const nextKind: TransitionKind = isSpecialAtaturkRoute(nextPath)
        ? "ataturk"
        : "brand";

      setKind(nextKind);
      setLeaving(false);
      setActive(true);
      document.documentElement.classList.add("page-transition-lock");

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const navigateAfter = reducedMotion
        ? 60
        : nextKind === "ataturk"
          ? 980
          : 500;

      addTimer(() => {
        // Preserve the outgoing studio position for browser Back restoration.
        // Next handles scrolling the destination after navigation.
        if (!/^\/studios\/(alsancak|karsiyaka)$/.test(currentPath)) {
          window.scrollTo(0, 0);
        }
        router.push(
          `${destination.pathname}${destination.search}${destination.hash}`,
          { scroll: true },
        );
      }, navigateAfter);

      addTimer(() => {
        if (navigating.current) finishTransition();
      }, 3600);
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      clearTimers();
      document.documentElement.classList.remove("page-transition-lock");
    };
  }, [router]);

  useEffect(() => {
    if (!navigating.current || !active || !routeStartedFrom.current) return;

    const current = normalizePath(pathname);
    if (current === routeStartedFrom.current) return;

    if (!window.location.hash) window.scrollTo(0, 0);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const settleDelay = reducedMotion ? 20 : kind === "ataturk" ? 90 : 110;
    addTimer(finishTransition, settleDelay);
  }, [active, kind, pathname]);

  if (!active) return null;

  return (
    <div
      className={`page-transition page-transition--${kind}${
        leaving ? " is-leaving" : ""
      }`}
      aria-hidden="true"
    >
      {kind === "ataturk" ? (
        <div className="page-transition__signature-stage">
          <div className="page-transition__signature-reveal">
            <img
              className="page-transition__signature"
              src="/assets/transition/ataturk-signature.svg"
              alt=""
            />
          </div>
        </div>
      ) : (
        <div className="page-transition__brand-stage">
          <img
            className="page-transition__brand"
            src="/assets/koprualti-original-logo.png"
            alt=""
          />
        </div>
      )}
    </div>
  );
}
