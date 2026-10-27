"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";

interface ProductViewTrackerProps {
  id: string;
  name: string;
  price: number;
  categoryName?: string;
}

export default function ProductViewTracker({
  id,
  name,
  price,
  categoryName,
}: ProductViewTrackerProps) {
  useEffect(() => {
    trackViewItem({
      id,
      name,
      price,
      category: categoryName,
    });
  }, [id, name, price, categoryName]);

  return null;
}
