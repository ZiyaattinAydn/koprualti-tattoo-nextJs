import Link from "next/link";
/* Original v58 content expressed as native TSX; extracted from the approved static page. */
import { TattooCursorCanvas } from "./TattooCursorCanvas";
export function HomePage() {
  return (
    <div>
      <main>
        <section className="hero" data-tattoo-zone="">
          <TattooCursorCanvas />
          <div className="container hero-in">
            <div className="kick">EDİRNE'DEN İZMİR'E · 1993'TEN BERİ</div>
            <h1>
              <span className="hero-brand">Köprüaltı.</span>
              <span className="hero-statement">İş konuşsun.</span>
            </h1>
            <p>
              Dövme, piercing ve cover-up. İki İzmir stüdyosu; yıllara yayılan
              ustalık, kendine has bir mekân kültürü ve işi yapan insanları öne
              çıkaran bir yapı.
            </p>
            <div className="actions">
              <Link className="btn purple" href="/portfolio/">
                İşleri Gör
              </Link>
              <Link className="btn outline" href="/about/">
                1993'e Git
              </Link>
            </div>
            <div className="hero-sound">
              <button
                type="button"
                data-tattoo-sound-toggle=""
                aria-pressed="false"
                disabled
                aria-label="Dövme makinesi sesi henüz eklenmedi"
                title="Ses dosyası eklenince kullanılabilir"
              >
                ♪ Ses yakında
              </button>
              <audio data-tattoo-sound="" preload="none" loop></audio>
            </div>
            <div className="hero-note">
              Köprüaltı moru · mürekkep siyahı · kırık beyaz
            </div>
          </div>
          <div className="hero-meta">
            <div className="container">
              <span>ALSANCAK</span>
              <span>KARŞIYAKA</span>
              <span>K6 · ARCHIVE</span>
            </div>
          </div>
        </section>

        <section className="motif-band" aria-label="Köprüaltı stüdyo çizimleri">
          <div className="container motif-band-inner">
            <p className="motif-band-label">
              STÜDYO
              <br />
              ÇİZGİLERİ
            </p>
            <div className="motif-band-art" aria-hidden="true">
              <img
                src="/assets/doodles/botanical-rose-chalk.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <img
                src="/assets/doodles/fauna-swallow-chalk.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <img
                src="/assets/doodles/symbols-dagger-heart-chalk.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>
        <section className="manifest">
          <div className="container manifest-grid">
            <div className="reveal">
              <div className="eyebrow">01 / HAFIZA</div>
              <h2>
                <span className="manifest-line">DÖVME</span>
                <span className="manifest-line manifest-line--outline">
                  <span className="outline-word">BİR İZ.</span>
                </span>
                <span className="manifest-line">MEKÂN</span>
                <span className="manifest-line manifest-line--last">
                  BİR HAFIZA.
                </span>
              </h2>
            </div>
            <div className="reveal d1">
              <div className="manifest-copy">
                Köprüaltı'nın hikâyesi kişisel hafıza, şehir kültürü, Doktor'un
                dünyası ve yıllar içinde biriken işlerin toplamı gibi okunuyor.
              </div>
              <div className="manifest-note">
                KÖPRÜALTI MORU · MÜREKKEP SİYAHI · KIRIK BEYAZ
              </div>
            </div>
          </div>
        </section>
        <section className="work-section">
          <div className="wrap">
            <div className="work-head reveal">
              <div>
                <div className="eyebrow">02 / İŞLER</div>
                <h2>
                  DUVARDA NE
                  <br />
                  VARSA
                  <br />
                  BURADA DA O<br />
                  VAR.
                </h2>
              </div>
              <p>
                Çizgi, siyah iş, geleneksel motifler ve stüdyo duvarlarında
                yıllar içinde biriken referanslar. Portfolyo, mekânın görsel
                hafızasının devamı gibi ilerliyor.
              </p>
            </div>
            <div
              className="filterbar reveal d1"
              aria-label="Stüdyo fotoğrafları"
            >
              <span className="active">STÜDYO ARŞİVİ</span>
            </div>
            <div className="moodgrid">
              <div className="bigstack">
                <button
                  type="button"
                  className="work-card tall reveal"
                  data-lightbox=""
                  data-type="Stüdyo arşivi"
                  data-artist-label="Sanatçı belirtilmemiş"
                  data-description="Uygulama türü ve sanatçısı doğrulanmamış stüdyo arşivi fotoğrafı."
                >
                  <img
                    src="/assets/work1.jpg"
                    alt="Köprüaltı stüdyo arşivi fotoğrafı"
                  />
                  <div className="card-graphic">
                    <div className="rings"></div>
                  </div>
                  <div className="work-center">K6</div>
                  <div className="work-meta">
                    <span>STÜDYO ARŞİVİ</span>
                    <strong>KÖPRÜALTI</strong>
                  </div>
                </button>
                <button
                  type="button"
                  className="work-card reveal d2"
                  data-lightbox=""
                  data-type="Stüdyo arşivi"
                  data-artist-label="Sanatçı belirtilmemiş"
                  data-description="Uygulama türü ve sanatçısı doğrulanmamış stüdyo arşivi fotoğrafı."
                >
                  <img
                    src="/assets/work4.jpg"
                    alt="Köprüaltı stüdyo arşivi fotoğrafı"
                  />
                  <div className="card-graphic">
                    <div className="line-art"></div>
                  </div>
                  <div className="work-meta">
                    <span>STÜDYO ARŞİVİ</span>
                    <strong>KÖPRÜALTI</strong>
                  </div>
                </button>
              </div>
              <div className="smallstack">
                <button
                  type="button"
                  className="work-card reveal d1"
                  data-lightbox=""
                  data-type="Stüdyo arşivi"
                  data-artist-label="Sanatçı belirtilmemiş"
                  data-description="Uygulama türü ve sanatçısı doğrulanmamış stüdyo arşivi fotoğrafı."
                >
                  <img
                    src="/assets/work2.jpg"
                    alt="Köprüaltı stüdyo arşivi fotoğrafı"
                  />
                  <div className="card-graphic">
                    <div className="diamond"></div>
                  </div>
                  <div className="work-meta">
                    <span>STÜDYO ARŞİVİ</span>
                    <strong>KÖPRÜALTI</strong>
                  </div>
                </button>
                <button
                  type="button"
                  className="work-card reveal d3"
                  data-lightbox=""
                  data-type="Stüdyo arşivi"
                  data-artist-label="Sanatçı belirtilmemiş"
                  data-description="Uygulama türü ve sanatçısı doğrulanmamış stüdyo arşivi fotoğrafı."
                >
                  <img
                    src="/assets/work3.jpg"
                    alt="Köprüaltı stüdyo arşivi fotoğrafı"
                  />
                  <div className="card-graphic">
                    <div className="heart"></div>
                  </div>
                  <div className="work-meta">
                    <span>STÜDYO ARŞİVİ</span>
                    <strong>KÖPRÜALTI</strong>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="doctor-section">
          <div className="wrap doctor-grid">
            <button
              className="doctor-card doctor-card-live reveal"
              type="button"
              data-lightbox=""
              data-full="/assets/doctor-live.png"
              data-title="Doktor çalışırken"
              data-type="Stüdyo fotoğrafı"
              data-description="Doktor’un stüdyoda çalışırken çekilmiş fotoğrafı."
              aria-label="Doktor fotoğrafını büyüt"
            >
              <img
                src="/assets/doctor-live.png"
                alt="Doktor çalışırken çekilmiş stüdyo fotoğrafı"
                loading="lazy"
                decoding="async"
              />
              <span className="doctor-name">DOKTOR</span>
              <span className="doctor-caption">
                FOUNDER / ARCHIVE KEEPER / TATTOO ARTIST
              </span>
            </button>
            <div className="doctor-info reveal d1">
              <div className="eyebrow">03 / PEOPLE</div>
              <h2>DOKTOR</h2>
              <div className="doctor-lead">
                Bir stüdyo bazen duvarlardan değil, onu yıllarca taşıyan
                insanlardan oluşur.
              </div>
              <div className="doctor-copy">
                Köprüaltı'nın hikâyesi lakaplar, askerlik ve memuriyet yılları,
                Beşiktaş, oyunlar, müşteriler ve aynı masanın etrafında biriken
                konuşmalarla büyüyen bir hafıza. Doktor bu hafızanın
                merkezindeki isim.
              </div>
              <div className="doctor-stats">
                <div>
                  <small>ROLE</small>
                  <strong>FOUNDER</strong>
                </div>
                <div>
                  <small>KNOWN AS</small>
                  <strong>DOKTOR</strong>
                </div>
                <div>
                  <small>SINCE</small>
                  <strong>1993</strong>
                </div>
                <div>
                  <small>STATUS</small>
                  <strong>ACTIVE</strong>
                </div>
              </div>
              <div className="doctor-home-action">
                <Link className="btn light" href="/artists/doktor/">
                  Doktor'u Tanı
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="tribute">
          <div className="wrap tribute-grid">
            <div className="reveal">
              <div className="eyebrow" style={{ color: "#f0e5f2" }}>
                04 / GELENEK
              </div>
              <h2>
                <span>Biz Senin</span>
                <span className="tribute-signature">İzindeyiz!</span>
              </h2>
              <p>
                Köprüaltı'nın yıllardır sürdürdüğü ücretsiz Atatürk imzası
                uygulaması, stüdyonun en bilinen geleneklerinden biri. Hikâyesi,
                bir müşterinin yaşadığı deneyimden doğup İzmir'de devam eden bir
                dayanışma biçimine dönüşüyor.
              </p>
              <div style={{ marginTop: "26px" }}>
                <Link className="btn dark" href="/ataturk/">
                  Hikâyeyi Oku
                </Link>
              </div>
            </div>
            <div className="tribute-sign tribute-sign--arm reveal d1">
              <small>ATATÜRK İMZASI</small>
              <strong>K. Atatürk</strong>
              <span>Ücretsiz uygulama geleneği / KöprüAltı</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
