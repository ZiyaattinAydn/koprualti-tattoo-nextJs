import Link from "next/link";
/* Original v58 content expressed as native TSX; extracted from the approved static page. */
export function ArtistsPage() {
  return (
    <div className="artists-page-view">
      <main className="artists-page-v2">
        <section className="pagehero">
          <div className="container">
            <div className="crumb">ANASAYFA / SANATÇILAR</div>

            <h1>İşi yapan insanlar.</h1>
            <p>
              Köprüaltı'nın tonu sadece duvarlarda değil; yıllardır bu masanın
              başında duran, müşteriyle ilişki kuran ve işi taşıyan insanlarda
              da saklı. Bu sayfa final sürüme giderken her sanatçı için daha
              fazla fotoğraf, seçili iş ve uygulama alanı bilgisiyle
              genişleyecek.
            </p>
          </div>
        </section>

        <section id="doktor" className="artist-spotlight doctor-spotlight">
          <div className="wrap artist-spotlight-grid reveal">
            <div className="artist-media artist-media-photo">
              <img
                src="/assets/doctor-live.png"
                alt="Doktor çalışırken çekilmiş stüdyo fotoğrafı"
                data-lightbox-image=""
                role="button"
                tabIndex={0}
                aria-label="Doktor çalışırken çekilmiş stüdyo fotoğrafı görselini büyüt"
              />
            </div>
            <div className="artist-copy">
              <div className="eyebrow">01 / BU ADAM KİM?</div>
              <h2 className="heritage artist-title">Doktor</h2>
              <p className="artist-lead">
                Köprüaltı'nın karakteri biraz sokaktan, biraz arşivden, biraz da
                Doktor'un yıllardır taşıdığı o kendine has dünyadan geliyor.
              </p>
              <p className="artist-body">
                Emekli asker, emekli karikatürist, emekli trompetçi, emekli
                kung-fu ustadı, emekli basketbolcu, emekli aşık, emekli
                gitarist, emekli mangal yelleyicisi, emekli fanzinci, emekli
                motosikletçi, emekli bandocu, emekli alkolik, emekli çizgi roman
                çizeri, emekli bar işletmecisi, emekli Beşiktaşlı, emekli köşe
                yazarı, emekli Ramazan davulcusu, emekli sinema manyağı, emekli
                rocker... Ama bir şeyden emekli değil: <strong>dövme</strong>. O
                masada 1993'ten beri hâlâ aktif.
              </p>
              <div className="artist-focus">
                <span className="artist-focus-label">UYGULAMA ALANLARI</span>
                <div className="artist-focus-list">
                  <span>Tattoo</span>
                  <span>Custom Çalışma</span>
                  <span>Stüdyo Hafızası</span>
                </div>
              </div>
              <div className="artist-tags">
                <span>Founder</span>
                <span>Tattoo Artist</span>
                <span>Archive Spirit</span>
                <span>Since 1993</span>
              </div>
              <div className="artist-profile-action">
                <Link className="btn light" href="/artists/doktor/">
                  Doktor'un Profilini Gör
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="cansin" className="artist-spotlight cansin-spotlight">
          <div className="wrap artist-spotlight-grid reveal d1">
            <div className="artist-media artist-media-placeholder">
              <div className="artist-profile-sheet">
                <div className="artist-profile-sheet__inner">
                  <div className="artist-profile-sheet__eyebrow">
                    02 / PROFİL HAZIRLANIYOR
                  </div>
                  <div className="artist-profile-sheet__mono">C</div>
                  <h3 className="artist-profile-sheet__name">Cansın</h3>
                  <p className="artist-profile-sheet__text">
                    Profesyonel çekimler, seçili işler ve detaylı tanıtım metni
                    geldikçe bu alan tamamlanacak. Şimdilik yapının yerini net
                    biçimde açıyoruz.
                  </p>
                </div>
              </div>
            </div>
            <div className="artist-copy">
              <div className="eyebrow">02 / EKİP</div>
              <h2 className="heritage artist-title">Cansın</h2>
              <p className="artist-lead">
                Cansın için elimizde henüz kapsamlı bir biyografi yok; ama
                sayfadaki yerini Doktor'la aynı sistem içinde şimdiden açıyoruz.
              </p>
              <p className="artist-body">
                Final sürümde burada uzmanlık alanları, çalışma yaklaşımı,
                sevdiği stiller ve seçili uygulamalar yer alacak. Şimdilik bu
                alanı, Köprüaltı ekibinin ikinci yüzünü temsil eden geçici ama
                düzenli bir profil alanı olarak kullanıyoruz. Yeni çekimler ve
                net bilgiler geldikçe bu bölüm daha kişisel, daha dolu ve daha
                net bir profile dönüşecek.
              </p>
              <div className="artist-focus">
                <span className="artist-focus-label">UYGULAMA ALANLARI</span>
                <div className="artist-focus-list">
                  <span>Tattoo</span>
                  <span>Piercing</span>
                  <span>Detaylar Güncellenecek</span>
                </div>
              </div>
              <div className="artist-tags muted-tags">
                <span>Profil Güncelleniyor</span>
                <span>Yeni Çekimler Eklenecek</span>
                <span>Seçili İşler Yakında</span>
              </div>
              <div className="artist-profile-action">
                <span className="btn-ghost">Profil Yakında</span>
              </div>
            </div>
          </div>
        </section>

        <section id="su" className="artist-spotlight su-spotlight">
          <div className="wrap artist-spotlight-grid reveal d2">
            <div className="artist-media artist-media-placeholder">
              <div className="artist-profile-sheet">
                <div className="artist-profile-sheet__inner">
                  <div className="artist-profile-sheet__eyebrow">
                    03 / PROFİL HAZIRLANIYOR
                  </div>
                  <div className="artist-profile-sheet__mono">S</div>
                  <h3 className="artist-profile-sheet__name">Su</h3>
                  <p className="artist-profile-sheet__text">
                    Profesyonel çekimler, seçili işler ve detaylı tanıtım metni
                    geldikçe bu alan tamamlanacak. Şimdilik yapının yerini net
                    biçimde açıyoruz.
                  </p>
                </div>
              </div>
            </div>
            <div className="artist-copy">
              <div className="eyebrow">03 / EKİP</div>
              <h2 className="heritage artist-title">Su</h2>
              <p className="artist-lead">
                Su için elimizde henüz kapsamlı bir biyografi yok; ama aynı
                görsel sistem içinde yerini şimdiden açıyoruz.
              </p>
              <p className="artist-body">
                Final sürümde burada çalışma yaklaşımı, sevdiği stiller, seçili
                uygulamalar ve kısa biyografi yer alacak. Şimdilik bu alan,
                ekipteki her ismin aynı düzende ve aynı ciddiyetle temsil
                edilmesi için bir temel olarak duruyor.
              </p>
              <div className="artist-focus">
                <span className="artist-focus-label">UYGULAMA ALANLARI</span>
                <div className="artist-focus-list">
                  <span>Detaylar Güncellenecek</span>
                </div>
              </div>
              <div className="artist-tags muted-tags">
                <span>Profil Güncelleniyor</span>
                <span>Yeni Çekimler Eklenecek</span>
                <span>Seçili İşler Yakında</span>
              </div>
              <div className="artist-profile-action">
                <span className="btn-ghost">Profil Yakında</span>
              </div>
            </div>
          </div>
        </section>

        <section id="birsu" className="artist-spotlight birsu-spotlight">
          <div className="wrap artist-spotlight-grid reveal d3">
            <div className="artist-media artist-media-photo">
              <img
                src="/assets/birsu-studio.jpeg"
                alt="Birsu stüdyoda dövme yaparken"
                loading="lazy"
                data-lightbox-image=""
                data-title="Birsu — stüdyoda çalışma anı"
                data-artist="Birsu"
                role="button"
                tabIndex={0}
                aria-label="Birsu'nun stüdyo fotoğrafını büyüt"
              />
            </div>
            <div className="artist-copy">
              <div className="eyebrow">04 / EKİP</div>
              <h2 className="heritage artist-title">Birsu</h2>
              <p className="artist-lead">
                Birsu’dan stüdyoda bir çalışma anı. Detaylı biyografi ve seçili
                işleri yakında eklenecek.
              </p>
              <p className="artist-body">
                Final sürümde burada uzmanlık alanları, çalışma yaklaşımı ve
                seçili uygulamalar yer alacak. Yeni bilgiler geldikçe bu bölüm
                daha kişisel bir profile dönüşecek.
              </p>
              <div className="artist-focus">
                <span className="artist-focus-label">UYGULAMA ALANLARI</span>
                <div className="artist-focus-list">
                  <span>Detaylar Güncellenecek</span>
                </div>
              </div>
              <div className="artist-tags muted-tags">
                <span>Profil Güncelleniyor</span>
                <span>Stüdyodan Bir Kare</span>
                <span>Seçili İşler Yakında</span>
              </div>
              <div className="artist-profile-action">
                <span className="btn-ghost">Profil Yakında</span>
              </div>
            </div>
          </div>
        </section>

        <section className="artist-planner">
          <div className="wrap reveal d3">
            <div className="artist-planner-box">
              <div>
                <div className="eyebrow">PLANLANAN ALAN</div>
                <h3>Sanatçı uygulama etiketleri</h3>
              </div>
              <p>
                Final sürümde her sanatçı için yaptığı işleri açıkça gösteren
                etiketler olacak. <strong>Tattoo</strong>,{" "}
                <strong>Piercing</strong>, <strong>Fine Line</strong>,{" "}
                <strong>Blackwork</strong>, <strong>Cover-Up</strong> gibi
                başlıklar yalnızca gerçekten o sanatçının yaptığı işler
                netleştiğinde eklenecek. Şimdilik doğrulanmamış uzmanlık
                yazmıyoruz.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
