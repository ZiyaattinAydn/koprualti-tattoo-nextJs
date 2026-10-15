"use client";
import s from "@/components/artist-studio/Studio.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className={s.auth}>
      <p>ARTIST STUDIO</p>
      <h1>Bağlantı kesildi.</h1>
      <p>İşlem tamamlanamadı. Tekrar deneyebilirsin.</p>
      <button type="button" onClick={reset}>
        Tekrar dene
      </button>
    </main>
  );
}
