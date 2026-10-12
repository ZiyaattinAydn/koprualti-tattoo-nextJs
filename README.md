# Köprüaltı Tattoo & Piercing

> 🟡 **Durum:** Aktif geliştirme  
> Next.js + TypeScript ile yeniden geliştirilen çok sayfalı işletme sitesi.

Köprüaltı Tattoo & Piercing için hazırlanan proje; **Alsancak ve Karşıyaka** şubelerini, sanatçı portfolyolarını, hizmetleri ve randevu deneyimini tek bir modern web arayüzünde birleştirir.

Proje, önceki statik tasarımın görsel kimliğini koruyarak Next.js App Router mimarisine taşınmaktadır.

## Öne çıkanlar

- 11 sayfalı App Router yapısı
- Responsive masaüstü ve mobil tasarım
- Sanatçı ve portfolyo sayfaları
- Alsancak ve Karşıyaka şube sayfaları
- Hizmet ve randevu ekranları
- Görsel lightbox deneyimi
- Scroll/reveal etkileşimleri
- Özel doodle katmanı
- Tattoo cursor canvas efekti
- TypeScript ve etkileşim testleri
- Production export/asset denetimi

## Teknoloji

- Next.js
- React
- TypeScript
- App Router
- CSS
- Vitest / Testing Library tabanlı etkileşim testleri

## Sayfalar

```text
/
/portfolio
/artists
/artists/doktor
/about
/ataturk
/studios
/studios/alsancak
/studios/karsiyaka
/services
/appointment
```

## Kod yapısı

- `src/app/` — route ve sayfa yapısı
- `src/components/` — ortak ve etkileşimli React bileşenleri
- `src/data/studios.ts` — şube fotoğrafları, adresler ve harita bağlantıları
- `src/lib/doodles.ts` — doodle yerleşimi ve route geçiş temizliği
- `public/assets/` — görseller ve marka varlıkları
- `public/css/` — taşınan marka stilleri
- `tests/interactions.test.tsx` — etkileşim testleri
- `scripts/audit-export.mjs` — üretim çıktısı ve asset denetimi

## Yerel geliştirme

Node.js **20.9+** gerekir.

```bash
npm ci
npm run dev
```

Kalite ve production kontrolleri:

```bash
npm run check
```

`npm run check`; TypeScript kontrolünü, etkileşim testlerini, production build'i ve dışa aktarılan sayfa/asset denetimini çalıştırır.

## Windows hızlı başlangıç

ZIP sürümü kullanılıyorsa proje tamamen klasöre ayıklanmalıdır. Ardından `koprualti-next` klasöründeki `baslat.bat` çalıştırılabilir.

İlk çalıştırmada paketler `npm ci` ile kurulur ve geliştirme sunucusu hazır olduğunda tarayıcı `http://127.0.0.1:3000/` adresinde açılır.

> Windows'taki çift tıklama davranışı geliştirme ortamında birebir doğrulanmamıştır.

## Aktif geliştirme durumu

Bu repo **tamamlanmış gibi sunulmuyor**; geliştirme devam ediyor.

Şu anda bilinen tamamlanmamış noktalar:

- Randevu formu henüz gerçek veri gönderimi yapmıyor.
- Portfolyo arşivinde sanatçı/uygulama türü atamaları tamamlanmadığı için bazı filtre sonuçları boş kalabiliyor.
- Gerçek ses dosyası bulunmadığı için hero ses kontrolü kapalı.
- Final yayın öncesinde gerçek cihaz karşılaştırmaları ve yayın yolu kontrolleri tamamlanmalı.

## Yayınlama notu

Bu sürüm yerel `/` kök adresi için hazırlanmıştır. GitHub Pages gibi alt dizin tabanlı bir hedefe yayınlanacaksa `basePath` ve yerel asset yolları birlikte düzenlenmelidir.

Proje, önceki statik sürümün yerine geçecek modern Next.js sürümü olarak geliştirilmeye devam etmektedir.
