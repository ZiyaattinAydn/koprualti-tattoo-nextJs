"use client";

import { useEffect, useRef, useState } from "react";
import type { StudioSlug } from "@/data/studios";
import styles from "./BranchExplorer.module.css";

const sessionDiscoveries = new Set<StudioSlug>();
export const discoveryKey = (slug: StudioSlug) =>
  `koprualti:discovered:v1:${slug}`;

export function BranchDiscovery({
  slug,
  name,
  number,
}: {
  slug: StudioSlug;
  name: string;
  number: string;
}) {
  const [visible, setVisible] = useState(false);
  const arrival = useRef<{
    slug: StudioSlug;
    show: boolean;
    started: number;
  } | null>(null);
  useEffect(() => {
    setVisible(false);
    // Preserve the first-arrival decision through Strict Mode effect replay,
    // but recalculate it when the same route component changes location.
    if (arrival.current?.slug !== slug) {
      let discovered = sessionDiscoveries.has(slug);
      try {
        discovered ||= window.localStorage.getItem(discoveryKey(slug)) === "1";
        window.localStorage.setItem(discoveryKey(slug), "1");
      } catch {
        // Browsers that deny storage still support discovery for this session.
      }
      sessionDiscoveries.add(slug);
      arrival.current = {
        slug,
        show:
          !discovered &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        started: Date.now(),
      };
    }
    const remaining = 880 - (Date.now() - arrival.current.started);
    if (!arrival.current.show || remaining <= 0) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), remaining);
    return () => window.clearTimeout(timer);
  }, [slug]);

  if (!visible) return null;
  return (
    <div
      className={styles.discovery}
      role="status"
      aria-live="polite"
      data-branch-discovery={slug}
    >
      <div>
        <span className={styles.meta}>KÖPRÜALTI / ŞUBE {number}</span>
        <p>ŞUBE KEŞFEDİLDİ</p>
        <strong>{name}</strong>
        <span className={styles.discoveryLine} aria-hidden="true" />
      </div>
    </div>
  );
}
