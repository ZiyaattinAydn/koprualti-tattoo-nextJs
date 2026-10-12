"use client";
import { useState } from "react";
type Application = "tattoo" | "piercing" | "coverup";
type Artist = "unknown" | "doktor" | "cansin" | "su" | "birsu";
type Work = {
  src: string;
  title: string;
  description: string;
  types: Application[];
  artist: Artist;
};
// Attribution is intentionally unknown until the studio confirms the work.
const work: Work[] = [
  {
    src: "/assets/work1.jpg",
    title: "Stüdyo arşivi / duvar fotoğrafı",
    description:
      "Bu fotoğraf bir uygulama veya sanatçıya atanmamış arşiv görselidir.",
    types: [],
    artist: "unknown",
  },
  {
    src: "/assets/work2.jpg",
    title: "Stüdyo arşivi / sergi alanı",
    description:
      "Bu fotoğraf bir uygulama veya sanatçıya atanmamış arşiv görselidir.",
    types: [],
    artist: "unknown",
  },
  {
    src: "/assets/work3.jpg",
    title: "Stüdyo arşivi / çizimler",
    description:
      "Bu fotoğraf bir uygulama veya sanatçıya atanmamış arşiv görselidir.",
    types: [],
    artist: "unknown",
  },
  {
    src: "/assets/work4.jpg",
    title: "Stüdyo arşivi / çizimler",
    description:
      "Bu fotoğraf bir uygulama veya sanatçıya atanmamış arşiv görselidir.",
    types: [],
    artist: "unknown",
  },
  {
    src: "/assets/studio1.jpg",
    title: "Stüdyo iç mekân detayı",
    description:
      "Bu fotoğraf bir uygulama veya sanatçıya atanmamış arşiv görselidir.",
    types: [],
    artist: "unknown",
  },
  {
    src: "/assets/studio2.jpg",
    title: "Stüdyo iç mekân detayı",
    description:
      "Bu fotoğraf bir uygulama veya sanatçıya atanmamış arşiv görselidir.",
    types: [],
    artist: "unknown",
  },
];
const filters: [Application, string][] = [
  ["tattoo", "Tattoo"],
  ["piercing", "Piercing"],
  ["coverup", "Cover-Up"],
];
export function PortfolioPage() {
  const [types, setTypes] = useState<Application[]>([]),
    [artist, setArtist] = useState("all");
  const shown = work.filter(
    (item) =>
      (!types.length || item.types.some((type) => types.includes(type))) &&
      (artist === "all" || item.artist === artist),
  );
  const reset = () => {
    setTypes([]);
    setArtist("all");
  };
  return (
    <div className="portfolio-page">
      <main>
        <section className="pagehero">
          <div className="container">
            <div className="crumb">ANASAYFA / PORTFOLYO</div>
            <div className="eyebrow">KÖPRÜALTI WORKS</div>
            <h1>Portfolyo</h1>
            <p>
              Stüdyo arşivine göz at. Uygulama ve sanatçı bilgisi doğrulanan
              çalışmalar filtrelere eklenecek.
            </p>
          </div>
        </section>
        <section className="portfolio-section">
          <div className="container" data-portfolio>
            <div
              className="portfolio-controls"
              aria-label="Portfolyo filtreleri"
            >
              <div className="portfolio-controls-top">
                <div>
                  <h2>İşlere göz at.</h2>
                  <p>
                    Uygulama türlerini birlikte seçebilir, ardından sanatçıya
                    göre daraltabilirsin.
                  </p>
                </div>
              </div>
              <div className="portfolio-fields">
                <div className="portfolio-field">
                  <span className="portfolio-field-label">
                    01 / Uygulama türü
                  </span>
                  <div
                    className="portfolio-types"
                    role="group"
                    aria-label="Uygulama türü"
                  >
                    <button
                      type="button"
                      className={!types.length ? "active" : ""}
                      aria-pressed={!types.length}
                      onClick={() => setTypes([])}
                    >
                      Bütün Tasarımlar
                    </button>
                    {filters.map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className={types.includes(key) ? "active" : ""}
                        aria-pressed={types.includes(key)}
                        onClick={() =>
                          setTypes((current) =>
                            current.includes(key)
                              ? current.filter((x) => x !== key)
                              : [...current, key],
                          )
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="portfolio-field portfolio-artist">
                  <label
                    className="portfolio-field-label"
                    htmlFor="portfolio-artist"
                  >
                    02 / Sanatçı
                  </label>
                  <div className="portfolio-select-wrap">
                    <select
                      id="portfolio-artist"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                    >
                      <option value="all">Tüm sanatçılar</option>
                      <option value="doktor">Doktor</option>
                      <option value="cansin">Cansın</option>
                      <option value="su">Su</option>
                      <option value="birsu">Birsu</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="portfolio-controls-foot">
                <span
                  className="portfolio-count"
                  role="status"
                  aria-live="polite"
                >
                  {shown.length} görsel gösteriliyor
                </span>
                <button
                  className="portfolio-reset"
                  type="button"
                  disabled={!types.length && artist === "all"}
                  onClick={reset}
                >
                  Filtreleri sıfırla
                </button>
              </div>
            </div>
            <div className="portfolio-grid">
              {shown.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  className="portfolio-card"
                  data-lightbox
                  data-full={item.src}
                  data-title={item.title}
                  data-type="Stüdyo arşivi"
                  data-artist-label="Sanatçı belirtilmemiş"
                  data-description={item.description}
                >
                  <span className="portfolio-card-image">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="portfolio-card-index">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(shown.length).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="portfolio-card-info">
                    <span className="portfolio-card-kind">
                      KÖPRÜALTI / ARŞİV
                    </span>
                    <span className="portfolio-card-title">{item.title}</span>
                    <span className="portfolio-card-artist">
                      Sanatçı belirtilmemiş
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {!shown.length && (
              <div className="portfolio-empty" data-filter-empty>
                <div>
                  <span className="empty-mark" aria-hidden="true">
                    ✳
                  </span>
                  <h3>Bu seçimde henüz görsel yok.</h3>
                  <p>
                    Mevcut fotoğraflar stüdyo arşivinden. Uygulama türü ve
                    sanatçısı doğrulanmış görseller eklendiğinde burada
                    listelenecek.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
