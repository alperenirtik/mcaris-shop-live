/**
 * images-1/{SKU}/1.png…6.png → Shop ürün görselleri (WebP + Prisma)
 *
 * Klasör adları ürün kodu (MCECO2100, MT2001, MCECON…).
 *
 * DRY_RUN=1 npx tsx scripts/_update-yatak-images-from-images1.ts
 * npx tsx scripts/_update-yatak-images-from-images1.ts
 * ONLY=MC-ECO2100,MT2001 npx tsx scripts/_update-yatak-images-from-images1.ts
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { optimizeAndSaveImage } from "../src/lib/image-optimizer";

const IMAGES_ROOT =
  process.env.IMAGES_ROOT || "/private/var/www/mcaris-yonetim/images-1";
const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY = new Set(
  (process.env.ONLY || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
);

const prisma = new PrismaClient();

/** images-1 klasör adı → olası shop SKU listesi (öncelik sırası) */
function folderToSkuCandidates(folder: string): string[] {
  const f = folder.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (f.startsWith("MT")) return [f, `MT-${f.slice(2)}`];
  if (f === "MCECON") return ["MC-ECON", "MCECON"];
  if (f === "MCREGIA") return ["MC-REGIA", "MCREGIA"];
  if (f === "MCDALI") return ["MC-DALI", "MCDALI"];
  // MCECO2100 → MC-ECO2100; ayrıca MC-ECO2110 aynı görsel seti kullanabilir
  if (f.startsWith("MC")) {
    const withDash = f.replace(/^MC/, "MC-");
    const out = [withDash, f];
    if (f === "MCECO2100") out.push("MC-ECO2110", "MCECO2110");
    return out;
  }
  return [f];
}

async function listNumberedPngs(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir);
  const files = entries
    .filter((n) => /^\d+\.png$/i.test(n))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  return files.map((n) => path.join(dir, n));
}

async function main() {
  const folders = (await fs.readdir(IMAGES_ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  console.log(`images-1 klasör: ${folders.length} | DRY_RUN=${DRY_RUN ? "1" : "0"}`);

  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const folder of folders) {
    const candidates = folderToSkuCandidates(folder);
    if (ONLY.size > 0) {
      const hit = candidates.some((c) => ONLY.has(c.toUpperCase()) || ONLY.has(folder.toUpperCase()));
      if (!hit) continue;
    }

    const absDir = path.join(IMAGES_ROOT, folder);
    const pngs = await listNumberedPngs(absDir);
    if (pngs.length === 0) {
      console.warn(`SKIP ${folder}: png yok`);
      skip++;
      continue;
    }

    let product = null as Awaited<ReturnType<typeof prisma.product.findFirst>>;
    let matchedSku = "";
    for (const sku of candidates) {
      product = await prisma.product.findFirst({
        where: { sku: { equals: sku, mode: "insensitive" } },
        select: { id: true, sku: true, slug: true, name: true, images: true },
      });
      if (product) {
        matchedSku = product.sku || sku;
        break;
      }
    }

    if (!product) {
      console.warn(`SKIP ${folder}: shop ürün yok (denenen: ${candidates.join(", ")})`);
      skip++;
      continue;
    }

    console.log(
      `\n→ ${folder} → ${matchedSku} | ${pngs.length} png | slug=${product.slug} | eski=${(product.images || []).length} görsel`
    );

    if (DRY_RUN) {
      for (const p of pngs) console.log(`  would use ${path.basename(p)}`);
      ok++;
      continue;
    }

    try {
      const urls: string[] = [];
      for (let i = 0; i < pngs.length; i++) {
        const buffer = await fs.readFile(pngs[i]);
        const saved = await optimizeAndSaveImage(buffer, {
          productSlug: product.slug,
          index: i + 1,
          quality: 85,
          maxWidth: 1600,
        });
        urls.push(saved.url);
        console.log(`  ${path.basename(pngs[i])} → ${saved.url} (${saved.width}x${saved.height}, -${saved.savedPercent}%)`);
      }
      await prisma.product.update({
        where: { id: product.id },
        data: { images: urls },
      });
      // Aynı görsel setini MC-ECO2110 gibi kardeş SKU’ya da uygula (yalnızca ECO2100 klasörü)
      if (folder.toUpperCase() === "MCECO2100") {
        const sibling = await prisma.product.findFirst({
          where: {
            sku: { equals: "MC-ECO2110", mode: "insensitive" },
            NOT: { id: product.id },
          },
          select: { id: true, sku: true, slug: true },
        });
        if (sibling) {
          const sibUrls: string[] = [];
          for (let i = 0; i < pngs.length; i++) {
            const buffer = await fs.readFile(pngs[i]);
            const saved = await optimizeAndSaveImage(buffer, {
              productSlug: sibling.slug,
              index: i + 1,
              quality: 85,
              maxWidth: 1600,
            });
            sibUrls.push(saved.url);
          }
          await prisma.product.update({
            where: { id: sibling.id },
            data: { images: sibUrls },
          });
          console.log(`  + sibling ${sibling.sku} güncellendi (${sibUrls.length})`);
        }
      }
      console.log(`OK ${matchedSku} ${urls.length} görsel`);
      ok++;
    } catch (e) {
      fail++;
      console.error(`FAIL ${folder}/${matchedSku}`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`\nBitti ok=${ok} skip=${skip} fail=${fail}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
