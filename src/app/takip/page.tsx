"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, ListChecks, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Alan, alanSinif, Bos, Cubuk, cx, DogrulamaRozeti, DogrulamaSec, Dugme, Panel, Pencere, SayfaBasligi } from "@/components/ui";
import { useNexus, yeniId } from "@/lib/store";
import type { Dogrulama, Oge } from "@/lib/types";

type Filtre = "hepsi" | "kalan" | "biten";

function OgeFormu({ ilk, kategoriler, kaydet }: { ilk?: Oge; kategoriler: { id: string; ad: string }[]; kaydet: (v: Omit<Oge, "id" | "olusturma" | "bitti">) => void }) {
  const [baslik, setBaslik] = useState(ilk?.baslik ?? "");
  const [kategori, setKategori] = useState(ilk?.kategori ?? kategoriler[0]?.id ?? "");
  const [not, setNot] = useState(ilk?.not ?? "");
  const [kaynak, setKaynak] = useState(ilk?.kaynak ?? "");
  const [dog, setDog] = useState<Dogrulama>(ilk?.dogrulama ?? "oyunda");
  const kaynakGecerli = !kaynak || /^https?:\/\//i.test(kaynak);
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (baslik.trim() && kaynakGecerli) kaydet({ baslik: baslik.trim(), kategori, not: not.trim() || undefined, kaynak: kaynak.trim() || undefined, dogrulama: dog }); }}>
      <Alan etiket="Başlık"><input autoFocus className={alanSinif} value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="Örn. yaptığın görevin adı" maxLength={120} /></Alan>
      <Alan etiket="Kategori">
        <select className={alanSinif} value={kategori} onChange={(e) => setKategori(e.target.value)}>
          {kategoriler.map((k) => <option key={k.id} value={k.id}>{k.ad}</option>)}
        </select>
      </Alan>
      <Alan etiket="Not (isteğe bağlı)"><textarea className={cx(alanSinif, "min-h-20 resize-y")} value={not} onChange={(e) => setNot(e.target.value)} maxLength={600} placeholder="İpucu, konum tarifi, ödül…" /></Alan>
      <Alan etiket="Kaynak bağlantısı (isteğe bağlı)">
        <input className={cx(alanSinif, !kaynakGecerli && "border-kir/60")} value={kaynak} onChange={(e) => setKaynak(e.target.value)} placeholder="https://…" />
      </Alan>
      <Alan grup etiket="Bu bilgi ne kadar doğrulandı?"><DogrulamaSec deger={dog} degis={setDog} /></Alan>
      <div className="flex justify-end pt-1"><Dugme tur="birincil" type="submit" disabled={!baslik.trim() || !kaynakGecerli}><Check size={16} />Kaydet</Dugme></div>
    </form>
  );
}

