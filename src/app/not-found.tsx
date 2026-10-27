import Link from "next/link";
import { getCategories } from "@/lib/categories";
import { BUSINESS_PHONE } from "@/lib/constants";

export const metadata = {
  title: "Sayfa Bulunamadı (404) | MCARIS Medikal",
  description: "Aradığınız sayfa taşınmış, silinmiş veya geçici olarak kullanılamıyor olabilir.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 font-body">
      <div className="max-w-2xl w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-100 text-slate-900 font-black text-3xl font-mono border border-slate-200">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-inter tracking-tight">
            Aradığınız Sayfa Bulunamadı
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base font-inter max-w-md mx-auto leading-relaxed">
            Ulaşmaya çalıştığınız sayfa kaldırılmış, adresi değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="bg-[#0F1E36] hover:bg-[#183158] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>Ana Sayfaya Dön</span>
            <span>&rarr;</span>
          </Link>
          <Link
            href="/urunler"
            className="bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Tüm Ürünleri İncele
          </Link>
          <a
            href={`tel:${BUSINESS_PHONE}`}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <span>Bize Ulaşın</span>
          </a>
        </div>

        {/* Popular Categories Shortcut List */}
        {categories.length > 0 && (
          <div className="pt-6 border-t border-slate-100 text-left">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Popüler Medikal Kategoriler
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(0, 6).map((c) => (
                <Link
                  key={c.id}
                  href={`/kategori/${c.slug}`}
                  className="text-xs font-medium bg-slate-50 hover:bg-slate-900 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-200 transition-colors text-slate-700"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
