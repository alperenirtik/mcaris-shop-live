"use client";

import { useEffect } from "react";

const WHATSAPP_CONVERSION = "AW-18090129163/WJjZCOuS66YcEIvuhbJD";
const PHONE_CONVERSION = "AW-18090129163/9_SiCJSA1aYcEIvuhbJD";

export default function AdsConversionTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      let send = "";
      if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) send = WHATSAPP_CONVERSION;
      else if (/^tel:/i.test(href)) send = PHONE_CONVERSION;
      if (!send || typeof window.gtag !== "function") return;
      window.gtag("event", "conversion", {
        send_to: send,
        transport_type: "beacon",
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
