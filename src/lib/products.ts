import { Prisma, Series as PrismaSeries } from "@prisma/client";
import { prisma } from "./db";
import type { ProductWithCategory, Series } from "./types";
import { slugifyTurkish } from "./categories";
import { formatProductCode } from "./productCode";

export const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ProductInclude;

type ProductWithCategoryPayload = Prisma.ProductGetPayload<{ include: typeof PRODUCT_INCLUDE }>;

export function cleanProductTitle(name: string): string {
  if (!name) return "";
  const cleaned = name.replace(/^[Mm][Cc][Aa][Rr][İiIi][Ss]\s*[-–—:]*\s*/, "").trim();
  return cleaned || name;
}

export interface DynamicFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface DynamicFilterGroup {
  key: string;
  title: string;
  options: DynamicFilterOption[];
}

export function extractDynamicFilters(products: ProductWithCategory[]): DynamicFilterGroup[] {
  const groups: DynamicFilterGroup[] = [];

  // 1. Motor Sayısı Filtresi
  const motorCounts = new Map<string, number>();
  // 2. Seri Filtresi
  const seriesCounts = new Map<string, number>();

  for (const p of products) {
    // Motor Sayısı
    const specs = p.specs || {};
    const motor = specs["Motor Sayısı"] || specs["Motor Sayisi"] || specs["motor sayısı"] || specs["motor_sayisi"];
    if (motor && typeof motor === "string" && motor.trim()) {
      const match = motor.match(/\d+/);
      const cleanMotor = match ? match[0] : motor.trim();
      if (cleanMotor) {
        motorCounts.set(cleanMotor, (motorCounts.get(cleanMotor) || 0) + 1);
      }
    }

    // Seri
    if (p.series) {
      const s = p.series.toLowerCase();
      seriesCounts.set(s, (seriesCounts.get(s) || 0) + 1);
    }
  }

  // Motor grubu
  if (motorCounts.size > 0) {
    const motorOptions: DynamicFilterOption[] = Array.from(motorCounts.entries())
      .map(([val, count]) => ({
        value: val,
        label: `${val} Motorlu`,
        count,
      }))
      .sort((a, b) => Number(a.value) - Number(b.value));

    groups.push({
      key: "motor",
      title: "Motor Sayısı",
      options: motorOptions,
    });
  }

  // Seri grubu
  if (seriesCounts.size > 0) {
    const seriesOrder = ["platinum", "gold", "silver"];
    const seriesOptions: DynamicFilterOption[] = Array.from(seriesCounts.entries())
      .map(([val, count]) => ({
        value: val,
        label: `${val.charAt(0).toUpperCase() + val.slice(1)} Seri`,
        count,
      }))
      .sort((a, b) => seriesOrder.indexOf(a.value) - seriesOrder.indexOf(b.value));

    groups.push({
      key: "seri",
      title: "Ürün Serisi",
      options: seriesOptions,
    });
  }

  return groups;
}

export function serializeProduct(product: ProductWithCategoryPayload): ProductWithCategory {
  const specs = (product.specs as Record<string, string>) || {};
  return {
    ...product,
    name: cleanProductTitle(product.name),
    price: product.price.toString(),
    specs,
    sku: product.sku || specs["Ürün Kodu"] || specs["sku"] || null,
    vatRate: product.vatRate ?? null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function parseTurkishPrice(priceInput: string | number): string {
  if (typeof priceInput === "number") return priceInput.toString();
  if (!priceInput) return "0";
  let cleaned = priceInput.trim();
  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  } else if (cleaned.includes(".")) {
    const parts = cleaned.split(".");
    if (parts.length === 2 && parts[1].length === 3) {
      cleaned = cleaned.replace(".", "");
    }
  }
  cleaned = cleaned.replace(/[^0-9.]/g, "");
  return cleaned || "0";
}

const CATEGORY_ORDER = [
  "hasta-yataklari",
  "2-motorlu-hasta-yataklari",
  "3-motorlu-hasta-yataklari",
  "4-motorlu-hasta-yataklari",
  "hasta-yemek-masalari",
  "bakim-koltuklari",
  "muayene-ve-bakim-masalari",
  "bakim-yataklari",
  "cihaz-sehpasi",
  "dovme-kol-sehpalari",
  "tabure-ve-sandalyeler",
  "medikal-kozmetik",
];

/** Anasayfa “Çok Tercih Edilen Hasta Yatağı” — yalnızca yatak/karyola kategorileri */
const FEATURED_BED_CATEGORY_SLUGS = [
  "hasta-yataklari",
  "2-motorlu-hasta-yataklari",
  "3-motorlu-hasta-yataklari",
  "4-motorlu-hasta-yataklari",
  "platinum-hasta-yataklari",
  "gold-hasta-yataklari",
  "silver-hasta-yataklari",
  "asansorlu-3-motorlu-karyolalar",
  "4-motorlu-yogun-bakim-karyolalari",
  "ahsap-ev-tipi-hasta-karyolalari",
  "bakim-yataklari",
];

export async function getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
  try {
    // Sadece yatak/karyola — "Lift" gibi genel eşleşmeler kozmetik/lift ürünlerini de çekiyordu
    const featuredBeds = await prisma.product.findMany({
      where: {
        isDraft: false,
        category: { slug: { in: FEATURED_BED_CATEGORY_SLUGS } },
        OR: [
          { name: { contains: "Karyola", mode: "insensitive" } },
          { name: { contains: "Yatak", mode: "insensitive" } },
          { name: { contains: "Yatağı", mode: "insensitive" } },
          { name: { contains: "Yatagi", mode: "insensitive" } },
        ],
      },
      include: PRODUCT_INCLUDE,
      take: limit,
      orderBy: [
        { series: "desc" },
        { createdAt: "desc" },
      ],
    });

    return featuredBeds.map(serializeProduct);
  } catch (error) {
    console.warn("[getFeaturedProducts] Fallback during build/offline:", error);
    return [];
  }
}

