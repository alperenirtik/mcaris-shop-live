/**
 * kozmetik-onizleme/sync-catalog.json → Shop (Medikal Kozmetik)
 *
 * Carine: MC-CRN* güncelle / eksik oluştur
 * L’Carlie: barkod SKU ile oluştur / güncelle
 * Görseller: images-1 → public/uploads/products (WebP)
 *
 * DRY_RUN=1 npx tsx scripts/import-kozmetik-47.ts
 * npx tsx scripts/import-kozmetik-47.ts
 */
import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { slugifyTurkish } from "../src/lib/categories";
import { formatProductCode } from "../src/lib/productCode";
import { optimizeAndSaveImage } from "../src/lib/image-optimizer";

const CATALOG_PATH =
  process.env.KOZMETIK_CATALOG ||
  "/private/var/www/mcaris-yonetim/kozmetik-onizleme/sync-catalog.json";
const KOZMETIK_ROOT =
  process.env.KOZMETIK_ROOT || "/private/var/www/mcaris-yonetim/kozmetik-onizleme";
const CATEGORY_SLUG = "medikal-kozmetik";
const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE_IMAGES = process.env.FORCE_IMAGES === "1";

const prisma = new PrismaClient();

type CatalogProduct = {
  family?: string;
  brand_group?: string;
  brand_name?: string;
  title: string;
  description: string;
  sale: number;
  list?: number;
  stock?: number;
  images_local?: string[];
  primary_barcode?: string;
  mc_sku?: string;
  barcodes?: Array<string | number>;
};

function resolveSku(p: CatalogProduct): string {
  if (p.mc_sku && String(p.mc_sku).trim() !== "" && p.mc_sku !== "-") {
    return formatProductCode(String(p.mc_sku));
  }
  // Eksik Carine (Bebek Vücut Şampuanı)
  if ((p.brand_group === "carine" || p.family === "TY-BEBEK-SAMPUAN-400") && !p.mc_sku) {
    return "MC-CRN017";
  }
  const bc = String(p.primary_barcode || "").trim();
  if (bc) return formatProductCode(bc);
  throw new Error(`SKU yok: ${p.title}`);
}

function descToHtml(text: string): string {
  const normalized = text.trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const parts = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return `<p>${escapeHtml(text)}</p>`;
  return parts
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shortDesc(text: string): string {
  const plain = text.replace(/\s+/g, " ").trim();
  return plain.slice(0, 240);
}

async function loadImages(p: CatalogProduct, slug: string): Promise<string[]> {
  const locals = p.images_local ?? [];
  const urls: string[] = [];
  for (let i = 0; i < locals.length; i += 1) {
    const rel = locals[i];
    const abs = path.resolve(KOZMETIK_ROOT, rel);
    const buffer = await fs.readFile(abs);
    const saved = await optimizeAndSaveImage(buffer, {
      productSlug: slug,
      index: i + 1,
      quality: 85,
      maxWidth: 1600,
    });
    urls.push(saved.url);
  }
  return urls;
}

async function main() {
  const raw = await fs.readFile(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(raw) as { products?: CatalogProduct[] };
  const products = catalog.products ?? [];
  if (products.length < 40) {
    throw new Error(`Katalog eksik: ${products.length}`);
  }

  const category = await prisma.category.findUnique({ where: { slug: CATEGORY_SLUG } });
  if (!category) throw new Error(`Kategori yok: ${CATEGORY_SLUG}`);

  const existing = await prisma.product.findMany({
    select: { id: true, sku: true, slug: true, images: true },
  });
  const bySku = new Map(
    existing.flatMap((row) => (row.sku ? [[row.sku, row] as const] : []))
  );
  const usedSlugs = new Set(existing.map((row) => row.slug));

  let created = 0;
  let updated = 0;
  let imageWrites = 0;
  const report: Array<{ sku: string; action: string; slug: string }> = [];

  for (const p of products) {
    const sku = resolveSku(p);
    const price = new Prisma.Decimal(Number(p.sale) || 0);
    const stock = Math.max(0, Number(p.stock) || 0);
    const description = descToHtml(String(p.description || p.title));
    const brand = String(p.brand_name || (p.brand_group === "carlie" ? "L'CARLIE" : "CARINE"));
    const barcode = String(p.primary_barcode || "");
    const specs: Prisma.InputJsonObject = {
      "Ürün Kodu": sku,
      Marka: brand,
      ...(barcode ? { Barkod: barcode } : {}),
    };

    const current = bySku.get(sku);
    if (current) {
      let images = current.images;
      if (FORCE_IMAGES || !images?.length || images[0] === "/placeholder-product.png") {
        if (!DRY_RUN) {
          images = await loadImages(p, current.slug);
          imageWrites += images.length;
        }
      }
      if (!DRY_RUN) {
        await prisma.product.update({
          where: { id: current.id },
          data: {
            name: p.title,
            price,
            stock: stock > 0 ? stock : 1000,
            vatRate: 20,
            shortDescription: shortDesc(p.description || p.title),
            description,
            searchKeywords: [brand, sku, barcode, p.family].filter(Boolean).join(", "),
            images: images?.length ? images : undefined,
            specs,
            isDraft: false,
            categoryId: category.id,
          },
        });
      }
      updated += 1;
      report.push({ sku, action: "update", slug: current.slug });
      continue;
    }

    let slug = slugifyTurkish(p.title) || sku.toLowerCase();
    if (usedSlugs.has(slug)) slug = `${slug}-${sku.toLowerCase()}`;
    usedSlugs.add(slug);

    let images: string[] = [];
    if (!DRY_RUN) {
      images = await loadImages(p, slug);
      imageWrites += images.length;
    }

    if (!DRY_RUN) {
      await prisma.product.create({
        data: {
          name: p.title,
          slug,
          sku,
          price,
          vatRate: 20,
          stock: stock > 0 ? stock : 1000,
          categoryId: category.id,
          shortDescription: shortDesc(p.description || p.title),
          description,
          searchKeywords: [brand, sku, barcode, p.family].filter(Boolean).join(", "),
          images: images.length > 0 ? images : ["/placeholder-product.png"],
          specs,
          isDraft: false,
        },
      });
    }
    created += 1;
    report.push({ sku, action: "create", slug });
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        forceImages: FORCE_IMAGES,
        total: products.length,
        created,
        updated,
        imageWrites,
        sample: report.slice(0, 8),
        createdSkus: report.filter((r) => r.action === "create").map((r) => r.sku),
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
