import Link from "next/link";
import type { SearchIntent } from "@/lib/products";

interface SearchIntentHeroProps {
  intent: SearchIntent;
  totalCount: number;
}

export default function SearchIntentHero({ intent, totalCount }: SearchIntentHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-5 sm:p-7 md:p-8 border border-slate-800 shadow-sm">
      <div className="relative z-10 space-y-4">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {intent.badge && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
              {intent.badge}
            </span>
          )}

          {intent.matchedCategoryName && (
            <span className="text-xs font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              Kategori: {intent.matchedCategoryName}
            </span>
          )}

          <span className="text-xs font-semibold text-slate-400 ml-auto">
            {totalCount} Ürün Bulundu
          </span>
        </div>

        {/* Title and Description */}
        <div className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {intent.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {intent.subtitle}
          </p>
        </div>

        {/* Quick Filter Tags / Shortcuts */}
        {intent.quickFilters && intent.quickFilters.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Hızlı Seçenekler &amp; Modeller:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {intent.quickFilters.map((filter, idx) => (
                <Link
                  key={idx}
                  href={filter.url}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-all active:scale-98 cursor-pointer shadow-2xs"
                >
                  <span>{filter.label}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}

              {intent.matchedCategorySlug && (
                <Link
                  href={`/kategori/${intent.matchedCategorySlug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline px-2 py-1 transition-colors"
                >
                  <span>Tüm Kategoriyi Gör</span>
                  <span>&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
