import { prisma } from"@/lib/db";
import { getShippingSettings } from"@/lib/shipping";
import AdminCouponsClient from"./AdminCouponsClient";

export const dynamic ="force-dynamic";
export const revalidate = 0;

export default async function AdminCouponsPage() {
  let coupons: Array<{
    id: string;
    code: string;
    type: string;
    value: number;
    minSubtotal: number | null;
    description: string;
    isActive: boolean;
    createdAt: Date;
  }> = [];

  let shippingSettings = { cost: 0, threshold: 0 };
  
  try {
    const dbCoupons = await prisma.coupon.findMany({
      orderBy: { createdAt:"desc" },
    });

    coupons = dbCoupons.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: Number(c.value),
      minSubtotal: c.minSubtotal ? Number(c.minSubtotal) : null,
      description: c.description,
      isActive: c.isActive,
      createdAt: c.createdAt,
    }));

    shippingSettings = await getShippingSettings();
  } catch (err: unknown) {
    console.error("Kupon veya kargo ayarları getirme hatası:", err);
  }

  return <AdminCouponsClient coupons={coupons} shippingSettings={shippingSettings} />;
}
