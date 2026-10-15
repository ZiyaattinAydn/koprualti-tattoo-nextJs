"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { browserClient } from "@/lib/supabase/client";
import s from "@/components/artist-studio/Studio.module.css";
export default function Page() {
  const [message, setMessage] = useState("Güvenli bağlantın doğrulanıyor…");
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    async function run() {
      try {
        const db = browserClient();
        const query = new URLSearchParams(location.search);
        const hash = new URLSearchParams(location.hash.slice(1));
        const code = query.get("code"),
          token = query.get("token_hash"),
          type = query.get("type");
        // Remove tokens before any further navigation, logging or analytics.
        history.replaceState(null, "", "/artist-studio/auth/callback/");
        let error;
        if (code) ({ error } = await db.auth.exchangeCodeForSession(code));
        else if (token && (type === "invite" || type === "recovery"))
          ({ error } = await db.auth.verifyOtp({ token_hash: token, type }));
        else if (hash.get("access_token") && hash.get("refresh_token"))
          ({ error } = await db.auth.setSession({
            access_token: hash.get("access_token")!,
            refresh_token: hash.get("refresh_token")!,
          }));
        else throw new Error();
        if (error) throw error;
        location.replace("/artist-studio/password/");
      } catch {
        setMessage(
          "Bağlantı geçersiz veya süresi dolmuş. Yeni bir bağlantı iste.",
        );
      }
    }
    void run();
  }, []);
  return (
    <main className={s.auth}>
      <p>ARTIST STUDIO / GÜVENLİ GİRİŞ</p>
      <h1>Birazdan içeridesin.</h1>
      <p role="status">{message}</p>
      <Link href="/artist-studio/login/">Girişe dön</Link>
    </main>
  );
}
