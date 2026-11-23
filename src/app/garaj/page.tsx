"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CarFront, Check, Pencil, Plus, Star, Trash2, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";
import { Alan, alanSinif, Bos, cx, DogrulamaRozeti, DogrulamaSec, Dugme, Panel, Pencere, SayfaBasligi } from "@/components/ui";
import { useNexus, yeniId } from "@/lib/store";
import { ARAC_SINIFLARI, type Arac, type AracSinifi, type Dogrulama } from "@/lib/types";

function AracFormu({ ilk, kaydet }: { ilk?: Arac; kaydet: (v: Pick<Arac, "ad" | "sinif" | "not" | "dogrulama" | "kaynak">) => void }) {
  const [ad, setAd] = useState(ilk?.ad ?? "");
  const [sinif, setSinif] = useState<AracSinifi>(ilk?.sinif ?? "Spor");
  const [not, setNot] = useState(ilk?.not ?? "");
  const [kaynak, setKaynak] = useState(ilk?.kaynak ?? "");
  const [dog, setDog] = useState<Dogrulama>(ilk?.dogrulama ?? "oyunda");
  const ok = ad.trim() && (!kaynak || /^https?:\/\//i.test(kaynak));
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (ok) kaydet({ ad: ad.trim(), sinif, not: not.trim() || undefined, kaynak: kaynak.trim() || undefined, dogrulama: dog }); }}>
      <Alan etiket="Araç adı"><input autoFocus className={alanSinif} value={ad} onChange={(e) => setAd(e.target.value)} maxLength={80} placeholder="Oyundaki adıyla" /></Alan>
      <Alan grup etiket="Sınıf">
        <div className="flex flex-wrap gap-2">
          {ARAC_SINIFLARI.map((s) => (
            <button type="button" key={s} onClick={() => setSinif(s)} className={cx("rounded-lg border px-3 py-1.5 text-sm transition", sinif === s ? "border-mg/60 bg-mg/15 text-tx" : "border-white/10 text-tx2 hover:border-white/25")}>{s}</button>
          ))}
        </div>
      </Alan>
      <Alan etiket="Not (nerede bulunur, özellikleri…)"><textarea className={cx(alanSinif, "min-h-20")} value={not} onChange={(e) => setNot(e.target.value)} maxLength={500} /></Alan>
      <Alan etiket="Kaynak bağlantısı (isteğe bağlı)"><input className={alanSinif} value={kaynak} onChange={(e) => setKaynak(e.target.value)} placeholder="https://…" /></Alan>
      <Alan grup etiket="Doğrulama"><DogrulamaSec deger={dog} degis={setDog} /></Alan>
      <div className="flex justify-end"><Dugme tur="birincil" type="submit" disabled={!ok}><Check size={16} />Kaydet</Dugme></div>
    </form>
  );
}

