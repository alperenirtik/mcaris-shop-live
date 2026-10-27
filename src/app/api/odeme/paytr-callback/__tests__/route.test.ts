import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "crypto";

const mockFindUnique = vi.fn();
const mockUpdateMany = vi.fn();
const mockProductUpdate = vi.fn();
const mockOrderUpdate = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    order: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      updateMany: (...args: unknown[]) => mockUpdateMany(...args),
      update: (...args: unknown[]) => mockOrderUpdate(...args),
    },
    product: {
      update: (...args: unknown[]) => mockProductUpdate(...args),
    },
    $transaction: vi.fn((callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        order: { updateMany: mockUpdateMany },
        product: { update: mockProductUpdate },
      })
    ),
  },
}));

vi.mock("@/lib/email", () => ({
  sendOrderConfirmationEmail: vi.fn().mockResolvedValue(true),
  sendOrderNotificationEmail: vi.fn().mockResolvedValue(true),
}));

import { POST } from "@/app/api/odeme/paytr-callback/route";

describe("POST /api/odeme/paytr-callback", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockFindUnique.mockReset();
    mockUpdateMany.mockReset();
    mockProductUpdate.mockReset();
    mockOrderUpdate.mockReset();

    process.env = { ...originalEnv };
    process.env.PAYTR_MERCHANT_ID = "695028";
    process.env.PAYTR_MERCHANT_KEY = "GMh1YTusD3KxgBtt";
    process.env.PAYTR_MERCHANT_SALT = "n8fBfasbp46YRbo5";
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns 400 when callback hash signature is invalid", async () => {
    const params = new URLSearchParams({
      merchant_oid: "order_123",
      status: "success",
      total_amount: "10000",
      hash: "invalid_hash_value",
    });

    const request = new Request("http://localhost:3000/api/odeme/paytr-callback", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toContain("bad hash");
  });

  it("processes successful payment and returns plain OK text", async () => {
    const orderId = "order_valid_99";
    const status = "success";
    const totalAmount = "50000"; // 500.00 TL

    // Valid hash
    const validHash = crypto
      .createHmac("sha256", "GMh1YTusD3KxgBtt")
      .update(`${orderId}n8fBfasbp46YRbo5${status}${totalAmount}`)
      .digest("base64");

    mockFindUnique.mockResolvedValueOnce({
      id: orderId,
      accessToken: "token-99",
      customerName: "Müşteri Test",
      customerEmail: "musteri@example.com",
      total: { toString: () => "500.00" },
      items: [
        {
          id: "item-1",
          productId: "p-1",
          productName: "Test Ürün",
          quantity: 1,
          unitPrice: { toString: () => "500.00" },
        },
      ],
    });

    mockUpdateMany.mockResolvedValueOnce({ count: 1 });
    mockProductUpdate.mockResolvedValue({});

    const params = new URLSearchParams({
      merchant_oid: orderId,
      status: status,
      total_amount: totalAmount,
      hash: validHash,
    });

    const request = new Request("http://localhost:3000/api/odeme/paytr-callback", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("OK");
    expect(mockUpdateMany).toHaveBeenCalledTimes(1);
    expect(mockProductUpdate).toHaveBeenCalledTimes(1);
  });
});