const MEDICAL_SEARCH_SYNONYM_MAP: Record<string, string[]> = {
  hastane: ["hasta", "karyola", "yatak", "medikal", "tedavi"],
  karyola: ["yatak", "karyola", "hasta yatağı"],
  yatak: ["karyola", "yatak", "hasta karyolası"],
  havali: ["antidekubit", "antidekübit", "havalı", "yara"],
  havalı: ["antidekubit", "antidekübit", "havali", "yara"],
  antidekubit: ["havali", "havalı", "yara"],
  antidekübit: ["havali", "havalı", "yara"],
  sedye: ["muayene", "sedye", "masa"],
  masaj: ["muayene", "masaj", "bakım", "bakim"],
  diyaliz: ["koltuk", "diyaliz", "kemoterapi", "bakım"],
  kemoterapi: ["koltuk", "diyaliz", "kemoterapi", "bakım"],
  tattoo: ["dövme", "dovme", "tattoo"],
  dovme: ["dövme", "tattoo"],
  dövme: ["dovme", "tattoo"],
  veteriner: ["pet", "veteriner", "hayvan", "muayene"],
  komodin: ["etajer", "komodin", "yemek", "masa"],
  etajer: ["komodin", "etajer", "masa"],
  lift: ["transfer", "lift", "hasta taşıma", "taşıma"],
  kiralik: ["hasta", "karyola", "yatak", "kiralama"],
  kiralık: ["hasta", "karyola", "yatak", "kiralama"],
  kiralama: ["hasta", "karyola", "yatak", "kiralama"],
};

export function isBrandSearchQuery(query: string): boolean {
  const clean = query.trim().toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, "");
  return [
    "mcaris",
    "mcarismedikal",
    "shopmcaris",
    "mcarisshop",
    "mcaristr",
    "mcaristurkiye",
    "mcarisürünleri",
    "mcarisurunleri",
    "mcariskatalog",
  ].includes(clean);
}

export interface SearchIntent {
  query: string;
  isBrand: boolean;
  matchedCategorySlug?: string;
  matchedCategoryName?: string;
  title: string;
  subtitle: string;
  badge?: string;
  quickFilters: Array<{ label: string; url: string }>;
  suggestedTerms: string[];
}

