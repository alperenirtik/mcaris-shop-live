import crypto from "crypto";
import { prisma } from "@/lib/db";

export interface OrderForPaytr {
  id: string;
  accessToken: string;
  total: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{
    productId: string;
    productName: string;
    unitPrice: string;
    quantity: number;
  }>;
}

export interface PaytrTokenResult {
  status: "success" | "failed";
  token?: string;
  reason?: string;
  iframeUrl?: string;
}

/**
 * PayTR API anahtarlarının ortam değişkenlerinde tanımlı olup olmadığını kontrol eder.
 */
export function isPaytrConfigured(): boolean {
  return Boolean(
    process.env.PAYTR_MERCHANT_ID &&
    process.env.PAYTR_MERCHANT_KEY &&
    process.env.PAYTR_MERCHANT_SALT
  );
}

/**
 * PayTR iFrame API token oluşturma fonksiyonu.
 */
export async function createPaytrToken(
  order: OrderForPaytr,
  userIp: string
): Promise<PaytrTokenResult> {
  const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Eğer PayTR yapılandırılmamışsa simülasyon tokenı
  if (!isPaytrConfigured()) {
    const mockToken = `paytr-mock-${order.id}-${Date.now()}`;
    try {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          iyzicoToken: mockToken,
        },
      });
    } catch {
      // Sipariş token kaydı
    }

    return {
      status: "success",
      token: mockToken,
      iframeUrl: `${appBaseUrl}/odeme/paytr?token=${mockToken}&orderId=${encodeURIComponent(order.id)}`,
    };
  }

  const merchantId = process.env.PAYTR_MERCHANT_ID!;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;
  const testMode = process.env.PAYTR_TEST_MODE || "0";

  const merchantOid = order.id;
  const email = order.customerEmail || "siparis@mcaris.com.tr";
  const paymentAmount = Math.round(parseFloat(order.total) * 100);

  // Sepet JSON ve Base64 kodlaması: [[ "Ürün Adı", "Fiyat", Adet ], ...]
  const basketItems = order.items.map((item) => [
    item.productName.slice(0, 100),
    (parseFloat(item.unitPrice) * item.quantity).toFixed(2),
    item.quantity,
  ]);
  const userBasket = Buffer.from(JSON.stringify(basketItems)).toString("base64");

  const userName = order.customerName.trim() || "MCaris Musterisi";
  const userAddress = order.shippingAddress.trim() || "Ankara, Turkiye";
  const userPhone = order.customerPhone.trim() || "05320000000";

  const merchantOkUrl = `${appBaseUrl}/siparis/${order.accessToken}/tesekkurler?odeme=basarili`;
  const merchantFailUrl = `${appBaseUrl}/checkout?hata=odeme-basarisiz`;

  const currency = "TL";
  const noInstallment = "0"; // Taksit imkanı açık
  const maxInstallment = "12"; // 12 aya varan taksit
  const timeoutLimit = "30"; // 30 dakika
  const debugOn = process.env.NODE_ENV === "development" ? "1" : "0";

  // PayTR Hash Dizisi
  const hashStr = `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
  const paytrToken = crypto
    .createHmac("sha256", merchantKey)
    .update(hashStr + merchantSalt)
    .digest("base64");

  const params = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email,
    payment_amount: paymentAmount.toString(),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: debugOn,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: userName,
    user_address: userAddress,
    user_phone: userPhone,
    merchant_ok_url: merchantOkUrl,
    merchant_fail_url: merchantFailUrl,
    timeout_limit: timeoutLimit,
    currency,
    test_mode: testMode,
  });

  try {
    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = (await response.json()) as { status: string; token?: string; reason?: string };

    if (data.status === "success" && data.token) {
      try {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            iyzicoToken: data.token,
          },
        });
      } catch (err) {
        console.error("PayTR token kaydedilemedi:", err);
      }

      return {
        status: "success",
        token: data.token,
        iframeUrl: `${appBaseUrl}/odeme/paytr?token=${data.token}&orderId=${encodeURIComponent(order.id)}`,
      };
    }

    return {
      status: "failed",
      reason: data.reason || "PayTR ödeme tokenı alınamadı.",
    };
  } catch (error) {
    console.error("PayTR Token İsteği Hatası:", error);
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "PayTR bağlantı hatası",
    };
  }
}

/**
 * PayTR Webhook (Callback) İmza Doğrulama Fonksiyonu.
 */
export function verifyPaytrCallbackHash(params: {
  merchantOid: string;
  status: string;
  totalAmount: string;
  hash: string;
}): boolean {
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

  if (!merchantKey || !merchantSalt) {
    return false;
  }

  // PayTR Formülü: HMAC-SHA256(merchant_oid + merchant_salt + status + total_amount, merchant_key)
  const hashStr = `${params.merchantOid}${merchantSalt}${params.status}${params.totalAmount}`;
  const calculatedHash = crypto
    .createHmac("sha256", merchantKey)
    .update(hashStr)
    .digest("base64");

  return calculatedHash === params.hash;
}
