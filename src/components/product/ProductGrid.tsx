"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ProductWithCategory } from "@/lib/types";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { value: "kategori", label: "Kategori Sırası" },
  { value: "ucuz", label: "Fiyat: Düşükten Yükseğe" },
  { value: "pahali", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "yeni", label: "En Yeniler" },
  { value: "az", label: "İsim: A-Z" },
];

function SortDropdown({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "kategori") {
      params.delete("siralama");
    } else {
      params.set("siralama", value);
    }
    params.delete("sayfa");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
        Sırala:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MobileSortDropdown({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "kategori") {
      params.delete("siralama");
    } else {
      params.set("siralama", value);
    }
    params.delete("sayfa");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex items-center justify-center min-w-0">
      <select
        id="mobile-sort-select"
        value={currentSort}
        aria-label="Ürün Sıralama"
        onChange={(e) => handleSortChange(e.target.value)}
        className="w-full max-w-[130px] sm:max-w-[160px] text-[11px] sm:text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/90 rounded-xl px-2 py-1.5 shadow-2xs hover:border-slate-300 focus:outline-none truncate cursor-pointer text-center"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MobileFilterButton() {
  const searchParams = useSearchParams();
  const hasMotor = Boolean(searchParams.get("motor"));
  const hasSeri = Boolean(searchParams.get("seri"));
  const activeCount = (hasMotor ? 1 : 0) + (hasSeri ? 1 : 0);

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-filter-drawer"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Filtreleri Aç"
      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 active:bg-black text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      <span>Filtrele</span>
      {activeCount > 0 && (
        <span className="w-4 h-4 rounded-md bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
          {activeCount}
        </span>
      )}
    </button>
  );
}

export default function ProductGrid({
  products,
  hideToggles = false,
  currentSort = "kategori",
}: {
  products: ProductWithCategory[];
  hideToggles?: boolean;
  currentSort?: string;
}) {
  const [mobileCols, setMobileCols] = useState<1 | 2>(2);
  const [desktopCols, setDesktopCols] = useState<2 | 3 | 4>(4);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 mb-4">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p className="text-lg font-bold text-slate-700 font-inter">Ürün bulunamadı.</p>
        <p className="text-sm text-slate-500 mt-1">Farklı filtreler deneyerek aramanızı genişletebilirsiniz.</p>
      </div>
    );
  }

  const mobileClass = mobileCols === 1 ? "grid-cols-1" : "grid-cols-2";
  
  const desktopClass = 
    desktopCols === 2 ? "md:grid-cols-2 lg:grid-cols-2" :
    desktopCols === 3 ? "md:grid-cols-2 lg:grid-cols-3" :
    "md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="flex flex-col gap-4 font-inter w-full min-w-0">
      {/* Sort & View Toggle Bar */}
      {!hideToggles && (
        <>
          {/* Mobile Consolidated Action Toolbar (1 line on mobile) */}
          <div className="md:hidden flex items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs w-full min-w-0">
            {/* Filter Trigger Button */}
            <Suspense fallback={<div className="h-8 w-20 bg-slate-100 rounded-xl animate-pulse" />}>
              <MobileFilterButton />
            </Suspense>

            {/* Mobile Sort Dropdown in Center */}
            <Suspense fallback={<div className="h-8 w-24 bg-slate-100 rounded-xl animate-pulse" />}>
              <MobileSortDropdown currentSort={currentSort} />
            </Suspense>

            {/* Mobile View Mode Toggles */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setMobileCols(1)}
                aria-label="Tekli Görünüm"
                className={`p-1.5 rounded-lg transition-colors ${mobileCols === 1 ? "bg-white text-slate-950 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              </button>
              <button
                onClick={() => setMobileCols(2)}
                aria-label="İkili Görünüm"
                className={`p-1.5 rounded-lg transition-colors ${mobileCols === 2 ? "bg-white text-slate-950 shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="8" height="16" rx="1.5" />
                  <rect x="13" y="4" width="8" height="16" rx="1.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Toolbar */}
          <div className="hidden md:flex items-center justify-between gap-3">
            {/* Sort Dropdown */}
            <Suspense fallback={<div className="h-9 w-32" />}>
              <SortDropdown currentSort={currentSort} />
            </Suspense>

            {/* Desktop Grid Toggles */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
              <button
                onClick={() => setDesktopCols(2)}
                aria-label="İkili Görünüm"
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 px-2 ${desktopCols === 2 ? "bg-slate-900 text-white shadow-xs" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="8" height="16" rx="1.5" />
                  <rect x="13" y="4" width="8" height="16" rx="1.5" />
                </svg>
              </button>
              <button
                onClick={() => setDesktopCols(3)}
                aria-label="Üçlü Görünüm"
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 px-2 ${desktopCols === 3 ? "bg-slate-900 text-white shadow-xs" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="4" width="5.5" height="16" rx="1" />
                  <rect x="9.25" y="4" width="5.5" height="16" rx="1" />
                  <rect x="16.5" y="4" width="5.5" height="16" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setDesktopCols(4)}
                aria-label="Dörtlü Görünüm"
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 px-2 ${desktopCols === 4 ? "bg-slate-900 text-white shadow-xs" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="4" width="3.5" height="16" rx="0.5" />
                  <rect x="7.5" y="4" width="3.5" height="16" rx="0.5" />
                  <rect x="13" y="4" width="3.5" height="16" rx="0.5" />
                  <rect x="18.5" y="4" width="3.5" height="16" rx="0.5" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Product Cards Grid */}
      <div className={`grid gap-3 sm:gap-4 md:gap-6 ${mobileClass} ${desktopClass} transition-all duration-300`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
