"use server";

import { revalidatePath } from"next/cache";
import { updateCartItemQuantity, removeFromCart } from"@/lib/cart";
import { getCartId } from"@/lib/cart-cookie";

export async function updateQuantityAction(formData: FormData): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) return;

  const itemId = formData.get("itemId") as string;
  const quantity = Number(formData.get("quantity"));

  if (!itemId || isNaN(quantity)) return;

  await updateCartItemQuantity(cartId, itemId, quantity);
  revalidatePath("/sepet");
}

export async function removeItemAction(formData: FormData): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) return;

  const itemId = formData.get("itemId") as string;
  if (!itemId) return;

  await removeFromCart(cartId, itemId);
  revalidatePath("/sepet");
}

export { removeItemAction as removeFromCartAction };