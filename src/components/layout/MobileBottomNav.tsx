"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { count: favoriteCount } = useFavorites();
  const { openCart, cartData } = useCartDrawer();

  // Hide bottom nav on admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/sofor")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 lg:hidden">
      <div className="grid grid-cols-5 h-16 items-center px-1 safe-area-inset-bottom">
        {/* 1. Ana Sayfa */}
        <Link
          href="/"
          prefetch={true}
          aria-label="Ana Sayfa"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all active:scale-90 duration-100 ${
            pathname === "/" ? "text-primary" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={pathname === "/" ? "2.5" : "2"}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Ana Sayfa</span>
        </Link>

        {/* 2. Kategoriler / Ürünler */}
        <Link
          href="/urunler"
          prefetch={true}
          aria-label="Tüm Ürünler ve Kategoriler"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all active:scale-90 duration-100 ${
            pathname.startsWith("/urunler") || pathname.startsWith("/kategori") || pathname.startsWith("/seri")
              ? "text-primary"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={pathname.startsWith("/urunler") || pathname.startsWith("/kategori") || pathname.startsWith("/seri") ? "2.5" : "2"}
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Ürünler</span>
        </Link>

        {/* 3. Sepetim (Drawer Trigger) */}
        <button
          type="button"
          onClick={openCart}
          aria-label="Alışveriş Sepetim"
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900 relative cursor-pointer active:scale-90 transition-transform duration-100"
        >
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartData.count > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-primary text-white font-black text-[9px] leading-none min-w-[18px] min-h-[18px] aspect-square rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartData.count}
              </span>
            )}
          </div>
          <span>Sepetim</span>
        </button>

        {/* 4. Favorilerim */}
        <Link
          href="/favoriler"
          prefetch={true}
          aria-label="Favori Ürünlerim"
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-bold relative transition-all active:scale-90 duration-100 ${
            pathname === "/favoriler" ? "text-rose-500" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <div className="relative">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={favoriteCount > 0 ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              className={favoriteCount > 0 ? "text-rose-500" : ""}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favoriteCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-black text-[9px] leading-none min-w-[18px] min-h-[18px] aspect-square rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {favoriteCount}
              </span>
            )}
          </div>

          <span>Favoriler</span>
        </Link>

        {/* 5. 7/24 Danışma / WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, ürünleriniz hakkında bilgi almak istiyorum.")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Danışma ve Destek"
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-[#25D366] hover:text-[#20ba59]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>Danışma</span>
        </a>
      </div>
    </div>
  );
}
