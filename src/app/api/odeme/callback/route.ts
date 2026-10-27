import { prisma } from"@/lib/db";
import { retrieveCheckoutForm } from"@/lib/iyzico";
import { clearCartId } from"@/lib/cart-cookie";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from"@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ??"http://localhost:3000";

export async function POST(request: Request): Promise<Response> {
  let token: string | null = null;

  try {
    const cloned = request.clone();
    const formData = await cloned.formData();
    const formToken = formData.get("token");
    if (typeof formToken === "string") {
      token = formToken;
    }
  } catch {
    try {
      const text = await request.clone().text();
      const params = new URLSearchParams(text);
      token = params.get("token");
    } catch {
      token = null;
    }
  }

  if (!token || typeof token !== "string") {
    return Response.redirect(`${BASE_URL}/checkout?hata=odeme-basarisiz`, 303);
  }

  const order = await prisma.order.findUnique({
    where: { iyzicoToken: token },
    include: { items: true },
  });

  if (!order) {
    return Response.redirect(`${BASE_URL}/checkout?hata=odeme-basarisiz`, 303);
  }

  const result = await retrieveCheckoutForm(token);

  if (result.status === "success") {
    const alreadyProcessed = await prisma.$transaction(async (tx) => {
      const { count } = await tx.order.updateMany({
        where: { id: order.id, status: "pending" },
        data: { status: "paid", iyzicoPaymentId: result.paymentId },
      });

      if (count === 0) {
        // Already processed by an earlier callback (replay/double-POST) — skip stock decrement.
        return true;
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return false;
    });

    if (!alreadyProcessed) {
      await clearCartId();
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
      // Send email notifications (non-blocking)
      sendOrderConfirmationEmail(emailOrder).catch(console.error);
      sendOrderNotificationEmail(emailOrder).catch(console.error);
    }

    return Response.redirect(`${BASE_URL}/siparis/${order.accessToken}/tesekkurler`, 303);
  }

  // Payment failed (Idempotency protection: only fail if still pending)
  await prisma.order.updateMany({
    where: {
      id: order.id,
      status: "pending",
    },
    data: { status: "failed", failureReason: result.errorMessage },
  });

  return Response.redirect(`${BASE_URL}/checkout?hata=odeme-basarisiz`, 303);
}
