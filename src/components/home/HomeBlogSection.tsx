import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/blog";

export default async function HomeBlogSection() {
  const posts = (await getBlogPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-6 font-inter">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 border-b border-neutral-200/80 pb-4 gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white leading-tight">
              REHBER
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Medikal Bilgi Merkezi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
            Hasta Bakımı &amp; Medikal Ekipman Rehberi
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Hasta yatağı seçimi, evde bakım protokolleri, bası yarası önleme ve klinik rehabilitasyon süreçleri hakkında uzman içerikleri.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-neutral-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs shrink-0"
        >
          <span>Tüm Blog Yazılarını Gör</span>
          <span>&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {posts.map((post) => {
          const parts = post.title.split(":");
          const mainTitle = parts[0]?.trim() || post.title;
          const subTitle = parts.slice(1).join(":").trim();

          return (
            <article
              key={post.id}
              className="group bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-400 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-xs"
            >
              <div>
                {/* Cover Image */}
                <Link
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  aria-label={`${mainTitle} Görseli`}
                  className="block relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden"
                >
                  <Image
                    src={post.coverImage || "/categories/hasta-yataklari.png"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                  />
                  <span className="sr-only">{mainTitle} Görseli</span>
                  <div
                    aria-hidden="true"
                    className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10 select-none"
                  >
                    {post.category}
                  </div>
                </Link>

                {/* Text Body */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline" title={post.title}>
                      {mainTitle}
                    </Link>
                    {subTitle && (
                      <span className="text-neutral-600 font-semibold">: {subTitle}</span>
                    )}
                  </p>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Link with unique article-specific anchor */}
              <div className="p-4 sm:p-5 pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  title={`${post.title} - Rehberi Oku`}
                  aria-label={`${mainTitle} Rehberini Oku`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{mainTitle} Rehberini Oku</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
