import { describe, it, expect, vi, beforeEach } from"vitest";

const { mockRetrieve, mockFindUnique, mockUpdateMany, mockProductUpdate, mockOrderUpdate, mockClearCartId } =
  vi.hoisted(() => ({
    mockRetrieve: vi.fn(),
    mockFindUnique: vi.fn(),
    mockUpdateMany: vi.fn(),
    mockProductUpdate: vi.fn(),
    mockOrderUpdate: vi.fn(),
    mockClearCartId: vi.fn(),
  }));

vi.mock("@/lib/iyzico", () => ({ retrieveCheckoutForm: mockRetrieve }));

vi.mock("@/lib/cart-cookie", () => ({ clearCartId: mockClearCartId }));

vi.mock("@/lib/email", () => ({
  sendOrderConfirmationEmail: vi.fn().mockResolvedValue(undefined),
  sendOrderNotificationEmail: vi.fn().mockResolvedValue(undefined),
}));

const tx = {
  order: { updateMany: mockUpdateMany, update: mockOrderUpdate },
  product: { update: mockProductUpdate },
};

vi.mock("@/lib/db", () => ({
  prisma: {
    order: { findUnique: mockFindUnique, update: mockOrderUpdate, updateMany: mockUpdateMany },
    $transaction: vi.fn((callback: (tx: unknown) => Promise<unknown>) => callback(tx)),
  },
}));


import { POST } from"../route";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from"@/lib/email";

function buildRequest(token: string) {
  const form = new URLSearchParams();
  form.set("token", token);
  return new Request("http://localhost/api/odeme/callback", { method:"POST", body: form });
}


describe("POST /api/odeme/callback", () => {
  beforeEach(() => {
    mockRetrieve.mockReset();
    mockFindUnique.mockReset();
    mockUpdateMany.mockReset();
    mockProductUpdate.mockReset();
    mockOrderUpdate.mockReset();
    mockClearCartId.mockReset();
    vi.mocked(sendOrderConfirmationEmail).mockClear();
    vi.mocked(sendOrderNotificationEmail).mockClear();
  });

  it("marks the order paid, decrements stock, clears the cart cookie, and redirects to the confirmation page on success", async () => {
    mockFindUnique.mockResolvedValue({
      id:"order_1",
      accessToken:"tok_access_1",
      customerName:"Ada Lovelace",
      customerEmail:"ada@example.com",
      total: { toString: () =>"1500.00" },
      items: [{ productId:"p1", productName:"Elektrikli Hasta Yatağı Pro", quantity: 1, unitPrice: { toString: () =>"1500.00" } }],
    });
    mockRetrieve.mockResolvedValue({ status:"success", paymentId:"pay_1" });
    mockUpdateMany.mockResolvedValue({ count: 1 });
    mockProductUpdate.mockResolvedValue(undefined);

    const response = await POST(buildRequest("tok_123"));

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id:"order_1", status:"pending" },
      data: { status:"paid", iyzicoPaymentId:"pay_1" },
    });
    expect(mockProductUpdate).toHaveBeenCalledWith({
      where: { id:"p1" },
      data: { stock: { decrement: 1 } },
    });
    expect(mockClearCartId).toHaveBeenCalled();
    expect(sendOrderConfirmationEmail).toHaveBeenCalled();
    expect(sendOrderNotificationEmail).toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/siparis/tok_access_1/tesekkurler");
  });

  it("skips the stock decrement and does not clear the cart again when the order was already processed (replayed callback)", async () => {
    mockFindUnique.mockResolvedValue({ id:"order_1", accessToken:"tok_access_1", items: [{ productId:"p1", quantity: 1 }] });
    mockRetrieve.mockResolvedValue({ status:"success", paymentId:"pay_1" });
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const response = await POST(buildRequest("tok_123"));

    expect(mockUpdateMany).toHaveBeenCalled();
    expect(mockProductUpdate).not.toHaveBeenCalled();
    expect(mockClearCartId).not.toHaveBeenCalled();
    expect(sendOrderConfirmationEmail).not.toHaveBeenCalled();
    expect(sendOrderNotificationEmail).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/siparis/tok_access_1/tesekkurler");
  });

  it("marks the order failed and redirects to checkout with an error on failure", async () => {
    mockFindUnique.mockResolvedValue({ id: "order_1", accessToken: "tok_access_1", items: [] });
    mockRetrieve.mockResolvedValue({ status: "failure", errorMessage: "3D Secure reddedildi" });
    mockUpdateMany.mockResolvedValue({ count: 1 });

    const response = await POST(buildRequest("tok_123"));

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: "order_1", status: "pending" },
      data: { status: "failed", failureReason: "3D Secure reddedildi" },
    });
    expect(mockClearCartId).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/checkout?hata=odeme-basarisiz");
  });

  it("redirects to checkout with an error when the order can't be found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const response = await POST(buildRequest("tok_unknown"));
    expect(response.headers.get("location")).toContain("/checkout?hata=odeme-basarisiz");
  });

  it("redirects to checkout with an error when the token is missing", async () => {
    const form = new FormData();
    const request = new Request("http://localhost/api/odeme/callback", { method:"POST", body: form });
    const response = await POST(request);
    expect(response.headers.get("location")).toContain("/checkout?hata=odeme-basarisiz");
    expect(mockFindUnique).not.toHaveBeenCalled();
  });
});
