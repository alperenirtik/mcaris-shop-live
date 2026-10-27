"use server";

import { prisma } from"@/lib/db";
import { getCurrentUser } from"@/lib/auth";
import { revalidatePath } from"next/cache";
import { Prisma } from"@prisma/client";

export interface FormState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function createCouponAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !=="ADMIN") {
    return { error:"Bu işlem için admin yetkisi gereklidir." };
  }

  const rawCode = (formData.get("code") as string ||"").trim().toUpperCase();
  const type = (formData.get("type") as string ||"percentage").trim();
  const valueStr = (formData.get("value") as string ||"0").trim();
  const minSubtotalStr = (formData.get("minSubtotal") as string ||"").trim();
  const description = (formData.get("description") as string ||"").trim();
  const isActive = formData.get("isActive") ==="true";

  if (!rawCode) {
    return { error:"Kupon kodu zorunludur." };
  }

  if (!description) {
    return { error:"Kupon açıklaması zorunludur." };
  }

  const value = parseFloat(valueStr) || 0;
  if (value <= 0) {
    return { error:"İndirim değeri 0'dan büyük olmalıdır." };
  }

  try {
    await prisma.coupon.create({
      data: {
        code: rawCode,
        type,
        value: new Prisma.Decimal(value),
        minSubtotal: minSubtotalStr ? new Prisma.Decimal(parseFloat(minSubtotalStr)) : null,
        description,
        isActive,
      },
    });

    revalidatePath("/admin/kuponlar");
    return { success: true, message:"Kupon başarıyla oluşturuldu." };
  } catch (err: unknown) {
    if (err && typeof err ==="object" &&"code" in err && err.code ==="P2002") {
      return { error:"Bu kupon kodu zaten mevcut." };
    }
    const msg = err instanceof Error ? err.message :"Kupon oluşturulurken hata oluştu.";
    return { error: msg };
  }
}

export async function updateCouponAction(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !=="ADMIN") {
    return { error:"Bu işlem için admin yetkisi gereklidir." };
  }

  const rawCode = (formData.get("code") as string ||"").trim().toUpperCase();
  const type = (formData.get("type") as string ||"percentage").trim();
  const valueStr = (formData.get("value") as string ||"0").trim();
  const minSubtotalStr = (formData.get("minSubtotal") as string ||"").trim();
  const description = (formData.get("description") as string ||"").trim();
  const isActive = formData.get("isActive") ==="true";

  if (!rawCode) {
    return { error:"Kupon kodu zorunludur." };
  }

  const value = parseFloat(valueStr) || 0;

  try {
    await prisma.coupon.update({
      where: { id },
      data: {
        code: rawCode,
        type,
        value: new Prisma.Decimal(value),
        minSubtotal: minSubtotalStr ? new Prisma.Decimal(parseFloat(minSubtotalStr)) : null,
        description,
        isActive,
      },
    });

    revalidatePath("/admin/kuponlar");
    return { success: true, message:"Kupon başarıyla güncellendi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Kupon güncellenirken hata oluştu.";
    return { error: msg };
  }
}

export async function deleteCouponAction(id: string): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !=="ADMIN") {
    return { error:"Bu işlem için admin yetkisi gereklidir." };
  }

  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/kuponlar");
    return { success: true, message:"Kupon başarıyla silindi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Kupon silinirken hata oluştu.";
    return { error: msg };
  }
}

export async function toggleCouponAction(id: string, currentStatus?: boolean): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !=="ADMIN") {
    return { error:"Bu işlem için admin yetkisi gereklidir." };
  }

  try {
    const nextStatus = currentStatus !== undefined ? !currentStatus : true;
    await prisma.coupon.update({
      where: { id },
      data: { isActive: nextStatus },
    });
    revalidatePath("/admin/kuponlar");
    return { success: true, message: `Kupon ${nextStatus ?"aktif" :"pasif"} yapıldı.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Kupon durumu güncellenirken hata oluştu.";
    return { error: msg };
  }
}

export async function updateShippingSettingsAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !=="ADMIN") {
    return { error:"Bu işlem için admin yetkisi gereklidir." };
  }

  const shippingCost = (formData.get("shippingCost") as string ||"0").trim();
  const freeShippingMin = (formData.get("freeShippingMin") as string ||"0").trim();

  try {
    await Promise.all([
      prisma.storeSetting.upsert({
        where: { key:"shipping_cost" },
        update: { value: shippingCost },
        create: { key:"shipping_cost", value: shippingCost },
      }),
      prisma.storeSetting.upsert({
        where: { key:"free_shipping_min" },
        update: { value: freeShippingMin },
        create: { key:"free_shipping_min", value: freeShippingMin },
      }),
    ]);

    revalidatePath("/admin/kuponlar");
    revalidatePath("/sepet");
    revalidatePath("/checkout");
    return { success: true, message:"Kargo ayarları başarıyla kaydedildi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Kargo ayarları kaydedilirken hata oluştu.";
    return { error: msg };
  }
}

export { toggleCouponAction as toggleCouponStatusAction };