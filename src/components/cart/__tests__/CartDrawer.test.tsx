import { render, screen, fireEvent } from"@testing-library/react";
import { describe, it, expect, vi, beforeEach } from"vitest";
import React from"react";
import CartDrawer from"../CartDrawer";
import { CartDrawerProvider, useCartDrawer } from"@/context/CartDrawerContext";

// Test trigger component to test opening drawer
function TestTrigger() {
  const { openCart, addItemToCart } = useCartDrawer();
  return (
    <div>
      <button onClick={openCart}>Open Cart</button>
      <button onClick={() => addItemToCart("p1", 1)}>Add Item</button>
    </div>
  );
}

describe("CartDrawer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ items: [], subtotal: "0.00", count: 0 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

  });

  it("does not render when drawer is closed", () => {
    render(
      <CartDrawerProvider>
        <CartDrawer />
      </CartDrawerProvider>
    );

    expect(screen.queryByText("Alışveriş Sepeti")).not.toBeInTheDocument();
  });

  it("renders when opened via trigger button", async () => {
    render(
      <CartDrawerProvider>
        <TestTrigger />
        <CartDrawer />
      </CartDrawerProvider>
    );

    const openBtn = screen.getByText("Open Cart");
    fireEvent.click(openBtn);

    expect(await screen.findByText("Alışveriş Sepeti")).toBeInTheDocument();
  });
});
