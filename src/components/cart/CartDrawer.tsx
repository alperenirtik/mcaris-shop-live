"use client";

import { useCartDrawer } from "@/context/CartDrawerContext";
import { formatPrice } from "@/lib/format";
import { trackRemoveFromCart, trackBeginCheckout } from "@/lib/analytics";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";


export default function CartDrawer() {
  const { isOpen, closeCart, cartData, updateQuantity, removeItem, isLoading } = useCartDrawer();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key ==="Escape") closeCart();
    };
    if (isOpen) {
      document.body.style.overflow ="hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow ="";
    }
    return () => {
      document.body.style.overflow ="";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body">
      {/* Backdrop Overlay */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        {/* Slide-over Drawer Panel with 100dvh */}
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col justify-between h-[100dvh] max-h-[100dvh] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-inter">Alışveriş Sepeti</h2>
              <span className="text-xs font-bold text-slate-400 font-inter">
                {cartData.count} {cartData.count === 1 ? "öğe" : "öğeler"}
              </span>
            </div>

            <button
              type="button"
              onClick={closeCart}
              aria-label="Kapat"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 font-inter">
            {cartData.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 font-inter">Sepetiniz Boş</h3>
                  <p className="text-xs text-slate-500 max-w-xs font-inter leading-relaxed">
                    Henüz sepetinize ürün eklemediniz. İhtiyacınız olan medikal ekipmanları inceleyebilirsiniz.
                  </p>
                </div>
                <Link
                  href="/urunler"
                  onClick={closeCart}
                  className="bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  Ürünleri Keşfet &rarr;
                </Link>
              </div>
            ) : (
              cartData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200 relative group hover:border-brand transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <Image
                      src={item.product.images[0] ?? "/placeholder-product.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Item Info & Quantity Controls */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="pr-6">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug font-inter">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-900 font-inter mt-0.5 tabular-nums">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Pill & Remove Button */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 font-bold text-xs disabled:opacity-50 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-950 font-bold text-xs disabled:opacity-50 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          trackRemoveFromCart({
                            id: item.product.id,
                            name: item.product.name,
                            category: item.product.category?.name,
                            price: parseFloat(item.product.price.toString()),
                            quantity: item.quantity,
                          });
                          removeItem(item.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Ürünü Sil"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cartData.items.length > 0 && (
            <div className="p-4 sm:p-6 pb-6 sm:pb-6 border-t border-slate-100 bg-slate-50 space-y-3.5 z-10 font-inter">
              {/* Pricing Totals */}
              <div className="space-y-1.5 text-xs md:text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Ara toplam:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatPrice(cartData.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2 font-inter">
                  <span>Toplam:</span>
                  <span className="text-slate-900 font-extrabold tabular-nums">{formatPrice(cartData.subtotal)}</span>
                </div>
                <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md text-center border border-emerald-200">
                  Tüm Ürünlerde Kargo Ücretsiz!
                </p>
              </div>

              {/* Action Buttons Stack */}
              <div className="space-y-2 pt-1">
                {/* Ödemeye Git Button */}
                <Link
                  href="/checkout"
                  onClick={() => {
                    trackBeginCheckout({
                      value: parseFloat(cartData.subtotal.toString()),
                      items: cartData.items.map((i) => ({
                        id: i.product.id,
                        name: i.product.name,
                        category: i.product.category?.name,
                        price: parseFloat(i.product.price.toString()),
                        quantity: i.quantity,
                      })),
                    });
                    closeCart();
                  }}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold text-xs md:text-sm py-3.5 px-4 rounded-xl transition-all active:scale-98 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Siparişi Tamamla &rarr;</span>
                </Link>

                {/* Sepeti Görüntüle Button */}
                <Link
                  href="/sepet"
                  onClick={closeCart}
                  className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs md:text-sm py-3 px-4 rounded-xl border border-slate-200 transition-all active:scale-98 flex items-center justify-center cursor-pointer"
                >
                  <span>Sepeti Görüntüle</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
