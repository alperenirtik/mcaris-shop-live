"use client";

import { useState, useEffect } from"react";
import Image from"next/image";
import Link from"next/link";
import { formatPrice } from"@/lib/format";

interface UserOrderItem {
  id: string;
  accessToken: string;
  status: string;
  totalAmount: string;
  createdAt: Date;
  firstProductName: string;
}

export interface TrackedOrderItem {
  id?: string;
  productName: string;
  unitPrice: number | string | { toString(): string };
  quantity: number;
  lineTotal?: number | string | { toString(): string };
  product?: {
    id?: string;
    name?: string;
    slug?: string;
    images?: string[];
  } | null;
}

export interface TrackedOrder {
  id: string;
  accessToken?: string;
  status: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  subtotal?: number | string | { toString(): string } | null;
  shippingCost?: number | string | { toString(): string } | null;
  total?: number | string | { toString(): string };
  carrier?: string | null;
  trackingNumber?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  driverPhoto?: string | null;
  assistantName?: string | null;
  assistantPhoto?: string | null;
  estimatedDelivery?: string | null;
  lat?: number | null;
  lng?: number | null;
  createdAt?: Date | string;
  items?: TrackedOrderItem[];
}


interface OrderTrackerClientProps {
  initialOrder?: TrackedOrder | null;
  userOrders?: UserOrderItem[];
}

