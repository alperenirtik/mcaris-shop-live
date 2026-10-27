"use client";

import { useState } from "react";
import { logoutAction } from "@/app/actions/authActions";
import { updateProfileAction, changePasswordAction } from "@/app/actions/userActions";
import Image from "next/image";

interface OrderItemData {
  id: string;
  productName: string;
  unitPrice: number | string | { toString(): string };
  quantity: number;
}

interface OrderData {
  id: string;
  accessToken?: string;
  status: string;
  total: number | string | { toString(): string };
  createdAt: Date;
  invoiceUrl?: string | null;
  items: OrderItemData[];
}

interface AddressData {
  id: string;
  title: string;
  city: string | null;
  district: string | null;
  fullText: string;
  isDefault: boolean;
}

interface AccountClientProps {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    address: string | null;
    role: string;
    addresses?: AddressData[];
  };
  orders: OrderData[];
}

export default function AccountClient({ user, orders }: AccountClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders" | "security">("profile");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passSaving, setPassSaving] = useState(false);

  // Address Management State
  const [addressList, setAddressList] = useState<AddressData[]>(user.addresses || []);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [addressTitle, setAddressTitle] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressDistrict, setAddressDistrict] = useState("");
  const [addressFullText, setAddressFullText] = useState("");
  const [addressIsDefault, setAddressIsDefault] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressModalError, setAddressModalError] = useState<string | null>(null);

  const openNewAddressModal = () => {
    setEditingAddress(null);
    setAddressTitle("");
    setAddressCity("");
    setAddressDistrict("");
    setAddressFullText("");
    setAddressIsDefault(addressList.length === 0);
    setAddressModalError(null);
    setShowAddressModal(true);
  };

  const openEditAddressModal = (addr: AddressData) => {
    setEditingAddress(addr);
    setAddressTitle(addr.title);
    setAddressCity(addr.city || "");
    setAddressDistrict(addr.district || "");
    setAddressFullText(addr.fullText);
    setAddressIsDefault(addr.isDefault);
    setAddressModalError(null);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressTitle.trim() || !addressFullText.trim()) {
      setAddressModalError("Lütfen adres başlığı ve açık adres alanlarını doldurunuz.");
      return;
    }

    setAddressSaving(true);
    setAddressModalError(null);

    try {
      if (editingAddress) {
        // Update existing address
        const res = await fetch("/api/user/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingAddress.id,
            title: addressTitle.trim(),
            city: addressCity.trim() || null,
            district: addressDistrict.trim() || null,
            fullText: addressFullText.trim(),
            isDefault: addressIsDefault,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Adres güncellenemedi.");
        }
        setAddressList((prev) =>
          prev.map((a) => {
            if (a.id === editingAddress.id) {
              return {
                ...a,
                title: addressTitle.trim(),
                city: addressCity.trim() || null,
                district: addressDistrict.trim() || null,
                fullText: addressFullText.trim(),
                isDefault: addressIsDefault,
              };
            }
            return addressIsDefault ? { ...a, isDefault: false } : a;
          })
        );
      } else {
        // Create new address
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: addressTitle.trim(),
            city: addressCity.trim() || null,
            district: addressDistrict.trim() || null,
            fullText: addressFullText.trim(),
            isDefault: addressIsDefault,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Adres kaydedilemedi.");
        }
        if (data.address) {
          setAddressList((prev) => [
            ...(addressIsDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev),
            data.address,
          ]);
        }
      }
      setShowAddressModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "İşlem sırasında hata oluştu.";
      setAddressModalError(msg);
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await fetch("/api/user/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAddressList((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Adres silinemedi:", err);
    }
  };

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSaving(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateProfileAction({}, formData);

    if (result.error) {
      setError(result.error);
    } else if (result.message) {
      setSuccessMsg(result.message);
    }
    setSaving(false);
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPassError(null);
    setPassSuccessMsg(null);
    setPassSaving(true);

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const result = await changePasswordAction({}, formData);

    if (result.error) {
      setPassError(result.error);
    } else if (result.message) {
      setPassSuccessMsg(result.message);
      formEl.reset();
    }
    setPassSaving(false);
  }

  function getStatusBadge(status: string) {
    const uppercaseStatus = status.toUpperCase();
    switch (uppercaseStatus) {
      case "SHIPPED":
      case "IN_TRANSIT":
      case "YOLDA":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-blue-600">
              <rect x="1" y="3" width="15" height="13" rx="1.5" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="text-xs font-bold">Kargoda (Yolda)</span>
          </div>
        );
      case "PREPARING":
      case "PENDING":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-amber-600">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="text-xs font-bold">Hazırlanıyor</span>
          </div>
        );
      case "DELIVERED":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="text-xs font-bold">Teslim Edildi</span>
          </div>
        );
      case "PAID":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            <span className="text-xs font-bold">Ödeme Alındı</span>
          </div>
        );
      case "CANCELLED":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="text-xs font-bold">İptal Edildi</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-xs font-bold">{status}</span>
          </div>
        );
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-4 py-6 md:py-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-32">
            
            {/* User Profile Mini Banner */}
            <div className="bg-gradient-to-br from-[#0F1E36] to-[#1E355C] p-4 sm:p-5 lg:p-6 text-center relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white/20 relative z-10 mb-2 lg:mb-3">
                <span className="text-xl sm:text-2xl font-black text-[#0F1E36]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-white font-bold text-base lg:text-lg relative z-10">{user.name}</h1>
              <p className="text-slate-300 text-xs font-medium relative z-10">{user.email}</p>
            </div>

            {/* Navigation Links - Mobile Horizontal Scroll, Desktop Vertical List */}
            <nav className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar p-2 lg:p-3 gap-1.5 scroll-smooth touch-pan-x items-center lg:items-stretch">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all font-bold text-xs lg:text-sm text-left whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === "profile" 
                    ? "bg-brand/10 text-brand shadow-xs" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Kişisel Bilgilerim</span>
              </button>
              
              <button
                onClick={() => setActiveTab("addresses")}
                className={`flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all font-bold text-xs lg:text-sm text-left whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === "addresses" 
                    ? "bg-brand/10 text-brand shadow-xs" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Adres Defterim</span>
              </button>
              
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all font-bold text-xs lg:text-sm text-left whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === "orders" 
                    ? "bg-brand/10 text-brand shadow-xs" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Siparişlerim</span>
                <span className="ml-1.5 lg:ml-auto bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] lg:text-xs">
                  {orders.length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all font-bold text-xs lg:text-sm text-left whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === "security" 
                    ? "bg-brand/10 text-brand shadow-xs" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Güvenlik &amp; Şifre</span>
              </button>
              
              {user.role === "ADMIN" && (
                <div className="shrink-0 lg:pt-3 lg:mt-1 lg:border-t lg:border-slate-100">
                  <a
                    href="/admin"
                    className="flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all font-bold text-xs lg:text-sm text-left text-rose-600 hover:bg-rose-50 whitespace-nowrap shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>Admin Paneli</span>
                  </a>
                </div>
              )}
              
              <div className="shrink-0 lg:pt-3 lg:mt-1 lg:border-t lg:border-slate-100">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-auto lg:w-full flex items-center gap-2 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all font-bold text-xs lg:text-sm text-left text-slate-500 hover:text-slate-900 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Güvenli Çıkış</span>
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">Kişisel Bilgilerim</h1>
                  <p className="text-slate-500 text-sm mt-1">İletişim ve adres bilgilerinizi güncel tutun.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-700 text-sm font-bold border border-rose-200 flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-bold border border-emerald-200 flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ad Soyad</label>
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={user.name}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">E-posta Adresi</label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          defaultValue={user.email}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 bg-slate-50 cursor-not-allowed shadow-sm"
                        />
                        <div className="absolute right-3 top-3 text-slate-400">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 font-medium">Güvenlik nedeniyle e-posta adresi değiştirilemez.</p>
                    </div>

                    <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">İletişim & Teslimat Bilgileri</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Telefon Numarası</label>
                          <input
                            type="tel"
                            name="phone"
                            defaultValue={user.phone || ""}
                            placeholder="+90 5XX XXX XX XX"
                            className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 font-mono transition-all shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Açık Adres (Fatura & Teslimat)</label>
                          <textarea
                            name="address"
                            rows={4}
                            defaultValue={user.address || ""}
                            placeholder="İl, İlçe, Mahalle, Cadde, Sokak, No, Daire..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm resize-y"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-slate-100 pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3.5 bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-slate-200 flex items-center gap-2 hover:shadow-lg"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>Değişiklikleri Kaydet</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Adres Defterim</h1>
                    <p className="text-slate-500 text-sm mt-1">Kayıtlı teslimat ve fatura adresleriniz.</p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewAddressModal}
                    className="px-4 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Yeni Adres Ekle
                  </button>
                </div>

                {(!addressList || addressList.length === 0) ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
                    <p className="text-slate-500 font-medium text-sm">Henüz kayıtlı bir adresiniz bulunmuyor.</p>
                    <button
                      type="button"
                      onClick={openNewAddressModal}
                      className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      + İlk Adresinizi Ekleyin
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addressList.map((address) => (
                      <div key={address.id} className={`p-5 rounded-2xl border transition-all ${address.isDefault ? 'border-brand bg-brand/5 shadow-xs' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                            {address.title}
                            {address.isDefault && (
                              <span className="px-2 py-0.5 bg-brand text-white text-[10px] uppercase font-bold rounded-full">Varsayılan</span>
                            )}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mb-3 min-h-[2.5rem] line-clamp-2 leading-relaxed">{address.fullText}</p>
                        <p className="text-xs font-bold text-slate-800 mb-4">{address.district ? `${address.district}, ` : ""}{address.city || ""}</p>
                        <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => openEditAddressModal(address)}
                            className="text-brand text-xs font-bold hover:underline cursor-pointer"
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-rose-600 text-xs font-bold hover:underline cursor-pointer"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECURITY & PASSWORD TAB */}
          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">Güvenlik ve Şifre</h1>
                  <p className="text-slate-500 text-sm mt-1">Hesap güvenliğinizi sağlamak için şifrenizi güçlü tutun.</p>
                </div>

                {passError && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-700 text-sm font-bold border border-rose-200 flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{passError}</span>
                  </div>
                )}
                {passSuccessMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-bold border border-emerald-200 flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{passSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mevcut Şifreniz</label>
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifreniz</label>
                    <input
                      type="password"
                      name="newPassword"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
                    />
                    <p className="text-xs text-slate-400 mt-2">En az 6 karakter olmalı, harf ve rakam içermelidir.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Yeni Şifre Tekrarı</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={passSaving}
                      className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-200 flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>{passSaving ? "Şifre Güncelleniyor..." : "Şifremi Güncelle"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Sipariş Geçmişim</h1>
                  <p className="text-slate-500 text-sm mt-1">Tüm siparişlerinizi ve güncel durumlarını buradan takip edebilirsiniz.</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Henüz siparişiniz bulunmuyor</h3>
                  <p className="text-slate-500 text-sm mb-8 max-w-sm">Size özel sunduğumuz hasta yatağı ve medikal ürünleri inceleyerek ilk siparişinizi oluşturabilirsiniz.</p>
                  <a href="/urunler" className="px-6 py-3 bg-brand text-[#0F1E36] font-bold rounded-xl hover:bg-brand-dark hover:text-white transition-colors">
                    Ürünleri İncele
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      {/* Order Header */}
                      <div className="bg-slate-50 border-b border-slate-100 p-4 sm:p-5 md:p-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 md:gap-12 w-full sm:w-auto">
                          <div>
                            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Sipariş No</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Sipariş Tarihi</span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Toplam Tutar</span>
                            <span className="text-xs sm:text-sm font-bold text-brand">₺{Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                        
                        <div className="w-full sm:w-auto flex justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/60">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-5 md:p-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sipariş Detayı</h4>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0 last:pb-0">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                  </svg>
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-slate-800 line-clamp-1">{item.productName}</h5>
                                  <span className="text-xs font-medium text-slate-500">Adet: {item.quantity}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-sm font-bold text-slate-900 font-mono">₺{Number(item.unitPrice).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Footer Actions */}
                      <div className="bg-slate-50/50 border-t border-slate-100 p-4 md:px-6 flex flex-wrap justify-end gap-3">
                        {order.invoiceUrl && (
                          <a
                            href={order.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-2 shadow-sm"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <span>E-Fatura</span>
                          </a>
                        )}
                        <a
                          href={`/siparis-takip?siparisNo=${order.accessToken || order.id}`}
                          className="px-4 py-2 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>Siparişi Takip Et</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Address Create / Edit Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Teslimat ve faturalandırma için adres detaylarını girin.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center hover:bg-slate-200 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {addressModalError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                {addressModalError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adres Başlığı (Örn: Evim, İşyeri, Klinik) *
                </label>
                <input
                  type="text"
                  required
                  value={addressTitle}
                  onChange={(e) => setAddressTitle(e.target.value)}
                  placeholder="Örn: Ev Adresim"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Şehir / İl</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="Örn: Ankara"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İlçe</label>
                  <input
                    type="text"
                    value={addressDistrict}
                    onChange={(e) => setAddressDistrict(e.target.value)}
                    placeholder="Örn: Çankaya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Açık Adres *</label>
                <textarea
                  rows={3}
                  required
                  value={addressFullText}
                  onChange={(e) => setAddressFullText(e.target.value)}
                  placeholder="Mahalle, Cadde, Sokak, No, Daire..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white resize-y"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefaultCheckbox"
                  checked={addressIsDefault}
                  onChange={(e) => setAddressIsDefault(e.target.checked)}
                  className="rounded border-slate-300 text-brand focus:ring-brand accent-brand cursor-pointer"
                />
                <label htmlFor="isDefaultCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Varsayılan teslimat adresi olarak ayarla
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {addressSaving ? "Kaydediliyor..." : (editingAddress ? "Değişiklikleri Güncelle" : "Adresi Kaydet")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
