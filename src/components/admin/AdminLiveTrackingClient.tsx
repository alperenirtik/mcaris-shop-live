"use client";

import { useState, useEffect } from"react";
import Link from"next/link";
import { formatPrice } from"@/lib/format";

interface OrderItemData {
  id: string;
  productName: string;
  quantity: number;
}

interface OrderData {
  id: string;
  status: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  total: number | string | { toString(): string };
  trackingNumber: string | null;

  carrier: string | null;
  estimatedDelivery: string | null;
  driverName: string | null;
  driverPhone: string | null;
  lat: number | null;
  lng: number | null;
  items: OrderItemData[];
  createdAt: Date;
}

interface StaffMember {
  id: string;
  name: string;
  phone: string;
}

const INITIAL_STAFF: StaffMember[] = [];

interface AdminLiveTrackingClientProps {
  orders: OrderData[];
}

export default function AdminLiveTrackingClient({ orders: initialOrders }: AdminLiveTrackingClientProps) {
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(initialOrders[0]?.id || "");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Staff management state
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showManageStaffModal, setShowManageStaffModal] = useState(false);

  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Form states for selected order
  const [status, setStatus] = useState(selectedOrder?.status || "pending");
  const [carrier, setCarrier] = useState(selectedOrder?.carrier || "MCARIS Özel Medikal Filosu");
  const [trackingNumber, setTrackingNumber] = useState(selectedOrder?.trackingNumber || "");
  const [driverName, setDriverName] = useState(selectedOrder?.driverName || "");
  const [driverPhone, setDriverPhone] = useState(selectedOrder?.driverPhone || "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(selectedOrder?.estimatedDelivery || "Aynı Gün Teslimat");

  // Load stored staff list from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mcaris_staff_list");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStaffList(parsed);
        }
      }
    } catch {}
  }, []);

  const saveStaffListToStorage = (newList: StaffMember[]) => {
    setStaffList(newList);
    try {
      localStorage.setItem("mcaris_staff_list", JSON.stringify(newList));
    } catch {}
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    const target = orders.find((o) => o.id === id);
    if (target) {
      setStatus(target.status);
      setCarrier(target.carrier || "MCARIS Özel Medikal Filosu");
      setTrackingNumber(target.trackingNumber || "");
      setDriverName(target.driverName || "");
      setDriverPhone(target.driverPhone || "");
      setEstimatedDelivery(target.estimatedDelivery || "Aynı Gün Teslimat");
    }
  };

  const handleStaffSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val ==="__ADD_NEW__") {
      setShowAddStaffModal(true);
      return;
    }

    const selectedStaff = staffList.find((s) => s.id === val);
    if (selectedStaff) {
      setDriverName(selectedStaff.name);
      setDriverPhone(selectedStaff.phone);
    }
  };

  const handleAddNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: newStaffName.trim(),
      phone: newStaffPhone.trim() ||"05XX XXX XX XX",
    };

    const updated = [...staffList, newStaff];
    saveStaffListToStorage(updated);

    // Select the newly added staff member
    setDriverName(newStaff.name);
    setDriverPhone(newStaff.phone);

    setNewStaffName("");
    setNewStaffPhone("");
    setShowAddStaffModal(false);
  };

  const handleUpdateStaffMember = (id: string, name: string, phone: string) => {
    const updated = staffList.map((s) => (s.id === id ? { ...s, name: name.trim(), phone: phone.trim() } : s));
    saveStaffListToStorage(updated);
    setSuccessMsg("Personel bilgileri güncellendi!");
  };

  const handleDeleteStaffMember = (id: string) => {
    const updated = staffList.filter((s) => s.id !== id);
    saveStaffListToStorage(updated);
  };

  const handleSaveDriverToStaffList = () => {
    if (!driverName.trim()) return;
    const existing = staffList.find((s) => s.name.toLowerCase() === driverName.trim().toLowerCase());
    let updated: StaffMember[];
    if (existing) {
      updated = staffList.map((s) => (s.id === existing.id ? { ...s, name: driverName.trim(), phone: driverPhone.trim() } : s));
    } else {
      updated = [...staffList, { id: Date.now().toString(), name: driverName.trim(), phone: driverPhone.trim() }];
    }
    saveStaffListToStorage(updated);
    setSuccessMsg("Sürücü ve telefon numarası rehbere kaydedildi!");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    setSavingId(selectedOrderId);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/order-tracking", {
        method:"PUT",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({
          orderId: selectedOrderId,
          status,
          carrier,
          trackingNumber,
          driverName,
          driverPhone,
          estimatedDelivery,
        }),
      });

      if (res.ok) {
        setSuccessMsg("Sipariş canlı takip ve sevkiyat bilgileri veritabanına başarıyla kaydedildi!");
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrderId
              ? {
                  ...o,
                  status,
                  carrier,
                  trackingNumber,
                  driverName,
                  driverPhone,
                  estimatedDelivery,
                }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Admin kayıt hatası:", err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8 font-body">
      
      {/* Top Banner & Quick Driver Link */}
      <div className="bg-[#0F1E36] text-white p-6 md:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/15 border border-brand/30 text-brand text-xs font-bold mb-2">
            Canlı Sevkiyat Yönetim Merkezi
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-inter">Canlı Konum ve Sevkiyat Yönetimi</h1>
          <p className="text-xs md:text-sm text-slate-300 font-inter mt-1">
            Müşterilerin haritada göreceği sürücü, kargo takip nosu ve teslimat durumlarını buradan anlık yönetebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/sofor"
            target="_blank"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm rounded-xl transition-colors flex items-center gap-2"
          >
            <span>Şoför Mobil Paneli (/sofor) &rarr;</span>
          </Link>
          <Link
            href="/siparis-takip"
            target="_blank"
            className="px-4 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold text-xs md:text-sm rounded-xl transition-colors flex items-center gap-2"
          >
            <span>Müşteri Takip Ekranı &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Order Selection List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">Sevkiyat Bekleyen Siparişler ({orders.length})</h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {orders.map((o) => {
              const isSelected = o.id === selectedOrderId;
              return (
                <div
                  key={o.id}
                  onClick={() => handleSelectOrder(o.id)}
                  className={`p-4 rounded-xl border transition-colors cursor-pointer space-y-2 ${
                    isSelected
                      ? "border-brand bg-brand/5"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-500">
                      {o.id.slice(-10).toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        o.status ==="shipped"
                          ?"bg-blue-100 text-blue-800"
                          : o.status ==="completed"
                          ?"bg-emerald-100 text-emerald-800"
                          :"bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-gray-900">{o.customerName}</h3>
                    <span className="text-xs font-bold text-primary">{formatPrice(o.total.toString())}</span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-1">{o.shippingAddress}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Order Edit & Driver Management Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-xl space-y-6">
          {selectedOrder ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Seçili Sipariş</span>
                  <h3 className="text-lg font-black text-gray-900 font-mono">{selectedOrder.id}</h3>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Müşteri: {selectedOrder.customerName}
                </span>
              </div>

              {successMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold animate-in fade-in">
                  ✓ {successMsg}
                </div>
              )}

              {/* Status Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-inter">
                  Sevkiyat Aşaması &amp; Statüsü *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary transition-all bg-gray-50/50"
                >
                  <option value="pending">1. Sipariş Alındı / Onay Bekliyor (pending)</option>
                  <option value="paid">2. Ödeme Alındı - Hazırlanıyor & Test Yapılıyor (paid)</option>
                  <option value="shipped">3. Yolda / Sevkiyatta (shipped - Canlı Harita Aktif)</option>
                  <option value="completed">4. Teslim Edildi & Kuruldu (completed)</option>
                </select>
              </div>

              {/* Driver & Staff Select Dropdown with Add/Manage Option */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-inter">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider font-inter">
                    Sevkiyat Personeli / Şoför Seçimi
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddStaffModal(true)}
                      className="text-xs font-bold text-brand hover:underline cursor-pointer"
                    >
                      + Yeni Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowManageStaffModal(true)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                      Rehberi Yönet
                    </button>
                  </div>
                </div>

                <select
                  onChange={handleStaffSelectChange}
                  value={staffList.find((s) => s.name === driverName)?.id || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand transition-all bg-white cursor-pointer"
                >
                  <option value="">-- Eleman Rehberinden Seçiniz --</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} — Tel: {staff.phone}
                    </option>
                  ))}
                  <option value="__ADD_NEW__">+ Yeni Eleman / Sürücü Ekle...</option>
                </select>
              </div>

              {/* Driver Name & Phone Editable Inputs */}
              <div className="space-y-2 font-inter">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Sürücü &amp; Telefon Bilgisini Düzenle
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveDriverToStaffList}
                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                  >
                    Rehbere Kaydet / Güncelle
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Sürücü / Ekip Lideri Adı
                    </label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Örn: Murat Aksoy (Sürücü & Kurulum)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Sürücü Telefon Numarası
                    </label>
                    <input
                      type="text"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      placeholder="Örn: 0532 123 45 67"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand transition-all bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Carrier & Tracking Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-inter">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Araç Plakası / Filo
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="Örn: 06 MCR 34"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-brand font-mono uppercase focus:outline-none focus:border-brand transition-all bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Kargo Takip Numarası
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Örn: MCR-8849201"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand transition-all bg-white font-mono"
                  />
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="font-inter">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Tahmini Teslimat Zamanı
                </label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="Örn: Bugün 14:00 - 17:00 Arasında"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand transition-all bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={savingId === selectedOrderId}
                className="w-full bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-sm py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingId === selectedOrderId ? "Kaydediliyor..." : "Sevkiyat Bilgilerini Siparişe Kaydet"}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              Düzenlemek için sol taraftan bir sipariş seçiniz.
            </div>
          )}
        </div>

      </div>

      {/* Add New Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-inter">Yeni Eleman / Şoför Ekle</h3>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewStaff} className="space-y-3 font-inter">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Adı Soyadı &amp; Görevi *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Örn: Murat Aksoy (Sürücü & Kurulum)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Telefon Numarası *</label>
                <input
                  type="text"
                  required
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="Örn: 0532 123 45 67"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-brand font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Kaydet &amp; Seç
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Staff List Modal */}
      {showManageStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-inter">Eleman &amp; Sürücü Rehberini Düzenle</h3>
              <button
                type="button"
                onClick={() => setShowManageStaffModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 font-inter">
              {staffList.map((staff) => (
                <div key={staff.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={staff.name}
                      onChange={(e) => handleUpdateStaffMember(staff.id, e.target.value, staff.phone)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                    />
                    <input
                      type="text"
                      value={staff.phone}
                      onChange={(e) => handleUpdateStaffMember(staff.id, staff.name, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteStaffMember(staff.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                    >
                      Bu Elemanı Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowManageStaffModal(false)}
                className="px-5 py-2 rounded-xl bg-[#0F1E36] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Tamamlandı
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
