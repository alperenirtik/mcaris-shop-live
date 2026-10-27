import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getProducts, detectSearchIntent } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import SearchIntentHero from "@/components/product/SearchIntentHero";
import SearchEmptyState from "@/components/product/SearchEmptyState";
import type { Series } from "@/lib/types";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema, getItemListSchema } from "@/lib/seo";

function getCanonicalRedirectForQuery(q: string): string | null {
  const normalized = q
    .trim()
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

  if (
    normalized.includes("yemek masa") ||
    normalized.includes("etajer") ||
    normalized.includes("komodin")
  ) {
    return "/kategori/hasta-yemek-masalari";
  }
  if (
    normalized === "kiralik" ||
    normalized.includes("kiralama") ||
    normalized.includes("kiralik hasta")
  ) {
    return "/kiralama-proseduru";
  }

  // Motor bazlı spesifik aramalar (4 Motorlu, 3 Motorlu, 2 Motorlu)
  if (
    normalized.includes("4 motor") ||
    normalized === "4 motorlu" ||
    normalized === "dort motorlu"
  ) {
    return "/kategori/4-motorlu-hasta-yataklari";
  }
  if (
    normalized.includes("3 motor") ||
    normalized === "3 motorlu" ||
    normalized === "uc motorlu" ||
    normalized.includes("asansorlu hasta")
  ) {
    return "/kategori/3-motorlu-hasta-yataklari";
  }
  if (
    normalized.includes("2 motor") ||
    normalized === "2 motorlu" ||
    normalized === "iki motorlu"
  ) {
    return "/kategori/2-motorlu-hasta-yataklari";
  }

  // Genel ve ticari hasta karyolası/yatağı sorguları (fiyatları, modelleri, ev tipi, kumandalı)
  if (
    normalized.includes("hasta yatagi") ||
    normalized.includes("hasta yataklari") ||
    normalized.includes("hasta karyolasi") ||
    normalized.includes("hasta karyolalari") ||
    normalized.includes("hastane yatagi") ||
    normalized.includes("hastane yataklari") ||
    normalized.includes("hastane karyolasi") ||
    normalized.includes("hastane karyolalari") ||
    normalized.includes("ev tipi hasta") ||
    normalized.includes("kumandali hasta") ||
    normalized.includes("2 el hasta") ||
    normalized.includes("ikinci el hasta")
  ) {
    return "/kategori/hasta-yataklari";
  }
  if (
    normalized.includes("bakim koltu") ||
    normalized.includes("diyaliz koltu")
  ) {
    return "/kategori/bakim-koltuklari";
  }
  if (normalized.includes("muayene masa") || normalized.includes("masaj masa")) {
    return "/kategori/muayene-ve-bakim-masalari";
  }
  if (normalized.includes("cihaz sehpa") || normalized.includes("cihaz sehpasi")) {
    return "/kategori/cihaz-sehpasi";
  }
  if (normalized.includes("dovme kol") || normalized.includes("tattoo kol")) {
    return "/kategori/dovme-kol-sehpalari";
  }
  if (normalized.includes("tabure") || normalized.includes("sandalye")) {
    return "/kategori/tabure-ve-sandalyeler";
  }
  if (normalized.includes("medikal kozmetik") || normalized.includes("kozmetik")) {
    return "/kategori/medikal-kozmetik";
  }
  if (normalized === "platinum" || normalized === "platinum seri") {
    return "/seri/platinum";
  }
  if (normalized === "gold" || normalized === "gold seri") {
    return "/seri/gold";
  }
  if (normalized === "silver" || normalized === "silver seri") {
    return "/seri/silver";
  }
  return null;
}

