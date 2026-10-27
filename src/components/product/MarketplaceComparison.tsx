import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  districtName?: string;
}

export default function MarketplaceComparison({
  className = "",
  districtName,
}: Props) {
  const comparisonItems = [
    {
      criterion: "Teslimat & Kat Taşıması",
      marketplace:
        "Pazaryerlerinde kargo şirketi 90-110 kg'lık ağır medikal sandığı bina kapısına (kaldırıma) bırakır. Katlara çıkarma desteği yoktur.",
      mcaris: districtName
        ? `${districtName} adresinizde kendi servis filomuzla katınıza kadar çıkarılır, hastanızın odasına taşınır. (Şehir dışı gönderimlerde kargo teslimatı geçerlidir, kat taşıma alıcıya aittir.)`
        : "Ankara içi siparişlerde kendi servis araçlarımızla katınıza kadar çıkarılır, hastanızın odasına taşınır. (Ankara dışı gönderimlerde kargo/ambar ile sevk edilir, kat taşıma alıcıya aittir.)",
    },
    {
      criterion: "Montaj & Çalıştırma",
      marketplace:
        "Pazaryeri ve şehir dışı siparişlerde montaj alıcıya aittir. Karmaşık motor kabloları ve mekanik gövde alıcı tarafından kurulur.",
      mcaris:
        "Yalnızca Ankara içi teslimatlarda uzman medikal teknisyenimiz tarafından odanızda anahtar teslim kurulur ve test edilir. (Şehir dışı siparişlerde kurulum imkanımız bulunmamaktadır.)",
    },
    {
      criterion: "Kumanda & Refakatçi Eğitimi",
      marketplace:
        "Hiçbir klinik bilgilendirme veya kumanda kullanım eğitimi sunulmaz.",
      mcaris:
        "Ankara içi kurulumlarda sırt, ayak ve asansör açılarının nasıl kullanılacağı refakatçiye uygulamalı olarak gösterilir.",
    },
    {
      criterion: "Karyola Uyumu & Aksesuar Desteği",
      marketplace:
        "Karyolaya uymayan standart dışı süngerler gönderilebilir; kargo iadesi ve değişim süreçleri mağduriyet yaratır.",
      mcaris:
        "Karyolanın motor ve profil açılarına %100 uyumlu medikal şilte, havalı yatak ve serum askısı seçenekleri uzman danışmanlarımızca sunulur.",
    },
    {
      criterion: "Teknik Servis & Garanti",
      marketplace:
        "Olası bir arızada 100 kg karyolayı kargo şubesine taşımanız istenir; haftalarca bekleme süreci başlar.",
      mcaris:
        "2 Yıl resmi üretici garantisi. Arıza ve yedek parça taleplerinde doğrudan fabrika teknik servis muhataplığı.",
    },
  ];

  return (
    <section className={cn("font-sans space-y-4", className)}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div className="space-y-1.5">
          <Badge
            variant="outline"
            className="border-rose-200/90 bg-rose-50 text-rose-700 font-bold uppercase tracking-wider text-[10.5px] px-2.5 py-0.5"
          >
            Hizmet Kalitesi &amp; Güven Karşılaştırması
          </Badge>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
            Genel E-Ticaret Pazaryerleri vs. MCARIS Medikal
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-sm sm:text-right leading-relaxed">
          Ağır medikal cihazlarda kapıda biten kargo teslimatı yerine, odanızda anahtar teslim kurulum güvencesi.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
              <th className="p-3.5 sm:p-4 w-1/4">Hizmet Kriteri</th>
              <th className="p-3.5 sm:p-4 w-[37.5%] bg-slate-800/90 text-rose-300">
                Genel Pazaryerleri (Trendyol, Hepsiburada vb.)
              </th>
              <th className="p-3.5 sm:p-4 w-[37.5%] bg-emerald-950 text-emerald-300">
                MCARIS Medikal Doğrudan Hizmet
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comparisonItems.map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-card" : "bg-muted/30"}
              >
                <td className="p-3.5 sm:p-4 font-bold text-foreground align-top">
                  {item.criterion}
                </td>
                <td className="p-3.5 sm:p-4 text-muted-foreground align-top bg-rose-50/20">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span className="leading-relaxed">{item.marketplace}</span>
                  </div>
                </td>
                <td className="p-3.5 sm:p-4 text-foreground font-medium align-top bg-emerald-50/30">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span className="leading-relaxed text-foreground font-semibold">
                      {item.mcaris}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Info Strip */}
      <div className="rounded-lg bg-muted/60 border border-border p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Hasta karyolası uzmanlık gerektiren bir tıbbi cihazdır. Kaldırıma bırakılan kargo mağduriyetini yaşamayın.
          </span>
        </div>
        <span className="font-bold text-emerald-700 shrink-0">
          Ankara İçi Adrese Teslimat &amp; Montaj (Şehir Dışı Kargo)
        </span>
      </div>
    </section>
  );
}
