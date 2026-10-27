import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import type { Series } from "@/lib/types";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema, getItemListSchema } from "@/lib/seo";

interface Props {
  params: Promise<{ seri: string }>;
  searchParams: Promise<{
    q?: string;
    siralama?: string;
    motor?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { seri } = await params;
  const sp = await searchParams;
  const validSeries = ["platinum", "gold", "silver"];

  if (!validSeries.includes(seri)) {
    return {
      title: "Seri Bulunamadı",
      description: "Aradığınız hasta karyolası serisi bulunamadı.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seriesName = seri.charAt(0).toUpperCase() + seri.slice(1);
  let title = `${seriesName} Seri Hasta Yatakları Modelleri`;
  let description = `${seriesName} serisi elektrikli hasta karyolaları. 2 yıl yerinde servis garantisi, CE ve ISO sertifikalı medikal konfor ve Ankara içi aynı gün montaj.`;

  if (sp.motor) {
    title = `${seriesName} Seri ${sp.motor} Motorlu Hasta Karyolaları & Yatakları`;
    description = `${seriesName} serisi ${sp.motor} motorlu elektrikli hasta karyolaları. 2 yıl yerinde servis garantisi, CE ve ISO sertifikalı medikal konfor ve Ankara içi aynı gün montaj.`;
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
      canonical: `/seri/${seri}`,
    },
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}/seri/${seri}`,
      siteName: BRAND_NAME,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${title} — ${BRAND_NAME}`,
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

export default async function SeriesPage({ params, searchParams }: Props) {
  const { seri } = await params;
  const validSeries = ["platinum", "gold", "silver"];

  if (!validSeries.includes(seri)) {
    notFound();
  }

  const series = seri as Series;
  const sp = await searchParams;
  const query = sp.q?.trim() || undefined;
  const sortBy = sp.siralama || "kategori";
  const activeMotor = sp.motor || "";

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      series,
      query,
      pageSize: 200, // Load all series products directly
      sortBy,
      motorCount: activeMotor || undefined,
    }),
  ]);

  const seriesTitle = activeMotor
    ? `${seri.toUpperCase()} Seri ${activeMotor} Motorlu Hasta Yatakları`
    : `${seri.toUpperCase()} Seri Hasta Yatakları`;

  const currentParams = {
    q: sp.q,
    siralama: sp.siralama,
    motor: sp.motor,
  };

  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Tüm Ürünler", url: "/urunler" },
    { name: seriesTitle, url: `/seri/${seri}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  const itemListSchema = getItemListSchema(
    result.items.map((p) => ({
      name: p.name,
      slug: p.slug,
      images: p.images.length > 0 ? [p.images[0]] : undefined,
    })),
    seriesTitle,
    `/seri/${seri}`
  );

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 pt-4 pb-24 md:pt-12 md:pb-16 font-inter w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, itemListSchema]) }}
      />
      <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
        <ProductFilters
          categories={categories}
          dynamicFilters={result.availableFilters}
          activeSeries={series}
          activeMotor={activeMotor}
          currentParams={currentParams}
          basePath={`/seri/${seri}`}
        />
        <div className="space-y-6 w-full min-w-0">
          <div className="pb-3 border-b border-neutral-200/90">
            <div>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Hasta Karyolası Serisi
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight">
                {seriesTitle}
              </h1>
            </div>
          </div>

          <ProductGrid products={result.items} currentSort={sortBy} />
        </div>
      </div>
    </div>
  );
}
