"use client";

import { useFavorites } from "@/context/FavoritesContext";
import type { ProductWithCategory } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function FavoritesClient() {
  const { favorites, clearFavorites, count } = useFavorites();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      if (favorites.length === 0) {
        if (isMounted) {
          setProducts([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/favoriler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: favorites }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProducts(data.items || []);
          }
        }
      } catch (err) {
        console.error("Favoriler yüklenirken hata:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [favorites]);

  function handleClearAll() {
    clearFavorites();
    toast.success("Tüm favorileriniz temizlendi.");
    setIsConfirmOpen(false);
  }

  // Filter products by current active favorite IDs
  const activeProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-8 md:py-12">
      <div className="max-w-container-max mx-auto px-6 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 font-inter">
          <Link href="/" className="hover:text-primary transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Favorilerim</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-inter">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">
                Favorilerim
              </h1>
              <span className="bg-rose-50 text-rose-600 font-bold text-xs px-3 py-1 rounded-full border border-rose-200">
                Favoride {count} Ürün
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-inter">
              Beğendiğiniz tüm ürünleri burada saklayabilir ve dilediğiniz zaman sepetinize ekleyebilirsiniz.
            </p>
          </div>

          {count > 0 && (
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              aria-label="Tüm favorileri temizle"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Tümünü Temizle</span>
            </button>
          )}
        </div>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleClearAll}
          title="Tüm Favorileri Temizle"
          description="Favori listenizdeki tüm ürünleri temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz."
          confirmText="Evet, Temizle"
          cancelText="Vazgeç"
          variant="danger"
        />

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200 rounded-2xl h-96 p-4 flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-slate-100 rounded-xl" />
                <div className="space-y-3 pt-4">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Favorites State */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-12 text-center max-w-2xl mx-auto space-y-5 my-8 font-inter">
            <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 font-inter">
                Henüz Favori Ürününüz Yok
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-inter max-w-md mx-auto leading-relaxed">
                Beğendiğiniz medikal ekipman ve hasta çözümlerinin üzerindeki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
              </p>
            </div>

            <div>
              <Link
                href="/urunler"
                className="inline-flex items-center justify-center gap-2 bg-[#00B4D8] hover:bg-[#0096C7] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                <span>Ürünleri Keşfet</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
