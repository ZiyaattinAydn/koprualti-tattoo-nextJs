"use client";
import { useEffect, useRef, useState } from "react";

type Service = "tattoo" | "piercing" | "coverup" | "kararsızım";
const choices: [Service, string][] = [
  ["tattoo", "Tattoo"],
  ["piercing", "Piercing"],
  ["coverup", "Cover-Up"],
  ["kararsızım", "Kararsızım"],
];
export function AppointmentPage() {
  const [step, setStep] = useState(0),
    [service, setService] = useState<Service>("tattoo"),
    [branch, setBranch] = useState("Alsancak"),
    [prefill, setPrefill] = useState("");
  const headings = useRef<Array<HTMLHeadingElement | null>>([]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requested = params.get("service")?.toLocaleLowerCase("tr-TR");
    if (choices.some(([value]) => value === requested)) {
      setService(requested as Service);
      setPrefill(
        requested === "coverup"
          ? "Cover-Up"
          : requested!.charAt(0).toUpperCase() + requested!.slice(1),
      );
    }
    const requestedBranch = params.get("branch");
    if (requestedBranch) {
      const matched = ["Alsancak", "Karşıyaka"].find(
        (name) =>
          name.toLocaleLowerCase("tr-TR") ===
          requestedBranch.toLocaleLowerCase("tr-TR"),
      );
      if (matched) setBranch(matched);
    }
  }, []);
  const navigate = (next: number) => {
    setStep(Math.max(0, Math.min(2, next)));
    requestAnimationFrame(() =>
      headings.current[Math.max(0, Math.min(2, next))]?.focus({
        preventScroll: true,
      }),
    );
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <main className="appointment-page appointment-page-v33">
      <section className="booking-stage" aria-labelledby="booking-title">
        <div className="container booking-layout">
          <aside className="booking-intro reveal">
            <div className="booking-kicker">
              <span className="booking-line" aria-hidden="true" />
              06 / RANDEVU · İZMİR
            </div>
            <h1 id="booking-title">
              <span className="booking-main">FİKRİNİ</span>
              <span className="booking-mid">BİZE</span>
              <span className="booking-sign">BIRAK.</span>
            </h1>
            <p>
              İşlemi seç, şubeyi belirle, aklındaki fikri ve varsa
              referanslarını ekle. Gerisini stüdyo seninle birlikte
              netleştirsin.
            </p>
            <div
              className="steps booking-journey"
              aria-label="Randevu adımları"
            >
              {["İŞLEM", "DETAYLAR", "İLETİŞİM"].map((label, i) => (
                <i
                  key={label}
                  className={i <= step ? "active" : ""}
                  aria-current={i === step ? "step" : undefined}
                >
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>{label}</span>
                </i>
              ))}
            </div>
            <div className="booking-signature">
              KÖPRÜALTI TATTOO &amp; PIERCING <span>—</span> SINCE 1993
            </div>
          </aside>
          <div className="booking-form-card reveal d1">
            <div className="booking-form-header">
              <div>
                <span className="booking-form-label">
                  KÖPRÜALTI / RANDEVU TALEBİ
                </span>
                <h2>Nasıl başlayalım?</h2>
              </div>
              <span className="booking-count">
                <b>{String(step + 1).padStart(2, "0")}</b>
                <span> / 03</span>
              </span>
            </div>
            <div className="booking-rule" aria-hidden="true" />
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {prefill && (
                <div className="appointment-service-note show" role="status">
                  {prefill} seçili geldi. İstersen değiştirebilirsin.
                </div>
              )}
              <div
                className={`formpage${step === 0 ? " active" : ""}`}
                inert={step !== 0}
                aria-hidden={step !== 0}
              >
                <h3
                  ref={(el) => {
                    headings.current[0] = el;
                  }}
                  tabIndex={-1}
                >
                  1. Ne yaptırmak istiyorsun?
                </h3>
                <p className="booking-field-hint">
                  Aklındaki fikre en yakın seçeneği işaretle.
                </p>
                <div className="choices">
                  {choices.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`choice${service === value ? " active" : ""}`}
                      aria-pressed={service === value}
                      onClick={() => setService(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="formactions">
                  <span />
                  <button
                    type="button"
                    className="btn purple"
                    onClick={() => navigate(1)}
                  >
                    Devam et <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
              <div
                className={`formpage${step === 1 ? " active" : ""}`}
                inert={step !== 1}
                aria-hidden={step !== 1}
              >
                <h3
                  ref={(el) => {
                    headings.current[1] = el;
                  }}
                  tabIndex={-1}
                >
                  2. Şube ve fikir
                </h3>
                <p className="booking-field-hint">
                  Çalışmanın detaylarını burada konuşmaya başlayalım.
                </p>
                <div className="field">
                  <label htmlFor="booking-branch">ŞUBE</label>
                  <select
                    id="booking-branch"
                    name="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value="Alsancak">Alsancak</option>
                    <option value="Karşıyaka">Karşıyaka</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="booking-idea">KISACA ANLAT</label>
                  <textarea
                    id="booking-idea"
                    placeholder="Aklındaki fikri anlat..."
                  />
                </div>
                <div className="field">
                  <label htmlFor="booking-reference">REFERANS GÖRSELİ</label>
                  <input id="booking-reference" type="file" accept="image/*" />
                </div>
                <div className="formactions">
                  <button
                    type="button"
                    className="btn dark"
                    onClick={() => navigate(0)}
                  >
                    ← Geri
                  </button>
                  <button
                    type="button"
                    className="btn purple"
                    onClick={() => navigate(2)}
                  >
                    Devam et ↗
                  </button>
                </div>
              </div>
              <div
                className={`formpage${step === 2 ? " active" : ""}`}
                inert={step !== 2}
                aria-hidden={step !== 2}
              >
                <h3
                  ref={(el) => {
                    headings.current[2] = el;
                  }}
                  tabIndex={-1}
                >
                  3. Sana nasıl ulaşalım?
                </h3>
                <p className="booking-field-hint">
                  Detayları konuşmak için iletişim bilgilerini bırak.
                </p>
                <div className="field">
                  <label htmlFor="booking-name">AD SOYAD</label>
                  <input id="booking-name" type="text" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="booking-phone">TELEFON</label>
                  <input id="booking-phone" type="tel" autoComplete="tel" />
                </div>
                <div className="field">
                  <label htmlFor="booking-email">E-POSTA</label>
                  <input id="booking-email" type="email" autoComplete="email" />
                </div>
                <div className="formactions">
                  <button
                    type="button"
                    className="btn dark"
                    onClick={() => navigate(1)}
                  >
                    ← Geri
                  </button>
                  <button type="submit" className="btn purple">
                    Talebi gönder ↗
                  </button>
                </div>
              </div>
              <p className="appointment-form-note">
                Bu taslakta gönderim henüz aktif değil. Gerçek randevu
                bağlantısı geliştirme aşamasında eklenecek.
              </p>
            </form>
          </div>
        </div>
        <div className="container booking-bottom" aria-label="Stüdyo bilgisi">
          <span>
            ALSANCAK <i>✳</i> KARŞIYAKA
          </span>
          <span>İŞİN HİKÂYESİ BURADA BAŞLAR.</span>
        </div>
      </section>
    </main>
  );
}
