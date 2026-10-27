import { describe, it, expect, beforeAll, afterAll } from"vitest";
import { getOrCreateCart, getCart, addToCart, updateCartItemQuantity, removeFromCart } from"../cart";
import { prisma } from"../db";

describe("cart", () => {
  const TEST_SLUG ="test-cart-product-slug";

  async function getTestProduct() {
    let product = await prisma.product.findFirst({ where: { slug: TEST_SLUG } });
    if (!product) {
      let category = await prisma.category.findFirst();
      if (!category) {
        category = await prisma.category.create({
          data: { name:"Test Kategori", slug:"test-kategori" },
        });
      }
      product = await prisma.product.create({
        data: {
          name:"Test Cart Dedicated Product",
          slug: TEST_SLUG,
          price:"1000.00",
          description:"Test ürün açıklaması",
          categoryId: category.id,
          stock: 100,
          specs: {},
        },
      });
    }
    return product;
  }

  beforeAll(async () => {
    await getTestProduct();
  });

  it("creates and retrieves a cart", async () => {
    const cart = await getOrCreateCart();
    expect(cart.id).toBeDefined();

    const fetched = await getCart(cart.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.items).toEqual([]);
  });

  it("adds an item to cart and updates quantity", async () => {
    const cart = await getOrCreateCart();
    const product = await getTestProduct();

    const addResult = await addToCart(cart.id, product.id, 1);
    expect(addResult).toEqual({ ok: true });

    const fetched = await getCart(cart.id);
    expect(fetched?.items).toHaveLength(1);
    expect(fetched?.items[0].product.id).toBe(product.id);
    expect(fetched?.items[0].quantity).toBe(1);
  });

  it("updates quantity and removes an item", async () => {
    const cart = await getOrCreateCart();
    const product = await getTestProduct();
    await addToCart(cart.id, product.id, 1);

    const before = await getCart(cart.id);
    const item = before!.items.find((i: { product: { id: string }; id: string }) => i.product.id === product.id);
    expect(item).toBeDefined();

    await updateCartItemQuantity(cart.id, item!.id, 3);
    const afterUpdate = await getCart(cart.id);
    expect(afterUpdate?.items.find((i: { id: string }) => i.id === item!.id)?.quantity).toBe(3);

    await removeFromCart(cart.id, item!.id);
    const afterRemove = await getCart(cart.id);
    expect(afterRemove?.items).toHaveLength(0);
  });

  it("computes subtotal as the sum of line totals", async () => {
    const cart = await prisma.cart.create({ data: {} });
    const product = await getTestProduct();
    await addToCart(cart.id, product.id, 2);

    const result = await getCart(cart.id);
    const expected = (parseFloat(product.price.toString()) * 2).toFixed(2);
    expect(result?.subtotal).toBe(expected);
  });

  it("rejects invalid quantity when adding item", async () => {
    const cart = await getOrCreateCart();
    const product = await getTestProduct();

    const zeroResult = await addToCart(cart.id, product.id, 0);
    expect(zeroResult).toEqual({ ok: false, error:"INVALID_QUANTITY" });

    const negativeResult = await addToCart(cart.id, product.id, -5);
    expect(negativeResult).toEqual({ ok: false, error:"INVALID_QUANTITY" });
  });

  it("throws when updating cart item with invalid quantity", async () => {
    const cart = await getOrCreateCart();
    const product = await getTestProduct();
    await addToCart(cart.id, product.id, 1);
    const before = await getCart(cart.id);
    let item = before?.items.find((i: { product: { id: string }; id: string }) => i.product.id === product.id) || before?.items[0];
    if (!item) {
      await addToCart(cart.id, product.id, 1);
      const after = await getCart(cart.id);
      item = after?.items[0];
    }
    expect(item).toBeDefined();

    await expect(updateCartItemQuantity(cart.id, item!.id, 0)).rejects.toThrow("Cart item quantity must be greater than 0");
    await expect(updateCartItemQuantity(cart.id, item!.id, -1)).rejects.toThrow("Cart item quantity must be greater than 0");
  });

  it("throws when updating/removing non-existent cart item", async () => {
    const cart = await getOrCreateCart();
    const fakeItemId ="nonexistent-id-12345";

    await expect(updateCartItemQuantity(cart.id, fakeItemId, 5)).rejects.toThrow("Cart item not found");
    await expect(removeFromCart(cart.id, fakeItemId)).rejects.toThrow("Cart item not found");
  });

  it("throws when trying to operate on cart item from different cart", async () => {
    const cart1 = await getOrCreateCart();
    const cart2 = await getOrCreateCart();
    const product = await getTestProduct();
    await prisma.product.update({ where: { id: product.id }, data: { stock: 100 } });

    await addToCart(cart1.id, product.id, 1);
    const cart1Items = await getCart(cart1.id);
    const itemId = cart1Items!.items[0].id;

    await expect(updateCartItemQuantity(cart2.id, itemId, 3)).rejects.toThrow("Cart item not found");
    await expect(removeFromCart(cart2.id, itemId)).rejects.toThrow("Cart item not found");
  });

  afterAll(async () => {
    try {
      await prisma.cartItem.deleteMany({});
      await prisma.product.deleteMany({ where: { slug: TEST_SLUG } });
    } catch {}
    await prisma.$disconnect();
  });
});
