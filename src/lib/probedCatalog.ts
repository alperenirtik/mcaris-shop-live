import probedSkus from "@/data/probed-skus.json";
import { formatProductCode } from "@/lib/productCode";

const PROBED_SKU_SET = new Set(
  (probedSkus as string[]).map((sku) => formatProductCode(sku).toUpperCase())
);

const PUBLIC_BRAND_NAME = "MCARIS";

/**
 * Probed katalog ürünleri: satılabilir stok tutulur ama "Stokta / Hızlı Sevk"
 * gösterilmez — hazır sevkiyat vaadi ~1 hafta termin ile müşteride ters tepki yaratıyor.
 */
export function isProbedCatalogSku(sku: string | null | undefined): boolean {
  if (!sku) return false;
  const code = formatProductCode(sku).toUpperCase();
  return code !== "" && PROBED_SKU_SET.has(code);
}

function isBrandSpecKey(key: string): boolean {
  const k = key.trim().toLowerCase();
  return k === "marka" || k === "brand" || k === "manufacturer" || k === "üretici" || k === "uretici";
}

function isProbedBrandValue(value: string): boolean {
  return value.trim().toLowerCase() === "probed";
}

/**
 * Vitrinde eski tedarikçi markası "Probed" görünmesin diye Marka alanını MCARIS yapar.
 * Diğer markalar (Burmeier, Carine, L'CARLIE vb.) ve teknik specs aynen kalır.
 */
export function sanitizePublicProductSpecs(
  specs: Record<string, string> | null | undefined
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(specs || {})) {
    const value = typeof raw === "string" ? raw : String(raw ?? "");
    if (isBrandSpecKey(key) && isProbedBrandValue(value)) {
      out[key] = PUBLIC_BRAND_NAME;
      continue;
    }
    out[key] = value;
  }
  return out;
}
