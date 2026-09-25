# Köprüaltı Tattoo & Piercing — Next.js + TypeScript

v58 statik tasarımından taşınan 11 sayfalı App Router projesi. Bu klasör çalışır bir geliştirme projesidir; yayındaki GitHub Pages sürümünü değiştirmez.

## Windows'ta açma

Önce ZIP dosyasını **klasöre tamamen ayıkla**. Çıkan `koprualti-next` klasöründeki `baslat.bat` dosyasına çift tıkla. Node.js 20.9 veya üzeri gerekir. İlk çalıştırmada paketler `npm ci` ile kurulur; sunucu aynı pencerede çalışır ve hazır olduğunda tarayıcı `http://127.0.0.1:3000/` adresinde açılır. Sunucuyu kapatmak için bu pencerede Ctrl+C kullan.

Port 3000 kullanımda veya paket kurulumu başarısızsa pencere açık kalır ve hatayı gösterir. Tarayıcı kendiliğinden açılmazsa `http://127.0.0.1:3000/` adresine elle git. ZIP içinden ayıklamadan `.bat` çalıştırma; yanında `package.json` ve `scripts` klasörü bulunmalıdır. Windows ortamındaki çift tıklama davranışı bu geliştirme ortamında çalıştırılarak doğrulanamadı.

## Komutlar

```bash
npm ci
npm run dev
npm run check
```

`npm run check` sırasıyla TypeScript, etkileşim testleri, üretim derlemesi ve 11 sayfanın dışa aktarılmış HTML/asset denetimini çalıştırır. `npm run start`, derlemenin ürettiği `out/` klasörünü yerelde sunar.

## Kod yapısı

- `src/app/`: `/`, `/portfolio`, `/artists`, `/artists/doktor`, `/about`, `/ataturk`, `/studios`, `/studios/alsancak`, `/studios/karsiyaka`, `/services`, `/appointment`.
- `src/components/`: tüm sayfaların TSX içerikleri, ortak `Header`, `Footer`, `ImageLightbox`, `RevealObserver`, `DoodleLayer`, `TattooCursorCanvas` ve etkileşimli randevu/hizmet ekranları.
- `src/data/studios.ts`: iki şubenin doğrulanmış v58 fotoğraf, adres ve harita bağlantıları.
- `src/lib/doodles.ts`: orijinal çizimlerin ve yıldızların yerleşimi; rota değişince dinleyici, observer ve katmanları temizler.
- `public/assets/` ve `public/css/`: v58'in orijinal görselleri ve marka stilleri. Seçili Rye başlıkları, Montserrat metinleri ve mobil kurallar korundu.
- `tests/interactions.test.tsx` ve `scripts/audit-export.mjs`: etkileşim ve üretim çıktısı kontrolleri.

Portfolyo arşiv görselleri için sanatçı/uygulama türü ataması yapılmaz; piercing sonucu bu yüzden boş ekranla gösterilir. Randevu formu şu anda veri göndermez. Gerçek ses dosyası olmadığı için hero ses kontrolü kapalıdır.

## Yayın adımı

Bu sürüm yerel `/` kök adresi için hazırlanmıştır. GitHub Pages alt dizinine yayınlamadan önce `basePath` ve bütün yerel asset yolları birlikte ayarlanmalı; gerçek cihazlarda ekran görüntüsü karşılaştırması ve Windows `baslat.bat` testi yapılmalıdır. Bu işlemler kullanıcıyla birlikte yapılacak 4. adımda tamamlanacaktır. Docker geçişin koşulu değildir.
