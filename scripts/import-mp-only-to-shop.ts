/**
 * Diğer pazar yerlerinde olup Shop'ta olmayan aktif ürünleri Shop'a ekler.
 *
 *   DRY_RUN=1 npx tsx scripts/import-mp-only-to-shop.ts
 *   npx tsx scripts/import-mp-only-to-shop.ts
 *   SKU=MC-ECO2110 npx tsx scripts/import-mp-only-to-shop.ts
 */
import { Prisma, PrismaClient, Series } from "@prisma/client";
import { execFileSync } from "child_process";
import { slugifyTurkish } from "../src/lib/categories";
import { optimizeAndSaveImage } from "../src/lib/image-optimizer";

const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY_SKU = (process.env.SKU || "").trim().toUpperCase();
const SKIP_KA_UK = process.env.SKIP_KA_UK === "1"; // varsayılan: ekle
const prisma = new PrismaClient();

const CAT = {
  motor2: "cmu4knl0k0001w0eg4l5exsb2",
  wood: "cmupac82m0003w004ow0oq6j6",
  yemek: "cmtop0k4s0001w0jkbv2pu3ju",
  buz: "cmvkp8ina0001scovtodcb6a7",
  digital: "cmvgud4j50000sc3k4gikogas",
  general: "cmt1ca9l70004qm010n693nbz",
  platinum: "cmtwz3i0d0001w0ckk2soouwk",
};

