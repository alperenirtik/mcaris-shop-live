import { getProducts, getFeaturedProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";

export default async function PopularProducts() {
  const featured = await getFeaturedProducts(8);
  const featuredIds = featured.map((p) => p.id);
  const newArrivals = await getProducts({ page: 1, pageSize: 4, sortBy: "yeni", excludeIds: featuredIds });
  const excludeIds = [...featuredIds, ...newArrivals.items.map((p) => p.id)];

  const result = await getProducts({ page: 1, pageSize: 4, sortBy: "pahali", excludeIds });
  const items = result.items.length > 0 ? result.items : (await getProducts({ page: 1, pageSize: 4, sortBy: "pahali" })).items;
  
  if (!items.length) return null;

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 border-b border-slate-200/80 pb-3 gap-2">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block mb-1">
            Çok Satanlar
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-inter">
            Hasta Karyolası Modelleri & Popüler Ürünler
          </h2>
        </div>
        <Link
          href="/urunler"
          title="Tüm Çok Satan Hasta Karyolası Modellerini Gör"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
        >
          <span>Tüm Popüler Modelleri Gör</span>
          <span>&rarr;</span>
        </Link>
      </div>
      <ProductGrid products={items} hideToggles />
    </section>
  );
}
