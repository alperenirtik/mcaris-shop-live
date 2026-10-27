import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { formatProductCode } from "../src/lib/productCode";

const XML_PATH =
  process.env.PROBED_XML ||
  "/private/var/www/mcaris-yonetim/probed/output/probed-products.xml";
const STOCK = Number(process.env.PROBED_STOCK || 10);
const DRY = process.env.DRY_RUN === "1";

async function main() {
  const xml = fs.readFileSync(XML_PATH, "utf8");
  const skus = [
    ...new Set(
      [...xml.matchAll(/<sku>([^<]+)<\/sku>/g)].map((m) =>
        formatProductCode(m[1].trim())
      )
    ),
  ].filter(Boolean);

  const p = new PrismaClient();
  const before = await p.product.findMany({
    where: { sku: { in: skus } },
    select: { id: true, sku: true, stock: true },
  });
  const need = before.filter((r) => (r.stock ?? 0) !== STOCK);
  console.log(
    JSON.stringify(
      {
        xmlSkus: skus.length,
        foundInDb: before.length,
        needUpdate: need.length,
        stock0: before.filter((r) => (r.stock ?? 0) <= 0).length,
        dryRun: DRY,
        targetStock: STOCK,
      },
      null,
      2
    )
  );

  if (!DRY && need.length) {
    const res = await p.product.updateMany({
      where: { sku: { in: need.map((r) => r.sku!).filter(Boolean) } },
      data: { stock: STOCK },
    });
    console.log("updated", res.count);
  }

  // also write probed-skus.json for UI
  const out = path.join(__dirname, "../src/data/probed-skus.json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(skus.sort(), null, 2) + "\n");
  console.log("wrote", out, skus.length);

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
