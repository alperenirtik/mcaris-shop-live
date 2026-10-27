import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sanitizeImageFilename } from "@/lib/urlSanitizer";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const { cleanName, ext } = sanitizeImageFilename(filename);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  const exactFilePath = path.join(uploadDir, cleanName);

  // 1. Dosya diskte tam temiz adıyla varsa doğrudan 200 OK ile sun
  if (fs.existsSync(exactFilePath)) {
    try {
      const fileBuffer = fs.readFileSync(exactFilePath);
      let contentType = "image/webp";
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".svg") contentType = "image/svg+xml";
      else if (ext === ".avif") contentType = "image/avif";

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Hata durumunda devam et
    }
  }

  // Eksik dosyaya başka bir ürünün fotoğrafı yazılmaz. Yer tutucu gösterilir.
  const placeholderPath = path.join(process.cwd(), "public", "placeholder-product.png");
  if (fs.existsSync(placeholderPath)) {
    const fileBuffer = fs.readFileSync(placeholderPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  return new NextResponse("Image not found", { status: 404 });
}
