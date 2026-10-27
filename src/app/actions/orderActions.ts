"use server";

import { requireAdmin } from"@/lib/auth";
import { updateOrderStatus, deleteOrder, createAdminOrder } from"@/lib/orders";
import { prisma } from"@/lib/db";
import { OrderStatus } from"@prisma/client";
import { revalidatePath } from"next/cache";
import { writeFile, mkdir } from"fs/promises";
import path from"path";

export interface OrderActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function updateOrderStatusAction(id: string, status: OrderStatus): Promise<OrderActionState> {
  await requireAdmin();

  try {
    await updateOrderStatus(id, status);
    revalidatePath("/admin/siparisler");
    return { success: true, message:"Sipariş durumu güncellendi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Sipariş durumu güncellenirken hata oluştu.";
    return { error: msg };
  }
}

export async function deleteOrderAction(id: string): Promise<OrderActionState> {
  await requireAdmin();

  try {
    await deleteOrder(id);
    revalidatePath("/admin/siparisler");
    return { success: true, message:"Sipariş başarıyla silindi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Sipariş silinirken hata oluştu.";
    return { error: msg };
  }
}

export async function createAdminOrderAction(
  prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  await requireAdmin();

  const customerName = (formData.get("customerName") as string ||"").trim();
  const customerEmail = (formData.get("customerEmail") as string ||"").trim();
  const customerPhone = (formData.get("customerPhone") as string ||"").trim();

  const address = (formData.get("address") as string || "").trim();
  const city = (formData.get("city") as string || "").trim();
  const district = (formData.get("district") as string || "").trim();
  const itemsJson = (formData.get("itemsRaw") || formData.get("items") || "[]") as string;

  if (!customerName || !customerPhone || !address || !city || !district) {
    return { error: "Lütfen tüm zorunlu alanları doldurun." };
  }

  try {
    const items: Array<{ productId: string; quantity: number }> = JSON.parse(itemsJson);
    if (!items.length) {
      return { error: "Sipariş en az bir ürün içermelidir." };
    }

    const shippingAddress = `${address}, ${district} / ${city}`;

    await createAdminOrder({
      customerName,
      customerEmail: customerEmail || "info@mcaris.com.tr",
      customerPhone,
      shippingAddress,
      items,
    });

    revalidatePath("/admin/siparisler");
    revalidatePath("/admin/odemeler");
    revalidatePath("/admin");
    revalidatePath("/urunler");
    return { success: true, message: "Sipariş başarıyla oluşturuldu." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sipariş oluşturulurken hata oluştu.";
    return { error: msg };
  }
}

export async function uploadOrderInvoiceAction(
  prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  await requireAdmin();

  const orderId = (formData.get("orderId") as string ||"").trim();
  const file = (formData.get("invoiceFile") || formData.get("file")) as File | null;
  const invoiceUrlInput = (formData.get("invoiceUrl") as string ||"").trim();


  if (!orderId) {
    return { error:"Sipariş ID gereklidir." };
  }

  try {
    let finalUrl = invoiceUrlInput;
    if (file && file.size > 0 && typeof file.arrayBuffer === "function") {
      const ext = path.extname(file.name).toLowerCase() || ".pdf";
      const allowedInvoiceExts = [".pdf", ".png", ".jpg", ".jpeg"];
      if (!allowedInvoiceExts.includes(ext)) {
        return { error: "Yalnızca PDF, PNG veya JPG formatında fatura yükleyebilirsiniz." };
      }

      if (file.size > 15 * 1024 * 1024) {
        return { error: "Fatura dosyası 15MB sınırını aşamaz." };
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads", "invoices");
      await mkdir(uploadDir, { recursive: true });
      const randomSecret = Math.random().toString(36).substring(2, 12);
      const filename = `invoice-${orderId}-${randomSecret}${ext}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      finalUrl = `/uploads/invoices/${filename}`;
    }

    if (!finalUrl) {
      return { error:"Lütfen bir fatura dosyası seçin veya bağlantı girin." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceUrl: finalUrl },
    });

    revalidatePath("/admin/siparisler");
    return { success: true, message:"Fatura başarıyla kaydedildi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Fatura yüklenirken hata oluştu.";
    return { error: msg };
  }
}