# İlk Next.js / TypeScript geçişi

- v58'in 11 sayfası App Router rotalarına, bütün gerçek görselleri `public/assets` dizinine taşındı.
- Paylaşılan header/footer React bileşeni oldu; mobil menü ve hizmet açılır menüsü React durumu kullanıyor.
- Portfolyo filtresi TypeScript veri dizisi ve React durumu kullanıyor. Arşiv fotoğraflarına doğrulanmamış tattoo, piercing ya da sanatçı etiketi verilmedi.
- Site genelindeki işaretli içerik görselleri tek React lightbox üzerinden açılıyor; Escape, dış tıklama, odak geri dönüşü ve kaydırma konumu ele alındı.
- Randevu adımları ve hizmet açılımı geçiş bileşenine alındı. Özgün doodle ve cursor kodu bu aşamada ayrı dosyada korundu.
- `npm run build`, `npm run typecheck`, `npm test` geçti. Statik çıktıdaki 11 sayfa ve yerel CSS/görsel URL'leri HTTP 200 ve dosya varlığıyla kontrol edildi.
- Ekran boyutlarında canlı görsel karşılaştırma yapılamadı: uzaktaki tarayıcı yerel geliştirme sunucusuna erişemedi. Mobil tasarımın eksiksiz görsel onayı sonraki kontrolde yapılmalı.
- GitHub Pages'teki mevcut statik sürüme dokunulmadı; alt dizinde yayın için `basePath` henüz bağlanmadı. Bu sürüm ZIP içinde bağımsız geliştirme projesi olarak teslim edilir.
