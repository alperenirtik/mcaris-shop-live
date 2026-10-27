import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "crypto";
import { isPaytrConfigured, verifyPaytrCallbackHash, createPaytrToken } from "../paytr";
import { prisma } from "../db";

describe("PayTR Integration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.PAYTR_MERCHANT_ID = "695028";
    process.env.PAYTR_MERCHANT_KEY = "GMh1YTusD3KxgBtt";
    process.env.PAYTR_MERCHANT_SALT = "n8fBfasbp46YRbo5";
    process.env.PAYTR_TEST_MODE = "0";
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe("isPaytrConfigured", () => {
    it("returns true when all merchant credentials are set", () => {
      expect(isPaytrConfigured()).toBe(true);
    });

    it("returns false when any merchant credential is missing", () => {
      delete process.env.PAYTR_MERCHANT_KEY;
      expect(isPaytrConfigured()).toBe(false);
    });
  });

  describe("verifyPaytrCallbackHash", () => {
    it("validates authentic PayTR callback signatures", () => {
      const merchantOid = "order_abc_123";
      const status = "success";
      const totalAmount = "150000"; // 1500.00 TL in kuruş

      // Gerçek PayTR formülü: HMAC-SHA256(merchant_oid + merchant_salt + status + total_amount, merchant_key)
      const expectedHash = crypto
        .createHmac("sha256", "GMh1YTusD3KxgBtt")
        .update(`${merchantOid}n8fBfasbp46YRbo5${status}${totalAmount}`)
        .digest("base64");

      const isValid = verifyPaytrCallbackHash({
        merchantOid,
        status,
        totalAmount,
        hash: expectedHash,
      });

      expect(isValid).toBe(true);
    });

    it("rejects tampered or fraudulent callback payloads", () => {
      const merchantOid = "order_abc_123";
      const status = "success";
      const totalAmount = "150000";

      const isValid = verifyPaytrCallbackHash({
        merchantOid,
        status,
        totalAmount,
        hash: "fraudulent_signature_base64",
      });

      expect(isValid).toBe(false);
    });
  });

  describe("createPaytrToken", () => {
    it("sends formatted basket and amount to PayTR endpoint and returns token", async () => {
      const mockOrder = {
        id: "order_test_99",
        accessToken: "access-token-99",
        total: "250.50",
        customerName: "Ahmet Yılmaz",
        customerEmail: "ahmet@example.com",
        customerPhone: "05321112233",
        shippingAddress: "Ankara Çankaya",
        items: [
          {
            productId: "prod-1",
            productName: "Motorlu Hasta Karyolası",
            unitPrice: "250.50",
            quantity: 1,
          },
        ],
      };

      // Mock fetch
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            status: "success",
            token: "mock-paytr-token-xyz123",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );

      vi.spyOn(prisma.order, "update").mockResolvedValue({} as never);

      const result = await createPaytrToken(mockOrder, "176.240.10.5");

      expect(result.status).toBe("success");
      expect(result.token).toBe("mock-paytr-token-xyz123");
      expect(result.iframeUrl).toContain("mock-paytr-token-xyz123");

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
      expect(calledUrl).toBe("https://www.paytr.com/odeme/api/get-token");

      // Body içindeki tutarın kuruş bazlı (250.50 * 100 = 25050) olduğunu doğrula
      const requestBody = calledOptions?.body as string;
      expect(requestBody).toContain("payment_amount=25050");
      expect(requestBody).toContain("merchant_id=695028");
      expect(requestBody).toContain("user_ip=176.240.10.5");
      expect(requestBody).toContain("currency=TL");
    });
  });
});
