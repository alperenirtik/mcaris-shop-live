"use client";

/**
 * SEO paneli iletişim tıklama sayacı (WhatsApp / telefon).
 * Ads gtag dönüşümlerinden bağımsızdır.
 */
import { useEffect } from "react";

const ENDPOINT = "https://seo.mcaris.com.tr/api-contact-click";
const SECRET = "mcarisContactClick9kL2pQw7nR4vX8mH1sT6yB0dF!";
const SITE = "shop.mcaris.com.tr";

export default function ContactClickTracker() {
  useEffect(() => {
    const w = window as Window & { __mcarisContactClickInstalled?: boolean };
    if (w.__mcarisContactClickInstalled) return;
    w.__mcarisContactClickInstalled = true;

    const send = (type: "whatsapp" | "phone") => {
      try {
        const body = JSON.stringify({
          site: SITE,
          type,
          path: `${location.pathname || "/"}${location.search || ""}`,
        });
        void fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Contact-Click-Secret": SECRET,
          },
          body,
          keepalive: true,
          mode: "cors",
          credentials: "omit",
        }).catch(() => {});
      } catch {
        /* ignore */
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
        send("whatsapp");
      } else if (/^tel:/i.test(href)) {
        send("phone");
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