export function detectSearchIntent(query: string): SearchIntent {
  const clean = query.trim().toLowerCase();
  const normalized = clean
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

  // 1. Marka Araması ("mcaris", "mcaris medikal" vb.)
  if (isBrandSearchQuery(query)) {
    return {
      query,
      isBrand: true,
      title: "MCARIS Medikal Resmi Ürün Kataloğu",
      subtitle:
        "MCARIS Medikal güvencesiyle doğrudan yerli üreticiden motorlu hasta yatakları, klinik muayene masaları, bakım koltukları ve profesyonel medikal ekipmanlar.",
      badge: "Resmi Üretici & Satış Mağazası",
      quickFilters: [
        { label: "Hasta Yatakları", url: "/kategori/hasta-yataklari" },
        { label: "Bakım Koltukları", url: "/kategori/bakim-koltuklari" },
        { label: "Muayene Masaları", url: "/kategori/muayene-ve-bakim-masalari" },
        { label: "Platinum Seri", url: "/seri/platinum" },
        { label: "Gold Seri", url: "/seri/gold" },
      ],
      suggestedTerms: ["2 Motorlu Hasta Yatağı", "3 Motorlu Asansörlü Karyola", "Bakım Koltuğu", "Muayene Masası"],
    };
  }

  // 2a. Hasta Yatağı Kiralama ve İkinci El Sorguları
  if (
    normalized.includes("kiral") ||
    normalized.includes("ikinci el") ||
    normalized.includes("2. el") ||
    normalized.includes("2.el")
  ) {
    return {
      query,
      isBrand: false,
      matchedCategorySlug: "hasta-yataklari",
      title: "Hasta Yatağı Kiralama ve Satın Alma Çözümleri",
      subtitle:
        "Kısa dönemli ameliyat ve nekahat süreçleri için dezenfekte edilmiş kiralama, uzun vadeli bakım için 2 yıl yerinde garantili sıfır karyola satışı sunuyoruz. Ankara içi hazır stoklu ürünlerde aynı gün adrese montaj dahildir.",
      badge: "Kiralama & Satın Alma Seçenekleri",
      quickFilters: [
        { label: "Kiralama Prosedürü ve Fiyatları", url: "/kiralama-proseduru" },
        { label: "2 Motorlu Hasta Yatakları", url: "/urunler?q=2+motorlu" },
        { label: "3 Motorlu Asansörlü Karyolalar", url: "/urunler?q=3+motorlu" },
        { label: "Tüm Hasta Yatakları", url: "/kategori/hasta-yataklari" },
      ],
      suggestedTerms: ["2 Motorlu Hasta Yatağı", "3 Motorlu Asansörlü", "Hasta Yatağı Fiyatları", "Havalı Yatak"],
    };
  }

  // 2b. Havalı Yataklar & Antidekübit Yara Önleme
  if (
    normalized.includes("haval") ||
    normalized.includes("antidekubit") ||
    normalized.includes("yara") ||
    normalized.includes("dekubitus")
  ) {
    return {
      query,
      isBrand: false,
      matchedCategorySlug: "hasta-yataklari",
      matchedCategoryName: "Havalı Yataklar & Bası Yarası Önleme",
      title: "Havalı Hasta Yatakları & Antidekübit Sistemleri",
      subtitle:
        "Yatan hastalarda bası yarasını (dekübitüs) önleyen, kan dolaşımını destekleyen boru tipi ve ventilasyonlu dinamik havalı yatak teknolojileri.",
      badge: "Bası Yarası Önleme ve Tedavisi",
      quickFilters: [
        { label: "Havalı Yatak Seçim Rehberi", url: "/blog/havali-hasta-yatagi-ve-antidekubit-yara-onleme-modelleri-rehberi" },
        { label: "Hasta Yatakları & Karyolalar", url: "/kategori/hasta-yataklari" },
        { label: "Hasta Yemek Masası", url: "/kategori/hasta-yemek-masalari" },
      ],
      suggestedTerms: ["Boru Tipi Havalı Yatak", "2 Motorlu Full ABS", "3 Motorlu Karyola", "Pozisyon Veren Yatak"],
    };
  }

  // 2c. Hasta Yatakları & Karyolaları (Hastane / Hasta / Motorlu / Elektrikli)
  if (
    normalized.includes("hasta") ||
    normalized.includes("hastane") ||
    normalized.includes("karyola") ||
    normalized.includes("yatak") ||
    normalized.includes("motorlu") ||
    normalized.includes("asansor") ||
    normalized.includes("trendelenburg")
  ) {
    return {
      query,
      isBrand: false,
      matchedCategorySlug: "hasta-yataklari",
      matchedCategoryName: "Hasta Yatakları & Karyolaları",
      title: "Hasta Yatakları & Elektrikli Karyolalar",
      subtitle:
        "Evde bakım ve hastane tipi, CE & ISO sertifikalı 2, 3 ve 4 motorlu elektrikli hasta karyolaları. Ankara içi aynı gün teslimat, kurulum ve 2 yıl garanti.",
      badge: "En Çok Tercih Edilen Medikal Kategori",
      quickFilters: [
        { label: "2 Motorlu Yataklar", url: "/urunler?q=2+motorlu" },
        { label: "3 Motorlu Asansörlü", url: "/urunler?q=3+motorlu" },
        { label: "4 Motorlu Trendelenburg", url: "/urunler?q=4+motorlu" },
        { label: "Tüm Hasta Yatakları", url: "/kategori/hasta-yataklari" },
        { label: "Hasta Yatağı Fiyatları", url: "/urunler" },
      ],
      suggestedTerms: ["2 Motorlu Full ABS", "3 Motorlu Karyola", "4 Motorlu Alman Burmeier", "Havalı Yatak"],
    };
  }

  // 3. Muayene & Bakım Masaları
  if (
    normalized.includes("muayene") ||
    normalized.includes("sedye") ||
    normalized.includes("masaj")
  ) {
    return {
      query,
      isBrand: false,
      matchedCategorySlug: "muayene-ve-bakim-masalari",
      matchedCategoryName: "Muayene ve Bakım Masaları",
      title: "Klinik Muayene & Bakım Masaları",
      subtitle:
        "Hastaneler, klinikler ve bakım merkezleri için ergonomik, dayanıklı ve yüksek taşıma kapasiteli muayene masaları.",
      badge: "Klinik & Muayene Ekipmanı",
      quickFilters: [
        { label: "Muayene Masaları", url: "/kategori/muayene-ve-bakim-masalari" },
        { label: "Cihaz Sehpaları", url: "/kategori/cihaz-sehpasi" },
        { label: "Tabure & Sandalyeler", url: "/kategori/tabure-ve-sandalyeler" },
      ],
      suggestedTerms: ["Motorlu Muayene Masası", "Ahşap Masaj Masası", "Cihaz Sehpası"],
    };
  }

  // 4. Bakım Koltukları / Diyaliz
  if (
    normalized.includes("koltuk") ||
    normalized.includes("diyaliz") ||
    normalized.includes("kemoterapi") ||
    normalized.includes("kan alma")
  ) {
    return {
      query,
      isBrand: false,
      matchedCategorySlug: "bakim-koltuklari",
      matchedCategoryName: "Bakım Koltukları",
      title: "Medikal Bakım & Tedavi Koltukları",
      subtitle:
        "Diyaliz, kemoterapi, kan alma ve hasta dinlenme süreçleri için çok pozisyonlu elektrikli motorlu bakım koltukları.",
      badge: "Klinik & Hasta Koltukları",
      quickFilters: [
        { label: "Tüm Bakım Koltukları", url: "/kategori/bakim-koltuklari" },
        { label: "Dövme Kol Sehpaları", url: "/kategori/dovme-kol-sehpalari" },
      ],
      suggestedTerms: ["3 Motorlu Bakım Koltuğu", "Kan Alma Koltuğu", "Dövme Koltuğu"],
    };
  }

  // 5. Dövme (Tattoo) Ekipmanları
  if (
    normalized.includes("dovme") ||
    normalized.includes("tattoo")
  ) {
    return {
      query,
      isBrand: false,
      matchedCategorySlug: "dovme-kol-sehpalari",
      matchedCategoryName: "Dövme Kol Sehpaları",
      title: "Profesyonel Dövme (Tattoo) Ekipmanları",
      subtitle:
        "Dövme stüdyoları ve sanatçılar için ayarlanabilir kol sehpaları, motorlu koltuklar ve hijyenik stüdyo ekipmanları.",
      badge: "Stüdyo & Profesyonel Ekipman",
      quickFilters: [
        { label: "Dövme Kol Sehpaları", url: "/kategori/dovme-kol-sehpalari" },
        { label: "Tabureler & Koltuklar", url: "/kategori/tabure-ve-sandalyeler" },
      ],
      suggestedTerms: ["Dövme Kol Sehpası", "Dövme Koltuğu", "Cihaz Sehpası"],
    };
  }

  // 6. Varsayılan Genel Niyet
  return {
    query,
    isBrand: false,
    title: `"${query}" Arama Sonuçları`,
    subtitle: `"${query}" terimi için bulunan medikal ekipmanlar ve hasta bakım ürünleri listelenmektedir.`,
    quickFilters: [
      { label: "Hasta Yatakları", url: "/kategori/hasta-yataklari" },
      { label: "Muayene Masaları", url: "/kategori/muayene-ve-bakim-masalari" },
      { label: "Bakım Koltukları", url: "/kategori/bakim-koltuklari" },
    ],
    suggestedTerms: ["Hasta Yatağı", "Havalı Yatak", "Muayene Masası", "Bakım Koltuğu"],
  };
}

