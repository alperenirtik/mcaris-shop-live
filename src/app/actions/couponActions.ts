"use server";

import { validateCouponFromDb, CouponValidationResult } from "@/lib/coupons";

export async function validateCouponAction(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  return validateCouponFromDb(code, subtotal);
}