export default function Takip() {
  const { d, gonder, ilerleme, hazir } = useNexus();
  const [kat, setKat] = useState<string>("hepsi");
  const [filtre, setFiltre] = useState<Filtre>("hepsi");
  const [ara, setAra] = useState("");
  const [form, setForm] = useState<{ acik: boolean; oge?: Oge }>({ acik: false });
  const [katForm, setKatForm] = useState(false);
  const [yeniKat, setYeniKat] = useState("");

  const liste = useMemo(() => {
    const q = ara.trim().toLocaleLowerCase("tr");
    return d.ogeler
      .filter((o) => (kat === "hepsi" || o.kategori === kat) && (filtre === "hepsi" || (filtre === "biten" ? o.bitti : !o.bitti)))
      .filter((o) => !q || o.baslik.toLocaleLowerCase("tr").includes(q) || o.not?.toLocaleLowerCase("tr").includes(q))
      .sort((a, b) => Number(a.bitti) - Number(b.bitti) || b.olusturma - a.olusturma);
  }, [d.ogeler, kat, filtre, ara]);

  const katAd = (id: string) => d.kategoriler.find((k) => k.id === id)?.ad ?? "—";

  return (
    <>
      <SayfaBasligi etiket="Görevler · Aktiviteler · Koleksiyonlar" baslik="%100 Takip"
        alt="Oynadıkça listeni oluştur, bitirdiklerini işaretle. Her kayıt için bilginin ne kadar doğrulandığını sen belirlersin."
        sag={<Dugme tur="birincil" onClick={() => setForm({ acik: true })}><Plus size={16} />Yeni kayıt</Dugme>} />

      {/* kategori kartlari */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[{ id: "hepsi", ad: "Tümü" }, ...d.kategoriler].map((k) => {
          const s = k.id === "hepsi" ? { toplam: ilerleme.toplam, biten: ilerleme.biten } : ilerleme.kat[k.id] ?? { toplam: 0, biten: 0 };
          const aktif = kat === k.id;
          return (
            <button key={k.id} onClick={() => setKat(k.id)}
              className={cx("cam rounded-2xl p-4 text-left transition", aktif ? "cam-neon bg-cy/[.06]" : "hover:bg-white/[.05]")}>
              <div className="flex items-baseline justify-between">
                <span className={cx("text-sm font-medium", aktif ? "text-tx" : "text-tx2")}>{k.ad}</span>
                <span className="font-display text-xs text-tx3">{s.biten}/{s.toplam}</span>
              </div>
              <div className="mt-3"><Cubuk oran={s.toplam ? s.biten / s.toplam : 0} /></div>
            </button>
          );
        })}
      </div>

      <Panel className="p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-52 flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tx3" />
            <input className={cx(alanSinif, "pl-10")} placeholder="Listede ara…" value={ara} onChange={(e) => setAra(e.target.value)} />
          </div>
          <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
            {(["hepsi", "kalan", "biten"] as Filtre[]).map((f) => (
              <button key={f} onClick={() => setFiltre(f)} className={cx("rounded-lg px-3.5 py-1.5 text-sm capitalize transition", filtre === f ? "bg-white/10 text-tx" : "text-tx3 hover:text-tx")}>
                {f === "hepsi" ? "Hepsi" : f === "kalan" ? "Kalan" : "Biten"}
              </button>
            ))}
          </div>
          <Dugme tur="hayalet" onClick={() => setKatForm(true)}><Plus size={15} />Kategori</Dugme>
        </div>

        {!hazir ? null : liste.length === 0 ? (
          <Bos ikon={<ListChecks />} baslik={d.ogeler.length ? "Bu filtrede kayıt yok" : "Listen henüz boş"}
            metin={d.ogeler.length ? "Filtreyi ya da aramayı değiştirmeyi dene." : "Oynarken tamamladığın ya da yapmak istediğin görevleri, aktiviteleri ve koleksiyonları ekle. Sen doldurdukça %100'e ne kadar kaldığını görürsün."}
            eylem={!d.ogeler.length && <Dugme tur="birincil" onClick={() => setForm({ acik: true })}><Plus size={16} />İlk kaydını ekle</Dugme>} />
        ) : (
          <ul className="divide-y divide-white/[.05]">
            <AnimatePresence initial={false}>
              {liste.map((o) => (
                <motion.li key={o.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }}
                  className="group flex items-start gap-4 py-3.5">
                  <button onClick={() => gonder({ t: "oge~", id: o.id, v: { bitti: !o.bitti, bitis: o.bitti ? undefined : Date.now() } })}
                    aria-label={o.bitti ? "Tamamlanmadı olarak işaretle" : "Tamamlandı olarak işaretle"}
                    className={cx("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition",
                      o.bitti ? "border-ok bg-ok/20 text-ok shadow-[0_0_16px_-2px_rgba(61,255,162,.7)]" : "border-white/20 hover:border-cy")}>
                    <AnimatePresence>{o.bitti && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={16} strokeWidth={3} /></motion.span>}</AnimatePresence>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cx("font-medium transition", o.bitti && "text-tx3 line-through decoration-ok/60")}>{o.baslik}</span>
                      <DogrulamaRozeti d={o.dogrulama} kucuk />
                      <span className="rounded-md bg-white/[.05] px-2 py-0.5 text-[11px] text-tx3">{katAd(o.kategori)}</span>
                    </div>
                    {o.not && <p className="mt-1 text-sm text-tx2">{o.not}</p>}
                    {o.kaynak && <a href={o.kaynak} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-cy hover:underline"><ExternalLink size={12} />Kaynak</a>}
                  </div>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100 max-md:opacity-100">
                    <button onClick={() => setForm({ acik: true, oge: o })} className="rounded-lg p-2 text-tx3 hover:bg-white/10 hover:text-tx" aria-label="Düzenle"><Pencil size={15} /></button>
                    <button onClick={() => confirm("Bu kayıt silinsin mi?") && gonder({ t: "oge-", id: o.id })} className="rounded-lg p-2 text-tx3 hover:bg-kir/15 hover:text-kir" aria-label="Sil"><Trash2 size={15} /></button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </Panel>

      <Pencere acik={form.acik} kapat={() => setForm({ acik: false })} baslik={form.oge ? "Kaydı düzenle" : "Yeni kayıt"}>
        <OgeFormu key={form.oge?.id ?? "yeni"} ilk={form.oge} kategoriler={d.kategoriler}
          kaydet={(v) => {
            if (form.oge) gonder({ t: "oge~", id: form.oge.id, v });
            else gonder({ t: "oge+", v: { ...v, id: yeniId(), olusturma: Date.now(), bitti: false } });
            setForm({ acik: false });
          }} />
      </Pencere>

      <Pencere acik={katForm} kapat={() => setKatForm(false)} baslik="Yeni kategori">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (yeniKat.trim()) { gonder({ t: "kat+", v: { id: yeniId(), ad: yeniKat.trim(), ikon: "Circle" } }); setYeniKat(""); setKatForm(false); } }}>
          <Alan etiket="Kategori adı"><input autoFocus className={alanSinif} value={yeniKat} onChange={(e) => setYeniKat(e.target.value)} maxLength={40} placeholder="Örn. Gizli bölgeler" /></Alan>
          <div className="flex justify-end"><Dugme tur="birincil" type="submit" disabled={!yeniKat.trim()}><Plus size={16} />Ekle</Dugme></div>
        </form>
      </Pencere>
    </>
  );
}
