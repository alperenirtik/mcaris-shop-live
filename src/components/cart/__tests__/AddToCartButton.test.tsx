import { render, screen } from"@testing-library/react";
import userEvent from"@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from"vitest";
import React from"react";
import AddToCartButton from"../AddToCartButton";
import { addToCartAction } from"@/app/urun/[slug]/actions";

vi.mock("@/app/urun/[slug]/actions", () => ({
  addToCartAction: vi.fn(),
}));

const mockAddItemToCart = vi.fn().mockResolvedValue(true);
vi.mock("@/context/CartDrawerContext", () => ({
  useCartDrawer: () => ({
    addItemToCart: mockAddItemToCart,
    openDrawer: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an enabled button when stock is available", () => {
    render(<AddToCartButton productId="p1" stock={5} />);
    expect(screen.getByRole("button", { name: /sepete ekle/i })).toBeEnabled();
  });

  it("renders an active 'Stok Sor (WhatsApp)' link when stock is zero", () => {
    render(<AddToCartButton productId="p1" stock={0} productName="Test Yatak" productCode="MC-100" />);
    const link = screen.getByRole("link", { name: /stok sor/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("calls addItemToCart when SEPETE EKLE is clicked", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton productId="p1" stock={5} />);
    const button = screen.getByRole("button", { name: /sepete ekle/i });
    await user.click(button);
    expect(mockAddItemToCart).toHaveBeenCalledWith("p1", 1);
  });

  it("calls addItemToCart and redirects when HEMEN SATIN AL is clicked", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton productId="p1" stock={5} />);
    const button = screen.getByRole("button", { name: /hemen satın al/i });
    await user.click(button);
    expect(mockAddItemToCart).toHaveBeenCalledWith("p1", 1);
  });

});
