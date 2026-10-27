import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export interface OptimizationResult {
  filename: string;
  url: string;
  originalSize: number;
  optimizedSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

/**
 * Slug metnini temizler ve semantik dosya adı formatına uygun hale getirir.
 */
export function sanitizeSlugForImage(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

/**
 * Bir görsel buffer'ını WebP formatında optimize eder ve public/uploads/products dizinine kaydeder.
 */
export async function optimizeAndSaveImage(
  inputBuffer: Buffer,
  options: {
    productSlug?: string;
    index?: number;
    destinationDir?: string;
    quality?: number;
    maxWidth?: number;
  } = {}
): Promise<OptimizationResult> {
  const {
    productSlug = "product",
    index = 1,
    destinationDir = path.join(process.cwd(), "public", "uploads", "products"),
    quality = 85,
    maxWidth = 2560,
  } = options;

  await fs.mkdir(destinationDir, { recursive: true });

  const cleanSlug = sanitizeSlugForImage(productSlug);
  const hash = crypto.createHash("md5").update(inputBuffer).digest("hex").slice(0, 4);
  const filename = `${cleanSlug}-${index}-${hash}.webp`;
  const filePath = path.join(destinationDir, filename);

  // Sharp ile optimize et, beyaz/şeffaf kenar boşluklarını kırp & WebP'ye dönüştür
  let pipeline = sharp(inputBuffer).rotate();

  try {
    // Çevredeki gereksiz boşlukları/beyaz alanları otomatik kırp
    pipeline = pipeline.trim({ threshold: 12 });
  } catch {
    // Trim yapılamazsa devam et
  }

  const metadata = await pipeline.metadata();
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  // Dengeli şık bir 16px iç nefes payı ekle
  pipeline = pipeline.extend({
    top: 16,
    bottom: 16,
    left: 16,
    right: 16,
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  });

  const optimizedBuffer = await pipeline
    .webp({ quality, effort: 4 })
    .toBuffer();

  await fs.writeFile(filePath, optimizedBuffer);

  const originalSize = inputBuffer.length;
  const optimizedSize = optimizedBuffer.length;
  const savedPercent = Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100));

  const outMeta = await sharp(optimizedBuffer).metadata();

  return {
    filename,
    url: `/uploads/products/${filename}`,
    originalSize,
    optimizedSize,
    savedPercent,
    width: outMeta.width || 0,
    height: outMeta.height || 0,
  };
}
