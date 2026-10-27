import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByAccessToken } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import Image from "next/image";
import { BANK_IBAN, BANK_NAME, BANK_ACCOUNT_HOLDER } from "@/lib/constants";
import PurchaseTracker from "@/components/analytics/PurchaseTracker";
import CartClearer from "@/components/cart/CartClearer";

export const metadata: Metadata = {
  title: "Sipariş Onayı — MCARIS Medikal",
  description: "Siparişiniz başarıyla alındı.",
  robots: {
    index: false,
    follow: false,
  },
};


export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ accessToken: string }>;
  searchParams?: Promise<{ metot?: string }>;
}) {
  const { accessToken } = await params;
  const sp = searchParams ? await searchParams : {};
  const order = await getOrderByAccessToken(accessToken);
  if (!order) notFound();

  const isHavale = sp?.metot === "havale";
  const iban = BANK_IBAN;

  const trackingItems = order.items.map((item) => ({
    id: item.productId,
    name: item.productName,
    price: parseFloat(item.unitPrice.toString()),
    quantity: item.quantity,
    category: "Medikal Ekipman",
  }));


  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-body">
      {/* Sepet Temizleyici */}
      <CartClearer />

      {/* Google Analytics 4 Purchase Tracker */}
      <PurchaseTracker
        orderId={order.id}
        total={parseFloat(order.total.toString())}
        shippingCost={order.shippingCost ? parseFloat(order.shippingCost.toString()) : 0}
        couponCode={order.couponCode}
        items={trackingItems}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">

        
        {/* Success Banner Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-inter">
              Siparişiniz Başarıyla Alındı!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              Teşekkür ederiz <strong className="text-slate-900">{order.customerName}</strong>. Sipariş detaylarınız aşağıda yer almaktadır.
            </p>
          </div>

          <div className="inline-block bg-slate-100 text-slate-700 font-mono text-xs font-bold px-4 py-2 rounded-xl border border-slate-200">
            Sipariş Numarası: <span className="text-slate-900 font-black">{order.id}</span>
          </div>
        </div>

        {/* Havale / IBAN Instruction Box */}
        {isHavale && (
          <div className="bg-amber-50/80 rounded-2xl p-5 md:p-6 border border-amber-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-amber-200/80 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950 font-inter">Havale / EFT Ödeme Bilgileri</h3>
                <p className="text-xs text-amber-800 font-inter">Lütfen ödemenizi aşağıdaki banka hesabına gönderiniz.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-amber-200/80 space-y-3 text-xs md:text-sm font-inter">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-500">Banka:</span>
                <span className="font-bold text-gray-900 font-inter">{BANK_NAME}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-500">Alıcı / Unvan:</span>
                <span className="font-bold text-gray-900 text-right font-inter">
                  {BANK_ACCOUNT_HOLDER}
                </span>
              </div>

              <div>
                <span className="text-gray-500 block mb-1">IBAN Numarası:</span>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono font-bold text-sm text-gray-900 tracking-wider flex items-center justify-between">
                  <span>{iban}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 block mb-1">Açıklama Kısmına Yazılacak Kod:</span>
                <div className="bg-amber-100/70 p-2.5 rounded-xl border border-amber-200 text-amber-950 font-mono font-bold text-xs">
                  {order.id}
                </div>
              </div>
            </div>

            <p className="text-xs text-amber-900 font-bold text-center leading-relaxed">
              Ödemeniz kontrol edildikten sonra siparişiniz onaylanacak ve kargo sürecine geçilecektir.
            </p>
          </div>
        )}

        {/* Purchased Items Card */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 space-y-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-inter border-b border-gray-100 pb-3">
            Sipariş İçeriği
          </h3>

          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  {item.product?.images?.[0] && (
                    <div className="relative w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                      <Image src={item.product.images[0]} alt={item.productName} fill className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 font-inter">{item.productName}</h4>
                    <span className="text-xs text-slate-500 font-inter">Adet: {item.quantity}</span>
                  </div>
                </div>
                <span className="text-xs md:text-sm font-bold text-slate-900 tabular-nums font-inter">
                  {formatPrice(item.unitPrice.toString())}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline font-inter">
            <span className="text-sm font-bold text-slate-600">Toplam Tutar:</span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {formatPrice(order.total.toString())}
            </span>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-sm py-3 px-6 rounded-xl transition-colors"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>

      </div>
    </div>
  );
}
