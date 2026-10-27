import { describe, it, expect, vi, beforeEach, afterEach } from"vitest";
import { initializeCheckoutForm, retrieveCheckoutForm } from"../iyzico";

describe("iyzico payment integration", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.IYZICO_API_KEY ="test_api_key";
    process.env.IYZICO_SECRET_KEY ="test_secret_key";
    process.env.IYZICO_BASE_URL ="https://sandbox-api.iyzipay.com";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("initializeCheckoutForm", () => {
    it("resolves with token and paymentPageUrl on success", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({
          status:"success",
          token:"tok_123",
          paymentPageUrl:"https://sandbox.iyzico.com/pay/tok_123",
        }),
      } as Response);

      const result = await initializeCheckoutForm(
        {
          id:"order_1",
          total:"1500.00",
          customerName:"Ada Lovelace",
          customerEmail:"ada@example.com",
          customerPhone:"+905551112233",
          shippingAddress:"Test Mah. Test Sk. No:1, İstanbul",
          items: [{ productId:"p1", productName:"Ürün", unitPrice:"1500.00", quantity: 1 }],
        },"https://localhost:3000/api/odeme/callback"
      );

      expect(result).toEqual({
        token:"tok_123",
        paymentPageUrl:"https://sandbox.iyzico.com/pay/tok_123",
      });
    });

    it("rejects when iyzico returns error status", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({
          status:"failure",
          errorMessage:"invalid card",
        }),
      } as Response);

      await expect(
        initializeCheckoutForm(
          {
            id:"order_1",
            total:"1500.00",
            customerName:"Ada Lovelace",
            customerEmail:"ada@example.com",
            customerPhone:"+905551112233",
            shippingAddress:"Test Mah. Test Sk. No:1, İstanbul",
            items: [{ productId:"p1", productName:"Ürün", unitPrice:"1500.00", quantity: 1 }],
          },"https://localhost:3000/api/odeme/callback"
        )
      ).rejects.toThrow("invalid card");
    });
  });

  describe("retrieveCheckoutForm", () => {
    it("maps a successful retrieve response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({
          status:"success",
          paymentStatus:"SUCCESS",
          paymentId:"pay_1",
        }),
      } as Response);

      const result = await retrieveCheckoutForm("tok_123");
      expect(result).toEqual({ status:"success", paymentId:"pay_1" });
    });

    it("maps a failed retrieve response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: async () => ({
          status:"success",
          paymentStatus:"FAILURE",
          errorMessage:"3D Secure reddedildi",
        }),
      } as Response);

      const result = await retrieveCheckoutForm("tok_123");
      expect(result).toEqual({ status:"failure", errorMessage:"3D Secure reddedildi" });
    });
  });
});
