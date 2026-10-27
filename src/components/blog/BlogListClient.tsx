"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPostItem } from "@/lib/blog";

const CATEGORIES = [
  "Tümü",
  "Hasta Karyolası Rehberi",
  "Hasta Bakımı",
  "Satın Alma & Rehberler",
  "Teknik & Güvenlik",
] as const;

export default function BlogListClient({ posts }: { posts: BlogPostItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory = activeCategory === "Tümü" || post.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Makalelerde ara (örn: hasta yatağı fiyatları, Trendelenburg, inme bakımı, havalı yatak)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-neutral-50/60 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group bg-white rounded-2xl border border-neutral-200/90 hover:border-neutral-900 p-2.5 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-sm overflow-hidden"
            >
              <Link href={`/blog/${post.slug}`} className="block space-y-3.5">
                {/* Image Container with Concentric Geometry */}
                <div className="relative aspect-[16/10] w-full rounded-[10px] bg-neutral-100 overflow-hidden border border-neutral-100">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-xs font-bold">
                      MCARIS Medikal
                    </div>
                  )}

                  <span className="absolute top-2.5 left-2.5 z-10 bg-neutral-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs tracking-tight">
                    {post.category}
                  </span>
                </div>

                {/* Post Content */}
                <div className="px-2 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-500">
                    <span>{post.readTime}</span>
                    <span>&bull;</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-black line-clamp-2 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>

              {/* Card Footer Action */}
              <div className="pt-4 px-2 pb-1 border-t border-neutral-100 flex items-center justify-between mt-3">
                <span className="text-xs font-bold text-neutral-700">{post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-neutral-900 hover:text-black inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Rehberi Oku</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 space-y-3">
          <p className="text-sm font-bold text-neutral-800">Aramanızla eşleşen rehber makalesi bulunamadı.</p>
          <p className="text-xs text-neutral-500">Farklı bir arama terimi deneyebilir veya kategorileri değiştirebilirsiniz.</p>
        </div>
      )}
    </div>
  );
}
