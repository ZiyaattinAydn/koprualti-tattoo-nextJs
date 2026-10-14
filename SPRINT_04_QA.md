# Sprint 04 — Branch Explorer

## Yapı ve uygulama kararları

- Mevcut `/studios/`, `/studios/alsancak/` ve `/studios/karsiyaka/` yolları korunur. Header / Footer bağlantıları değişmez.
- Ana ekran iki tam görsel lokasyon alanı kullanır. Hover yalnızca görsel transform / filtre üzerinde çalışır; yerleşim ölçüleri değişmez.
- Şube detayında hero, beş keşif bölümü, sanatçılar, arşiv, hikâye, konum ve randevu bulunur. Fotoğraflı keşif bölümleri tam genişlikte ayrı sahneler kullanır. Fotoğrafı henüz olmayan kategoriler kısa bekleme satırlarıdır; boş tam ekranlar oluşturulmaz.
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

## Tamamlanan tarayıcı QA — 14 Ekim 2026

Kullanıcının açık izniyle bağımsız yerel Chromium 153.0.8010.0 ve Playwright kullanıldı. Testler production static export üzerinde, geçici profillerle ve aynı süreçte çalışan yerel HTTP sunucusuyla yürütüldü. Kullanıcı tarayıcısı / oturumu kullanılmadı. Rye ve Montserrat fontları testte Fontsource paketlerinden yerel olarak servis edildi; fontların yüklenmesi beklenerek ölçüm alındı. Canlı Vercel ortamına deployment yapılmadı.

### Responsive / image loading matrisi

Şube keşif ekranı ve iki şube detayı, istenen dokuz genişlikte toplam **27 sayfa / viewport kontrolünden** geçti. Masaüstü, tablet ve mobil ekran görüntüleri de incelendi.

| Genişlik (px) | Geçen sayfalar | Yatay taşma | Görünen görseller | En yüksek ölçülen CLS |
| --- | --- | --- | --- | --- |
| 1920 | 3 / 3 | Yok | Tamamı yüklendi | 0.0026 |
| 1600 | 3 / 3 | Yok | Tamamı yüklendi | 0.0037 |
| 1440 | 3 / 3 | Yok | Tamamı yüklendi | 0.0044 |
| 1366 | 3 / 3 | Yok | Tamamı yüklendi | 0.0043 |
| 1280 | 3 / 3 | Yok | Tamamı yüklendi | 0.0042 |
| 1024 | 3 / 3 | Yok | Tamamı yüklendi | 0.0048 |
| 768 | 3 / 3 | Yok | Tamamı yüklendi | 0.0039 |
| 430 | 3 / 3 | Yok | Tamamı yüklendi | 0.0017 |
| 390 | 3 / 3 | Yok | Tamamı yüklendi | 0.0019 |

CLS değerleri bu yerel ölçümlere aittir; gerçek kullanıcı performansı ölçümü değildir. Mobilde CSS ile gizlenen motifin lazy load edilmemesi beklenen davranıştır; görünen bütün görsellerin decode / natural dimensions kontrolleri geçti.

### Akış ve davranış kontrolleri

- Hover sırasında lokasyonun belge içindeki konumu ve ölçüleri sabit kaldı.
- İlk lokasyon keşfi tarayıcıda 0.8–1 saniye aralığında tamamlandı; ikinci şube kendi bağımsız keşif kaydını oluşturdu.
- Keşif sırasında mevcut marka overlay'i üst üste binmedi; programatik scroll çağrısı olmadı.
- Sayfa yenilemesinde intro tekrarlanmadı. Kaydedilmiş storage state yeni Chromium sürecine aktarıldığında da keşif durumu korundu.
- Reduced motion ile temiz ilk ziyaret kaydedildi; intro gösterilmedi.
- LocalStorage erişim hatası sayfa açılışını bozmadı.
- Önceki tasarımın desktop sticky indeks / chapter davranışı doğrulandı; bu düzen güncel tam genişlikte sahne akışıyla değiştirildi.
- Galeri lightbox'ı Escape ile kapandı; scroll konumu ve klavye odağı geri geldi. Dokunmatik açma / kapama da geçti.
- Şube değiştirme doğru hero, doğru sanatçı listesi ve doğru keşif kaydını getirdi.
- Alsancak → randevu ve Karşıyaka → randevu ön seçimi hem desktop hem dokunmatik mobilde geçti.
- Tarayıcı geri gezinmesi şube sayfasına intro tekrarı olmadan döndü.
- Doktor profil route'u; Birsu ve Cansın'ın mevcut sanatçı bölümlerine bağlantıları doğrulandı. Sanatçı başlıkları görünür kaldı.
- Canlı resize döngüsü: 1920 → 1600 → 1440 → 1366 → 1280 → 1024 → 768 → 430 → 390 → 768 → 1440. Doodle DOM elemanları korundu, yoğunluk azaldı, ölçümler oturduktan sonra konumlar sabit kaldı; taşma oluşmadı.
- Önceki tasarımda mobil sticky indeks doğal akışa geçti. Bölüm navigasyonu ve Header menüsünün açılması, route geçişi ve kapanması dokunmatik girdilerle doğrulandı.
- Görsel yanıtları 1.2 saniye geciktirildiğinde ayrılan görsel ölçüleri değişmedi. Uzak arşiv görseli yaklaşınca lazy load edildi; görsel kaynaklı layout shift kaydedilmedi.
- Kontrol edilen akışlarda JavaScript hata kaydı ve başarısız yerel HTTP asset isteği yoktu.

### QA sırasında düzeltilenler

