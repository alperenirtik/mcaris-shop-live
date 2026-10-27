import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import DriverPanelClient from "@/components/driver/DriverPanelClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Şoför & Teslimat Mobil Paneli — MCARIS Medikal",
  description: "Şoför ve teknik ekibin tek tıkla canlı konum paylaşarak teslimat takibini başlattığı mobil panel.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function DriverPage() {
  await requireAdmin();

  const activeOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ["paid","pending","shipped"],
      },
    },
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      shippingAddress: true,
      status: true,
      total: true,
    },
    orderBy: { createdAt:"desc" },
    take: 20,
  });

  return (
    <div className="bg-slate-100 min-h-screen py-8 md:py-12 px-4">
      <DriverPanelClient orders={activeOrders} />
    </div>
  );
}
