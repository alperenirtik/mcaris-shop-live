import Link from "next/link";
import Image from "next/image";
import type { ProductWithCategory } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import SeriesBadge from "./SeriesBadge";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { extractOrGenerateProductCode } from "@/lib/productCode";
import { isProbedCatalogSku } from "@/lib/probedCatalog";

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  const sku = extractOrGenerateProductCode(product);
  const seoAlt = `${product.name} - MCARIS Medikal ${product.series ? `${product.series} Seri ` : ""}${product.category?.name || "Hasta Karyolası"}`;

  return (
    <div
      itemScope
      itemType="https://schema.org/Product"
      className="group bg-white border border-neutral-200/90 rounded-xl overflow-hidden hover:border-neutral-400 hover:shadow-xs transition-all duration-200 relative flex flex-col justify-between h-full font-inter select-none"
    >
      {/* 1. Top Image — contain so wide bed photos are not cropped */}
      <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden border-b border-slate-100">
        <Link
          href={`/urun/${product.slug}`}
          prefetch={true}
          title={product.name}
          aria-label={`${product.name} - Görseli İncele`}
          className="relative block w-full h-full"
        >
          <Image
            src={product.images[0] ?? "/placeholder-product.png"}
            alt={seoAlt}
            itemProp="image"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain object-center !p-2.5 sm:!p-3.5 group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
          <span className="sr-only">{product.name} Görseli</span>
        </Link>

        {/* Top Badges (Series + SKU) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {product.series && <SeriesBadge series={product.series} />}
          {sku ? (
            <span className="bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-medium px-1.5 py-0.5 rounded tracking-wide shadow-xs border border-white/10">
              <span itemProp="sku">{sku}</span>
            </span>
          ) : null}
        </div>

        {/* Floating Favorite Button (Standalone Touch Layer) */}
        <FavoriteButton
          productId={product.id}
          size="sm"
          className="absolute top-2.5 right-2.5 z-20 shadow-xs"
        />
      </div>

      {/* 2. Product Content Details */}
      <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1 bg-white">
        <div className="space-y-1">
          <span
            itemProp="category"
            className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider block truncate"
          >
            {product.category?.name || "Hasta Karyolası"}
          </span>
          <Link
            href={`/urun/${product.slug}`}
            prefetch={true}
            title={product.name}
            className="block group/title"
          >
            <p
              itemProp="name"
              className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] group-hover/title:text-neutral-600 transition-colors leading-snug"
            >
              {product.name}
            </p>
          </Link>
        </div>

        {/* Price and Stock with Schema.org Offer Microdata */}
        <div
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
          className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-neutral-100 flex items-end justify-between gap-1"
        >
          <meta itemProp="priceCurrency" content="TRY" />
          <meta itemProp="price" content={String(product.price)} />
          <link
            itemProp="availability"
            href={
              product.stock > 0
                ? isProbedCatalogSku(sku)
                  ? "https://schema.org/PreOrder"
                  : "https://schema.org/InStock"
                : "https://schema.org/OutOfStock"
            }
          />

          <div className="min-w-0 flex-1">
            <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium block leading-none mb-0.5">Fiyat</span>
            <p className="text-xs sm:text-base font-bold text-neutral-950 tabular-nums tracking-tight truncate">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="shrink-0">
            {product.stock > 0 ? (
              isProbedCatalogSku(sku) ? null : (
                <span className="text-[10px] sm:text-[11px] font-medium text-neutral-600 bg-neutral-100 px-1.5 sm:px-2 py-0.5 rounded border border-neutral-200/60 inline-block">
                  Stokta
                </span>
              )
            ) : (
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded border border-amber-200 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>Stok Sor</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
