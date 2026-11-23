"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, ImageUp, MapPinned, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alan, alanSinif, Bos, cx, Dugme, Panel, PanelBaslik, Pencere, SayfaBasligi } from "@/components/ui";
import { haritaKaydet, haritaOku, haritaSil, useNexus, yeniId } from "@/lib/store";
import { PIN_TURLERI, type PinTuru } from "@/lib/types";

export default function Harita() {
  const { d, gonder, hazir } = useNexus();
  const [url, setUrl] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [z, setZ] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [yeni, setYeni] = useState<{ x: number; y: number } | null>(null);
  const [ad, setAd] = useState("");
  const [tur, setTur] = useState<PinTuru>("ilgi");
  const [gizli, setGizli] = useState<Set<PinTuru>>(new Set());
  const [secili, setSecili] = useState<string | null>(null);
  const dosya = useRef<HTMLInputElement>(null);
  const resim = useRef<HTMLImageElement>(null);
  const surukle = useRef<{ x: number; y: number; px: number; py: number; hareket: boolean } | null>(null);

  useEffect(() => {
    let u: string | null = null;
    haritaOku().then((b) => { if (b) { u = URL.createObjectURL(b); setUrl(u); } setYukleniyor(false); });
    return () => { if (u) URL.revokeObjectURL(u); };
  }, []);

  const yukle = async (f?: File) => {
    if (!f || !f.type.startsWith("image/")) return;
    await haritaKaydet(f);
    if (url) URL.revokeObjectURL(url);
    setUrl(URL.createObjectURL(f));
    gonder({ t: "harita", var: true });
    setZ(1); setPan({ x: 0, y: 0 });
  };

  const tikla = (e: React.MouseEvent) => {
    if (surukle.current?.hareket || !resim.current) return;
    const r = resim.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    setYeni({ x, y }); setAd("");
  };

  const gorunen = useMemo(() => d.pinler.filter((p) => !gizli.has(p.tur)), [d.pinler, gizli]);
  const kesif = d.pinler.length ? Math.round(d.pinler.filter((p) => p.kesfedildi).length / d.pinler.length * 100) : 0;

  return (
    <>
      <SayfaBasligi etiket="Keşif" baslik="Harita"
        alt="Oyundaki haritanın ekran görüntüsünü yükle, üstüne kendi işaretlerini koy. Görsel yalnızca senin cihazında saklanır."
        sag={url && <div className="flex gap-2"><Dugme onClick={() => dosya.current?.click()}><ImageUp size={16} />Görseli değiştir</Dugme>
          <Dugme tur="tehlike" onClick={async () => { if (confirm("Harita görseli ve tüm işaretler silinsin mi?")) { await haritaSil(); setUrl(null); gonder({ t: "harita", var: false }); } }}><Trash2 size={16} /></Dugme></div>} />
      <input ref={dosya} type="file" accept="image/*" hidden onChange={(e) => { yukle(e.target.files?.[0]); e.target.value = ""; }} />

      {!hazir || yukleniyor ? null : !url ? (
        <Bos ikon={<MapPinned />} baslik="Kendi haritanı oluştur"
          metin="Oyunda haritayı aç, ekran görüntüsü al (PS5'te Create, Xbox'ta Paylaş düğmesi) ve buraya yükle. Sonra tıklayarak işaret ekle."
          eylem={<Dugme tur="birincil" onClick={() => dosya.current?.click()}><ImageUp size={16} />Harita görseli yükle</Dugme>} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <Panel neon className="relative overflow-hidden">
            <div className="relative h-[62vh] min-h-[420px] cursor-crosshair touch-none select-none overflow-hidden rounded-2xl bg-black/40"
              onWheel={(e) => setZ((v) => Math.min(6, Math.max(1, v * (e.deltaY < 0 ? 1.15 : 1 / 1.15))))}
              onPointerDown={(e) => { surukle.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, hareket: false }; }}
              onPointerMove={(e) => {
                const s = surukle.current; if (!s || e.buttons !== 1) return;
                const dx = e.clientX - s.x, dy = e.clientY - s.y;
                if (Math.abs(dx) + Math.abs(dy) > 4) s.hareket = true;
                if (s.hareket) setPan({ x: s.px + dx, y: s.py + dy });
              }}
              onPointerUp={() => setTimeout(() => { surukle.current = null; }, 0)}
              onClick={tikla}>
              <div className="absolute inset-0 grid place-items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${z})`, transformOrigin: "center", transition: surukle.current?.hareket ? "none" : "transform .15s" }}>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={resim} src={url} alt="Kendi harita görselin" className="max-h-[62vh] max-w-full rounded-lg" draggable={false} />
                  {gorunen.map((p) => (
                    <button key={p.id} onClick={(e) => { e.stopPropagation(); setSecili(p.id); }}
                      className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: `translate(-50%, -100%) scale(${1 / z})`, transformOrigin: "bottom center" }}
                      aria-label={p.baslik}>
                      <svg width="26" height="34" viewBox="0 0 26 34" style={{ filter: `drop-shadow(0 0 6px ${PIN_TURLERI[p.tur].renk})` }}>
                        <path d="M13 33s11-11.6 11-20A11 11 0 0 0 2 13c0 8.4 11 20 11 20z" fill={p.kesfedildi ? PIN_TURLERI[p.tur].renk : "#0d0b1a"} stroke={PIN_TURLERI[p.tur].renk} strokeWidth="2" />
                        <circle cx="13" cy="13" r="4" fill={p.kesfedildi ? "#05040c" : PIN_TURLERI[p.tur].renk} />
                      </svg>
                      {secili === p.id && <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs">{p.baslik}</span>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
                {[[Plus, () => setZ((v) => Math.min(6, v * 1.3)), "Yakınlaştır"], [Minus, () => setZ((v) => Math.max(1, v / 1.3)), "Uzaklaştır"], [RotateCcw, () => { setZ(1); setPan({ x: 0, y: 0 }); }, "Sıfırla"]].map(([I, f, l], i) => {
                  const Ik = I as typeof Plus;
                  return <button key={i} onClick={(e) => { e.stopPropagation(); (f as () => void)(); }} aria-label={l as string} className="cam grid h-9 w-9 place-items-center rounded-lg text-tx2 hover:text-cy"><Ik size={16} /></button>;
                })}
              </div>
              <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-tx2">Tıkla: işaret ekle · Sürükle: kaydır · Tekerlek: yakınlaştır</div>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel className="p-5">
              <PanelBaslik etiket="Keşif oranı" baslik={`%${kesif}`} sag={<span className="text-sm text-tx3">{d.pinler.filter((p) => p.kesfedildi).length}/{d.pinler.length}</span>} />
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PIN_TURLERI) as PinTuru[]).map((k) => {
                  const off = gizli.has(k);
                  return (
                    <button key={k} onClick={() => setGizli((s) => { const n = new Set(s); if (off) n.delete(k); else n.add(k); return n; })}
                      className={cx("flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition", off ? "border-white/10 text-tx3" : "border-white/20 text-tx")}>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIN_TURLERI[k].renk, boxShadow: off ? "none" : `0 0 8px ${PIN_TURLERI[k].renk}` }} />
                      {PIN_TURLERI[k].ad}{off ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  );
                })}
              </div>
            </Panel>
            <Panel className="max-h-[48vh] overflow-y-auto p-3">
              {d.pinler.length === 0 ? <p className="p-3 text-sm text-tx3">Henüz işaret yok. Haritaya tıklayarak ilk işaretini ekle.</p> : (
                <ul>
                  <AnimatePresence initial={false}>
                    {d.pinler.map((p) => (
                      <motion.li key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onMouseEnter={() => setSecili(p.id)} className={cx("group flex items-center gap-3 rounded-lg px-3 py-2.5", secili === p.id && "bg-white/[.05]")}>
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PIN_TURLERI[p.tur].renk }} />
                        <span className={cx("flex-1 text-sm", p.kesfedildi && "text-tx3")}>{p.baslik}</span>
                        <button onClick={() => gonder({ t: "pin~", id: p.id, v: { kesfedildi: !p.kesfedildi } })} title="Keşfedildi"
                          className={cx("grid h-6 w-6 place-items-center rounded-md border", p.kesfedildi ? "border-ok bg-ok/20 text-ok" : "border-white/20")}>{p.kesfedildi && <Check size={13} strokeWidth={3} />}</button>
                        <button onClick={() => gonder({ t: "pin-", id: p.id })} className="rounded p-1 text-tx3 opacity-0 hover:text-kir group-hover:opacity-100" aria-label="Sil"><Trash2 size={14} /></button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </Panel>
          </div>
        </div>
      )}

      <Pencere acik={!!yeni} kapat={() => setYeni(null)} baslik="Yeni işaret">
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          if (!yeni || !ad.trim()) return;
          gonder({ t: "pin+", v: { id: yeniId(), x: yeni.x, y: yeni.y, baslik: ad.trim(), tur, kesfedildi: false } });
          setYeni(null);
        }}>
          <Alan etiket="Ad"><input autoFocus className={alanSinif} value={ad} onChange={(e) => setAd(e.target.value)} maxLength={60} placeholder="Burada ne var?" /></Alan>
          <Alan grup etiket="Tür">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PIN_TURLERI) as PinTuru[]).map((k) => (
                <button type="button" key={k} onClick={() => setTur(k)} className={cx("flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm", tur === k ? "border-white/40 bg-white/10" : "border-white/10 text-tx2")}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIN_TURLERI[k].renk }} />{PIN_TURLERI[k].ad}
                </button>
              ))}
            </div>
          </Alan>
          <div className="flex justify-end"><Dugme tur="birincil" type="submit" disabled={!ad.trim()}><Check size={16} />Ekle</Dugme></div>
        </form>
      </Pencere>
    </>
  );
}
