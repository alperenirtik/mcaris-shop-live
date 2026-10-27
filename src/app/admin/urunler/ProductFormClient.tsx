"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createProductAction, updateProductAction } from "@/app/actions/productActions";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { formatProductCode } from "@/lib/productCode";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormClientProps {
  categories: CategoryOption[];
  initialData?: {
    id: string;
    wcId?: number | null;
    name: string;
    slug: string;
    price: string;
    stock: number;
    vatRate?: number | null;
    categoryId: string;
    series: string | null;
    shortDescription?: string | null;
    description: string;
    images: string[];
    specs: Record<string, string>;
    searchKeywords?: string | null;
    sku?: string | null;
  };
}

const TEMPLATES = {
  hasta_yatagi: [
    { key: "Motor Sayısı", value: "4 Motorlu Dualatör" },
    { key: "Taşıma Kapasitesi", value: "220 kg" },
    { key: "Yükseklik Ayarı", value: "40 - 80 cm (Elektrikli)" },
    { key: "Sırt Açısı", value: "0 - 70° (Elektrikli)" },
    { key: "Ayak Açısı", value: "Kumandayla Kademeli Ayarlanabilir" },
    { key: "Trendelenburg", value: "Mevcut (0 - 12°)" },
    { key: "Korkuluk Tipi", value: "Alüminyum Tabanca Korkuluk" },
    { key: "Tekerlekler", value: "100 mm Çapraz Kilitli Medikal Teker" },
    { key: "Garanti", value: "2 Yıl Resmi Garanti + 10 Yıl Parça" },
  ],
  transfer_lifti: [
    { key: "Taşıma Kapasitesi", value: "180 kg" },
    { key: "Motor Gücü", value: "Güçlü Lineer Aktüatör" },
    { key: "Batarya / Akü", value: "24V 5Ah Şarj Edilebilir" },
    { key: "Sapan (Sling)", value: "Su Geçirmez Baş Destekli Kumaş Sapan" },
    { key: "Ayak Açılma Açısı", value: "Manuel / Pedallı Ayarlanabilir" },
    { key: "Acil Durdurma", value: "Mevcut (Manuel İndirme Butonlu)" },
    { key: "Garanti", value: "2 Yıl" },
  ],
  muayene_masasi: [
    { key: "Gövde Yapısı", value: "Elektrostatik Toz Boyalı Çelik Profil" },
    { key: "Yatak Platformu", value: "Antibakteriyel Vinlex Deri & Yüksek Yoğunluklu Sünger" },
    { key: "Baş Kısmı Ayarı", value: "Kademeli Mekanik Ayarlı (0 - 65°)" },
    { key: "Taşıma Kapasitesi", value: "175 kg" },
    { key: "Havlu / Kağıt Rulosu", value: "Mevcut" },
    { key: "Garanti", value: "2 Yıl" },
  ],
};

