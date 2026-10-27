import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractOrGenerateProductCode } from "@/lib/productCode";
import { cleanProductTitle } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

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

function getGoogleProductCategory(categorySlug?: string): string {
  const map: Record<string, string> = {
    "hasta-yataklari": "Health & Beauty > Health Care > Medical Furniture & Bedding > Hospital Beds",
    "hasta-yemek-masalari": "Health & Beauty > Health Care > Medical Furniture & Bedding > Overbed Tables",
    "bakim-yataklari": "Health & Beauty > Health Care > Medical Furniture & Bedding > Hospital Beds",
    "bakim-koltuklari": "Health & Beauty > Health Care > Medical Furniture & Bedding > Medical Examination Chairs",
    "muayene-ve-bakim-masalari": "Health & Beauty > Health Care > Medical Furniture & Bedding > Examination Tables",
    "cihaz-sehpasi": "Health & Beauty > Health Care > Medical Furniture & Bedding > Medical Equipment Carts",
    "dovme-kol-sehpalari": "Health & Beauty > Personal Care > Tattooing & Body Art Accessories",
    "tabure-ve-sandalyeler": "Health & Beauty > Health Care > Medical Furniture & Bedding > Medical Stools",
    "medikal-kozmetik": "Health & Beauty > Personal Care > Cosmetics & Skin Care",
  };
  return map[categorySlug || ""] || "Health & Beauty > Health Care > Medical Furniture & Bedding";
}

