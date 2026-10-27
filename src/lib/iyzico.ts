import crypto from"crypto";
import { prisma } from"@/lib/db";

export function isIyzicoConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

export interface OrderForPayment {
  id: string;
  total: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{ productId: string; productName: string; unitPrice: string; quantity: number }>;
}

export interface IyziResult {
  status?: string;
  paymentStatus?: string;
  paymentId?: string;
  token?: string;
  paymentPageUrl?: string;
  errorMessage?: string;
}

/**
 * iyzico V2 REST API için standart HMAC-SHA256 imza ve Authorization başlığı üretir.
 */
function createIyzicoHeaders(apiKey: string, secretKey: string, uriPath: string, payload: object) {
  const randomString = Date.now().toString() + Math.random().toString(36).slice(2, 10);
  const jsonBody = JSON.stringify(payload);

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(randomString + uriPath + jsonBody)
    .digest("hex");

  const authorizationParams = [
    `apiKey:${apiKey}`,
    `randomKey:${randomString}`,
    `signature:${signature}`,
  ];
  const authHeader ="IYZWSv2" + Buffer.from(authorizationParams.join("&")).toString("base64");

  return {"Content-Type":"application/json","Accept":"application/json","x-iyzi-rnd": randomString,"x-iyzi-client-version":"iyzipay-node-2.0.69","Authorization": authHeader,
  };
}

/**
 * iyzico 3D Secure Checkout Form başlatma isteği
 */
export async function initializeCheckoutForm(
  order: OrderForPayment,
  callbackUrl: string
): Promise<{ token: string; paymentPageUrl: string }> {
  const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ||"http://localhost:3000";

  // Canlı/Test API anahtarları tanımlı değilse yerel test simülasyonuna yönlendir
  if (!isIyzicoConfigured()) {
    const testToken = `iyz-test-${order.id}-${Date.now()}`;
    const testPaymentUrl = `${appBaseUrl}/api/odeme/iyzico-test-pay?orderId=${encodeURIComponent(order.id)}`;

    try {
      await prisma.order.update({
        where: { id: order.id },
        data: { iyzicoToken: testToken },
      });
    } catch {
      // Test aşaması token kaydı
    }

    return {
      token: testToken,
      paymentPageUrl: testPaymentUrl,
    };
  }

  const apiKey = process.env.IYZICO_API_KEY!;
  const secretKey = process.env.IYZICO_SECRET_KEY!;
  const baseUrl = (process.env.IYZICO_BASE_URL ||"https://api.iyzipay.com").replace(/\/+$/,"");
  const uriPath ="/payment/iyzipos/checkoutform/initialize/auth/ecom";

  const requestPayload = {
    locale:"tr",
    conversationId: order.id,
    price: order.total,
    paidPrice: order.total,
    currency:"TRY",
    basketId: order.id,
    paymentGroup:"PRODUCT",
    callbackUrl,
    buyer: {
      id: order.id,
      name: order.customerName.split("")[0] || order.customerName,
      surname: order.customerName.split("").slice(1).join("") || order.customerName,
      gsmNumber: order.customerPhone,
      email: order.customerEmail,
      identityNumber:"11111111111",
      registrationAddress: order.shippingAddress,
      ip:"85.34.78.112",
      city:"Istanbul",
      country:"Turkey",
    },
    shippingAddress: {
      contactName: order.customerName,
      city:"Istanbul",
      country:"Turkey",
      address: order.shippingAddress,
    },
    billingAddress: {
      contactName: order.customerName,
      city:"Istanbul",
      country:"Turkey",
      address: order.shippingAddress,
    },
    basketItems: order.items.map((item) => ({
      id: item.productId,
      name: item.productName,
      category1:"Medikal Ekipman",
      itemType:"PHYSICAL",
      price: (parseFloat(item.unitPrice) * item.quantity).toFixed(2),
    })),
  };

  const headers = createIyzicoHeaders(apiKey, secretKey, uriPath, requestPayload);

  const response = await fetch(`${baseUrl}${uriPath}`, {
    method:"POST",
    headers,
    body: JSON.stringify(requestPayload),
  });

  const result: IyziResult = await response.json();

  if (result.status !=="success") {
    throw new Error(result.errorMessage ||"iyzico checkout form başlatılamadı.");
  }

  if (result.token) {
    try {
      await prisma.order.update({
        where: { id: order.id },
        data: { iyzicoToken: result.token },
      });
    } catch {
      // Token kaydı
    }
  }

  return {
    token: result.token ||"",
    paymentPageUrl: result.paymentPageUrl ||"",
  };
}

/**
 * iyzico 3D Secure Checkout Form sonuç sorgulama isteği
 */
export async function retrieveCheckoutForm(
  token: string
): Promise<{ status:"success" |"failure"; paymentId?: string; errorMessage?: string }> {
  // Test simülasyon token'ı ise anında onayla
  if (token.startsWith("iyz-test-")) {
    return {
      status:"success",
      paymentId: `IYZ-TEST-${Date.now()}`,
    };
  }

  const apiKey = process.env.IYZICO_API_KEY!;
  const secretKey = process.env.IYZICO_SECRET_KEY!;
  const baseUrl = (process.env.IYZICO_BASE_URL ||"https://api.iyzipay.com").replace(/\/+$/,"");
  const uriPath ="/payment/iyzipos/checkoutform/auth/ecom";

  const requestPayload = {
    locale:"tr",
    conversationId: `RETRIEVE-${Date.now()}`,
    token,
  };

  const headers = createIyzicoHeaders(apiKey, secretKey, uriPath, requestPayload);

  const response = await fetch(`${baseUrl}${uriPath}`, {
    method:"POST",
    headers,
    body: JSON.stringify(requestPayload),
  });

  const result: IyziResult = await response.json();

  if (result.paymentStatus ==="SUCCESS") {
    return {
      status:"success",
      paymentId: result.paymentId,
    };
  }

  return {
    status:"failure",
    errorMessage: result.errorMessage ||"Ödeme onaylanamadı.",
  };
}
