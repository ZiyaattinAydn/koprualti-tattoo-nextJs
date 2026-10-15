# Köprüaltı Tattoo & Piercing

> 🟡 **Durum:** Aktif geliştirme  
> Next.js + TypeScript ile yeniden geliştirilen çok sayfalı işletme sitesi.

Köprüaltı Tattoo & Piercing için hazırlanan proje; **Alsancak ve Karşıyaka** şubelerini, sanatçı portfolyolarını, hizmetleri ve randevu deneyimini tek bir modern web arayüzünde birleştirir.

Proje, önceki statik tasarımın görsel kimliğini koruyarak Next.js App Router mimarisine taşınmaktadır.

## Öne çıkanlar

- App Router üzerinde public site ve private Artist Studio
- Responsive masaüstü ve mobil tasarım
- Sanatçı ve portfolyo sayfaları
- Alsancak ve Karşıyaka için Branch Explorer, ilk keşif geçişi ve editorial mekân akışı
- Hizmet ve randevu ekranları
- Görsel lightbox deneyimi
- Scroll/reveal etkileşimleri
- Özel doodle katmanı
- Tattoo cursor canvas efekti
- TypeScript ve etkileşim testleri
- Production sunucu/asset denetimi
- Supabase Auth, RLS, Storage ve taslak/yayınlanan sanatçı profilleri

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

- `src/app/(public)/` — mevcut public route ve sayfa yapısı
- `src/app/artist-studio/` — private Studio, auth ve server actions
- `supabase/migrations/` — reproducible schema ve RLS migration
- `SPRINT_05.md` — Studio mimarisi, QA ve canlı kurulum durumu
- `src/components/` — ortak ve etkileşimli React bileşenleri
- `src/data/studios.ts` — şube metinleri, kategorili görseller, sanatçılar, hikâye ve konum
- `src/components/BranchExplorer.module.css` — Sprint 04 stilleri
- `SPRINT_04_QA.md` — uygulama kararları, doğrulananlar ve bekleyen tarayıcı QA
- `src/lib/doodles.ts` — doodle yerleşimi ve route geçiş temizliği
- `public/assets/` — görseller ve marka varlıkları
- `public/css/` — taşınan marka stilleri
- `tests/interactions.test.tsx` — etkileşim testleri
- `scripts/audit-server.mjs` — çalışan production sunucusunda public route ve güvenlik denetimi

## Yerel geliştirme

Node.js **24.x** gerekir (Supabase SDK en az Node 22 ister; deployment runtime 24.x olarak sabitlendi).

```bash
npm ci
npm run dev
```

Kalite ve production kontrolleri:

```bash
npm run check
```

`npm run check`; TypeScript kontrolünü, mevcut etkileşim testlerini, PostgreSQL/RLS senaryolarını ve production build'i çalıştırır. Linux üzerinde `npm run test:browser:local`, gerçek hesap/secret kullanmadan Next sunucusu + yerel fixture ile tarayıcı QA yapar. `npm run audit`, çalışan sunucu gerektirir.

## Windows hızlı başlangıç

ZIP sürümü kullanılıyorsa proje tamamen klasöre ayıklanmalıdır. Ardından `koprualti-next` klasöründeki `baslat.bat` çalıştırılabilir.

İlk çalıştırmada paketler `npm ci` ile kurulur ve geliştirme sunucusu hazır olduğunda tarayıcı `http://127.0.0.1:3000/` adresinde açılır.

> Windows'taki çift tıklama davranışı geliştirme ortamında birebir doğrulanmamıştır.

## Aktif geliştirme durumu

Bu repo **tamamlanmış gibi sunulmuyor**; geliştirme devam ediyor.

Şu anda bilinen tamamlanmamış noktalar:

- Randevu formunun kayıt API'si ve Artist Studio hazır; hosted Supabase kurulumu ve production deploy erişimleri bekleniyor. Ayrıntı: [SPRINT_05.md](SPRINT_05.md).
- Portfolyo arşivinde sanatçı/uygulama türü atamaları tamamlanmadığı için bazı filtre sonuçları boş kalabiliyor.
- Gerçek ses dosyası bulunmadığı için hero ses kontrolü kapalı.
- Final yayın öncesinde gerçek cihaz karşılaştırmaları ve yayın yolu kontrolleri tamamlanmalı.

## Yayınlama notu

Sprint 05 ile sunucu desteğine geçildi. `output: export` kullanılmıyor; `npm start` Next.js sunucusunu çalıştırır. Vercel projesinde eski `out` override'ı varsa kaldırılmalıdır. Static hosting private Studio için uygun değildir.

Bu sürüm yerel `/` kök adresi için hazırlanmıştır. GitHub Pages gibi alt dizin tabanlı bir hedefe yayınlanacaksa `basePath` ve yerel asset yolları birlikte düzenlenmelidir.

Proje, önceki statik sürümün yerine geçecek modern Next.js sürümü olarak geliştirilmeye devam etmektedir.
