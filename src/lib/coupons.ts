import { prisma } from"@/lib/db";

export interface Coupon {
  id?: string;
  code: string;
  type:"percentage" |"fixed";
  value: number;
  minSubtotal?: number | null;
  description: string;
  isActive?: boolean;
}

export const FALLBACK_COUPONS: Record<string, Coupon> = {
  MCARIS900: {
    code: "MCARIS900",
    type: "fixed",
    value: 900,
    minSubtotal: 900,
    description: "900 TL Net İndirim",
    isActive: true,
  },
  FIRSAT900: {
    code: "FIRSAT900",
    type: "fixed",
    value: 900,
    minSubtotal: 900,
    description: "900 TL Özel Fırsat İndirimi",
    isActive: true,
  },
  HOSGELDIN200: {
    code: "HOSGELDIN200",
    type: "fixed",
    value: 200,
    minSubtotal: 1000,
    description: "1.000 TL üzeri 200 TL Net İndirim",
    isActive: true,
  },
  SAGLIK15: {
    code: "SAGLIK15",
    type: "percentage",
    value: 15,
    minSubtotal: 2500,
    description: "2.500 TL üzeri %15 Medikal İndirimi",
    isActive: true,
  },
};

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discountAmount: number;
  discountType?:"percentage" |"fixed";
  discountValue?: number;
  description?: string;
  message: string;
}

export function validateCoupon(inputCode: string, subtotal: number): CouponValidationResult {
  const code = (inputCode ||"").trim().toUpperCase();

  if (!code) {
    return { valid: false, discountAmount: 0, message:"Lütfen bir kupon kodu giriniz." };
  }

  const coupon = FALLBACK_COUPONS[code];

  if (!coupon || coupon.isActive === false) {
    return { valid: false, discountAmount: 0, message:"Geçersiz, pasif veya süresi dolmuş kupon kodu." };
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Bu kupon en az ${coupon.minSubtotal.toLocaleString("tr-TR")} ₺ tutarındaki sepetlerde geçerlidir.`,
    };
  }

  let discountAmount = 0;
  if (coupon.type ==="percentage") {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    valid: true,
    code: coupon.code,
    discountAmount,
    discountType: coupon.type,
    discountValue: coupon.value,
    description: coupon.description,
    message: `'${coupon.code}' kuponu uygulandı: ${coupon.description}`,
  };
}

export async function validateCouponFromDb(inputCode: string, subtotal: number): Promise<CouponValidationResult> {
  const code = (inputCode ||"").trim().toUpperCase();

  if (!code) {
    return { valid: false, discountAmount: 0, message:"Lütfen bir kupon kodu giriniz." };
  }

  try {
    const dbCoupon = await prisma.coupon.findUnique({ where: { code } });

    if (!dbCoupon || !dbCoupon.isActive) {
      return { valid: false, discountAmount: 0, message:"Geçersiz, pasif veya kapalı kupon kodu." };
    }

    const minSub = dbCoupon.minSubtotal ? Number(dbCoupon.minSubtotal) : null;
    if (minSub && subtotal < minSub) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Bu kupon en az ${minSub.toLocaleString("tr-TR")} ₺ tutarındaki sepetlerde geçerlidir.`,
      };
    }

    const valueNum = Number(dbCoupon.value);
    let discountAmount = 0;
    if (dbCoupon.type === "percentage") {
      discountAmount = Math.round(((subtotal * valueNum) / 100 + Number.EPSILON) * 100) / 100;
    } else {
      discountAmount = Math.round((valueNum + Number.EPSILON) * 100) / 100;
    }

    discountAmount = Math.min(discountAmount, subtotal);

    return {
      valid: true,
      code: dbCoupon.code,
      discountAmount,
      discountType: dbCoupon.type as "percentage" | "fixed",
      discountValue: valueNum,
      description: dbCoupon.description,
      message: `'${dbCoupon.code}' kuponu uygulandı: ${dbCoupon.description}`,
    };
  } catch (error) {
    console.error("Kupon doğrulama veritabanı hatası:", error);
    return validateCoupon(inputCode, subtotal);
  }
}
