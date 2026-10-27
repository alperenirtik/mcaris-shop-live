import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export interface MediaFileInfo {
  name: string;
  url: string;
  size: number;
  folder?: string;
  modified?: string;
  createdAt: string;
  isAssigned: boolean;
  productCount?: number;
  assignedProducts: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export type MediaItem = MediaFileInfo;

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || searchParams.get("q") || "").toLowerCase().trim();
    const filter = searchParams.get("filter") || searchParams.get("folder") || "all";

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await fs.mkdir(uploadDir, { recursive: true });

    const files = await fs.readdir(uploadDir);
    const products = await prisma.product.findMany({
      select: { id: true, name: true, slug: true, images: true },
    });

    const fileProductMap = new Map<string, { id: string; name: string; slug: string }[]>();

    for (const p of products) {
      for (const img of p.images || []) {
        const base = path.basename(img);
        const existing = fileProductMap.get(base) || [];
        existing.push({ id: p.id, name: p.name, slug: p.slug });
        fileProductMap.set(base, existing);
      }
    }

    const items: MediaFileInfo[] = [];

    for (const file of files) {
      if (file.startsWith(".")) continue;

      const fullPath = path.join(uploadDir, file);
      try {
        const stat = await fs.stat(fullPath);
        if (!stat.isFile()) continue;

        const assigned = fileProductMap.get(file) || [];
        const isAssigned = assigned.length > 0;

        if (filter === "assigned" && !isAssigned) continue;
        if (filter === "unassigned" && isAssigned) continue;

        if (search) {
          const matchName = file.toLowerCase().includes(search);
          const matchProduct = assigned.some(
            (p) => p.name.toLowerCase().includes(search) || p.slug.toLowerCase().includes(search)
          );
          if (!matchName && !matchProduct) continue;
        }

        items.push({
          name: file,
          url: `/uploads/products/${file}`,
          size: stat.size,
          folder: "products",
          modified: stat.mtime.toISOString(),
          createdAt: stat.birthtime.toISOString(),
          isAssigned,
          productCount: assigned.length,
          assignedProducts: assigned,
        });
      } catch {
        // Skip unreadable files
      }
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      total: items.length,
      files: items,
      items,
    });
  } catch (error) {
    console.error("Media GET Error:", error);
    return NextResponse.json({ error: "Medya dosyaları yüklenirken hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    let filename = "";
    const { searchParams } = new URL(request.url);
    filename = searchParams.get("filename") || searchParams.get("url") || "";

    if (!filename) {
      try {
        const body = await request.json();
        filename = body.filename || body.url || "";
      } catch {
        // Ignore json parse error
      }
    }

    if (!filename) {
      return NextResponse.json({ error: "Dosya adı belirtilmedi." }, { status: 400 });
    }

    const cleanName = path.basename(filename);
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    const filePath = path.join(uploadDir, cleanName);

    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }

    const targetUrl = `/uploads/products/${cleanName}`;
    const productsWithImage = await prisma.product.findMany({
      where: {
        images: {
          has: targetUrl,
        },
      },
    });

    for (const p of productsWithImage) {
      const updatedImages = (p.images || []).filter((img) => img !== targetUrl);
      await prisma.product.update({
        where: { id: p.id },
        data: { images: updatedImages },
      });
    }

    revalidatePath("/", "layout");
    revalidatePath("/urunler");
    revalidatePath("/admin/urunler");
    revalidatePath("/admin/medya");

    return NextResponse.json({
      success: true,
      message: `'${cleanName}' başarıyla silindi ve ürün bağlantıları temizlendi.`,
    });
  } catch (error) {
    console.error("Media DELETE Error:", error);
    return NextResponse.json({ error: "Görsel silinirken hata oluştu." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, imageUrl, action } = body as {
      productId: string;
      imageUrl: string;
      action: "assign" | "unassign" | "set_primary";
    };

    if (!productId || !imageUrl || !action) {
      return NextResponse.json({ error: "Eksik parametreler." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    let images = [...(product.images || [])];

    if (action === "assign") {
      if (!images.includes(imageUrl)) {
        images.push(imageUrl);
      }
    } else if (action === "unassign") {
      images = images.filter((img) => img !== imageUrl);
    } else if (action === "set_primary") {
      images = [imageUrl, ...images.filter((img) => img !== imageUrl)];
    }

    await prisma.product.update({
      where: { id: productId },
      data: { images },
    });

    revalidatePath("/", "layout");
    revalidatePath(`/urun/${product.slug}`);
    revalidatePath("/admin/urunler");
    revalidatePath("/admin/medya");

    return NextResponse.json({
      success: true,
      images,
      message: "Ürün görselleri başarıyla güncellendi.",
    });
  } catch (error) {
    console.error("Media PATCH Error:", error);
    return NextResponse.json({ error: "Görsel bağlantısı güncellenirken hata oluştu." }, { status: 500 });
  }
}
