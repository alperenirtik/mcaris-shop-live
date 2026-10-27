"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  deleteProductAction,
  quickUpdateProductAction,
  duplicateProductAction,
  bulkUpdateProductsAction,
  toggleProductDraftAction,
} from "@/app/actions/productActions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { extractOrGenerateProductCode } from "@/lib/productCode";

interface CategoryItem {
  id: string;
  name: string;
}

interface ProductItem {
  id: string;
  wcId: number | null;
  name: string;
  slug: string;
  sku?: string | null;
  price: string;
  stock: number;
  vatRate?: number | null;
  isDraft?: boolean;
  series: string | null;
  category: { id: string; name: string };
  images: string[];
  specs?: Record<string, string>;
}

interface ProductListClientProps {
  products: ProductItem[];
  categories: CategoryItem[];
}

export default function ProductListClient({
  products: initialProducts,
  categories,
}: ProductListClientProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [seriesFilter, setSeriesFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Editing State (Inline Quick Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<number>(0);
  const [isSavingQuick, setIsSavingQuick] = useState(false);
  const [savingVatId, setSavingVatId] = useState<string | null>(null);

  // Modals & Action States
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  // Bulk Action Modals
  const [bulkModalType, setBulkModalType] = useState<"price" | "stock" | "category" | "delete" | null>(null);
  const [bulkPricePercent, setBulkPricePercent] = useState<string>("10");
  const [bulkStockValue, setBulkStockValue] = useState<string>("10");
  const [bulkCategoryId, setBulkCategoryId] = useState<string>("");
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.wcId && String(p.wcId).includes(q));

      const matchesCategory = !selectedCategory || p.category.id === selectedCategory;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && p.stock > 0) ||
        (stockFilter === "low_stock" && p.stock > 0 && p.stock <= 3) ||
        (stockFilter === "out_of_stock" && p.stock <= 0);

      const matchesSeries = seriesFilter === "all" || p.series === seriesFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "draft" && !!p.isDraft) ||
        (statusFilter === "published" && !p.isDraft);

      return matchesQuery && matchesCategory && matchesStock && matchesSeries && matchesStatus;
    });
  }, [products, query, selectedCategory, stockFilter, seriesFilter, statusFilter]);

  // KPI Computations
  const totalStockCount = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stock || 0), 0);
  }, [products]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce((acc, p) => {
      const price = parseFloat(p.price) || 0;
      return acc + price * (p.stock || 0);
    }, 0);
  }, [products]);

  const inStockCount = useMemo(() => products.filter((p) => p.stock > 0).length, [products]);
  const lowStockCount = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= 3).length, [products]);
  const outOfStockCount = useMemo(() => products.filter((p) => p.stock <= 0).length, [products]);

  // Toggle Selection
  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Inline Edit Handlers
  function startInlineEdit(product: ProductItem) {
    setEditingId(product.id);
    setEditPrice(product.price);
    setEditStock(product.stock);
  }

  function cancelInlineEdit() {
    setEditingId(null);
    setEditPrice("");
    setEditStock(0);
  }

  async function saveInlineEdit(product: ProductItem) {
    if (isSavingQuick) return;
    try {
      setIsSavingQuick(true);
      const parsedPrice = parseFloat(editPrice) || 0;
      const parsedStock = Math.max(0, editStock);

      const res = await quickUpdateProductAction(product.id, {
        price: parsedPrice,
        stock: parsedStock,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`'${product.name}' başarıyla güncellendi.`);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, price: String(parsedPrice), stock: parsedStock }
              : p
          )
        );
        cancelInlineEdit();
      }
    } catch {
      toast.error("Güncelleme sırasında hata oluştu.");
    } finally {
      setIsSavingQuick(false);
    }
  }

  async function handleVatRateChange(product: ProductItem, value: string) {
    if (savingVatId) return;
    const nextVat = value === "" ? null : Number.parseInt(value, 10);
    if (value !== "" && Number.isNaN(nextVat)) {
      toast.error("Geçersiz KDV oranı.");
      return;
    }
    if ((product.vatRate ?? null) === nextVat) return;

    try {
      setSavingVatId(product.id);
      const res = await quickUpdateProductAction(product.id, { vatRate: nextVat });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, vatRate: nextVat } : p))
      );
      toast.success(
        nextVat === null
          ? `'${product.name}' mağaza varsayılan KDV oranına alındı.`
          : `'${product.name}' KDV oranı %${nextVat} olarak güncellendi.`
      );
    } catch {
      toast.error("KDV güncellenirken hata oluştu.");
    } finally {
      setSavingVatId(null);
    }
  }

  // Duplicate Product Handler
  async function handleDuplicate(product: ProductItem) {
    if (isDuplicating) return;
    try {
      setIsDuplicating(product.id);
      const toastId = toast.loading(`'${product.name}' klonlanıyor...`);

      const res = await duplicateProductAction(product.id);

      if (res.error || !res.duplicatedProduct) {
        toast.error(res.error || "Ürün klonlanamadı.", { id: toastId });
      } else {
        toast.success(`'${res.duplicatedProduct.name}' oluşturuldu!`, { id: toastId });
        const newProduct: ProductItem = {
          ...product,
          id: res.duplicatedProduct.id,
          name: res.duplicatedProduct.name,
          slug: res.duplicatedProduct.slug,
        };
        setProducts((prev) => [newProduct, ...prev]);
      }
    } catch {
      toast.error("Klonlama işlemi sırasında hata oluştu.");
    } finally {
      setIsDuplicating(null);
    }
  }

  // Single Delete Handler
  async function handleConfirmDelete() {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const formData = new FormData();
      formData.set("id", productToDelete.id);
      await deleteProductAction(formData);

      toast.success(`'${productToDelete.name}' başarıyla silindi.`);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setSelectedIds((prev) => prev.filter((id) => id !== productToDelete.id));
      setProductToDelete(null);
    } catch {
      toast.error("Ürün silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Bulk Operations Handler
  async function handleExecuteBulkAction() {
    if (selectedIds.length === 0 || !bulkModalType) return;

    try {
      setIsProcessingBulk(true);
      const toastId = toast.loading("Toplu işlem uygulanıyor...");

      let action: "adjust_price_percent" | "set_stock" | "change_category" | "delete" = "adjust_price_percent";
      let value: number | string | undefined = undefined;

      if (bulkModalType === "price") {
        action = "adjust_price_percent";
        value = parseFloat(bulkPricePercent) || 0;
      } else if (bulkModalType === "stock") {
        action = "set_stock";
        value = parseInt(bulkStockValue, 10) || 0;
      } else if (bulkModalType === "category") {
        action = "change_category";
        value = bulkCategoryId;
      } else if (bulkModalType === "delete") {
        action = "delete";
      }

      const res = await bulkUpdateProductsAction({
        productIds: selectedIds,
        action,
        value,
      });

      if (res.error) {
        toast.error(res.error, { id: toastId });
      } else {
        toast.success(`Toplu işlem başarıyla tamamlandı (${res.affectedCount || selectedIds.length} ürün güncellendi).`, {
          id: toastId,
        });

        // Update local state
        if (action === "delete") {
          setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
        } else if (action === "set_stock") {
          const numStock = Math.max(0, parseInt(String(value), 10));
          setProducts((prev) =>
            prev.map((p) => (selectedIds.includes(p.id) ? { ...p, stock: numStock } : p))
          );
        } else if (action === "adjust_price_percent") {
          const pct = parseFloat(String(value)) || 0;
          const mult = 1 + pct / 100;
          setProducts((prev) =>
            prev.map((p) => {
              if (selectedIds.includes(p.id)) {
                const cur = parseFloat(p.price) || 0;
                const next = Math.max(0, Math.round((cur * mult + Number.EPSILON) * 100) / 100);
                return { ...p, price: String(next) };
              }
              return p;
            })
          );
        } else if (action === "change_category") {
          const catObj = categories.find((c) => c.id === value);
          if (catObj) {
            setProducts((prev) =>
              prev.map((p) =>
                selectedIds.includes(p.id)
                  ? { ...p, category: { id: catObj.id, name: catObj.name } }
                  : p
              )
            );
          }
        }

        setSelectedIds([]);
        setBulkModalType(null);
      }
    } catch {
      toast.error("Toplu işlem sırasında hata oluştu.");
    } finally {
      setIsProcessingBulk(false);
    }
  }

  // Export to Excel / CSV
  function handleExportCsv() {
    if (filteredProducts.length === 0) {
      toast.info("Dışa aktarılacak ürün bulunamadı.");
      return;
    }

    const headers = ["Ürün Kodu", "Ürün Adı", "Slug", "Kategori", "Seri", "Fiyat (TL)", "Stok Adedi", "Ürün Linki"];
    const rows = filteredProducts.map((p) => [
      `"${extractOrGenerateProductCode(p)}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.slug}"`,
      `"${p.category.name.replace(/"/g, '""')}"`,
      `"${p.series || "-"}"`,
      `"${p.price}"`,
      `"${p.stock}"`,
      `"https://shop.mcaris.com.tr/urun/${p.slug}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mcaris-urun-listesi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filteredProducts.length} adet ürün Excel uyumlu CSV olarak indirildi.`);
  }

  function getSeriesBadge(series: string | null) {
    if (!series) return <span className="text-slate-400 text-xs">-</span>;

    const styles: Record<string, string> = {
      platinum: "bg-blue-50 text-blue-700 border-blue-200",
      gold: "bg-amber-50 text-amber-700 border-amber-200",
      silver: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
      <span
        className={`inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md border ${
          styles[series] || "bg-slate-100 text-slate-700"
        }`}
      >
        {series}
      </span>
    );
  }

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">Ürün Yönetim Merkezi</h1>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 font-mono">
              {products.length} Ürün
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
            Katalogdaki tüm hasta karyolaları, medikal ekipmanlar ve kozmetik ürünlerini yönetin, hızlı düzenleyin ve toplu işlem uygulayın.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all border border-slate-200 cursor-pointer shrink-0 whitespace-nowrap active:scale-98"
            title="Listeyi Excel/CSV formatında indir"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0 text-slate-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="whitespace-nowrap">Excel / CSV İndir</span>
          </button>

          {/* New Product Button */}
          <Link
            href="/admin/urunler/yeni"
            className="inline-flex items-center gap-2 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer shrink-0 active:scale-98"
          >
            <span className="text-base font-bold leading-none">+</span>
            <span>Yeni Ürün Ekle</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Products */}
        <button
          type="button"
          onClick={() => {
            setStockFilter("all");
            setSeriesFilter("all");
            setSelectedCategory("");
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            stockFilter === "all" && seriesFilter === "all" && !selectedCategory
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-800 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">Toplam Katalog</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-current">
              {products.length} Çeşit
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono mt-1.5">{products.length}</div>
          <div className="text-[11px] opacity-60 mt-0.5 font-medium">Tüm aktif modeller</div>
        </button>

        {/* Total Stock Count & Inventory Value */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Stok &amp; Envanter Değeri</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {totalStockCount} Adet
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-1.5">
            ₺{totalInventoryValue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">Toplam depo envanter tutarı</div>
        </div>

        {/* Low Stock Warning */}
        <button
          type="button"
          onClick={() => setStockFilter(stockFilter === "low_stock" ? "all" : "low_stock")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            stockFilter === "low_stock"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white text-slate-800 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">Kritik Stok (≤ 3)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Uyarı
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono mt-1.5">{lowStockCount}</div>
          <div className="text-[11px] opacity-60 mt-0.5 font-medium">Yeniden sipariş verilmeli</div>
        </button>

        {/* Out of Stock */}
        <button
          type="button"
          onClick={() => setStockFilter(stockFilter === "out_of_stock" ? "all" : "out_of_stock")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            stockFilter === "out_of_stock"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
              : "bg-white text-slate-800 border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Stokta Yok (Stok Sor)</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              stockFilter === "out_of_stock"
                ? "bg-white/20 text-white border border-white/30"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}>
              Stok Sor
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono mt-1.5">{outOfStockCount}</div>
          <div className="text-[11px] opacity-80 mt-0.5 font-medium">Müşteriye WhatsApp butonu çıkar</div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between font-inter">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Ürün adı, SKU kodu veya link (slug) ile ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-slate-50/50"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Kategoriye göre filtrele"
            className="w-full sm:w-48 h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            <option value="">Tüm Kategoriler ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={seriesFilter}
            onChange={(e) => setSeriesFilter(e.target.value)}
            aria-label="Seriye göre filtrele"
            className="w-full sm:w-36 h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            <option value="all">Tüm Seriler</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
            aria-label="Yayın durumuna göre filtrele"
            className="w-full sm:w-36 h-10 px-3 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="published">Yayında Olanlar</option>
            <option value="draft">Taslaklar</option>
          </select>

          <span className="h-10 inline-flex items-center justify-center text-xs text-slate-600 font-mono font-medium whitespace-nowrap px-3 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            {filteredProducts.length} gösteriliyor
          </span>
        </div>
      </div>

      {/* Floating Bulk Actions Toolbar (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-30 bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-brand text-white font-mono font-bold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs sm:text-sm font-bold font-inter">
              {selectedIds.length} ürün seçildi
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => setBulkModalType("price")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>₺ Fiyat Değiştir (% / +)</span>
            </button>

            <button
              type="button"
              onClick={() => setBulkModalType("stock")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 shrink-0">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>Stok Güncelle</span>
            </button>

            <button
              type="button"
              onClick={() => setBulkModalType("category")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 shrink-0">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Kategori Taşı</span>
            </button>

            <button
              type="button"
              onClick={() => setBulkModalType("delete")}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white shrink-0">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              <span>Toplu Sil</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden font-inter">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs sm:text-sm font-medium">
            Filtrelere uygun ürün bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      aria-label="Tümünü seç"
                      className="w-4 h-4 text-brand rounded border-slate-300 focus:ring-brand cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3 w-16 text-center">Görsel</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Ürün Bilgisi</th>
                  <th className="py-3.5 px-4 w-44">Kategori</th>
                  <th className="py-3.5 px-4 w-28 text-center">Seri</th>
                  <th className="py-3.5 px-4 w-48 text-left">KDV</th>
                  <th className="py-3.5 px-4 w-40 text-right">Fiyat (₺)</th>
                  <th className="py-3.5 px-4 w-36 text-center">Stok Durumu</th>
                  <th className="py-3.5 px-4 w-44 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isEditingThis = editingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isSelected ? "bg-brand/5 hover:bg-brand/10" : "hover:bg-slate-50/90"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          aria-label={`Seç: ${product.name}`}
                          className="w-4 h-4 text-brand rounded border-slate-300 focus:ring-brand cursor-pointer"
                        />
                      </td>

                      {/* Image Thumbnail (Clickable to Edit) */}
                      <td className="py-3 px-3 text-center">
                        <Link
                          href={`/admin/urunler/${product.id}`}
                          className="relative block w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 mx-auto group hover:border-brand transition-colors cursor-pointer"
                          title="Ürünü Düzenle"
                        >
                          <Image
                            src={product.images[0] || "/placeholder-product.png"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="48px"
                          />
                        </Link>
                      </td>

                      {/* Name & SKU (Clickable to Edit) */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/urunler/${product.id}`}
                          className="font-bold text-slate-900 hover:text-brand transition-colors leading-snug line-clamp-1 block cursor-pointer"
                          title="Ürün Detaylarını Düzenle"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.isDraft ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-white rounded-md tracking-wider">
                              TASLAK
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-md tracking-wider">
                              YAYINDA
                            </span>
                          )}
                          {extractOrGenerateProductCode(product) ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded-md tracking-wider">
                              {extractOrGenerateProductCode(product)}
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md border border-slate-200/80">
                              Kodsuz
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]" title={product.slug}>
                            {product.slug}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100/80 rounded-lg border border-slate-200/80 truncate max-w-[170px]">
                          {product.category.name}
                        </span>
                      </td>

                      {/* Series Badge */}
                      <td className="py-3 px-4 text-center">{getSeriesBadge(product.series)}</td>

                      {/* VAT Rate (Inline Select) */}
                      <td className="py-3 px-4">
                        <select
                          name="vatRate"
                          value={
                            product.vatRate !== undefined && product.vatRate !== null
                              ? String(product.vatRate)
                              : ""
                          }
                          disabled={savingVatId === product.id}
                          onChange={(e) => handleVatRateChange(product, e.target.value)}
                          aria-label={`${product.name} KDV oranı`}
                          className="w-full min-w-[11rem] px-2.5 py-2 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                        >
                          <option value="">-- Mağaza Varsayılanı --</option>
                          <option value="20">%20 (Kozmetik / Genel)</option>
                          <option value="10">%10 (Medikal Ekipman &amp; Karyola)</option>
                          <option value="1">%1 (Temel İhtiyaç)</option>
                          <option value="0">%0 (Muaf / Sıfır)</option>
                        </select>
                      </td>

                      {/* Price (Inline Editable) */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">
                        {isEditingThis ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs text-slate-400">₺</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveInlineEdit(product);
                                if (e.key === "Escape") cancelInlineEdit();
                              }}
                              className="w-24 px-2 py-1 text-right text-xs font-mono font-bold border border-brand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startInlineEdit(product)}
                            className="group inline-flex items-center gap-1.5 hover:text-brand transition-colors cursor-pointer"
                            title="Fiyatı hızlı düzenlemek için tıklayın"
                          >
                            <span>₺{parseFloat(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"
                            >
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>
                        )}
                      </td>

                      {/* Stock (Inline Editable) */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isEditingThis ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={editStock}
                              onChange={(e) => setEditStock(parseInt(e.target.value, 10) || 0)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveInlineEdit(product);
                                if (e.key === "Escape") cancelInlineEdit();
                              }}
                              className="w-16 px-2 py-1 text-center text-xs font-mono font-bold border border-brand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                            />
                            <span className="text-xs text-slate-500">Adet</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startInlineEdit(product)}
                            className="group inline-flex items-center gap-1 cursor-pointer"
                            title="Stoku hızlı düzenlemek için tıklayın"
                          >
                            {product.stock > 3 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                <span>{product.stock} Adet</span>
                              </span>
                            ) : product.stock > 0 ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                <span>{product.stock} (Kritik)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                <span>Stokta Yok (Stok Sor)</span>
                              </span>
                            )}
                          </button>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        {isEditingThis ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => saveInlineEdit(product)}
                              disabled={isSavingQuick}
                              aria-label="Kaydet"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              title="Kaydet (Enter)"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>Kaydet</span>
                            </button>
                            <button
                              type="button"
                              onClick={cancelInlineEdit}
                              aria-label="Vazgeç"
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                              title="Vazgeç (Esc)"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Publish / Draft Action */}
                            <button
                              type="button"
                              onClick={async () => {
                                const res = await toggleProductDraftAction(product.id);
                                if (res.success) {
                                  setProducts((prev) =>
                                    prev.map((item) =>
                                      item.id === product.id ? { ...item, isDraft: res.isDraft } : item
                                    )
                                  );
                                  toast.success(res.isDraft ? "Ürün taslağa alındı." : "Ürün yayına alındı.");
                                } else {
                                  toast.error(res.error || "İşlem başarısız.");
                                }
                              }}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                product.isDraft
                                  ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-500 hover:text-white"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-600 hover:text-white"
                              }`}
                              title={product.isDraft ? "Ürünü Yayına Al" : "Ürünü Taslağa Al"}
                            >
                              {product.isDraft ? "Yayına Al" : "Taslağa Al"}
                            </button>

                            {/* Primary Prominent Edit Button */}
                            <Link
                              href={`/admin/urunler/${product.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-200 hover:border-blue-600 cursor-pointer shadow-2xs"
                              title="Ürünü Düzenle"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                              </svg>
                              <span>Düzenle</span>
                            </Link>

                            {/* Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => handleDuplicate(product)}
                              disabled={isDuplicating === product.id}
                              aria-label={`'${product.name}' ürününü çoğalt`}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer border border-slate-200 hover:border-indigo-200 disabled:opacity-50"
                              title="Ürünü Çoğalt (Klonla)"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>

                            {/* View Live Product */}
                            <Link
                              href={`/urun/${product.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                              title="Sitede Görüntüle"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Link>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setProductToDelete(product)}
                              disabled={isDeleting}
                              aria-label={`'${product.name}' ürününü sil`}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-200 disabled:opacity-50"
                              title="Sil"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Single Product Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Ürünü Sil"
        description={`'${productToDelete?.name}' ürününü tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Ürünü Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Bulk Operations Modal */}
      {bulkModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-inter">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {bulkModalType === "price" && "Toplu Fiyat Güncelle"}
                {bulkModalType === "stock" && "Toplu Stok Belirle"}
                {bulkModalType === "category" && "Toplu Kategori Taşı"}
                {bulkModalType === "delete" && "Toplu Ürün Silme"}
              </h3>
              <button
                type="button"
                onClick={() => setBulkModalType(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Seçilen <strong className="text-slate-900">{selectedIds.length} ürün</strong> üzerinde işlem yapılacaktır.
            </p>

            {bulkModalType === "price" && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Fiyat Değişim Yüzdesi (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1"
                    placeholder="Örn: 10 (+%10 zam) veya -5 (%5 indirim)"
                    value={bulkPricePercent}
                    onChange={(e) => setBulkPricePercent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                  <span className="text-sm font-bold text-slate-600">%</span>
                </div>
                <div className="flex gap-2">
                  {["+5", "+10", "+15", "+20", "-5", "-10"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBulkPricePercent(preset.replace("+", ""))}
                      className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {bulkModalType === "stock" && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Yeni Stok Durumu &amp; Adedi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBulkStockValue("0")}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      bulkStockValue === "0"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    }`}
                  >
                    Stokta Yok (Stok Sor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkStockValue("10")}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                      bulkStockValue === "10"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                    }`}
                  >
                    Stokta Var (10 Adet)
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Özel Stok Adedi
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Örn: 10 veya 0 (Stok Sor)"
                    value={bulkStockValue}
                    onChange={(e) => setBulkStockValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
            )}

            {bulkModalType === "category" && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Hedef Kategori
                </label>
                <select
                  value={bulkCategoryId}
                  onChange={(e) => setBulkCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 cursor-pointer"
                >
                  <option value="">-- Kategori Seçin --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {bulkModalType === "delete" && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-start gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600 shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Seçilen {selectedIds.length} ürün veritabanından kalıcı olarak silinecektir. Bu işlem geri alınamaz!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBulkModalType(null)}
                disabled={isProcessingBulk}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkAction}
                disabled={isProcessingBulk || (bulkModalType === "category" && !bulkCategoryId)}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 ${
                  bulkModalType === "delete"
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-slate-900 hover:bg-black text-white"
                }`}
              >
                {isProcessingBulk ? "İşleniyor..." : "Uygula"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
