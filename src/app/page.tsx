"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookMarked, CarFront, ExternalLink, ListChecks, MapPinned, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";
import { Cubuk, DogrulamaRozeti, Halka, Panel, PanelBaslik } from "@/components/ui";
import { RESMI_BILGILER, UYARI_PC } from "@/lib/resmi";
import { useNexus } from "@/lib/store";

const giris = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: .5, ease: [0.22, 1, 0.36, 1] as const } });

export default function Pano() {
  const { d, ilerleme, hazir } = useNexus();
  const bos = hazir && !d.ogeler.length && !d.araclar.length && !d.notlar.length && !d.pinler.length;
  const sonBitenler = d.ogeler.filter((o) => o.bitti).sort((a, b) => (b.bitis ?? 0) - (a.bitis ?? 0)).slice(0, 5);
  const kesif = d.pinler.length ? Math.round(d.pinler.filter((p) => p.kesfedildi).length / d.pinler.length * 100) : 0;

  return (
    <>
      {/* kahraman alani */}
      <motion.section {...giris(0)} className="cam cam-neon kose relative mb-6 overflow-hidden rounded-3xl p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-mg/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cy/20 blur-3xl" />
        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cy/30 bg-cy/10 px-3 py-1 text-xs text-cy"><Sparkles size={13} />Türkçe · ücretsiz · hesap gerektirmez</div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Oyunun dışındaki<br /><span className="neon-yazi">en iyi yardımcın.</span>
            </h1>
            <p className="mt-4 text-tx2">İlerlemeni takip et, garajını kur, kendi haritanı işaretle. NEXUS’u ikinci ekranında ya da telefonunda açık tut; oynarken yanında olsun.</p>
          </div>
          <div className="flex items-center gap-6">
            <Halka yuzde={ilerleme.yuzde} boyut={170} kalinlik={12}>
              <div className="text-center">
                <div className="font-display text-4xl font-bold">%{ilerleme.yuzde.toLocaleString("tr-TR")}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[.2em] text-tx3">Tamamlama</div>
              </div>
            </Halka>
          </div>
        </div>
      </motion.section>

      {/* istatistikler */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { yol: "/takip", ikon: ListChecks, ad: "Tamamlanan", deger: `${ilerleme.biten}/${ilerleme.toplam}`, renk: "text-cy" },
          { yol: "/garaj", ikon: CarFront, ad: "Garajımda", deger: `${d.araclar.filter((a) => a.sahip).length}/${d.araclar.length}`, renk: "text-mg" },
          { yol: "/harita", ikon: MapPinned, ad: "Keşif", deger: `%${kesif}`, renk: "text-ok" },
          { yol: "/gunluk", ikon: BookMarked, ad: "Not", deger: `${d.notlar.filter((n) => !n.hedef).length}`, renk: "text-sari" },
        ].map((s, i) => (
          <motion.div key={s.yol} {...giris(i + 1)}>
            <Link href={s.yol} className="cam kose group block rounded-2xl p-5 transition hover:bg-white/[.06]">
              <div className="flex items-center justify-between">
                <s.ikon size={20} className={s.renk} />
                <ArrowRight size={16} className="text-tx3 transition group-hover:translate-x-1 group-hover:text-tx" />
              </div>
              <div className="mt-4 font-display text-3xl font-bold">{s.deger}</div>
              <div className="text-sm text-tx3">{s.ad}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <motion.div {...giris(5)} className="space-y-6">
          {bos ? (
            <Panel className="p-6">
              <PanelBaslik etiket="Başlangıç" baslik="3 adımda hazırsın" />
              <ol className="space-y-3">
                {[
                  ["/takip", "Takip listeni oluştur", "Yaptığın ve yapacağın görevleri, aktiviteleri ekle."],
                  ["/harita", "Haritanı yükle", "Oyun haritasının ekran görüntüsünü yükle, keşiflerini işaretle."],
                  ["/garaj", "Garajını kur", "Karşılaştığın araçları kaydet, favorilerini seç."],
                ].map(([y, b, a], i) => (
                  <li key={y}>
                    <Link href={y} className="group flex items-center gap-4 rounded-xl border border-white/[.06] bg-white/[.02] p-4 transition hover:border-cy/40">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cy to-mg font-display font-bold text-zemin">{i + 1}</span>
                      <span className="flex-1"><span className="block font-medium">{b}</span><span className="text-sm text-tx3">{a}</span></span>
                      <ArrowRight size={16} className="text-tx3 group-hover:text-cy" />
                    </Link>
                  </li>
                ))}
              </ol>
            </Panel>
          ) : (
            <Panel className="p-6">
              <PanelBaslik etiket="İlerleme" baslik="Kategoriler" sag={<Link href="/takip" className="text-sm text-cy hover:underline">Tümü</Link>} />
              <div className="space-y-4">
                {d.kategoriler.map((k) => {
                  const s = ilerleme.kat[k.id] ?? { toplam: 0, biten: 0 };
                  return (
                    <div key={k.id}>
                      <div className="mb-1.5 flex justify-between text-sm"><span>{k.ad}</span><span className="font-display text-tx3">{s.biten}/{s.toplam}</span></div>
                      <Cubuk oran={s.toplam ? s.biten / s.toplam : 0} />
                    </div>
                  );
                })}
              </div>
              {sonBitenler.length > 0 && (
                <>
                  <div className="mb-2 mt-6 text-xs uppercase tracking-[.18em] text-tx3">Son tamamlananlar</div>
                  <ul className="space-y-1.5">{sonBitenler.map((o) => <li key={o.id} className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_8px_#3dffa2]" />{o.baslik}</li>)}</ul>
                </>
              )}
            </Panel>
          )}
        </motion.div>

        <motion.div {...giris(6)} className="space-y-6">
          <Panel neon className="p-6">
            <PanelBaslik etiket="Kaynaklı bilgi" baslik="Resmî bilgiler" sag={<Link href="/bilgi" className="text-sm text-cy hover:underline">Bilgi bankası</Link>} />
            <ul className="space-y-4">
              {RESMI_BILGILER.map((b) => (
                <li key={b.baslik} className="flex items-start justify-between gap-3 border-b border-white/[.05] pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="text-xs text-tx3">{b.baslik}</div>
                    <div className="mt-0.5 font-display font-semibold">{b.deger}</div>
                    <a href={b.kaynaklar[0].url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-cy hover:underline"><ExternalLink size={11} />{b.kaynaklar[0].ad}</a>
                  </div>
                  <DogrulamaRozeti d={b.dogrulama} kucuk />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="flex gap-3 border-sari/30 bg-sari/[.04] p-5">
            <ShieldAlert className="mt-0.5 shrink-0 text-sari" size={20} />
            <p className="text-sm text-tx2"><span className="font-semibold text-sari">Dikkat: </span>{UYARI_PC}</p>
          </Panel>
        </motion.div>
      </div>
    </>
  );
}
