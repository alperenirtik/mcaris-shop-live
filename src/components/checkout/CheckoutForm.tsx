"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { createOrderAndRedirectAction } from "@/app/checkout/actions";
import { TURKEY_CITIES } from "@/lib/turkey-cities";
import { BANK_IBAN, BANK_NAME, BANK_ACCOUNT_HOLDER } from "@/lib/constants";
import PaymentLogos from "@/components/layout/PaymentLogos";

interface CheckoutFormProps {
  initialUser?: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  } | null;
}

export default function CheckoutForm({ initialUser }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card");
  const [couponCode, setCouponCode] = useState("");
  
  useEffect(() => {
    const handleCoupon = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setCouponCode(customEvent.detail || "");
    };

    window.addEventListener("mcaris_coupon_changed", handleCoupon);
    return () => {
      window.removeEventListener("mcaris_coupon_changed", handleCoupon);
    };
  }, []);

  const initialCityName = useMemo(() => {
    if (!initialUser?.address) return "";
    const matchedCity = TURKEY_CITIES.find((c) =>
      initialUser.address?.toLowerCase().includes(c.name.toLowerCase())
    );
    return matchedCity ? matchedCity.name : "";
  }, [initialUser?.address]);

  const [selectedCity, setSelectedCity] = useState(initialCityName);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [customerName, setCustomerName] = useState(initialUser?.name || "");
  const [customerPhone, setCustomerPhone] = useState(initialUser?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(initialUser?.email || "");
  const [shippingAddress, setShippingAddress] = useState(initialUser?.address || "");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const iban = BANK_IBAN;

  const districts = useMemo(() => {
    const cityObj = TURKEY_CITIES.find((c) => c.name === selectedCity);
    return cityObj ? cityObj.districts : [];
  }, [selectedCity]);

  const handleCopyIban = () => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form
      action={createOrderAndRedirectAction}
      onSubmit={() => setIsSubmitting(true)}
      className="bg-[#0F1E36] rounded-2xl p-6 md:p-8 border border-slate-700 space-y-6"
    >
      <input
        type="hidden"
        name="paymentMethod"
        value={paymentMethod === "transfer" ? "havale" : "card"}
      />
      <input type="hidden" name="couponCode" value={couponCode} />

      {/* Step 1: Müşteri Bilgileri */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/90 space-y-4 font-inter">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className="w-7 h-7 rounded-full bg-[#0F1E36] text-white flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-inter">Alıcı Bilgileri</h3>
            <p className="text-xs text-slate-500 font-inter">Fatura ve teslimat iletişimi için kullanılır.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Ad Soyad */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1 font-inter">
              Ad Soyad <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                name="customerName"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-inter">
              Telefon Numarası <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <input
                name="customerPhone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Örn: 0555 123 45 67"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white font-mono"
              />
            </div>
          </div>

          {/* E-posta */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-inter">
              E-posta Adresi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                name="customerEmail"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Örn: ahmet@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Teslimat Adresi */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/90 space-y-4 font-inter">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className="w-7 h-7 rounded-full bg-[#0F1E36] text-white flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-inter">Teslimat &amp; Fatura Adresi</h3>
            <p className="text-xs text-slate-500 font-inter">Ürününüzün ücretsiz teslim edileceği adresi giriniz.</p>
          </div>
        </div>

        {/* İl & İlçe Dropdown Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* İl (Şehir) Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-inter">
              İl (Şehir) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                name="city"
                required
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedDistrict("");
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white cursor-pointer"
              >
                <option value="">-- İl Seçiniz --</option>
                {TURKEY_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* İlçe Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-inter">
              İlçe <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                name="district"
                required
                disabled={!selectedCity}
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white cursor-pointer disabled:opacity-50"
              >
                <option value="">{selectedCity ? "-- İlçe Seçiniz --" : "-- Önce İl Seçiniz --"}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Açık Adres */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 font-inter">
            Açık Teslimat &amp; Montaj Adresi <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="shippingAddress"
            required
            rows={3}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Mahalle, Cadde/Sokak, Bina No, Daire No, Kat vb."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
          />
        </div>

        {/* Sipariş Notu */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 font-inter">
            Sipariş / Montaj Notu (Opsiyonel)
          </label>
          <input
            name="customerNotes"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Örn: 3. kat asansör mevcuttur, teslimattan önce arayınız"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
          />
        </div>
      </div>

      {/* Step 3: Ödeme Yöntemi Seçimi */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/90 space-y-4 font-inter">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
          <div className="w-7 h-7 rounded-full bg-[#0F1E36] text-white flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-inter">Ödeme Yöntemi</h3>
            <p className="text-xs text-slate-500 font-inter">Güvenli ödeme seçeneğinizi belirleyin.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card Option */}
          <div
            onClick={() => setPaymentMethod("card")}
            className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 relative overflow-hidden ${
              paymentMethod === "card"
                ? "border-brand bg-brand/5"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="paymentChoiceRadio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="mt-1 accent-[#0F1E36]"
            />
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 font-inter">Kredi / Banka Kartı</span>
                  <span className="bg-emerald-50 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    3D Secure
                  </span>
                </div>
                <Image

                  src="/images/paytr.svg"
                  alt="PayTR"
                  width={135}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-slate-500 font-inter leading-relaxed">
                PayTR güvencesiyle tüm kredi kartlarına tek çekim ve 12 aya varan taksit imkanı.
              </p>
            </div>
          </div>

          {/* Transfer Option */}
          <div
            onClick={() => setPaymentMethod("transfer")}
            className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 relative overflow-hidden ${
              paymentMethod === "transfer"
                ? "border-brand bg-brand/5"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="paymentChoiceRadio"
              checked={paymentMethod === "transfer"}
              onChange={() => setPaymentMethod("transfer")}
              className="mt-1 accent-[#0F1E36]"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 font-inter">Havale / EFT</span>
              </div>
              <p className="text-xs text-slate-500 font-inter leading-relaxed">
                Banka hesabımıza doğrudan havale / EFT ile sipariş verin.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic IBAN Box when Havale is selected */}
        {paymentMethod === "transfer" && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3 font-inter animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-950 font-inter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                  <path d="M3 21h18" />
                  <path d="M3 10h18" />
                  <path d="M5 6l7-3 7 3" />
                  <path d="M4 10v11" />
                  <path d="M20 10v11" />
                  <path d="M8 10v11" />
                  <path d="M12 10v11" />
                  <path d="M16 10v11" />
                </svg>
                <span>Banka Havale / EFT Bilgileri</span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                {BANK_NAME}
              </span>
            </div>

            <div className="space-y-2 text-xs font-inter text-slate-800">
              <div>
                <span className="text-slate-500 font-medium block text-[11px]">Alıcı / Firma Unvanı:</span>
                <span className="font-bold text-slate-900 font-inter">
                  {BANK_ACCOUNT_HOLDER}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block text-[11px]">IBAN Numarası:</span>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200 mt-1">
                  <code className="font-mono font-bold text-xs md:text-sm text-slate-900 tracking-wider">
                    {iban}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyIban}
                    className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? "✓ Kopyalandı" : "Kopyala"}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-amber-900/80 leading-relaxed font-inter">
              Siparişi onayladıktan sonra ödemenizi yukarıdaki IBAN adresine gönderiniz. Açıklama kısmına sipariş numaranızı eklemeniz yeterlidir.
            </p>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>256-Bit SSL Şifreleme</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Ücretsiz Kurulum &amp; Kargo</span>
          </div>
          <PaymentLogos className="justify-end" />
        </div>
        <p className="text-[11px] font-medium leading-relaxed text-slate-500">
          Bu internet sitesinde ödeme hizmetleri{" "}
          <a
            href="https://www.paytr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-700 hover:text-slate-950 underline-offset-2 hover:underline"
          >
            PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.
          </a>{" "}
          tarafından sağlanmaktadır.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand hover:bg-brand-dark text-white font-bold text-sm md:text-base py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Sipariş Oluşturuluyor...</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>
              {paymentMethod === "transfer"
                ? "Havale / EFT İle Siparişi Onayla →"
                : "Kredi Kartı İle Ödemeye Geç →"}
            </span>
          </>
        )}
      </button>
    </form>
  );
}
