import { render, screen } from"@testing-library/react";
import { describe, it, expect, vi } from"vitest";

vi.mock("@/lib/orders", () => ({
  getOrderByAccessToken: vi.fn().mockResolvedValue({
    id:"order_1",
    customerName:"Ada Lovelace",
    total:"1500.00",
    items: [{ productName:"Elektrikli Hasta Yatağı Pro", quantity: 1, unitPrice:"1500.00" }],
  }),
}));

import OrderConfirmationPage from"../page";

describe("OrderConfirmationPage", () => {
  it("renders the order total and item list", async () => {
    const jsx = await OrderConfirmationPage({ params: Promise.resolve({ accessToken:"tok_1" }) });
    render(jsx as React.ReactElement);
    expect(screen.getAllByText("1.500,00 ₺").length).toBeGreaterThan(0);
    expect(screen.getByText((content: string) => content.includes("Elektrikli Hasta Yatağı Pro"))).toBeInTheDocument();
  });
});
