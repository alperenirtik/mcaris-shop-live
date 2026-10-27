import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PRODUCT_INCLUDE, serializeProduct, buildSearchWhereClauses, detectSearchIntent } from "@/lib/products";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], totalCount: 0 });
    }

    const andClauses = buildSearchWhereClauses(query);
    const intent = detectSearchIntent(query);

    const whereClause: Prisma.ProductWhereInput = {
      isDraft: false,
      ...(andClauses.length > 0 ? { AND: andClauses } : {}),
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: PRODUCT_INCLUDE,
        take: 8,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const serialized = products.map((p) => {
      const sp = serializeProduct(p);
      return {
        id: sp.id,
        name: sp.name,
        slug: sp.slug,
        price: sp.price,
        images: sp.images,
        series: sp.series,
        categoryName: sp.category?.name || "Medikal Ekipman",
        sku: sp.sku || null,
      };
    });

    return NextResponse.json({
      products: serialized,
      totalCount,
      intent: {
        title: intent.title,
        subtitle: intent.subtitle,
        badge: intent.badge,
        matchedCategorySlug: intent.matchedCategorySlug,
        matchedCategoryName: intent.matchedCategoryName,
        quickFilters: intent.quickFilters,
      },
    });
  } catch (error) {
    console.error("[Search API Error]:", error);
    return NextResponse.json(
      { products: [], totalCount: 0, error: "Arama sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