export function getTurkishSearchVariants(word: string): string[] {
  const w = word.trim().toLowerCase();
  if (!w) return [];
  const variants = new Set<string>();
  variants.add(w);

  // Replace ascii with turkish equivalents
  const tr = w
    .replace(/i/g, "ı")
    .replace(/s/g, "ş")
    .replace(/c/g, "ç")
    .replace(/g/g, "ğ")
    .replace(/u/g, "ü")
    .replace(/o/g, "ö");
  variants.add(tr);

  // Replace turkish with ascii equivalents
  const ascii = w
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o");
  variants.add(ascii);

  // Cross combinations for common endings (e.g. havali -> havalı, masasi -> masası)
  variants.add(w.replace(/i/g, "ı"));
  variants.add(w.replace(/ı/g, "i"));

  // Common Turkish noun/adjective suffixes removal and k->ğ consonant softening for root matching:
  if (w.startsWith("hastan") || w.startsWith("hasta")) {
    variants.add("hastane");
    variants.add("hasta");
  }
  if (w.startsWith("masa")) {
    variants.add("masa");
    variants.add("masasi");
    variants.add("masası");
  }
  if (w.startsWith("karyola")) {
    variants.add("karyola");
    variants.add("karyolası");
    variants.add("karyolasi");
    variants.add("yatak");
    variants.add("yatağı");
  }
  if (w.startsWith("yatak") || w.startsWith("yatag") || w.startsWith("yatağ")) {
    variants.add("yatak");
    variants.add("yatağı");
    variants.add("yatagi");
    variants.add("karyola");
    variants.add("karyolası");
  }
  if (w.startsWith("koltuk") || w.startsWith("koltug") || w.startsWith("koltuğ")) {
    variants.add("koltuk");
    variants.add("koltuğu");
    variants.add("koltugu");
  }
  if (w.startsWith("sehpa")) {
    variants.add("sehpa");
    variants.add("sehpası");
    variants.add("sehpasi");
  }
  if (w.startsWith("sedye")) {
    variants.add("sedye");
    variants.add("muayene");
  }
  if (w.startsWith("haval") || w.startsWith("havalı") || w.startsWith("havali")) {
    variants.add("havalı");
    variants.add("havali");
    variants.add("antidekübit");
  }
  if (w.startsWith("kiral")) {
    variants.add("kiralık");
    variants.add("kiralik");
    variants.add("kiralama");
    variants.add("hasta");
    variants.add("karyola");
    variants.add("yatak");
  }

  // Sektörel eş anlamlı ve terim genişletme (Medical Domain Synonyms)
  for (const [key, syns] of Object.entries(MEDICAL_SEARCH_SYNONYM_MAP)) {
    if (w === key || w.startsWith(key) || key.startsWith(w)) {
      for (const s of syns) {
        variants.add(s);
      }
    }
  }

  // Ürün kodu (SKU) varyantları (örn: mc-5311 -> mc5311, 5311; probed-5311 -> mc5311)
  if (w.includes("-") || w.includes("probed") || w.startsWith("mc")) {
    const stripped = w.replace(/^(?:probed|pro-bed)\s*[-_ ]*/i, "").replace(/^mc[-_ ]*/i, "");
    if (stripped) {
      variants.add(stripped);
      variants.add(`mc${stripped}`);
    }
  }

  return Array.from(variants);
}

