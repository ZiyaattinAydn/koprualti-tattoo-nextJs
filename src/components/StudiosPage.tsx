import { studios } from "@/data/studios";
import { StudioCard } from "./StudioCard";

export function StudiosPage() {
  return (
    <div className="studios-page-view">
      <main>
        <section className="pagehero">
          <div className="container">
            <div className="crumb">ANASAYFA / ŞUBELER</div>
            <div className="eyebrow">İZMİR</div>
            <h1>İzmir'de iki nokta.</h1>
            <p>
              Karşıyaka ve Alsancak; aynı Köprüaltı karakterini farklı
              mahallelerde sürdüren iki stüdyo.
            </p>
          </div>
        </section>
        <section className="studios-page studios-v55">
          <div className="container">
            <div className="branch-section-head">
              <div className="eyebrow">01 / İKİ STÜDYO</div>
              <p>
                Hangi yakada olursan ol, Köprüaltı’nın kapısı açık. Şubeyi tanı
                veya doğrudan yol tarifi al.
              </p>
            </div>
            <div className="branch-grid">
              {studios.map((studio, index) => (
                <StudioCard
                  key={studio.slug}
                  studio={studio}
                  number={index + 1}
                />
              ))}
            </div>
            <p className="branch-map-note">
              Harita bağlantıları Google Haritalar'da yeni sekmede açılır.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
