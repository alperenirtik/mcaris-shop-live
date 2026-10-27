/**
 * MCaris Shop - Ürün Kodu (SKU / Product Code) Motoru
 * Kurumsal MCXXXX formatında standart ürün kodları yönetir.
 * Örnekler: ProBed-5311 -> MC5311, 5311 -> MC5311, MC-5311 -> MC5311.
 * Sahte/rastgele hash üretimi tamamen devre dışı bırakılmıştır.
 */

export function extractOrGenerateProductCode(product: {
  id?: string;
  sku?: string | null;
  name?: string;
  slug?: string;
  wcId?: number | null;
  specs?: Record<string, unknown> | null;
}): string {
  // 1. Doğrudan veritabanı `sku` alanı varsa ve doluysa önceliklidir
  if (product.sku && typeof product.sku === "string" && product.sku.trim().length > 0) {
    return formatProductCode(product.sku);
  }

  // 2. Specs içinde açıkça Ürün Kodu / SKU tanımlıysa
  const specs = product.specs as Record<string, string> | null | undefined;
  if (specs && typeof specs === "object") {
    const explicitCode =
      specs["Ürün Kodu"] ||
      specs["Urun Kodu"] ||
      specs["SKU"] ||
      specs["sku"] ||
      specs["code"] ||
      specs["Kod"];
    if (explicitCode && typeof explicitCode === "string" && explicitCode.trim().length > 0) {
      return formatProductCode(explicitCode.trim());
    }
  }

  // 3. Ürün adının içinde açıkça ProBed veya MC kodunu ara (örn: "ProBed-5311", "MC5311", "MC-6017")
  if (product.name) {
    const probedMatch = product.name.match(/\b(?:PRO[-_ ]?BED|PROBED)[-_ ]*([A-Z0-9]+)\b/i);
    if (probedMatch && probedMatch[1]) {
      return formatProductCode(probedMatch[1]);
    }
    const mcMatch = product.name.match(/\b(MC[- ]?[A-Z0-9]+(?:[- ][A-Z0-9]+)?)\b/i);
    if (mcMatch && mcMatch[1]) {
      return formatProductCode(mcMatch[1]);
    }
  }

  // 4. Slug içinde ProBed veya MC kodunu ara
  if (product.slug) {
    const probedSlugMatch = product.slug.match(/(?:pro[-_]?bed)[-_]?([a-z0-9]+)/i);
    if (probedSlugMatch && probedSlugMatch[1]) {
      return formatProductCode(probedSlugMatch[1]);
    }
    const slugMatch = product.slug.match(/^(mc-[a-z0-9]+(?:-[a-z0-9]+)?)/i);
    if (slugMatch && slugMatch[1]) {
      return formatProductCode(slugMatch[1]);
    }
  }

  // 5. Kod bulunamadıysa SAHTE KOD ÜRETME - boş string döndür (Zero Fake Work)
  return "";
}

export function formatProductCode(code: string): string {
  if (!code || typeof code !== "string") return "";
  let cleaned = code.trim().toUpperCase();

  // 1. ProBed-, PRO-BED-, PROBED ön eklerini temizle -> MC- ile birleştir (örn: ProBed-5311 -> MC-5311)
  const isProbed = /^(?:PRO[-_ ]?BED|PROBED)\s*[-_ ]*/i.test(cleaned);
  if (isProbed) {
    cleaned = cleaned.replace(/^(?:PRO[-_ ]?BED|PROBED)\s*[-_ ]*/i, "").trim().replace(/^-+/, "");
    return `MC-${cleaned}`;
  }

  // 2. Eğer saf rakamlardan oluşuyorsa (örn: 5311, 6017, 8576) -> MC- ile birleştir (örn: MC-5311)
  if (/^[0-9]+$/.test(cleaned)) {
    return `MC-${cleaned}`;
  }

  // 3. Carine Medikal Kozmetik serisi kodları (örn: MC-CRN001, mc-crn005, MCCRN001 -> MC-CRNXXX)
  if (/^MC[-_ ]?CRN[-_ ]*([A-Z0-9]+)$/i.test(cleaned)) {
    const suffix = cleaned.replace(/^MC[-_ ]?CRN[-_ ]*/i, "");
    return `MC-CRN${suffix}`;
  }

  let result = cleaned;

  // 4. Başta MC- varsa: ardındaki boşluk ve ekstra tireleri temizle, MC- standardında tut (örn: MC-ECO2200 -> MC-ECO2200)
  if (/^MC[-_ ]+(.+)$/i.test(cleaned)) {
    const rest = cleaned.replace(/^MC[-_ ]+/i, "").trim().replace(/^-+/, "").replace(/\s+/g, "-");
    result = `MC-${rest}`;
  } else if (/^MC([A-Z0-9].*)$/i.test(cleaned)) {
    // 5. Eğer doğrudan MC ile başlıyorsa (örn: MCECO2000, MCDALI, MC5311) -> MC- standardına dönüştür
    const rest = cleaned.slice(2).trim().replace(/^-+/, "").replace(/\s+/g, "-");
    result = `MC-${rest}`;
  }

  // Pazar yerleri (Pazarama, Trendyol vb.) için boşlukları tireye dönüştür
  result = result.replace(/\s+/g, "-");

  // İdefix ve pazar yeri kuralı: Alfanümerik barkod en az 6 karakter olmalıdır (örn: MCYME -> MCYME1)
  const alphanumeric = result.replace(/[^A-Za-z0-9]/g, "");
  if (alphanumeric.length > 0 && alphanumeric.length < 6) {
    const diff = 6 - alphanumeric.length;
    result = `${result}${"1".repeat(diff)}`;
  }

  return result;
}
