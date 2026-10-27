/**
 * MCaris Shop - Merkezi URL & Dosya Adı Sanitizer Motoru
 * Kling Digital standartlarında %100 temiz, güvenli ve SEO uyumlu URL/dosya isimleri üretir.
 */

export function sanitizeTurkishText(input: string): string {
  if (!input) return "";

  let text = input.toString();

  // URL decode if percent-encoded
  try {
    text = decodeURIComponent(text);
  } catch {
    // Keep raw if malformed
  }

  return text
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .replace(/Ğ/g, "g")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/ş/g, "s")
    .replace(/Ö/g, "o")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/ç/g, "c")
    .toLowerCase()
    .trim();
}

/**
 * URL Slug Sanitizer: Özel karakterleri, boşlukları ve ardışık tireleri temizler
 */
export function sanitizeSlug(input: string): string {
  const processed = sanitizeTurkishText(input);
  return processed
    .replace(/[^a-z0-9\s-]/g, "") // Sadece alfanumerik, boşluk ve tire
    .replace(/\s+/g, "-")         // Boşlukları tek tireye çevir
    .replace(/-+/g, "-")          // Ardışık tireleri tek tireye indir
    .replace(/^-+|-+$/g, "");     // Baş ve sondaki tireleri kaldır
}

/**
 * Görsel Dosya Adı Sanitizer: Uzantıyı koruyarak dosya adını temizler
 */
export function sanitizeImageFilename(filename: string): { cleanName: string; ext: string; baseSlug: string } {
  let raw = (filename || "").trim();
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // continue
  }

  // Sadece dosya adını al (dizin yolunu temizle)
  const baseFile = raw.split("/").pop()?.split("\\").pop() || "";
  
  // Uzantıyı ayır
  const lastDot = baseFile.lastIndexOf(".");
  let ext = ".webp";
  let nameWithoutExt = baseFile;

  if (lastDot > 0) {
    ext = baseFile.slice(lastDot).toLowerCase();
    nameWithoutExt = baseFile.slice(0, lastDot);
  }

  // Geçerli görsel uzantı kontrolü
  if (![".webp", ".jpg", ".jpeg", ".png", ".svg", ".avif"].includes(ext)) {
    ext = ".webp";
  }

  const baseSlug = sanitizeSlug(nameWithoutExt);
  const cleanName = `${baseSlug}${ext}`;

  return { cleanName, ext, baseSlug };
}
