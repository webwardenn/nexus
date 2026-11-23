/** Bir bilginin ne kadar guvenilir oldugu. NEXUS'un temel vaadi: her bilgi etiketli. */
export type Dogrulama = "resmi" | "oyunda" | "topluluk" | "dogrulanmamis";

export const DOGRULAMA: Record<Dogrulama, { ad: string; aciklama: string }> = {
  resmi: { ad: "Resmî", aciklama: "Rockstar / Take-Two'nun resmî açıklaması" },
  oyunda: { ad: "Oyunda doğrulandı", aciklama: "Oyun içinde bizzat kontrol edildi" },
  topluluk: { ad: "Topluluk bildirimi", aciklama: "Oyuncular bildirdi, henüz teyit edilmedi" },
  dogrulanmamis: { ad: "Doğrulanmamış", aciklama: "Kaynağı belirsiz, ihtiyatla yaklaşın" },
};

export interface Kategori {
  id: string;
  ad: string;
  ikon: string;
}

export interface Oge {
  id: string;
  kategori: string;
  baslik: string;
  not?: string;
  kaynak?: string;
  dogrulama: Dogrulama;
  bitti: boolean;
  olusturma: number;
  bitis?: number;
}

export const ARAC_SINIFLARI = ["Spor", "Süper", "Muscle", "Sedan", "SUV", "Arazi", "Motosiklet", "Hava", "Deniz", "Diğer"] as const;
export type AracSinifi = (typeof ARAC_SINIFLARI)[number];

export interface Arac {
  id: string;
  ad: string;
  sinif: AracSinifi;
  favori: boolean;
  sahip: boolean;
  not?: string;
  kaynak?: string;
  dogrulama: Dogrulama;
  olusturma: number;
}

export interface Not {
  id: string;
  baslik: string;
  icerik: string;
  etiketler: string[];
  sabit: boolean;
  hedef: boolean;
  bitti: boolean;
  tarih: number;
}

export const PIN_TURLERI = {
  ilgi: { ad: "İlgi noktası", renk: "#22e1ff" },
  koleksiyon: { ad: "Koleksiyon", renk: "#ff2bd6" },
  arac: { ad: "Araç", renk: "#ffcc33" },
  gorev: { ad: "Görev", renk: "#3dffa2" },
  diger: { ad: "Diğer", renk: "#a78bfa" },
} as const;
export type PinTuru = keyof typeof PIN_TURLERI;

export interface Pin {
  id: string;
  x: number; // 0..1, harita gorseline gore
  y: number;
  baslik: string;
  tur: PinTuru;
  not?: string;
  kesfedildi: boolean;
}

export interface Durum {
  surum: 1;
  kategoriler: Kategori[];
  ogeler: Oge[];
  araclar: Arac[];
  notlar: Not[];
  pinler: Pin[];
  haritaVar: boolean;
}
