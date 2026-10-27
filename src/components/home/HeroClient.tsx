"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";
import type { HeroSettings } from "@/lib/settings";
import { DEFAULT_HERO_SETTINGS } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const CATEGORY_CAPSULES = [
  {
    name: "Hasta Karyolası",
    href: "/kategori/hasta-yataklari",
    image: "/categories/hasta-yataklari.png",
    badge: "Tüm Modeller",
  },
  {
    name: "2 Motorlu Karyola",
    href: "/kategori/2-motorlu-hasta-yataklari",
    image: "/categories/silver-hasta-yataklari.png",
    badge: "2 Motor",
  },
  {
    name: "3 Motorlu Karyola",
    href: "/kategori/3-motorlu-hasta-yataklari",
    image: "/categories/gold-hasta-yataklari.png",
    badge: "Asansörlü",
  },
  {
    name: "4 Motorlu Karyola",
    href: "/kategori/4-motorlu-hasta-yataklari",
    image: "/categories/platinum-hasta-yataklari.png",
    badge: "Trendelenburg",
  },
  {
    name: "Yemek Masası",
    href: "/kategori/hasta-yemek-masalari",
    image: "/uploads/products/amortisorlu-hasta-yemek-masasi-1.jpg",
    badge: "Amortisörlü",
  },
  {
    name: "Bakım Koltuğu",
    href: "/kategori/bakim-koltuklari",
    image: "/categories/bakim-koltuklari.png",
    badge: "Motorlu",
  },
  {
    name: "Muayene Masası",
    href: "/kategori/muayene-ve-bakim-masalari",
    image: "/categories/bakim-yataklari.png",
    badge: "Klinik",
  },
  {
    name: "Cihaz Sehpası",
    href: "/kategori/cihaz-sehpasi",
    image: "/categories/cihaz-sehpasi.png",
    badge: "Tekerlekli",
  },
  {
    name: "Dövme Kol Sehpası",
    href: "/kategori/dovme-kol-sehpalari",
    image: "/categories/dovme-kol-sehpalari.png",
    badge: "Ergonomik",
  },
  {
    name: "Tabure & Sandalye",
    href: "/kategori/tabure-ve-sandalyeler",
    image: "/categories/tabure-ve-sandalyeler.png",
    badge: "Amortisörlü",
  },
];

interface HeroClientProps {
  settings?: HeroSettings;
}

