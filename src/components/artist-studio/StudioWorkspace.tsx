"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
  loadDraft,
  logout,
  publishDraft,
  restoreDraft,
  saveDraft,
} from "@/app/artist-studio/actions";
import { branchNames } from "@/data/artists";
import {
  themes,
  type Account,
  type Profile,
  type Result,
  type StudioDraft,
  type Work,
} from "@/lib/studio/model";
import { ArtistProfile } from "./ArtistProfile";
import { Operations } from "./Operations";
import { uploadImage } from "./upload";
import { browserClient } from "@/lib/supabase/client";
import s from "./Studio.module.css";
type Loaded = StudioDraft & { urls: Record<string, string> };
const tabs = [
  { id: "profile", name: "Profilim" },
  { id: "portfolio", name: "Portfolio" },
  { id: "featured", name: "Öne çıkanlar" },
  { id: "appearance", name: "Görünüm" },
  { id: "appointments", name: "Randevular" },
];
function signature(d: Loaded) {
  return JSON.stringify([d.profile, d.works]);
}
export function StudioWorkspace({
  account,
  initial,
}: {
  account: Account;
  initial: Result<Loaded>;
}) {
  const [draft, setDraft] = useState<Loaded | null>(
      initial.ok ? initial.data : null,
    ),
    [baseline, setBaseline] = useState(
      initial.ok ? signature(initial.data) : "",
    );
  const [tab, setTab] = useState("profile"),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [notice, setNotice] = useState(initial.ok ? "" : initial.error),
    [preview, setPreview] = useState(false);
  const drag = useRef<string | null>(null),
    pendingDelete = useRef(new Set<string>()),
    uploadInput = useRef<HTMLInputElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const dirty = draft ? signature(draft) !== baseline : false;
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function reload() {
    const result = await loadDraft();
    if (result.ok) {
      setDraft(result.data);
      setBaseline(signature(result.data));
    } else setNotice(result.error);
  }
  function selectTab(id: string) {
    setTab(id);
    setPreview(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function change<K extends keyof Profile>(key: K, value: Profile[K]) {
    setDraft((d) =>
      d ? { ...d, profile: { ...d.profile, [key]: value } } : d,
    );
  }
  function changeWork(id: string, patch: Partial<Work>) {
    setDraft((d) =>
      d
        ? {
            ...d,
            works: d.works.map((w) => (w.id === id ? { ...w, ...patch } : w)),
          }
        : d,
    );
  }
  function move(id: string, target: number) {
    setDraft((d) => {
      if (!d) return d;
      const items = [...d.works],
        from = items.findIndex((w) => w.id === id);
      if (from < 0 || target < 0 || target >= items.length) return d;
      const [item] = items.splice(from, 1);
      items.splice(target, 0, item);
      return { ...d, works: items.map((w, i) => ({ ...w, sort_order: i })) };
    });
  }
  async function run(action: () => Promise<void>) {
    if (busy || uploading) return;
    setBusy(true);
    setNotice("");
    try {
      await action();
    } catch {
      setNotice("İşlem tamamlanamadı. Tekrar dene.");
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!draft) return;
    const result = await saveDraft({
      profile: draft.profile,
      works: draft.works,
      version: draft.version,
    });
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    const next = { ...draft, version: result.data };
    setDraft(next);
    setBaseline(signature(next));
    setNotice("Taslak kaydedildi. Önizleyip yayınlayabilirsin.");
  }
  async function publish() {
    if (!draft || dirty) return;
    const result = await publishDraft(draft.version);
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setDraft({ ...draft, published_version: draft.version });
    setNotice("Profilin yayında.");
    const paths = [...pendingDelete.current];
    if (paths.length) {
      await browserClient().storage.from("artist-media").remove(paths);
      pendingDelete.current.clear();
    }
  }
  async function upload(
    event: ChangeEvent<HTMLInputElement>,
    folder: "profile" | "covers" | "portfolio",
  ) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || !draft || busy || uploading) return;
    if (folder === "portfolio" && files.length + draft.works.length > 100) {
      setNotice("Portfolio en fazla 100 çalışma içerebilir.");
      return;
    }
    setUploading(true);
    let count = 0;
    try {
      for (const file of files) {
        setNotice(
          `Görsel hazırlanıyor ve yükleniyor… ${count + 1}/${files.length}`,
        );
        const result = await uploadImage(file, account.id, folder);
        setDraft((d) => {
          if (!d) return d;
          const next = { ...d, urls: { ...d.urls, [result.path]: result.url } };
          if (folder === "portfolio")
            return {
              ...next,
              works: [
                ...d.works,
                {
                  id: crypto.randomUUID(),
                  storage_path: result.path,
                  title: "",
                  description: "",
                  style: "",
                  featured: false,
                  sort_order: d.works.length,
                },
              ],
            };
          const field = folder === "profile" ? "profile_image" : "cover_image";
          if (d.profile[field].startsWith("artists/"))
            pendingDelete.current.add(d.profile[field]);
          return { ...next, profile: { ...d.profile, [field]: result.path } };
        });
        count++;
      }
      setNotice(`${count} görsel yüklendi. Değişiklikleri kaydet.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }
  if (!draft)
    return (
      <main className={s.auth}>
        <p>ARTIST STUDIO</p>
        <h1>Taslak yüklenemedi.</h1>
        <p role="alert">{notice}</p>
        <button type="button" onClick={() => run(reload)} disabled={busy}>
          Tekrar dene
        </button>
        <form action={logout}>
          <button type="submit">Çıkış</button>
        </form>
      </main>
    );
  const selectedWorks =
    tab === "featured" ? draft.works.filter((w) => w.featured) : draft.works;
  return (
    <div className={s.workspace}>
      <aside className={s.sidebar}>
        <button
          type="button"
          className={s.brand}
          onClick={() => selectTab("profile")}
        >
          KÖPRÜALTI<span>ARTIST STUDIO ↗</span>
        </button>
        <div className={s.account}>
          <span className={s.avatar}>{account.display_name.slice(0, 1)}</span>
          <div>
            <strong>{account.display_name}</strong>
            <small>
              {branchNames[account.branch]} / {account.role.toUpperCase()}
            </small>
          </div>
        </div>
        <nav aria-label="Studio bölümleri">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => selectTab(t.id)}
            >
              <small>0{i + 1}</small>
              {t.name}
              {t.id === "portfolio" && <span>{draft.works.length}</span>}
            </button>
          ))}
          {account.role === "manager" && (
            <button
              type="button"
              className={s.managerNav}
              aria-current={tab === "artists" ? "page" : undefined}
              onClick={() => selectTab("artists")}
            >
              <small>↳</small>Sanatçılar
            </button>
          )}
        </nav>
        <div className={s.sidebarBottom}>
          <p>
            KENDİ ALANIN.
            <br />
            KENDİ ÇİZGİN.
          </p>
          <Link
            href="/artist-studio/password/"
            onClick={(e) => {
              if (
                dirty &&
                !window.confirm(
                  "Kaydedilmemiş değişiklikler bırakılacak. Devam edilsin mi?",
                )
              )
                e.preventDefault();
            }}
          >
            Şifreyi değiştir
          </Link>
          <form
            action={logout}
            onSubmit={(e) => {
              if (
                dirty &&
                !window.confirm(
                  "Kaydedilmemiş değişiklikler bırakılacak. Çıkılsın mı?",
                )
              )
                e.preventDefault();
            }}
          >
            <button type="submit" className={s.quiet}>
              Çıkış yap ↗
            </button>
          </form>
        </div>
      </aside>
      <div className={s.main}>
        <header className={s.toolbar}>
          <div>
            <span className={s.liveDot} />{" "}
            {draft.published_version >= 0 ? "LIVE" : "HENÜZ YAYINLANMADI"}
            <small>
              {dirty
                ? "Kaydedilmemiş değişiklikler"
                : draft.version !== draft.published_version
                  ? "Yayınlanmamış taslak"
                  : "Yayınla aynı sürüm"}
            </small>
          </div>
          <div className={s.toolbarActions}>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              aria-pressed={preview}
            >
              {preview ? "Editöre dön" : "Önizle"}
            </button>
            <button
              type="button"
              disabled={busy || uploading || !dirty}
              onClick={() => run(save)}
            >
              Kaydet
            </button>
            <button
              type="button"
              className={s.primary}
              disabled={
                busy ||
                uploading ||
                dirty ||
                draft.version === draft.published_version
              }
              onClick={() => run(publish)}
            >
              Yayınla ↗
            </button>
          </div>
        </header>
        {notice && (
          <div role="status" aria-live="polite" className={s.notice}>
            {notice}
          </div>
        )}
        <div className={`${s.content} ${preview ? s.previewMode : ""}`}>
          <section className={s.editor} aria-busy={busy || uploading}>
            <div className={s.editorHeading}>
              <span className={s.eyebrow}>
                WORKSPACE / {account.slug.toUpperCase()}
              </span>
              <h1 tabIndex={-1} ref={heading}>
                {tab === "artists"
                  ? "Sanatçılar"
                  : tabs.find((t) => t.id === tab)?.name}
                <em>.</em>
              </h1>
              <p>
                {tab === "profile"
                  ? "Profilini güncelle. Hikâyeni kendi cümlelerinle anlat."
                  : tab === "portfolio"
                    ? "Çalışmalarını ekle, sırala, seçkini oluştur."
                    : tab === "featured"
                      ? "Vitrine çıkarmak istediğin işleri seç."
                      : tab === "appearance"
                        ? "Aynı çizgi. Üç farklı ifade."
                        : tab === "appointments"
                          ? "Yeni talepler ve üstlendiğin randevular."
                          : "Ekip, davetler ve şubeler."}
              </p>
            </div>
            <fieldset disabled={busy || uploading} className={s.fields}>
              {tab === "profile" && (
                <>
                  <div className={s.imagePickers}>
                    {(["profile_image", "cover_image"] as const).map(
                      (field, i) => (
                        <div key={field} className={s.imagePicker}>
                          {draft.urls[draft.profile[field]] ? (
                            <img
                              src={draft.urls[draft.profile[field]]}
                              alt={
                                i === 0
                                  ? "Mevcut profil görseli"
                                  : "Mevcut kapak görseli"
                              }
                            />
                          ) : (
                            <span aria-hidden="true">
                              {i === 0 ? "K." : "↗"}
                            </span>
                          )}
                          <label>
                            {i === 0 ? "Profil fotoğrafı" : "Kapak görseli"}
                            <input
                              aria-label={
                                i === 0
                                  ? "Profil fotoğrafı yükle"
                                  : "Kapak görseli yükle"
                              }
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) =>
                                void upload(e, i === 0 ? "profile" : "covers")
                              }
                            />
                          </label>
                          <small>JPG / PNG / WEBP · En fazla 20 MB</small>
                          {draft.profile[field] && (
                            <button
                              type="button"
                              className={s.quiet}
                              onClick={() => {
                                if (draft.profile[field].startsWith("artists/"))
                                  pendingDelete.current.add(
                                    draft.profile[field],
                                  );
                                change(field, "");
                              }}
                            >
                              Görseli kaldır
                            </button>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                  <div className={s.twoColumns}>
                    <label>
                      Sanatçı adı
                      <input
                        value={draft.profile.display_name}
                        maxLength={100}
                        onChange={(e) => change("display_name", e.target.value)}
                      />
                    </label>
                    <label>
                      Lakap
                      <input
                        value={draft.profile.nickname}
                        maxLength={100}
                        onChange={(e) => change("nickname", e.target.value)}
                      />
                    </label>
                  </div>
                  <label>
                    Kısa biyografi
                    <textarea
                      rows={6}
                      value={draft.profile.bio}
                      maxLength={3000}
                      onChange={(e) => change("bio", e.target.value)}
                    />
                    <small>{draft.profile.bio.length} / 3000</small>
                  </label>
                  <label>
                    Uzmanlıklar <small>Virgülle ayır</small>
                    <input
                      value={draft.profile.specialties.join(",")}
                      onChange={(e) =>
                        change(
                          "specialties",
                          e.target.value.split(",").slice(0, 20),
                        )
                      }
                      onBlur={() =>
                        change(
                          "specialties",
                          draft.profile.specialties
                            .map((v) => v.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </label>
                  <label>
                    Tattoo stilleri <small>Virgülle ayır</small>
                    <input
                      value={draft.profile.styles.join(",")}
                      onChange={(e) =>
                        change("styles", e.target.value.split(",").slice(0, 20))
                      }
                      onBlur={() =>
                        change(
                          "styles",
                          draft.profile.styles
                            .map((v) => v.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </label>
                  <label>
                    Instagram
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/kullanici/"
                      value={draft.profile.instagram_url}
                      maxLength={200}
                      onChange={(e) => change("instagram_url", e.target.value)}
                    />
                  </label>
                  <label>
                    Randevu bağlantısı
                    <input
                      value={draft.profile.appointment_url}
                      maxLength={300}
                      onChange={(e) =>
                        change("appointment_url", e.target.value)
                      }
                    />
                    <small>
                      Site içindeki /appointment/ bağlantısını kullan.
                    </small>
                  </label>
                  <div className={s.info}>
                    <span>ŞUBE</span>
                    <strong>{branchNames[account.branch]}</strong>
                    <p>Şube atamasını Doktor yönetir.</p>
                  </div>
                  <button
                    type="button"
                    className={s.quiet}
                    onClick={() =>
                      run(async () => {
                        if (
                          !window.confirm(
                            "Taslak, son yayınlanan sürümle değiştirilecek. Devam edilsin mi?",
                          )
                        )
                          return;
                        const result = await restoreDraft(draft.version);
                        if (result.ok) {
                          pendingDelete.current.clear();
                          await reload();
                          setNotice("Son yayınlanan sürüme dönüldü.");
                        } else setNotice(result.error);
                      })
                    }
                  >
                    Son yayınlanan sürüme dön ↶
                  </button>
                </>
              )}
              {(tab === "portfolio" || tab === "featured") && (
                <>
                  <div className={s.uploadBar}>
                    <div>
                      <strong>{draft.works.length} çalışma</strong>
                      <p>
                        {tab === "portfolio"
                          ? "Sürükleyerek ya da oklarla sırala."
                          : "Portfolio’daki yıldız düğmesiyle seçkini oluştur."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={s.primary}
                      onClick={() => uploadInput.current?.click()}
                    >
                      + Görsel ekle
                    </button>
                    <input
                      ref={uploadInput}
                      className={s.hidden}
                      aria-label="Portfolio görseli yükle"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => void upload(e, "portfolio")}
                    />
                  </div>
                  {!selectedWorks.length && (
                    <div className={s.empty}>
                      <b>
                        Henüz {tab === "featured" ? "öne çıkan" : "eklenmiş"}{" "}
                        çalışma yok.
                      </b>
                      <p>Portfolio’na bir çalışma ekleyerek başlayabilirsin.</p>
                    </div>
                  )}
                  <div className={s.workGrid}>
                    {selectedWorks.map((work) => (
                      <article
                        key={work.id}
                        className={s.workCard}
                        draggable={tab === "portfolio" && !busy && !uploading}
                        onDragStart={() => {
                          drag.current = work.id;
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (drag.current)
                            move(
                              drag.current,
                              draft.works.findIndex((w) => w.id === work.id),
                            );
                          drag.current = null;
                        }}
                      >
                        <div className={s.workImage}>
                          <img
                            src={draft.urls[work.storage_path]}
                            alt={work.title || "Portfolio çalışması"}
                            loading="lazy"
                            width={600}
                            height={750}
                          />
                          <button
                            type="button"
                            className={s.star}
                            aria-label={
                              work.featured
                                ? "Öne çıkanlardan kaldır"
                                : "Öne çıkar"
                            }
                            aria-pressed={work.featured}
                            onClick={() =>
                              changeWork(work.id, { featured: !work.featured })
                            }
                          >
                            {work.featured ? "★" : "☆"}
                          </button>
                        </div>
                        <div className={s.workFields}>
                          <label>
                            Başlık
                            <input
                              maxLength={140}
                              value={work.title}
                              onChange={(e) =>
                                changeWork(work.id, { title: e.target.value })
                              }
                            />
                          </label>
                          <label>
                            Stil
                            <input
                              maxLength={100}
                              value={work.style}
                              onChange={(e) =>
                                changeWork(work.id, { style: e.target.value })
                              }
                            />
                          </label>
                          <label>
                            Açıklama
                            <textarea
                              rows={2}
                              maxLength={1000}
                              value={work.description}
                              onChange={(e) =>
                                changeWork(work.id, {
                                  description: e.target.value,
                                })
                              }
                            />
                          </label>
                          <div className={s.workActions}>
                            <button
                              type="button"
                              aria-label="Çalışmayı önceye taşı"
                              disabled={work.sort_order === 0}
                              onClick={() => move(work.id, work.sort_order - 1)}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              aria-label="Çalışmayı sonraya taşı"
                              disabled={
                                work.sort_order === draft.works.length - 1
                              }
                              onClick={() => move(work.id, work.sort_order + 1)}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className={s.quiet}
                              onClick={() => {
                                if (
                                  !window.confirm(
                                    "Bu çalışma taslaktan kaldırılsın mı?",
                                  )
                                )
                                  return;
                                pendingDelete.current.add(work.storage_path);
                                setDraft((d) =>
                                  d
                                    ? {
                                        ...d,
                                        works: d.works
                                          .filter((w) => w.id !== work.id)
                                          .map((w, i) => ({
                                            ...w,
                                            sort_order: i,
                                          })),
                                      }
                                    : d,
                                );
                              }}
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
              {tab === "appearance" && (
                <div className={s.themes}>
                  {themes.map((theme, i) => (
                    <button
                      type="button"
                      key={theme}
                      className={`${s.theme} ${s[theme]}`}
                      aria-pressed={draft.profile.theme === theme}
                      onClick={() => change("theme", theme)}
                    >
                      <div className={s.themeSwatch}>
                        <b>K.</b>
                        <span>{theme === "chaos" ? "✳" : "/"}</span>
                        <i />
                        <i />
                        <i />
                      </div>
                      <div>
                        <small>
                          0{i + 1} /{" "}
                          {draft.profile.theme === theme ? "SEÇİLİ" : "TEMA"}
                        </small>
                        <h2>{theme.toUpperCase()}</h2>
                        <p>
                          {theme === "archive"
                            ? "Analog. Editorial. Zamansız."
                            : theme === "darkroom"
                              ? "Karanlık. Sade. Fotoğraf odaklı."
                              : "Punk. Doodle. Kontrollü kaos."}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {(tab === "appointments" || tab === "artists") && (
                <Operations
                  account={account}
                  mode={tab}
                  busy={busy}
                  run={run}
                  notify={setNotice}
                />
              )}
            </fieldset>
          </section>
          <aside className={s.preview}>
            <div className={s.previewHead}>
              <span>TASLAK ÖNİZLEMESİ</span>
              <Link
                href={`/artists/${account.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Yayındaki profili aç ↗
              </Link>
            </div>
            <div className={s.previewCanvas}>
              <ArtistProfile
                profile={draft.profile}
                works={draft.works}
                branch={account.branch}
                urls={draft.urls}
                preview
              />
            </div>
            <p className={s.previewNote}>
              Bu alan taslağını gösterir. Yayına almak için önce kaydet, sonra
              yayınla.
            </p>
          </aside>
        </div>
        <footer className={s.mobileFooter}>
          {uploading
            ? "Görsel yükleniyor…"
            : busy
              ? "İşlem sürüyor…"
              : dirty
                ? "Kaydedilmemiş değişiklikler var."
                : "Her şey yerinde."}
        </footer>
      </div>
    </div>
  );
}
