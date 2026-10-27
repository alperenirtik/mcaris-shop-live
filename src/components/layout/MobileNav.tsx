"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { WHATSAPP_NUMBER, BUSINESS_PHONE } from "@/lib/constants";
import type { AuthPayload } from "@/lib/auth";

const SERIES_LINKS = [
  { label: "Platinum Seri", href: "/seri/platinum", badge: "VIP / 4 Motor", color: "bg-slate-900 text-white" },
  { label: "Gold Seri", href: "/seri/gold", badge: "En Popüler", color: "bg-amber-50 text-amber-800 border border-amber-200" },
  { label: "Silver Seri", href: "/seri/silver", badge: "Ekonomik", color: "bg-slate-100 text-slate-700 border border-slate-200" },
];

const CLINICAL_EQUIPMENT = [
  { label: "Bakım Koltukları", href: "/kategori/bakim-koltuklari", badge: "Motorlu & Koltuk" },
  { label: "Muayene Masaları", href: "/kategori/muayene-ve-bakim-masalari", badge: "Klinik & Masaj" },
  { label: "Cihaz Sehpaları", href: "/kategori/cihaz-sehpasi", badge: "Tekerlekli & Raflı" },
  { label: "Dövme Kol Sehpaları", href: "/kategori/dovme-kol-sehpalari", badge: "Ergonomik Ayarlı" },
  { label: "Tabure & Sandalyeler", href: "/kategori/tabure-ve-sandalyeler", badge: "Amortisörlü" },
  { label: "Medikal Kozmetik", href: "/kategori/medikal-kozmetik", badge: "Klinik & Bakım" },
];

const QUICK_SERVICES = [
  { label: "Hasta Yatağı Fiyatları", href: "/urunler", badge: "2026 Liste" },
  { label: "Yemek Masaları & Etajer", href: "/kategori/hasta-yemek-masalari", badge: "Aksesuar" },
  { label: "Ankara İlçe Hizmet Bölgeleri", href: "/ankara-hasta-yatagi", badge: "25 İlçe" },
];

const GUIDES_AND_SUPPORT = [
  { label: "Kiralama vs Satın Alma Rehberi", href: "/kiralama-proseduru", badge: "Rehber" },
  { label: "Sıkça Sorulan Sorular", href: "/sss", badge: "Bilgi Bankası" },
  { label: "Medikal Blog & Rehberler", href: "/blog", badge: "Güncel" },
];

type Category = { id: string; slug: string; name: string };

interface MobileNavProps {
  categories: Category[];
  user?: AuthPayload | null;
}

