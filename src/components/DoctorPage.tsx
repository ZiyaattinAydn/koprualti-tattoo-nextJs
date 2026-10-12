import Link from "next/link";
/* Original v58 content expressed as native TSX; extracted from the approved static page. */
export function DoctorPage() {
  return (
    <div className="artist-detail-page">
      <main>
        <section className="artist-detail-hero">
          <div className="wrap artist-detail-hero-grid">
            <figure className="artist-detail-portrait reveal">
              <img
                src="/assets/doctor-live.png"
                alt="Doktor çalışırken çekilmiş stüdyo fotoğrafı"
                data-lightbox-image=""
                role="button"
                tabIndex={0}
                aria-label="Doktor çalışırken çekilmiş stüdyo fotoğrafı görselini büyüt"
              />
              <figcaption>FOUNDER / TATTOO ARTIST / SINCE 1993</figcaption>
            </figure>
            <div className="artist-detail-copy reveal d1">
              <div className="crumb">SANATÇILAR / DOKTOR</div>
              <div className="eyebrow">01 / PROFİL</div>
              <h1>DOKTOR</h1>
              <p className="artist-detail-lead">
                Bir stüdyonun geçmişi bazen tarih satırlarından değil, yıllardır
                aynı masada biriken konuşmalardan okunur.
              </p>
              <p className="artist-detail-body">
                Köprüaltı'nın kurucusu Doktor; eski memuriyet ve askerlik
                döneminden Beşiktaş'a, oyunlardan çizgi dünyasına kadar farklı
                hikâyeleri stüdyonun karakterine taşıyan isim. “Doktor” lakabı
                da hayatında iz bırakan bir doktordan geliyor. Köprüaltı'nın
                1993'ten bugüne taşıdığı hafızanın merkezinde hâlâ aktif olarak
                çalışıyor.
              </p>

              <div className="artist-detail-meta">
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

              <div className="artist-capabilities">
                <div>
                  <span className="artist-focus-label">UYGULAMA</span>
                  <div className="artist-focus-list">
                    <span>Tattoo</span>
                  </div>
                </div>
                <div>
                  <span className="artist-focus-label">ÇALIŞTIĞI STİLLER</span>
                  <p>
                    Final portfolyo seçkisi netleştiğinde gerçek stil etiketleri
                    buraya eklenecek.
                  </p>
                </div>
              </div>

              <div className="artist-detail-actions">
                <Link className="btn light" href="/appointment/">
                  Randevu Talebi
                </Link>
                <Link className="btn outline" href="/artists/">
                  Tüm Sanatçılar
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="artist-works-section">
          <div className="wrap">
            <div className="artist-works-head reveal">
              <div>
                <div className="eyebrow">02 / SELECTED WORKS</div>
                <h2>
                  STÜDYO
                  <br />
                  ARŞİVİ.
                </h2>
              </div>
              <div className="artist-works-note">
                <p>
                  Bu alandaki fotoğraflar geçici stüdyo arşividir; sanatçıya ait
                  işler olarak doğrulanmamıştır. Doktor’un gerçek işleri
                  seçildiğinde bunlarla değiştirilecek.
                </p>
                <span>GEÇİCİ STÜDYO ARŞİVİ</span>
              </div>
            </div>

            <div className="artist-work-mosaic">
              <button
                className="artist-work-card artist-work-card--hero reveal"
                type="button"
                data-full="/assets/work1.jpg"
                data-lightbox=""
                data-type="Stüdyo arşivi"
                data-artist-label="Sanatçı belirtilmemiş"
                data-description="Bu görsel Doktor’un doğrulanmış uygulaması değildir."
                data-title="Arşiv Görseli 01"
              >
                <img
                  src="/assets/work1.jpg"
                  alt="Geçici stüdyo arşivi görseli 1"
                />
                <div className="artist-work-overlay">
                  <span>ARŞİV / SANATÇI BELİRTİLMEMİŞ</span>
                  <strong>01</strong>
                  <em>FOTOĞRAFI AÇ ↗</em>
                </div>
              </button>
              <button
                className="artist-work-card reveal d1"
                type="button"
                data-full="/assets/work2.jpg"
                data-lightbox=""
                data-type="Stüdyo arşivi"
                data-artist-label="Sanatçı belirtilmemiş"
                data-description="Bu görsel Doktor’un doğrulanmış uygulaması değildir."
                data-title="Arşiv Görseli 02"
              >
                <img
                  src="/assets/work2.jpg"
                  alt="Geçici stüdyo arşivi görseli 2"
                />
                <div className="artist-work-overlay">
                  <span>ARŞİV / SANATÇI BELİRTİLMEMİŞ</span>
                  <strong>02</strong>
                  <em>FOTOĞRAFI AÇ ↗</em>
                </div>
              </button>
              <button
                className="artist-work-card reveal d2"
                type="button"
                data-full="/assets/work3.jpg"
                data-lightbox=""
                data-type="Stüdyo arşivi"
                data-artist-label="Sanatçı belirtilmemiş"
                data-description="Bu görsel Doktor’un doğrulanmış uygulaması değildir."
                data-title="Arşiv Görseli 03"
              >
                <img
                  src="/assets/work3.jpg"
                  alt="Geçici stüdyo arşivi görseli 3"
                />
                <div className="artist-work-overlay">
                  <span>ARŞİV / SANATÇI BELİRTİLMEMİŞ</span>
                  <strong>03</strong>
                  <em>FOTOĞRAFI AÇ ↗</em>
                </div>
              </button>
              <button
                className="artist-work-card artist-work-card--wide reveal d1"
                type="button"
                data-full="/assets/work4.jpg"
                data-lightbox=""
                data-type="Stüdyo arşivi"
                data-artist-label="Sanatçı belirtilmemiş"
                data-description="Bu görsel Doktor’un doğrulanmış uygulaması değildir."
                data-title="Arşiv Görseli 04"
              >
                <img
                  src="/assets/work4.jpg"
                  alt="Geçici stüdyo arşivi görseli 4"
                />
                <div className="artist-work-overlay">
                  <span>ARŞİV / SANATÇI BELİRTİLMEMİŞ</span>
                  <strong>04</strong>
                  <em>FOTOĞRAFI AÇ ↗</em>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="artist-profile-system">
          <div className="wrap artist-profile-system-grid reveal">
            <div>
              <div className="eyebrow">03 / SİSTEM</div>
              <h2>Profil + iş galerisi.</h2>
            </div>
            <div>
              <p>
                Bu sayfa sanatçı detay şablonumuz olacak. Cansın, Su ve
                Birsu'nun bilgileri ve gerçek iş görselleri geldiğinde aynı yapı
                onların profillerine de uygulanacak.
              </p>
              <p>
                Bir iş portfolyoya eklendiğinde sanatçı etiketi üzerinden hem
                genel Portfolyo sayfasında hem de ilgili sanatçının kendi
                galerisinde gösterilebilecek. Böylece aynı görseli iki kez
                yönetmek zorunda kalmayacağız.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
