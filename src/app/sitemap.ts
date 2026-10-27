import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { ANKARA_DISTRICTS } from "@/lib/ankaraDistricts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Statik Sayfalar
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency:"daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/urunler`,
      lastModified: currentDate,
      changeFrequency:"daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/hakkimizda`,
      lastModified: currentDate,
      changeFrequency:"monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/iletisim`,
      lastModified: currentDate,
      changeFrequency:"monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/degisiklik-kayitlari`,
      lastModified: currentDate,
      changeFrequency:"weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/siparis-takip`,
      lastModified: currentDate,
      changeFrequency:"weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/sss`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kiralama-proseduru`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/gizlilik-politikasi`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/iptal-ve-iade-kosullari`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/mesafeli-satis-sozlesmesi`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // 1.5. Dinamik Blog Makaleleri
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    blogRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt || currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // fallback
  }

  // 2. Dinamik Ürün Sayfaları
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { isDraft: false },
      select: { slug: true, updatedAt: true },
    });

    productRoutes = products.map((p) => ({
      url: `${SITE_URL}/urun/${encodeURIComponent(p.slug)}`,
      lastModified: p.updatedAt || currentDate,
      changeFrequency:"weekly",
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Sitemap ürün sorgusu hatası:", error);
  }

  // 3. Dinamik Kategori Sayfaları
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    categoryRoutes = categories.map((c) => ({
      url: `${SITE_URL}/kategori/${encodeURIComponent(c.slug)}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap kategori sorgusu hatası:", error);
  }

  // Fallback: Veritabanı bağlantı havuzu doluysa en temel kategorilerin sitemap'te her zaman yer almasını garanti et
  if (categoryRoutes.length === 0) {
    const fallbackCategorySlugs = [
      "hasta-yataklari",
      "2-motorlu-hasta-yataklari",
      "3-motorlu-hasta-yataklari",
      "4-motorlu-hasta-yataklari",
      "bakim-koltuklari",
      "muayene-ve-bakim-masalari",
      "cihaz-sehpasi",
      "tabure-ve-sandalyeler",
    ];
    categoryRoutes = fallbackCategorySlugs.map((slug) => ({
      url: `${SITE_URL}/kategori/${encodeURIComponent(slug)}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  // 4. Seri Sayfaları
  const seriesRoutes: MetadataRoute.Sitemap = ["platinum", "gold", "silver"].map((s) => ({
    url: `${SITE_URL}/seri/${s}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 5. Ankara & 25 İlçe Programmatic Local SEO Sayfaları
  const ankaraHubRoute: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/ankara-hasta-yatagi`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
  ];

  const ankaraDistrictRoutes: MetadataRoute.Sitemap = ANKARA_DISTRICTS.map((d) => ({
    url: `${SITE_URL}/ankara-hasta-yatagi/${d.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.88,
  }));

  return [
    ...staticRoutes,
    ...ankaraHubRoute,
    ...ankaraDistrictRoutes,
    ...categoryRoutes,
    ...seriesRoutes,
    ...blogRoutes,
    ...productRoutes,
  ];
}

