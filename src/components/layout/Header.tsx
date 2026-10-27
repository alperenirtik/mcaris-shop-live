import { getCurrentUser } from "@/lib/auth";
import { getCartId } from "@/lib/cart-cookie";
import { getCartItemCount } from "@/lib/cart";
import { getCategories } from "@/lib/categories";
import HeaderClient from "./HeaderClient";
import TopBar from "./TopBar";

export default async function Header() {
  const user = await getCurrentUser();
  const cartId = await getCartId();
  const cartItemCount = await getCartItemCount(cartId);
  const categories = await getCategories();

  return (
    <>
      <TopBar />
      <HeaderClient
        user={user}
        cartItemCount={cartItemCount}
        categories={categories}
      />
    </>
  );
}