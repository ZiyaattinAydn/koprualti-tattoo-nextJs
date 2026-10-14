# Sprint 04 — Branch Explorer

## Yapı ve uygulama kararları

- Mevcut `/studios/`, `/studios/alsancak/` ve `/studios/karsiyaka/` yolları korunur. Header / Footer bağlantıları değişmez.
- Ana ekran iki tam görsel lokasyon alanı kullanır. Hover yalnızca görsel transform / filtre üzerinde çalışır; yerleşim ölçüleri değişmez.
- Şube detayında hero, beş keşif bölümü, sanatçılar, arşiv, hikâye, konum ve randevu bulunur. Desktop sticky indeks kullanır; tablet ve mobilde indeks doğal akışa geçer.
- Şube verileri `src/data/studios.ts` içindedir. `images` alanı exterior, entrance, interior, workspace, details, artists ve archive kategorilerini içerir. Boş kategoriler yanlış fotoğraf kullanmadan bekleyen çekim alanı gösterir.
- Bilinmeyen şube tarihleri eklenmez. `story` dizisine ileride doğrulanmış FOUNDATION / EXPANSION / TODAY kayıtları ve isteğe bağlı tarihler eklenebilir.
- Doktor mevcut bağımsız profiline; Birsu ve Cansın mevcut sanatçı sayfasındaki kendi bölümlerine bağlanır.
- Görseller geçici stüdyo seçkisi olarak etiketlenir. Doktor görselinin orijinali korunur; Branch Explorer için 1200 × 896, 177 KB WebP türevi kullanılır (orijinal PNG: 3.26 MB).
- Sprint stilleri tek `BranchExplorer.module.css` dosyasında scope edilir. Global CSS değiştirilmez.
- Doodle'lar mevcut Köprüaltı assetlerinden gelir. React tarafından yönetilen, boyutu ayrılmış atmosfer alanlarında durur; eski ölçümlü katmanla çoğaltılmaz. Küçük ekranlarda üç motiften ikiye iner. Sürekli animasyon yoktur.
- Keşif anahtarları `koprualti:discovered:v1:<slug>` biçimindedir. İlk girişte 880 ms opacity / kısa çizgi geçişi; tekrar girişte intro yoktur. Storage engellenirse oturum belleğine düşer. Strict Mode effect tekrarı ilk keşfi iptal etmez. Reduced motion intro'yu atlar.
- Şube sayfalarına geçiş mevcut logo overlay'iyle üst üste bindirilmez; keşif sırasında scroll kilidi ya da programatik scroll çalıştırılmaz.
- Randevu `branch=alsancak` / `branch=karsiyaka` slug'larını ve mevcut Türkçe ad parametrelerini kabul eder. Sprint 03 formunun diğer davranışları korunur.

## Çalıştırılan kontroller — 14 Ekim 2026

`npm run check`:

- TypeScript: geçti.
- Etkileşim testleri: geçti.
- Production build / static export: geçti.
- 14 sayfada navigation, asset ve diğer sayfalardaki anchor hedeflerinin denetimi: geçti.
- `git diff --check`: geçti.

Etkileşim testleri; mevcut portfolio / lightbox / hizmet / cursor davranışlarını, iki şubenin randevu ön seçimini, beş keşif bölümünü, doğru sanatçı bağlantılarını, şube harita bağlantılarını, ilk keşif ve tekrar giriş davranışını, 880 ms kapanmayı, reduced motion, storage erişim hatası ve Strict Mode'u kapsar. Görsel path'lerinin diskte bulunduğu ayrıca doğrulanır.

## Tamamlanamayan tarayıcı QA

Bulut tarayıcısı yerel production test adresini güvenlik politikası nedeniyle engelledi. Chromium indirimi de geçerli bir binary sağlamadı; alternatif yerel Chromium kurulumu otomatik onay incelemesince önceki tarayıcı engelini aşma girişimi olarak reddedildi. Bu engeli aşacak başka yöntem kullanılmadı.

Bu nedenle şu kontroller **bekliyor**; başarılı kabul edilmemelidir:

- 1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390 px genişliklerde gerçek render ve okunabilirlik.
- Gerçek viewport resize; HUD, hero, gallery, sanatçı ve doodle yerleşiminin hareketi / taşması.
- Scroll sırasında sticky indeks, chapter takibi ve doodle konumlarının görsel doğrulaması.
- Tarayıcıda ileri / geri gezinme, şube değiştirme ve anchor konumu.
- Gerçek image network yüklemesi / lazy loading / decode / CLS ölçümü.
- Kalıcı keşif kaydının sayfa yenilemesi ve yeni tarayıcı oturumu üzerinden doğrulanması.
- Şube → randevu akışının tarayıcıda uçtan uca kontrolü.

Bu sprint build ve etkileşim testleriyle doğrulanmıştır; tam tarayıcı QA'sı tamamlanmış bir sürüm olarak sunulmaz. İzin verilen bir test ortamında bu liste tamamlanmalıdır.

## Deployment

`vercel.json` değiştirilmez: `git.deploymentEnabled: false` korunur. Production veya preview deployment çalıştırılmadı. Vercel proje okuma isteği mevcut bağlantıda 403 / scope yetki hatası verdi; sunucu ayarları değiştirilmedi.
