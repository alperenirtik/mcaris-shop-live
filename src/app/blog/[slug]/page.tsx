import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBlogPostBySlug, getArticleSchema, getRelatedBlogPosts } from "@/lib/blog";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema, WHATSAPP_NUMBER } from "@/lib/seo";
import { MarkdownContent } from "@/components/blog/MarkdownContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Makale Bulunamadı",
      description: "Aradığınız blog yazısı bulunamadı.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = post.title;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: `${title} | ${BRAND_NAME}`,
      description,
      url: `${SITE_URL}/blog/${slug}`,
      siteName: BRAND_NAME,
      locale: "tr_TR",
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: [post.author],
      images: post.coverImage ? [`${SITE_URL}${post.coverImage}`] : [`${SITE_URL}/og-image.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND_NAME}`,
      description,
      images: post.coverImage ? [`${SITE_URL}${post.coverImage}`] : [`${SITE_URL}/og-image.png`],
    },
  };
}

export const revalidate = 3600;

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(slug, 2);

  const articleSchema = getArticleSchema(post);
  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Medikal Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#FAFBFD] min-h-screen py-8 sm:py-12 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-500 overflow-x-auto pb-1">
            <Link href="/" className="hover:text-neutral-900 transition-colors shrink-0">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-neutral-900 transition-colors shrink-0">Medikal Blog</Link>
            <span>/</span>
            <span className="text-neutral-900 truncate">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white">
                {post.category}
              </span>
              <span className="text-xs text-neutral-400 font-medium">&bull;</span>
              <span className="text-xs text-neutral-600 font-medium">{post.readTime}</span>
              <span className="text-xs text-neutral-400 font-medium">&bull;</span>
              <span className="text-xs text-neutral-600 font-medium">
                {new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author Bar */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">{post.author}</span>
                  <span className="text-[11px] text-neutral-500 block">MCARIS Klinik İnceleme Kurulu</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-[10px] font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.coverImage && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-2xs">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body Content */}
          <article className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-2xs">
            <MarkdownContent content={post.content} />

            {/* In-Article WhatsApp Consultation Box */}
            <div className="mt-8 p-5 sm:p-6 bg-[#0E1A30] text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 not-prose">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold">Hastanız İçin Doğru Modeli Birlikte Belirleyelim</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Uzman medikal danışmanlarımız 7/24 ücretsiz bilgilendirme ve Ankara içi aynı gün teslimat sağlar.
                </p>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Merhaba, "${post.title}" makalenizi okudum. Hasta karyolası seçimi hakkında bilgi almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-xs"
              >
                <span>WhatsApp Uzman Danışma</span>
                <span>&rarr;</span>
              </a>
            </div>
          </article>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-neutral-900">Diğer İlgili Medikal Rehberler</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="bg-white p-4 rounded-xl border border-neutral-200/90 hover:border-neutral-900 transition-all block space-y-2 group shadow-2xs"
                  >
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{rel.category}</span>
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-xs font-semibold text-neutral-600 inline-flex items-center gap-1">
                      <span>Devamını Oku</span>
                      <span>&rarr;</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
