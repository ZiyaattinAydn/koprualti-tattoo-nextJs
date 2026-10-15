# Sprint 05 — Artist Studio

Durum: Kod ve yerel QA tamamlandı. Hosted Supabase kurulumu ve production deployment **yapılmadı**; bağlantı erişimleri bekleniyor.

## Uygulama

- Statik export yerine Next.js sunucu çalışması kullanılıyor. `(public)` route grubu eski Header, Footer, PageTransition, doodle, scroll ve CSS katmanlarını koruyor. Studio ayrı layout ve CSS Modules kullanıyor.
- `/artist-studio/`: sunucuda doğrulanmış oturum ve aktif sanatçı hesabı gerekir. Profil, portfolio, öne çıkanlar, görünüm, randevular; manager için sanatçılar sekmesi.
- `/artist-studio/login/`, `/artist-studio/password/`, `/artist-studio/auth/callback/`: Supabase email/password, şifre yenileme ve davet aktivasyonu. Açık kayıt ekranı yok.
- Tüm Studio yolları `noindex, nofollow, noarchive`, private/no-store. Public Header/Footer ve sitemap içerisinde Studio bağlantısı yok. DNS erişimi bulunmadığı için `studio.` subdomain eklenmedi.
- `/artists/doktor/` korunuyor; `/artists/su/`, `/artists/birsu/`, `/artists/cansin/` ve gelecekteki yayınlanmış slug'lar aynı public şablonu kullanıyor.
- ARCHIVE, DARKROOM ve CHAOS, aynı alanları farklı kontrollü düzenlerde gösteriyor. Custom CSS/font/renk girişi yok.
- Profil ve portfolio taslakta kaydedilir. Önizleme taslağı gösterir; yayınlama profil + portfolio snapshot'ını atomik günceller. Sürüm kontrolü eski sekmenin yeni taslağı ezmesini engeller. Son yayınlanan sürüme dönülebilir.
- Profil/kapak/portfolio yüklemesi: JPG/PNG/WebP, istemcide en fazla 1800 px WebP dönüşümü, kaynak en fazla 20 MB, çıktı en fazla 3 MB. Yükleme durumları ve hatalar gösterilir. Fotoğraflar lazy yüklenir.
- Portfolio sıralama: drag/drop ve erişilebilir yukarı/aşağı düğmeleri. Featured seçimi, başlık, açıklama, stil ve silme desteklenir. Yayındaki görsel aynı yolda değiştirilemez; kaldırılan canlı görsel yeni yayınlamaya kadar korunur.
- Public sanatçı listesi, şube kadroları, randevu seçenekleri ve portfolio yayındaki aynı veriden okunur. Supabase hiç yapılandırılmamışsa merkezi mevcut kadro gösterilir; yapılandırılmış veritabanı hata verirse sahte başarı/fallback gösterilmez.

## Veritabanı ve yetkiler

Migration: `supabase/migrations/20261014230912_artist_studio.sql`.

| Yapı | Görevi |
| --- | --- |
| `artist_accounts` | Auth UUID eşleştirmesi, sabit slug, rol, aktiflik, manager kontrollü şube, davet rezervasyonu |
| `artist_drafts` | Private profil taslağı, sürüm ve yayınlanan sürüm |
| `artist_portfolio` | Private portfolio kayıtları ve sıralama |
| `artist_public_profiles` | Sadece yayınlanmış, public güvenli profil + portfolio snapshot'ı |
| `appointments` | Private müşteri talepleri, tercih edilen/atanan sanatçı ve durum |
| `studio_private.submission_limits` | IP'nin anahtarla hashlenmiş karşılığı üzerinden kalıcı talep limiti |
| `artist-media` | Private Storage; `artists/<id>/profile`, `covers`, `portfolio` |
| `appointment-references` | Randevu görünürlüğüyle korunan private referans görselleri |

