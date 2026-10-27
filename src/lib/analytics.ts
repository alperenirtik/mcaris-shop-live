export const GA_TRACKING_ID = "G-NJJ3NHH3QC";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sayfa Görüntüleme Olayı (SPA Rota Geçişleri İçin)
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: title || document.title,
    send_to: GA_TRACKING_ID,
  });
}

/**
 * Ürün Detay Görüntüleme (view_item)
 */
export function trackViewItem(params: {
  id: string;
  name: string;
  category?: string;
  price: number;
  currency?: string;
}) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "view_item", {
    currency: params.currency || "TRY",
    value: params.price,
    items: [
      {
        item_id: params.id,
        item_name: params.name,
        item_category: params.category || "Medikal Ekipman",
        price: params.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Sepete Ürün Ekleme (add_to_cart)
 */
export function trackAddToCart(params: {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity?: number;
  currency?: string;
}) {
  if (typeof window === "undefined" || !window.gtag) return;

  const qty = params.quantity || 1;

  window.gtag("event", "add_to_cart", {
    currency: params.currency || "TRY",
    value: params.price * qty,
    items: [
      {
        item_id: params.id,
        item_name: params.name,
        item_category: params.category || "Medikal Ekipman",
        price: params.price,
        quantity: qty,
      },
    ],
  });
}

/**
 * Sepetten Ürün Çıkarma (remove_from_cart)
 */
export function trackRemoveFromCart(params: {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity?: number;
  currency?: string;
}) {
  if (typeof window === "undefined" || !window.gtag) return;

  const qty = params.quantity || 1;

  window.gtag("event", "remove_from_cart", {
    currency: params.currency || "TRY",
    value: params.price * qty,
    items: [
      {
        item_id: params.id,
        item_name: params.name,
        item_category: params.category || "Medikal Ekipman",
        price: params.price,
        quantity: qty,
      },
    ],
  });
}

/**
 * Ödeme Adımına Başlama (begin_checkout)
 */
export function trackBeginCheckout(params: {
  value: number;
  currency?: string;
  coupon?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "begin_checkout", {
    currency: params.currency || "TRY",
    value: params.value,
    coupon: params.coupon,
    items: params.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || "Medikal Ekipman",
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Satın Alma / Başarılı Sipariş (purchase)
 */
export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  currency?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "purchase", {
    transaction_id: params.transaction_id,
    currency: params.currency || "TRY",
    value: params.value,
    tax: params.tax || 0,
    shipping: params.shipping || 0,
    coupon: params.coupon,
    items: params.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || "Medikal Ekipman",
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Site İçi Arama (search)
 */
export function trackSearch(searchTerm: string) {
  if (typeof window === "undefined" || !window.gtag || !searchTerm) return;

  window.gtag("event", "search", {
    search_term: searchTerm,
  });
}
