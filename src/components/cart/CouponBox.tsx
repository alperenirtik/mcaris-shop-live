"use client";

import { useState } from "react";
import { validateCouponAction } from "@/app/actions/couponActions";
import type { CouponValidationResult } from "@/lib/coupons";
import { formatPrice } from "@/lib/format";

interface CouponBoxProps {
  subtotal: number;
  onApplyCoupon: (result: CouponValidationResult | null) => void;
  appliedCoupon: CouponValidationResult | null;
}

export default function CouponBox({ subtotal, onApplyCoupon, appliedCoupon }: CouponBoxProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  async function handleApply() {
    setErrorMsg(null);
    if (!inputCode.trim()) {
      setErrorMsg("Lütfen kupon kodunu giriniz.");
      return;
    }

    setValidating(true);
    const result = await validateCouponAction(inputCode, subtotal);
    setValidating(false);

    if (result.valid) {
      onApplyCoupon(result);
      setInputCode("");
    } else {
      setErrorMsg(result.message);
    }
  }

  function handleRemove() {
    onApplyCoupon(null);
    setErrorMsg(null);
  }

  return (
    <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 space-y-3 font-inter overflow-hidden">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-inter">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
          <span>İndirim Kuponu</span>
        </label>
        <span className="text-[10px] text-slate-400 font-bold shrink-0">Kuponunuz var mı?</span>
      </div>

      {appliedCoupon && appliedCoupon.valid ? (
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0">
                {appliedCoupon.code}
              </span>
              <span className="shrink-0">Uygulandı</span>
            </div>
            <p className="text-[11px] font-medium text-emerald-700 truncate">{appliedCoupon.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-emerald-700 font-bold text-sm tabular-nums whitespace-nowrap">
              -{formatPrice(appliedCoupon.discountAmount)}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Uygulanan kuponu kaldır"
              className="text-slate-400 hover:text-rose-600 text-xs font-bold p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              title="Kuponu Kaldır"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApply())}
              placeholder="Kupon kodunu giriniz"
              className="flex-1 min-w-0 w-full px-3 py-2 text-xs font-bold uppercase rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
            <button
              type="button"
              disabled={validating || !inputCode.trim()}
              onClick={handleApply}
              className="shrink-0 px-3.5 py-2 bg-[#0F1E36] hover:bg-[#183158] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap active:scale-95"
            >
              {validating ? (
                <span className="inline-flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>...</span>
                </span>
              ) : (
                "Uygula"
              )}
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
              {errorMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
