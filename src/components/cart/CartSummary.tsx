"use client";

import { useState } from"react";
import { formatPrice } from"@/lib/format";
import Link from"next/link";
import CouponBox from"./CouponBox";
import { CouponValidationResult } from"@/lib/coupons";

interface CartSummaryProps {
  subtotal: string;
  shipping: number;
  itemsCount?: number;
}

export default function CartSummary({ subtotal, shipping, itemsCount }: CartSummaryProps) {
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);

  const handleCouponChange = (result: CouponValidationResult | null) => {
    setAppliedCoupon(result);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("mcaris_coupon_changed", {
          detail: result?.valid ? result.code : "",
        })
      );
    }
  };

  const rawSubtotal = parseFloat(subtotal);
  const discountAmount = appliedCoupon?.valid ? appliedCoupon.discountAmount : 0;
  const netSubtotal = Math.max(0, rawSubtotal - discountAmount);
  const total = (netSubtotal + shipping).toFixed(2);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 space-y-6 sticky top-28 font-body">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#0F1E36]">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-inter">Sipariş Özeti</h3>
        </div>
        {typeof itemsCount === "number" && itemsCount > 0 && (
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
            {itemsCount} Ürün
          </span>
        )}
      </div>

      {/* Price Lines */}
      <div className="space-y-3 text-xs md:text-sm font-inter">
        <div className="flex justify-between text-gray-600">
          <span>Ara Toplam</span>
          <span className="font-bold text-gray-900 tabular-nums">{formatPrice(subtotal)}</span>
        </div>

        {/* Coupon Discount Line if applied */}
        {appliedCoupon && appliedCoupon.valid && (
          <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200/60">
            <span>Kupon İndirimi ({appliedCoupon.code})</span>
            <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Kargo</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Garanti Kapsamı</span>
          <span className="font-bold text-gray-900">2 Yıl Dahil</span>
        </div>

        {/* Coupon Box Input */}
        <div className="pt-2">
          <CouponBox
            subtotal={rawSubtotal}
            onApplyCoupon={handleCouponChange}
            appliedCoupon={appliedCoupon}
          />
        </div>

        {/* Divider & Total */}
        <div className="pt-3 border-t border-gray-200/80 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-bold text-slate-900 font-inter">Genel Toplam</span>
            <span className="text-2xl font-black text-slate-900 font-inter tabular-nums">
              {formatPrice(total)}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold text-right">KDV Dahildir</p>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500   shrink-0" />
        <span>Türkiye'nin Her Yerine Ücretsiz Kargo !</span>
      </div>

      {/* Customer Support Callout Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-gray-600 font-inter">
        <div className="flex items-center gap-2 font-extrabold text-gray-900">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Destek ve Sorularınız İçin</span>
        </div>
        <p className="leading-relaxed">
          Müşteri temsilcilerimiz mesai saatlerinde hizmetinizdedir:
        </p>
        <a href="tel:03125110772" className="inline-block text-slate-900 font-bold hover:text-brand hover:underline font-mono text-sm">
          0312 511 07 72
        </a>
      </div>

      <div className="text-center pt-1 font-inter">
        <Link href="/sepet" className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors">
          &larr; Sepete Dön ve Ürünleri Düzenle
        </Link>
      </div>
    </div>
  );
}
