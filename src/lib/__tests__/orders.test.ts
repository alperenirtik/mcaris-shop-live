import { describe, it, expect, beforeAll, afterAll } from"vitest";
import { prisma } from"../db";
import { getOrCreateCart, addToCart } from"../cart";
import { createPendingOrder, getOrderByAccessToken } from"../orders";
import { createProduct } from"../products";

const delivery = {
  customerName:"Ada Lovelace",
  customerPhone:"+905551112233",
  customerEmail:"ada@example.com",
  shippingAddress:"Test Mah. Test Sk. No:1, İstanbul",
};

async function cleanupTestProductsAndOrders() {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        product: {
          slug: { in: ["test-order-product-1","test-order-product-2"] },
        },
      },
    });
    await prisma.orderItem.deleteMany({
      where: {
        OR: [
          { order: { customerEmail:"ada@example.com" } },
          { product: { slug: { in: ["test-order-product-1","test-order-product-2"] } } },
        ],
      },
    });
    await prisma.order.deleteMany({ where: { customerEmail:"ada@example.com" } });
    await prisma.product.deleteMany({
      where: {
        slug: { in: ["test-order-product-1","test-order-product-2"] },
      },
    });
  } catch (err) {
    console.error("Test cleanup error:", err);
  }
}

describe("createPendingOrder", () => {
  const TEST_SLUG_1 ="test-order-product-1";
  const TEST_SLUG_2 ="test-order-product-2";

  beforeAll(async () => {
    await cleanupTestProductsAndOrders();

    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: { name:"Medikal Yataklar", slug:"medikal-yataklar" },
      });
    }

    await createProduct({
      name:"Test Elektrikli Hasta Yatağı Pro",
      slug: TEST_SLUG_1,
      price:"24999.00",
      description:"Test",
      categoryId: category.id,
      stock: 10,
    });

    await createProduct({
      name:"Test Manuel Hasta Yatağı Standart",
      slug: TEST_SLUG_2,
      price:"8999.00",
      description:"Test",
      categoryId: category.id,
      stock: 5,
    });
  });

  it("rejects an empty cart", async () => {
    const cart = await prisma.cart.create({ data: {} });
    const result = await createPendingOrder(cart.id, delivery);
    expect(result).toEqual({ ok: false, error:"EMPTY_CART" });
  });

  it("creates a pending order with correct totals and snapshots product name/price", async () => {
    const cart = await prisma.cart.create({ data: {} });
    const product = await prisma.product.findFirst({ where: { slug: TEST_SLUG_1 } });
    await addToCart(cart.id, product!.id, 1);

    const result = await createPendingOrder(cart.id, delivery);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const order = await prisma.order.findUnique({ where: { id: result.order.id }, include: { items: true } });
    expect(order?.status).toBe("pending");
    expect(order?.items[0].productName).toBe(product!.name);
    expect(order?.items[0].unitPrice.toString()).toBe(product!.price.toString());
  });

  it("rejects when a cart item now exceeds available stock", async () => {
    const cart = await prisma.cart.create({ data: {} });
    let product = await prisma.product.findFirst({ where: { slug: TEST_SLUG_2 } });
    if (product && product.stock < 1) {
      product = await prisma.product.update({ where: { id: product.id }, data: { stock: 5 } });
    }
    await addToCart(cart.id, product!.id, 1);
    await prisma.product.update({ where: { id: product!.id }, data: { stock: 0 } });

    const result = await createPendingOrder(cart.id, delivery);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("OUT_OF_STOCK");

    await prisma.product.update({ where: { id: product!.id }, data: { stock: 5 } });
  });

  afterAll(async () => {
    await cleanupTestProductsAndOrders();
    await prisma.$disconnect();
  });
});

describe("getOrderByAccessToken", () => {
  it("returns null for an unknown token", async () => {
    const result = await getOrderByAccessToken("does-not-exist");
    expect(result).toBeNull();
  });
});

afterAll(async () => {
  await cleanupTestProductsAndOrders();
  await prisma.$disconnect();
});