export function buildSearchWhereClauses(query: string): Prisma.ProductWhereInput[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // 1. Marka sorguları ("mcaris", "mcaris medikal" vb.) tüm aktif ürünleri döndürür
  if (isBrandSearchQuery(trimmed)) {
    return [];
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return tokens.map((token) => {
    const rawLower = token.toLowerCase();
    // Bileşik aramalarda (örn: "mcaris hasta yatağı") mcaris token'ı tüm ürünlere uyar, diğer token filtreler
    if (["mcaris", "mcarıs", "mc"].includes(rawLower)) {
      return { id: { not: "" } };
    }

    const variants = getTurkishSearchVariants(token);
    const orConditions: Prisma.ProductWhereInput[] = [];

    const isKiralikQuery = variants.some((v) =>
      ["kiralik", "kiralık", "kiralama", "kira"].includes(v)
    );

    for (const v of variants) {
      orConditions.push({ name: { contains: v, mode: "insensitive" } });
      orConditions.push({ sku: { contains: v, mode: "insensitive" } });
      orConditions.push({ slug: { contains: v.toLowerCase(), mode: "insensitive" } });
      orConditions.push({ searchKeywords: { contains: v, mode: "insensitive" } });
      orConditions.push({ description: { contains: v, mode: "insensitive" } });
      orConditions.push({ shortDescription: { contains: v, mode: "insensitive" } });
      orConditions.push({
        category: {
          name: { contains: v, mode: "insensitive" },
        },
      });
    }

    if (isKiralikQuery) {
      orConditions.push({ name: { contains: "Karyola", mode: "insensitive" } });
    }

    return { OR: orConditions };
  });
}

export async function getProducts(filters: {
  series?: Series;
  categorySlug?: string;
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  motorCount?: string;
  excludeIds?: string[];
}): Promise<{
  items: ProductWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  availableFilters: DynamicFilterGroup[];
}> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const sortBy = filters.sortBy ?? "kategori";

  const searchClauses = filters.query ? buildSearchWhereClauses(filters.query) : [];

  const cleanCategorySlug = filters.categorySlug ? slugifyTurkish(filters.categorySlug) : undefined;
  const isMotorCategory = Boolean(
    cleanCategorySlug &&
      [
        "2-motorlu-hasta-yataklari",
        "3-motorlu-hasta-yataklari",
        "asansorlu-3-motorlu-karyolalar",
        "4-motorlu-hasta-yataklari",
        "4-motorlu-yogun-bakim-karyolalari",
      ].includes(cleanCategorySlug)
  );

  const categoryMotorCount = isMotorCategory
    ? cleanCategorySlug === "2-motorlu-hasta-yataklari"
      ? "2"
      : cleanCategorySlug === "3-motorlu-hasta-yataklari" || cleanCategorySlug === "asansorlu-3-motorlu-karyolalar"
      ? "3"
      : "4"
    : undefined;

  const effectiveMotorCount = filters.motorCount || categoryMotorCount;

  const baseWhere: Prisma.ProductWhereInput = {
    isDraft: false,
    ...(filters.excludeIds && filters.excludeIds.length > 0 ? { id: { notIn: filters.excludeIds } } : {}),
    ...(cleanCategorySlug
      ? isMotorCategory
        ? {
            OR: [
              { category: { slug: cleanCategorySlug } },
              { category: { slug: "hasta-yataklari" } },
            ],
          }
        : cleanCategorySlug === "ahsap-ev-tipi-hasta-karyolalari"
        ? {
            OR: [
              { category: { slug: "ahsap-ev-tipi-hasta-karyolalari" } },
              {
                AND: [
                  { category: { slug: { in: ["hasta-yataklari", "2-motorlu-hasta-yataklari", "3-motorlu-hasta-yataklari", "4-motorlu-hasta-yataklari"] } } },
                  {
                    OR: [
                      { name: { contains: "Ahşap", mode: "insensitive" } },
                      { name: { contains: "Ahsap", mode: "insensitive" } },
                      { name: { contains: "Dali", mode: "insensitive" } },
                      { name: { contains: "Baza", mode: "insensitive" } },
                      { name: { contains: "Regia", mode: "insensitive" } },
                    ],
                  },
                ],
              },
            ],
          }
        : cleanCategorySlug === "tam-evde-bakim-setleri"
        ? {
            OR: [
              { category: { slug: "tam-evde-bakim-setleri" } },
              { category: { slug: { in: ["hasta-yataklari", "hasta-yemek-masalari"] } } },
            ],
          }
        : { category: { slug: cleanCategorySlug } }
      : {}),
    ...(searchClauses.length > 0 ? { AND: searchClauses } : {}),
  };

  const where: Prisma.ProductWhereInput = {
    ...baseWhere,
    ...(filters.series ? { series: filters.series } : {}),
  };

  try {
    // 1. Baz ürünleri çekerek mevcut kategori/arama için dinamik filtreleri hesapla
    const baseItems = await prisma.product.findMany({
      where: baseWhere,
      include: PRODUCT_INCLUDE,
    });
    const serializedBaseItems = baseItems.map(serializeProduct);
    const availableFilters = extractDynamicFilters(serializedBaseItems);

    // 2. Motor sayısı filtresi veya kategori sıralaması varsa JS tarafında süz ve sırala
    if (effectiveMotorCount || filters.series || sortBy === "kategori") {
      let filteredItems = serializedBaseItems;

      // Seri filtresi
      if (filters.series) {
        filteredItems = filteredItems.filter((item) => item.series === filters.series);
      }

      // Motor sayısına göre filtrele
      if (effectiveMotorCount) {
        filteredItems = filteredItems.filter((item) => {
          const specs = item.specs as Record<string, string> | null;
          if (!specs) return false;
          const motor =
            specs["Motor Sayısı"] ||
            specs["Motor Sayisi"] ||
            specs["motor sayısı"] ||
            specs["motor_sayisi"] ||
            "";
          const match = motor.match(/\d+/);
          const cleanMotor = match ? match[0] : motor.trim();
          return cleanMotor === effectiveMotorCount;
        });
      }

      // Sıralama
      if (sortBy === "kategori") {
        filteredItems.sort((a, b) => {
          const ai = CATEGORY_ORDER.indexOf(a.category?.slug ?? "");
          const bi = CATEGORY_ORDER.indexOf(b.category?.slug ?? "");
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });
      } else if (sortBy === "ucuz") {
        filteredItems.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortBy === "pahali") {
        filteredItems.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sortBy === "yeni") {
        filteredItems.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
      } else if (sortBy === "az") {
        filteredItems.sort((a, b) => a.name.localeCompare(b.name, "tr"));
      }

      const total = filteredItems.length;
      const start = (page - 1) * pageSize;
      const paginatedItems = filteredItems.slice(start, start + pageSize);

      return { items: paginatedItems, total, page, pageSize, availableFilters };
    }

    // Standart sıralama sorgusu
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (sortBy) {
      case "ucuz":
        orderBy = { price: "asc" };
        break;
      case "pahali":
        orderBy = { price: "desc" };
        break;
      case "yeni":
        orderBy = { createdAt: "desc" };
        break;
      case "az":
        orderBy = { name: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: PRODUCT_INCLUDE,
      }),
      prisma.product.count({ where }),
    ]);

    return { items: items.map(serializeProduct), total, page, pageSize, availableFilters };
  } catch (error) {
    console.warn("[getProducts] Fallback during build/offline:", error);
    return { items: [], total: 0, page, pageSize, availableFilters: [] };
  }
}

