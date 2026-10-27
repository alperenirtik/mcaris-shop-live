"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import {
  saveHeroSettingsAction,
  saveStoreContactAction,
  saveSeoSettingsAction,
  saveGeneralSettingsAction,
  saveDealOfTheDayAction,
} from "@/app/actions/settingsActions";
import type {
  HeroSettings,
  StoreContactSettings,
  SeoSettings,
  ShowcaseItemSetting,
  StoreGeneralSettings,
  DealOfTheDaySettings,
} from "@/lib/settings";
import type { CatalogProductOption } from "./page";

interface SettingsFormClientProps {
  initialHero: HeroSettings;
  initialContact: StoreContactSettings;
  initialSeo: SeoSettings;
  initialGeneral: StoreGeneralSettings;
  initialDeal: DealOfTheDaySettings;
  catalogProducts: CatalogProductOption[];
}

export default function SettingsFormClient({
  initialHero,
  initialContact,
  initialSeo,
  initialGeneral,
  initialDeal,
  catalogProducts,
}: SettingsFormClientProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "deal" | "contact" | "seo" | "general">("hero");
  const [saving, setSaving] = useState(false);

  // States
  const [hero, setHero] = useState<HeroSettings>(initialHero);
  const [deal, setDeal] = useState<DealOfTheDaySettings>(initialDeal);
  const [contact, setContact] = useState<StoreContactSettings>(initialContact);
  const [seo, setSeo] = useState<SeoSettings>(initialSeo);
  const [general, setGeneral] = useState<StoreGeneralSettings>(initialGeneral);

  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickerType, setPickerType] = useState<"hero" | "deal">("hero");
  const [pickerTargetIndex, setPickerTargetIndex] = useState<number | null>(null);

  // Hero Handlers
  function handleHeroFieldChange(field: keyof Omit<HeroSettings, "showcaseItems">, val: string) {
    setHero((prev) => ({ ...prev, [field]: val }));
  }

  function handleShowcaseItemChange(
    index: number,
    field: keyof Omit<ShowcaseItemSetting, "features">,
    val: string
  ) {
    setHero((prev) => {
      const items = [...prev.showcaseItems];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, showcaseItems: items };
    });
  }

  function handleShowcaseFeatureChange(itemIndex: number, featureIndex: number, val: string) {
    setHero((prev) => {
      const items = [...prev.showcaseItems];
      const features = [...items[itemIndex].features];
      features[featureIndex] = val;
      items[itemIndex] = { ...items[itemIndex], features };
      return { ...prev, showcaseItems: items };
    });
  }

  function handleSelectProductForShowcase(index: number, productId: string) {
    if (!productId) {
      setHero((prev) => {
        const items = [...prev.showcaseItems];
        items[index] = { ...items[index], productId: "" };
        return { ...prev, showcaseItems: items };
      });
      return;
    }

    const prod = catalogProducts.find((p) => p.id === productId);
    if (!prod) return;

    setHero((prev) => {
      const items = [...prev.showcaseItems];
      const currentItem = items[index];

      // Akıllı seri ve rozet formatı
      const seriesBadge = prod.series
        ? `${prod.series.toUpperCase()} SERİ • ÖZEL SEÇİM`
        : "MCARIS MEDİKAL SEÇİMİ";

      // Motor sayısını adından veya özelliklerinden tespit et
      let motorCount = "";
      if (prod.name.includes("4 Motorlu")) motorCount = "4 Motorlu";
      else if (prod.name.includes("3 Motorlu")) motorCount = "3 Motorlu";
      else if (prod.name.includes("2 Motorlu")) motorCount = "2 Motorlu";
      else if (prod.name.toLowerCase().includes("lift")) motorCount = "Transfer Lifti";

      items[index] = {
        ...currentItem,
        productId: prod.id,
        tabLabel: motorCount || currentItem.tabLabel || "Vitrin Modeli",
        badge: seriesBadge,
        title: prod.name,
        subtitle: prod.series
          ? `${prod.series.charAt(0).toUpperCase() + prod.series.slice(1)} Seri Karyola`
          : "Medikal Bakım Karyolası",
        link: `/urun/${prod.slug}`,
        image: prod.images[0] || currentItem.image,
        features: prod.features.length > 0 ? prod.features.slice(0, 4) : currentItem.features,
      };
      return { ...prev, showcaseItems: items };
    });

    toast.info(`"${prod.name}" bilgileri Kart #${index + 1} alanına aktarıldı.`);
  }

  function handleSelectProductForDeal(productId: string) {
    if (!productId) {
      setDeal((prev) => ({ ...prev, productId: "" }));
      return;
    }

    const prod = catalogProducts.find((p) => p.id === productId);
    if (!prod) return;

    const originalPrice = prod.price;
    // Varsayılan %10 indirimli fiyat öner
    const suggestedDealPrice = Math.round(originalPrice * 0.9);
    const discount = originalPrice > 0 ? Math.round(((originalPrice - suggestedDealPrice) / originalPrice) * 100) : 10;

    setDeal((prev) => ({
      ...prev,
      productId: prod.id,
      title: prod.name,
      description: `${prod.name} modelimizde sınırlı süre için avantajlı fiyat fırsatı. Ankara içi aynı gün ücretsiz teslimat ve teknik servis montaj güvencesiyle.`,
      link: `/urun/${prod.slug}`,
      image: prod.images[0] || prev.image,
      originalPrice,
      dealPrice: suggestedDealPrice,
      discountPercentage: discount > 0 ? discount : 10,
    }));

    toast.info(`"${prod.name}" bilgileri Günün Fırsatı alanına aktarıldı.`);
  }

  function handleDealPriceChange(newDealPrice: number) {
    setDeal((prev) => {
      let discount = prev.discountPercentage;
      if (prev.originalPrice > 0 && newDealPrice > 0 && newDealPrice < prev.originalPrice) {
        discount = Math.round(((prev.originalPrice - newDealPrice) / prev.originalPrice) * 100);
      }
      return {
        ...prev,
        dealPrice: newDealPrice,
        discountPercentage: discount,
      };
    });
  }

  function handleOriginalPriceChange(newOriginalPrice: number) {
    setDeal((prev) => {
      let discount = prev.discountPercentage;
      if (newOriginalPrice > 0 && prev.dealPrice > 0 && prev.dealPrice < newOriginalPrice) {
        discount = Math.round(((newOriginalPrice - prev.dealPrice) / newOriginalPrice) * 100);
      }
      return {
        ...prev,
        originalPrice: newOriginalPrice,
        discountPercentage: discount,
      };
    });
  }

  function handleMediaSelected(selectedUrls: string[]) {
    if (selectedUrls.length === 0) return;
    const url = selectedUrls[0];

    if (pickerType === "hero" && pickerTargetIndex !== null) {
      handleShowcaseItemChange(pickerTargetIndex, "image", url);
    } else if (pickerType === "deal") {
      setDeal((prev) => ({ ...prev, image: url }));
    }
  }

  async function handleSaveDeal(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveDealOfTheDayAction(deal);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Kaydedilemedi.");
      }
    } catch {
      toast.error("Günün fırsatı kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }


  // Save Handlers
  async function handleSaveHero(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveHeroSettingsAction(hero);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Kaydedilemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveStoreContactAction(contact);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Kaydedilemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSeo(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveSeoSettingsAction(seo);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Kaydedilemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveGeneral(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await saveGeneralSettingsAction(general);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Kaydedilemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Site &amp; Mağaza &amp; KDV Ayarları
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Anasayfa vitrini, genel mağaza/KDV oranları, iletişim ve arama motoru ayarlarını yapılandırın.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1.5 rounded-xl border border-neutral-200 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Genel &amp; KDV
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "hero"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Hero &amp; Vitrin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("deal")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "deal"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <span>Günün Fırsatı</span>
            {deal.isActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Yayında" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "contact"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            İletişim &amp; Mağaza
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "seo"
                ? "bg-white text-neutral-950 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            SEO &amp; Doğrulama
          </button>
        </div>
      </div>

      {/* TAB 1: HERO & VITRIN */}
      {activeTab === "hero" && (
        <form onSubmit={handleSaveHero} className="space-y-6">
          {/* Main Hero Texts Card */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Hero Başlıkları &amp; Teslimat Rozeti
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Üst Rozet Şehir
                </label>
                <input
                  type="text"
                  value={hero.pillCity}
                  onChange={(e) => handleHeroFieldChange("pillCity", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Üst Rozet Metni
                </label>
                <input
                  type="text"
                  value={hero.pillText}
                  onChange={(e) => handleHeroFieldChange("pillText", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Ana Başlık (1. Satır)
                </label>
                <input
                  type="text"
                  value={hero.mainTitle}
                  onChange={(e) => handleHeroFieldChange("mainTitle", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Vurgulu Başlık (2. Satır)
                </label>
                <input
                  type="text"
                  value={hero.highlightTitle}
                  onChange={(e) => handleHeroFieldChange("highlightTitle", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Açıklama Paragrafı
                </label>
                <textarea
                  rows={3}
                  value={hero.description}
                  onChange={(e) => handleHeroFieldChange("description", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  WhatsApp Buton Metni
                </label>
                <input
                  type="text"
                  value={hero.whatsappText}
                  onChange={(e) => handleHeroFieldChange("whatsappText", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  WhatsApp Numarası (Ülke kodu ile örn: 905000000000)
                </label>
                <input
                  type="text"
                  value={hero.whatsappNumber}
                  onChange={(e) => handleHeroFieldChange("whatsappNumber", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4 Showcase Vitrin Items */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-neutral-900">
              Hero Vitrin Kartları (4 Model)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hero.showcaseItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                    <span className="text-xs font-bold text-white bg-neutral-900 px-2.5 py-1 rounded-lg">
                      Kart #{index + 1} &bull; {item.tabLabel}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">ID: {item.id}</span>
                  </div>

                  {/* Catalog Product Quick Selector */}
                  <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/90 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-800">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-700 shrink-0">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        <span>Katalogdan Ürün Seç (Otomatik Doldur)</span>
                      </label>
                      {item.productId && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-700">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Eşleşti</span>
                        </span>
                      )}
                    </div>
                    <select
                      value={item.productId || ""}
                      onChange={(e) => handleSelectProductForShowcase(index, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900"
                    >
                      <option value="">-- Katalogdan bir ürün seçin veya manuel doldurun --</option>
                      {catalogProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.price.toLocaleString("tr-TR")} ₺)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                        Tab Buton Adı
                      </label>
                      <input
                        type="text"
                        value={item.tabLabel}
                        onChange={(e) => handleShowcaseItemChange(index, "tabLabel", e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                        Üst Rozet
                      </label>
                      <input
                        type="text"
                        value={item.badge}
                        onChange={(e) => handleShowcaseItemChange(index, "badge", e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                        Model Başlığı
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleShowcaseItemChange(index, "title", e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                        Alt Başlık
                      </label>
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={(e) => handleShowcaseItemChange(index, "subtitle", e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-0.5">
                      Ürün Linki (URL)
                    </label>
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) => handleShowcaseItemChange(index, "link", e.target.value)}
                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium focus:outline-none focus:border-neutral-900 font-mono"
                    />
                  </div>

                  {/* Image Picker with Visual Preview */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                      Vitrin Görseli
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-[10px] text-neutral-400">Yok</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => handleShowcaseItemChange(index, "image", e.target.value)}
                          className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] font-mono focus:outline-none focus:border-neutral-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPickerType("hero");
                            setPickerTargetIndex(index);
                            setIsMediaPickerOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-all shadow-xs cursor-pointer active:scale-98"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span>Medya Kütüphanesinden Seç</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4 Features */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-bold text-neutral-600">
                      4 Özellik Maddesi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {item.features.map((feat, fIdx) => (
                        <input
                          key={fIdx}
                          type="text"
                          placeholder={`Özellik ${fIdx + 1}`}
                          value={feat}
                          onChange={(e) => handleShowcaseFeatureChange(index, fIdx, e.target.value)}
                          className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] font-medium focus:outline-none focus:border-neutral-900"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex justify-end shadow-xs">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {saving ? "Kaydediliyor..." : "Hero & Vitrin Ayarlarını Kaydet"}
            </button>
          </div>
        </form>
      )}

      {/* TAB: GÜNÜN FIRSATI (DEAL OF THE DAY) */}
      {activeTab === "deal" && (
        <form onSubmit={handleSaveDeal} className="space-y-6">
          {/* Main Deal Card */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Günün Fırsatı (Deal of the Day) Kampanyası
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Anasayfada geri sayım sayacı ve indirim rozetiyle vurgulanan vitrin kampanya ürününü yapılandırın.
                </p>
              </div>

              {/* Active / Passive Toggle */}
              <div className="flex items-center gap-3 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200/80 shrink-0">
                <span className="text-xs font-bold text-neutral-700">Durum:</span>
                <button
                  type="button"
                  onClick={() => setDeal((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    deal.isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${deal.isActive ? "bg-white" : "bg-neutral-400"}`} />
                  <span>{deal.isActive ? "Anasayfada Yayında" : "Gizli (Pasif)"}</span>
                </button>
              </div>
            </div>

            {/* Catalog Product Quick Selector for Deal */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-700 shrink-0">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span>Katalogdan Kampanya Ürünü Seç (Tüm Bilgileri Otomatik Doldurur)</span>
                </label>
                {deal.productId && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-700">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Katalog Ürünü Bağlı</span>
                  </span>
                )}
              </div>
              <select
                value={deal.productId || ""}
                onChange={(e) => handleSelectProductForDeal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="">-- Katalogdan bir ürün seçin veya alanları manuel doldurun --</option>
                {catalogProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Normal: {p.price.toLocaleString("tr-TR")} ₺
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-neutral-500">
                Ürün seçildiğinde ürün adı, bağlantı linki, ana görsel ve orijinal fiyat otomatik çekilir; indirimli fırsat fiyatı %10 indirim önerisiyle hesaplanır.
              </p>
            </div>

            {/* Campaign Details Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Üst Rozet Metni
                </label>
                <input
                  type="text"
                  value={deal.badgeText}
                  onChange={(e) => setDeal({ ...deal, badgeText: e.target.value })}
                  placeholder="Günün Fırsatı • Sınırlı Stok"
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Geri Sayım Döngüsü (Saat)
                </label>
                <input
                  type="number"
                  min={1}
                  max={720}
                  value={deal.countdownHours}
                  onChange={(e) => setDeal({ ...deal, countdownHours: Number(e.target.value) || 24 })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Kampanya Başlığı (Ürün Adı &amp; Nitelik)
                </label>
                <input
                  type="text"
                  value={deal.title}
                  onChange={(e) => setDeal({ ...deal, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Kampanya Açıklama Metni
                </label>
                <textarea
                  rows={2}
                  value={deal.description}
                  onChange={(e) => setDeal({ ...deal, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              {/* Pricing row */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Normal Liste Fiyatı (₺)
                </label>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={deal.originalPrice}
                  onChange={(e) => handleOriginalPriceChange(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  İndirimli Kampanya Fiyatı (₺)
                </label>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={deal.dealPrice}
                  onChange={(e) => handleDealPriceChange(Number(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  İndirim Oranı (%) — Otomatik Hesaplanır
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={deal.discountPercentage}
                  onChange={(e) => setDeal({ ...deal, discountPercentage: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Ürün Bağlantı Linki (URL)
                </label>
                <input
                  type="text"
                  value={deal.link}
                  onChange={(e) => setDeal({ ...deal, link: e.target.value })}
                  placeholder="/urun/ornek-model-slug"
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              {/* Deal Image Picker */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Kampanya Ürün Görseli
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden shrink-0">
                    {deal.image ? (
                      <Image src={deal.image} alt={deal.title} fill className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-[10px] text-neutral-400 flex items-center justify-center h-full">Yok</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={deal.image}
                      onChange={(e) => setDeal({ ...deal, image: e.target.value })}
                      placeholder="/uploads/products/..."
                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPickerType("deal");
                        setPickerTargetIndex(null);
                        setIsMediaPickerOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Medya Kütüphanesinden Seç</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW CARD */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-700">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Anasayfa Canlı Önizlemesi</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
                <span className={`w-2 h-2 rounded-full ${deal.isActive ? "bg-emerald-500" : "bg-neutral-400"}`} />
                <span>{deal.isActive ? "Şu anda ziyaretçilere görünecektir" : "Gizli olduğu için ziyaretçilere görünmeyecektir"}</span>
              </span>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden border border-neutral-800 shadow-md">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                {/* Left Column */}
                <div className="flex-1 space-y-3 text-center lg:text-left">
                  <span className="inline-block text-[11px] font-bold text-neutral-400">
                    {deal.badgeText || "Günün Fırsatı • Sınırlı Stok"}
                  </span>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight leading-tight text-white">
                    {deal.title || "Kampanya Ürün Başlığı"}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                    {deal.description || "Kampanya açıklama metni burada görüntülenecektir."}
                  </p>

                  {/* Simulated Countdown */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 pt-1">
                    <span className="text-xs font-medium text-neutral-400 mr-1 hidden sm:inline-block">
                      Kalan Süre:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="bg-neutral-800 border border-neutral-700/80 px-2.5 py-1 rounded-md text-center min-w-[45px]">
                        <span className="block text-sm font-bold text-white font-mono">14</span>
                        <span className="text-[9px] text-neutral-400 block font-medium">Saat</span>
                      </div>
                      <span className="text-neutral-500 font-bold">:</span>
                      <div className="bg-neutral-800 border border-neutral-700/80 px-2.5 py-1 rounded-md text-center min-w-[45px]">
                        <span className="block text-sm font-bold text-white font-mono">32</span>
                        <span className="text-[9px] text-neutral-400 block font-medium">Dakika</span>
                      </div>
                      <span className="text-neutral-500 font-bold">:</span>
                      <div className="bg-neutral-800 border border-neutral-700/80 px-2.5 py-1 rounded-md text-center min-w-[45px]">
                        <span className="block text-sm font-bold text-white font-mono">45</span>
                        <span className="text-[9px] text-neutral-400 block font-medium">Saniye</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                    <div>
                      {deal.originalPrice > 0 && (
                        <span className="text-[11px] text-neutral-400 line-through block">
                          {deal.originalPrice.toLocaleString("tr-TR")} ₺
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {deal.dealPrice.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>

                    <div className="bg-white text-neutral-900 px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-xs">
                      <span>Fırsatı İncele</span>
                      <span>&rarr;</span>
                    </div>
                  </div>
                </div>

                {/* Right Column Image Preview */}
                <div className="w-48 sm:w-64 aspect-square relative shrink-0 rounded-xl overflow-hidden border border-neutral-700/80 shadow-md">
                  {deal.image ? (
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      sizes="260px"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs">
                      Görsel Yok
                    </div>
                  )}
                  {deal.discountPercentage > 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-neutral-950/90 backdrop-blur-xs text-white font-bold text-[10px] px-2 py-0.5 rounded-md border border-neutral-700 shadow-xs">
                      %{deal.discountPercentage} İndirim
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex justify-end shadow-xs">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {saving ? "Kaydediliyor..." : "Günün Fırsatı Ayarlarını Kaydet"}
            </button>
          </div>
        </form>
      )}


      {/* TAB 2: STORE CONTACT */}
      {activeTab === "contact" && (
        <form onSubmit={handleSaveContact} className="space-y-6">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Mağaza &amp; İletişim Bilgileri
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mağaza Adı
                </label>
                <input
                  type="text"
                  value={contact.storeName}
                  onChange={(e) => setContact({ ...contact, storeName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Telefon Numarası
                </label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  WhatsApp Sipariş Numarası
                </label>
                <input
                  type="text"
                  value={contact.whatsapp}
                  onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Fiziksel Adres
                </label>
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Çalışma Saatleri
                </label>
                <input
                  type="text"
                  value={contact.workingHours}
                  onChange={(e) => setContact({ ...contact, workingHours: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Şehir / Ülke
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={contact.city}
                    onChange={(e) => setContact({ ...contact, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                  />
                  <input
                    type="text"
                    value={contact.country}
                    onChange={(e) => setContact({ ...contact, country: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex justify-end shadow-xs">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {saving ? "Kaydediliyor..." : "İletişim Bilgilerini Kaydet"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SEO & VERIFICATION */}
      {activeTab === "seo" && (
        <form onSubmit={handleSaveSeo} className="space-y-6">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              Global SEO &amp; Meta Etiketleri &amp; Doğrulama Kodları
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Varsayılan Site Başlığı (Default Meta Title)
                </label>
                <input
                  type="text"
                  value={seo.defaultTitle}
                  onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Varsayılan Meta Açıklaması (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={seo.defaultDescription}
                  onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Anahtar Kelimeler (Keywords - virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Arama Motoru (SEO) ve Site-İçi Canlı Arama Bilgilendirmesi</span>
                </p>
                <p className="text-blue-800 leading-relaxed">
                  Buraya gireceğiniz anahtar kelimeler sitenin ana meta etiketlerine doğrudan eklenir. Ayrıca site-içi arama motorumuz; <strong>&quot;mcaris&quot;</strong> marka aramasını, <strong>&quot;hastane yatağı&quot;</strong> ile <strong>&quot;hasta karyolası&quot;</strong> eş anlamlılarını ve motor sayılarını otomatik olarak akıllı niyet kartlarıyla eşleştirmektedir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Google Search Console Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    placeholder="google-site-verification=..."
                    value={seo.googleVerification}
                    onChange={(e) => setSeo({ ...seo, googleVerification: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Google Analytics / Tag Manager ID
                  </label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={seo.analyticsId}
                    onChange={(e) => setSeo({ ...seo, analyticsId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-neutral-900 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex justify-end shadow-xs">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {saving ? "Kaydediliyor..." : "SEO Ayarlarını Kaydet"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: GENEL & KDV AYARLARI */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="space-y-6">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h2 className="text-base font-bold text-neutral-900">Mağaza Genel &amp; KDV Ayarları</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Ürünlerde özel bir oran belirtilmediğinde tüm sitede, ürün detay sayfalarında ve sepette uygulanacak varsayılan Katma Değer Vergisi (KDV) oranını belirleyin.
              </p>
            </div>

            <div className="max-w-lg space-y-3">
              <label className="block text-xs font-bold text-neutral-800">
                Varsayılan Mağaza KDV Oranı (%)
              </label>
              <select
                value={general.defaultVatRate}
                onChange={(e) => setGeneral({ defaultVatRate: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-hidden transition-all"
              >
                <option value={20}>%20 — Standart / Medikal Kozmetik / Genel KDV</option>
                <option value={10}>%10 — İndirimli / Medikal Ekipman &amp; Hasta Karyolası KDV</option>
                <option value={1}>%1 — Temel Tıbbi İhtiyaç KDV</option>
                <option value={0}>%0 — KDV Muaf / Sıfır Oran</option>
              </select>
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-700 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Nasıl Çalışır?</span>
                </span>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Burada belirleyeceğiniz oran, ürünlerde özel bir oran seçilmediğinde otomatik olarak geçerli olur. Ürün bazında özel KDV oranı seçmek isterseniz (örneğin sadece hasta karyolaları %10, kozmetikler %20), <strong>Ürün Düzenleme</strong> ekranından her ürüne özel KDV belirleyebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex justify-end shadow-xs">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {saving ? "Kaydediliyor..." : "Genel & KDV Ayarlarını Kaydet"}
            </button>
          </div>
        </form>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setPickerTargetIndex(null);
        }}
        onSelect={(urls) => {
          handleMediaSelected(urls);
          setIsMediaPickerOpen(false);
        }}
        multiple={false}
        title={pickerType === "deal" ? "Günün Fırsatı İçin Görsel Seç" : "Vitrin Kartı İçin Görsel Seç"}
      />
    </div>
  );
}