export async function generateProductFeedXml(options: {
  categorySlug?: string;
  feedTitle?: string;
  feedDescription?: string;
} = {}) {
  const { categorySlug } = options;

  let whereClause: Record<string, unknown> = {
    isDraft: false,
  };

  if (categorySlug && categorySlug !== "all") {
    const cleanCat = categorySlug.replace(/\.xml$/, "").trim();

    // Map common aliases (yatak -> hasta-yataklari, dovme -> dovme-kol-sehpalari)
    let targetSlug = cleanCat;
    if (cleanCat === "yatak" || cleanCat === "hasta-yatagi" || cleanCat === "beds") {
      targetSlug = "hasta-yataklari";
    } else if (cleanCat === "dovme" || cleanCat === "tattoo" || cleanCat === "dovme-sehpalari") {
      targetSlug = "dovme-kol-sehpalari";
    } else if (cleanCat === "koltuk" || cleanCat === "chairs") {
      targetSlug = "bakim-koltuklari";
    } else if (cleanCat === "masa" || cleanCat === "muayene" || cleanCat === "tables") {
      targetSlug = "muayene-ve-bakim-masalari";
    } else if (cleanCat === "kozmetik" || cleanCat === "cosmetics") {
      targetSlug = "medikal-kozmetik";
    }

    whereClause = {
      isDraft: false,
      category: {
        slug: targetSlug,
      },
    };
  }

  const [products, shippingSettings] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    (await import("@/lib/shipping")).getShippingSettings(),
  ]);

  const { calculateShipping } = await import("@/lib/shipping");

  const categoryName = products[0]?.category?.name || (categorySlug ? categorySlug.toUpperCase() : "Tüm Kategoriler");

  const title = options.feedTitle || `MCARIS ${categoryName} - Google Merchant Ürün Kataloğu`;
  const description =
    options.feedDescription ||
    `MCARIS Medikal ${categoryName} kategorisi resmi Google Alışveriş ve Merchant Center XML ürün veri akışı.`;

  const itemsXml = products
    .map((product) => {
      const specsObj =
        typeof product.specs === "object" && product.specs !== null && !Array.isArray(product.specs)
          ? (product.specs as Record<string, unknown>)
          : undefined;

      let resolvedCode =
        product.sku ||
        extractOrGenerateProductCode({
          id: product.id,
          name: product.name,
          slug: product.slug,
          wcId: product.wcId,
          specs: specsObj,
        });

      if (resolvedCode) {
        // Pazar yerleri (Pazarama vb.) için boşlukları tireye dönüştür
        resolvedCode = resolvedCode.replace(/\s+/g, "-");
        // İdefix ve pazar yeri barkod kuralı: Alfanümerik en az 6 karakter olmalı (örn: MCYME -> MCYME1)
        const alphanumeric = resolvedCode.replace(/[^A-Za-z0-9]/g, "");
        if (alphanumeric.length > 0 && alphanumeric.length < 6) {
          const diff = 6 - alphanumeric.length;
          resolvedCode = `${resolvedCode}${"1".repeat(diff)}`;
        }
      }

      const itemId = resolvedCode || product.id;
      const mpnXml = resolvedCode
        ? `      <g:mpn>${escapeXml(resolvedCode)}</g:mpn>`
        : `      <g:identifier_exists>no</g:identifier_exists>`;

      const productUrl = `${SITE_URL}/urun/${encodeURIComponent(product.slug)}`;
      const priceNum = parseFloat(product.price.toString()) || 0;
      const priceFormatted = `${priceNum.toFixed(2)} TRY`;
      const availability = product.stock > 0 ? "in_stock" : "out_of_stock";
      const catName = product.category?.name || "Medikal Ürünler";
      const googleCat = getGoogleProductCategory(product.category?.slug);

      const shippingFee = calculateShipping(priceNum, shippingSettings.cost, shippingSettings.threshold);
      const shippingPriceFormatted = `${shippingFee.toFixed(2)} TRY`;
      const shippingServiceName = shippingFee === 0 ? "Ücretsiz Kata Teslimat ve Montaj" : "Standart Teslimat ve Kurulum";

      const images = (product.images || []).map((img) =>
        img.startsWith("http") ? img : `${SITE_URL}${img.startsWith("/") ? "" : "/"}${img}`
      );

      const mainImage = images[0] || `${SITE_URL}/placeholder-product.png`;
      const additionalImages = images.slice(1);

      const additionalImagesXml = additionalImages
        .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
        .join("\n");

      const specs = (product.specs as Record<string, string>) || {};
      const specDetailsXml = Object.entries(specs)
        .map(([key, val]) => {
          if (!key || !val) return "";
          return `      <g:product_detail>
        <g:section_name>Teknik Özellikler</g:section_name>
        <g:attribute_name>${escapeXml(key)}</g:attribute_name>
        <g:attribute_value>${escapeXml(val)}</g:attribute_value>
      </g:product_detail>`;
        })
        .filter(Boolean)
        .join("\n");

      const brand = product.name.toLowerCase().includes("burmeier")
        ? "Burmeier"
        : product.name.toLowerCase().includes("carine")
        ? "Carine"
        : "MCARIS";

      const descriptionClean = (product.description || product.shortDescription || product.name)
        .replace(/<[^>]*>?/gm, "")
        .trim();

      const cleanName = cleanProductTitle(product.name);

      return `    <item>
      <title><![CDATA[${cleanName}]]></title>
      <link>${escapeXml(productUrl)}</link>
      <description><![CDATA[${descriptionClean}]]></description>
      <guid isPermaLink="true">${escapeXml(productUrl)}</guid>
      <pubDate>${new Date(product.updatedAt || product.createdAt).toUTCString()}</pubDate>
      <enclosure url="${escapeXml(mainImage)}" type="image/webp" length="0" />
      <media:content url="${escapeXml(mainImage)}" medium="image" />
      <g:id>${escapeXml(itemId)}</g:id>
      <g:title><![CDATA[${cleanName}]]></g:title>
      <g:description><![CDATA[${descriptionClean}]]></g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
${additionalImagesXml ? additionalImagesXml + "\n" : ""}\
      <g:availability>${availability}</g:availability>
      <g:price>${priceFormatted}</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:condition>new</g:condition>
${mpnXml}
      <g:product_type><![CDATA[${catName}]]></g:product_type>
      <g:google_product_category>${escapeXml(googleCat)}</g:google_product_category>
      <g:custom_label_0>${escapeXml(product.series ? product.series.toUpperCase() : "STANDARD")}</g:custom_label_0>
      <g:custom_label_1>${escapeXml(catName)}</g:custom_label_1>
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>${escapeXml(shippingServiceName)}</g:service>
        <g:price>${shippingPriceFormatted}</g:price>
      </g:shipping>
${specDetailsXml ? specDetailsXml + "\n" : ""}\
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:c="http://base.google.com/cns/1.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(description)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
