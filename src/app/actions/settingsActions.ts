"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type {
  HeroSettings,
  StoreContactSettings,
  SeoSettings,
  StoreGeneralSettings,
  DealOfTheDaySettings,
} from "@/lib/settings";

export async function saveHeroSettingsAction(settings: HeroSettings) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gereklidir." };
    }

    await prisma.storeSetting.upsert({
      where: { key: "hero_settings" },
      update: { value: JSON.stringify(settings) },
      create: { key: "hero_settings", value: JSON.stringify(settings) },
    });

    revalidatePath("/");
    revalidatePath("/admin/ayarlar");
    return { success: true, message: "Hero ve vitrin ayarları başarıyla kaydedildi." };
  } catch (error) {
    console.error("Save hero settings error:", error);
    return { error: "Ayarlar kaydedilirken bir hata oluştu." };
  }
}

export async function saveStoreContactAction(settings: StoreContactSettings) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gereklidir." };
    }

    await prisma.storeSetting.upsert({
      where: { key: "store_contact" },
      update: { value: JSON.stringify(settings) },
      create: { key: "store_contact", value: JSON.stringify(settings) },
    });

    revalidatePath("/");
    revalidatePath("/iletisim");
    revalidatePath("/admin/ayarlar");
    return { success: true, message: "İletişim ve mağaza ayarları başarıyla kaydedildi." };
  } catch (error) {
    console.error("Save contact settings error:", error);
    return { error: "İletişim ayarları kaydedilirken hata oluştu." };
  }
}

export async function saveSeoSettingsAction(settings: SeoSettings) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gereklidir." };
    }

    await prisma.storeSetting.upsert({
      where: { key: "seo_settings" },
      update: { value: JSON.stringify(settings) },
      create: { key: "seo_settings", value: JSON.stringify(settings) },
    });

    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin/ayarlar");
    return { success: true, message: "SEO ve meta ayarları başarıyla kaydedildi." };
  } catch (error) {
    console.error("Save SEO settings error:", error);
    return { error: "SEO ayarları kaydedilirken hata oluştu." };
  }
}

export async function saveGeneralSettingsAction(settings: StoreGeneralSettings) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gereklidir." };
    }

    await prisma.storeSetting.upsert({
      where: { key: "general_settings" },
      update: { value: JSON.stringify(settings) },
      create: { key: "general_settings", value: JSON.stringify(settings) },
    });

    revalidatePath("/");
    revalidatePath("/urunler");
    revalidatePath("/admin/ayarlar");
    return { success: true, message: "Genel mağaza ve KDV ayarları başarıyla kaydedildi." };
  } catch (error) {
    console.error("Save general settings error:", error);
    return { error: "Genel ayarlar kaydedilirken hata oluştu." };
  }
}

const dealOfTheDaySchema = z.object({
  isActive: z.boolean(),
  productId: z.string().optional().default(""),
  badgeText: z.string().default("Günün Fırsatı • Sınırlı Stok"),
  title: z.string().min(1, "Kampanya başlığı zorunludur."),
  description: z.string().default(""),
  originalPrice: z.number().nonnegative(),
  dealPrice: z.number().nonnegative(),
  discountPercentage: z.number().min(0).max(100),
  link: z.string().min(1, "Ürün bağlantısı zorunludur."),
  image: z.string().default(""),
  countdownHours: z.number().min(1).default(24),
});

export async function saveDealOfTheDayAction(data: DealOfTheDaySettings) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Bu işlem için admin yetkisi gereklidir." };
    }

    const parsed = dealOfTheDaySchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "Geçersiz form verisi." };
    }

    await prisma.storeSetting.upsert({
      where: { key: "deal_of_the_day" },
      update: { value: JSON.stringify(parsed.data) },
      create: { key: "deal_of_the_day", value: JSON.stringify(parsed.data) },
    });

    revalidatePath("/");
    revalidatePath("/admin/ayarlar");
    return { success: true, message: "Günün Fırsatı ayarları başarıyla kaydedildi." };
  } catch (error) {
    console.error("Save deal of the day error:", error);
    return { error: "Günün Fırsatı ayarları kaydedilirken hata oluştu." };
  }
}

