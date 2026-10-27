"use client";

import Link from"next/link";
import { usePathname } from"next/navigation";
import { useState } from"react";
import { logoutAction } from"@/app/actions/authActions";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Genel Bakış", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Finans & Raporlar", href: "/admin/raporlar", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { label: "Ürün Yönetimi", href: "/admin/urunler", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { label: "Medya Kütüphanesi", href: "/admin/medya", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Kategori Yönetimi", href: "/admin/kategoriler", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
    { label: "Sipariş Görünümü", href: "/admin/siparisler", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Canlı Sevkiyat Takibi", href: "/admin/canli-takip", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Kupon Yönetimi", href: "/admin/kuponlar", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
    { label: "Blog & Bilgi Bankası", href: "/admin/blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
    { label: "SSS & Destek", href: "/admin/sss", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Ürün Yorumları", href: "/admin/yorumlar", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { label: "Kullanıcı & Yetki Yönetimi", href: "/admin/kullanicilar", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { label: "Ödemeler", href: "/admin/odemeler", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { label: "Gelen Mesajlar", href: "/admin/mesajlar", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Site & Vitrin Ayarları", href: "/admin/ayarlar", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Veritabanı & Yedekler", href: "/admin/veritabani", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
  ];

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-white text-neutral-900 px-4 py-3 flex items-center justify-between border-b border-neutral-200 sticky top-0 z-40 font-inter">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Admin Menü"
            className="p-2 bg-neutral-100 rounded-lg text-neutral-800 cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <span className="font-bold text-base tracking-wider text-neutral-900">MCARIS Admin</span>
        </div>
        <Link href="/" className="text-xs font-semibold text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
          Vitrin &rarr;
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex font-inter">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[280px] bg-white text-neutral-900 flex flex-col h-full z-50 p-4 space-y-4 border-r border-neutral-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="font-bold text-base text-neutral-900">Yönetim Menüsü</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer">
                ✕
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-neutral-200 pt-3">
              <form action={logoutAction}>
                <button type="submit" className="w-full text-center py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-rose-200">
                  Güvenli Çıkış
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Permanent Sidebar - Clean White Theme */}
      <aside className="hidden md:flex w-64 bg-white text-neutral-900 flex-col shrink-0 min-h-screen border-r border-neutral-200 font-inter">
        {/* Clean Logo Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-bold tracking-tight text-neutral-950 hover:opacity-80 transition-opacity">
            MCARIS <span className="text-xs font-normal text-neutral-400">Admin</span>
          </Link>
          <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
            v2.7.9
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                }`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Clean Footer (Güvenli Çıkış) */}
        <div className="p-4 border-t border-neutral-200">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full text-center py-2 px-3 bg-neutral-100 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-neutral-200 hover:border-rose-200 flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Güvenli Çıkış</span>
            </button>
          </form>
        </div>
      </aside>

    </>
  );
}
