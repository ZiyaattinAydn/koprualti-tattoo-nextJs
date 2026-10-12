/* Original v58 content expressed as native TSX; extracted from the approved static page. */
export function AboutPage() {
  return (
    <div className="about-page">
      <main>
        <section className="archive">
          <div className="container archive-grid">
            <aside className="archive-side reveal">
              <div className="eyebrow">01 / ARCHIVE</div>
              <div className="archive-card">
                <small>A-01</small>
                <strong>KÖPRÜALTI</strong>
                <p>Bir ad, bir mekân ve yıllar içinde büyüyen bir hafıza.</p>
              </div>
              <div className="archive-quote">“Burası dün açılmadı.”</div>
            </aside>
            <div className="reveal d1">
              <div className="archive-head">
                <div>
                  <h2 className="archive-title">
                    1993'TEN
                    <br />
                    BERİ.
                  </h2>
                  <p className="archive-intro">
                    Köprüaltı'nın hikâyesi kişisel hafıza, şehir kültürü,
                    Doktor'un dünyası ve yıllar içinde biriken işlerin toplamı
                    gibi okunuyor.
                  </p>
                </div>
                <div className="archive-stamp">K6 / ARCHIVE</div>
              </div>
              <div className="timeline">
                <article className="timeline-row">
                  <div className="year">1992</div>
                  <div>
                    <h3>Köprü hafızası</h3>
                    <p>
                      Galata Köprüsü çevresinde biriken kişisel anılar,
                      Köprüaltı isminin duygusal zeminini oluşturuyor.
                    </p>
                  </div>
                  <em>A</em>
                </article>
                <article className="timeline-row">
                  <div className="year">1993</div>
                  <div>
                    <h3>Edirne / Başlangıç</h3>
                    <p>Köprüaltı'nın ilk kuruluş dönemi Edirne'de başlıyor.</p>
                  </div>
                  <em>B</em>
                </article>
                <article className="timeline-row">
                  <div className="year">2000</div>
                  <div>
                    <h3>İzmir / Karşıyaka</h3>
                    <p>
                      Köprüaltı İzmir'e taşınıyor ve Karşıyaka dönemi başlıyor.
                    </p>
                  </div>
                  <em>C</em>
                </article>
                <article className="timeline-row">
                  <div className="year">2002</div>
                  <div>
                    <h3>Alsancak</h3>
                    <p>
                      Alsancak şubesinin açılmasıyla İzmir'deki ikinci ana nokta
                      oluşuyor.
                    </p>
                  </div>
                  <em>D</em>
                </article>
                <article className="timeline-row">
                  <div className="year">NOW</div>
                  <div>
                    <h3>Yaşayan arşiv</h3>
                    <p>
                      Eski malzeme, yeni işler, duvardaki izler ve gelen
                      müşteriler aynı stüdyo ruhunda birleşiyor.
                    </p>
                  </div>
                  <em>E</em>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
