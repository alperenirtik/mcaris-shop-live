import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  author: string;
  readTime: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getBlogPosts(): Promise<BlogPostItem[]> {
  try {
    return await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getBlogPosts error:", error);
    return [];
  }
}

export async function getRelatedBlogPosts(currentSlug: string, limit = 2): Promise<BlogPostItem[]> {
  try {
    return await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        slug: { not: currentSlug },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getRelatedBlogPosts error:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (post) {
      // Görüntülenme sayısını asenkron olarak artır
      prisma.blogPost
        .update({
          where: { id: post.id },
          data: { viewCount: { increment: 1 } },
        })
        .catch(() => {});
      return post;
    }
    return null;
  } catch (error) {
    console.error("getBlogPostBySlug error:", error);
    return null;
  }
}

export function getArticleSchema(post: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  author: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage}`
      : `${SITE_URL}/og-image.png`,
    author: {
      "@type": "Organization",
      name: post.author || "MCARIS Medikal",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "MCARIS Medikal",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };
}
