"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

interface PaytrIframeClientProps {
  token: string;
  orderId?: string;
  orderTotal?: string;
  customerName?: string;
}

declare global {
  interface Window {
    iFrameResize?: (options: Record<string, unknown>, target: string) => void;
  }
}

export default function PaytrIframeClient({
  token,
  orderId,
  orderTotal,
  customerName,
}: PaytrIframeClientProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined" && window.iFrameResize) {
      try {
        window.iFrameResize({}, "#paytriframe");
      } catch (e) {
        console.warn("PayTR iframe resizer hatası:", e);
      }
    }
  }, [scriptLoaded]);

  const directPayUrl = `https://www.paytr.com/odeme/guvenli/${token}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-inter">
      <Script
        src="https://www.paytr.com/js/iframeResizer.min.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Üst Güvenlik ve Bilgilendirme Kartı */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                Güvenli Ödeme Ekranı
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-inter">
                3D Secure ile Güvenli Ödeme
              </h1>
            </div>

            {orderTotal && (
              <div className="text-left sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block">Toplam Ödenecek Tutar</span>
                <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                  {formatPrice(orderTotal)}
                </span>
              </div>
            )}
          </div>

          {/* Sipariş Detay Satırı */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Sipariş No:</span>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {orderId ? orderId.slice(0, 16) : "Yeni Sipariş"}
              </span>
            </div>

            {customerName && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Alıcı:</span>
                <span>{customerName}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 font-bold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>256-Bit SSL &amp; PayTR Sanal POS</span>
            </div>
          </div>
        </div>

        {/* PayTR Resmi iFrame Taşıyıcısı */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-2 sm:p-4">
          <iframe
            src={directPayUrl}
            id="paytriframe"
            title="PayTR Güvenli Ödeme Ekranı"
            frameBorder="0"
            scrolling="no"
            style={{ width: "100%", minHeight: "680px" }}
            className="w-full rounded-xl"
          />
        </div>

        {/* Alt Bilgi & Geri Dönüş Butonu */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium pt-2">
          <Link
            href="/checkout"
            className="text-slate-600 hover:text-slate-900 font-bold hover:underline transition-colors"
          >
            &larr; Siparişi Düzenle veya Başka Yöntem Seç
          </Link>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>BDDK Lisanslı Ödeme Hizmeti</span>
            <span>•</span>
            <span>Tüm Banka &amp; Kredi Kartları</span>
            <span>•</span>
            <a
              href={directPayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline font-bold"
            >
              Tam Ekranda Aç ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
