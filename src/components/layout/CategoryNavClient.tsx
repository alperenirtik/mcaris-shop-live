"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

interface CategoryNavClientProps {
  categories: CategoryItem[];
}

const SERIES_ITEMS = [
  {
    name: "Platinum Seri",
    href: "/seri/platinum",
    badge: "VIP / 4 Motor",
    badgeClass: "bg-slate-900 text-white font-semibold",
    desc: "Alman motorlu yoğun bakım & konforlu lüks ev tipi karyolalar",
    iconBg: "bg-slate-900 text-white shadow-2xs",
    iconType: "platinum",
  },
  {
    name: "Gold Seri",
    href: "/seri/gold",
    badge: "En Popüler",
    badgeClass: "bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold",
    desc: "3 ve 4 motorlu, asansörlü (yükseklik ayarlı) & Trendelenburg",
    iconBg: "bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs",
    iconType: "gold",
  },
  {
    name: "Silver Seri",
    href: "/seri/silver",
    badge: "Ekonomik",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200/80 font-semibold",
    desc: "2 motorlu baş ve ayak ucu hareketli sağlam ev tipi modeller",
    iconBg: "bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs",
    iconType: "silver",
  },
];

const EQUIPMENT_ITEMS = [
  {
    name: "Bakım Koltukları",
    href: "/kategori/bakim-koltuklari",
    badge: "Motorlu & Koltuk",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    desc: "Diyaliz, kemoterapi, kan alma ve elektrikli hasta bakım koltukları",
    iconBg: "bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs",
    iconType: "chair",
  },
  {
    name: "Muayene Masaları",
    href: "/kategori/muayene-ve-bakim-masalari",
    badge: "Klinik & Masaj",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    desc: "Hekim muayene, fizik tedavi, ahşap spa ve masaj masaları",
    iconBg: "bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs",
    iconType: "table",
  },
  {
    name: "Cihaz Sehpaları",
    href: "/kategori/cihaz-sehpasi",
    badge: "Tekerlekli & Raflı",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    desc: "Medikal cihaz taşıma sehpaları, etajer ve kilitli tekerlekli üniteler",
    iconBg: "bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs",
    iconType: "trolley",
  },
  {
    name: "Dövme Kol Sehpaları",
    href: "/kategori/dovme-kol-sehpalari",
    badge: "Ergonomik Ayarlı",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    desc: "Yükseklik ve açı ayarlı profesyonel kol dayama üniteleri",
    iconBg: "bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs",
    iconType: "armrest",
  },
  {
    name: "Tabure & Sandalyeler",
    href: "/kategori/tabure-ve-sandalyeler",
    badge: "Amortisörlü",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    desc: "Hekim, klinik personeli ve laboratuvar döner tabureleri",
    iconBg: "bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs",
    iconType: "stool",
  },
  {
    name: "Medikal Kozmetik",
    href: "/kategori/medikal-kozmetik",
    badge: "Klinik & Bakım",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    desc: "Klinik ve güzellik merkezi profesyonel sarf & bakım ürünleri",
    iconBg: "bg-slate-100 text-slate-800 border border-slate-200/80 shadow-2xs",
    iconType: "cosmetic",
  },
];

const PRODUCT_NAV_LINKS = [
  { label: "Hasta Yatağı Fiyatları", href: "/urunler" },
  { label: "Yemek Masaları & Aksesuar", href: "/kategori/hasta-yemek-masalari" },
];

