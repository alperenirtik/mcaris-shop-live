/**
 * probed-products.xml → src/data/probed-skus.json
 * UI'da "Stokta Var / Hızlı Sevk" gizleme listesi için.
 */
import fs from "fs/promises";
import path from "path";
import { formatProductCode } from "../src/lib/productCode";

const XML_PATH =
  process.env.PROBED_XML ||
  "/private/var/www/mcaris-yonetim/probed/output/probed-products.xml";
const OUT = path.join(__dirname, "../src/data/probed-skus.json");

async function main() {
  const xml = await fs.readFile(XML_PATH, "utf8");
  const skus = [
    ...xml.matchAll(/<sku>([^<]+)<\/sku>/g),
  ].map((m) => formatProductCode(m[1].trim()));
  const unique = [...new Set(skus.filter(Boolean))].sort();
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(unique, null, 2) + "\n", "utf8");
  console.log(`wrote ${unique.length} skus → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