1. **390 / 430 px yatay taşma:** Bekleyen fotoğraf panelinin `aspect-ratio: 2 / 1` ve `min-height` birleşimi, otomatik genişlikte 534 px belge genişliği oluşturuyordu. Mevcut scoped selector'a `min-width: 0; width: 100%` eklenerek panel kendi konteynerine bağlandı. Dokuz genişlik / üç route matrisi düzeltmeden sonra yeniden geçti.
2. **Tablet / mobil başlık aralığı:** CSS ile `<br>` gizlendiğinde “Mekânıkeşfet” birleşiyordu. Başlık ve açıklama satır kırılmalarına açık boşluk eklendi; mobil dokunmatik testte “Mekânı keşfet.” metni doğrulandı.

Bu kontroller bağımsız Chromium ile yapıldı. Fiziksel iOS / Android cihaz ve Safari motoru karşılaştırması yapılmadı.

## Tam genişlikte sahne akışı düzeltmesi — 14 Ekim 2026

Önceki Türkçe güncellemedeki kutulu sticky vitrin, kullanıcının TUSAŞ ana sayfası referansını karşılamadı. Referans ana sayfa yeniden açıldı; hero'dan sonraki tam ekran bölüme aşağı kaydırılarak geniş bölüm kompozisyonu incelendi. Bu düzeltme yalnızca şube detaylarının hero / mekân keşfi alanlarını değiştirir. Ana sayfa, Header / Footer, sanatçı profilleri ve randevu sistemi yeniden tasarlanmadı.

### Güncel deneyim

- Kutulu sahne, sol indeks, gizli carousel katmanları ve boş scroll track kaldırıldı.
- Hero ekran yüksekliğini kullanır. Fotoğraflı keşif bölümleri belge içinde bağımsız, tam genişlikte sahnelerdir. Alsancak'ta üç; Karşıyaka'da mevcut seçkiye göre iki fotoğraflı sahne vardır.
- Dış Cephe, Giriş ve fotoğrafı olmayan diğer kategoriler kısa **Fotoğraf yakında** satırları olarak gösterilir. Data dosyasına fotoğraf eklendiğinde kategori otomatik olarak görsel sahneye dönüşür. Temsili görseller şube fotoğrafıymış gibi sunulmaz.
- Başlık / metin opacity ve translate hareketleri CSS view timeline ile kaydırma ilerlemesine bağlıdır. Görsel yalnızca hafif translate / scale yapar. Sabit süreli sahne değişimi veya otomatik oynatma yoktur.
- CSS view timeline desteklemeyen tarayıcılar için IntersectionObserver ile tek seferlik 1–1.2 saniyelik reveal bulunur. JavaScript kapalıysa içerik görünür kalır.
- Belge kaydırması ve native anchor'lar kullanılır. Wheel / touch yakalama, scroll kilidi, programatik scroll animasyonu, nested scroll veya her scroll tick'inde JS layout ölçümü yoktur.
- Desktop açık / koyu sahne kompozisyonları kullanılır; tablet / mobilde görsel tam genişlikte, metin okunabilir overlay üzerinde kalır. Görsel büyütme mevcut lightbox ile çalışır.
- Reduced motion sahne hareketlerini kaldırır ve metinleri görünür tutar. Keşif kaydı ve randevu ön seçimi korunur.
- Türkçe arayüz, Rye / Montserrat, mevcut stüdyo assetleri ve scoped tek CSS dosyası korunur. TUSAŞ kodu veya assetleri alınmadı.

### Bu düzeltmede yeniden doğrulananlar

- Production build / TypeScript, etkileşim testleri ve 14-route export / asset / anchor denetimi geçti.
- 9 genişlik × 3 route (**27 kontrol**) production export üzerinde yeniden sınandı. Yatay taşma, görünen bozuk görsel, JavaScript hatası veya başarısız yerel HTTP isteği yoktu. Masaüstü ve mobil sahne ekran görüntüleri gözle incelendi.
- 9 genişlik × 2 şube: toplam **45 fotoğraflı sahne** kontrol edildi. Sahne genişliği viewport genişliğiyle eşleşti; başlıklar bölüm sınırlarında kaldı, görseller decode oldu.
- Kaydırmanın üç farklı noktasında metin opacity değerlerinin kademeli arttığı ölçüldü. Wheel ileri / geri doğal belgeyi hareket ettirdi; sahneler ayrı sayfa bölümleri olarak aktı.
- Lightbox açma / Escape ile kapatma scroll konumunu ve klavye odağını korudu.
- Canlı resize 1440 → 1024 → 768 → 430 → 390 → 768 → 1440: taşma yok, doodle DOM kaynakları korundu.
- Desktop Alsancak ve dokunmatik mobil Karşıyaka randevu ön seçimi geçti. Mobil anchor ve lightbox dokunmatik kontrolleri geçti.
- Reduced motion: animasyon `none`, metin opacity `1`, native scroll `auto`; ilk keşif intro'su yok.
- View timeline desteği olmayan durum simüle edilerek IntersectionObserver'ın sahneyi reveal olarak işaretlediği doğrulandı. Gerçek Safari / Firefox motor testi yapılmadı.

Son responsive matrisinde en yüksek CLS 0.0044 oldu. Fontlar önceki QA'daki gibi yerel Fontsource paketlerinden servis edildi; bu canlı Vercel veya gerçek kullanıcı performansı ölçümü değildir. Önceki bölümdeki keşif / storage / route kontrolleri tarihsel Sprint QA kayıtlarıdır.

## Deployment

`vercel.json` değiştirilmez: `git.deploymentEnabled: false` korunur. Production veya preview deployment çalıştırılmadı. Vercel proje okuma isteği mevcut bağlantıda 403 / scope yetki hatası verdi; sunucu ayarları değiştirilmedi.
