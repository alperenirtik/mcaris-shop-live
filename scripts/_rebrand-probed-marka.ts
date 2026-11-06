/**
 * Hassas marka düzeltmesi: specs.Marka === "Probed" → "MCARIS"
 * Sadece Marka alanını değiştirir; diğer specs / fiyat / stok / açıklama dokunulmaz.
 *
 * Kullanım:
 *   npx tsx scripts/_rebrand-probed-marka.ts           # dry-run
 *   npx tsx scripts/_rebrand-probed-marka.ts --apply    # uygula
 */
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const TARGET = "MCARIS";

function isProbedMarka(value: unknown): boolean {
  return typeof value === "string" && value.trim().toLowerCase() === "probed";
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, sku: true, specs: true },
  });

  const updates: Array<{ id: string; slug: string; sku: string | null }> = [];

  for (const product of products) {
    const specs =
      product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
        ? { ...(product.specs as Record<string, unknown>) }
        : null;
    if (!specs) continue;

    let changed = false;
    for (const key of Object.keys(specs)) {
      if (key.trim().toLowerCase() !== "marka") continue;
      if (!isProbedMarka(specs[key])) continue;
      specs[key] = TARGET;
      changed = true;
    }
    if (!changed) continue;

    updates.push({ id: product.id, slug: product.slug, sku: product.sku });

    if (APPLY) {
      await prisma.product.update({
        where: { id: product.id },
        data: { specs: specs as Prisma.InputJsonValue },
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: APPLY ? "APPLY" : "DRY_RUN",
        matched: updates.length,
        targetBrand: TARGET,
        sampleSlugs: updates.slice(0, 8).map((u) => u.slug),
      },
      null,
      2
    )
  );

  if (!APPLY) {
    console.log("\nDry-run tamam. Uygulamak için: npx tsx scripts/_rebrand-probed-marka.ts --apply");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
