"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createPendingOrder } from "@/lib/orders";
import { createPaytrToken } from "@/lib/paytr";
import { initializeCheckoutForm } from "@/lib/iyzico";
import { getCartId, clearCartId } from "@/lib/cart-cookie";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from "@/lib/email";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Müşteri adı gereklidir."),
  customerEmail: z.string().email("Geçerli bir e-posta adresi giriniz.").or(z.literal("")),
  customerPhone: z.string().min(10, "Geçerli bir telefon numarası giriniz."),
  address: z.string().min(5, "Açık adres gereklidir."),
  city: z.string().min(2, "İl seçimi gereklidir."),
  district: z.string().min(2, "İlçe seçimi gereklidir."),
  paymentMethod: z.enum(["havale", "card", "paytr", "iyzico"]).default("card"),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
});

export async function createOrderAndRedirectAction(formData: FormData): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) {
    redirect("/sepet");
  }

  const currentUser = await getCurrentUser();

  const raw = {
    customerName: String(formData.get("customerName") || "").trim(),
    customerEmail: String(formData.get("customerEmail") || "").trim().toLowerCase(),
    customerPhone: String(formData.get("customerPhone") || "").trim(),
    address: String(formData.get("shippingAddress") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    district: String(formData.get("district") || "").trim(),
    paymentMethod: String(formData.get("paymentMethod") || "havale").trim(),
    couponCode: String(formData.get("couponCode") || "").trim().toUpperCase() || undefined,
    customerNotes: String(formData.get("customerNotes") || "").trim() || undefined,
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/checkout?hata=eksik-bilgi");
  }

  const { customerName, customerEmail, customerPhone, address, city, district, paymentMethod, couponCode, customerNotes } =
    parsed.data;

  const baseAddress = `${address}, ${district} / ${city}`;
  const shippingAddress = customerNotes ? `${baseAddress} (Sipariş/Montaj Notu: ${customerNotes})` : baseAddress;

  const result = await createPendingOrder(
    cartId,
    {
      customerName,
      customerEmail: customerEmail || "siparis@mcaris.com.tr",
      customerPhone,
      shippingAddress,
      userId: currentUser?.id || null,
    },
    couponCode
  );

  if (!result.ok) {
    if (result.error === "OUT_OF_STOCK") {
      redirect("/checkout?hata=stok-yetersiz");
    }
    redirect("/sepet");
  }

  const order = await prisma.order.findUnique({
    where: { id: result.order.id },
    include: { items: true },
  });

  if (!order) {
    redirect("/checkout?hata=siparis-bulunamadi");
  }

  const emailOrder = {
    id: order.id,
    accessToken: order.accessToken,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    total: order.total.toString(),
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
    })),
  };

    if (paymentMethod === "havale") {
    // Havale siparişlerinde hemen e-posta gönder
    if (customerEmail) {
      sendOrderConfirmationEmail(emailOrder).catch(console.error);
    }
    sendOrderNotificationEmail(emailOrder).catch(console.error);
    // Clear cart for Havale / EFT orders
    try {
      await clearCartId();
      await prisma.cartItem.deleteMany({ where: { cartId } });
    } catch {}

    redirect(`/siparis/${order.accessToken}/tesekkurler?metot=havale`);
  } else if (paymentMethod === "card" || paymentMethod === "paytr") {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    const userIp = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    const paytrResult = await createPaytrToken(
      {
        id: order.id,
        accessToken: order.accessToken,
        total: order.total.toString(),
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice.toString(),
          quantity: item.quantity,
        })),
      },
      userIp
    );

    if (paytrResult.status === "success" && paytrResult.iframeUrl) {
      redirect(paytrResult.iframeUrl);
    }

    console.error("PayTR Ödeme Başlatma Hatası:", paytrResult.reason);
    redirect("/checkout?hata=odeme-baslatilamadi");
  } else if (paymentMethod === "iyzico") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/odeme/callback`;
    const checkoutForm = await initializeCheckoutForm(
      {
        id: order.id,
        total: order.total.toString(),
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        items: order.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice.toString(),
          quantity: item.quantity,
        })),
      },
      callbackUrl
    );
    if (checkoutForm?.paymentPageUrl) {
      redirect(checkoutForm.paymentPageUrl);
    }
    redirect("/checkout?hata=odeme-baslatilamadi");
  } else {
    redirect(`/siparis/${order.accessToken}/tesekkurler`);
  }
}
