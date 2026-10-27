"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

interface PaymentOrder {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  total: string;
  paymentProvider?: string | null;
  paymentToken?: string | null;
  paymentId?: string | null;
  iyzicoToken: string | null;
  iyzicoPaymentId: string | null;
  failureReason: string | null;
  createdAt: Date;
}

interface PaymentStats {
  totalOrders: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  failedOrdersCount: number;
  totalRevenue: string;
}

interface PaymentManagerClientProps {
  stats: PaymentStats;
  orders: PaymentOrder[];
}

export default function PaymentManagerClient({ stats, orders }: PaymentManagerClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [query, setQuery] = useState("");
  const [inspectingOrder, setInspectingOrder] = useState<PaymentOrder | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.paymentId && o.paymentId.toLowerCase().includes(q)) ||
        (o.iyzicoPaymentId && o.iyzicoPaymentId.toLowerCase().includes(q));

      const matchesStatus = !selectedStatus || o.status === selectedStatus;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, selectedStatus]);

  function getStatusBadge(status: OrderStatus) {
    switch (status) {
      case "paid":
      case "completed":
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Tahsil Edildi
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Bekliyor
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Başarısız
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            İptal
          </span>
        );
      default:
        return <span className="text-xs font-bold text-slate-500">{status}</span>;
    }
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Top Title */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">Ödemeler ve Finansal Görünüm</h1>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 font-mono">
              {orders.length} İşlem
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
            iyzico Sanal POS ve Havale/EFT ödeme akışları, referans kodları ve finansal tahsilat tablosu.
          </p>
        </div>

        <Link
          href="/admin/siparisler"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors border border-slate-200 shrink-0"
        >
          <span>Sipariş Yönetimi ↗</span>
        </Link>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Toplam Tahsilat</span>
          <p className="text-xl md:text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₺{Number(stats.totalRevenue).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Başarılı Tahsilatlar</span>
          <p className="text-xl md:text-2xl font-bold text-emerald-800 mt-2 font-inter">{stats.paidOrdersCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Bekleyen Ödemeler</span>
          <p className="text-xl md:text-2xl font-bold text-amber-800 mt-2 font-inter">{stats.pendingOrdersCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Başarısız İşlemler</span>
          <p className="text-xl md:text-2xl font-bold text-rose-800 mt-2 font-inter">{stats.failedOrdersCount}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center font-inter">
        <div className="w-full sm:flex-1 relative">
          <input
            type="text"
            placeholder="Sipariş ID, müşteri adı veya iyzico ref ile ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-slate-50/50"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">
              ✕
            </button>
          )}
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            <option value="">Tüm Ödeme Durumları</option>
            <option value="paid">Tahsil Edildi (paid)</option>
            <option value="pending">Bekliyor (pending)</option>
            <option value="failed">Başarısız (failed)</option>
            <option value="cancelled">İptal Edildi (cancelled)</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden font-inter">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-44">Sipariş ID</th>
                <th className="py-3.5 px-4 min-w-[180px]">Müşteri</th>
                <th className="py-3.5 px-4 w-32 text-right">Tutar</th>
                <th className="py-3.5 px-4 w-36 text-center">Ödeme Durumu</th>
                <th className="py-3.5 px-4 w-44">iyzico Ref ID</th>
                <th className="py-3.5 px-4 min-w-[140px]">Hata / Not</th>
                <th className="py-3.5 px-4 w-32 text-right">Tarih</th>
                <th className="py-3.5 px-4 w-24 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Ödeme kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-900">
                      <Link href="/admin/siparisler" className="hover:underline text-brand">
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                      ₺{Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(order.status)}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {order.iyzicoPaymentId ? (
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 truncate block max-w-[150px]">
                          {order.iyzicoPaymentId}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-sans text-xs">Havale / EFT</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {order.failureReason ? (
                        <span className="text-rose-600 font-medium truncate block max-w-[140px]" title={order.failureReason}>
                          {order.failureReason}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-500 font-mono">
                      {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setInspectingOrder(order)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-200 cursor-pointer"
                      >
                        İncele
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Inspector Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-inter">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-inter">Ödeme İşlem Detayı</h3>
                <p className="text-xs font-mono text-slate-400">Sipariş ID: {inspectingOrder.id}</p>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
              >
                ✕ Kapat
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Müşteri:</span>
                  <span className="text-slate-900 font-bold">{inspectingOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">E-Posta:</span>
                  <span className="text-slate-900 font-mono">{inspectingOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Ödeme Tutarı:</span>
                  <span className="text-slate-900 font-mono font-bold text-sm">
                    ₺{Number(inspectingOrder.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Durum:</span>
                  <span>{getStatusBadge(inspectingOrder.status)}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Ödeme Kanalı:</span>
                  <span className="text-slate-900 font-semibold">
                    {inspectingOrder.iyzicoPaymentId ? "iyzico 3D Secure Sanal POS" : "Banka Havale / EFT"}
                  </span>
                </div>
                {inspectingOrder.iyzicoPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">iyzico Payment ID:</span>
                    <span className="text-slate-900 font-mono select-all bg-white px-2 py-0.5 rounded border border-slate-200">
                      {inspectingOrder.iyzicoPaymentId}
                    </span>
                  </div>
                )}
                {inspectingOrder.iyzicoToken && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">iyzico Token:</span>
                    <span className="text-slate-900 font-mono select-all bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[220px]">
                      {inspectingOrder.iyzicoToken}
                    </span>
                  </div>
                )}
                {inspectingOrder.failureReason && (
                  <div className="p-2 bg-rose-50 rounded border border-rose-200 text-rose-700">
                    <strong>Hata Mesajı:</strong> {inspectingOrder.failureReason}
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">İşlem Tarihi:</span>
                  <span className="text-slate-900 font-mono">
                    {new Date(inspectingOrder.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <Link
                href="/admin/siparisler"
                className="text-xs font-bold text-brand hover:underline"
              >
                Sipariş Yönetimine Git &rarr;
              </Link>
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