interface Props {
  searchParams: Promise<{
    seri?: string;
    kategori?: string;
    q?: string;
    siralama?: string;
    motor?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const categories = await getCategories();

  let title = "Tüm Medikal Ürünler & Hasta Yatakları";
  let description =
    "MCARIS Medikal ürün kataloğu: 2, 3, 4 motorlu elektrikli hasta karyolaları, transfer liftleri, muayene masaları ve medikal bakım ürünleri.";

  if (sp.kategori) {
    const cat = categories.find((c) => c.slug === sp.kategori);
    if (cat) {
      title = cat.metaTitle || `${cat.name} Fiyatları ve Modelleri`;
      description =
        cat.metaDescription ||
        `${cat.name} kategorisindeki en kaliteli ve sertifikalı medikal ürünler. 2 yıl garanti ve Ankara içi aynı gün teslimat avantajıyla.`;
    }
  } else if (sp.seri) {
    const seriesName = sp.seri.charAt(0).toUpperCase() + sp.seri.slice(1);
    title = `${seriesName} Seri Hasta Yatakları Modelleri`;
    description = `${seriesName} serisi premium elektrikli hasta karyolaları ve aksesuarları. CE sertifikalı, üst düzey hasta konforu.`;
  } else if (sp.motor) {
    title = `${sp.motor} Motorlu Hasta Karyolaları & Yatakları`;
    description = `${sp.motor} motorlu elektrikli hasta yatakları modelleri. CE sertifikalı, pozisyon ayarlı konfor, 2 yıl servis garantisi ve aynı gün teslimat.`;
  } else if (sp.q) {
    title = `"${sp.q}" Arama Sonuçları`;
    description = `"${sp.q}" için bulunan medikal ekipman ve hasta bakım ürünleri.`;
  }

  const isSearchQuery = Boolean(sp.q?.trim());
  const hasSortParam = Boolean(sp.siralama && sp.siralama !== "kategori");
  const shouldNoindex = isSearchQuery || hasSortParam;

  // Kanonik hedef belirleme (Seri seçiliyse temiz seri sayfasına, kategori seçiliyse kategoriye, aksi halde /urunler)
  const canonicalUrl = sp.seri && ["platinum", "gold", "silver"].includes(sp.seri)
    ? `/seri/${sp.seri}`
    : sp.kategori
    ? `/kategori/${sp.kategori}`
    : "/urunler";

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
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}${canonicalUrl}`,
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

export default async function ProductListingPage({ searchParams }: Props) {
  const sp = await searchParams;

  // 1. Kategori filtresi geldiyse doğrudan kanonik kategori sayfasına yönlendir (SEO 308)
  if (sp.kategori) {
    permanentRedirect(`/kategori/${sp.kategori}`);
  }

  // 2. Seri filtresi geldiyse doğrudan kanonik seri sayfasına yönlendir (SEO 308)
  if (sp.seri && ["platinum", "gold", "silver"].includes(sp.seri)) {
    permanentRedirect(`/seri/${sp.seri}`);
  }

  // 3. Arama sorgusu kanonik bir kategori veya rehber sayfasıyla eşleşiyorsa yönlendir (SEO 308)
  if (sp.q) {
    const canonicalTarget = getCanonicalRedirectForQuery(sp.q);
    if (canonicalTarget) {
      permanentRedirect(canonicalTarget);
    }
  }

  const series = ["platinum", "gold", "silver"].includes(sp.seri ?? "")
    ? (sp.seri as Series)
    : undefined;
  const query = sp.q?.trim() || undefined;
  const sortBy = sp.siralama || "kategori";
  const intent = query ? detectSearchIntent(query) : null;

  const currentParams = {
    seri: sp.seri,
    kategori: sp.kategori,
    q: sp.q,
    siralama: sp.siralama,
    motor: sp.motor,
  };

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({
      series,
      categorySlug: sp.kategori,
      query,
      pageSize: 200, // Load all products in single crawlable page
      sortBy,
      motorCount: sp.motor,
    }),
  ]);

  const activeCategoryName = categories.find((c) => c.slug === sp.kategori)?.name;

  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Tüm Ürünler", url: "/urunler" },
    ...(activeCategoryName && sp.kategori
      ? [{ name: activeCategoryName, url: `/kategori/${sp.kategori}` }]
      : []),
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  const itemListSchema = getItemListSchema(
    result.items.map((p) => ({
      name: p.name,
      slug: p.slug,
      images: p.images.length > 0 ? [p.images[0]] : undefined,
    })),
    activeCategoryName || (series ? `${series.toUpperCase()} Seri Hasta Yatakları` : "Tüm Medikal Ürünler"),
    "/urunler"
  );

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-6 pt-4 pb-24 md:py-10 font-inter w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, itemListSchema]) }}
      />
      <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6 md:gap-8 items-start">
        <ProductFilters
          categories={categories}
          dynamicFilters={result.availableFilters}
          activeSeries={sp.seri}
          activeCategory={sp.kategori}
          activeMotor={sp.motor}
          currentParams={currentParams}
          basePath="/urunler"
        />
        <div className="space-y-6 w-full min-w-0">
          {/* Search Intent Hero Banner */}
          {query && intent && (
            <SearchIntentHero intent={intent} totalCount={result.total} />
          )}

          <div className="pb-3 border-b border-neutral-200/90">
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight">
              {query
                ? `${intent?.title || `"${query}" Arama Sonuçları`}`
                : activeCategoryName ||
                  (series
                    ? `${series.toUpperCase()} Seri Hasta Yatakları`
                    : sp.motor
                    ? `${sp.motor} Motorlu Hasta Karyolaları & Yatakları`
                    : "Tüm Medikal Ürünler & Hasta Yatakları")}
            </h1>
          </div>

          {result.total === 0 ? (
            <SearchEmptyState query={query} />
          ) : (
            <ProductGrid products={result.items} currentSort={sortBy} />
          )}
        </div>
      </div>
    </div>
  );
}
