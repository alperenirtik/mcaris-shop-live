import { render, screen } from"@testing-library/react";
import { describe, it, expect } from"vitest";
import CartSummary from"../CartSummary";

describe("CartSummary", () => {
  it("shows subtotal, shipping, and total, and marks free shipping", () => {
    render(<CartSummary subtotal="6000.00" shipping={0} />);
    expect(screen.getAllByText("6.000,00 ₺").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ücretsiz/i).length).toBeGreaterThan(0);
  });

  it("shows the flat shipping cost when not free", () => {
    render(<CartSummary subtotal="1000.00" shipping={150} />);
    expect(screen.getByText("150,00 ₺")).toBeInTheDocument();
    expect(screen.getByText("1.150,00 ₺")).toBeInTheDocument();
  });
});
