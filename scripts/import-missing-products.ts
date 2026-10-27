/**
 * Shop'ta olmayan ürünleri aktar (clone-güvenli):
 * - Mobilite (10)
 * - NFC (6)
 * - MC-1010 (2)
 * - Buz aküsü MC-DLD / MC-KLT baz (18) — KA/UK yok
 * - Buz jeli MCARIS-JEL* (9)
 *
 * npx tsx scripts/import-missing-products.ts
 * DRY_RUN=1 npx tsx scripts/import-missing-products.ts
 */
import { Prisma, PrismaClient } from "@prisma/client";
import { execFileSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { slugifyTurkish } from "../src/lib/categories";
import { formatProductCode } from "../src/lib/productCode";
import { optimizeAndSaveImage } from "../src/lib/image-optimizer";

const DRY_RUN = process.env.DRY_RUN === "1";
const prisma = new PrismaClient();

const MOBILITE_CATALOG =
  "/private/var/www/mcaris-yonetim/Mobilite ve Hasta Bakım Ürünleri/sync-catalog.json";
const MOBILITE_ROOT = "/private/var/www/mcaris-yonetim/Mobilite ve Hasta Bakım Ürünleri";
const NFC_CATALOG = "/private/var/www/mcaris-yonetim/dijital-cart/sync-catalog.json";
const NFC_ROOT = "/private/var/www/mcaris-yonetim/dijital-cart";

type Incoming = {
  sku: string;
  title: string;
  description: string;
  sale: number;
  stock: number;
  vatRate: number;
  categorySlug: string;
  categoryName: string;
  brand: string;
  barcode?: string;
  specs?: Record<string, string>;
  imageLocals?: string[];
  imageLocalRoot?: string;
  imageUrls?: string[];
  source: string;
};

function descToHtml(text: string): string {
  const normalized = text.trim().replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (!normalized) return "<p></p>";
  if (/<[a-z][\s\S]*>/i.test(normalized)) return normalized;
  const parts = normalized.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return parts
    .map(
      (para) =>
        `<p>${para
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/\n/g, "<br/>")}</p>`
    )
    .join("\n");
}

function shortDesc(text: string): string {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 220 ? `${plain.slice(0, 217)}…` : plain;
}

async function ensureCategory(slug: string, name: string) {
  let cat = await prisma.category.findUnique({ where: { slug } });
  if (cat) return cat;
  cat = await prisma.category.create({
    data: {
      name,
      slug,
      metaTitle: `${name} | MCaris`,
      metaDescription: `MCaris ${name}`,
      h1Title: name,
    },
  });
  console.log("NEW category", slug, cat.id);
  return cat;
}

async function loadLocalImages(locals: string[], root: string, slug: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < locals.length; i += 1) {
    const abs = path.resolve(root, locals[i]);
    try {
      const buffer = await fs.readFile(abs);
      const saved = await optimizeAndSaveImage(buffer, {
        productSlug: slug,
        index: i + 1,
        quality: 85,
        maxWidth: 1600,
      });
      urls.push(saved.url);
    } catch (e) {
      console.warn("IMG local fail", locals[i], e instanceof Error ? e.message : e);
    }
  }
  return urls;
}

