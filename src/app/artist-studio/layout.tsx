import type { ReactNode } from "react";
import styles from "@/components/artist-studio/Studio.module.css";
export const metadata = {
  title: "Artist Studio",
  robots: { index: false, follow: false, noarchive: true },
};
export const dynamic = "force-dynamic";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.studio}>
      <style>{`
        .${styles.authMark} {
          font-size: 0;
        }
        .${styles.authMark}::after {
          content: "K6";
          font: 70px Rye, serif;
        }
        .${styles.imagePickers} > .${styles.imagePicker}:first-child > span[aria-hidden="true"] {
          font-size: 0;
        }
        .${styles.imagePickers} > .${styles.imagePicker}:first-child > span[aria-hidden="true"]::after {
          content: "K6";
          font: 50px Rye, serif;
        }
      `}</style>
      {children}
    </div>
  );
}