type Incoming = {
  sku: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  vatRate: number;
  images: string[];
  brand: string;
  barcode?: string;
  categoryId: string;
  series?: Series | null;
  isDraft?: boolean;
  specs: Record<string, string>;
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

function categoryFor(sku: string, title: string): string {
  const u = sku.toUpperCase();
  const t = title.toLowerCase();
  if (u.startsWith("MC-DLD-") || u.startsWith("MC-KLT-") || u.startsWith("MCARIS-JEL")) return CAT.buz;
  if (u.includes("QR-MENU")) return CAT.digital;
  if (u === "MC-YM100" || t.includes("yemek masa")) return CAT.yemek;
  if (u.includes("ECO2100")) return CAT.wood;
  if (u.includes("PLUS") || u.includes("DALI") || u.includes("ECON") || u.includes("REGIA"))
    return CAT.platinum;
  if (u.includes("ECO2") || u.includes("INV2200") || u.includes("MT200")) return CAT.motor2;
  return CAT.general;
}

function seriesFor(sku: string): Series | null {
  const u = sku.toUpperCase();
  if (u.includes("PLUS") || u.includes("DALI") || u.includes("ECON") || u.includes("REGIA"))
    return "platinum";
  if (u.includes("INV") || u.includes("MT")) return "gold";
  if (u.includes("ECO")) return "silver";
  return null;
}

function parsePrice(raw: unknown): number {
  if (typeof raw === "number") return raw;
  const s = String(raw ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

type PhpPayload = {
  sku: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  vatRate: number;
  images: string[];
  brand: string;
  barcode: string;
  source: string;
  draft?: boolean;
};

function loadFromPhp(): PhpPayload[] {
  const script =
    "/private/var/www/mcaris-yonetim/seo.mcaris.com.tr/pazar-src/scripts/export_mp_only_for_shop.php";
  const args = [script];
  if (ONLY_SKU) args.push(`sku=${ONLY_SKU}`);
  if (SKIP_KA_UK) args.push("skip_ka_uk=1");
  const raw = execFileSync("php", args, {
    encoding: "utf8",
    maxBuffer: 40 * 1024 * 1024,
  });
  return JSON.parse(raw) as PhpPayload[];
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
      console.warn("IMG fail", src.slice(0, 80), e instanceof Error ? e.message : e);
    }
  }
  return urls;
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
  const payloads = loadFromPhp();
  console.log(`candidates=${payloads.length} dry=${DRY_RUN} only=${ONLY_SKU || "-"}`);

  const existing = await prisma.product.findMany({
    select: { id: true, sku: true, slug: true, isDraft: true },
  });
  const bySku = new Map(
    existing.flatMap((row) => (row.sku ? [[row.sku.toUpperCase(), row] as const] : []))
  );
  const usedSlugs = new Set(existing.map((r) => r.slug));

  const created: string[] = [];
  const skipped: string[] = [];
  const undrafted: string[] = [];

  for (const row of payloads) {
    const sku = row.sku.toUpperCase();
    const hit = bySku.get(sku);
    if (hit) {
      // Feed'de yok ama draft ise canlıya al (QR hariç bilinçli draft'lar: ECON/REGIA kalsın)
      if (hit.isDraft && !row.draft && sku !== "MC-QR-MENU-PRO") {
        if (!DRY_RUN) {
          await prisma.product.update({
            where: { id: hit.id },
            data: {
              isDraft: false,
              stock: Math.max(10, row.stock || 10),
              price: new Prisma.Decimal(row.price > 0 ? row.price : 0),
              name: row.title.slice(0, 220),
            },
          });
        }
        undrafted.push(sku);
        console.log("UNDRAFT", sku, row.price);
        continue;
      }
      skipped.push(sku);
      console.log("SKIP exists", sku, hit.isDraft ? "draft" : "live");
      continue;
    }

    if (row.price <= 0) {
      console.log("SKIP no-price", sku);
      skipped.push(sku);
      continue;
    }

    const incoming: Incoming = {
      sku,
      title: row.title,
      description: row.description || row.title,
      price: row.price,
      stock: Math.max(10, row.stock || 10),
      vatRate: row.vatRate || 20,
      images: row.images || [],
      brand: row.brand || "MCaris",
      barcode: row.barcode || sku,
      categoryId: categoryFor(sku, row.title),
      series: seriesFor(sku),
      isDraft: !!row.draft,
      specs: {
        "Ürün Kodu": sku,
        Marka: row.brand || "MCaris",
        ...(row.barcode ? { Barkod: row.barcode } : {}),
      },
      source: row.source,
    };

    const slug = await uniqueSlug(
      slugifyTurkish(incoming.title) || sku.toLowerCase(),
      usedSlugs
    );

    console.log(
      (DRY_RUN ? "DRY " : "") + "NEW",
      sku,
      incoming.price,
      `stok=${incoming.stock}`,
      `imgs=${incoming.images.length}`,
      incoming.title.slice(0, 55)
    );

    if (DRY_RUN) {
      created.push(sku);
      continue;
    }

    let images: string[] = [];
    if (incoming.images.length) {
      images = await loadRemoteImages(incoming.images.slice(0, 10), slug);
    }
    if (!images.length) {
      // buz KA/UK: base SKU görsellerini kopyala
      const base = sku.replace(/-(KA|UK)$/i, "");
      if (base !== sku) {
        const baseRow = await prisma.product.findFirst({
          where: { sku: base },
          select: { images: true },
        });
        if (baseRow?.images?.length) images = baseRow.images;
      }
    }
    if (!images.length) {
      console.log("SKIP no-image", sku);
      skipped.push(sku);
      continue;
    }

    await prisma.product.create({
      data: {
        name: incoming.title.slice(0, 220),
        slug,
        sku,
        price: new Prisma.Decimal(incoming.price),
        vatRate: incoming.vatRate,
        stock: incoming.stock,
        categoryId: incoming.categoryId,
        series: incoming.series ?? undefined,
        shortDescription: shortDesc(incoming.description),
        description: descToHtml(incoming.description),
        searchKeywords: [incoming.brand, sku, incoming.barcode, incoming.source]
          .filter(Boolean)
          .join(", "),
        images,
        specs: incoming.specs as Prisma.InputJsonValue,
        isDraft: !!incoming.isDraft,
      },
    });
    created.push(sku);
  }

  console.log(
    JSON.stringify({
      created: created.length,
      skipped: skipped.length,
      undrafted: undrafted.length,
      createdSkus: created,
      undraftedSkus: undrafted,
    })
  );
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
