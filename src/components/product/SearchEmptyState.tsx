import Link from "next/link";

interface SearchEmptyStateProps {
  query?: string;
}

const POPULAR_SEARCH_TERMS = [
  { label: "Hasta Yatağı", query: "hasta yatağı" },
  { label: "2 Motorlu Karyola", query: "2 motorlu" },
  { label: "3 Motorlu Asansörlü", query: "3 motorlu" },
  { label: "4 Motorlu Ahşap", query: "4 motorlu" },
  { label: "Havalı Yatak", query: "havalı yatak" },
  { label: "Muayene Masası", query: "muayene masası" },
  { label: "Bakım Koltuğu", query: "bakım koltuğu" },
  { label: "Dövme Kol Sehpası", query: "dövme kol sehpası" },
  { label: "Hasta Yatağı Fiyatları", query: "hasta yatağı fiyatları" },
];

const QUICK_CATEGORIES = [
  { name: "Hasta Yatakları & Karyolalar", slug: "hasta-yataklari", count: "18+ Model" },
  { name: "Muayene & Bakım Masaları", slug: "muayene-ve-bakim-masalari", count: "12+ Model" },
  { name: "Bakım & Tedavi Koltukları", slug: "bakim-koltuklari", count: "8+ Model" },
  { name: "Cihaz Sehpaları & Aksesuar", slug: "cihaz-sehpasi", count: "10+ Model" },
];

export default function SearchEmptyState({ query }: SearchEmptyStateProps) {
  const whatsappText = query
    ? `Merhaba, MCARIS mağazanızda "${query}" araması yaptım ancak aradığım modeli bulamadım. Bilgi alabilir miyim?`
    : "Merhaba, hasta karyolası ve medikal ekipmanlar hakkında bilgi almak istiyorum.";

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs text-center font-inter space-y-8 mt-4">
      {/* Search Icon & Message */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          {query ? `"${query}" ile Eşleşen Ürün Bulunamadı` : "Aramanızla Eşleşen Ürün Bulunamadı"}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          Aradığınız kelimede yazım hatası olabilir veya aradığınız model farklı bir isimle kayıtlı olabilir. Aşağıdaki popüler terimlere göz atabilir veya kategorilerimizi inceleyebilirsiniz.
        </p>

        {query && (
          <div className="pt-1">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 hover:underline"
            >
              <span>Filtreleri Temizle ve Tüm Ürünleri Gör</span>
              <span>&rarr;</span>
            </Link>
          </div>
        )}
      </div>

      {/* Suggested Search Terms */}
      <div className="border-t border-slate-100 pt-6 max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
          İlginizi Çekebilecek Popüler Arama Terimleri
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_SEARCH_TERMS.map((term, i) => (
            <Link
              key={i}
              href={`/urunler?q=${encodeURIComponent(term.query)}`}
              className="inline-flex items-center gap-1 text-xs font-medium bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-900 transition-all active:scale-98 shadow-2xs group"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-400 group-hover:text-white">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>{term.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Category Cards */}
      <div className="border-t border-slate-100 pt-6 max-w-3xl mx-auto space-y-3">
        <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
          Doğrudan Kategorilere Göz Atın
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {QUICK_CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              href={`/kategori/${cat.slug}`}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 transition-all hover:border-slate-300 group flex flex-col justify-between"
            >
              <span className="text-xs font-bold text-neutral-900 group-hover:text-primary transition-colors leading-tight">
                {cat.name}
              </span>
              <span className="text-[11px] text-neutral-500 font-medium mt-2">
                {cat.count} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* WhatsApp Help Banner */}
      <div className="border-t border-slate-100 pt-6 max-w-xl mx-auto">
        <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs sm:text-sm font-bold text-emerald-950">
              Aradığınız medikal ürünü bulamadınız mı?
            </p>
            <p className="text-xs text-emerald-700">
              Medikal uzmanlarımıza danışarak hasta durumuna en uygun karyolayı ve aksesuarları hemen öğrenebilirsiniz.
            </p>
          </div>
          <a
            href={`https://wa.me/905368200269?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs whitespace-nowrap active:scale-98 transition-all shrink-0"
          >
            <span>WhatsApp Danışma</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
