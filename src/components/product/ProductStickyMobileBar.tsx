"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { toast } from "sonner";
import { trackAddToCart } from "@/lib/analytics";

interface ProductStickyMobileBarProps {
  productId: string;
  productName: string;
  price: number;
  stock: number;
  image?: string;
  categoryName?: string;
}

export default function ProductStickyMobileBar({
  productId,
  productName,
  price,
  stock,
  image,
  categoryName,
}: ProductStickyMobileBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItemToCart, openCart } = useCartDrawer();

  useEffect(() => {
    function handleScroll() {
      // Show sticky bar only when user scrolled down 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  async function handleAddToCart() {
    if (stock <= 0 || isAdding) return;
    try {
      setIsAdding(true);
      const success = await addItemToCart(productId, 1);
      if (success) {
        trackAddToCart({
          id: productId,
          name: productName,
          category: categoryName,
          price,
          quantity: 1,
        });
        toast.success(`${productName} sepete eklendi!`);
        openCart();
      }
    } catch {
      toast.error("Ürün sepete eklenirken bir hata oluştu.");
    } finally {
      setIsAdding(false);
    }
  }

  const waMessage = encodeURIComponent(
    `Merhaba, ${productName} (${formatPrice(price)}) hakkında bilgi almak ve sipariş vermek istiyorum.`
  );

  return (
    <aside
      aria-label="Hızlı Satın Alma"
      className="fixed bottom-16 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 py-2.5 px-4 shadow-lg lg:hidden transition-all duration-300 animate-in slide-in-from-bottom-5"
    >
      <div className="flex items-center justify-between gap-3 max-w-container-max mx-auto">
        {/* Left: Product Info & Price */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {image && (
            <div className="relative w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
              <Image
                src={image}
                alt={productName}
                fill
                sizes="40px"
                className="object-contain object-center !p-0.5"
              />
            </div>
          )}
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-900 block truncate leading-tight">
              {productName}
            </span>
            <span className="text-xs font-black text-neutral-950 tabular-nums">
              {formatPrice(price)}
            </span>
          </div>
        </div>

        {/* Right: Actions (WhatsApp & Add to Cart or Stok Sor) */}
        <div className="flex items-center gap-2 shrink-0">
          {stock > 0 ? (
            <>
              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ile Danış"
                className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </a>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="h-10 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer whitespace-nowrap"
              >
                {isAdding ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>Sepete Ekle</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Merhaba, "${productName}" hakkında stok durumu ve teslimat süresi için bilgi almak istiyorum.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              <span>Stok Sor</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
