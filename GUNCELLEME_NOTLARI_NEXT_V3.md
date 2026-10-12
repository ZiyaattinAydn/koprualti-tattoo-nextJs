# Köprüaltı Next.js / TypeScript — Üçüncü sürüm

## Taşıma

- Kalan anasayfa, sanatçılar, Doktor profili, hakkımızda ve Atatürk içerikleri yerel HTML metni yerine doğrudan TSX bileşenleriyle sunuluyor.
- Randevu adımları ve hizmet panelleri React durumuna taşındı. URL üzerinden hizmet/şube seçimi, ileri-geri adımları ve sayfa içi bağlantılar korunuyor. Formun veri gönderimi hâlâ kapalı.
- Menü, iç bağlantılar, footer ve şube aksiyonları Next.js bağlantıları kullanıyor. Doodle/yıldız algoritması TypeScript modülüne; hero çizim izi temizleme mantığı olan React bileşenine taşındı. Eski DOM köprü betikleri ve `html-react-parser` kaldırıldı.
- Tek görsel penceresi yeni rotada açık kalmıyor; Escape, dış tık, odak geri dönüşü ve mevcut sayfanın kaydırma konumu korunuyor.

## Testler

- `npm run check`: TypeScript, portfolyo/modal/randevu/hizmet/şube/cursor/doodle davranış testleri, 11 rotanın üretim derlemesi ve dışa aktarılmış sayfalarda görsel, bağlantı, alt metin, viewport ve buton türü denetimi.
- Mobil CSS'in 1024, 768, 430, 400 ve 380 px kuralları kaynak düzeyinde incelendi; v58 görsel düzeni ve Birsu/Doktor aynı kadraj kuralı korundu.
- **Sınır:** Bu ortamın tarayıcısı yerel geliştirme adresine erişmediği için 1440/1280/1024/768/430/390/360 px genişliklerinde gerçek görsel karşılaştırma yapılamadı. Windows üzerinde `.bat` dosyası çalıştırılamadı. Bunlar yapılmış gibi raporlanmıyor; yayına geçmeden önce gerçek ortamda kontrol gerektiriyor.

## Yayın

Mevcut GitHub Pages sürümüne veya GitHub deposuna dokunulmadı. Next.js için GitHub Pages alt dizini ve yayımlama işlemi kullanıcıyla yapılacak 4. adım olarak bekliyor.
