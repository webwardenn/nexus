import type { Metadata } from "next";
import { ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { DogrulamaRozeti, Panel, PanelBaslik, SayfaBasligi } from "@/components/ui";
import { RESMI_BILGILER, UYARI_PC } from "@/lib/resmi";
import { DOGRULAMA, type Dogrulama } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bilgi Bankası",
  description: "GTA 6 hakkında kaynaklı ve doğrulama durumu belirtilmiş bilgiler: çıkış tarihi, platformlar, PC sürümü durumu.",
};

export default function Bilgi() {
  return (
    <>
      <SayfaBasligi etiket="Doğrulanmış bilgi" baslik="Bilgi Bankası"
        alt="NEXUS'ta her bilginin bir kaynağı ve doğrulama durumu vardır. Kaynağı olmayan bilgi eklemiyoruz; çıkış sonrası dönemde internetteki yanlış bilgiden seni korumak için." />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel neon className="p-6">
          <PanelBaslik etiket="Kaynaklı" baslik="GTA 6 · Temel bilgiler" />
          <div className="divide-y divide-white/[.06]">
            {RESMI_BILGILER.map((b) => (
              <div key={b.baslik} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-tx3">{b.baslik}</div>
                    <div className="font-display text-2xl font-semibold">{b.deger}</div>
                  </div>
                  <DogrulamaRozeti d={b.dogrulama} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  {b.kaynaklar.map((k) => (
                    <a key={k.url} href={k.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cy hover:underline"><ExternalLink size={12} />{k.ad}</a>
                  ))}
                  <span className="text-tx3">Son kontrol: {new Date(b.guncelleme).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="p-6">
            <PanelBaslik etiket="Nasıl çalışır" baslik="Doğrulama seviyeleri" sag={<ShieldCheck className="text-cy" size={20} />} />
            <ul className="space-y-4">
              {(Object.keys(DOGRULAMA) as Dogrulama[]).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <DogrulamaRozeti d={k} kucuk />
                  <span className="text-sm text-tx2">{DOGRULAMA[k].aciklama}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="flex gap-3 border-sari/30 bg-sari/[.04] p-5">
            <ShieldAlert className="mt-0.5 shrink-0 text-sari" size={20} />
            <p className="text-sm text-tx2"><span className="font-semibold text-sari">Sahte indirmelere dikkat. </span>{UYARI_PC}</p>
          </Panel>
          <Panel className="p-5 text-xs leading-relaxed text-tx3">
            NEXUS, hayranlar tarafından yapılmış resmî olmayan bir yardımcı uygulamadır. Rockstar Games veya Take-Two Interactive ile bağlantılı değildir, onlar tarafından onaylanmamıştır.
            Grand Theft Auto ve ilgili adlar sahiplerinin ticari markalarıdır. Uygulama hiçbir oyun dosyası, haritası veya görseli dağıtmaz; listeleri ve haritayı kullanıcı kendisi oluşturur.
          </Panel>
        </div>
      </div>
    </>
  );
}
