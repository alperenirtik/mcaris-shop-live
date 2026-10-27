"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import {
  createCouponAction,
  deleteCouponAction,
  toggleCouponStatusAction,
  updateShippingSettingsAction,
} from "@/app/actions/couponAdminActions";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface CouponItem {
  id: string;
  code: string;
  type: string;
  value: string | number | { toString(): string };
  minSubtotal: string | number | { toString(): string } | null;
  isActive: boolean;
  description: string;
  createdAt: Date;
}

interface ShippingSettings {
  cost: number;
  threshold: number;
}

interface AdminCouponsClientProps {
  coupons: CouponItem[];
  shippingSettings?: ShippingSettings;
}

export default function AdminCouponsClient({ coupons, shippingSettings }: AdminCouponsClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<{ id: string; code: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const q = search.toLowerCase().trim();
      return !q || c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    });
  }, [coupons, search]);

  const activeCount = coupons.filter((c) => c.isActive).length;
  const passiveCount = coupons.filter((c) => !c.isActive).length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success(`'${text}' panoya kopyalandı.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  async function handleToggleStatus(couponId: string, currentStatus: boolean) {
    setLoadingId(couponId);
    setError(null);
    setSuccessMsg(null);

    const res = await toggleCouponStatusAction(couponId, !currentStatus);
    if (res.error) {
      const msg = res.error || "Kupon durumu güncellenemedi.";
      setError(msg);
      toast.error(msg);
    } else {
      const msg = res.message || `Kupon ${!currentStatus ? "Aktif" : "Pasif"} duruma getirildi.`;
      setSuccessMsg(msg);
      toast.success(msg);
    }
    setLoadingId(null);
  }

  async function handleConfirmDelete() {
    if (!couponToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);
      setSuccessMsg(null);

      const res = await deleteCouponAction(couponToDelete.id);
      if (res.error) {
        const msg = res.error || "Kupon silinemedi.";
        setError(msg);
        toast.error(msg);
      } else {
        const msg = res.message || `'${couponToDelete.code}' kuponu başarıyla silindi.`;
        setSuccessMsg(msg);
        toast.success(msg);
        setCouponToDelete(null);
      }
    } catch {
      toast.error("Kupon silinirken bir hata oluştu.");
      setError("Kupon silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    const res = await createCouponAction({}, formData);
    if (res.error) {
      setError(res.error || "Kupon oluşturulamadı.");
    } else {
      setSuccessMsg(res.message || "Yeni kupon başarıyla oluşturuldu ve aktif edildi.");
      form.reset();
    }
    setSubmitting(false);
  }

  async function handleUpdateShipping(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingShipping(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateShippingSettingsAction({}, formData);
    if (res.error) {
      setError(res.error || "Kargo ayarları güncellenemedi.");
    } else {
      setSuccessMsg(res.message || "Mağaza kargo ayarları başarıyla kaydedildi.");
    }
    setSavingShipping(false);
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">Kuponlar &amp; Kargo Ayarları</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
            İndirim kuponlarını yönetin ve mağaza kargo ücreti kurallarını belirleyin.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-center">
            <span className="text-lg font-bold font-inter block">{activeCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Aktif Kupon</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-center">
            <span className="text-lg font-bold font-inter block">{passiveCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Pasif Kupon</span>
          </div>
        </div>
      </div>

      {/* Global Alert Messages */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-inter">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-inter">
          {successMsg}
        </div>
      )}

      {/* Shipping Fee Management Card */}
      <div className="bg-[#0F1E36] rounded-2xl p-5 md:p-6 text-white border border-slate-800 space-y-4 font-inter shadow-sm">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 text-brand flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-inter">Mağaza Kargo Ücreti Ayarları</h2>
            <p className="text-xs text-slate-300 font-inter">
              Siparişlerde uygulanacak sabit kargo ücretini ve ücretsiz kargo alt limitini anında değiştirin.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateShipping} className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1 items-end">
          <div className="sm:col-span-4">
            <label className="text-xs font-bold text-slate-300 block mb-1 font-inter uppercase">
              Sabit Kargo Ücreti (TL)
            </label>
            <input
              type="number"
              name="shippingCost"
              step="0.01"
              min="0"
              defaultValue={shippingSettings?.cost ?? 0}
              placeholder="0 (Ücretsiz Kargo İçin 0 Yazın)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-brand focus:bg-white/15 transition-colors font-mono"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="text-xs font-bold text-slate-300 block mb-1 font-inter uppercase">
              Ücretsiz Kargo Alt Limiti (TL)
            </label>
            <input
              type="number"
              name="freeShippingMin"
              step="0.01"
              min="0"
              defaultValue={shippingSettings?.threshold ?? 0}
              placeholder="0 (Her Sepete Ücretsiz İçin 0 Yazın)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-bold focus:outline-none focus:border-brand focus:bg-white/15 transition-colors font-mono"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={savingShipping}
              className="w-full bg-[#00B4D8] hover:bg-[#0096C7] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingShipping ? "Kaydediliyor..." : "Kargo Ayarlarını Kaydet"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-inter items-start">
        {/* Left Column: Coupon List & Toggle Switches (7-cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-inter">Mevcut Kupon Listesi ({coupons.length})</h2>
              <p className="text-xs text-slate-500">1 Tıkla Aktifleştirin veya Devre Dışı Bırakın</p>
            </div>
            <div className="w-full sm:w-60 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kupon kodu veya açıklama ara..."
                className="w-full pl-8 pr-7 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand bg-slate-50/50"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Aramayı temizle"
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {filteredCoupons.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <p className="font-bold font-inter text-xs sm:text-sm">Arama kriterinize uygun kupon bulunamadı.</p>
              <p className="text-xs text-slate-400">Sağ taraftaki formdan hemen yeni bir kupon oluşturabilirsiniz.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCoupons.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    c.isActive
                      ? "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                      : "bg-slate-50 border-slate-200/60 opacity-75"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#0F1E36] text-brand font-mono font-bold text-xs rounded-lg uppercase tracking-wider select-all">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(c.code)}
                        aria-label={`'${c.code}' kupon kodunu kopyala`}
                        className="px-2 py-0.5 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Kodu Kopyala"
                      >
                        {copiedCode === c.code ? (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Kopyala</span>
                          </>
                        )}
                      </button>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {c.type === "percentage" ? `%${Number(c.value)} İndirim` : `${formatPrice(c.value.toString())} İndirim`}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 font-inter">{c.description}</p>

                    {c.minSubtotal && (
                      <p className="text-[11px] text-slate-500 font-inter">
                        Min. Sepet Tutarı: <strong className="text-slate-900">{formatPrice(c.minSubtotal.toString())}</strong>
                      </p>
                    )}
                  </div>

                  {/* Right Side Controls */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      disabled={loadingId === c.id}
                      onClick={() => handleToggleStatus(c.id, c.isActive)}
                      aria-label={`'${c.code}' kuponunu ${c.isActive ? "pasif yap" : "aktif yap"}`}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer ${
                        c.isActive
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      }`}
                    >
                      <span>
                        {c.isActive ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" /> AKTİF
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> PASİF
                          </span>
                        )}
                      </span>
                      {loadingId === c.id && (
                        <svg className="animate-spin h-3.5 w-3.5 ml-1" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isDeleting || loadingId === c.id}
                      onClick={() => setCouponToDelete({ id: c.id, code: c.code })}
                      aria-label={`'${c.code}' kuponunu sil`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-bold cursor-pointer disabled:opacity-50"
                      title="Kuponu Sil"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Create New Coupon Form (5-cols) - Sticky */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-sm space-y-4 font-inter sticky top-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-inter">Yeni Kupon Oluştur</h2>
            <p className="text-xs text-slate-500 font-inter">İstediğiniz kod ve indirim oranında özel kupon tanımlayın.</p>
          </div>

          <form onSubmit={handleCreate} className="space-y-3.5 font-inter text-xs">
            {/* Coupon Code Input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 font-inter">
                Kupon Kodu (Örn: MCARIS2026) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                required
                placeholder="Örn. YAZ20"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 font-mono"
              />
            </div>

            {/* Discount Type and Value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 font-inter">İndirim Türü</label>
                <select
                  name="type"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-brand"
                >
                  <option value="fixed">Sabit Tutar (TL)</option>
                  <option value="percentage">Yüzdelik (%)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-inter">
                  İndirim Değeri <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  step="0.01"
                  required
                  placeholder="örn. 900 veya 15"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand font-mono"
                />
              </div>
            </div>

            {/* Min Subtotal */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 font-inter">
                Minimum Sepet Tutarı (TL) (Opsiyonel)
              </label>
              <input
                type="number"
                name="minSubtotal"
                step="0.01"
                placeholder="örn. 5000 (Yoksa boş bırakın)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand font-mono"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 font-inter">
                Kupon Açıklaması <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                required
                placeholder="Örn: 900 TL Net Sepet İndirimi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm mt-2"
            >
              {submitting ? "Kupon Oluşturuluyor..." : "Kuponu Kaydet & Aktif Et"}
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(couponToDelete)}
        onClose={() => setCouponToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Kuponu Sil"
        description={`'${couponToDelete?.code}' kuponunu tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Kuponu Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
