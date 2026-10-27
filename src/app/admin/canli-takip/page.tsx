import { requireAdmin } from"@/lib/auth";
import { prisma } from"@/lib/db";
import AdminLiveTrackingClient from"@/components/admin/AdminLiveTrackingClient";

export const dynamic ="force-dynamic";
export const revalidate = 0;

export default async function AdminLiveTrackingPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <AdminLiveTrackingClient orders={orders} />
    </div>
  );
}
