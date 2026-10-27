"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

interface PurchaseTrackerProps {
  orderId: string;
  total: number;
  shippingCost?: number;
  couponCode?: string | null;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}

export default function PurchaseTracker({
  orderId,
  total,
  shippingCost,
  couponCode,
  items,
}: PurchaseTrackerProps) {
  useEffect(() => {
    trackPurchase({
      transaction_id: orderId,
      value: total,
      shipping: shippingCost || 0,
      coupon: couponCode || undefined,
      items,
    });
  }, [orderId, total, shippingCost, couponCode, items]);

  return null;
}
