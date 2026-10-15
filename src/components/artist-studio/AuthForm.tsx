"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  login,
  resetPassword,
  updatePassword,
} from "@/app/artist-studio/actions";
import s from "./Studio.module.css";
export function AuthForm({
  ready,
  passwordMode = false,
}: {
  ready: boolean;
  passwordMode?: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [reset, setReset] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const result = passwordMode
        ? await updatePassword(String(data.get("password")))
        : reset
          ? await resetPassword(String(data.get("email")))
          : await login(
              String(data.get("email")),
              String(data.get("password")),
            );
      setMessage(
        result.ok
          ? passwordMode
            ? "Şifren kaydedildi. Studio’ya geçebilirsin."
            : "Bu adrese ait hesap varsa şifre yenileme bağlantısı gönderildi."
          : result.error,
      );
    } catch {
      setMessage("Bağlantı kurulamadı. Tekrar dene.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={s.auth}>
      <div className={s.authMark} aria-hidden="true">
        K.
      </div>
      <p className={s.eyebrow}>KÖPRÜALTI / PRIVATE WORKSPACE</p>
      <h1>
        Artist
        <br />
        <em>Studio.</em>
      </h1>
      <p>
        {passwordMode
          ? "Hesabın için güvenli bir şifre belirle."
          : reset
            ? "Şifreni yenilemek için e-postanı yaz."
            : "Kendi alanın. Kendi çizgin."}
      </p>
      {!ready ? (
        <p role="status" className={s.notice}>
          Studio bağlantısı hazırlanıyor. Giriş henüz kullanılamıyor.
        </p>
      ) : (
        <form onSubmit={submit}>
          {!passwordMode && (
            <label>
              E-posta
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          )}
          {!reset && (
            <label>
              Şifre
              <input
                name="password"
                type="password"
                autoComplete={
                  passwordMode ? "new-password" : "current-password"
                }
                minLength={passwordMode ? 12 : 8}
                maxLength={128}
                required
              />
            </label>
          )}
          <button type="submit" disabled={busy}>
            {busy
              ? "Bir saniye…"
              : passwordMode
                ? "Şifreyi kaydet"
                : reset
                  ? "Yenileme bağlantısı gönder"
                  : "Studio’ya gir ↗"}
          </button>
          {!passwordMode && (
            <button
              className={s.quiet}
              type="button"
              disabled={busy}
              onClick={() => {
                setReset(!reset);
                setMessage("");
              }}
            >
              {reset ? "Girişe dön" : "Şifremi unuttum"}
            </button>
          )}
        </form>
      )}
      {message && (
        <p role="status" className={s.notice}>
          {message}
        </p>
      )}
      {passwordMode && <Link href="/artist-studio/">Studio’ya geç ↗</Link>}
      <small>Yalnızca davetli Köprüaltı sanatçıları.</small>
    </main>
  );
}
