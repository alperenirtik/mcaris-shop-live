import type { Metadata } from"next";
import { redirect } from"next/navigation";
import { getCart } from"@/lib/cart";
import { getCartId } from"@/lib/cart-cookie";
import { calculateShipping, getShippingSettings } from"@/lib/shipping";
import { getCurrentUser } from"@/lib/auth";
import { prisma } from"@/lib/db";
import CartSummary from"@/components/cart/CartSummary";
import CheckoutForm from"@/components/checkout/CheckoutForm";
import Link from"next/link";

export const metadata: Metadata = {
  title: "Güvenli Ödeme & Teslimat — MCARIS Medikal Ekipman",
  description: "Siparişinizi 256-bit SSL güvenlik koruması altında tamamlayın.",
  alternates: {
    canonical: "/checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
};


export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ hata?: string }> }) {
  const sp = await searchParams;
  const cartId = await getCartId();
  const cart = cartId ? await getCart(cartId) : null;

  if (!cart || cart.items.length === 0) {
    redirect("/sepet");
  }

  const currentUser = await getCurrentUser();
  let userData = null;
  if (currentUser) {
    userData = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { name: true, email: true, phone: true, address: true },
    });
  }

  const shippingSettings = await getShippingSettings();
  const shipping = calculateShipping(parseFloat(cart.subtotal), shippingSettings.cost, shippingSettings.threshold);
  const errorMessages: Record<string, string> = {"stok-yetersiz":"Sepetinizdeki bazı ürünlerin stoğu yetersiz. Lütfen sepetinizi güncelleyin.","sepet-bos":"Sepetiniz boş.","eksik-bilgi":"Lütfen gerekli teslimat ve iletişim bilgilerini eksiksiz doldurunuz.","odeme-baslatilamadi":"Ödeme başlatılamadı. Lütfen tekrar deneyin.","odeme-basarisiz":"Ödeme işlemi gerçekleştirilemedi. Lütfen tekrar deneyin.","siparis-bulunamadi":"Sipariş kaydı bulunamadı.","sunucu-hatasi":"Sunucu tarafında bir hata oluştu. Lütfen tekrar deneyin.",
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-8 md:py-12">
      <div className="max-w-container-max mx-auto px-6 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 font-inter">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href="/sepet" className="hover:text-slate-900 transition-colors">
            Sepetim
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Güvenli Ödeme</span>
        </nav>

        {/* Checkout Header & Step Progress Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 font-inter">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">
                Güvenli Ödeme &amp; Teslimat
              </h1>
              <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>256-Bit SSL Koruma</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              Teslimat bilgilerinizi doldurarak siparişinizi kolayca tamamlayabilirsiniz.
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 text-xs font-bold font-inter shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
              <span>Sepet</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1.5 text-white bg-[#0F1E36] px-3.5 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <span>Teslimat &amp; Ödeme</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1.5 text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
              <span>Onay</span>
            </div>
          </div>
        </div>

        {/* Error Alert Message */}
        {sp.hata && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs md:text-sm font-bold flex items-center gap-3 font-inter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>{errorMessages[sp.hata] ?? "Ödeme adımında bir hata oluştu. Lütfen tekrar deneyiniz."}</span>
          </div>
        )}

        {/* Main Grid: Form Left (7-cols), Summary Right (5-cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <CheckoutForm initialUser={userData} />
          </div>

          <div className="lg:col-span-5">
            <CartSummary subtotal={cart.subtotal} shipping={shipping} itemsCount={cart.items.length} />
          </div>
        </div>

      </div>
    </div>
  );
}