export default function Garaj() {
  const { d, gonder, hazir } = useNexus();
  const [sinif, setSinif] = useState<"Tümü" | AracSinifi>("Tümü");
  const [sadece, setSadece] = useState<"hepsi" | "favori" | "garaj">("hepsi");
  const [form, setForm] = useState<{ acik: boolean; arac?: Arac }>({ acik: false });

  const liste = useMemo(() => d.araclar
    .filter((a) => sinif === "Tümü" || a.sinif === sinif)
    .filter((a) => sadece === "hepsi" || (sadece === "favori" ? a.favori : a.sahip))
    .sort((a, b) => Number(b.favori) - Number(a.favori) || a.ad.localeCompare(b.ad, "tr")), [d.araclar, sinif, sadece]);

  const sahip = d.araclar.filter((a) => a.sahip).length;

  return (
    <>
      <SayfaBasligi etiket="Koleksiyon" baslik="Garaj" alt="Gördüğün, istediğin ya da sahip olduğun araçları kaydet. Favorilerini öne çıkar, garajını tamamla."
        sag={<Dugme tur="birincil" onClick={() => setForm({ acik: true })}><Plus size={16} />Araç ekle</Dugme>} />

      <div className="mb-6 grid grid-cols-3 gap-3">
        {[["Kayıtlı araç", d.araclar.length, "text-cy"], ["Garajımda", sahip, "text-ok"], ["Favori", d.araclar.filter((a) => a.favori).length, "text-sari"]].map(([e, v, r]) => (
          <Panel key={e as string} className="kose p-4">
            <div className="text-xs uppercase tracking-[.16em] text-tx3">{e}</div>
            <div className={cx("mt-1 font-display text-3xl font-bold", r as string)}>{v}</div>
          </Panel>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["Tümü", ...ARAC_SINIFLARI] as const).map((s) => (
          <button key={s} onClick={() => setSinif(s)} className={cx("rounded-full border px-3.5 py-1.5 text-sm transition", sinif === s ? "border-cy/60 bg-cy/15 text-tx parlama-cy" : "border-white/10 text-tx2 hover:border-white/25")}>{s}</button>
        ))}
        <div className="ml-auto flex rounded-xl border border-white/10 bg-black/30 p-1">
          {([["hepsi", "Hepsi"], ["garaj", "Garajımda"], ["favori", "Favoriler"]] as const).map(([k, a]) => (
            <button key={k} onClick={() => setSadece(k)} className={cx("rounded-lg px-3 py-1.5 text-sm", sadece === k ? "bg-white/10 text-tx" : "text-tx3 hover:text-tx")}>{a}</button>
          ))}
        </div>
      </div>

      {!hazir ? null : liste.length === 0 ? (
        <Bos ikon={<CarFront />} baslik={d.araclar.length ? "Bu filtrede araç yok" : "Garajın boş"}
          metin={d.araclar.length ? "Başka bir sınıf ya da filtre seç." : "Oyunda karşılaştığın araçları ekle; hangi sınıfta olduğunu, nerede bulunduğunu ve garajında olup olmadığını takip et."}
          eylem={!d.araclar.length && <Dugme tur="birincil" onClick={() => setForm({ acik: true })}><Plus size={16} />İlk aracını ekle</Dugme>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {liste.map((a) => (
              <motion.div key={a.id} layout initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }}>
                <Panel className={cx("group relative overflow-hidden p-5", a.sahip && "cam-neon")}>
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mg/20 blur-3xl" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[.2em] text-mg">{a.sinif}</div>
                      <div className="mt-1 font-display text-xl font-semibold">{a.ad}</div>
                    </div>
                    <button onClick={() => gonder({ t: "arac~", id: a.id, v: { favori: !a.favori } })} aria-label="Favori"
                      className={cx("rounded-lg p-2 transition", a.favori ? "text-sari drop-shadow-[0_0_8px_rgba(255,204,51,.8)]" : "text-tx3 hover:text-sari")}>
                      <Star size={18} fill={a.favori ? "currentColor" : "none"} />
                    </button>
                  </div>
                  {a.not && <p className="mt-3 text-sm text-tx2">{a.not}</p>}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <DogrulamaRozeti d={a.dogrulama} kucuk />
                    <div className="flex items-center gap-1">
                      <button onClick={() => setForm({ acik: true, arac: a })} className="rounded-lg p-2 text-tx3 hover:bg-white/10 hover:text-tx" aria-label="Düzenle"><Pencil size={15} /></button>
                      <button onClick={() => confirm("Araç silinsin mi?") && gonder({ t: "arac-", id: a.id })} className="rounded-lg p-2 text-tx3 hover:bg-kir/15 hover:text-kir" aria-label="Sil"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <button onClick={() => gonder({ t: "arac~", id: a.id, v: { sahip: !a.sahip } })}
                    className={cx("mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition",
                      a.sahip ? "border-ok/50 bg-ok/10 text-ok" : "border-white/10 text-tx2 hover:border-cy/40 hover:text-tx")}>
                    {a.sahip ? <><Check size={16} />Garajımda</> : <><Warehouse size={16} />Garaja ekle</>}
                  </button>
                </Panel>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Pencere acik={form.acik} kapat={() => setForm({ acik: false })} baslik={form.arac ? "Aracı düzenle" : "Yeni araç"}>
        <AracFormu key={form.arac?.id ?? "yeni"} ilk={form.arac} kaydet={(v) => {
          if (form.arac) gonder({ t: "arac~", id: form.arac.id, v });
          else gonder({ t: "arac+", v: { ...v, id: yeniId(), favori: false, sahip: false, olusturma: Date.now() } });
          setForm({ acik: false });
        }} />
      </Pencere>
    </>
  );
}
