"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { DynamicFilterGroup } from "@/lib/products";
import { WHATSAPP_NUMBER } from "@/lib/seo";

const CATEGORY_ORDER = [
  "hasta-yataklari",
  "2-motorlu-hasta-yataklari",
  "3-motorlu-hasta-yataklari",
  "4-motorlu-hasta-yataklari",
  "hasta-yemek-masalari",
  "bakim-koltuklari",
  "muayene-ve-bakim-masalari",
  "cihaz-sehpasi",
  "dovme-kol-sehpalari",
  "tabure-ve-sandalyeler",
  "medikal-kozmetik",
];

export default function ProductFilters({
  categories,
  dynamicFilters = [],
  activeSeries,
  activeCategory,
  activeMotor,
  currentParams = {},
  basePath = "/urunler",
}: {
  categories: { id: string; name: string; slug: string; productCount?: number }[];
  dynamicFilters?: DynamicFilterGroup[];
  activeSeries?: string;
  activeCategory?: string;
  activeMotor?: string;
  currentParams?: Record<string, string | undefined>;
  basePath?: string;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHastaYataklariFamily = [
    "/kategori/hasta-yataklari",
    "/kategori/2-motorlu-hasta-yataklari",
    "/kategori/3-motorlu-hasta-yataklari",
    "/kategori/4-motorlu-hasta-yataklari",
  ].includes(basePath);

  const hasActiveFilters = Boolean(
    activeSeries ||
    (activeCategory && !basePath.startsWith("/kategori/")) ||
    (isHastaYataklariFamily && basePath !== "/kategori/hasta-yataklari") ||
    activeMotor
  );
  const clearHref = basePath.startsWith("/seri/")
    ? "/urunler"
    : isHastaYataklariFamily && basePath !== "/kategori/hasta-yataklari"
    ? "/kategori/hasta-yataklari"
    : activeCategory && !basePath.startsWith("/kategori/")
    ? "/urunler"
    : basePath;

  const sortedCategories = [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.slug);
    const bi = CATEGORY_ORDER.indexOf(b.slug);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // Listen for custom trigger event from mobile toolbar
  useEffect(() => {
    const handleOpen = () => setIsDrawerOpen(true);
    window.addEventListener("open-filter-drawer", handleOpen);
    return () => {
      window.removeEventListener("open-filter-drawer", handleOpen);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  function getFilterUrl(key: "motor" | "seri", value: string | undefined): string {
    const isCategoryPage = basePath.startsWith("/kategori/");

    // 1. Seri filtresi:
    if (key === "seri") {
      if (value) {
        if (isCategoryPage) {
          const params = new URLSearchParams();
          params.set("seri", value);
          if (activeMotor) params.set("motor", activeMotor);
          if (currentParams.siralama) params.set("siralama", currentParams.siralama);
          if (currentParams.q) params.set("q", currentParams.q);
          return `${basePath}?${params.toString()}`;
        }
        const params = new URLSearchParams();
        if (activeMotor) params.set("motor", activeMotor);
        if (currentParams.siralama) params.set("siralama", currentParams.siralama);
        if (currentParams.q) params.set("q", currentParams.q);
        const qs = params.toString();
        return qs ? `/seri/${value}?${qs}` : `/seri/${value}`;
      } else {
        if (isCategoryPage) {
          const params = new URLSearchParams();
          if (activeMotor) params.set("motor", activeMotor);
          if (currentParams.siralama) params.set("siralama", currentParams.siralama);
          if (currentParams.q) params.set("q", currentParams.q);
          const qs = params.toString();
          return qs ? `${basePath}?${qs}` : basePath;
        }
        const params = new URLSearchParams();
        if (activeMotor) params.set("motor", activeMotor);
        if (currentParams.siralama) params.set("siralama", currentParams.siralama);
        if (currentParams.q) params.set("q", currentParams.q);
        const qs = params.toString();
        return qs ? `/urunler?${qs}` : "/urunler";
      }
    }

    // 2. Motor filtresi:
    if (isHastaYataklariFamily) {
      let targetBasePath = "/kategori/hasta-yataklari";
      if (value === "2") targetBasePath = "/kategori/2-motorlu-hasta-yataklari";
      else if (value === "3") targetBasePath = "/kategori/3-motorlu-hasta-yataklari";
      else if (value === "4") targetBasePath = "/kategori/4-motorlu-hasta-yataklari";

      const params = new URLSearchParams();
      if (currentParams.siralama) params.set("siralama", currentParams.siralama);
      if (currentParams.q) params.set("q", currentParams.q);
      if (currentParams.seri || activeSeries) {
        params.set("seri", (currentParams.seri || activeSeries)!);
      }
      const qs = params.toString();
      return qs ? `${targetBasePath}?${qs}` : targetBasePath;
    }

    const params = new URLSearchParams();
    if (currentParams.siralama) params.set("siralama", currentParams.siralama);
    if (currentParams.q) params.set("q", currentParams.q);
    if (value) params.set("motor", value);

    if (isCategoryPage && (currentParams.seri || activeSeries)) {
      params.set("seri", (currentParams.seri || activeSeries)!);
    }

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="w-full min-w-0">
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR (hidden on mobile, visible on md and up)             */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-full bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs gap-4 font-inter sticky top-24">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-slate-700 shrink-0"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Filtreler
            </h2>
          </div>

          {hasActiveFilters && (
            <Link
              href={clearHref}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              Temizle
            </Link>
          )}
        </div>

        {/* 1. Kategoriler */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Kategoriler
          </span>
          <nav aria-label="Kategori Filtreleri">
            <ul className="flex flex-col space-y-1">
              {sortedCategories.map((category) => {
                const isActive = activeCategory === category.slug;
                const targetHref = isActive ? "/urunler" : `/kategori/${category.slug}`;
                return (
                  <li key={category.id}>
                    <Link
                      href={targetHref}
                      className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[13px] transition-colors ${
                        isActive
                          ? "bg-[#0B1528] text-white font-semibold shadow-xs"
                          : "text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 font-medium"
                      }`}
                    >
                      <span className="leading-snug pr-2">{category.name}</span>
                      <span
                        className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded-md shrink-0 transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "text-slate-400 group-hover:text-slate-700 bg-slate-50"
                        }`}
                      >
                        {category.productCount ?? 0}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* 2. Dinamik Nitelik Filtreleri (Motor Sayısı, Seri vb.) */}
        {dynamicFilters.map((group) => {
          const isMotorGroup = group.key === "motor";
          const isSeriesGroup = group.key === "seri";
          const currentActiveVal = isMotorGroup ? activeMotor : isSeriesGroup ? activeSeries : undefined;

          return (
            <div key={group.key} className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {group.title}
                </span>
                {currentActiveVal && (
                  <Link
                    href={getFilterUrl(isMotorGroup ? "motor" : "seri", undefined)}
                    className="text-[10px] font-medium text-slate-400 hover:text-slate-700"
                  >
                    Sıfırla
                  </Link>
                )}
              </div>

              <div className="flex flex-col space-y-1">
                {group.options.map((option) => {
                  const isSelected = currentActiveVal === option.value;
                  const nextUrl = getFilterUrl(
                    isMotorGroup ? "motor" : "seri",
                    isSelected ? undefined : option.value
                  );

                  return (
                    <Link
                      key={option.value}
                      href={nextUrl}
                      className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                        isSelected
                          ? "bg-[#0B1528] text-white font-bold shadow-xs"
                          : "text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 font-medium"
                      }`}
                    >
                      <span>{option.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "text-slate-400 bg-slate-100"
                        }`}
                      >
                        {option.count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Corporate WhatsApp Support Button */}
        <div className="pt-2 border-t border-slate-100">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20hasta%20karyolas%C4%B1%20ve%20medikal%20ekipmanlar%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>WhatsApp Danışma</span>
          </a>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE QUICK CATEGORY HORIZONTAL STRIP (visible on md:hidden)         */}
      {/* ========================================================================= */}
      <div className="md:hidden w-full min-w-0 overflow-hidden flex flex-col gap-2 font-inter">
        {/* Horizontal Category Scroll Bar */}
        <nav aria-label="Mobil Hızlı Kategori Seçimi" className="w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x scroll-smooth overscroll-x-contain w-full min-w-0">
            {/* "Tümü" option */}
            <Link
              href="/urunler"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                !activeCategory
                  ? "bg-[#0B1528] text-white border-[#0B1528] shadow-xs"
                  : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50"
              }`}
            >
              Tüm Ürünler
            </Link>

            {sortedCategories.map((category) => {
              const isActive = activeCategory === category.slug;
              const targetHref = isActive ? "/urunler" : `/kategori/${category.slug}`;
              return (
                <Link
                  key={category.id}
                  href={targetHref}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                    isActive
                      ? "bg-[#0B1528] text-white border-[#0B1528] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50"
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {category.productCount ?? 0}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Active Filters Summary Chips on Mobile (if any) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 touch-pan-x w-full min-w-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Aktif:
            </span>

            {activeCategory && (
              <Link
                href="/urunler"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-200 transition-colors shrink-0"
              >
                <span>{categories.find((c) => c.slug === activeCategory)?.name || activeCategory}</span>
                <span className="text-slate-400 font-bold ml-0.5">✕</span>
              </Link>
            )}

            {activeMotor && (
              <Link
                href={getFilterUrl("motor", undefined)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-semibold border border-teal-200 transition-colors shrink-0"
              >
                <span>{activeMotor} Motorlu</span>
                <span className="text-teal-500 font-bold ml-0.5">✕</span>
              </Link>
            )}

            {activeSeries && (
              <Link
                href={getFilterUrl("seri", undefined)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-semibold border border-amber-200 transition-colors shrink-0"
              >
                <span>{activeSeries.toUpperCase()} Seri</span>
                <span className="text-amber-500 font-bold ml-0.5">✕</span>
              </Link>
            )}

            <Link
              href={clearHref}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 px-2 py-1 shrink-0 ml-auto"
            >
              Temizle
            </Link>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM SHEET FILTER DRAWER (rendered in body via portal)        */}
      {/* ========================================================================= */}
      {(mounted || typeof window !== "undefined") && isDrawerOpen && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtreleme Seçenekleri"
          className="fixed inset-0 z-[1000] font-inter"
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 z-[1000]"
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal Container */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-[1001] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle */}
            <div className="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="text-slate-800"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Filtreler
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <Link
                    href={clearHref}
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    Tümünü Temizle
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Filtreleri Kapat"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Filter List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 overscroll-contain">
              {/* Categories */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kategori Seçin
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {sortedCategories.map((category) => {
                    const isActive = activeCategory === category.slug;
                    const targetHref = isActive ? "/urunler" : `/kategori/${category.slug}`;
                    return (
                      <Link
                        key={category.id}
                        href={targetHref}
                        onClick={() => setIsDrawerOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#0B1528] text-white shadow-xs"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                        }`}
                      >
                        <span>{category.name}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isActive ? "bg-white/20 text-white" : "bg-white text-slate-400"
                          }`}
                        >
                          {category.productCount ?? 0}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Filter Groups (Motor, Seri) */}
              {dynamicFilters.map((group) => {
                const isMotorGroup = group.key === "motor";
                const isSeriesGroup = group.key === "seri";
                const currentActiveVal = isMotorGroup ? activeMotor : isSeriesGroup ? activeSeries : undefined;

                return (
                  <div key={group.key} className="space-y-2.5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {group.title}
                      </span>
                      {currentActiveVal && (
                        <Link
                          href={getFilterUrl(isMotorGroup ? "motor" : "seri", undefined)}
                          onClick={() => setIsDrawerOpen(false)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                        >
                          Sıfırla
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {group.options.map((option) => {
                        const isSelected = currentActiveVal === option.value;
                        const nextUrl = getFilterUrl(
                          isMotorGroup ? "motor" : "seri",
                          isSelected ? undefined : option.value
                        );

                        return (
                          <Link
                            key={option.value}
                            href={nextUrl}
                            onClick={() => setIsDrawerOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-[#0B1528] text-white shadow-xs"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                            }`}
                          >
                            <span>{option.label}</span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                isSelected ? "bg-white/20 text-white" : "bg-white text-slate-400"
                              }`}
                            >
                              {option.count}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Mobile WhatsApp Link */}
              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20hasta%20karyolas%C4%B1%20ve%20medikal%20ekipmanlar%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp ile Bilgi Al</span>
                </a>
              </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-4 pb-6 bg-white border-t border-slate-100 shadow-md">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#0B1528] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all"
              >
                Sonuçları Göster
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