export default function ProductFormClient({ categories, initialData }: ProductFormClientProps) {
  const isEditing = Boolean(initialData);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [productName, setProductName] = useState(initialData?.name || "");
  const [productSlug, setProductSlug] = useState(initialData?.slug || "");
  const [productCode, setProductCode] = useState(
    initialData?.sku ||
    initialData?.specs?.["Ürün Kodu"] ||
    initialData?.specs?.["sku"] ||
    ""
  );

  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : ["/placeholder-product.png"]
  );

  const [stockStatus, setStockStatus] = useState<"in_stock" | "out_of_stock">(() => {
    return (initialData?.stock ?? 10) > 0 ? "in_stock" : "out_of_stock";
  });
  const [stockCount, setStockCount] = useState<number>(() => {
    return initialData?.stock ?? 10;
  });

  // Specs Table Builder State
  const [specRows, setSpecRows] = useState<{ key: string; value: string }[]>(() => {
    if (initialData?.specs && Object.keys(initialData.specs).length > 0) {
      return Object.entries(initialData.specs)
        .filter(([key]) => ![
          "seoTitle", "seoDescription", "metaTitle", "metaDescription",
          "Ürün Kodu", "Urun Kodu", "ürün kodu", "urun kodu",
          "sku", "SKU", "Model Kodu", "model kodu", "code", "Kod"
        ].includes(key))
        .map(([key, value]) => ({ key, value }));
    }
    return TEMPLATES.hasta_yatagi.slice(0, 4);
  });

  function applyTemplate(type: keyof typeof TEMPLATES) {
    setSpecRows(TEMPLATES[type]);
  }

  function handleAddSpecRow(key = "", value = "") {
    setSpecRows((prev) => [...prev, { key, value }]);
  }

  function handleRemoveSpecRow(index: number) {
    setSpecRows((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSpecChange(index: number, field: "key" | "value", val: string) {
    setSpecRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  }

  async function uploadFilesList(files: FileList | File[]) {
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    setUploading(true);

    try {
      const formData = new FormData();
      if (productSlug) formData.append("productSlug", productSlug);
      if (productName) formData.append("productName", productName);

      let validCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage =
          file.type.startsWith("image/") ||
          /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(file.name);

        if (isImage) {
          formData.append("files", file);
          validCount++;
        }
      }

      if (validCount === 0) {
        setErrorMsg("Lütfen geçerli bir görsel dosyası (PNG, JPG, WEBP) sürükleyin veya seçin.");
        setUploading(false);
        return;
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.urls && data.urls.length > 0) {
        setImages((prev) => {
          const filtered = prev.filter((url) => url !== "/placeholder-product.png");
          return [...filtered, ...data.urls];
        });
      } else {
        setErrorMsg(data.error || "Görseller yüklenemedi.");
      }
    } catch {
      setErrorMsg("Görsel yüklenirken bir sunucu hatası oluştu.");
    } finally {
      setUploading(false);
    }
  }


  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      uploadFilesList(e.target.files);
    }
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFilesList(e.dataTransfer.files);
    }
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? ["/placeholder-product.png"] : next;
    });
  }

  function handleSetAsCover(index: number) {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  }

  function handleMediaSelected(selectedUrls: string[]) {
    setImages((prev) => {
      const filtered = prev.filter((url) => url !== "/placeholder-product.png");
      const combined = [...filtered];
      selectedUrls.forEach((url) => {
        if (!combined.includes(url)) combined.push(url);
      });
      return combined.length > 0 ? combined : ["/placeholder-product.png"];
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("images", images.join("\n"));

    // Build specs object from table rows
    const specsObj: Record<string, string> = {};
    specRows.forEach((row) => {
      const k = row.key.trim();
      if (k) {
        specsObj[k] = row.value.trim();
      }
    });

    // Save explicit Product Code (SKU) as first-class DB column without duplicating into specs table
    const trimmedCode = productCode.trim();
    const finalCode = trimmedCode ? formatProductCode(trimmedCode) : "";
    formData.set("sku", finalCode);
    formData.set("stock", stockStatus === "out_of_stock" ? "0" : String(Math.max(0, stockCount)));

    // Clean up any legacy spec keys so specs never stores redundant product codes
    delete specsObj["Ürün Kodu"];
    delete specsObj["Urun Kodu"];
    delete specsObj["ürün kodu"];
    delete specsObj["urun kodu"];
    delete specsObj["sku"];
    delete specsObj["SKU"];
    delete specsObj["Model Kodu"];
    delete specsObj["model kodu"];
    delete specsObj["code"];
    delete specsObj["Kod"];

    // Save custom SEO metadata
    const rawSeoTitle = formData.get("seoTitle");
    const rawSeoDesc = formData.get("seoDescription");
    const seoTitle = typeof rawSeoTitle === "string" ? rawSeoTitle.trim() : "";
    const seoDescription = typeof rawSeoDesc === "string" ? rawSeoDesc.trim() : "";
    if (seoTitle) {
      specsObj["seoTitle"] = seoTitle;
    }
    if (seoDescription) {
      specsObj["seoDescription"] = seoDescription;
    }

    formData.set("specsRaw", JSON.stringify(specsObj));

    let result;
    if (isEditing) {
      result = await updateProductAction({ error: undefined }, formData);
    } else {
      result = await createProductAction({ error: undefined }, formData);
    }

    if (result && result.error) {
      setErrorMsg(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">
              {isEditing ? `Ürünü Düzenle: ${initialData?.name}` : "Yeni Medikal Ürün Ekle"}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
            Ürün detaylarını, görsellerini, motor serisini ve teknik özellik tablosunu yapılandırın.
          </p>
        </div>

        <Link
          href="/admin/urunler"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors border border-slate-200 shrink-0"
        >
          <span>&larr; Ürün Listesine Dön</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex justify-between items-center">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Essential Info & Descriptions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Main Info */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-inter border-b border-slate-100 pb-3">
                Temel Ürün Bilgileri
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="örn. 4 Motorlu Ahşap Elektrikli Hasta Karyolası"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ürün Kodu (SKU)
                  </label>
                  <input
                    type="text"
                    name="productCode"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                    placeholder="örn. MC5311"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Örn: MC5311, MC5308, MC6017</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slug (Kalıcı Bağlantı)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={productSlug}
                    onChange={(e) => setProductSlug(e.target.value)}
                    placeholder="4-motorlu-ahsap-hasta-karyolasi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Boşsa otomatik üretilir.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={initialData?.categoryId || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
                  >
                    <option value="">-- Kategori Seçin --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Satış Fiyatı (TL) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    name="price"
                    required
                    defaultValue={initialData?.price || ""}
                    placeholder="24999 veya 24.999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    KDV Oranı (%)
                  </label>
                  <select
                    name="vatRate"
                    defaultValue={
                      initialData?.vatRate !== undefined && initialData?.vatRate !== null
                        ? String(initialData.vatRate)
                        : ""
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
                  >
                    <option value="">-- Mağaza Varsayılanı --</option>
                    <option value="20">%20 (Kozmetik / Genel)</option>
                    <option value="10">%10 (Medikal Ekipman &amp; Karyola)</option>
                    <option value="1">%1 (Temel İhtiyaç)</option>
                    <option value="0">%0 (Muaf / Sıfır)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stok Durumu Seçeneği
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value as "in_stock" | "out_of_stock";
                      setStockStatus(newStatus);
                      if (newStatus === "out_of_stock") {
                        setStockCount(0);
                      } else if (stockCount <= 0) {
                        setStockCount(10);
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold bg-white focus:outline-none focus:ring-2 cursor-pointer transition-colors ${
                      stockStatus === "in_stock"
                        ? "border-emerald-300 text-emerald-800 focus:border-emerald-500 focus:ring-emerald-200"
                        : "border-amber-300 text-amber-800 focus:border-amber-500 focus:ring-amber-200"
                    }`}
                  >
                    <option value="in_stock">Stokta Var (Satışta)</option>
                    <option value="out_of_stock">Stokta Yok (Stok Sor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stok Adedi {stockStatus === "out_of_stock" ? "(Stok Sor)" : "(Adet)"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stockStatus === "out_of_stock" ? 0 : stockCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setStockCount(val);
                      if (val <= 0) {
                        setStockStatus("out_of_stock");
                      } else {
                        setStockStatus("in_stock");
                      }
                    }}
                    disabled={stockStatus === "out_of_stock"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ürün Serisi
                  </label>
                  <select
                    name="series"
                    defaultValue={initialData?.series || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
                  >
                    <option value="">-- Standart --</option>
                    <option value="platinum">PLATINUM (Mavi)</option>
                    <option value="gold">GOLD (Altın)</option>
                    <option value="silver">SILVER (Gümüş)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 2: Descriptions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-inter border-b border-slate-100 pb-3">
                Ürün Açıklamaları &amp; Metinleri
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kısa Özet Açıklama (Ürün Kartları ve Fiyat Yanı)
                </label>
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue={initialData?.shortDescription || ""}
                  placeholder="Örn: 4 Motorlu ahşap kaplamalı medikal hasta karyolası. 220kg taşıma kapasitesi ve 2 yıl garantili Alman motor."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detaylı Ürün Açıklaması *
                </label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  defaultValue={initialData?.description || ""}
                  placeholder="Ürünün tüm fonksiyonları, hareket açıları, kumanda özellikleri, kurulum ve teslimat garantileri..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 leading-relaxed"
                />
              </div>
            </div>

            {/* Card 2.5: SEO & Search Keywords Customization */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-inter">
                    Arama Motoru (SEO) &amp; Site İçi Arama
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Site içi aramada eşleşecek anahtar kelimeler, Google ve Akakçe SERP meta etiketleri.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SEO &amp; Arama
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Site İçi Arama Anahtar Kelimeleri &amp; Etiketler (Search Keywords)
                </label>
                <textarea
                  name="searchKeywords"
                  rows={2}
                  defaultValue={initialData?.searchKeywords || ""}
                  placeholder="Örn: havalı yatak, 2 motorlu hasta karyolası, ankara medikal yatak, felçli hasta yatağı, trendelenburg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Müşterilerin arama çubuğunda aradığında bu ürüne ulaşmasını sağlayacak eşanlamlılar, arama terimleri ve etiketler (virgülle ayırarak yazabilirsiniz).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Özel SEO Meta Title (Tarayıcı &amp; Google Başlığı)
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  defaultValue={initialData?.specs?.["seoTitle"] || ""}
                  placeholder="Örn: 4 Motorlu Ahşap Ev Tipi Hasta Karyolası Fiyatları | MCARIS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Boş bırakılırsa standart &apos;Ürün Adı — Fiyatı ve Özellikleri&apos; kullanılır.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Özel SEO Meta Description (SERP Snippet - Max 160 Karakter)
                </label>
                <textarea
                  name="seoDescription"
                  rows={2}
                  defaultValue={initialData?.specs?.["seoDescription"] || ""}
                  placeholder="Örn: 2 yıl resmi garantili, Alman motorlu 4 hareketli hasta yatağı. Ankara içi gün içinde adrese teslim ve ücretsiz montaj."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Boş bırakılırsa ürünün kısa özet açıklaması SERP meta description olarak kullanılır.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Images & Specs Builder (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 3: Images & Drag-Drop */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-inter">Ürün Görselleri</h2>
                  <span className="text-xs text-slate-500 font-mono">{images.length} Görsel</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Medya Kütüphanesinden Seç</span>
                </button>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-brand bg-brand/10 scale-[1.01] ring-4 ring-brand/20"
                    : "border-slate-200 hover:border-brand/50 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  onChange={handleFileUpload}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-slate-900 font-inter">
                    {uploading
                      ? "Görseller Yükleniyor..."
                      : isDragging
                      ? "Bırakın ve Yükleyin!"
                      : "Görselleri sürükleyin veya tıklayıp seçin"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-inter">PNG, JPG, WEBP (Maks. 5MB)</p>
                </div>
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                {images.map((imgUrl, index) => (
                  <div
                    key={index}
                    onClick={() => handleSetAsCover(index)}
                    className={`relative group border rounded-lg overflow-hidden bg-slate-50 aspect-square cursor-pointer transition-all ${
                      index === 0 ? "border-2 border-brand ring-2 ring-brand/20" : "border-slate-200 hover:border-slate-400"
                    }`}
                    title={index === 0 ? "Ana Kapak Görseli" : "Kapak yapmak için tıklayın"}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Görsel ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      aria-label={`Görsel ${index + 1}'i kaldır`}
                      className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-90 hover:opacity-100 transition-all z-20 cursor-pointer"
                      title="Görseli kaldır"
                    >
                      ✕
                    </button>
                    {index === 0 ? (
                      <span className="absolute bottom-1 left-1 bg-[#0F1E36] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Kapak
                      </span>
                    ) : (
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Kapak Yap
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Specs Table Builder with Presets */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-inter">Teknik Özellik Tablosu</h2>
                  <p className="text-[11px] text-slate-400">Ürün detay sayfasında tablo olarak gösterilir.</p>
                </div>
              </div>

              {/* Ready Presets Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hazır Medikal Şablonlar:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate("hasta_yatagi")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 transition-all cursor-pointer group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand shrink-0">
                      <path d="M2 4v16" />
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                      <path d="M2 17h20" />
                      <path d="M6 8v9" />
                    </svg>
                    <span>Hasta Karyolası</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("transfer_lifti")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 transition-all cursor-pointer group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0">
                      <path d="M12 3v14" />
                      <path d="m8 7 4-4 4 4" />
                      <path d="M4 21h16" />
                    </svg>
                    <span>Transfer Lifti</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("muayene_masasi")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 transition-all cursor-pointer group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 shrink-0">
                      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                      <circle cx="20" cy="10" r="2" />
                    </svg>
                    <span>Muayene Masası</span>
                  </button>
                </div>
              </div>


              {/* Specs Rows */}
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {specRows.map((row, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={row.key}
                      onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                      placeholder="Parametre (örn. Motor Sayısı)"
                      className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                      placeholder="Değer (örn. 4 Motorlu)"
                      className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(index)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg p-1.5 transition-colors font-bold text-xs cursor-pointer shrink-0"
                      title="Sil"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleAddSpecRow("", "")}
                className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                + Yeni Özellik Satırı Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Form Action Bar */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-end gap-3 font-inter">
          <Link
            href="/admin/urunler"
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#0F1E36] text-white rounded-xl hover:bg-[#183158] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Kaydediliyor..." : isEditing ? "Değişiklikleri Kaydet" : "Ürünü Oluştur"}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelected}
        multiple={true}
        title="Ürüne Medya Kütüphanesinden Görsel Ata"
      />
    </div>
  );
}
