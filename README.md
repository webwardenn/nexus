# NEXUS · GTA 6 Türkçe Yardımcı

GTA 6 oyuncuları için ücretsiz, Türkçe, hesap gerektirmeyen yardımcı uygulama. İkinci ekranda ya da telefonda açık tutulur.

> **Resmî değildir.** Hayranlar tarafından yapılmıştır; Rockstar Games veya Take-Two Interactive ile bağlantısı yoktur. Grand Theft Auto ve ilgili adlar sahiplerinin ticari markalarıdır.

## Özellikler
- **%100 Takip:** Görev, aktivite ve koleksiyon listeni oluştur, kategori bazında ilerlemeni gör.
- **Garaj:** Araçları sınıfa göre kaydet, favorile, "garajımda" olarak işaretle.
- **Harita:** Oyun haritasının kendi ekran görüntünü yükle, üstüne işaret koy, keşif oranını takip et.
- **Günlük:** Notlar, etiketler ve oturum hedefleri.
- **Bilgi Bankası:** Kaynaklı ve doğrulama durumu etiketli resmî bilgiler.
- **Yedekle / geri yükle:** Verilerini JSON olarak indir, başka cihaza taşı.

## İlkeler
- **Bilgi uydurmayız.** Uygulama hiçbir görev, araç veya konum listesiyle gelmez; oyuna dair her bilgi kaynaklıdır (`src/lib/resmi.ts`). Her kayıt bir doğrulama seviyesi taşır: Resmî · Oyunda doğrulandı · Topluluk bildirimi · Doğrulanmamış.
- **Oyun içeriği dağıtmayız.** Harita görseli, ikonlar veya oyun dosyası içermez.
- **Veri toplamayız.** Hesap yok, sunucu yok, analiz yok. Her şey kullanıcının tarayıcısında (localStorage + IndexedDB) kalır.

## Geliştirme
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi (tip ve lint kontrolü dahil)
```
Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · lucide-react.
Tüm sayfalar statik üretilir; Vercel'e ek ayar gerektirmeden yüklenir.

## Yol haritası
- İngilizce dil desteği
- Doğrulanmış topluluk veri paketleri (içe aktarılabilir liste)
- Masaüstü sürümü
