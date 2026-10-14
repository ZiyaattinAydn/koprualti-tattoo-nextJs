import Link from "next/link";
/* Original v58 content expressed as native TSX; extracted from the approved static page. */
export function AtaturkPage() {
  return (
    <div className="ataturk-page">
      <main>
        <section className="ataturk-hero ataturk-hero-v3">
          <div className="wrap reveal">
            <div className="ataturk-hero-top">
              <div className="crumb">ANASAYFA / ATATÜRK İMZASI</div>
              <h1 className="heritage">Atatürk</h1>
              <p className="ataturk-intro centered">
                29.10.2007 tarihinden bu yana Köprüaltı'nda ücretsiz olarak
                uygulanan Atatürk imzası geleneği, sadece bir dövme kampanyası
                değil; görünür bir saygı, hafızada kalan bir tavır ve yıllardır
                devam eden bir duruş biçimi.
              </p>
            </div>
            <div className="ataturk-hero-stage">
              <figure className="ataturk-portrait-stage reveal d1">
                <img
                  src="/assets/ataturk-portrait.png"
                  alt="Mustafa Kemal Atatürk portresi"
                  data-lightbox-image=""
                  role="button"
                  tabIndex={0}
                  aria-label="Mustafa Kemal Atatürk portresi görselini büyüt"
                />
              </figure>
              <div className="ataturk-side-info reveal d2">
                <div className="ataturk-counter cardish">
                  <strong>36912</strong>
                  <span>ATATÜRK İMZASI YAPILDI</span>
                </div>
                <div className="ataturk-quote-card">
                  <div className="eyebrow">ATATÜRK'TEN</div>
                  <blockquote className="heritage">
                    “Bütün ümidim gençliktedir.”
                  </blockquote>
                  <p>
                    Bu sayfanın taşıdığı ruh da tam olarak buna dayanıyor:
                    hafızayı, tavrı ve emaneti gelecek kuşaklara aktarmak.
                  </p>
                  <span className="quote-sign">— Mustafa Kemal Atatürk</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ataturk-story">
          <div className="wrap ataturk-story-grid reveal d1">
            <div>
              <div className="eyebrow">01 / HİKÂYE</div>
              <h2 className="heritage">Bir imzadan fazlası.</h2>
              <p>
                Bu geleneğin çıkış noktası, bir müşterinin taşıdığı Atatürk
                imzasını iş ve sosyal baskılar nedeniyle sildirmek zorunda
                kalmasıydı. Köprüaltı bu hikâyeyi geri çekilerek değil; tam
                tersine daha görünür bir cevap vererek karşıladı.
              </p>
              <p>
                O günden beri Atatürk imzası isteyenlere ücretsiz uygulama
                yapılması, stüdyonun kendi içinde büyüttüğü bir söz haline
                geldi. Amaç sansasyon değil; hatırlatıcı bir iz bırakmak,
                isteyen herkesin bu sembole ulaşabilmesini sağlamak.
              </p>
            </div>
            <aside className="ataturk-note-card">
              <small>ATATÜRK İMZASI</small>
              <h3>Ücretsiz uygulama geleneği</h3>
              <ul>
                <li>Tek kullanımlık malzeme</li>
                <li>6 farklı boyut seçeneği</li>
                <li>Randevu ile planlama</li>
                <li>18 yaş altı için aile onayı</li>
              </ul>
              <Link className="btn light" href="/appointment/?mode=ataturk">
                Atatürk İmzası Randevusu
              </Link>
            </aside>
          </div>
        </section>

        <section className="ataturk-editorial-section">
          <div className="wrap ataturk-editorial-grid reveal d2">
            <div className="ataturk-editorial-image">
              <img
                src="/assets/ataturk-editorial.png"
                alt="Köprüaltı stüdyosunda sergilenen Atatürk konulu köşe yazısı kupürü"
                data-lightbox-image=""
                role="button"
                tabIndex={0}
                aria-label="Köprüaltı stüdyosunda sergilenen Atatürk konulu köşe yazısı kupürü görselini büyüt"
              />
            </div>
            <div className="ataturk-editorial-copy">
              <div className="eyebrow">02 / KÖŞE YAZISI</div>
              <h2 className="heritage">Duvarda duran kupür.</h2>
              <p>
                Bu görsel, stüdyonun duvarında duran gerçek bir kupür. İçinde
                hem dönemin heyecanı hem de yıllar boyu devam eden bir geleneğin
                tanıklığı var.
              </p>
              <blockquote>
                “Neymiş, işten atarlarmış... Bizim işimiz Atatürk arkadaş.”
              </blockquote>
              <p>
                Final sürümde burayı daha temiz taranmış bir görselle ve yazının
                kısa dökümüyle destekleyeceğiz; şimdilik ruhunu bozmadan arşiv
                halinde taşıyoruz.
              </p>
            </div>
          </div>
        </section>

        <section className="ataturk-stance">
          <div className="container narrow reveal d3">
            <div className="eyebrow">03 / SON NOT</div>
            <h2 className="heritage">Neden sürdürüyoruz?</h2>
            <p>
              Çünkü bazı işler sadece teknik değildir. Bazı dövmeler bir estetik
              tercih olmanın ötesinde; hafıza, bağlılık ve kişisel duruş taşır.
              Köprüaltı'nın Atatürk imzası uygulaması da tam olarak bu yüzden
              yıllardır yaşıyor.
            </p>
            <p>
              Buradaki yaklaşım sert sloganlar kurmak değil; isteyen insana,
              kendi bedeninde taşıyacağı anlamlı bir işaret için temiz, özenli
              ve ulaşılabilir bir alan açmak. Köprüaltı bu geleneği tam da bu
              yüzden devam ettiriyor.
            </p>
          </div>
        </section>

        <section className="ataturk-details-section">
          <div className="wrap reveal d3">
            <div className="section-head section-head-dark">
              <div>
                <div className="eyebrow">04 / KAMPANYA DETAYLARI</div>
                <h2 className="heritage">Nasıl işliyor?</h2>
              </div>
              <p>
                Profesyonel çekimler geldiğinde bu sayfa görsel olarak daha da
                güçlenecek. Şimdilik içerik omurgasını kuruyoruz.
              </p>
            </div>
            <div className="detail-cards">
              <article>
                <h3>Hijyen & Malzeme</h3>
                <p>
                  Kullanılan malzemeler tek kullanımlıktır. Paketler uygulama
                  öncesinde sizin yanınızda açılır.
                </p>
              </article>
              <article>
                <h3>Boyut Seçeneği</h3>
                <p>
                  Atatürk imzası 6 ayrı boyutta uygulanabilir; yerleşim ve ölçü
                  randevuda birlikte netleştirilir.
                </p>
              </article>
              <article>
                <h3>Ücretlendirme</h3>
                <p>
                  Bu uygulama gelenek gereği ücretsizdir. Amaç ticari değil,
                  sembolik bir katkıdır.
                </p>
              </article>
              <article>
                <h3>Randevu</h3>
                <p>
                  Uygulama için stüdyo ile iletişime geçebilir veya randevu
                  sayfasından talep bırakabilirsiniz.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
