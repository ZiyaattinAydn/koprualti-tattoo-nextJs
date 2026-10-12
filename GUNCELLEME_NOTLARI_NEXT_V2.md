# Köprüaltı Next.js / TypeScript — İkinci adım

- `baslat.bat` eklendi: Windows'ta Node/npm kontrolü yapar, paketler yoksa `npm ci` çalıştırır, `npm run dev` sunucusunu ayrı pencerede açar ve yanıt aldıktan sonra tarayıcıyı açar.
- Şubeler listesi ile Alsancak ve Karşıyaka sayfaları doğrudan TSX bileşenlerine taşındı. Başlık, adres, fotoğraf, harita URL'si ve randevu bağlantısı `src/data/studios.ts` kaynağından geliyor.
- İlk geçiş ZIP'indeki görsel aktarım hatası giderildi: v58'den taşınan bazı `src` ve `data-full` HTML özniteliklerinde eksik kalan eşittir işaretleri düzeltildi. Tüm içerik görselleri ve lightbox kaynakları için dosya varlığı testi eklendi.
- `npm test`, `npm run typecheck` ve `npm run build` geçti. Derlenen 11 rotada içerik görselleri ve yerel bağlantılar denetlendi; eksik dosya görülmedi.
- Windows ortamında `.bat` çift tıklama testi ve gerçek cihazlarda görsel karşılaştırma burada yapılamadı. Windows çalıştırıcısının sonucu kullanıcının bilgisayarında doğrulanmalı.
- Mevcut GitHub Pages yayını değiştirilmedi. Yeni Next.js uygulaması şu aşamada yerel geliştirme için hazırlanmıştır.
