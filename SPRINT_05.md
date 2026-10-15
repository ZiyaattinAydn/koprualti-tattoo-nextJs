# Sprint 05 — Artist Studio

Durum: Kod, yerel QA ve hosted Supabase migration/RLS/Storage/eşzamanlı claim testleri tamamlandı. **Vercel production deployment yapılmadı**; Vercel scope erişimi ve güvenli server environment bağlantısı bekleniyor.

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

Uygulanmış migration'lar (yerel dosya sürümleri hosted migration geçmişiyle eşlendi):

- `supabase/migrations/20261015115252_artist_studio.sql`
- `supabase/migrations/20261015115501_studio_hosted_hardening.sql`

İkinci migration private limit tablosuna identity primary key/service-only policy ekler; yeni Supabase projelerinde gelen `public.rls_auto_enable()` event-trigger yardımcısının anon/authenticated RPC çalıştırma izinlerini kaldırır. Event trigger silinmez.

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

## Hosted doğrulama — 15 Ekim 2026

Proje: `koprualti-tattoo`, ref `jofmntiixdcyuxmmkgut`, `eu-central-1`, PostgreSQL 17.11. Her iki migration başarıyla uygulandı.

- `tests/hosted/studio-rls.sql`: gerçek DB'de `authenticated`/`anon` rolleri ve geçici Auth UUID eşleştirmeleriyle Su/Birsu/Cansın görünürlüğü, Doktor erişimi, sahiplik, rol yükseltme engeli, draft/live, Storage metadata policy'leri, yayınlama, version conflict ve pasifleştirme testleri geçti. Bu SQL testindeki tüm fixture yazımları rollback edildi.
- `scripts/hosted-http-qa.mjs`: gerçek Supabase Auth password oturumları, PostgREST üzerinden kendi hesabını okuma; gerçek Storage dosyası upload/read/delete; başka sanatçının upload/read/delete reddi; anonim private dosya okuma reddi geçti. Silme doğrulaması metadata/list üzerinden yapıldı; aynı immutable download URL'sinin CDN cache'inden gelmesi dosyanın hâlâ mevcut olduğu varsayılmadı.
- Gerçek JWT'lerle iki HTTP/RPC isteği paralel gönderildi. Normal production claim RPC'sini çağırıp yalnızca kazananın transaction'ını 5 saniye açık tutan kısa ömürlü **SECURITY INVOKER** test wrapper'ı kullanıldı. Wrapper yalnız test kimliklerini kabul etti, production claim yetkilerini değiştirmedi ve test sonunda silindi.

| Actor | Backend PID | Başlangıç (UTC) | Bitiş (UTC) | Sonuç |
| --- | --- | --- | --- | --- |
| Su QA | 11736 | 12:06:12.999873 | 12:06:18.011931 | conflict |
| Birsu QA | 11735 | 12:06:12.999856 | 12:06:18.009999 | claimed |

İki farklı bağlantı ve çakışan transaction süreleri doğrulandı. Tek kazanan oluştu; alınan ortak talep kaybeden sanatçının RLS havuzundan çıktı. Önceki connector SQL çağrıları ardışık çalıştığından concurrency kanıtı sayılmadı; yukarıdaki HTTP testi gerçek eşzamanlı doğrulamadır.

- Son security advisor: **0 bulgu**. Performans tarafındaki yeni indexlerin unused INFO kayıtları, henüz trafik olmaması nedeniyle korunuyor.
- Final temizlik: **0 Auth kullanıcısı, 0 randevu, 0 media object, test RPC yok**. Dört gerçek roster kaydı ve yayınlanan başlangıç profilleri korunuyor; gerçek sanatçı girişleri henüz bağlanmadı.
- Public REST API publishable key ile 200 döndü; Doktor, Su, Birsu, Cansın ve şubeleri doğrulandı. Public URL/key yalnız ignored `.env.local` içinde kullanıldı; GitHub'a eklenmedi.
- Gerçek proje URL/key ile `npm run check` yeniden geçti: TypeScript, public site etkileşimleri, 13 yerel SQL senaryosu ve production build.