Tüm uygulama tablolarında RLS etkindir. Auth user metadata veya email karşılaştırmasıyla yetki verilmez. Rol, aktiflik ve sanatçı kimliği her istekte veritabanından doğrulanır. Normal kullanıcı doğrudan tablo PATCH isteğiyle rol, sahiplik, şube veya canlı snapshot değiştiremez. Yazma işlemleri izinleri açıkça tanımlanmış RPC'lerden geçer. Yetkili SECURITY DEFINER yardımcıları Data API'ye açılmayan `studio_private` şemasındadır; sabit `search_path` ve açık EXECUTE grant/revoke kullanılır.

| Rol | Profil/portfolio | Randevu | Ekip |
| --- | --- | --- | --- |
| Artist | Kendi taslağını yönetir ve yayınlar | Kendi tercihli talepleri + boş ortak havuz + kendi aldığı ortak talepler | Yönetemez |
| Doktor / manager | Kendi taslağını yönetir ve yayınlar | Tüm talepler, sanatçı filtresi, atama ve durum | Davet, aktif/pasif, şube ataması |
| Anonymous | Sadece aktif yayınlanmış snapshot ve referans verilen görseller | Listeleyemez; doğrulamalı sunucu API'sinden talep bırakır | Erişemez |

Başlangıç kadrosu: **Alsancak = Doktor + Su + Birsu; Karşıyaka = Cansın**. Su ve Birsu ayrı UUID ve profillerdir.

Randevu formunun önceki çok adımlı hizmet/Atatürk akışı korunarak `POST /api/appointments/` ile bağlandı. Referanslar private saklanır. Kayıtlar idempotent request UUID ve IP başına 5/saat veritabanı limiti kullanır. `preferred_artist_id` müşteri tercihi, `assigned_artist_id` operasyonel üstlenmedir. Ortak havuz claim'i `assigned_artist_id IS NULL` ve `status='new'` koşullu atomik UPDATE ile yapılır. İkinci claim hata verir; alınan ortak talep diğer normal sanatçıların havuzundan çıkar. Durumlar: new, claimed, confirmed, completed, cancelled.

## Doğrulananlar

- TypeScript, mevcut public site etkileşim testleri, **13** yerel SQL güvenlik senaryosu, **6** tarayıcı senaryosu ve production build. Mevcut projede ayrı bir lint komutu yapılandırılmamış.
- Yerel PostgreSQL/PGlite üzerinde rol yükseltme engeli, kendi/başka sanatçı erişimi, anonymous gizliliği, draft/live ayrımı, eski sürüm çakışması, yayınlama/geri dönme, Storage sahipliği, canlı dosyanın değiştirilememesi, portfolio silme, URL/alan enjeksiyonunun reddi, randevu görünürlükleri, kalıcı limit/idempotency, claim, manager ataması, pasifleştirme ve private referans dosyaları.
- Gerçek Next production sunucusu + yerel Supabase protokol fixture'ı ile Chromium testleri: oturumsuz server guard/noindex, taslak/önizleme/yayınlama/geri dönme, üç tema, görsel yükleme, drag/drop ve oklarla sıralama, featured, silme, profil ve kapak değiştirme, public randevu → Studio → claim → diğer sanatçı havuzundan çıkma.
- Manager'ın gerçek Next Server Action isteği normal artist oturumuyla tekrar gönderildi: sanatçı daveti server-side reddedildi.
- Studio bölümleri: **1920, 1600, 1440, 1366, 1280, 1024, 768, 430, 390** px. Yatay taşma kontrolü; 390 ve 1440 ekran görüntülerinin görsel incelemesi. 390 px portfolio da kontrol edildi. Mobil şifre/çıkış erişimi mevcut.
- 17 public route, iç bağlantılar/görseller, sitemap dışında kalma ve private cache başlıkları kontrol edildi. Test server credential'ı browser JS bundle'larında bulunmadı.

Bunlar hosted Supabase, gerçek SMTP veya gerçek cihaz testi değildir. İki ayrı canlı PostgreSQL bağlantısıyla eşzamanlı claim testi ve hosted Supabase advisors henüz çalıştırılmadı; atomik claim koşulu ve ikinci talebin reddi yerel SQL testinde doğrulandı. Auth daveti/şifre yenileme e-postalarının gerçek teslimatı ve callback provider entegrasyonu canlı serviste doğrulanmalı. Sahte email adresleri ve fixture key'leri yalnız `tests/` ve test runner içinde kullanılır; uygulamada test giriş yolu yoktur.