export default function CategoryNavClient({
  categories,
}: CategoryNavClientProps) {
  const [isSeriesOpen, setIsSeriesOpen] = useState(false);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const equipmentRef = useRef<HTMLDivElement>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const equipmentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsEquipmentOpen(false);
    setIsSeriesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSeriesOpen(false);
    }, 150);
  };

  const handleEquipmentMouseEnter = () => {
    if (equipmentTimeoutRef.current) clearTimeout(equipmentTimeoutRef.current);
    setIsSeriesOpen(false);
    setIsEquipmentOpen(true);
  };

  const handleEquipmentMouseLeave = () => {
    equipmentTimeoutRef.current = setTimeout(() => {
      setIsEquipmentOpen(false);
    }, 150);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsSeriesOpen(false);
      }
      if (equipmentRef.current && !equipmentRef.current.contains(target)) {
        setIsEquipmentOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSeriesOpen(false);
        setIsEquipmentOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (equipmentTimeoutRef.current) clearTimeout(equipmentTimeoutRef.current);
    };
  }, []);

  return (
    <nav
      aria-label="Ana Menü"
      className="hidden md:block relative w-full bg-white/95 border-b border-neutral-200/80 z-30 font-inter backdrop-blur-md"
    >
      <div className="max-w-container-max mx-auto px-4 sm:px-6 w-full">
        {/* Desktop Navigation (md+) */}
        <div className="hidden md:flex items-center justify-between h-11 gap-2">
          {/* Primary Nav Links & Mega Dropdowns */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* 1. Tüm Ürünler */}
            <Link
              href="/urunler"
              prefetch={true}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80 transition-all whitespace-nowrap cursor-pointer active:scale-98"
            >
              Tüm Ürünler
            </Link>

            {/* 2. Hasta Karyolaları */}
            <Link
              href="/kategori/hasta-yataklari"
              prefetch={true}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80 transition-all whitespace-nowrap cursor-pointer active:scale-98"
            >
              Hasta Karyolaları
            </Link>

            {/* 3. Hasta Yatağı Serilerimiz (Mega Dropdown) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setIsEquipmentOpen(false);
                  setIsSeriesOpen((prev) => !prev);
                }}
                aria-expanded={isSeriesOpen}
                aria-haspopup="true"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer select-none ${
                  isSeriesOpen
                    ? "bg-neutral-100 text-neutral-950 shadow-2xs"
                    : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80"
                }`}
              >
                <span>Hasta Yatağı Serilerimiz</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border bg-neutral-100 text-neutral-700 border-neutral-300/80">
                  Özel
                </span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-200 ${
                    isSeriesOpen ? "rotate-180 text-neutral-950" : "text-neutral-400"
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Framer-Style Concentric Floating Dropdown Card */}
              {isSeriesOpen && (
                <div className="absolute left-0 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="w-[380px] sm:w-[420px] bg-white border border-neutral-200/90 rounded-3xl p-3 shadow-2xl shadow-neutral-900/10 ring-1 ring-black/5">
                    {/* Header */}
                    <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-neutral-900">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          className="shrink-0 text-neutral-700"
                        >
                          <path d="M2 4v16" />
                          <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                          <path d="M2 17h20" />
                          <path d="M6 8v9" />
                        </svg>
                        <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                          Hasta Karyolası Serileri
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-400">
                        3 Özel Seri
                      </span>
                    </div>

                    {/* Series List with Concentric Cards */}
                    <div className="space-y-1">
                      {SERIES_ITEMS.map((series) => (
                        <Link
                          key={series.name}
                          href={series.href}
                          prefetch={true}
                          onClick={() => setIsSeriesOpen(false)}
                          className="group flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80 cursor-pointer"
                        >
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${series.iconBg}`}
                          >
                            {series.iconType === "platinum" && (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M2 4v16" />
                                <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                <path d="M2 17h20" />
                                <path d="M6 8v9" />
                              </svg>
                            )}
                            {series.iconType === "gold" && (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M2 17h20" />
                                <path d="M3 11l4-4h7l4 4" />
                                <path d="M12 4v3" />
                                <path d="M3 17v3" />
                                <path d="M21 17v3" />
                              </svg>
                            )}
                            {series.iconType === "silver" && (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="10" width="18" height="8" rx="2" />
                                <path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                                <path d="M6 18v3" />
                                <path d="M18 18v3" />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors">
                                {series.name}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-md ${series.badgeClass}`}
                              >
                                {series.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 leading-snug mt-0.5 group-hover:text-neutral-700 line-clamp-2">
                              {series.desc}
                            </p>
                          </div>

                          <div className="text-neutral-300 group-hover:text-neutral-800 group-hover:translate-x-0.5 transition-all shrink-0">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom CTA bar */}
                    <div className="mt-2 pt-2 border-t border-neutral-100">
                      <Link
                        href="/kategori/hasta-yataklari"
                        prefetch={true}
                        onClick={() => setIsSeriesOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100/90 transition-colors text-xs font-bold text-neutral-800 group"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>Tüm Hasta Karyolalarını İncele</span>
                          <span className="text-[11px] font-normal text-neutral-500">
                            (Katalog Görünümü)
                          </span>
                        </span>
                        <span className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-transform font-bold text-sm">
                          &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Medikal & Klinik Ekipmanlar (Mega Dropdown) */}
            <div
              ref={equipmentRef}
              className="relative"
              onMouseEnter={handleEquipmentMouseEnter}
              onMouseLeave={handleEquipmentMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  setIsSeriesOpen(false);
                  setIsEquipmentOpen((prev) => !prev);
                }}
                aria-expanded={isEquipmentOpen}
                aria-haspopup="true"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer select-none ${
                  isEquipmentOpen
                    ? "bg-neutral-100 text-neutral-950 shadow-2xs"
                    : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80"
                }`}
              >
                <span>Medikal Ekipmanlar</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border bg-neutral-100 text-neutral-700 border-neutral-300/80">
                  Klinik
                </span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-200 ${
                    isEquipmentOpen ? "rotate-180 text-neutral-950" : "text-neutral-400"
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* 2-Column Floating Mega Dropdown Card */}
              {isEquipmentOpen && (
                <div className="absolute left-0 md:-left-24 lg:left-0 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="w-[600px] sm:w-[680px] lg:w-[720px] max-w-[calc(100vw-2rem)] bg-white border border-neutral-200/90 rounded-3xl p-3 shadow-2xl shadow-neutral-900/10 ring-1 ring-black/5">
                    {/* Header */}
                    <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-neutral-900">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="shrink-0 text-neutral-700"
                        >
                          <path d="M12 2v20M2 12h20" />
                        </svg>
                        <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                          Klinik &amp; Medikal Ekipmanlar
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-400">
                        6 Kategori
                      </span>
                    </div>

                    {/* Equipment 2-Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {EQUIPMENT_ITEMS.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setIsEquipmentOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 transition-all border border-transparent hover:border-neutral-200/80 cursor-pointer"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 mt-0.5 ${item.iconBg}`}
                          >
                            {item.iconType === "chair" && (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                                <path d="M6 18v3" />
                                <path d="M18 18v3" />
                              </svg>
                            )}
                            {item.iconType === "table" && (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 10h18v4H3z" />
                                <path d="M5 14v6" />
                                <path d="M19 14v6" />
                                <path d="M4 6h4v4H4z" />
                                <path d="M8 8h12" />
                              </svg>
                            )}
                            {item.iconType === "trolley" && (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="4" y="4" width="16" height="4" rx="1" />
                                <rect x="4" y="12" width="16" height="4" rx="1" />
                                <path d="M6 8v4" />
                                <path d="M18 8v4" />
                                <circle cx="7" cy="19" r="2" />
                                <circle cx="17" cy="19" r="2" />
                              </svg>
                            )}
                            {item.iconType === "armrest" && (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="4" y="4" width="16" height="6" rx="2" />
                                <path d="M12 10v9" />
                                <path d="M8 21l4-2 4 2" />
                              </svg>
                            )}
                            {item.iconType === "stool" && (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <ellipse cx="12" cy="6" rx="7" ry="3" />
                                <path d="M12 9v8" />
                                <path d="M7 21l5-4 5 4" />
                              </svg>
                            )}
                            {item.iconType === "cosmetic" && (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-black transition-colors whitespace-nowrap">
                                {item.name}
                              </span>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded-md shrink-0 ${item.badgeClass}`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 leading-tight mt-0.5 group-hover:text-neutral-700 line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom CTA bar */}
                    <div className="mt-2 pt-2 border-t border-neutral-100 px-3 flex items-center justify-between">
                      <Link
                        href="/urunler"
                        prefetch={true}
                        onClick={() => setIsEquipmentOpen(false)}
                        className="text-xs font-bold text-neutral-800 hover:text-black transition-colors flex items-center gap-1.5 group"
                      >
                        <span>Tüm Medikal &amp; Klinik Ekipmanlarını İncele</span>
                        <span className="text-[10px] text-neutral-400 font-normal">
                          (Tüm Ürünler)
                        </span>
                        <span className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-transform font-bold">
                          &rarr;
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Direct Links */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 min-w-0">
            {PRODUCT_NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch={true}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/80 transition-all whitespace-nowrap cursor-pointer active:scale-98"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
