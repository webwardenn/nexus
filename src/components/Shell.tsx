"use client";

import { motion } from "framer-motion";
import { BookMarked, CarFront, Download, LayoutDashboard, ListChecks, MapPinned, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef } from "react";
import { cx, Halka } from "./ui";
import { useNexus, yedekDogrula } from "@/lib/store";

export const MENU = [
  { yol: "/", ad: "Pano", ikon: LayoutDashboard },
  { yol: "/takip", ad: "%100 Takip", ikon: ListChecks },
  { yol: "/garaj", ad: "Garaj", ikon: CarFront },
  { yol: "/harita", ad: "Harita", ikon: MapPinned },
  { yol: "/gunluk", ad: "Günlük", ikon: BookMarked },
  { yol: "/bilgi", ad: "Bilgi Bankası", ikon: ShieldCheck },
];

export function Logo({ kucuk }: { kucuk?: boolean }) {
  const id = "lg" + useId().replace(/:/g, "");
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className={kucuk ? "h-8 w-8" : "h-10 w-10"} aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22e1ff" /><stop offset="1" stopColor="#ff2bd6" /></linearGradient>
        </defs>
        <path d="M20 2 36 11v18L20 38 4 29V11z" fill="none" stroke={`url(#${id})`} strokeWidth="2.2" style={{ filter: "drop-shadow(0 0 6px rgba(255,43,214,.6))" }} />
        <path d="M13 27V13l14 14V13" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="leading-none">
        <div className="font-display text-xl font-bold tracking-[.18em]"><span className="neon-yazi">NEXUS</span></div>
        {!kucuk && <div className="mt-1 text-[10px] uppercase tracking-[.2em] text-tx3">GTA 6 yardımcısı</div>}
      </div>
    </div>
  );
}

function YedekDugmeleri() {
  const { d, gonder } = useNexus();
  const dosya = useRef<HTMLInputElement>(null);
  const indir = () => {
    const b = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `nexus-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const yukle = async (f?: File) => {
    if (!f) return;
    try {
      const v = yedekDogrula(JSON.parse(await f.text()));
      if (!v) return alert("Bu dosya bir NEXUS yedeği değil.");
      if (confirm("Mevcut verilerin bu yedekle değiştirilsin mi?")) gonder({ t: "yukle", d: v });
    } catch { alert("Dosya okunamadı."); }
  };
  return (
    <div className="grid grid-cols-2 gap-2">
      <button onClick={indir} className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[.03] py-2 text-xs text-tx2 hover:border-cy/40 hover:text-tx"><Download size={14} />Yedekle</button>
      <button onClick={() => dosya.current?.click()} className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[.03] py-2 text-xs text-tx2 hover:border-cy/40 hover:text-tx"><Upload size={14} />Geri yükle</button>
      <input ref={dosya} type="file" accept="application/json" hidden onChange={(e) => { yukle(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const yol = usePathname();
  const { ilerleme } = useNexus();
  return (
    <div className="sahne tarama min-h-screen">
      <div className="izgara pointer-events-none fixed inset-0" />
      {/* yan menu (masaustu) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[.06] bg-zemin/70 p-5 backdrop-blur-xl lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-col gap-1">
          {MENU.map((m) => {
            const aktif = m.yol === "/" ? yol === "/" : yol.startsWith(m.yol);
            return (
              <Link key={m.yol} href={m.yol}
                className={cx("relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition", aktif ? "text-tx" : "text-tx2 hover:bg-white/[.04] hover:text-tx")}>
                {aktif && <motion.span layoutId="menu-aktif" className="absolute inset-0 rounded-xl border border-cy/30 bg-gradient-to-r from-cy/15 to-mg/10" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <m.ikon size={18} className={cx("relative", aktif && "text-cy")} />
                <span className="relative">{m.ad}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-4">
          <div className="cam kose rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Halka yuzde={ilerleme.yuzde} boyut={56} kalinlik={6}><span className="font-display text-xs font-bold">%{Math.round(ilerleme.yuzde)}</span></Halka>
              <div>
                <div className="text-[11px] uppercase tracking-[.18em] text-tx3">İlerleme</div>
                <div className="font-display text-sm font-semibold">{ilerleme.biten} / {ilerleme.toplam}</div>
              </div>
            </div>
          </div>
          <YedekDugmeleri />
          <p className="text-[10.5px] leading-relaxed text-tx3">Resmî değildir. Rockstar Games ve Take-Two ile bağlantısı yoktur. Verilerin yalnızca bu cihazda saklanır.</p>
        </div>
      </aside>

      {/* ust bar (mobil) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[.06] bg-zemin/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo kucuk />
        <div className="font-display text-sm"><span className="text-tx3">İlerleme </span><span className="neon-yazi font-bold">%{Math.round(ilerleme.yuzde)}</span></div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-8 lg:ml-64 lg:pb-12 lg:pt-10">{children}</main>

      {/* alt menu (mobil) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-white/[.06] bg-zemin/90 px-1 py-1.5 backdrop-blur-xl lg:hidden">
        {MENU.map((m) => {
          const aktif = m.yol === "/" ? yol === "/" : yol.startsWith(m.yol);
          return (
            <Link key={m.yol} href={m.yol} className={cx("flex flex-col items-center gap-1 rounded-lg py-1.5 text-[10px]", aktif ? "text-cy" : "text-tx3")}>
              <m.ikon size={19} />{m.ad.replace("%100 ", "").replace(" Bankası", "")}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
