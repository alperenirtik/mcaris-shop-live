import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { getCategories, getCategoryBySlug } from "@/lib/categories";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import {
  SITE_URL,
  BRAND_NAME,
  getBreadcrumbSchema,
  getItemListSchema,
  getCategoryCollectionSchema,
  getFAQSchema,
  extractFaqsFromHtml,
  WHATSAPP_NUMBER,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    q?: string;
    siralama?: string;
    motor?: string;
    seri?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = await getCategoryBySlug(slug);

  if (!cat) {
    return {
      title: "Kategori Bulunamadı",
      description: "Aradığınız kategori bulunamadı.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  let title = cat.metaTitle || `${cat.name} Modelleri ve Fiyatları`;
  let description =
    cat.metaDescription ||
    `${cat.name} kategorisindeki en kaliteli, CE ve ISO 9001 sertifikalı medikal ürünler. 2 yıl resmi garanti ve Ankara içi aynı gün teslimat avantajıyla.`;

  if (sp.motor) {
    const cleanName = cat.name.replace(/^\d+\s*Motorlu\s*/i, "");
    title = `${sp.motor} Motorlu ${cleanName} Modelleri & Fiyatları`;
    description = `${sp.motor} motorlu ${cleanName.toLowerCase()} modelleri. CE sertifikalı üstün hasta konforu, 2 yıl yerinde servis garantisi ve Ankara içi aynı gün teslimat avantajıyla.`;
  }

  const isSearchQuery = Boolean(sp.q?.trim());
  const hasSortParam = Boolean(sp.siralama && sp.siralama !== "kategori");
  const shouldNoindex = isSearchQuery || hasSortParam;

  return {
    title,
    description,
    robots: shouldNoindex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
    alternates: {
      canonical: sp.motor
        ? sp.motor === "2"
          ? `/kategori/2-motorlu-hasta-yataklari`
          : sp.motor === "3"
          ? `/kategori/3-motorlu-hasta-yataklari`
          : sp.motor === "4"
          ? `/kategori/4-motorlu-hasta-yataklari`
          : `/kategori/${slug}`
        : `/kategori/${slug}`,
    },
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}/kategori/${slug}`,
      siteName: BRAND_NAME,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${cat.name} — ${BRAND_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND_NAME}`,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const query = sp.q?.trim() || undefined;
  const sortBy = sp.siralama || "kategori";
  const requestedMotor = sp.motor?.trim() || "";
  const requestedSeries = (sp.seri?.trim() as "platinum" | "gold" | "silver") || undefined;

  const isHastaYataklariFamily = [
    "hasta-yataklari",
    "2-motorlu-hasta-yataklari",
    "3-motorlu-hasta-yataklari",
    "asansorlu-3-motorlu-karyolalar",
    "4-motorlu-hasta-yataklari",
    "4-motorlu-yogun-bakim-karyolalari",
    "ahsap-ev-tipi-hasta-karyolalari",
    "tam-evde-bakim-setleri",
  ].includes(slug);

  // If a user accesses a hasta-yataklari family URL with a motor parameter (e.g. /kategori/3-motorlu-hasta-yataklari?motor=4),
  // redirect them to the dedicated canonical category URL for that motor count.
  if (isHastaYataklariFamily && requestedMotor) {
    const targetSlug =
      requestedMotor === "2"
        ? "2-motorlu-hasta-yataklari"
        : requestedMotor === "3"
        ? "3-motorlu-hasta-yataklari"
        : requestedMotor === "4"
        ? "4-motorlu-hasta-yataklari"
        : null;

    if (targetSlug && targetSlug !== slug) {
      const redirectParams = new URLSearchParams();
      if (sp.q) redirectParams.set("q", sp.q);
      if (sp.siralama) redirectParams.set("siralama", sp.siralama);
      if (sp.seri) redirectParams.set("seri", sp.seri);
      const qs = redirectParams.toString();
      redirect(qs ? `/kategori/${targetSlug}?${qs}` : `/kategori/${targetSlug}`);
    } else if (targetSlug === slug) {
      const redirectParams = new URLSearchParams();
      if (sp.q) redirectParams.set("q", sp.q);
      if (sp.siralama) redirectParams.set("siralama", sp.siralama);
      if (sp.seri) redirectParams.set("seri", sp.seri);
      const qs = redirectParams.toString();
      redirect(qs ? `/kategori/${slug}?${qs}` : `/kategori/${slug}`);
    }
  }

  const currentMotorCategoryCount =
    slug === "2-motorlu-hasta-yataklari"
      ? "2"
      : slug === "3-motorlu-hasta-yataklari" || slug === "asansorlu-3-motorlu-karyolalar"
      ? "3"
      : slug === "4-motorlu-hasta-yataklari" || slug === "4-motorlu-yogun-bakim-karyolalari"
      ? "4"
      : "";

  const activeMotor = requestedMotor || currentMotorCategoryCount;

  const [categories, activeCategory, result] = await Promise.all([
    getCategories(),
    getCategoryBySlug(slug),
    getProducts({
      categorySlug: slug,
      query,
      pageSize: 200, // Load all products without pagination fragmentation
      sortBy,
      motorCount: activeMotor || undefined,
      series: requestedSeries,
    }),
  ]);

  if (!activeCategory && result.items.length === 0) {
    notFound();
  }

  let categoryTitle = activeCategory?.h1Title || activeCategory?.name || `${slug.replace(/-/g, " ").toUpperCase()}`;
  if (activeMotor && !activeCategory?.name.toLowerCase().includes("motor")) {
    categoryTitle = `${activeMotor} Motorlu ${activeCategory?.name || "Hasta Karyolası"}`;
  }

  const currentParams = {
    q: sp.q,
    siralama: sp.siralama,
    motor: sp.motor,
    seri: sp.seri,
  };

  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    ...(activeCategory?.parent
      ? [{ name: activeCategory.parent.name, url: `/kategori/${activeCategory.parent.slug}` }]
      : [{ name: "Tüm Ürünler", url: "/urunler" }]),
    { name: activeCategory?.name || categoryTitle, url: `/kategori/${slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  const itemListSchema = getItemListSchema(
    result.items.map((p) => ({
      name: p.name,
      slug: p.slug,
      images: p.images.length > 0 ? [p.images[0]] : undefined,
    })),
    categoryTitle,
    `/kategori/${slug}`
  );

  const productPrices = result.items
    .map((p) => (typeof p.price === "number" ? p.price : parseFloat(String(p.price))))
    .filter((pr) => !isNaN(pr) && pr > 0);

  const lowPrice = productPrices.length > 0 ? Math.min(...productPrices) : undefined;
  const highPrice = productPrices.length > 0 ? Math.max(...productPrices) : undefined;

  const collectionSchema = getCategoryCollectionSchema({
    categoryName: activeCategory?.metaTitle || categoryTitle,
    description: activeCategory?.metaDescription || undefined,
    url: `/kategori/${slug}`,
    products: result.items.map((p) => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      images: p.images,
      stock: p.stock,
    })),
    lowPrice,
    highPrice,
  });

  // Motor filtresi için URL oluştur
  function getMotorHref(motorValue: string) {
    const params = new URLSearchParams();
    if (sp.siralama) params.set("siralama", sp.siralama);
    if (sp.q) params.set("q", sp.q);
    if (sp.seri) params.set("seri", sp.seri);

    if (isHastaYataklariFamily) {
      let targetSlug = "hasta-yataklari";
      if (motorValue === "2") targetSlug = "2-motorlu-hasta-yataklari";
      else if (motorValue === "3") targetSlug = "3-motorlu-hasta-yataklari";
      else if (motorValue === "4") targetSlug = "4-motorlu-hasta-yataklari";

      const qs = params.toString();
      return qs ? `/kategori/${targetSlug}?${qs}` : `/kategori/${targetSlug}`;
    }

    if (motorValue) params.set("motor", motorValue);
    const qs = params.toString();
    return qs ? `/kategori/${slug}?${qs}` : `/kategori/${slug}`;
  }

  const motorFilterGroup = result.availableFilters.find((g) => g.key === "motor");

  // Kategori içeriğindeki SSS bloklarından dinamik FAQPage şeması üret
  const categoryFaqs = activeCategory?.seoContent
    ? extractFaqsFromHtml(activeCategory.seoContent)
    : [];
  const categoryFaqSchema = categoryFaqs.length > 0 ? getFAQSchema(categoryFaqs) : null;

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 pt-4 pb-24 md:py-8 font-inter w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            categoryFaqSchema
              ? [breadcrumbSchema, itemListSchema, collectionSchema, categoryFaqSchema]
              : [breadcrumbSchema, itemListSchema, collectionSchema]
          ),
        }}
      />
      <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
        {/* Modernized Category Sidebar with Dynamic Specs Filters */}
        <ProductFilters
          categories={categories}
          dynamicFilters={result.availableFilters}
          activeCategory={slug}
          activeMotor={activeMotor}
          activeSeries={sp.seri}
          currentParams={currentParams}
          basePath={`/kategori/${slug}`}
        />

        <div className="space-y-6 w-full min-w-0">
          {/* Header Banner */}
          <div className="pb-4 border-b border-neutral-200/90">
            <div>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                MCARIS MEDİKAL KATALOG
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-950 tracking-tight">
                {categoryTitle}
              </h1>
            </div>
          </div>

          {/* Dinamik Nitelik Çipleri (Varsa Motor Seçenekleri) */}
          {motorFilterGroup && motorFilterGroup.options.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={getMotorHref("")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  !activeMotor || (slug === "hasta-yataklari" && !requestedMotor)
                    ? "bg-[#0B1528] text-white border-[#0B1528] shadow-xs"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Tümü
              </Link>
              {motorFilterGroup.options.map((filter) => {
                const isActive = activeMotor === filter.value;
                return (
                  <Link
                    key={filter.value}
                    href={getMotorHref(filter.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border inline-flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#0B1528] text-white border-[#0B1528] shadow-xs"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        isActive ? "bg-white/25 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {filter.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Product Grid - All Products Loaded */}
          <ProductGrid products={result.items} currentSort={sortBy} />

          {/* Dynamic SEO Content Section at Bottom of Category */}
          {activeCategory?.seoContent && (
            <section className="mt-12 bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                  REHBER &amp; TEKNİK BİLGİ
                </span>
                <span className="text-xs font-bold text-neutral-500">{activeCategory.name} Hakkında</span>
              </div>

              {activeCategory.seoContent.includes("<") ? (
                <div
                  className="text-xs sm:text-sm text-neutral-700 leading-relaxed prose max-w-none [&_h1]:text-xl sm:[&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-neutral-950 [&_h2]:text-lg sm:[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-neutral-950 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-sm sm:[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-neutral-900 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:my-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_li]:my-1 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-left [&_th]:border [&_th]:border-neutral-200 [&_th]:bg-neutral-100/90 [&_th]:p-3 [&_th]:font-bold [&_th]:text-neutral-950 [&_td]:border [&_td]:border-neutral-200 [&_td]:p-3 [&_details]:my-2.5 [&_details]:p-3.5 [&_details]:rounded-xl [&_details]:border [&_details]:border-neutral-200 [&_details]:bg-neutral-50/70 [&_summary]:font-bold [&_summary]:cursor-pointer [&_summary]:text-neutral-900 [&_details[open]_summary]:mb-2"
                  dangerouslySetInnerHTML={{ __html: activeCategory.seoContent }}
                />
              ) : (
                <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line prose max-w-none">
                  {activeCategory.seoContent}
                </div>
              )}

              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-neutral-500 font-medium">
                  Ankara içi aynı gün teslimat ve yerinde montaj desteği için uzmanlarımızla görüşün.
                </span>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Merhaba, ${activeCategory.name} kategorisi hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp Danışma</span>
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
