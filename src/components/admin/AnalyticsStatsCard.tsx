import Link from "next/link";
import { GA_TRACKING_ID } from "@/lib/analytics";

interface AnalyticsStatsCardProps {
  totalRevenue: number;
  averageOrderValue: number;
  completedOrdersCount: number;
  totalOrdersCount: number;
}

export default function AnalyticsStatsCard({
  totalRevenue,
  averageOrderValue,
  completedOrdersCount,
  totalOrdersCount,
}: AnalyticsStatsCardProps) {
  const conversionRate =
    totalOrdersCount > 0
      ? ((completedOrdersCount / totalOrdersCount) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-5 font-inter">
      {/* Header with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-brand">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <h2 className="text-base font-bold text-slate-900 font-inter">
              E-Ticaret &amp; Etkileşim Takip Paneli
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              GA4 Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 font-inter mt-1">
            Google Analytics 4 ölçüm akışı ve e-ticaret dönüşüm hunisi metrikleri.
          </p>
        </div>

        <a
          href="https://analytics.google.com/analytics/web/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <span>Google Analytics Canlı Rapor ↗</span>
        </a>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: GA4 Stream */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Ölçüm Kimliği (ID)
          </span>
          <p className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-1">
            {GA_TRACKING_ID}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            ✓ SPA Sayfa &amp; Rota Dinleme
          </span>
        </div>

        {/* KPI 2: Toplam Ciro */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tahsil Edilen Ciro
          </span>
          <p className="text-base sm:text-lg font-black text-slate-900 font-mono mt-1">
            ₺{totalRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Tamamlanan Siparişler
          </span>
        </div>

        {/* KPI 3: Ortalama Sepet (AOV) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Ortalama Sepet Tutarı (AOV)
          </span>
          <p className="text-base sm:text-lg font-black text-slate-900 font-mono mt-1">
            ₺{averageOrderValue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Sipariş Başına Gelir
          </span>
        </div>

        {/* KPI 4: Sipariş Tamamlama Oranı */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Ödeme Başarı Oranı
          </span>
          <p className="text-base sm:text-lg font-black text-emerald-700 font-mono mt-1">
            %{conversionRate}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            {completedOrdersCount} / {totalOrdersCount} Sipariş
          </span>
        </div>
      </div>

      {/* GA4 E-Commerce Funnel Flow */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-brand">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span className="text-xs font-bold text-slate-700">
              Otomatik Ölçülen E-Ticaret Dönüşüm Hunisi (Funnel)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">6/6 Etkinlik Bağlı</span>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
          {/* Step 1 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400">1. Aşama</span>
            <p className="text-xs font-bold text-slate-900 mt-1">page_view</p>
            <span className="text-[10px] text-slate-500 mt-0.5">Tüm Sayfa Ziyaretleri</span>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400">2. Aşama</span>
            <p className="text-xs font-bold text-slate-900 mt-1">view_item</p>
            <span className="text-[10px] text-slate-500 mt-0.5">Ürün İncelemeleri</span>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400">3. Aşama</span>
            <p className="text-xs font-bold text-slate-900 mt-1">add_to_cart</p>
            <span className="text-[10px] text-slate-500 mt-0.5">Sepete Eklemeler</span>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400">4. Aşama</span>
            <p className="text-xs font-bold text-slate-900 mt-1">begin_checkout</p>
            <span className="text-[10px] text-slate-500 mt-0.5">Ödeme Başlatma</span>
          </div>

          {/* Step 5 */}
          <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 flex flex-col justify-between shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-600">5. Aşama (Hedef)</span>
            <p className="text-xs font-bold text-emerald-950 mt-1">purchase</p>
            <span className="text-[10px] text-emerald-800 font-semibold mt-0.5">Satın Alma / Ciro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
