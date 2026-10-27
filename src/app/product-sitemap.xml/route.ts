import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isDraft: false },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        updatedAt: true,
        stock: true,
        price: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const urlsXml = products
      .map((product) => {
        const productUrl = `${SITE_URL}/urun/${encodeURIComponent(product.slug)}`;
        const lastMod = (product.updatedAt || new Date()).toISOString();

        const imagesXml = (product.images || [])
          .map((img, idx) => {
            const imgUrl = img.startsWith("http")
              ? img
              : `${SITE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
            const categoryText = product.category?.name ? ` ${product.category.name}` : "";
            return `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(product.name)} - Görsel ${idx + 1}</image:title>
      <image:caption>${escapeXml(product.name)}${escapeXml(categoryText)} - MCARIS Medikal Ankara</image:caption>
      <image:geo_location>Ankara, Turkey</image:geo_location>
    </image:image>`;
          })
          .join("");


        return `  <url>
    <loc>${escapeXml(productUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>${imagesXml}
  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating product-sitemap.xml:", error);
    return new NextResponse("Error generating product-sitemap.xml", {
      status: 500,
    });
  }
}
