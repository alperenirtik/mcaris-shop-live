import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { mkdir } from "fs/promises";
import path from "path";
import { optimizeAndSaveImage } from "@/lib/image-optimizer";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    // Support both single 'file' and multiple 'files' field names
    const rawEntries = [
      ...formData.getAll("files"),
      ...formData.getAll("file"),
    ];

    const fileEntries: File[] = [];
    for (const entry of rawEntries) {
      if (entry && typeof entry === "object" && "name" in entry && "size" in entry) {
        const f = entry as File;
        if (f.name && f.size > 0) {
          fileEntries.push(f);
        }
      }
    }

    if (fileEntries.length === 0) {
      return NextResponse.json({ error: "Hiçbir dosya seçilmedi veya sürüklenmedi." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    const productSlug = (formData.get("productSlug") || formData.get("slug") || formData.get("name") || "").toString().trim();
    const cleanPrefix = productSlug
      ? productSlug
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "";

    for (let index = 0; index < fileEntries.length; index++) {
      const file = fileEntries[index];
      const ext = (path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`).toLowerCase();

      const isMimeAllowed = ALLOWED_MIME_TYPES.indexOf(file.type) !== -1;
      const isExtAllowed = ALLOWED_EXTENSIONS.indexOf(ext) !== -1;

      if (!isMimeAllowed || !isExtAllowed) {
        return NextResponse.json(
          { error: `'${file.name}' dosyası desteklenmeyen bir formatta. (PNG, JPG, WEBP desteklenir)` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `'${file.name}' dosyası 10MB sınırını aşıyor.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const baseName = path.basename(file.name, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const semanticPrefix = cleanPrefix || baseName || "mcaris-medikal";

      const optimized = await optimizeAndSaveImage(buffer, {
        productSlug: semanticPrefix,
        index: index + 1,
        destinationDir: uploadDir,
        quality: 85,
        maxWidth: 2560,
      });

      uploadedUrls.push(optimized.url);
    }

    return NextResponse.json({
      url: uploadedUrls[0],
      urls: uploadedUrls,
      success: true,
    });

  } catch (err: unknown) {
    console.error("Upload error:", err);
    return NextResponse.json({ error:"Görsel yüklenirken sunucu hatası oluştu." }, { status: 500 });
  }
}