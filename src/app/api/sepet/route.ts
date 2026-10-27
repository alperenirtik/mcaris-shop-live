import { NextResponse } from "next/server";
import {
  getCart,
  getCartItemCount,
  getOrCreateCart,
  updateCartItemQuantity,
  removeFromCart,
  addToCart,
  clearCart,
} from "@/lib/cart";
import { getCartId, setCartId, clearCartId } from "@/lib/cart-cookie";

export async function GET() {
  try {
    const cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json({ items: [], subtotal: "0.00", count: 0 });
    }

    const cart = await getCart(cartId);
    const count = await getCartItemCount(cartId);

    return NextResponse.json({
      items: cart?.items || [],
      subtotal: cart?.subtotal || "0.00",
      count,
    });
  } catch (error) {
    console.error("Sepet alınırken hata:", error);
    return NextResponse.json({ items: [], subtotal: "0.00", count: 0, error: "Sepet alınamadı" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, itemId, productId, quantity } = body;

    let cartId = await getCartId();

    if (action === "clear") {
      if (cartId) {
        await clearCart(cartId);
      }
      await clearCartId();
      return NextResponse.json({
        ok: true,
        items: [],
        subtotal: "0.00",
        count: 0,
      });
    }

    const cart = await getOrCreateCart(cartId);
    cartId = cart.id;

    if (action === "update" && itemId && typeof quantity === "number") {
      if (quantity <= 0) {
        await removeFromCart(cartId, itemId);
      } else {
        await updateCartItemQuantity(cartId, itemId, quantity);
      }
    } else if (action ==="remove" && itemId) {
      await removeFromCart(cartId, itemId);
    } else if (action ==="add" && productId) {
      const addResult = await addToCart(cartId, productId, quantity || 1);
      if (!addResult.ok) {
        return NextResponse.json({ ok: false, error: addResult.error }, { status: 400 });
      }
    }

    // Ensure cart_id cookie is saved before creating response
    await setCartId(cartId);

    const updatedCart = await getCart(cartId);
    const count = await getCartItemCount(cartId);

    const response = NextResponse.json({
      ok: true,
      items: updatedCart?.items || [],
      subtotal: updatedCart?.subtotal ||"0.00",
      count,
    });

    response.cookies.set("cart_id", cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Sepet güncellenirken hata:", error);
    return NextResponse.json({ ok: false, error:"İşlem gerçekleştirilemedi" }, { status: 500 });
  }
}