"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Service = "tattoo" | "piercing" | "coverup" | "kararsızım";
type AppointmentMode = "standard" | "ataturk";

const choices: [Service, string][] = [
  ["tattoo", "Tattoo"],
  ["piercing", "Piercing"],
  ["coverup", "Cover-Up"],
  ["kararsızım", "Kararsızım"],
];

const artists = ["Farketmez", "Doktor", "Cansın", "Birsu"];
const branches = ["Alsancak", "Karşıyaka"];

export function AppointmentPage() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<AppointmentMode>("standard");
  const [service, setService] = useState<Service>("tattoo");
  const [branch, setBranch] = useState("Alsancak");
  const [artist, setArtist] = useState("Farketmez");
  const [idea, setIdea] = useState("");
  const [placement, setPlacement] = useState("");
  const [size, setSize] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prefill, setPrefill] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const headings = useRef<Array<HTMLHeadingElement | null>>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedMode = params.get("mode")?.toLocaleLowerCase("tr-TR");
    if (requestedMode === "ataturk") {
      setMode("ataturk");
      setPrefill("Atatürk İmzası randevu akışı seçili geldi.");
    }

    const requested = params.get("service")?.toLocaleLowerCase("tr-TR");
    if (requested === "ataturk") {
      setMode("ataturk");
      setPrefill("Atatürk İmzası randevu akışı seçili geldi.");
    } else if (choices.some(([value]) => value === requested)) {
      setService(requested as Service);
      setPrefill(
        requested === "coverup"
          ? "Cover-Up seçili geldi. İstersen değiştirebilirsin."
          : `${requested!.charAt(0).toUpperCase() + requested!.slice(1)} seçili geldi. İstersen değiştirebilirsin.`,
      );
    }

    const requestedBranch = params.get("branch");
    if (requestedBranch) {
      const matched = branches.find(
        (branchName) =>
          branchName.toLocaleLowerCase("tr-TR") ===
          requestedBranch.toLocaleLowerCase("tr-TR"),
      );
      if (matched) setBranch(matched);
    }

    const requestedArtist = params.get("artist");
    if (requestedArtist) {
      const matched = artists.find(
        (artistName) =>
          artistName.toLocaleLowerCase("tr-TR") ===
          requestedArtist.toLocaleLowerCase("tr-TR"),
      );
      if (matched) setArtist(matched);
    }
  }, []);

  const navigate = (next: number) => {
    const safeNext = Math.max(0, Math.min(2, next));
    setStep(safeNext);
    setSubmitted(false);
    requestAnimationFrame(() =>
      headings.current[safeNext]?.focus({ preventScroll: true }),
    );
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  const switchMode = (nextMode: AppointmentMode) => {
    setMode(nextMode);
    setStep(0);
    setSubmitted(false);
    setPrefill("");
  };

  const requestSummary = useMemo(() => {
    const serviceLabel = choices.find(([value]) => value === service)?.[1] ?? service;
    if (mode === "ataturk") {
      return [
        "ATATÜRK İMZASI RANDEVUSU",
        `Şube tercihi: ${branch}`,
        `Yerleşim: ${placement || "Belirtilmedi"}`,
        `Boyut tercihi: ${size || "Belirtilmedi"}`,
        `Ad Soyad: ${name || "Belirtilmedi"}`,
        `Telefon: ${phone || "Belirtilmedi"}`,
        `E-posta: ${email || "Belirtilmedi"}`,
      ].join("\n");
    }
    return [
      "NORMAL RANDEVU TALEBİ",
      `Hizmet: ${serviceLabel}`,
      `Sanatçı tercihi: ${artist}`,
      `Şube: ${branch}`,
      `Fikir: ${idea || "Belirtilmedi"}`,
      `Ad Soyad: ${name || "Belirtilmedi"}`,
      `Telefon: ${phone || "Belirtilmedi"}`,
      `E-posta: ${email || "Belirtilmedi"}`,
    ].join("\n");
  }, [artist, branch, email, idea, mode, name, phone, placement, service, size]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main
      className={`appointment-page appointment-page-v33 appointment-s3${mode === "ataturk" ? " appointment-s3--ataturk" : ""}`}
    >
      <section className="booking-stage" aria-labelledby="booking-title">
        <div className="container appointment-s3-modebar" aria-label="Randevu türü">
          <button
            type="button"
            className={mode === "standard" ? "active" : ""}
            aria-pressed={mode === "standard"}
            onClick={() => switchMode("standard")}
          >
            <small>01</small>
            <span>Normal Randevu</span>
            <b>Tattoo · Piercing · Cover-Up</b>
          </button>
          <button
            type="button"
            className={`appointment-s3-ataturk-tab${mode === "ataturk" ? " active" : ""}`}
            aria-pressed={mode === "ataturk"}
            onClick={() => switchMode("ataturk")}
          >
            <small>02</small>
            <span>Atatürk İmzası Randevusu</span>
            <b>Özel akış · ayrı talep</b>
          </button>
        </div>

        <div className="container booking-layout">
          <aside className="booking-intro reveal">
            <div className="booking-kicker">
              <span className="booking-line" aria-hidden="true" />
              {mode === "ataturk" ? "ATATÜRK İMZASI · RANDEVU" : "06 / RANDEVU · İZMİR"}
            </div>
            <h1 id="booking-title">
              {mode === "ataturk" ? (
                <>
                  <span className="booking-main">İMZAYI</span>
                  <span className="booking-mid">BİRLİKTE</span>
                  <span className="booking-sign">TAŞI.</span>
                </>
              ) : (
                <>
                  <span className="booking-main">FİKRİNİ</span>
                  <span className="booking-mid">BİZE</span>
                  <span className="booking-sign">BIRAK.</span>
                </>
              )}
            </h1>
            <p>
              {mode === "ataturk"
                ? "Atatürk imzası için şube tercihini, yerleşim fikrini ve iletişim bilgilerini bırak. Uygun ekip ve saat, stüdyonun dönüşünde kesinleşsin."
                : "İşlemi seç, sanatçı ve şube tercihini belirle, aklındaki fikri ve varsa referanslarını ekle. Gerisini stüdyo seninle birlikte netleştirsin."}
            </p>
            <div className="steps booking-journey" aria-label="Randevu adımları">
              {(mode === "ataturk"
                ? ["TERCİH", "YERLEŞİM", "İLETİŞİM"]
                : ["İŞLEM", "DETAYLAR", "İLETİŞİM"]
              ).map((label, index) => (
                <i
                  key={label}
                  className={index <= step ? "active" : ""}
                  aria-current={index === step ? "step" : undefined}
                >
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <span>{label}</span>
                </i>
              ))}
            </div>
            {mode === "ataturk" && (
              <div className="appointment-s3-ataturk-note">
                <span>29.10.2007 → bugün</span>
                <strong>Ücretsiz Atatürk imzası geleneği</strong>
                <p>
                  Sabit gün/saat, uygulayıcı ve şube kapsamı işletme tarafından
                  doğrulandığında bu akışa doğrudan eklenecek.
                </p>
              </div>
            )}
            <div className="booking-signature">
              KÖPRÜALTI TATTOO &amp; PIERCING <span>—</span> SINCE 1993
            </div>
          </aside>

          <div className="booking-form-card reveal d1">
            <div className="booking-form-header">
              <div>
                <span className="booking-form-label">
                  KÖPRÜALTI / {mode === "ataturk" ? "ATATÜRK İMZASI" : "RANDEVU TALEBİ"}
                </span>
                <h2>{mode === "ataturk" ? "İmza randevusunu oluşturalım." : "Nasıl başlayalım?"}</h2>
              </div>
              <span className="booking-count">
                <b>{String(step + 1).padStart(2, "0")}</b>
                <span> / 03</span>
              </span>
            </div>
            <div className="booking-rule" aria-hidden="true" />

            <form className="form" onSubmit={submit}>
              {prefill && (
                <div className="appointment-service-note show" role="status">
                  {prefill}
                </div>
              )}

              <div
                className={`formpage${step === 0 ? " active" : ""}`}
                inert={step !== 0}
                aria-hidden={step !== 0}
              >
                <h3
                  ref={(element) => {
                    headings.current[0] = element;
                  }}
                  tabIndex={-1}
                >
                  {mode === "ataturk"
                    ? "1. Hangi şube sana daha uygun?"
                    : "1. Ne yaptırmak istiyorsun?"}
                </h3>
                <p className="booking-field-hint">
                  {mode === "ataturk"
                    ? "Şube tercihini bırak; kesin uygunluk stüdyo dönüşünde netleşsin."
                    : "Hizmeti seç. Sanatçı ve şube tercihini bir sonraki adımda belirleyebilirsin."}
                </p>

                {mode === "standard" ? (
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
                ) : (
                  <div className="choices appointment-s3-branch-choices">
                    {branches.map((branchName) => (
                      <button
                        key={branchName}
                        type="button"
                        className={`choice${branch === branchName ? " active" : ""}`}
                        aria-pressed={branch === branchName}
                        onClick={() => setBranch(branchName)}
                      >
                        {branchName}
                      </button>
                    ))}
                  </div>
                )}

                <div className="formactions">
                  <span />
                  <button type="button" className="btn purple" onClick={() => navigate(1)}>
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
                  ref={(element) => {
                    headings.current[1] = element;
                  }}
                  tabIndex={-1}
                >
                  {mode === "ataturk" ? "2. Yerleşim ve boyut" : "2. Sanatçı, şube ve fikir"}
                </h3>
                <p className="booking-field-hint">
                  {mode === "ataturk"
                    ? "Nereye düşündüğünü ve yaklaşık ölçüyü yaz. Kesin yerleşim randevuda birlikte değerlendirilir."
                    : "Tercihlerini bırak; müsaitlik ve işin stiline göre stüdyo seninle netleştirsin."}
                </p>

                {mode === "standard" ? (
                  <>
                    <div className="appointment-s3-two-fields">
                      <div className="field">
                        <label htmlFor="booking-artist">SANATÇI</label>
                        <select
                          id="booking-artist"
                          name="artist"
                          value={artist}
                          onChange={(event) => setArtist(event.target.value)}
                        >
                          {artists.map((artistName) => (
                            <option key={artistName} value={artistName}>
                              {artistName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="booking-branch">ŞUBE</label>
                        <select
                          id="booking-branch"
                          name="branch"
                          value={branch}
                          onChange={(event) => setBranch(event.target.value)}
                        >
                          {branches.map((branchName) => (
                            <option key={branchName} value={branchName}>
                              {branchName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="booking-idea">KISACA ANLAT</label>
                      <textarea
                        id="booking-idea"
                        value={idea}
                        onChange={(event) => setIdea(event.target.value)}
                        placeholder="Aklındaki fikri, yaklaşık bölgeyi ve ölçüyü anlat..."
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="booking-reference">REFERANS GÖRSELİ</label>
                      <input id="booking-reference" type="file" accept="image/*" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="field">
                      <label htmlFor="ataturk-placement">UYGULAMA BÖLGESİ</label>
                      <input
                        id="ataturk-placement"
                        value={placement}
                        onChange={(event) => setPlacement(event.target.value)}
                        placeholder="Örn. iç kol, bilek, ön kol..."
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="ataturk-size">BOYUT TERCİHİ</label>
                      <input
                        id="ataturk-size"
                        value={size}
                        onChange={(event) => setSize(event.target.value)}
                        placeholder="Biliyorsan yaklaşık cm veya küçük / orta / büyük"
                      />
                    </div>
                    <div className="appointment-s3-info-card">
                      Atatürk sayfasındaki mevcut bilgilere göre uygulama 6 farklı
                      boyut seçeneğiyle planlanabiliyor ve ücretsiz geleneğin bir
                      parçası olarak sunuluyor. Kesin detaylar stüdyo tarafından
                      randevu dönüşünde doğrulanmalı.
                    </div>
                  </>
                )}

                <div className="formactions">
                  <button type="button" className="btn dark" onClick={() => navigate(0)}>
                    ← Geri
                  </button>
                  <button type="button" className="btn purple" onClick={() => navigate(2)}>
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
                  ref={(element) => {
                    headings.current[2] = element;
                  }}
                  tabIndex={-1}
                >
                  3. Sana nasıl ulaşalım?
                </h3>
                <p className="booking-field-hint">
                  Randevu saatini ve son detayları konuşmak için iletişim bilgilerini bırak.
                </p>
                <div className="field">
                  <label htmlFor="booking-name">AD SOYAD</label>
                  <input
                    id="booking-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="booking-phone">TELEFON</label>
                  <input
                    id="booking-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="booking-email">E-POSTA</label>
                  <input
                    id="booking-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="formactions">
                  <button type="button" className="btn dark" onClick={() => navigate(1)}>
                    ← Geri
                  </button>
                  <button type="submit" className="btn purple">
                    Talebi hazırla ↗
                  </button>
                </div>
              </div>

              {submitted && (
                <div className="appointment-s3-ready" role="status">
                  <span>TALEP ÖZETİ HAZIR</span>
                  <pre>{requestSummary}</pre>
                  <p>
                    Form verisi şu an dışarı gönderilmiyor. WhatsApp, Instagram,
                    e-posta veya admin hedefi netleştiğinde bu buton gerçek gönderim
                    aksiyonuna bağlanacak.
                  </p>
                </div>
              )}

              <p className="appointment-form-note">
                Gönderim hedefi henüz tanımlı değil. Bu sprintte akış ve veri yapısı
                hazırlandı; canlı gönderim işletmenin tercih edeceği kanala bağlanacak.
              </p>
            </form>
          </div>
        </div>

        <div className="container booking-bottom" aria-label="Stüdyo bilgisi">
          <span>
            ALSANCAK <i>✳</i> KARŞIYAKA
          </span>
          <span>
            {mode === "ataturk" ? "BİR İMZADAN FAZLASI." : "İŞİN HİKÂYESİ BURADA BAŞLAR."}
          </span>
        </div>
      </section>
    </main>
  );
}
