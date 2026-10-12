# Köprüaltı Next.js — Başlatıcı düzeltmesi (v3.1)

- `baslat.bat` aynı pencerede `npm run dev` çalıştırıyor; sunucu hatası olursa pencere kapanmadan hata okunabiliyor.
- PowerShell ile port ve HTML içeriği kontrolü kaldırıldı. Node.js yardımcısı 3000 portunun boş olduğunu denetliyor ve sunucu HTTP 200 döndürünce tarayıcıyı açıyor.
- ZIP içinden doğrudan çalışma ve eksik proje dosyaları için anlaşılır uyarılar eklendi; README'deki Windows talimatları düzeltildi.
- Sitenin TSX sayfaları, görselleri, filtreleri ve diğer özellikleri değiştirilmedi.

**Doğrulama:** Node.js yardımcısının boş/dolu port ve sunucu hazır olma davranışı çalıştırıldı. TypeScript, etkileşim testleri, üretim derlemesi ve 11 rotanın dosya denetimi tekrar geçti. `.bat` Windows üzerinde bu Linux ortamından çalıştırılamadı; sorun devam ederse açık kalan penceredeki hata çıktısı gereklidir.