## Canlı kurulumu engelleyenler

1. Bağlı Supabase hesabında Köprüaltı projesi bulunamadı. Görünen projeler başka işlere ait; bunlara yazılmadı. Doğru proje/ref erişimi gerekiyor. Migration henüz hosted bir projeye uygulanmadı.
2. Vercel `ziyaattinaydns-projects/koprualti-tattoo-nextjs` sorgusu **403 forbidden** döndü. CLI ve yerel Vercel kimlik bilgileri de bulunmadı. Proje env, domain/DNS ve deployment durumuna erişilemedi.
3. Gerçek Supabase server key, public config, canonical site URL ve Doktor'un gerçek davet e-postası henüz bağlanmadı. Secret uydurulmadı; anahtarlar kaynak koduna yazılmadı.
4. Production deployment oluşturulmadı; READY durumu ve production URL doğrulanmadı. `vercel.json` içindeki mevcut otomatik Git deploy kapalı ayarı korunuyor.

## Erişim sağlanınca uygulanacak kurulum

1. Doğru Supabase projesinin mevcut schema ve migration geçmişini tekrar incele. Bu migration yeni tablolar oluşturuyor; aynı isimlerde önceden eklenmiş yapı varsa önce uyumlandır. Yanlış projeye migration uygulama.
2. Migration'ı CLI/MCP ile uygulayıp hosted advisors ve RLS/Storage kontrollerini çalıştır. `studio_private` şemasını Data API exposed schemas listesine ekleme.
3. Vercel güvenli env alanlarına `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, **yalnız server** `SUPABASE_SERVICE_ROLE_KEY`, `SITE_URL` ekle. Public olmayan anahtarlara NEXT_PUBLIC öneki verme. `.env.example` sadece boş değişken adları içerir.
4. Supabase Auth: password girişini ve güvenilir SMTP'yi yapılandır, açık signup'ı kapat, Site URL ve izinli redirect olarak `<SITE_URL>/artist-studio/auth/callback/` tanımla. Varsayılan davet fragment'i, PKCE code ve token_hash callback biçimleri desteklenir.
5. Doktor'u bir kez bağla: güvenli yerel ortamda `DOKTOR_EMAIL` tanımla; `node --env-file=.env.local scripts/bootstrap-manager.mjs` çalıştır. Script mevcut manager hesabını başka kimliğe taşımaz. Önceden oluşturulmuş gerçek daveti kurtarmak için `DOKTOR_EXISTING_AUTH_USER_ID` email eşleşmesiyle doğrulanır.
6. Normal sanatçıları Doktor Studio'sundan davet et. Başlangıç profillerini seçerek Su, Birsu ve Cansın'ı mevcut satırlarına bağla. Gerçek fotoğraf ve metinler Studio'dan girilir.
7. Vercel framework Next.js, Node runtime 24.x olmalı; eski `out` output-directory override'ı varsa kaldır. Build command `npm run build`; çalışma artık statik export değil. Önce preview/prod candidate, ardından açıkça yetkilendirilmiş production deploy. READY ve URL smoke testinden sonra live say.

## Tekrarlanabilir testler

```bash
npm ci
npm run check
# Linux, sistem fontları ve tar gerektirir; gerçek hesap/anahtar kullanmaz:
npm run test:browser:local
# Gerçek servislerle çalışan yerel sunucu hazırsa:
npm run audit
```

`test:browser:local`, gerçek Next sunucusunu yerel PostgreSQL destekli HTTP fixture'ına bağlar; `.env` dosyalarını değiştirmez. Production'a fixture build çıktısı yüklenmez. Deployment kaynak koddan gerçek project env ile yeniden build edilmelidir. Tarayıcı fixture'ında e-posta teslimatı simüle edilmez.

## Git checkpoint

- Uygulama + migration + testler: `dfe9a0c920fd131c6edc89c0a7cd6452142ef269`.
- Kurulum/QA raporu, bunu izleyen dokümantasyon commit'inde tutulur.
- `main` kullanıldı; Sprint 05 için ayrı branch açılmadı.
