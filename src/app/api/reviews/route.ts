import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const ReviewSchema = z.object({
  productId: z.string().min(1, "Ürün ID gereklidir"),
  userName: z.string().min(2, "İsim en az 2 karakter olmalıdır").max(50),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(5, "Yorum en az 5 karakter olmalıdır").max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = ReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Geçersiz form verisi", details: result.error.format() },
        { status: 400 }
      );
    }

    const { productId, userName, rating, title, comment } = result.data;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Değerlendirilen ürün bulunamadı" },
        { status: 404 }
      );
    }

    const user = await getCurrentUser();
    let isVerifiedBuyer = false;

    if (user?.id) {
      const orderItem = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            OR: [
              { userId: user.id },
              { customerEmail: user.email },
            ],
            status: { in: ["paid", "shipped", "completed"] },
          },
        },
      });
      if (orderItem) {
        isVerifiedBuyer = true;
      }
    }

    const newReview = await prisma.review.create({
      data: {
        productId,
        userName,
        rating,
        title: title || null,
        comment,
        verified: isVerifiedBuyer,
        isApproved: isVerifiedBuyer, // Yalnızca ürünü satın almış kullanıcıların yorumları doğrudan yayınlanır
      },
    });

    if (isVerifiedBuyer) {
      revalidatePath(`/urun/${product.slug}`);
      revalidatePath("/urunler");
    }

    return NextResponse.json(
      { success: true, review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Yorum kaydedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId parametresi zorunludur" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { error: "Yorumlar getirilemedi" },
      { status: 500 }
    );
  }
}
