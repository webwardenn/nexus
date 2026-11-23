import type { Dogrulama } from "./types";

/**
 * Uygulamada gosterilen OYUN HAKKINDAKI TUM bilgiler buradadir.
 * Kural: kaynagi olmayan hicbir sey eklenmez. Gorev/arac/konum listeleri UYDURULMAZ;
 * kullanici kendi listesini olusturur, dogrulanmis topluluk paketleri sonra gelir.
 */
export interface ResmiBilgi {
  baslik: string;
  deger: string;
  dogrulama: Dogrulama;
  kaynaklar: { ad: string; url: string }[];
  guncelleme: string; // YYYY-AA-GG
}

export const RESMI_BILGILER: ResmiBilgi[] = [
  {
    baslik: "Çıkış tarihi",
    deger: "19 Kasım 2026",
    dogrulama: "resmi",
    kaynaklar: [
      { ad: "Rockstar Newswire", url: "https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available" },
      { ad: "NME", url: "https://www.nme.com/guides/gaming-guides/gta-6-release-date-xbox-ps5-pc-3553782" },
    ],
    guncelleme: "2026-11-23",
  },
  {
    baslik: "Platformlar",
    deger: "PlayStation 5 · Xbox Series X|S",
    dogrulama: "resmi",
    kaynaklar: [{ ad: "GamesRadar", url: "https://www.gamesradar.com/gta-6-guide" }],
    guncelleme: "2026-11-23",
  },
  {
    baslik: "PC sürümü",
    deger: "Resmî tarih açıklanmadı",
    dogrulama: "resmi",
    kaynaklar: [{ ad: "GamesRadar", url: "https://www.gamesradar.com/gta-6-pc" }],
    guncelleme: "2026-11-23",
  },
];

export const UYARI_PC =
  "PC sürümü henüz yok. “GTA 6 PC indir” vaat eden siteler sahtedir ve bilgisayarınıza zararlı yazılım bulaştırabilir.";
