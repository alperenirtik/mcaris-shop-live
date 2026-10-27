"use server";

import { revalidatePath } from"next/cache";
import { redirect } from"next/navigation";
import { getOrCreateCart, addToCart } from"@/lib/cart";
import { getCartId, setCartId } from"@/lib/cart-cookie";

export type AddToCartResult = { ok: true } | { ok: false; error: string };

export async function addToCartAction(
  _prevState: AddToCartResult | null,
  formData: FormData
): Promise<AddToCartResult> {
  const productId = formData.get("productId") as string;
  const redirectToCart = formData.get("redirectToCart") ==="true";
  const cart = await getOrCreateCart(await getCartId());
  await setCartId(cart.id);
  const result = await addToCart(cart.id, productId, 1);

  if (!result.ok) {
    const errorMap: Record<string, string> = {
      OUT_OF_STOCK:"Stokta yeterli ürün yok",
      NOT_FOUND:"Ürün bulunamadı",
      INVALID_QUANTITY:"Geçersiz miktar",
    };
    return { ok: false, error: errorMap[result.error] ||"Sepete ekleme başarısız" };
  }

  revalidatePath("/sepet");

  if (redirectToCart) {
    redirect("/checkout");
  }

  return { ok: true };
}
