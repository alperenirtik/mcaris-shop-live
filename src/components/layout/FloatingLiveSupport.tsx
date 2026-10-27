"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { BUSINESS_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";

export default function FloatingLiveSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Hide completely on admin and driver panels
  const isAdminOrDriver = pathname ? pathname.startsWith("/admin") || pathname.startsWith("/sofor") : false;
  // Check if we are on a product detail page where ProductStickyMobileBar is active on mobile
  const isProductPage = pathname ? pathname.startsWith("/urun/") : false;

  // Sayfa açılışından 2 saniye sonra danışma penceresi otomatik olarak açılsın (bu oturumda kapatılmamışsa)
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem("mcaris_live_support_dismissed") === "true") {
        return;
      }
    } catch {
      // sessionStorage erişim kısıtı durumunda sessizce devam et
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Dışarı tıklandığında popover'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("mcaris_live_support_dismissed", "true");
      }
    } catch {
      // ignore
    }
  }

  if (isAdminOrDriver) return null;

  const waNum = WHATSAPP_NUMBER || "905368200269";
  const phone = BUSINESS_PHONE || "0536 820 02 69";
  const defaultMessage = "Merhaba, hasta karyolası ve medikal ürünler hakkında detaylı bilgi ve fiyat almak istiyorum.";

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-20 lg:bottom-8 right-4 sm:right-6 z-40 font-sans select-none ${
        isProductPage ? "hidden lg:block" : "block"
      }`}
    >
      {/* Popover Quick Help Modal (Modern Aydınlık Kurumsal Tema) */}
      {isOpen && (
        <div className="mb-3 bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 w-[300px] sm:w-80 text-neutral-900 animate-in fade-in slide-in-from-bottom-3 duration-200 relative shadow-2xl shadow-neutral-900/15">
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Destek penceresini kapat"
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* Online Status Badge */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-700 tracking-tight">
              Canlı Danışma Hattı • Çevrim İçi
            </span>
          </div>

          <p className="text-sm font-bold text-neutral-950">
            Size Nasıl Yardımcı Olabiliriz?
          </p>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
            Hasta yatağı seçimi, teknik özellikler veya Ankara içi aynı gün teslimat hakkında uzmanımıza hemen danışın.
          </p>

          {/* Action CTAs */}
          <div className="mt-4 space-y-2">
            <a
              href={`https://wa.me/${waNum}?text=${encodeURIComponent(defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              <span>WhatsApp ile Danış</span>
            </a>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="w-full flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border border-neutral-200 active:scale-98 cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-700">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Telefonla Ara: {phone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button (Header Style Rounded-Full Capsule) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Canlı Danışma ve Destek Hattı"
        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white h-11 px-4 sm:px-5 rounded-full shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#20ba59]/30 transition-all duration-300 active:scale-98 group cursor-pointer border border-[#25D366]/30"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="shrink-0 transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
        <span className="font-bold text-xs sm:text-sm tracking-tight whitespace-nowrap">
          WhatsApp Danışma
        </span>
      </button>
    </div>
  );
}
