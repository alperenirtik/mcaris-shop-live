"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { trackAddToCart } from "@/lib/analytics";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  productName?: string;
  price?: number;
  categoryName?: string;
  productCode?: string;
}

export default function AddToCartButton({
  productId,
  stock,
  productName,
  price,
  categoryName,
  productCode,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addItemToCart, openCart } = useCartDrawer();
  const [isPending, setIsPending] = useState(false);
  const [redirectToCart, setRedirectToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPending(true);
    setRedirectToCart(false);

    try {
      const added = await addItemToCart(productId, 1);
      if (added) {
        toast.success(`${productName || "Ürün"} sepetinize eklendi.`);
        if (price !== undefined) {
          trackAddToCart({
            id: productId,
            name: productName || "Ürün",
            category: categoryName,
            price: price,
            quantity: 1,
          });
        }
        openCart();
      } else {
        toast.error("Sepete eklenirken bir hata oluştu.");
      }
    } catch {
      toast.error("İşlem sırasında bir hata oluştu.");
    } finally {
      setIsPending(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPending(true);
    setRedirectToCart(true);

    try {
      const added = await addItemToCart(productId, 1);
      if (added) {
        if (price !== undefined) {
          trackAddToCart({
            id: productId,
            name: productName || "Ürün",
            category: categoryName,
            price: price,
            quantity: 1,
          });
        }
        router.push("/checkout");
      } else {
        toast.error("Sepete eklenirken bir hata oluştu.");
        setIsPending(false);
      }
    } catch {
      toast.error("İşlem sırasında bir hata oluştu.");
      setIsPending(false);
    }
  };

  if (stock <= 0) {
    const waText = encodeURIComponent(
      `Merhaba, "${productName || "Ürün"}"${productCode ? ` (KOD: ${productCode})` : ""} hakkında stok durumu ve teslimat süresi için bilgi almak istiyorum.`
    );
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    return (
      <div className="w-full">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp üzerinden stok sor"
          className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>Stok Sor (WhatsApp)</span>
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Sepete Ekle Button */}
        <button
          type="button"
          disabled={isPending}
          onClick={handleAddToCart}
          aria-label="Ürünü sepete ekle"
          className="w-full bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 border border-neutral-300 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-2xs"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>{isPending && !redirectToCart ? "Ekleniyor..." : "Sepete Ekle"}</span>
        </button>

        {/* Hemen Satın Al Button */}
        <button
          type="button"
          disabled={isPending}
          onClick={handleBuyNow}
          aria-label="Ürünü hemen satın al"
          className="w-full bg-[#0B1528] hover:bg-black text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span>{isPending && redirectToCart ? "Yönlendiriliyor..." : "Hemen Satın Al"}</span>
        </button>
      </div>
    </div>
  );
}
