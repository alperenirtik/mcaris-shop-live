import { NextResponse } from"next/server";
import { prisma } from"@/lib/db";
import { PRODUCT_INCLUDE, serializeProduct } from"@/lib/products";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isDraft: false,
      },
      include: PRODUCT_INCLUDE,
    });

    const serialized = products.map(serializeProduct);
    return NextResponse.json({ items: serialized });
  } catch (error) {
    console.error("Favoriler yüklenirken hata:", error);
    return NextResponse.json({ items: [], error:"Favoriler yüklenemedi" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids") ||"";
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isDraft: false,
      },
      include: PRODUCT_INCLUDE,
    });

    const serialized = products.map(serializeProduct);
    return NextResponse.json({ items: serialized });
  } catch (error) {
    console.error("Favoriler yüklenirken hata:", error);
    return NextResponse.json({ items: [], error:"Favoriler yüklenemedi" }, { status: 500 });
  }
}
