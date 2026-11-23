"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId } from "react";
import { DOGRULAMA, type Dogrulama } from "@/lib/types";

export function cx(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export function Panel({ children, className, neon }: { children: React.ReactNode; className?: string; neon?: boolean }) {
  return <div className={cx("cam rounded-2xl", neon && "cam-neon", className)}>{children}</div>;
}

export function PanelBaslik({ etiket, baslik, sag }: { etiket?: string; baslik: string; sag?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {etiket && <div className="font-display text-[11px] font-semibold uppercase tracking-[.22em] text-cy/80">{etiket}</div>}
        <h2 className="font-display text-lg font-semibold">{baslik}</h2>
      </div>
      {sag}
    </div>
  );
}

const ROZET: Record<Dogrulama, string> = {
  resmi: "text-ok border-ok/40 bg-ok/10",
  oyunda: "text-cy border-cy/40 bg-cy/10",
  topluluk: "text-sari border-sari/40 bg-sari/10",
  dogrulanmamis: "text-tx3 border-white/15 bg-white/5",
};
export function DogrulamaRozeti({ d, kucuk }: { d: Dogrulama; kucuk?: boolean }) {
  return (
    <span title={DOGRULAMA[d].aciklama}
      className={cx("inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap", ROZET[d], kucuk ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-xs")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {DOGRULAMA[d].ad}
    </span>
  );
}

export function Halka({ yuzde, boyut = 120, kalinlik = 10, children }: { yuzde: number; boyut?: number; kalinlik?: number; children?: React.ReactNode }) {
  const r = (boyut - kalinlik) / 2, c = 2 * Math.PI * r;
  // her halkaya ozel id: gizli bir kopyadaki gradyana baglanirsa (mobilde gizli yan menu) cizilmez
  const id = "halka" + useId().replace(/:/g, "");
  return (
    <div className="relative grid place-items-center" style={{ width: boyut, height: boyut }}>
      <svg width={boyut} height={boyut} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22e1ff" /><stop offset=".5" stopColor="#a78bfa" /><stop offset="1" stopColor="#ff2bd6" />
          </linearGradient>
        </defs>
        <circle cx={boyut / 2} cy={boyut / 2} r={r} stroke="rgba(255,255,255,.07)" strokeWidth={kalinlik} fill="none" />
        <motion.circle cx={boyut / 2} cy={boyut / 2} r={r} stroke={`url(#${id})`} strokeWidth={kalinlik} fill="none" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(100, yuzde) / 100) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} style={{ filter: "drop-shadow(0 0 8px rgba(255,43,214,.55))" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function Cubuk({ oran, renk = "from-cy via-vi to-mg" }: { oran: number; renk?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[.06]">
      <motion.div className={cx("h-full rounded-full bg-gradient-to-r", renk)} initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, oran * 100)}%` }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}
        style={{ boxShadow: "0 0 12px rgba(34,225,255,.5)" }} />
    </div>
  );
}

export function Dugme({ children, onClick, tur = "ikincil", className, type = "button", disabled, title }:
  { children: React.ReactNode; onClick?: () => void; tur?: "birincil" | "ikincil" | "hayalet" | "tehlike"; className?: string; type?: "button" | "submit"; disabled?: boolean; title?: string }) {
  const s = {
    birincil: "bg-gradient-to-r from-cy to-mg text-zemin font-semibold shadow-[0_8px_30px_-8px_rgba(255,43,214,.7)] hover:brightness-110",
    ikincil: "border border-white/12 bg-white/[.05] hover:bg-white/[.1] hover:border-cy/40",
    hayalet: "text-tx2 hover:text-tx hover:bg-white/[.06]",
    tehlike: "border border-kir/40 text-kir hover:bg-kir/10",
  }[tur];
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title}
      className={cx("inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition disabled:pointer-events-none disabled:opacity-40", s, className)}>
      {children}
    </button>
  );
}

export const alanSinif = "w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-tx3 focus:border-cy/60 focus:shadow-[0_0_0_3px_rgba(34,225,255,.15)]";

/** Tek bir giris alani icin <label>; dugme grubu icin grup=true (etiket tum grubu sarmasin, ekran okuyucu dogru okusun). */
export function Alan({ etiket, children, grup }: { etiket: string; children: React.ReactNode; grup?: boolean }) {
  const id = useId();
  if (grup) {
    return (
      <div role="group" aria-labelledby={id}>
        <span id={id} className="mb-1.5 block text-xs text-tx3">{etiket}</span>
        {children}
      </div>
    );
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-tx3">{etiket}</span>
      {children}
    </label>
  );
}

export function DogrulamaSec({ deger, degis }: { deger: Dogrulama; degis: (d: Dogrulama) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(DOGRULAMA) as Dogrulama[]).map((k) => (
        <button key={k} type="button" onClick={() => degis(k)} className={cx("rounded-full transition", deger === k ? "scale-105" : "opacity-45 hover:opacity-80")}>
          <DogrulamaRozeti d={k} />
        </button>
      ))}
    </div>
  );
}

export function Pencere({ acik, kapat, baslik, children }: { acik: boolean; kapat: () => void; baslik: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!acik) return;
    const f = (e: KeyboardEvent) => e.key === "Escape" && kapat();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [acik, kapat]);
  return (
    <AnimatePresence>
      {acik && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: "none" }} transition={{ duration: .15 }}
          onMouseDown={(e) => e.target === e.currentTarget && kapat()}>
          <motion.div className="cam cam-neon w-full max-w-lg rounded-2xl bg-panel/90 p-6" initial={{ y: 20, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, opacity: 0 }}
            role="dialog" aria-modal="true" aria-label={baslik}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{baslik}</h3>
              <button onClick={kapat} className="rounded-lg p-1.5 text-tx3 hover:bg-white/10 hover:text-tx" aria-label="Kapat"><X size={18} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Bos({ ikon, baslik, metin, eylem }: { ikon: React.ReactNode; baslik: string; metin: string; eylem?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-cy/30 bg-cy/10 text-cy parlama-cy">{ikon}</div>
      <div className="font-display text-base font-semibold">{baslik}</div>
      <p className="mt-1 max-w-sm text-sm text-tx2">{metin}</p>
      {eylem && <div className="mt-5">{eylem}</div>}
    </div>
  );
}

export function SayfaBasligi({ etiket, baslik, alt, sag }: { etiket: string; baslik: string; alt?: string; sag?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-display text-xs font-semibold uppercase tracking-[.28em] text-mg">{etiket}</div>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">{baslik}</h1>
        {alt && <p className="mt-2 max-w-2xl text-tx2">{alt}</p>}
      </div>
      {sag}
    </div>
  );
}
