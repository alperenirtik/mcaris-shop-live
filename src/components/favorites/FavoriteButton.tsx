"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function FavoriteButton({
  productId,
  size = "md",
  showText = false,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(productId);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBouncing(true);
    toggleFavorite(productId);

    if (active) {
      toast.info("Ürün favorilerinizden çıkarıldı.");
    } else {
      toast.success("Ürün favorilerinize eklendi!");
    }

    setTimeout(() => setIsBouncing(false), 300);
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4 sm:w-5 sm:h-5",
    lg: "w-5 h-5",
  };

  const containerClasses = {
    sm: "w-8 h-8 rounded-full",
    md: "w-10 h-10 rounded-full",
    lg: "px-6 py-3 rounded-full gap-2.5 min-w-[200px]",
  };

  const positionClass = className.includes("absolute") || className.includes("fixed") ?"" :"relative";

  return (
    <button
      type="button"
      aria-label={active ?"Favorilerden Çıkar" :"Favorilere Ekle"}
      onClick={handleClick}
      className={`group ${positionClass} inline-flex items-center justify-center font-extrabold text-xs md:text-sm transition-all duration-300 transform active:scale-95 select-none ${
        containerClasses[size]
      } ${
        active
          ? "bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
          : "bg-white border border-slate-300 text-slate-700 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 shadow-sm"
      } ${isBouncing ? "scale-110" : ""} ${className}`}
    >
      {/* Animated Pulsing Heart Icon (Sol Kalp) */}
      <svg
        className={`${iconSizes[size]} transition-all duration-300 shrink-0 ${
          active
            ?"fill-rose-500 stroke-rose-500"
            :"fill-slate-200 stroke-slate-400 group-hover:fill-rose-100 group-hover:stroke-rose-400"
        }`}
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {/* Label Text for Product Detail Pages */}
      {showText && (
        <span className={`font-bold tracking-wide uppercase font-inter text-xs transition-colors ${active ? "text-rose-600" : "text-slate-700"}`}>
          {active ? "FAVORİLERİNİZDE" : "FAVORİLERE EKLE"}
        </span>
      )}

      {/* Animated Pulsing Heart Icon (Sağ Kalp) */}
      {showText && active && (
        <svg
          className={`${iconSizes[size]} fill-rose-500 stroke-rose-500     shrink-0`}
          viewBox="0 0 24 24"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )}
    </button>
  );
}