export async function getProductBySlug(slug: string) {
  const raw = (slug || "").trim();
  if (!raw) return null;

  const decoded = decodeURIComponent(raw).trim();
  const slugified = slugifyTurkish(decoded);

  const slugTargets = Array.from(new Set([raw, decoded, slugified])).filter(Boolean);
  const isCuid = /^c[a-z0-9]{20,}$/i.test(raw);
  const numericId = parseInt(raw, 10);

  const orConditions: Prisma.ProductWhereInput[] = [
    { slug: { in: slugTargets } },
  ];

  if (isCuid) {
    orConditions.push({ id: raw });
  }
  if (!isNaN(numericId)) {
    orConditions.push({ wcId: numericId });
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        isDraft: false,
        OR: orConditions,
      },
      include: {
        ...PRODUCT_INCLUDE,
        reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
      },
    });
    return product ? { ...serializeProduct(product), reviews: product.reviews } : null;
  } catch (error) {
    console.warn("[getProductBySlug] Fallback during build/offline:", error);
    return null;
  }
}

export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: PRODUCT_INCLUDE,
  });
  return product ? serializeProduct(product) : null;
}

export async function createProduct(data: {
  name: string;
  slug?: string;
  sku?: string | null;
  price: string | number;
  vatRate?: number | null;
  shortDescription?: string | null;
  description: string;
  searchKeywords?: string | null;
  categoryId: string;
  series?: PrismaSeries | null;
  images?: string[];
  specs?: Record<string, string>;
  stock?: number;
}): Promise<ProductWithCategory> {
  const rawName = data.name.trim();
  const name = cleanProductTitle(rawName);
  const rawSlug = data.slug?.trim() || rawName;
  const slug = slugifyTurkish(rawSlug);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    throw new Error(`'${slug}' slug değerine sahip başka bir ürün zaten var.`);
  }

  const rawSku = data.sku ? formatProductCode(data.sku) : null;
  const sku = rawSku || null;

  if (sku) {
    const existingSku = await prisma.product.findFirst({ where: { sku } });
    if (existingSku) {
      throw new Error(`'${sku}' ürün koduna sahip başka bir ürün zaten var.`);
    }
  }

  const parsedPrice = parseTurkishPrice(data.price);

  const created = await prisma.product.create({
    data: {
      name,
      slug,
      sku,
      price: new Prisma.Decimal(parsedPrice),
      vatRate: data.vatRate !== undefined ? data.vatRate : null,
      shortDescription: data.shortDescription?.trim() || null,
      description: data.description.trim(),
      searchKeywords: data.searchKeywords?.trim() || null,
      categoryId: data.categoryId,
      series: data.series ? data.series.toLowerCase() as PrismaSeries : null,
      images: data.images && data.images.length > 0 ? data.images : ["/placeholder-product.png"],
      specs: data.specs || {},
      stock: data.stock ?? 0,
    },
    include: PRODUCT_INCLUDE,
  });

  return serializeProduct(created);
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    slug?: string;
    sku?: string | null;
    price?: string | number;
    vatRate?: number | null;
    shortDescription?: string | null;
    description?: string;
    searchKeywords?: string | null;
    categoryId?: string;
    series?: PrismaSeries | null;
    images?: string[];
    specs?: Record<string, string>;
    stock?: number;
  }
): Promise<ProductWithCategory> {
  const name = data.name ? cleanProductTitle(data.name.trim()) : undefined;
  let slug: string | undefined = undefined;

  if (data.slug?.trim()) {
    slug = slugifyTurkish(data.slug.trim());
  } else if (name) {
    slug = slugifyTurkish(name);
  }

  if (slug) {
    const existing = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      throw new Error(`'${slug}' slug değerine sahip başka bir ürün zaten var.`);
    }
  }

  const rawSku = data.sku !== undefined ? (data.sku ? formatProductCode(data.sku) : null) : undefined;
  if (rawSku) {
    const existingSku = await prisma.product.findFirst({
      where: { sku: rawSku, NOT: { id } },
    });
    if (existingSku) {
      throw new Error(`'${rawSku}' ürün koduna sahip başka bir ürün zaten var.`);
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(rawSku !== undefined && { sku: rawSku }),
      ...(data.price !== undefined && { price: new Prisma.Decimal(parseTurkishPrice(data.price)) }),
      ...(data.vatRate !== undefined && { vatRate: data.vatRate }),
      ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription ? data.shortDescription.trim() : null }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.searchKeywords !== undefined && { searchKeywords: data.searchKeywords ? data.searchKeywords.trim() : null }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.series !== undefined && { series: data.series ? data.series.toLowerCase() as PrismaSeries : null }),
      ...(data.images !== undefined && { images: data.images }),
      ...(data.specs !== undefined && { specs: data.specs }),
      ...(data.stock !== undefined && { stock: data.stock }),
    },
    include: PRODUCT_INCLUDE,
  });

  return serializeProduct(updated);
}

