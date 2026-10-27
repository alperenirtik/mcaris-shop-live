import { prisma } from "@/lib/db";
import Link from "next/link";
import AnalyticsStatsCard from "@/components/admin/AnalyticsStatsCard";

export default async function AdminDashboardPage() {
  const [
    productCount,
    categoryCount,
    orderCount,
    userCount,
    latestOrders,
    completedOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: {
        status: { in: ["paid", "completed", "shipped"] },
      },
      select: {
        total: true,
      },
    }),
  ]);

  const totalRevenue = completedOrders.reduce(
    (sum, o) => sum + parseFloat(o.total.toString()),
    0
  );
  const completedOrdersCount = completedOrders.length;
  const averageOrderValue =
    completedOrdersCount > 0 ? totalRevenue / completedOrdersCount : 0;


  const stats = [
    { label: "Toplam Ürün", value: productCount, href: "/admin/urunler", unit: "Adet Ürün", color: "text-blue-600" },
    { label: "Kategoriler", value: categoryCount, href: "/admin/kategoriler", unit: "Kategori Ağacı", color: "text-emerald-600" },
    { label: "Siparişler", value: orderCount, href: "/admin/siparisler", unit: "Toplam Sipariş", color: "text-amber-600" },
    { label: "Kayıtlı Kullanıcı", value: userCount, href: "/admin/kullanicilar", unit: "Müşteri & Yönetici", color: "text-purple-600" },
  ];

  const modules = [
    {
      title: "Ürün Yönetimi",
      desc: "Hasta yatakları, motor serileri, teknik özellikler ve ürün görsellerini yönetin.",
      href: "/admin/urunler",
      actionText: "Ürünlere Git",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      title: "Sipariş Yönetimi",
      desc: "Gelen siparişleri onaylayın, kargo durumu güncelleyin ve e-fatura ekleyin.",
      href: "/admin/siparisler",
      actionText: "Siparişlere Git",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      title: "Canlı Sevkiyat Radarı",
      desc: "Sahadaki aktif teslimat araçlarını GPS koordinatlarıyla harita üzerinden anlık izleyin.",
      href: "/admin/canli-takip",
      actionText: "Radarı Aç",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: "Kupon & Kargo Ayarları",
      desc: "Özel indirim kuponları oluşturun, ücretsiz kargo eşiğini ve kargo ücretlerini ayarlayın.",
      href: "/admin/kuponlar",
      actionText: "Kuponları Yönet",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      title: "Kategori Hiyerarşisi",
      desc: "Ana ve alt kategori ağaçlarını düzenleyin, SEO kalıcı bağlantılarını (slug) yapılandırın.",
      href: "/admin/kategoriler",
      actionText: "Kategorilere Git",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      title: "Ödemeler & Finansal Rapor",
      desc: "iyzico 3D Secure ve Havale/EFT tahsilat durumlarını ve ödeme referanslarını inceleyin.",
      href: "/admin/odemeler",
      actionText: "Ödemeleri Gör",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">MCARIS Kontrol Merkezi</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
            Mağaza genel durumu, anlık siparişler ve operasyonel yönetim modülleri.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/urunler/yeni"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <span>+ Yeni Ürün</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer"
          >
            <span>Vitrin ↗</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm transition-all group"
          >
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block group-hover:text-slate-600 transition-colors">
              {stat.label}
            </span>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-mono">{stat.value}</p>
            <span className="text-xs text-slate-500 font-medium mt-1 block">{stat.unit}</span>
          </Link>
        ))}
      </div>

      {/* Analytics & Interaction Statistics Panel */}
      <AnalyticsStatsCard
        totalRevenue={totalRevenue}
        averageOrderValue={averageOrderValue}
        completedOrdersCount={completedOrdersCount}
        totalOrdersCount={orderCount}
      />

      {/* Latest Orders & Modules Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Modules Grid (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-inter">Yönetim Modülleri</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {modules.map((mod) => (
              <Link
                key={mod.title}
                href={mod.href}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl mb-2">{mod.icon}</div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-brand transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{mod.desc}</p>
                </div>
                <span className="inline-block mt-3 text-xs font-bold text-brand group-hover:underline">
                  {mod.actionText} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Orders Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 font-inter">Son Siparişler</h2>
              <Link href="/admin/siparisler" className="text-xs font-bold text-brand hover:underline">
                Tümünü Gör &rarr;
              </Link>
            </div>

            {latestOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">Henüz sipariş bulunmuyor.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {latestOrders.map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{order.id.slice(0, 16)}...</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-slate-900">
                        ₺{Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin/canli-takip"
            className="w-full text-center py-2.5 px-4 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>Canlı Sevkiyat Radarını Aç</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
