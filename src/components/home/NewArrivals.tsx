import { getProducts, getFeaturedProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";

export default async function NewArrivals() {
  const featured = await getFeaturedProducts(8);
  const featuredIds = featured.map((p) => p.id);
  const result = await getProducts({ page: 1, pageSize: 4, sortBy: "yeni", excludeIds: featuredIds });
  const items = result.items.length > 0 ? result.items : (await getProducts({ page: 1, pageSize: 4, sortBy: "yeni" })).items;
  if (!items.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 border-b border-slate-200/80 pb-3 gap-2">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Yeni Gelenler
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-inter">
            Motorlu Hasta Yatakları & Diğer Ürünler
          </h2>
          <p className="text-xs text-slate-500 font-inter mt-1">
            Evde hasta bakımı ve klinik kullanım için yeni eklenen motorlu hasta yatakları ve medikal ekipmanlar.
          </p>
        </div>

        <Link
          href="/urunler"
          title="Tüm Yeni Gelen Hasta Karyolası Modellerini Gör"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
        >
          <span>Tüm Yeni Modelleri Gör</span>
          <span>&rarr;</span>
        </Link>
      </div>
      <ProductGrid products={items} hideToggles />
    </section>
  );
}
