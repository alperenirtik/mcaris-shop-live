"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DealOfTheDaySettings } from "@/lib/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

interface DealOfTheDayClientProps {
  settings: DealOfTheDaySettings;
}

export default function DealOfTheDayClient({ settings }: DealOfTheDayClientProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const maxHours = settings.countdownHours > 0 ? settings.countdownHours : 24;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: maxHours - 1, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.countdownHours]);

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-6 font-sans">
      <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left Column: Offer Details */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <Badge
              variant="outline"
              className="border-slate-800 bg-slate-900/90 text-slate-300 font-semibold text-[11px] px-2.5 py-0.5"
            >
              <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
              <span>{settings.badgeText || "Günün Fırsatı • Sınırlı Stok"}</span>
            </Badge>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white">
              {settings.title}
            </h2>

            {settings.description && (
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {settings.description}
              </p>
            )}

            {/* Countdown Box */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
              <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline-block">
                Kalan Süre:
              </span>
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center min-w-[50px]">
                  <span className="block text-base font-bold text-white font-mono">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Saat
                  </span>
                </div>
                <span className="text-slate-600 font-bold">:</span>
                <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center min-w-[50px]">
                  <span className="block text-base font-bold text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Dakika
                  </span>
                </div>
                <span className="text-slate-600 font-bold">:</span>
                <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-center min-w-[50px]">
                  <span className="block text-base font-bold text-white font-mono">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Saniye
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <div>
                {settings.originalPrice > 0 && (
                  <span className="text-[11px] text-slate-400 line-through block">
                    {settings.originalPrice.toLocaleString("tr-TR")} ₺
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {settings.dealPrice.toLocaleString("tr-TR")} ₺
                </span>
              </div>

              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm px-6 rounded-xl shadow-xs"
              >
                <Link
                  href={settings.link || "/urunler"}
                  aria-label={`${settings.title} Fırsatını İncele`}
                >
                  <span>Fırsatı İncele</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Product Image */}
          <div className="w-full sm:w-80 md:w-96 aspect-square relative shrink-0 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            <Link
              href={settings.link || "/urunler"}
              className="block w-full h-full relative"
              title={`${settings.title} Fırsatı`}
            >
              {settings.image ? (
                <Image
                  src={settings.image}
                  alt={settings.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  className="object-cover w-full h-full hover:scale-104 transition-transform duration-500 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 text-xs">
                  Görsel Bulunamadı
                </div>
              )}
              <span className="sr-only">{settings.title} Fırsatı Görseli</span>
            </Link>
            {settings.discountPercentage > 0 && (
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-xs text-white font-bold text-[11px] px-2.5 py-1 rounded-md border border-slate-700 shadow-xs">
                %{settings.discountPercentage} İndirim
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
