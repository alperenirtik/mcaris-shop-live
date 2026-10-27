import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const [orders, products, users] = await Promise.all([
    prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      select: { id: true, name: true, price: true, stock: true, series: true },
    }),
    prisma.user.count(),
  ]);

  // Financial Calculations with Float Precision Prevention
  const totalOrdersCount = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed" || o.status === "paid" || o.status === "shipped");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled" || o.status === "failed");

  const totalGrossRevenue = completedOrders.reduce((acc, o) => {
    return acc + parseFloat(o.total.toString());
  }, 0);

  const roundedRevenue = Math.round((totalGrossRevenue + Number.EPSILON) * 100) / 100;
  const aov = completedOrders.length > 0 ? Math.round((roundedRevenue / completedOrders.length + Number.EPSILON) * 100) / 100 : 0;

  // Top Selling Products Breakdown
  const productSalesMap: Record<string, { name: string; quantity: number; totalRevenue: number }> = {};
  for (const order of completedOrders) {
    for (const item of order.items) {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          quantity: 0,
          totalRevenue: 0,
        };
      }
      productSalesMap[item.productId].quantity += item.quantity;
      productSalesMap[item.productId].totalRevenue += parseFloat(item.lineTotal.toString());
    }
  }

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // District / City distribution from customer addresses
  const districtMap: Record<string, number> = {};
  for (const order of orders) {
    const addr = order.shippingAddress.toLowerCase();
    const knownDistricts = [
      "çankaya", "yenimahalle", "keçiören", "etimesgut", "mamak", "sincan", "altındağ", "gölbaşı", "pursaklar", "polatlı"
    ];
    let matched = "Diğer / Genel";
    for (const d of knownDistricts) {
      if (addr.includes(d)) {
        matched = d.charAt(0).toUpperCase() + d.slice(1);
        break;
      }
    }
    districtMap[matched] = (districtMap[matched] || 0) + 1;
  }

  return (
    <div className="space-y-8 font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
            YÖNETİM &amp; RAPORLAMA
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-950">
            Finans, Sipariş &amp; Performans Raporları
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Canlı ciro, ortalama sepet büyüklüğü, teslimat yoğunluğu ve popüler model analizi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/siparisler"
            className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-xs"
          >
            Siparişleri Yönet &rarr;
          </Link>
        </div>
      </div>

      {/* 4 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Toplam Brüt Ciro</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
            {formatPrice(roundedRevenue)}
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
            {completedOrders.length} Onaylı / Tamamlanan Sipariş
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ortalama Sepet (AOV)</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
            {formatPrice(aov)}
          </p>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
            Sipariş Başına Net Tutar
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Toplam Sipariş Talebi</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
            {totalOrdersCount}
          </p>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block">
            {pendingOrders.length} Bekleyen / {cancelledOrders.length} İptal
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Kayıtlı Müşteri &amp; Ürün</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
            {users} <span className="text-base text-neutral-500 font-normal">Üye / {products.length} Ürün</span>
          </p>
          <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded inline-block">
            Aktif Veritabanı
          </span>
        </div>
      </div>

      {/* 2-Column Analytic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Top Products & Revenue Drivers */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-base font-bold text-neutral-950">En Çok Satan &amp; Gelir Getiren Modeller</h2>
            <span className="text-xs text-neutral-500 font-semibold">Adet / Ciro</span>
          </div>

          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, idx) => (
                <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {p.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold text-neutral-950 block">
                      {formatPrice(p.totalRevenue)}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-500 block">
                      {p.quantity} Adet Satıldı
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 py-4 text-center">Henüz tamamlanmış satış verisi bulunmuyor.</p>
          )}
        </div>

        {/* Right 5 cols: Ankara District Delivery Density */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-base font-bold text-neutral-950">Bölgesel Teslimat Dağılımı</h2>
            <span className="text-xs text-neutral-500 font-semibold">Sipariş Sayısı</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(districtMap).map(([district, count]) => (
              <div key={district} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <span className="text-xs sm:text-sm font-semibold text-neutral-800">{district}</span>
                <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                  {count} Sipariş
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Stream Preview */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h2 className="text-base font-bold text-neutral-950">Son Sipariş Hareketleri</h2>
          <Link href="/admin/siparisler" className="text-xs font-bold text-neutral-900 hover:text-black">
            Tümünü Gör &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
                <th className="py-2.5 font-bold">Sipariş ID</th>
                <th className="py-2.5 font-bold">Müşteri</th>
                <th className="py-2.5 font-bold">Tutar</th>
                <th className="py-2.5 font-bold">Durum</th>
                <th className="py-2.5 font-bold">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50">
                  <td className="py-3 font-mono font-bold text-neutral-900">{o.id.slice(-8).toUpperCase()}</td>
                  <td className="py-3 font-semibold text-neutral-800">{o.customerName}</td>
                  <td className="py-3 font-bold text-neutral-950">{formatPrice(parseFloat(o.total.toString()))}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-500">{new Date(o.createdAt).toLocaleDateString("tr-TR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
