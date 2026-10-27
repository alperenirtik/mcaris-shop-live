import Link from "next/link";
import { BUSINESS_PHONE } from "@/lib/constants";

export default function TopBar() {
  return (
    <div className="w-full bg-[#f8fafc] border-b border-neutral-200/80 text-xs font-medium font-inter text-neutral-600 select-none z-50">
      <div className="max-w-container-max mx-auto px-4 sm:px-6">
        {/* Desktop TopBar (md+) */}
        <div className="hidden md:flex items-center justify-between h-8">
          {/* Left: Ankara Logistics & Support Info */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-neutral-800 font-semibold">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-700 shrink-0"
              >
                <rect x="1" y="3" width="15" height="13" rx="1.5" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Ankara İçi Gün İçinde Ücretsiz Teslimat &amp; Montaj</span>
            </span>

            <span className="text-neutral-300 select-none">•</span>

            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors group"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-400 group-hover:text-neutral-700 transition-colors"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>7/24 Destek: 0536 820 02 69</span>
            </a>
          </div>

          {/* Right: Curated Support & Order Tracking with Faint Dots */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/ankara-hasta-yatagi"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Ankara Hasta Yatağı
            </Link>
            <span className="text-neutral-300 select-none text-[10px]">•</span>
            <Link
              href="/blog"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Medikal Blog
            </Link>
            <span className="text-neutral-300 select-none text-[10px]">•</span>
            <Link
              href="/sss"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              SSS
            </Link>
            <span className="text-neutral-300 select-none text-[10px]">•</span>
            <Link
              href="/hakkimizda"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Hakkımızda
            </Link>
            <span className="text-neutral-300 select-none text-[10px]">•</span>
            <Link
              href="/iletisim"
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              İletişim
            </Link>

            <span className="text-neutral-300 select-none mx-1">|</span>

            <Link
              href="/siparis-takip"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 hover:text-neutral-950 font-semibold transition-all shadow-2xs active:scale-98"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-neutral-600"
              >
                <rect x="1" y="3" width="15" height="13" rx="1.5" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Sipariş Takibi</span>
            </Link>
          </div>
        </div>

        {/* Mobile Mini Announcement Strip (<md) */}
        <div className="flex md:hidden items-center justify-between h-7 text-xs">
          <span className="inline-flex items-center gap-1.5 text-neutral-800 font-semibold truncate">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-neutral-700 shrink-0"
            >
              <rect x="1" y="3" width="15" height="13" rx="1.5" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="truncate">Ankara İçi Gün İçinde Teslimat &amp; Kurulum</span>
          </span>

          <a
            href={`tel:${BUSINESS_PHONE}`}
            aria-label="0536 820 02 69 Numarasını Ara"
            className="text-neutral-700 hover:text-neutral-950 shrink-0 font-semibold flex items-center gap-1 ml-2"
          >
            <span>Hemen Ara</span>
          </a>
        </div>
      </div>
    </div>
  );
}