async function loadRemoteImages(urlsIn: string[], slug: string): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < urlsIn.length; i += 1) {
    const src = urlsIn[i];
    try {
      const res = await fetch(src, {
        headers: { "User-Agent": "MCarisShopImport/1.0" },
        signal: AbortSignal.timeout(45000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const saved = await optimizeAndSaveImage(buffer, {
        productSlug: slug,
        index: i + 1,
        quality: 85,
        maxWidth: 1600,
      });
      urls.push(saved.url);
    } catch (e) {
      console.warn("IMG remote fail", src, e instanceof Error ? e.message : e);
    }
  }
  return urls;
}

function pazarRows(sqlLike: string): Array<{
  sku: string;
  title: string;
  price: string;
  images: string;
  description: string;
  category: string;
  stock: number;
  desi: number | null;
}> {
  const php = `
require "/private/var/www/mcaris-yonetim/pazar_yeri_entegre/app/bootstrap.php";
$pdo = Database::pdo();
$rows = $pdo->query(${JSON.stringify(sqlLike)})->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows, JSON_UNESCAPED_UNICODE);
`;
  const raw = execFileSync("php", ["-r", php], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(raw);
}

async function collectIncoming(): Promise<Incoming[]> {
  const out: Incoming[] = [];

  const mob = JSON.parse(await fs.readFile(MOBILITE_CATALOG, "utf8")) as {
    products: Array<{
      mc_sku: string;
      title: string;
      description?: string;
      description_html?: string;
      sale: number;
      stock?: number;
      vat_rate?: number;
      brand_name?: string;
      primary_barcode?: string;
      images_local?: string[];
      group?: string;
      color?: string;
      category?: string;
    }>;
  };
  for (const p of mob.products) {
    out.push({
      sku: formatProductCode(p.mc_sku),
      title: p.title,
      description: p.description_html || p.description || p.title,
      sale: Number(p.sale) || 0,
      stock: Math.max(10, Number(p.stock) || 100),
      vatRate: Number(p.vat_rate) || 10,
      categorySlug: "mobilite-ve-destek-urunleri",
      categoryName: "Mobilite ve Destek Ürünleri",
      brand: p.brand_name || "MCARIS",
      barcode: p.primary_barcode || p.mc_sku,
      specs: {
        "Ürün Kodu": formatProductCode(p.mc_sku),
        Marka: p.brand_name || "MCARIS",
        ...(p.color ? { Renk: p.color } : {}),
        ...(p.group ? { Grup: p.group } : {}),
        ...(p.category ? { Tip: p.category } : {}),
      },
      imageLocals: p.images_local || [],
      imageLocalRoot: MOBILITE_ROOT,
      source: "mobilite",
    });
  }

  const nfc = JSON.parse(await fs.readFile(NFC_CATALOG, "utf8")) as {
    products: Array<{
      mc_sku: string;
      title: string;
      description?: string;
      description_html?: string;
      sale: number;
      stock?: number;
      vat_rate?: number;
      brand_name?: string;
      primary_barcode?: string;
      images_local?: string[];
      color?: string;
    }>;
  };
  for (const p of nfc.products) {
    out.push({
      sku: formatProductCode(p.mc_sku),
      title: p.title,
      description: p.description_html || p.description || p.title,
      sale: Number(p.sale) || 0,
      stock: Math.max(10, Number(p.stock) || 100),
      vatRate: Number(p.vat_rate) || 20,
      categorySlug: "dijital-urunler",
      categoryName: "Dijital Ürünler",
      brand: p.brand_name || "MCARIS",
      barcode: p.primary_barcode || p.mc_sku,
      specs: {
        "Ürün Kodu": formatProductCode(p.mc_sku),
        Marka: p.brand_name || "MCARIS",
      },
      imageLocals: p.images_local || [],
      imageLocalRoot: NFC_ROOT,
      source: "nfc",
    });
  }

  const mc1010 = pazarRows(
    `SELECT sku,title,price,images,description,category,stock,desi FROM products WHERE sku IN ('MC-1010-SIYAH','MC-1010-EKOSE')`
  );
  for (const r of mc1010) {
    const images = JSON.parse(r.images || "[]") as string[];
    out.push({
      sku: formatProductCode(r.sku),
      title: r.title,
      description: r.description || r.title,
      sale: Number(r.price) || 4499,
      stock: Math.max(10, Number(r.stock) || 50),
      vatRate: 20,
      categorySlug: "tabure-ve-sandalyeler",
      categoryName: "Tabure ve Sandalyeler",
      brand: "MCARIS",
      barcode: r.sku,
      specs: { "Ürün Kodu": formatProductCode(r.sku), Marka: "MCARIS", Model: "MC-1010" },
      imageUrls: images,
      source: "mc-1010",
    });
  }

  const buzAku = pazarRows(
    `SELECT sku,title,price,images,description,category,stock,desi FROM products
     WHERE (sku LIKE 'MC-DLD-%' OR sku LIKE 'MC-KLT-%')
       AND sku NOT LIKE '%-KA' AND sku NOT LIKE '%-UK'
     ORDER BY sku`
  );
  for (const r of buzAku) {
    const images = JSON.parse(r.images || "[]") as string[];
    out.push({
      sku: formatProductCode(r.sku),
      title: r.title,
      description: r.description || r.title,
      sale: Number(r.price) || 0,
      stock: Math.max(10, Number(r.stock) || 100),
      vatRate: 20,
      categorySlug: "buz-akuleri-ve-sogutucular",
      categoryName: "Buz Aküleri ve Soğutucular",
      brand: "MCARIS",
      barcode: r.sku,
      specs: {
        "Ürün Kodu": formatProductCode(r.sku),
        Marka: "MCARIS",
        ...(r.desi ? { Desi: String(r.desi) } : {}),
      },
      imageUrls: images,
      source: "buz-aku",
    });
  }

  // Buz jeli — Woo feed
  const jelXml = await (
    await fetch("https://buzakusuimalati.com/feed/urunler/", {
      headers: { "User-Agent": "MCarisShopImport/1.0" },
    })
  ).text();
  const jelCodes = [
    "MCARIS-JEL1",
    "MCARIS-JEL2",
    "MCARIS-JEL3",
    "MCARIS-JEL4",
    "MCARIS-JEL5",
    "MCARIS-JEL10",
    "MCARIS-JEL20",
    "MCARIS-JEL50",
    "MCARIS-JEL100",
  ];
  // parse with regex to avoid new dep
  for (const code of jelCodes) {
    const block = jelXml.split("<product>").find((chunk) => chunk.includes(`>${code}<`));
    if (!block) {
      console.warn("JEL missing in feed", code);
      continue;
    }
    const grab = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].trim() : "";
    };
    const images: string[] = [];
    const imgBlock = block.match(/<images>([\s\S]*?)<\/images>/);
    if (imgBlock) {
      for (const m of imgBlock[1].matchAll(/<image>([\s\S]*?)<\/image>/g)) {
        const u = m[1].trim();
        if (u) images.push(u);
      }
    }
    out.push({
      sku: formatProductCode(code),
      title: grab("title") || code,
      description: grab("description") || grab("title") || code,
      sale: Number(grab("salePrice") || grab("listPrice") || 0),
      stock: 100,
      vatRate: 20,
      categorySlug: "buz-akuleri-ve-sogutucular",
      categoryName: "Buz Aküleri ve Soğutucular",
      brand: "MCARIS",
      barcode: code,
      specs: { "Ürün Kodu": formatProductCode(code), Marka: "MCARIS", Tip: "Buz Jeli" },
      imageUrls: images,
      source: "buz-jel",
    });
  }

  return out;
}

async function uniqueSlug(base: string, used: Set<string>) {
  let slug = base || "urun";
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  used.add(slug);
  return slug;
}

async function main() {
  const incoming = await collectIncoming();
  const existing = await prisma.product.findMany({ select: { id: true, sku: true, slug: true } });
  const bySku = new Map(
    existing.flatMap((row) => (row.sku ? [[row.sku.toUpperCase(), row] as const] : []))
  );
  const usedSlugs = new Set(existing.map((r) => r.slug));

  const created: string[] = [];
  const skipped: string[] = [];
  let imageWrites = 0;

  for (const item of incoming) {
    const sku = item.sku;
    if (!sku) continue;
    if (bySku.has(sku.toUpperCase())) {
      skipped.push(sku);
      continue;
    }

    const category = await ensureCategory(item.categorySlug, item.categoryName);
    const slug = await uniqueSlug(slugifyTurkish(item.title) || sku.toLowerCase(), usedSlugs);
    let images: string[] = [];

    if (!DRY_RUN) {
      if (item.imageLocals?.length && item.imageLocalRoot) {
        images = await loadLocalImages(item.imageLocals, item.imageLocalRoot, slug);
      } else if (item.imageUrls?.length) {
        images = await loadRemoteImages(item.imageUrls, slug);
      }
      imageWrites += images.length;

      await prisma.product.create({
        data: {
          name: item.title.slice(0, 220),
          slug,
          sku,
          price: new Prisma.Decimal(item.sale),
          vatRate: item.vatRate,
          stock: item.stock,
          categoryId: category.id,
          shortDescription: shortDesc(item.description || item.title),
          description: descToHtml(item.description || item.title),
          searchKeywords: [item.brand, sku, item.barcode, item.source].filter(Boolean).join(", "),
          images: images.length > 0 ? images : ["/placeholder-product.png"],
          specs: (item.specs || { "Ürün Kodu": sku, Marka: item.brand }) as Prisma.InputJsonValue,
          isDraft: false,
        },
      });
    }

    created.push(sku);
    bySku.set(sku.toUpperCase(), { id: "new", sku, slug });
    console.log(DRY_RUN ? "WOULD CREATE" : "CREATED", sku, item.source, item.sale);
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        incoming: incoming.length,
        created: created.length,
        skippedExisting: skipped.length,
        imageWrites,
        createdSkus: created,
        skippedSkus: skipped,
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
