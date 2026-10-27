import { getPaymentsStats } from"@/lib/orders";
import { prisma } from"@/lib/db";
import PaymentManagerClient from"./PaymentManagerClient";

export const dynamic ="force-dynamic";
export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const [stats, orders] = await Promise.all([
    getPaymentsStats(),
    prisma.order.findMany({
      select: {
        id: true,
        status: true,
        customerName: true,
        customerEmail: true,
        total: true,
        iyzicoToken: true,
        iyzicoPaymentId: true,
        failureReason: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <PaymentManagerClient
      stats={stats}
      orders={orders.map((o) => {
        const isIyzico = o.iyzicoToken?.startsWith("iyz-");
        return {
          id: o.id,
          status: o.status,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          total: o.total.toString(),
          paymentProvider: o.iyzicoToken ? (isIyzico ? "iyzico" : "paytr") : "havale",
          paymentToken: o.iyzicoToken,
          paymentId: o.iyzicoPaymentId,
          iyzicoToken: o.iyzicoToken,
          iyzicoPaymentId: o.iyzicoPaymentId,
          failureReason: o.failureReason,
          createdAt: o.createdAt,
        };
      })}
    />
  );
}
