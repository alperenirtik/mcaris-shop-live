"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleReviewApprovalAction(id: string, currentStatus: boolean) {
  await requireAdmin();

  if (!id) {
    return { error: "Yorum ID gereklidir." };
  }

  try {
    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: !currentStatus },
      include: { product: { select: { slug: true } } },
    });

    revalidatePath("/admin/yorumlar");
    if (updated.product?.slug) {
      revalidatePath(`/urun/${updated.product.slug}`);
    }
    revalidatePath("/urunler");

    return {
      success: true,
      message: updated.isApproved ? "Yorum yayına alındı." : "Yorum yayından kaldırıldı.",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Yorum durumu güncellenirken hata oluştu.";
    return { error: msg };
  }
}

export async function deleteReviewAction(id: string) {
  await requireAdmin();

  if (!id) {
    return { error: "Yorum ID gereklidir." };
  }

  try {
    const deleted = await prisma.review.delete({
      where: { id },
      include: { product: { select: { slug: true } } },
    });

    revalidatePath("/admin/yorumlar");
    if (deleted.product?.slug) {
      revalidatePath(`/urun/${deleted.product.slug}`);
    }
    revalidatePath("/urunler");

    return { success: true, message: "Yorum başarıyla silindi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Yorum silinirken hata oluştu.";
    return { error: msg };
  }
}