export default function MobileNav({ categories, user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile nav on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div>
      {/* Mobile Drawer Trigger (Hamburger Button) */}
      <button
        type="button"
        aria-label="Kategori ve Hizmet Menüsü"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 hover:text-black rounded-full border border-neutral-200/90 transition-all shadow-2xs cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-950 shrink-0 active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {(mounted || typeof window !== "undefined") && open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[1000]">
          {/* Backdrop Overlay (High Z-Index to cover full viewport) */}
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-[1000] animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Fullscreen Mobile Drawer: Clean Light Luxury Aesthetic */}
          <nav
            className="fixed inset-0 w-full h-full bg-white z-[1001] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 font-sans shadow-2xl safe-area-inset-bottom"
            aria-label="Mobil Navigasyon Menüsü"
          >
            <div>
              {/* Drawer Header (Light Framer Style) */}
              <div className="bg-white/95 backdrop-blur-md p-4 flex items-center justify-between border-b border-neutral-200/80 sticky top-0 z-10 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/MCARIS-LOGO-2.webp"
                    alt="MCARIS"
                    className="h-7 w-auto object-contain"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Menüyü Kapat"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 rounded-full transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Admin Panel Direct Control Hub (If Admin Logged In) */}
              {user?.role === "ADMIN" && (
                <div className="m-3 p-3 bg-neutral-950 text-white rounded-2xl border border-neutral-800 shadow-md space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span>Yönetici Paneli</span>
                    </span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-neutral-300 font-mono">
                      ADMIN
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="px-2.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>⚡</span>
                      <span>Özet Panel</span>
                    </Link>
                    <Link
                      href="/admin/siparisler"
                      onClick={() => setOpen(false)}
                      className="px-2.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>📦</span>
                      <span>Siparişler</span>
                    </Link>
                    <Link
                      href="/admin/urunler"
                      onClick={() => setOpen(false)}
                      className="px-2.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>🏷️</span>
                      <span>Ürünler</span>
                    </Link>
                    <Link
                      href="/admin/ayarlar"
                      onClick={() => setOpen(false)}
                      className="px-2.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>⚙️</span>
                      <span>Ayarlar</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Quick Communication Strip */}
              <div className="p-3 bg-neutral-50/70 border-b border-neutral-200/70 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${BUSINESS_PHONE}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-semibold text-xs hover:bg-neutral-50 transition-colors shadow-2xs"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-700">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>7/24 Çağrı</span>
                </a>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, hasta yatağı ve medikal ürünler hakkında bilgi almak istiyorum.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20ba59] rounded-xl text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp Hızlı Sipariş</span>
                </a>
              </div>

              {/* Primary Navigation Links */}
              <div className="p-3 pb-1.5 space-y-1 border-b border-neutral-100">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100/80 hover:text-neutral-950 rounded-xl transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-neutral-500">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Ana Sayfa</span>
                </Link>
                <Link
                  href="/urunler"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-900 bg-neutral-100/80 hover:bg-neutral-200/80 rounded-xl transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-neutral-600">
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                    <span>Tüm Ürünler</span>
                  </span>
                  <span className="text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded-md">
                    Katalog
                  </span>
                </Link>
              </div>

              {/* 1. Hasta Karyolası Serileri (Alman Motoru & Konfor) */}
              <div className="p-3 space-y-1.5 border-b border-neutral-100">
                <div className="px-3 py-1 text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
                  Hasta Karyolası Serileri
                </div>
                {SERIES_LINKS.map((series) => (
                  <Link
                    key={series.label}
                    href={series.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-100/80 hover:text-neutral-950 rounded-xl transition-colors"
                  >
                    <span>{series.label}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${series.color}`}>
                      {series.badge}
                    </span>
                  </Link>
                ))}
              </div>

              {/* 2. Klinik & Bakım Ekipmanları */}
              <div className="p-3 space-y-1 border-b border-neutral-100">
                <div className="px-3 py-1 text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
                  Klinik &amp; Tedavi Ekipmanları
                </div>
                {CLINICAL_EQUIPMENT.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-950 rounded-xl transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                      {item.badge}
                    </span>
                  </Link>
                ))}
              </div>

              {/* 3. Hızlı Erişim & Popüler Hizmetler */}
              <div className="p-3 space-y-1 border-b border-neutral-100">
                <div className="px-3 py-1 text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
                  Popüler Hizmetler &amp; Aksesuar
                </div>
                {QUICK_SERVICES.map((srv) => (
                  <Link
                    key={srv.label}
                    href={srv.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-950 rounded-xl transition-colors"
                  >
                    <span>{srv.label}</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                      {srv.badge}
                    </span>
                  </Link>
                ))}
              </div>

              {/* 4. Guides & Support */}
              <div className="p-3 space-y-1 border-b border-neutral-100">
                <div className="px-3 py-1 text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
                  Rehber &amp; Bilgi Merkezi
                </div>
                {GUIDES_AND_SUPPORT.map((guide) => (
                  <Link
                    key={guide.label}
                    href={guide.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100/70 hover:text-neutral-950 rounded-xl transition-colors"
                  >
                    <span>{guide.label}</span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                      {guide.badge}
                    </span>
                  </Link>
                ))}
              </div>

              {/* 5. All Categories */}
              {categories.length > 0 && (
                <div className="p-3 space-y-1 border-b border-neutral-100">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
                    Tüm Katalog Kategorileri
                  </div>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/kategori/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70 rounded-lg transition-colors"
                    >
                      <span className="text-neutral-400">•</span>
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Drawer */}
            <div className="p-4 border-t border-neutral-200/80 bg-neutral-50/50 space-y-2 mt-4">
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold text-neutral-700">
                <Link
                  href="/hakkimizda"
                  onClick={() => setOpen(false)}
                  className="py-1.5 hover:text-neutral-950 bg-white rounded-xl border border-neutral-200/80 shadow-2xs transition-colors"
                >
                  Hakkımızda
                </Link>
                <Link
                  href="/iletisim"
                  onClick={() => setOpen(false)}
                  className="py-1.5 hover:text-neutral-950 bg-white rounded-xl border border-neutral-200/80 shadow-2xs transition-colors"
                >
                  İletişim &amp; Konum
                </Link>
              </div>
              <div className="text-center">
                <Link
                  href="/degisiklik-kayitlari"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 underline transition-colors"
                >
                  Değişiklik Günlüğü
                </Link>
              </div>
              <div className="text-[10.5px] text-center text-neutral-400 pt-1 font-normal">
                &copy; {new Date().getFullYear()} MCARIS. Tüm hakları saklıdır.
              </div>
            </div>
          </nav>
        </div>,
        document.body
      )}
    </div>
  );
}