export default function HeroClient({ settings }: HeroClientProps) {
  const heroData = settings || DEFAULT_HERO_SETTINGS;
  const showcaseItems =
    heroData.showcaseItems && heroData.showcaseItems.length > 0
      ? heroData.showcaseItems
      : DEFAULT_HERO_SETTINGS.showcaseItems;

  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % showcaseItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, showcaseItems.length]);

  const current = showcaseItems[activeTab] || showcaseItems[0];

  const waNumber = heroData.whatsappNumber || WHATSAPP_NUMBER;
  const waText = heroData.whatsappText || "WhatsApp ile Sipariş Ver";

  return (
    <section className="relative w-full bg-background text-foreground border-b border-border pt-3 sm:pt-4 pb-8 sm:pb-12 font-sans">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6 sm:space-y-8">
        {/* Main 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Value Prop, Heading, CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Clean Editorial Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/80 border border-border text-foreground text-xs font-medium max-w-full whitespace-nowrap overflow-hidden">
              <span className="font-bold shrink-0">
                {heroData.pillCity || "Ankara"}
              </span>
              <span className="text-border shrink-0">|</span>
              <span className="text-muted-foreground truncate">
                {heroData.pillText || "Aynı Gün Ücretsiz Teslimat & Kurulum"}
              </span>
            </div>

            {/* Main Power Headline */}
            <div className="space-y-2.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-extrabold text-foreground leading-[1.15] tracking-tight">
                {heroData.mainTitle || "Elektrikli Motorlu Hasta Karyolaları &"}{" "}
                <span className="text-muted-foreground block sm:inline">
                  {heroData.highlightTitle || "Evde Bakım Hasta Yatakları"}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                {heroData.description}
              </p>
            </div>

            {/* Action Buttons: Unified High-Impact CTAs using Button primitives */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
              {/* WhatsApp Order & Consultation */}
              <Button
                asChild
                variant="whatsapp"
                size="lg"
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl"
              >
                <a
                  href={`https://wa.me/${waNumber}?text=Merhaba,%20hasta%20karyolas%C4%B1%20hakk%C4%B1nda%20bilgi%20ve%20fiyat%20almak%20istiyorum.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span>{waText}</span>
                </a>
              </Button>

              {/* Primary Explore Shop Button */}
              <Button
                asChild
                variant="default"
                size="lg"
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl group"
              >
                <Link href="/urunler">
                  <span>Modelleri İncele</span>
                  <ArrowRight className="w-4 h-4 text-primary-foreground/70 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>

              {/* Direct Call Button */}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl"
              >
                <a href={`tel:${BUSINESS_PHONE}`}>
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>7/24 Danışma</span>
                </a>
              </Button>
            </div>

            {/* Trust Micro-Cards */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-1 w-full sm:w-auto">
              <div className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2 text-left hover:border-foreground/20 transition-colors shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 pr-1">
                  <span className="text-xs font-bold text-foreground block whitespace-nowrap leading-tight truncate">
                    2 Yıl Garanti
                  </span>
                  <span className="text-[11px] text-muted-foreground block whitespace-nowrap leading-tight truncate">
                    Yerinde Servis
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2 text-left hover:border-foreground/20 transition-colors shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0 pr-1">
                  <span className="text-xs font-bold text-foreground block whitespace-nowrap leading-tight truncate">
                    Aynı Gün Teslimat
                  </span>
                  <span className="text-[11px] text-muted-foreground block whitespace-nowrap leading-tight truncate">
                    Ankara İçi Ücretsiz
                  </span>
                </div>
              </div>

              <div className="hidden sm:inline-flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2 text-left hover:border-foreground/20 transition-colors shadow-2xs shrink-0">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0 pr-1">
                  <span className="text-xs font-bold text-foreground block whitespace-nowrap leading-tight">
                    Alman Motoru
                  </span>
                  <span className="text-[11px] text-muted-foreground block whitespace-nowrap leading-tight">
                    CE &amp; ISO 9001
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Minimal Showcase (Hidden on Mobile, 5 cols on Desktop) */}
          <div className="hidden lg:block lg:col-span-5 space-y-3 w-full">
            {/* Elevated Showcase Card */}
            <div className="rounded-2xl bg-card p-4 sm:p-5 border border-border shadow-xs flex flex-col justify-between space-y-3.5">
              {/* Card Top Header */}
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                    VİTRİN
                  </Badge>
                  <span className="text-xs font-bold text-foreground truncate">
                    {current.badge}
                  </span>
                </div>

                {/* Delivery Badge */}
                <Badge variant="outline" className="gap-1.5 font-bold text-[11px] text-foreground tracking-tight">
                  <Truck className="w-3 h-3 text-muted-foreground" />
                  <span>AYNI GÜN SEVKİYAT</span>
                </Badge>
              </div>

              {/* Central Product Image Container */}
              <div className="w-full rounded-xl overflow-hidden relative bg-muted/40 border border-border">
                <Link
                  href={current.link || "/urunler"}
                  className="relative w-full aspect-[16/10] sm:h-64 block group cursor-pointer overflow-hidden"
                >
                  <Image
                    src={current.image || "/categories/hasta-yataklari.png"}
                    alt={`${current.title} ${current.subtitle}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    priority
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span className="sr-only">
                    {current.title} {current.subtitle} Görseli
                  </span>
                </Link>
              </div>

              {/* Product Info & Dual Action Footer */}
              <div className="space-y-3 border-t border-border/60 pt-3 shrink-0">
                {/* Unified Title */}
                <div className="min-h-[48px] flex items-center">
                  <p className="text-[17px] sm:text-lg md:text-xl font-bold text-foreground leading-snug line-clamp-2">
                    {current.title} {current.subtitle}
                  </p>
                </div>

                {/* Micro Features Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {(current.features || []).slice(0, 2).map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted/70 px-2.5 py-1.5 rounded-lg border border-border/80 truncate"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Dual Action Conversion Group */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    asChild
                    variant="default"
                    className="flex-1 h-11 rounded-xl font-semibold text-xs sm:text-sm shadow-xs"
                  >
                    <Link href={current.link || "/urunler"}>
                      <span>Modeli &amp; Fiyatları İncele</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="whatsapp"
                    size="icon"
                    className="w-11 h-11 rounded-xl shadow-xs shrink-0"
                  >
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                        `Merhaba, ${current.title} ${current.subtitle} hakkında detaylı bilgi ve fiyat almak istiyorum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp ile Sipariş"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span className="sr-only">WhatsApp ile Sipariş</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Showcase Dot Slider Navigation */}
            <div
              className="flex items-center justify-center gap-2 pt-1 select-none"
              role="tablist"
              aria-label="Vitrin Ürün Slaytları"
            >
              {showcaseItems.map((item, idx) => {
                const isActive = idx === activeTab;
                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Slayt ${idx + 1}: ${item.title || item.tabLabel || "Ürün"}`}
                    onClick={() => {
                      setIsAutoPlay(false);
                      setActiveTab(idx);
                    }}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? "w-8 bg-foreground shadow-xs"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom of Hero: Visual 5x2 Category Grid (2 Rows x 5 Columns) */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-border/60">
            <div className="flex items-center gap-2 min-w-0">
              <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                KATALOG
              </Badge>
              <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                <span className="sm:hidden">Popüler Kategoriler</span>
                <span className="hidden sm:inline">
                  Popüler Hasta Karyolası &amp; Medikal Kategoriler
                </span>
              </span>
            </div>
            <Link
              href="/urunler"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <span className="sm:hidden">Tüm Modeller</span>
              <span className="hidden sm:inline">Tüm Modelleri Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Unified 5x2 Symmetrical Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 w-full">
            {CATEGORY_CAPSULES.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative bg-card hover:bg-muted/40 border border-border hover:border-foreground/30 rounded-xl p-1.5 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-xs select-none cursor-pointer overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full rounded-lg bg-muted/30 overflow-hidden border border-border/50 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {item.badge && (
                    <span className="absolute top-2 right-2 z-10 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-tight border border-white/10">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Category Title */}
                <div className="text-center px-1.5 py-2">
                  <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 block">
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