export async function deleteProduct(id: string) {
  return prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({
      where: { productId: id },
    });
    await tx.orderItem.deleteMany({
      where: { productId: id },
    });
    return tx.product.delete({
      where: { id },
    });
  });
}

export async function quickUpdateProduct(
  id: string,
  data: { price?: number | string; stock?: number; vatRate?: number | null }
): Promise<ProductWithCategory> {
  const updateData: Prisma.ProductUpdateInput = {};

  if (data.price !== undefined) {
    const numericPrice = typeof data.price === "number" ? data.price : parseFloat(parseTurkishPrice(data.price));
    const safePrice = Math.max(0, Math.round((numericPrice + Number.EPSILON) * 100) / 100);
    updateData.price = new Prisma.Decimal(safePrice);
  }

  if (data.stock !== undefined) {
    updateData.stock = Math.max(0, Math.floor(data.stock));
  }

  if (data.vatRate !== undefined) {
    if (data.vatRate === null) {
      updateData.vatRate = null;
    } else {
      const allowed = [0, 1, 10, 20];
      if (!allowed.includes(data.vatRate)) {
        throw new Error("Geçersiz KDV oranı.");
      }
      updateData.vatRate = data.vatRate;
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
    include: PRODUCT_INCLUDE,
  });

  return serializeProduct(updated);
}

