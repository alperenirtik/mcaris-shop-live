import type { Metadata } from "next";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { getCartId } from "@/lib/cart-cookie";
import { calculateShipping, getShippingSettings } from "@/lib/shipping";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import type { ProductWithCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sepetim — MCARIS Medikal Ekipman",
  description: "Alışveriş sepetinizdeki medikal ürünler ve sipariş özeti.",
  robots: {
    index: false,
    follow: false,
  },
};



export default async function CartPage() {
  const cartId = await getCartId();
  const cart = cartId ? await getCart(cartId) : null;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-6 py-large text-center">
        <h1 className="text-headline-h2 mb-medium">Sepetiniz Boş</h1>
        <Link href="/urunler" className="text-primary underline">
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  const shippingSettings = await getShippingSettings();
  const shipping = calculateShipping(parseFloat(cart.subtotal), shippingSettings.cost, shippingSettings.threshold);

  return (
    <div className="max-w-container-max mx-auto px-6 py-large grid grid-cols-1 md:grid-cols-[1fr_320px] gap-medium">
      <div>
        <h1 className="text-headline-h2 mb-medium">Sepetim</h1>
        {cart.items.map((item: { id: string; product: ProductWithCategory; quantity: number }) => (
          <CartItemRow key={item.id} itemId={item.id} product={item.product} quantity={item.quantity} />
        ))}
      </div>

      <div className="flex flex-col gap-medium">
        <CartSummary subtotal={cart.subtotal} shipping={shipping} />
        <Link
          href="/checkout"
          className="bg-primary text-white text-headline-h4 px-6 py-3 rounded-lg text-center hover:opacity-90 transition-opacity"
        >
          Ödemeye Geç
        </Link>
      </div>
    </div>
  );
}