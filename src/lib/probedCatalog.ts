import probedSkus from "@/data/probed-skus.json";
import { formatProductCode } from "@/lib/productCode";

const PROBED_SKU_SET = new Set(
  (probedSkus as string[]).map((sku) => formatProductCode(sku).toUpperCase())
);

/**
 * Probed katalog ürünleri: satılabilir stok tutulur ama "Stokta / Hızlı Sevk"
 * gösterilmez — hazır sevkiyat vaadi ~1 hafta termin ile müşteride ters tepki yaratıyor.
 */
export function isProbedCatalogSku(sku: string | null | undefined): boolean {
  if (!sku) return false;
  const code = formatProductCode(sku).toUpperCase();
  return code !== "" && PROBED_SKU_SET.has(code);
}
