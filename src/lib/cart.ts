import { Prisma } from"@prisma/client";
import { prisma } from"./db";
import { PRODUCT_INCLUDE, serializeProduct } from"./products";

export async function getOrCreateCart(cartId?: string): Promise<{ id: string }> {
  if (!prisma.cart) return { id:"" };
  if (cartId) {
    const existing = await prisma.cart.findUnique({ where: { id: cartId } });
    if (existing) return { id: existing.id };
  }
  return prisma.cart.create({ data: {} });
}

export async function addToCart(
  cartId: string,
  productId: string,
  quantity: number
): Promise<{ ok: true } | { ok: false; error:"OUT_OF_STOCK" |"NOT_FOUND" |"INVALID_QUANTITY" }> {
  if (quantity <= 0) return { ok: false, error:"INVALID_QUANTITY" };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false, error:"NOT_FOUND" };

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });
  const requestedTotal = (existingItem?.quantity ?? 0) + quantity;
  if (requestedTotal > product.stock) return { ok: false, error:"OUT_OF_STOCK" };

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    update: { quantity: requestedTotal },
    create: { cartId, productId, quantity },
  });
  return { ok: true };
}

export async function updateCartItemQuantity(cartId: string, itemId: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    throw new Error("Cart item quantity must be greater than 0");
  }

  try {
    await prisma.cartItem.update({
      where: { id: itemId, cartId },
      data: { quantity },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code ==="P2025") {
      throw new Error("Cart item not found");
    }
    throw error;
  }
}

export async function removeFromCart(cartId: string, itemId: string): Promise<void> {
  try {
    await prisma.cartItem.delete({ where: { id: itemId, cartId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code ==="P2025") {
      throw new Error("Cart item not found");
    }
    throw error;
  }
}

export async function clearCart(cartId: string): Promise<void> {
  if (!prisma.cartItem) return;
  try {
    await prisma.cartItem.deleteMany({ where: { cartId } });
  } catch (error) {
    console.error("Sepet boşaltılırken hata:", error);
  }
}

export async function getCart(cartId: string) {
  if (!prisma.cart) return null;
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: { include: PRODUCT_INCLUDE } } } },
  });
  if (!cart) return null;

  const items = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: serializeProduct(item.product),
  }));
  const subtotalKurus = items.reduce(
    (sum, item) => sum + Math.round((parseFloat(item.product.price) + Number.EPSILON) * 100) * item.quantity,
    0
  );
  const subtotal = (subtotalKurus / 100).toFixed(2);

  return { items, subtotal };
}

export async function getCartItemCount(cartId?: string): Promise<number> {
  if (!cartId || !prisma.cartItem) return 0;
  try {
    const result = await prisma.cartItem.aggregate({
      where: { cartId },
      _sum: { quantity: true },
    });
    return result._sum?.quantity ?? 0;
  } catch {
    return 0;
  }
}

