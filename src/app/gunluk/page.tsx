"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookMarked, Check, Pin, PinOff, Plus, Target, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Alan, alanSinif, Bos, cx, Dugme, Panel, PanelBaslik, Pencere, SayfaBasligi } from "@/components/ui";
import { useNexus, yeniId } from "@/lib/store";

const tarih = (t: number) => new Date(t).toLocaleDateString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

export default function Gunluk() {
  const { d, gonder, hazir } = useNexus();
  const [acik, setAcik] = useState(false);
  const [hedefMetin, setHedefMetin] = useState("");
  const [baslik, setBaslik] = useState("");
  const [icerik, setIcerik] = useState("");
  const [etiket, setEtiket] = useState("");
  const [secili, setSecili] = useState<string | null>(null);

  const hedefler = d.notlar.filter((n) => n.hedef);
  const notlar = useMemo(() => d.notlar.filter((n) => !n.hedef && (!secili || n.etiketler.includes(secili))).sort((a, b) => Number(b.sabit) - Number(a.sabit) || b.tarih - a.tarih), [d.notlar, secili]);
  const etiketler = useMemo(() => [...new Set(d.notlar.flatMap((n) => n.etiketler))], [d.notlar]);

  const hedefEkle = () => {
    if (!hedefMetin.trim()) return;
    gonder({ t: "not+", v: { id: yeniId(), baslik: hedefMetin.trim(), icerik: "", etiketler: [], sabit: false, hedef: true, bitti: false, tarih: Date.now() } });
    setHedefMetin("");
  };

  return (
    <>
      <SayfaBasligi etiket="Kişisel" baslik="Günlük" alt="Keşiflerini, planlarını ve bu oturumdaki hedeflerini yaz. Hepsi yalnızca bu cihazda kalır."
        sag={<Dugme tur="birincil" onClick={() => setAcik(true)}><Plus size={16} />Yeni not</Dugme>} />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Panel neon className="h-fit p-5">
          <PanelBaslik etiket="Bu oturum" baslik="Hedefler" sag={<Target size={18} className="text-mg" />} />
          <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); hedefEkle(); }}>
            <input className={alanSinif} value={hedefMetin} onChange={(e) => setHedefMetin(e.target.value)} placeholder="Bugün ne yapacaksın?" maxLength={100} />
            <Dugme type="submit" tur="ikincil" className="px-3" title="Ekle"><Plus size={16} /></Dugme>
          </form>
          {hedefler.length === 0 ? <p className="text-sm text-tx3">Henüz hedef yok. Oturuma başlamadan 2-3 hedef yazmak odaklanmanı sağlar.</p> : (
            <ul className="space-y-1">
              <AnimatePresence initial={false}>
                {hedefler.map((h) => (
                  <motion.li key={h.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[.04]">
                    <button onClick={() => gonder({ t: "not~", id: h.id, v: { bitti: !h.bitti } })} aria-label="Tamamla"
                      className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md border", h.bitti ? "border-ok bg-ok/20 text-ok" : "border-white/20 hover:border-mg")}>
                      {h.bitti && <Check size={14} strokeWidth={3} />}
                    </button>
                    <span className={cx("flex-1 text-sm", h.bitti && "text-tx3 line-through")}>{h.baslik}</span>
                    <button onClick={() => gonder({ t: "not-", id: h.id })} className="rounded p-1 text-tx3 opacity-0 hover:text-kir group-hover:opacity-100" aria-label="Sil"><Trash2 size={14} /></button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Panel>

        <div>
          {etiketler.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button onClick={() => setSecili(null)} className={cx("rounded-full border px-3 py-1 text-sm", !secili ? "border-cy/60 bg-cy/15" : "border-white/10 text-tx2")}>Tümü</button>
              {etiketler.map((e) => <button key={e} onClick={() => setSecili(e)} className={cx("rounded-full border px-3 py-1 text-sm", secili === e ? "border-cy/60 bg-cy/15" : "border-white/10 text-tx2")}>#{e}</button>)}
            </div>
          )}
          {!hazir ? null : notlar.length === 0 ? (
            <Bos ikon={<BookMarked />} baslik="Günlüğün boş" metin="Bulduğun bir yer, aklında tutman gereken bir ipucu ya da sonraki oturumun planı… İlk notunu yaz."
              eylem={<Dugme tur="birincil" onClick={() => setAcik(true)}><Plus size={16} />İlk notunu yaz</Dugme>} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence initial={false}>
                {notlar.map((n) => (
                  <motion.div key={n.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Panel className={cx("group p-5", n.sabit && "cam-neon")}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-display text-base font-semibold">{n.baslik}</div>
                        <div className="flex gap-1">
                          <button onClick={() => gonder({ t: "not~", id: n.id, v: { sabit: !n.sabit } })} className={cx("rounded-lg p-1.5", n.sabit ? "text-mg" : "text-tx3 hover:text-tx")} aria-label="Sabitle">{n.sabit ? <PinOff size={15} /> : <Pin size={15} />}</button>
                          <button onClick={() => confirm("Not silinsin mi?") && gonder({ t: "not-", id: n.id })} className="rounded-lg p-1.5 text-tx3 hover:text-kir" aria-label="Sil"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      {n.icerik && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-tx2">{n.icerik}</p>}
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-tx3">
                        {n.etiketler.map((e) => <span key={e} className="rounded-md bg-cy/10 px-2 py-0.5 text-cy">#{e}</span>)}
                        <span className="ml-auto">{tarih(n.tarih)}</span>
                      </div>
                    </Panel>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Pencere acik={acik} kapat={() => setAcik(false)} baslik="Yeni not">
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          if (!baslik.trim()) return;
          const et = etiket.split(/[,\s#]+/).map((x) => x.trim().toLocaleLowerCase("tr")).filter(Boolean).slice(0, 6);
          gonder({ t: "not+", v: { id: yeniId(), baslik: baslik.trim(), icerik: icerik.trim(), etiketler: et, sabit: false, hedef: false, bitti: false, tarih: Date.now() } });
          setBaslik(""); setIcerik(""); setEtiket(""); setAcik(false);
        }}>
          <Alan etiket="Başlık"><input autoFocus className={alanSinif} value={baslik} onChange={(e) => setBaslik(e.target.value)} maxLength={100} /></Alan>
          <Alan etiket="Not"><textarea className={cx(alanSinif, "min-h-36")} value={icerik} onChange={(e) => setIcerik(e.target.value)} maxLength={4000} /></Alan>
          <Alan etiket="Etiketler (virgülle)"><input className={alanSinif} value={etiket} onChange={(e) => setEtiket(e.target.value)} placeholder="keşif, ipucu" /></Alan>
          <div className="flex justify-end"><Dugme tur="birincil" type="submit" disabled={!baslik.trim()}><Check size={16} />Kaydet</Dugme></div>
        </form>
      </Pencere>
    </>
  );
}
