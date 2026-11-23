"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Arac, Durum, Kategori, Not, Oge, Pin } from "./types";

const ANAHTAR = "nexus.v1";

/** Sadece YAPI: oyuna ozgu tek bir gorev/arac/konum icermez. */
export const VARSAYILAN_KATEGORILER: Kategori[] = [
  { id: "hikaye", ad: "Ana hikâye", ikon: "BookOpen" },
  { id: "yan", ad: "Yan görevler", ikon: "Map" },
  { id: "aktivite", ad: "Aktiviteler", ikon: "Zap" },
  { id: "koleksiyon", ad: "Koleksiyonlar", ikon: "Gem" },
  { id: "diger", ad: "Diğer", ikon: "Circle" },
];

const BOS: Durum = { surum: 1, kategoriler: VARSAYILAN_KATEGORILER, ogeler: [], araclar: [], notlar: [], pinler: [], haritaVar: false };

type Eylem =
  | { t: "yukle"; d: Durum }
  | { t: "oge+"; v: Oge }
  | { t: "oge~"; id: string; v: Partial<Oge> }
  | { t: "oge-"; id: string }
  | { t: "kat+"; v: Kategori }
  | { t: "kat-"; id: string }
  | { t: "arac+"; v: Arac }
  | { t: "arac~"; id: string; v: Partial<Arac> }
  | { t: "arac-"; id: string }
  | { t: "not+"; v: Not }
  | { t: "not~"; id: string; v: Partial<Not> }
  | { t: "not-"; id: string }
  | { t: "pin+"; v: Pin }
  | { t: "pin~"; id: string; v: Partial<Pin> }
  | { t: "pin-"; id: string }
  | { t: "harita"; var: boolean };

function guncelle<T extends { id: string }>(l: T[], id: string, v: Partial<T>) {
  return l.map((x) => (x.id === id ? { ...x, ...v } : x));
}

function azalt(d: Durum, e: Eylem): Durum {
  switch (e.t) {
    case "yukle": return e.d;
    case "oge+": return { ...d, ogeler: [e.v, ...d.ogeler] };
    case "oge~": return { ...d, ogeler: guncelle(d.ogeler, e.id, e.v) };
    case "oge-": return { ...d, ogeler: d.ogeler.filter((x) => x.id !== e.id) };
    case "kat+": return { ...d, kategoriler: [...d.kategoriler, e.v] };
    case "kat-": return { ...d, kategoriler: d.kategoriler.filter((x) => x.id !== e.id), ogeler: d.ogeler.filter((x) => x.kategori !== e.id) };
    case "arac+": return { ...d, araclar: [e.v, ...d.araclar] };
    case "arac~": return { ...d, araclar: guncelle(d.araclar, e.id, e.v) };
    case "arac-": return { ...d, araclar: d.araclar.filter((x) => x.id !== e.id) };
    case "not+": return { ...d, notlar: [e.v, ...d.notlar] };
    case "not~": return { ...d, notlar: guncelle(d.notlar, e.id, e.v) };
    case "not-": return { ...d, notlar: d.notlar.filter((x) => x.id !== e.id) };
    case "pin+": return { ...d, pinler: [...d.pinler, e.v] };
    case "pin~": return { ...d, pinler: guncelle(d.pinler, e.id, e.v) };
    case "pin-": return { ...d, pinler: d.pinler.filter((x) => x.id !== e.id) };
    case "harita": return { ...d, haritaVar: e.var, pinler: e.var ? d.pinler : [] };
  }
}

/** Disaridan gelen yedegi dogrula: bozuk dosya uygulamayi kirmasin. */
export function yedekDogrula(x: unknown): Durum | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Partial<Durum>;
  if (o.surum !== 1 || !Array.isArray(o.ogeler) || !Array.isArray(o.kategoriler)) return null;
  return {
    surum: 1,
    kategoriler: o.kategoriler,
    ogeler: o.ogeler,
    araclar: Array.isArray(o.araclar) ? o.araclar : [],
    notlar: Array.isArray(o.notlar) ? o.notlar : [],
    pinler: Array.isArray(o.pinler) ? o.pinler : [],
    haritaVar: Boolean(o.haritaVar),
  };
}

export const yeniId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));

interface Baglam {
  d: Durum;
  hazir: boolean;
  gonder: (e: Eylem) => void;
  ilerleme: { toplam: number; biten: number; yuzde: number; kat: Record<string, { toplam: number; biten: number }> };
}

const Ctx = createContext<Baglam | null>(null);

export function NexusProvider({ children }: { children: React.ReactNode }) {
  const [d, gonder] = useReducer(azalt, BOS);
  const [hazir, setHazir] = useState(false);
  const ilk = useRef(true);

  useEffect(() => {
    try {
      const ham = localStorage.getItem(ANAHTAR);
      const v = ham ? yedekDogrula(JSON.parse(ham)) : null;
      if (v) gonder({ t: "yukle", d: v });
    } catch { /* gizli sekme vb. — bos baslar */ }
    setHazir(true);
  }, []);

  useEffect(() => {
    if (!hazir) return;
    if (ilk.current) { ilk.current = false; return; }
    try { localStorage.setItem(ANAHTAR, JSON.stringify(d)); } catch { /* kota dolu */ }
  }, [d, hazir]);

  const ilerleme = useMemo(() => {
    const kat: Record<string, { toplam: number; biten: number }> = {};
    for (const k of d.kategoriler) kat[k.id] = { toplam: 0, biten: 0 };
    let biten = 0;
    for (const o of d.ogeler) {
      kat[o.kategori] ??= { toplam: 0, biten: 0 };
      kat[o.kategori].toplam++;
      if (o.bitti) { kat[o.kategori].biten++; biten++; }
    }
    const toplam = d.ogeler.length;
    return { toplam, biten, yuzde: toplam ? Math.round((biten / toplam) * 1000) / 10 : 0, kat };
  }, [d.ogeler, d.kategoriler]);

  // useReducer'in dispatch'i zaten sabit referanstir
  return <Ctx.Provider value={{ d, hazir, gonder, ilerleme }}>{children}</Ctx.Provider>;
}

export function useNexus() {
  const c = useContext(Ctx);
  if (!c) throw new Error("NexusProvider eksik");
  return c;
}

/* ---------- harita gorseli: IndexedDB (localStorage icin cok buyuk) */
const DB = "nexus-harita";
function db(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore("g");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function haritaKaydet(b: Blob) {
  const x = await db();
  await new Promise<void>((res, rej) => { const t = x.transaction("g", "readwrite"); t.objectStore("g").put(b, "harita"); t.oncomplete = () => res(); t.onerror = () => rej(t.error); });
}
export async function haritaOku(): Promise<Blob | null> {
  try {
    const x = await db();
    return await new Promise((res) => { const r = x.transaction("g").objectStore("g").get("harita"); r.onsuccess = () => res((r.result as Blob) ?? null); r.onerror = () => res(null); });
  } catch { return null; }
}
export async function haritaSil() {
  const x = await db();
  await new Promise<void>((res) => { const t = x.transaction("g", "readwrite"); t.objectStore("g").delete("harita"); t.oncomplete = () => res(); });
}
