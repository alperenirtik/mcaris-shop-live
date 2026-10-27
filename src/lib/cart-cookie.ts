import { cookies } from"next/headers";

const CART_COOKIE_NAME ="cart_id";
const CART_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function getCartId(): Promise<string | undefined> {
  try {
    const store = await cookies();
    return store.get(CART_COOKIE_NAME)?.value;
  } catch {
    return undefined;
  }
}

export async function setCartId(cartId: string): Promise<void> {
  try {
    const store = await cookies();
    store.set(CART_COOKIE_NAME, cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: CART_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
  } catch {
    // Ignore when called outside request scope (e.g. in tests)
  }
}

export async function clearCartId(): Promise<void> {
  try {
    const store = await cookies();
    store.delete(CART_COOKIE_NAME);
  } catch {
    // Ignore when called outside request scope (e.g. in tests)
  }
}
