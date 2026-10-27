import { prisma } from "./db";
import { OrderStatus, Prisma } from "@prisma/client";
import { calculateShipping, getShippingSettings } from "./shipping";
import { validateCouponFromDb } from "./coupons";

export interface DeliveryInfo {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  userId?: string | null;
}

export async function getOrdersWithDetails(filters?: {
  status?: OrderStatus | "";
  query?: string;
}) {
  const where: Prisma.OrderWhereInput = {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.query
      ? {
          OR: [
            { id: { contains: filters.query, mode: "insensitive" } },
            { customerName: { contains: filters.query, mode: "insensitive" } },
            { customerEmail: { contains: filters.query, mode: "insensitive" } },
            { customerPhone: { contains: filters.query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  return prisma.order.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true, images: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!currentOrder) {
      throw new Error("Sipariş bulunamadı.");
    }

    const previousStatus = currentOrder.status;

    // Transitioning from pending to an active confirmed status (paid / shipped / completed)
    if (
      previousStatus === "pending" &&
      (status === "paid" || status === "shipped" || status === "completed")
    ) {
      for (const item of currentOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // Transitioning from an active paid status back to cancelled/failed -> restore stock
    if (
      (previousStatus === "paid" || previousStatus === "shipped" || previousStatus === "completed") &&
      (status === "cancelled" || status === "failed")
    ) {
      for (const item of currentOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: { status },
    });
  });
}

export async function deleteOrder(id: string) {
  return prisma.order.delete({
    where: { id },
  });
}

export async function createAdminOrder(data: {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  userId?: string | null;
  items: { productId: string; quantity: number }[];
}) {
  if (data.items.length === 0) {
    throw new Error("Siparişte en az 1 ürün bulunmalıdır.");
  }

  return prisma.$transaction(async (tx) => {
    const productIds = data.items.map((i) => i.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = new Prisma.Decimal(0);
    const orderItemsData = [];

    for (const item of data.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`ID: ${item.productId} olan ürün bulunamadı.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`'${product.name}' için yetersiz stok (Mevcut: ${product.stock}, İstenen: ${item.quantity}).`);
      }

      const itemTotal = product.price.mul(item.quantity);
      subtotal = subtotal.add(itemTotal);

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineTotal: itemTotal,
      });

      // Atomically decrement stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const shippingCost = new Prisma.Decimal(0);
    const total = subtotal.add(shippingCost);

    return tx.order.create({
      data: {
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone.trim(),
        customerEmail: data.customerEmail.trim().toLowerCase(),
        shippingAddress: data.shippingAddress.trim(),
        userId: data.userId || null,
        status: "paid",
        subtotal,
        discountAmount: new Prisma.Decimal(0),
        shippingCost,
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  });
}

export async function getPaymentsStats() {
  const [allOrders, paidOrdersCount, pendingOrdersCount, failedOrdersCount] = await Promise.all([
    prisma.order.findMany({
      select: { status: true, total: true },
    }),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "failed" } }),
  ]);

  let totalRevenue = new Prisma.Decimal(0);
  for (const order of allOrders) {
    if (order.status === "paid" || order.status === "completed" || order.status === "shipped") {
      totalRevenue = totalRevenue.add(order.total);
    }
  }

  return {
    totalOrders: allOrders.length,
    totalOrdersCount: allOrders.length,
    paidOrdersCount,
    pendingOrdersCount,
    failedOrdersCount,
    totalRevenue: totalRevenue.toString(),
  };
}

export async function createPendingOrder(
  cartId: string,
  delivery: DeliveryInfo,
  couponCode?: string | null
): Promise<{ ok: true; order: { id: string; total: string; accessToken: string } } | { ok: false; error: "EMPTY_CART" | "OUT_OF_STOCK" }> {
  return prisma.$transaction(
    async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) return { ok: false, error: "EMPTY_CART" as const };

      const products = await Promise.all(
        cart.items.map((item) => tx.product.findUnique({ where: { id: item.productId } }))
      );

      for (let i = 0; i < cart.items.length; i++) {
        const item = cart.items[i];
        const product = products[i];
        if (!product || item.quantity > product.stock) return { ok: false, error: "OUT_OF_STOCK" as const };
      }

      const itemsWithProduct = cart.items.map((item, i) => ({ item, product: products[i]! }));

      const subtotalKurus = itemsWithProduct.reduce(
        (sum, { item, product }) =>
          sum + Math.round((parseFloat(product.price.toString()) + Number.EPSILON) * 100) * item.quantity,
        0
      );
      const subtotal = subtotalKurus / 100;

      // Validate coupon on server-side if provided
      let discountAmount = 0;
      let appliedCouponCode: string | null = null;
      if (couponCode) {
        const couponRes = await validateCouponFromDb(couponCode, subtotal);
        if (couponRes.valid) {
          discountAmount = couponRes.discountAmount;
          appliedCouponCode = couponRes.code || couponCode;
        }
      }

      const shippingSettings = await getShippingSettings();
      const discountedSubtotal = Math.max(
        0,
        Math.round((subtotal - discountAmount + Number.EPSILON) * 100) / 100
      );
      const shippingCost = calculateShipping(discountedSubtotal, shippingSettings.cost, shippingSettings.threshold);
      const total = Math.round((discountedSubtotal + shippingCost + Number.EPSILON) * 100) / 100;

      const order = await tx.order.create({
        data: {
          status: "pending",
          userId: delivery.userId || null,
          customerName: delivery.customerName,
          customerPhone: delivery.customerPhone,
          customerEmail: delivery.customerEmail,
          shippingAddress: delivery.shippingAddress,
          carrier: "MCARIS Özel Medikal Filosu",
          estimatedDelivery: "Aynı Gün / Gün İçinde Teslimat",
          subtotal: new Prisma.Decimal(subtotal.toFixed(2)),
          discountAmount: new Prisma.Decimal(discountAmount.toFixed(2)),
          couponCode: appliedCouponCode,
          shippingCost: new Prisma.Decimal(shippingCost.toFixed(2)),
          total: new Prisma.Decimal(total.toFixed(2)),
          items: {
            create: itemsWithProduct.map(({ item, product }) => ({
              productId: item.productId,
              productName: product.name,
              unitPrice: product.price,
              quantity: item.quantity,
              lineTotal: new Prisma.Decimal((parseFloat(product.price.toString()) * item.quantity).toFixed(2)),
            })),
          },
        },
      });

      return {
        ok: true as const,
        order: { id: order.id, total: order.total.toString(), accessToken: order.accessToken },
      };
    },
    {
      maxWait: 15000,
      timeout: 25000,
    }
  );
}

export async function getOrderByAccessToken(accessToken: string) {
  if (!accessToken) return null;
  return prisma.order.findUnique({
    where: {
      accessToken,
    },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, images: true },
          },
        },
      },
    },
  });
}
