import { getFeaturedProducts } from "@/lib/products";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 border-b border-slate-200/80 pb-3 gap-2">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Öne Çıkan Modeller
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Çok Tercih Edilen Hasta Yatağı Modelleri
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Konforlu evde bakım için en çok tercih edilen profesyonel hasta yatakları ve klinik karyola modelleri.
          </p>
        </div>

        <Link
          href="/kategori/hasta-yataklari"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
        >
          <span>Tüm Yatak Modellerini Gör</span>
          <span>&rarr;</span>
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
