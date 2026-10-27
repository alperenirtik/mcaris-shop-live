import type { Series } from"@/lib/types";

const SERIES_CLASS: Record<Series, string> = {
  platinum: "bg-slate-800 text-white border-slate-700",
  gold: "bg-amber-100 text-amber-800 border-amber-200",
  silver: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function SeriesBadge({ series }: { series: Series }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold tracking-wider uppercase border ${SERIES_CLASS[series]}`}>
      {series.toUpperCase()}
    </span>
  );
}