Hosted HTTP QA yalnız yeni/boş projede manuel fixture kurulumu ile çalıştırılır. `claim-prepare.sql`, `http-qa-prepare.sql` ve `claim-cleanup.sql` tekrar üretilebilir aşamalardır. `__QA_PASSWORD__` placeholder'ı yalnız çalıştırma belleğinde tek kullanımlık rastgele test parolasıyla değiştirilir; kaynak dosyasına gerçek parola yazılmaz. E-posta gönderilmez. Fixture kullanıcıları sıradan artist rolündedir; kalıcı admin test hesabı yoktur.

Gerçek SMTP davet/reset teslimatı, gerçek Doktor aktivasyonu ve fiziksel cihaz testi tamamlanmadı.

## Kalan production engelleri

1. Vercel bağlantısı tekrar denendi: `GET /v9/projects/koprualti-tattoo-nextjs`, scope `ziyaattinaydns-projects`, team `team_Q8psNRQt8tRxV9kVcj1N2cwp` için **403 forbidden / Not authorized**. Bağlı Vercel kimliğinin bu team/projeye erişimi yok. CLI veya yerel Vercel credential'ı da bulunmadığından güvenli CLI fallback yapılamadı. Başka hesap/projeye deploy denenmedi.
2. Bu nedenle Vercel environment, domain/DNS, project output-directory ve deployment API'sine erişilemedi; public URL/key Vercel'e eklenemedi. Bağlantı doğru hesap/team ile yeniden yetkilendirilmeli; hedef projede environment yönetimi ve deployment oluşturma erişimi gerekli.
3. `SUPABASE_SERVICE_ROLE_KEY` güvenli yerel env'de yok; Supabase connector yalnız public/publishable key sağlıyor. Vercel env okunamadığından orada mevcut olup olmadığı bilinmiyor. Bu değer client'a veya GitHub'a yazılmadan güvenli **server env** alanına bağlanmalı. Privileged Auth Admin daveti ve public randevu API'si bunu gerektiriyor. Canonical `SITE_URL` de production domain doğrulanınca eklenmeli.
4. Auth settings public endpoint'i `emailProvider=true`, `disable_signup=false`, `mailer_autoconfirm=false` döndü. Studio yine aktif `artist_accounts` eşleşmesi gerektiriyor; genel signup tek başına erişim sağlamaz. Production öncesinde hosted Auth signup kapatılmalı, Site URL/callback allowlist ve güvenilir SMTP yapılandırılmalı. Mevcut connector Auth settings update veya gerçek server key sağlama aracı sunmuyor.
5. Doktor'un gerçek davet e-postası verilmediği için gerçek hesabı bootstrap edilmedi. `scripts/bootstrap-manager.mjs` hazır.
6. Production deployment oluşturulmadı; READY ve production URL doğrulanmadı. Mevcut `vercel.json` otomatik Git deploy kapalı ayarı korundu.

## Erişim sağlanınca kalan kurulum

1. Vercel bağlantısını yukarıdaki team/projeye yetkili hesapla düzelt.
2. Güvenli Vercel env alanlarına `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, **yalnız server** `SUPABASE_SERVICE_ROLE_KEY`, `SITE_URL` bağla. `.env.example` yalnız boş değişken adları içerir.
3. Hosted Auth signup/Site URL/redirect allowlist/SMTP ayarlarını tamamla. Callback: `<SITE_URL>/artist-studio/auth/callback/`.
4. Gerçek `DOKTOR_EMAIL` ile bootstrap-manager script'ini güvenli env üzerinden çalıştır, davet teslimatını doğrula. Su/Birsu/Cansın mevcut profillerine Doktor Studio'sundan davet edilir.
5. Vercel framework Next.js, Node 24.x olmalı; eski `out` override'ı varsa kaldır. Kaynak kodu gerçek project env ile build edip production'a deploy et. READY ve URL smoke testinden sonra live say.

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

## GitHub aktarım yöntemi

Git CLI push denemesi `could not read Username for https://github.com` ile durdu; bu bir yeni onay talebi değildir. Bağlı GitHub uygulamasında hedef repo için `push=true` doğrulandı. Aynı checkpoint tree içerikleri GitHub Git Data API ile yeni commitler olarak oluşturulup `main` ref'i yalnız beklenen eski SHA üzerinden fast-forward güncellenir. API commit SHA'ları yerel `dfe9a0c`/`0bed7d2`/sonraki checkpoint'lerden farklıdır; dosya tree SHA'ları aynı kalır. GitHub'daki son gerçek SHA işlem sonunda ayrıca doğrulanır.