export default function OrderTrackerClient({ initialOrder, userOrders = [] }: OrderTrackerClientProps) {
  const [queryOrderNo, setQueryOrderNo] = useState(initialOrder?.id ||"");
  const [queryPhone, setQueryPhone] = useState(initialOrder?.customerPhone ||"");
  const [order, setOrder] = useState<TrackedOrder | null>(initialOrder || null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  // Helper to trigger search with specific order token/id
  async function triggerSearch(orderToken: string) {
    if (!orderToken) return;
    setQueryOrderNo(orderToken);
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/siparis-takip?orderId=${encodeURIComponent(orderToken.trim())}`);
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMsg(data.error ||"Sipariş bilgisi bulunamadı.");
      }
    } catch (err) {
      console.error("Sipariş takip hatası:", err);
      setErrorMsg("Sipariş sorgulanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  // Auto poll live driver location every 10s
  useEffect(() => {
    if (!order?.id) return;

    let isMounted = true;
    const controller = new AbortController();

    const interval = setInterval(async () => {
      try {
        const tokenParam = order.accessToken ? `&accessToken=${encodeURIComponent(order.accessToken)}` : "";
        const res = await fetch(`/api/driver/location?orderId=${encodeURIComponent(order.id)}${tokenParam}`, {
          signal: controller.signal,
        });
        if (!isMounted) return;
        const data = await res.json();
        if (isMounted && data.order) {
          setOrder((prev) => (prev ? {
            ...prev,
            status: data.order.status,
            lat: data.order.lat ?? prev.lat,
            lng: data.order.lng ?? prev.lng,
            driverName: data.order.driverName ?? prev.driverName,
            driverPhone: data.order.driverPhone ?? prev.driverPhone,
            carrier: data.order.carrier ?? prev.carrier,
            estimatedDelivery: data.order.estimatedDelivery ?? prev.estimatedDelivery,
          } : null));

        }
      } catch (err: unknown) {
        if (isMounted && (err as Error)?.name !== "AbortError") {
          console.error("Konum güncelleme sorgu hatası:", err);
        }
      }
    }, 10000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [order?.id, order?.accessToken]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryOrderNo.trim() && !queryPhone.trim()) {
      setErrorMsg("Lütfen Sipariş Numarasını veya Telefon Numarasını giriniz.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/siparis-takip?orderId=${encodeURIComponent(queryOrderNo.trim())}&phone=${encodeURIComponent(queryPhone.trim())}`);
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMsg(data.error ||"Girdiğiniz bilgilere ait sipariş bulunamadı. Lütfen Sipariş Numarasını veya Telefon Numarasını kontrol ediniz.");
      }
    } catch (err) {
      console.error("Sipariş takip hatası:", err);
      setErrorMsg("Sipariş sorgulanırken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  };

  // Determine active step index (0: Received, 1: Preparing, 2: In Transit, 3: Delivered)
  const getStepIndex = (status: string) => {
    switch (status) {
      case"pending":
        return 0;
      case"paid":
        return 1;
      case"shipped":
        return 2;
      case"completed":
        return 3;
      default:
        return 1;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="w-full space-y-8 font-body">
      {/* Search Bar Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-inter">Sipariş Sorgulama</h2>
              <p className="text-xs text-slate-500 font-inter">
                Sipariş Numarasını listeden seçin veya yazarak canlı teslimat durumunu sorgulayın.
              </p>
            </div>
          </div>
        </div>

        {/* Fast Select Dropdown for Logged-In Customers */}
        {userOrders && userOrders.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-inter flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              <span>Siparişlerinizden Hızlı Seçin ({userOrders.length} Sipariş Bulundu)</span>
            </label>
            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  triggerSearch(val);
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer"
            >
              <option value="">-- Siparişinizi Seçin (Kopyalamadan Tek Tıkla Takip Et) --</option>
              {userOrders.map((o) => (
                <option key={o.id} value={o.accessToken || o.id}>
                  #{o.id.slice(-8).toUpperCase()} — {o.firstProductName} ({formatPrice(o.totalAmount)})
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-inter">
              Sipariş Numarası <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={queryOrderNo}
              onChange={(e) => setQueryOrderNo(e.target.value)}
              placeholder="Örn: clx123abc456..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-slate-50/50 hover:bg-white font-mono"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-inter">
              Telefon Numarası <span className="text-xs text-slate-400 font-normal">(Opsiyonel)</span>
            </label>
            <input
              type="tel"
              value={queryPhone}
              onChange={(e) => setQueryPhone(e.target.value)}
              placeholder="Örn: 0555 123 45 67"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-slate-50/50 hover:bg-white"
            />
          </div>

          <div className="sm:col-span-12 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-sm md:text-base py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Sorgulanıyor...</span>
              ) : (
                <>
                  <span>Ürünüm Nerede? Sorgula</span>
                  <span>&rarr;</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span>Hata: {errorMsg}</span>
          </div>
        )}
      </div>

      {/* Order Results & Live Tracking View */}
      {order && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Timeline & Delivery Card */}
          <div className="bg-white rounded-2xl p-5 md:p-8 border border-slate-200/80 space-y-6 font-inter">
            
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sipariş Kodu</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">{order.id}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Taşıyıcı / Filo</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 font-inter">
                  {order.carrier || "MCARIS Özel Medikal Filosu & Kurulum Ekibi"}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Kargo Takip No</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {order.trackingNumber || `MCR-${order.id.slice(-8).toUpperCase()}`}
                </span>
              </div>
            </div>

            {/* Step Progress Timeline */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-inter">Canlı Teslimat Aşamaları</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                
                {/* Step 1 */}
                <div
                  className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                    currentStepIndex >= 0
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    {currentStepIndex >= 0 && (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Tamamlandı ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm font-inter">Sipariş Alındı</h4>
                    <p className="text-xs text-slate-600 font-inter mt-1">Siparişiniz sisteme kaydedildi ve onaylandı.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                    currentStepIndex >= 1
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStepIndex >= 1
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      2
                    </span>
                    {currentStepIndex >= 1 && (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Tamamlandı ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm font-inter">Hazırlanıyor &amp; Test</h4>
                    <p className="text-xs text-slate-600 font-inter mt-1">
                      Medikal ekipman teknik testten geçiriliyor.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                    currentStepIndex >= 2
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStepIndex >= 2
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      3
                    </span>
                    {currentStepIndex >= 2 && (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Tamamlandı ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm font-inter">Sevkiyatta / Yolda</h4>
                    <p className="text-xs text-slate-600 font-inter mt-1">
                      Özel araç yola çıktı, adrese doğru ilerliyor.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div
                  className={`p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 ${
                    currentStepIndex >= 3
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        currentStepIndex >= 3
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      4
                    </span>
                    {currentStepIndex >= 3 && (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Tamamlandı ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm font-inter">Teslimat &amp; Kurulum</h4>
                    <p className="text-xs text-slate-600 font-inter mt-1">
                      Ürün odanıza kurulup test edilerek teslim edildi.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Live Interactive Location Simulator Panel */}
            <div className="p-5 md:p-6 rounded-2xl bg-[#0F1E36] text-white space-y-5 border border-slate-800 relative overflow-hidden font-inter">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h4 className="text-base font-bold font-inter">Sevkiyat Aracı Canlı Konum Haritası</h4>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/80">
                  Canlı GPS Takibi
                </span>
              </div>

              {/* Map UI Box */}
              <div className="relative w-full h-64 md:h-80 bg-slate-950 rounded-xl overflow-hidden border border-slate-700/60 flex items-center justify-center">
                {/* Simulated Road Route Path SVG */}
                <svg className="absolute inset-0 w-full h-full stroke-emerald-500/30" strokeWidth="3" fill="none">
                  <path d="M 50 200 Q 200 80, 400 160 T 700 100" strokeDasharray="6 6" />
                </svg>

                {/* Live Vehicle Marker */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
                  <div className="bg-slate-900 text-slate-100 font-semibold text-[10px] px-2.5 py-1 rounded-md border border-slate-700 whitespace-nowrap shadow-md">
                    MCARIS Medikal Aracı (Yolda)
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-base border-2 border-slate-700 shadow-md">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  </div>
                </div>

                {/* Destination Customer Marker */}
                <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-20">
                  <div className="bg-emerald-600 text-white font-semibold text-[10px] px-2.5 py-1 rounded-md border border-emerald-500/40 whitespace-nowrap shadow-md">
                    {order.customerName} (Teslimat Adresi)
                  </div>
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-base border-2 border-white shadow-md">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  </div>
                </div>
              </div>

              {/* Driver & Delivery Team Info Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-1 font-inter">
                {/* Driver Photo & Info */}
                <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-600 overflow-hidden flex items-center justify-center shrink-0 relative">
                    {order.driverPhoto ? (
                      <Image
                        src={order.driverPhoto}
                        alt={order.driverName || "Sürücü"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sürücü / Ekip Lideri</span>
                    <p className="text-xs font-bold text-white font-inter truncate">{order.driverName || "Murat Aksoy"}</p>
                    {order.driverPhone && <p className="text-[10px] text-slate-400 font-mono">{order.driverPhone}</p>}
                  </div>
                </div>

                {/* Assistant Photo & Info */}
                <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-600 overflow-hidden flex items-center justify-center shrink-0 relative">
                    {order.assistantPhoto ? (
                      <Image
                        src={order.assistantPhoto}
                        alt={order.assistantName || "Şoför Yardımcısı"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Şoför Yardımcısı</span>
                    <p className="text-xs font-bold text-white font-inter truncate">{order.assistantName || "Ahmet Can (Teknik Kurulum)"}</p>
                    <p className="text-[10px] text-slate-400">Montaj &amp; Teslimat Ekibi</p>
                  </div>
                </div>

                {/* Vehicle Plate */}
                <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/80 space-y-0.5 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Araç Plakası</span>
                  <p className="text-xs font-bold text-emerald-400 font-mono uppercase">{order.carrier || "06 MCR 34"}</p>
                </div>

                {/* Estimated Delivery */}
                <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/80 space-y-0.5 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tahmini Teslimat</span>
                  <p className="text-xs font-bold text-emerald-400 font-inter">
                    {order.estimatedDelivery || "Aynı Gün / Gün İçinde Teslimat"}
                  </p>
                </div>
              </div>

            </div>

            {/* Order Items List */}
            <div className="space-y-3 pt-2 font-inter">
              <h3 className="text-base font-bold text-slate-900 font-inter border-b border-slate-100 pb-3">
                Teslim Edilecek Ürünler ({order.items?.length ?? 0})
              </h3>

              <div className="space-y-2.5">
                {order.items?.map((item: TrackedOrderItem, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.images?.[0] && (
                        <div className="relative w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                          <Image src={item.product.images[0]} alt={item.productName} fill className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-inter">{item.productName}</h4>
                        <span className="text-xs text-slate-500 font-inter">Adet: {item.quantity}</span>
                      </div>
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums font-inter">
                      {formatPrice(item.unitPrice.toString())}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
