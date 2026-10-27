"use server";

import { prisma } from"@/lib/db";
import { revalidatePath } from"next/cache";

export interface ReviewFormState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function addReviewAction(prevState: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  const productId = (formData.get("productId") as string ||"").trim();
  const userName = (formData.get("userName") as string ||"").trim();
  const ratingStr = (formData.get("rating") as string ||"5").trim();
  const comment = (formData.get("comment") as string ||"").trim();
  const slug = (formData.get("slug") as string ||"").trim();

  if (!productId || !userName || !comment) {
    return { error:"Lütfen adınızı ve yorumunuzu eksiksiz doldurunuz." };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error:"Geçerli bir yıldız puanı seçiniz (1-5)." };
  }

  try {
    await prisma.review.create({
      data: {
        productId,
        userName,
        rating,
        comment,
      },
    });

    if (slug) {
      revalidatePath(`/urun/${slug}`);
    }
    revalidatePath("/urunler");

    return {
      success: true,
      message:"Değerlendirmeniz ve yorumunuz başarıyla eklendi. Teşekkür ederiz!",
    };
  } catch (err: unknown) {
    console.error("Yorum ekleme hatası:", err);
    return { error:"Yorumunuz kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz." };
  }
}

