/**
 * Probed katalog XML'ini Shop ürün şemasına yükler.
 * Kaynak: probed/output/probed-products.xml
 * Var olan SKU: fiyat ve dolu açıklama güncellenir, slug ve görseller korunur.
 * Yeni SKU: kategori eşlemesi, WebP galeri ve ürün kaydı oluşturulur.
 */
import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { slugifyTurkish } from "../src/lib/categories";
import { formatProductCode } from "../src/lib/productCode";
import { optimizeAndSaveImage } from "../src/lib/image-optimizer";

const XML_PATH =
  process.env.PROBED_XML ||
  "/private/var/www/mcaris-yonetim/probed/output/probed-products.xml";
const PROBED_ROOT =
  process.env.PROBED_ROOT || "/private/var/www/mcaris-yonetim/probed";
const DRY_RUN = process.env.DRY_RUN === "1";

const prisma = new PrismaClient();

interface CatalogProduct {
  title: string;
  sku: string;
  price: string;
  available: boolean;
  tags: string;
  vendor: string;
  collections: string[];
  descriptionHtml: string;
  images: string[];
}

function decodeXml(value: string): string {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, num: string) =>
      String.fromCodePoint(parseInt(num, 10))
    )
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function inner(block: string, tag: string): string {
  const matched = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`)
  );
  return matched ? decodeXml(matched[1].trim()) : "";
}

function parseCatalog(xml: string): CatalogProduct[] {
  const blocks = xml.match(/<product>[\s\S]*?<\/product>/g) ?? [];
  const products: CatalogProduct[] = [];

  for (const block of blocks) {
    const variant = block.match(/<variant>[\s\S]*?<\/variant>/)?.[0] ?? "";
    const sku = formatProductCode(inner(variant, "sku"));
    const title = inner(block, "title");
    const price = inner(variant, "price");
    if (!sku || !title || !price) continue;

    const images = [...block.matchAll(/<image\s+position="(\d+)">([\s\S]*?)<\/image>/g)]
      .map((match) => ({
        position: Number(match[1]),
        src: decodeXml(match[2].trim()),
      }))
      .sort((a, b) => a.position - b.position)
      .map((image) => image.src)
      .filter(Boolean);

    const collections = [
      ...block.matchAll(/<collection>([\s\S]*?)<\/collection>/g),
    ].map((match) => decodeXml(match[1].trim())).filter(Boolean);

    products.push({
      title,
      sku,
      price,
      available: inner(variant, "available") !== "false",
      tags: inner(block, "tags"),
      vendor: inner(block, "vendor"),
      collections,
      descriptionHtml: inner(block, "description"),
      images,
    });
  }

  return products;
}

function htmlToText(html: string): string {
  if (!html.trim()) return "";
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/(div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

function pickCategorySlug(product: CatalogProduct): string {
  const title = product.title.toLocaleLowerCase("tr-TR");
  const collections = product.collections.join(" ").toLocaleLowerCase("tr-TR");
  const fromTitle = matchCategory(title);
  if (fromTitle) return fromTitle;
  return matchCategory(collections) ?? "muayene-ve-bakim-masalari";
}

function matchCategory(text: string): string | null {
  if (/kol\s*(sehpa|dayama)|d[oö]vme\s*kol/.test(text)) return "dovme-kol-sehpalari";
  if (/yemek|etajer/.test(text)) return "hasta-yemek-masalari";
  if (/sehpa|setup\s*masa/.test(text)) return "cihaz-sehpasi";
  if (/sandalye|tabure/.test(text)) return "tabure-ve-sandalyeler";
  if (/koltuk|koltuğ/.test(text)) return "bakim-koltuklari";
  if (/lamba|paravan|ask[ıi]l/.test(text)) return "cihaz-sehpasi";
  if (/masa|yatak|sedye|spa/.test(text)) return "muayene-ve-bakim-masalari";
  return null;
}

async function saveGallery(product: CatalogProduct, slug: string): Promise<string[]> {
  const urls: string[] = [];
  for (let index = 0; index < product.images.length; index += 1) {
    const relative = product.images[index];
    const source = path.resolve(PROBED_ROOT, relative);
    const buffer = await fs.readFile(source);
    const saved = await optimizeAndSaveImage(buffer, {
      productSlug: slug,
      index: index + 1,
      quality: 85,
      maxWidth: 1600,
    });
    urls.push(saved.url);
  }
  return urls;
}

async function main() {
  const xml = await fs.readFile(XML_PATH, "utf8");
  const products = parseCatalog(xml);
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(categories.map((category) => [category.slug, category.id]));

  const existing = await prisma.product.findMany({
    select: { id: true, sku: true, slug: true, description: true },
  });
  const existingBySku = new Map(
    existing.flatMap((product) => (product.sku ? [[product.sku, product] as const] : []))
  );
  const usedSlugs = new Set(existing.map((product) => product.slug));

  let created = 0;
  let updated = 0;
  let imageCount = 0;
  const categoryCounts = new Map<string, number>();

  for (const product of products) {
    const categorySlug = pickCategorySlug(product);
    categoryCounts.set(categorySlug, (categoryCounts.get(categorySlug) ?? 0) + 1);
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) {
      throw new Error(`Kategori bulunamadı: ${categorySlug}`);
    }

    const description = htmlToText(product.descriptionHtml);
    const current = existingBySku.get(product.sku);
    const price = new Prisma.Decimal(product.price);

    if (current) {
      if (!DRY_RUN) {
        await prisma.product.update({
          where: { id: current.id },
          data: {
            price,
            ...(description ? { description, shortDescription: description.slice(0, 240) } : {}),
            ...(product.tags ? { searchKeywords: product.tags } : {}),
          },
        });
      }
      updated += 1;
      continue;
    }

    let slug = slugifyTurkish(product.title);
    if (!slug) slug = product.sku.toLowerCase();
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${product.sku.toLowerCase()}`;
    }
    usedSlugs.add(slug);

    const images = DRY_RUN ? [] : await saveGallery(product, slug);
    imageCount += images.length;
    const specs: Prisma.InputJsonValue = {
      "Ürün Kodu": product.sku,
      ...(product.vendor ? { Marka: product.vendor } : {}),
    };

    if (!DRY_RUN) {
      await prisma.product.create({
        data: {
          name: product.title,
          slug,
          sku: product.sku,
          price,
          vatRate: 10,
          // Satılabilir; UI probed için "Stokta/Hızlı Sevk" göstermez
          stock: product.available ? 10 : 0,
          categoryId,
          shortDescription: description ? description.slice(0, 240) : null,
          description: description || product.title,
          searchKeywords: product.tags || null,
          images: images.length > 0 ? images : ["/placeholder-product.png"],
          specs,
          isDraft: false,
        },
      });
    }
    created += 1;
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        xmlProducts: products.length,
        created,
        updated,
        imageCount,
        categories: Object.fromEntries(categoryCounts),
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