export async function duplicateProduct(id: string): Promise<ProductWithCategory> {
  const original = await prisma.product.findUnique({
    where: { id },
    include: PRODUCT_INCLUDE,
  });

  if (!original) {
    throw new Error("Klonlanacak ürün bulunamadı.");
  }

  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const newName = `${original.name} (Kopya)`;
  const baseSlug = slugifyTurkish(original.name);
  const newSlug = `${baseSlug}-kopya-${randomSuffix}`;
  const newSku = original.sku ? `${original.sku}-K${randomSuffix.toUpperCase()}` : null;

  const duplicated = await prisma.product.create({
    data: {
      name: newName,
      slug: newSlug,
      sku: newSku,
      price: original.price,
      stock: original.stock,
      categoryId: original.categoryId,
      series: original.series,
      shortDescription: original.shortDescription,
      description: original.description,
      images: original.images || ["/placeholder-product.png"],
      specs: (original.specs as Prisma.InputJsonValue) || {},
      searchKeywords: original.searchKeywords || null,
    },
    include: PRODUCT_INCLUDE,
  });

  return serializeProduct(duplicated);
}

export async function bulkUpdateProducts(params: {
  productIds: string[];
  action: "adjust_price_percent" | "set_stock" | "change_category" | "delete";
  value?: number | string;
}): Promise<{ affectedCount: number }> {
  const { productIds, action, value } = params;
  if (!productIds || productIds.length === 0) {
    return { affectedCount: 0 };
  }

  if (action === "delete") {
    return prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: { productId: { in: productIds } },
      });
      await tx.orderItem.deleteMany({
        where: { productId: { in: productIds } },
      });
      const res = await tx.product.deleteMany({
        where: { id: { in: productIds } },
      });
      return { affectedCount: res.count };
    });
  }

  if (action === "set_stock") {
    const stockVal = Math.max(0, parseInt(String(value ?? 0), 10));
    const res = await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { stock: stockVal },
    });
    return { affectedCount: res.count };
  }

  if (action === "change_category") {
    if (!value || typeof value !== "string") {
      throw new Error("Hedef kategori seçilmedi.");
    }
    const res = await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { categoryId: value },
    });
    return { affectedCount: res.count };
  }

  if (action === "adjust_price_percent") {
    const percent = parseFloat(String(value ?? 0));
    if (isNaN(percent)) throw new Error("Geçerli bir yüzde girilmedi.");

    const multiplier = 1 + percent / 100;
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    await prisma.$transaction(
      products.map((p) => {
        const curPrice = Number(p.price);
        const newPrice = Math.max(0, Math.round((curPrice * multiplier + Number.EPSILON) * 100) / 100);
        return prisma.product.update({
          where: { id: p.id },
          data: { price: new Prisma.Decimal(newPrice) },
        });
      })
    );

    return { affectedCount: products.length };
  }

  return { affectedCount: 0 };
}

