import type { ReactNode } from "react";
import styles from "@/components/artist-studio/Studio.module.css";
export const metadata = {
  title: "Artist Studio",
  robots: { index: false, follow: false, noarchive: true },
};
export const dynamic = "force-dynamic";
export default function Layout({ children }: { children: ReactNode }) {
  return <div className={styles.studio}>{children}</div>;
}
