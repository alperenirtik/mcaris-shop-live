import { prisma } from"./db";

export const FREE_SHIPPING_THRESHOLD = 0;
export const FLAT_SHIPPING_COST = 0;

export async function getShippingSettings(): Promise<{ cost: number; threshold: number }> {
  try {
    const [costSetting, minSetting] = await Promise.all([
      prisma.storeSetting.findUnique({ where: { key:"shipping_cost" } }),
      prisma.storeSetting.findUnique({ where: { key:"free_shipping_min" } }),
    ]);

    return {
      cost: costSetting ? parseFloat(costSetting.value) || 0 : 0,
      threshold: minSetting ? parseFloat(minSetting.value) || 0 : 0,
    };
  } catch {
    return { cost: 0, threshold: 0 };
  }
}

export function calculateShipping(subtotal: number, cost = 0, threshold = 0): number {
  if (threshold > 0 && subtotal >= threshold) {
    return 0;
  }
  return cost;
}
