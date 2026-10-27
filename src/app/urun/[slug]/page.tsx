import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getProductBySlug, getFeaturedProducts } from "@/lib/products";
import { formatPrice, looksLikeHtml, stripHtmlToText } from "@/lib/format";
import SeriesBadge from "@/components/product/SeriesBadge";
import ProductGallery from "@/components/product/ProductGallery";
import SpecTable from "@/components/product/SpecTable";
import ProductGrid from "@/components/product/ProductGrid";
import AddToCartButton from "@/components/cart/AddToCartButton";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import ProductReviews from "@/components/product/ProductReviews";
import ProductViewTracker from "@/components/analytics/ProductViewTracker";
import ProductStickyMobileBar from "@/components/product/ProductStickyMobileBar";
import MarketplaceComparison from "@/components/product/MarketplaceComparison";
import { extractOrGenerateProductCode } from "@/lib/productCode";
import { isProbedCatalogSku } from "@/lib/probedCatalog";
import { getGeneralSettings } from "@/lib/settings";
import {
  SITE_URL,
  BRAND_NAME,
  getProductSchema,
  getMedicalDeviceSchema,
  getBreadcrumbSchema,
  WHATSAPP_NUMBER,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

function isRecordObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

function getSpecString(specs: unknown, key: string): string | undefined {
  if (isRecordObject(specs) && key in specs) {
    const val = specs[key];
    if (typeof val === "string" && val.trim().length > 0) {
      return val.trim();
    }
  }
  return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı | MCARIS Medikal",
      description: "Aradığınız medikal ürün bulunamadı.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const plainFromDesc = stripHtmlToText(product.description);
  const cleanDescription =
    product.shortDescription ||
    (plainFromDesc.length > 160
      ? plainFromDesc.slice(0, 157) + "..."
      : plainFromDesc);

  const customTitle =
    getSpecString(product.specs, "seoTitle") ||
    getSpecString(product.specs, "metaTitle");
  const customDescription =
    getSpecString(product.specs, "seoDescription") ||
    getSpecString(product.specs, "metaDescription");

  const title = customTitle || `${product.name} — Fiyatı ve Özellikleri`;
  const description = customDescription || cleanDescription;

  const ogImages =
    product.images.length > 0
      ? product.images.map((img) => ({
          url: img.startsWith("http") ? img : `${SITE_URL}${img}`,
          width: 1200,
          height: 630,
          alt: `${product.name} - ${product.category?.name || "Medikal Ekipman"}`,
        }))
      : [
          {
            url: `${SITE_URL}/og-image.png`,
            width: 1200,
            height: 630,
            alt: `${product.name} - ${product.category?.name || "Medikal Ekipman"}`,
          },
        ];

  const specKeywords = Object.entries(product.specs || {})
    .flatMap(([k, v]) => [k, typeof v === "string" ? v : ""])
    .filter(Boolean);

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category?.name || "medikal ürün",
      product.series ? `${product.series} hasta yatağı` : "hasta yatağı",
      "medikal ekipman",
      "hasta karyolası",
      "fiyatı",
      "satın al",
      "Ankara teslimat",
      ...specKeywords,
    ],
    alternates: {
      canonical: `/urun/${product.slug}`,
    },
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}/urun/${product.slug}`,
      siteName: BRAND_NAME,
      locale: "tr_TR",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND_NAME}`,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, generalSettings] = await Promise.all([
    getProductBySlug(slug),
    getGeneralSettings(),
  ]);
  if (!product) notFound();

  // Canonical SEO 301/308 Redirect: Eski SKU slug ile gelinmişse güncel SEO slug'a kalıcı yönlendir
  const rawSlugDecoded = decodeURIComponent(slug).trim().toLowerCase();
  if (product.slug && rawSlugDecoded !== product.slug.toLowerCase()) {
    permanentRedirect(`/urun/${encodeURIComponent(product.slug)}`);
  }

  const effectiveVat = product.vatRate ?? generalSettings.defaultVatRate;

  const related = (await getFeaturedProducts(4)).filter(
    (item) => item.id !== product.id
  );

  const plainFromDesc = stripHtmlToText(product.description);
  const displayShortDesc =
    product.shortDescription ||
    (plainFromDesc.length > 220
      ? plainFromDesc.slice(0, 220) + "..."
      : plainFromDesc);

  const productCode = product.sku || extractOrGenerateProductCode(product);

  // Schema.org Structured Data
  const productSchema = getProductSchema({
    name: product.name,
    slug: product.slug,
    description: displayShortDesc,
    images: product.images,
    price: product.price.toString(),
    sku: productCode || product.slug,
    categoryName: product.category?.name,
    series: product.series,
    stock: product.stock,
    specs: product.specs,
    reviews: product.reviews?.map((r) => ({
      author: r.userName,
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt.toISOString(),
    })),
  });

  const medicalDeviceSchema = getMedicalDeviceSchema({
    name: product.name,
    slug: product.slug,
    description: displayShortDesc,
    images: product.images,
    price: product.price.toString(),
    sku: productCode || product.slug,
    categoryName: product.category?.name,
    series: product.series,
    stock: product.stock,
    specs: product.specs,
  });

  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Tüm Ürünler", url: "/urunler" },
    ...(product.category
      ? [
          {
            name: product.category.name,
            url: `/kategori/${product.category.slug}`,
          },
        ]
      : []),
    { name: product.name, url: `/urun/${product.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  const whatsappInquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Merhaba, "${product.name}"${productCode ? ` (KOD: ${productCode})` : ""} hakkında detaylı bilgi ve teslimat süreci için görüşmek istiyorum.`
  )}`;

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-6 md:py-10 font-inter">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalDeviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-container-max mx-auto px-4 md:px-6 space-y-8">
        {/* Clean Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-neutral-500 overflow-x-auto pb-1"
        >
          <Link href="/" className="hover:text-neutral-950 transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link href="/urunler" className="hover:text-neutral-950 transition-colors">
            Tüm Ürünler
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/kategori/${product.category.slug}`}
                className="hover:text-neutral-950 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-950 font-bold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Product Details Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-7 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start shadow-2xs">
          {/* Left Column: Gallery (5 cols) */}
          <div className="lg:col-span-5">
            <ProductGallery
              images={product.images}
              alt={product.name}
              categoryName={product.category?.name}
            />
          </div>

          {/* Right Column: Buying Options & CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Header Badges & Title */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-[11px] font-bold rounded-md uppercase tracking-wider border border-neutral-200">
                    {product.category.name}
                  </span>
                )}
                {product.series && <SeriesBadge series={product.series} />}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <div className="shrink-0 pt-0.5">
                  <FavoriteButton
                    productId={product.id}
                    size="md"
                    showText={false}
                    className="shadow-2xs hover:border-neutral-300"
                  />
                </div>
              </div>

              {/* Star Rating & SKU Bar */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                {product.reviews && product.reviews.length > 0 ? (
                  <a
                    href="#yorumlar"
                    className="flex items-center gap-1.5 bg-amber-50/80 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200/60 transition-colors"
                  >
                    <span className="font-bold text-amber-700">
                      {(
                        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
                        product.reviews.length
                      ).toFixed(1)}
                    </span>
                    <span className="text-amber-500 text-[11px]">
                      {"★".repeat(
                        Math.round(
                          product.reviews.reduce((acc, r) => acc + r.rating, 0) /
                            product.reviews.length
                        )
                      )}
                      {"☆".repeat(
                        5 -
                          Math.round(
                            product.reviews.reduce((acc, r) => acc + r.rating, 0) /
                              product.reviews.length
                          )
                      )}
                    </span>
                    <span className="text-neutral-600 font-semibold">
                      ({product.reviews.length} Değerlendirme)
                    </span>
                  </a>
                ) : (
                  <a
                    href="#yorumlar"
                    className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200/80 px-2.5 py-1 rounded-md border border-neutral-200/90 transition-colors text-neutral-600"
                  >
                    <span className="text-neutral-400 text-[11px]">☆☆☆☆☆</span>
                    <span className="text-neutral-600 font-medium">Henüz Değerlendirilmedi</span>
                    <span className="text-neutral-400 text-[10px] underline ml-0.5">İlk Yorumu Bırakın</span>
                  </a>
                )}
                {productCode ? (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span className="bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200 font-mono text-neutral-700 font-bold text-xs">
                      KOD: {productCode}
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Corporate Price & Availability Box (Shopier / Apple Standard) */}
            <div className="bg-[#0B1528] p-5 sm:p-6 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-inter shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-medium text-neutral-400">
                    %{effectiveVat} KDV Dahil
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-normal">
                  Peşin Fiyatına Taksit &amp; Havale İndirimi
                </p>
              </div>

              <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10">
                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white shadow-2xs">
                  {product.stock > 0 ? (
                    isProbedCatalogSku(productCode) ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" rx="1" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    )
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block leading-tight">
                    {product.stock > 0
                      ? isProbedCatalogSku(productCode)
                        ? "Sipariş Verilebilir"
                        : "Stokta Var • Hızlı Sevk"
                      : "Stok Sor • Hızlı Danışma"}
                  </span>
                  <span className="text-[11px] text-neutral-300 block leading-tight mt-0.5">
                    {product.stock > 0
                      ? isProbedCatalogSku(productCode)
                        ? "Teslimat süresi sipariş sonrası netleşir"
                        : "Hızlı & Güvenli Teslimat"
                      : "WhatsApp Üzerinden Anında Bilgi"}
                  </span>
                </div>
              </div>
            </div>

            {/* Short Description */}
            {displayShortDesc && (
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/70">
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {displayShortDesc}
                </p>
              </div>
            )}

            {/* GA4 Product View Tracker */}
            <ProductViewTracker
              id={product.id}
              name={product.name}
              price={parseFloat(product.price.toString())}
              categoryName={product.category?.name}
            />

            {/* Actions: Add to Cart / Stok Sor + Direct WhatsApp */}
            <div className="space-y-3 pt-1">
              <AddToCartButton
                productId={product.id}
                stock={product.stock}
                productName={product.name}
                price={parseFloat(product.price.toString())}
                categoryName={product.category?.name}
                productCode={productCode}
              />

              {product.stock > 0 && (
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp ile Hızlı Danışma &amp; Bilgi Talebi</span>
                </a>
              )}
            </div>

            {/* 3 Professional Medical Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-2 border-t border-neutral-100 font-inter">
              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/80">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200/90 flex items-center justify-center shrink-0 text-neutral-900 shadow-2xs">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-neutral-900 truncate">
                    Hızlı Teslimat
                  </span>
                  <span className="block text-[10px] text-neutral-500 truncate mt-0.5">
                    Ankara içi adrese montaj
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/80">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200/90 flex items-center justify-center shrink-0 text-neutral-900 shadow-2xs">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-neutral-900 truncate">
                    2 Yıl Yerinde Servis
                  </span>
                  <span className="block text-[10px] text-neutral-500 truncate mt-0.5">
                    Teknisyen adrese gelir
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/80">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200/90 flex items-center justify-center shrink-0 text-neutral-900 shadow-2xs">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-neutral-900 truncate">
                    CE &amp; ISO 9001 Onaylı
                  </span>
                  <span className="block text-[10px] text-neutral-500 truncate mt-0.5">
                    Klinik kalite standardı
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description Section */}
        <section className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="border-b pb-3 border-neutral-100">
            <h2 className="text-base sm:text-lg font-bold text-neutral-950">
              Detaylı Ürün &amp; Klinik Açıklaması
            </h2>
          </div>
          {looksLikeHtml(product.description) ? (
            <div
              className="product-description prose prose-sm max-w-none text-neutral-700 leading-relaxed prose-p:my-2.5 prose-headings:text-neutral-950 prose-headings:font-bold prose-ul:my-2 prose-li:my-0.5"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          )}
        </section>

        {/* Technical Specifications Table Section */}
        <section className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b pb-3 border-neutral-100">
            <h2 className="text-base sm:text-lg font-bold text-neutral-950">
              Teknik Parametreler &amp; Donanım Özellikleri
            </h2>
            <span className="text-xs font-mono font-bold text-neutral-400">
              Sertifikalı Ölçüler
            </span>
          </div>
          <SpecTable specs={product.specs} />
        </section>

        {/* Marketplace vs MCARIS Direct Delivery & Assembly Comparison */}
        <MarketplaceComparison />


        {/* Customer Reviews & Star Ratings Section */}
        <section id="yorumlar">
          <ProductReviews
            productId={product.id}
            productSlug={product.slug}
            reviews={product.reviews || []}
          />
        </section>

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="space-y-5 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950">
                İlginizi Çekebilecek Diğer Medikal Modeller
              </h2>
              <Link
                href="/urunler"
                className="text-xs font-bold text-neutral-700 hover:text-neutral-950 transition-colors"
              >
                Tümünü Gör &rarr;
              </Link>
            </div>
            <ProductGrid products={related} />
          </section>
        )}

        {/* Mobile Sticky Buy & WhatsApp Bar */}
        <ProductStickyMobileBar
          productId={product.id}
          productName={product.name}
          price={parseFloat(product.price.toString())}
          stock={product.stock}
          image={product.images[0]}
          categoryName={product.category?.name}
        />
      </div>
    </div>
  );
}
