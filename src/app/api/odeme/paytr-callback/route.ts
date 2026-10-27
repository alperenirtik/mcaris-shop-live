import { prisma } from "@/lib/db";
import { verifyPaytrCallbackHash } from "@/lib/paytr";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from "@/lib/email";

export async function POST(request: Request): Promise<Response> {
  let merchantOid = "";
  let status = "";
  let totalAmount = "";
  let hash = "";
  let failedReasonMsg = "";

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      merchantOid = params.get("merchant_oid") || "";
      status = params.get("status") || "";
      totalAmount = params.get("total_amount") || "";
      hash = params.get("hash") || "";
      failedReasonMsg = params.get("failed_reason_msg") || "";
    } else {
      const cloned = request.clone();
      try {
        const formData = await cloned.formData();
        merchantOid = String(formData.get("merchant_oid") || "");
        status = String(formData.get("status") || "");
        totalAmount = String(formData.get("total_amount") || "");
        hash = String(formData.get("hash") || "");
        failedReasonMsg = String(formData.get("failed_reason_msg") || "");
      } catch {
        const text = await request.text();
        const params = new URLSearchParams(text);
        merchantOid = params.get("merchant_oid") || "";
        status = params.get("status") || "";
        totalAmount = params.get("total_amount") || "";
        hash = params.get("hash") || "";
        failedReasonMsg = params.get("failed_reason_msg") || "";
      }
    }
  } catch {
    return new Response("PAYTR notice failed: invalid payload", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (!merchantOid || !hash) {
    return new Response("PAYTR notice failed: missing parameters", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 1. HMAC-SHA256 İmza Doğrulaması
  const isValid = verifyPaytrCallbackHash({
    merchantOid,
    status,
    totalAmount,
    hash,
  });

  if (!isValid) {
    console.error(`PayTR Callback Hash Hatası! Sipariş No: ${merchantOid}`);
    return new Response("PAYTR notice failed: bad hash", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 2. Siparişi veritabanından çek
  const order = await prisma.order.findUnique({
    where: { id: merchantOid },
    include: { items: true },
  });

  if (!order) {
    console.error(`PayTR Callback: Sipariş bulunamadı! ID: ${merchantOid}`);
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 3. Başarılı Ödeme Akışı
  if (status === "success") {
    const alreadyProcessed = await prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: order.id, status: "pending" },
        data: {
          status: "paid",
          iyzicoPaymentId: merchantOid,
        },
      });

      // Zaten işlenmişse (mükerrer webhook) stokları tekrar düşme
      if (count === 0) {
        return true;
      }

      // Stokları düşür
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return false;
    });

    if (!alreadyProcessed) {
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

      // Müşteriye ve Mağazaya Sipariş E-Postalarını Gönder (Non-blocking)
      try {
        Promise.resolve(sendOrderConfirmationEmail(emailOrder)).catch(console.error);
        Promise.resolve(sendOrderNotificationEmail(emailOrder)).catch(console.error);
      } catch (err) {
        console.error("E-posta bildirim hatası:", err);
      }
    }

    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // 4. Başarısız Ödeme Durumu (Yalnızca beklemede olan siparişler için idempotency koruması)
  await prisma.order.updateMany({
    where: {
      id: order.id,
      status: "pending",
    },
    data: {
      status: "failed",
      failureReason: failedReasonMsg || "PayTR ödeme reddedildi",
    },
  });

  return new Response("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
