"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AuthPayload } from "@/lib/auth";
import { useFavorites } from "@/context/FavoritesContext";
import { useCartDrawer } from "@/context/CartDrawerContext";

import MobileNav from "./MobileNav";

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  images: string[];
  series?: string | null;
  categoryName: string;
  sku?: string | null;
}

type Category = { id: string; slug: string; name: string };

interface HeaderClientProps {
  user: AuthPayload | null;
  cartItemCount?: number;
  categories?: Category[];
}

export default function HeaderClient({
  user,
  cartItemCount = 0,
  categories = [],
}: HeaderClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { count: favoriteCount } = useFavorites();
  const { openCart, cartData } = useCartDrawer();

  const displayCartCount = cartData.count > 0 ? cartData.count : cartItemCount;

  // Live AJAX search debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let active = true;
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (active && res.ok) {
          const data = await res.json();
          setResults(data.products || []);
          setTotalCount(data.totalCount || 0);
          setIsOpen(true);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          console.error("Search fetch error:", err);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }, 220);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsOpen(false);
    const trimmed = query.trim();
    router.push(
      trimmed ? `/urunler?q=${encodeURIComponent(trimmed)}` : "/urunler",
    );
  }

  function handleSelectResult() {
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all font-inter relative z-40">
      <div className="max-w-container-max mx-auto px-4 md:px-6 py-2.5 sm:py-3">
        {/* Main Header Flex Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 lg:gap-6">
          {/* Logo & Mobile Actions Group */}
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto shrink-0">
            <Link
              href="/"
              prefetch={true}
              aria-label="MCARIS Medikal Ana Sayfa"
              className="group flex items-center gap-2.5 shrink-0 py-0.5 transition-transform active:scale-[0.98]"
            >
              <Image
                src="/MCARIS-LOGO-2.webp"
                alt="MCARIS"
                width={240}
                height={70}
                priority
                className="h-[38px] sm:h-[42px] md:h-[44px] w-auto object-contain transition-opacity group-hover:opacity-90 shrink-0"
              />
              <span className="sr-only">MCARIS Medikal Ana Sayfa</span>
            </Link>

            {/* Mobile Actions Group (<lg) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 lg:hidden">
              {/* WhatsApp Quick Mobile Button */}
              <a
                href="https://wa.me/905368200269?text=Merhaba,%20hasta%20karyolas%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mobil WhatsApp Danışma"
                className="flex items-center justify-center w-10 h-10 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl transition-all shadow-xs active:scale-95"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                <span className="sr-only">Mobil WhatsApp Danışma</span>
              </a>

              {/* Favorites Mobile Link */}
              <Link
                href="/favoriler"
                aria-label="Favori Ürünler"
                className="relative flex items-center justify-center w-10 h-10 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-all border border-neutral-200/80 active:scale-95"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill={favoriteCount > 0 ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={favoriteCount > 0 ? "text-rose-500" : ""}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="sr-only">Favori Ürünler</span>
                {favoriteCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[10px] leading-none min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs select-none pointer-events-none tabular-nums">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger Mobile */}
              <button
                type="button"
                onClick={openCart}
                aria-label="Sepetim"
                className="relative flex items-center justify-center w-10 h-10 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-all border border-neutral-200/80 cursor-pointer active:scale-95"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {displayCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white font-extrabold text-[10px] leading-none min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs select-none pointer-events-none tabular-nums">
                    {displayCartCount}
                  </span>
                )}
              </button>

              {/* User Account Mobile */}
              {user ? (
                <Link
                  href="/hesabim"
                  aria-label="Hesabım"
                  className="flex items-center justify-center text-neutral-900 text-xs bg-neutral-100 hover:bg-neutral-200/80 w-10 h-10 rounded-full transition-colors font-bold border border-neutral-200/80 shrink-0 shadow-2xs"
                >
                  <span className="uppercase leading-none">{user.name.charAt(0)}</span>
                </Link>
              ) : (
                <Link
                  href="/giris"
                  aria-label="Kullanıcı Girişi"
                  className="flex items-center justify-center text-neutral-700 hover:text-neutral-950 w-10 h-10 bg-neutral-100 hover:bg-neutral-200/80 rounded-full transition-all border border-neutral-200/80 shrink-0 shadow-2xs active:scale-95"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-neutral-600"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="sr-only">Kullanıcı Girişi</span>
                </Link>
              )}
            </div>
          </div>

          {/* Framer/Shopify Style Concentric Light Search Bar */}
          <div
            ref={searchContainerRef}
            className="relative w-full lg:flex-1 lg:max-w-xl xl:max-w-2xl shrink"
          >
            <div className="flex items-center gap-2 w-full">
              {/* Mobile Drawer Trigger (<md) */}
              <div className="md:hidden shrink-0">
                <MobileNav categories={categories} user={user} />
              </div>

              <form
                onSubmit={handleSubmit}
                className={`w-full flex-1 flex items-center h-11 sm:h-12 rounded-full transition-all duration-200 p-1 border shadow-2xs ${
                isFocused
                  ? "bg-white border-neutral-400 ring-2 ring-neutral-900/5 shadow-md"
                  : "bg-neutral-100/80 hover:bg-neutral-100 border-neutral-200/80"
              }`}
            >
              {/* Search Icon */}
              <div
                className={`pl-3.5 sm:pl-4 transition-colors shrink-0 ${
                  isFocused ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Input */}
              <input
                placeholder="Hasta karyolası, medikal ürün veya ürün kodu ara..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (event.target.value.trim().length >= 2) {
                    setIsOpen(true);
                  }
                }}
                onFocus={() => {
                  setIsFocused(true);
                  if (query.trim().length >= 2) {
                    setIsOpen(true);
                  }
                }}
                className="w-full h-full px-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
              />

              {/* Loading Indicator */}
              {isLoading && (
                <div className="pr-2 text-neutral-400 animate-spin shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
              )}

              {/* Clear Query Button */}
              {query && !isLoading && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setIsOpen(false);
                  }}
                  className="pr-2 text-neutral-400 hover:text-neutral-700 cursor-pointer shrink-0 transition-colors"
                  aria-label="Aramayı Temizle"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

              {/* Search Submit Pill Button */}
              <button
                type="submit"
                className="h-full px-5 sm:px-6 rounded-full bg-neutral-900 hover:bg-black text-white transition-all font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 cursor-pointer active:scale-95 shadow-sm"
              >
                <span>Ara</span>
              </button>
            </form>
          </div>

            {/* Live Autocomplete Dropdown Card */}
            {isOpen && query.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200/90 rounded-3xl shadow-2xl shadow-neutral-900/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5">
                {results.length > 0 ? (
                  <div className="py-2 divide-y divide-neutral-100">
                    <div className="px-4 py-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Eşleşen Ürünler</span>
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                        {totalCount} Sonuç
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/urun/${product.slug}`}
                          onClick={handleSelectResult}
                          className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-neutral-50 transition-colors group cursor-pointer"
                        >
                          <div className="relative w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200/80 shrink-0 overflow-hidden">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <span className="text-[10px] text-neutral-400">
                                Görsel Yok
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {product.series && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-white leading-none">
                                  {product.series}
                                </span>
                              )}
                              {product.sku && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 leading-none">
                                  {product.sku}
                                </span>
                              )}
                              <span className="text-[11px] text-neutral-500 truncate">
                                {product.categoryName}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-black truncate mt-0.5">
                              {product.name}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-neutral-950 block">
                              {Number(product.price).toLocaleString("tr-TR")} ₺
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                              <span>İncele</span>
                              <span>&rarr;</span>
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="p-2 bg-neutral-50 text-center">
                      <Link
                        href={`/urunler?q=${encodeURIComponent(query.trim())}`}
                        onClick={handleSelectResult}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-black hover:underline py-1"
                      >
                        <span>Tüm "{query}" Sonuçlarını İncele ({totalCount})</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                ) : !isLoading ? (
                  <div className="p-6 text-center text-xs text-neutral-500">
                    <p className="font-semibold text-neutral-800">
                      "{query}" ile eşleşen ürün bulunamadı.
                    </p>
                    <p className="mt-1 text-neutral-400">
                      Farklı bir model veya kategori aramayı deneyebilirsiniz.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Desktop Right Action Hub (Clean Light Concentric Aesthetics) */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* WhatsApp Order Button */}
            <a
              href="https://wa.me/905368200269?text=Merhaba,%20hasta%20karyolas%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Danışma Hattı"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 h-11 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-[#25D366]/20 active:scale-98 shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              <span>WhatsApp Danışma Hattı</span>
            </a>

            {/* Favorites Icon Button */}
            <Link
              href="/favoriler"
              prefetch={true}
              aria-label="Favorilerim"
              className="relative flex items-center justify-center w-11 h-11 text-neutral-700 hover:text-neutral-950 bg-neutral-100/80 hover:bg-neutral-200/70 rounded-full transition-all border border-neutral-200/80 hover:border-neutral-300 active:scale-95 shadow-2xs shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={favoriteCount > 0 ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className={favoriteCount > 0 ? "text-rose-500" : ""}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="sr-only">Favorilerim</span>
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[10px] leading-none min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs select-none pointer-events-none tabular-nums">
                  {favoriteCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Sepetim"
              className="relative flex items-center justify-center w-11 h-11 text-neutral-700 hover:text-neutral-950 bg-neutral-100/80 hover:bg-neutral-200/70 rounded-full transition-all border border-neutral-200/80 hover:border-neutral-300 cursor-pointer shrink-0 active:scale-95 shadow-2xs"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {displayCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white font-extrabold text-[10px] leading-none min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs select-none pointer-events-none tabular-nums">
                  {displayCartCount}
                </span>
              )}
            </button>

            {/* Account / Login Pill with Concentric Nested Geometry */}
            {user ? (
              <Link
                href="/hesabim"
                prefetch={true}
                className="flex items-center gap-2.5 h-11 pl-2 pr-4 text-neutral-800 hover:text-neutral-950 text-xs sm:text-sm bg-neutral-100/80 hover:bg-neutral-200/70 rounded-full font-semibold border border-neutral-200/80 hover:border-neutral-300 transition-all active:scale-98 whitespace-nowrap shrink-0 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-900 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 shadow-2xs select-none leading-none">
                  <span className="leading-none">{user.name.charAt(0)}</span>
                </div>
                <span className="leading-none">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/giris"
                prefetch={true}
                className="flex items-center justify-center gap-2.5 h-11 px-6 text-neutral-800 hover:text-neutral-950 text-xs sm:text-sm bg-neutral-100/80 hover:bg-neutral-200/70 rounded-full font-semibold transition-all border border-neutral-200/80 hover:border-neutral-300 active:scale-98 whitespace-nowrap shrink-0 shadow-2xs"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-neutral-500"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
