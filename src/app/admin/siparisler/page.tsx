import { getOrdersWithDetails } from"@/lib/orders";
import { prisma } from"@/lib/db";
import OrderManagerClient from"./OrderManagerClient";

export const dynamic ="force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const [orders, products] = await Promise.all([
    getOrdersWithDetails(),
    prisma.product.findMany({
      select: { id: true, name: true, price: true },
      orderBy: { name:"asc" },
    }),
  ]);

  return (
    <OrderManagerClient
      orders={orders.map((o) => ({
        id: o.id,
        status: o.status,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerEmail: o.customerEmail,
        shippingAddress: o.shippingAddress,
        subtotal: o.subtotal.toString(),
        shippingCost: o.shippingCost.toString(),
        total: o.total.toString(),
        iyzicoToken: o.iyzicoToken,
        iyzicoPaymentId: o.iyzicoPaymentId,
        failureReason: o.failureReason,
        invoiceUrl: o.invoiceUrl,
        createdAt: o.createdAt,
        user: o.user,
        items: o.items.map((i) => ({
          id: i.id,
          productName: i.productName,
          unitPrice: i.unitPrice.toString(),
          quantity: i.quantity,
          product: i.product,
        })),
      }))}
      availableProducts={products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price.toString(),
      }))}
    />
  );
}
