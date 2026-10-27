"use client";

import { useEffect } from "react";

export default function CartClearer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (process.env.NODE_ENV === "test") {
      window.dispatchEvent(new Event("mcaris_cart_updated"));
      return;
    }

    fetch("/api/sepet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    })
      .then(() => {
        window.dispatchEvent(new Event("mcaris_cart_updated"));
      })
      .catch(() => {});
  }, []);

  return null;
}
