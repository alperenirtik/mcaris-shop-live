import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema } from "@/lib/seo";
import BlogListClient from "@/components/blog/BlogListClient";

export const metadata: Metadata = {
  title: "Medikal Bilgi Bankası & Hasta Bakım Rehberi",
  description:
    "Motorlu hasta yatakları, evde bakım ipuçları, hasta transfer liftleri, dekübitüs yatak yarası önleme ve medikal ekipman kullanım rehberleri.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Medikal Bilgi Bankası & Hasta Bakım Rehberi | ${BRAND_NAME}`,
    description:
      "Motorlu hasta yatakları, evde bakım ipuçları ve medikal ekipman kullanım rehberleri.",
    url: `${SITE_URL}/blog`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Medikal Blog", url: "/blog" },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#FAFBFD] min-h-screen py-8 sm:py-12 font-sans">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-neutral-900">Medikal Blog</span>
          </nav>

          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800">
              <span className="text-neutral-900 font-extrabold">BİLGİ BANKASI</span>
              <span className="text-neutral-300">|</span>
              <span>Klinik &amp; Evde Bakım Rehberleri</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
              Medikal Ekipman &amp; Evde Hasta Bakım Rehberi
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
              Hastanızın konforunu ve güvenliğini en üst seviyeye çıkarmak için uzman medikal ekibimiz tarafından hazırlanan güncel, güvenilir ve klinik bakım rehberleri.
            </p>
          </div>

          {/* Blog Posts Interactive Client */}
          <BlogListClient posts={posts} />

        </div>
      </div>
    </>
  );
}
