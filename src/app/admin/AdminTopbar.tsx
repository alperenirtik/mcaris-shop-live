"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminTopbarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function AdminTopbar({ user }: AdminTopbarProps) {
  const pathname = usePathname();

  function getPageTitle(path: string) {
    if (path === "/admin") return "Genel Bakış & Kontrol Merkezi";
    if (path.startsWith("/admin/urunler/yeni")) return "Yeni Medikal Ürün Ekle";
    if (path.startsWith("/admin/urunler")) return "Ürün Yönetimi";
    if (path.startsWith("/admin/medya")) return "Medya & Görsel Kütüphanesi";
    if (path.startsWith("/admin/ayarlar")) return "Site & Vitrin & SEO Ayarları";
    if (path.startsWith("/admin/kategoriler")) return "Kategori Hiyerarşisi";
    if (path.startsWith("/admin/siparisler")) return "Sipariş & Fatura Yönetimi";
    if (path.startsWith("/admin/canli-takip")) return "Canlı Sevkiyat & Filo Radarı";
    if (path.startsWith("/admin/kuponlar")) return "Kuponlar & Kargo Ayarları";
    if (path.startsWith("/admin/kullanicilar")) return "Kullanıcılar & Yetkilendirme";
    if (path.startsWith("/admin/odemeler")) return "Ödemeler & Finansal Rapor";
    if (path.startsWith("/admin/mesajlar")) return "Gelen Mesajlar & İletişim";
    if (path.startsWith("/admin/blog")) return "Medikal Blog & CMS";
    if (path.startsWith("/admin/sss")) return "SSS & Yardım Merkezi Yönetimi";
    if (path.startsWith("/admin/yorumlar")) return "Ürün Yorumları & Değerlendirmeler";
    return "Yönetim Paneli";
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3.5 bg-white border-b border-neutral-200 sticky top-0 z-30 font-inter">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <Link href="/admin" className="hover:text-neutral-900 transition-colors">
            MCARIS
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">{getPageTitle(pathname)}</span>
        </div>
      </div>

      {/* Right: Quick Action Shortcuts & User Badge */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-all shadow-xs cursor-pointer"
        >
          <span>+ Yeni Ürün</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-all border border-neutral-200"
        >
          <span>Mağazayı Gör &rarr;</span>
        </Link>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center">
            {initials}
          </div>
          <div className="hidden xl:block text-left">
            <span className="block text-xs font-semibold text-neutral-900 leading-tight">
              {user.name}
            </span>
            <span className="block text-[10px] text-neutral-400 leading-tight">
              Yönetici
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
