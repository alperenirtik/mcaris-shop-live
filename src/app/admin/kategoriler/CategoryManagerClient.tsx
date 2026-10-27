"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/categoryActions";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface CategoryStat {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  h1Title?: string | null;
  seoContent?: string | null;
  _count: {
    products: number;
    children: number;
  };
}

interface CategoryManagerClientProps {
  categories: CategoryStat[];
}

export default function CategoryManagerClient({ categories }: CategoryManagerClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");
  const [editingCategory, setEditingCategory] = useState<CategoryStat | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryStat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCategories = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, query]);

  function openCreateModal() {
    setEditingCategory(null);
    setActiveTab("general");
    setErrorMsg(null);
    setSuccessMsg(null);
    setModalOpen(true);
  }

  function openEditModal(cat: CategoryStat) {
    setEditingCategory(cat);
    setActiveTab("general");
    setErrorMsg(null);
    setSuccessMsg(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    if (editingCategory) {
      formData.set("id", editingCategory.id);
    }

    const result = editingCategory
      ? await updateCategoryAction({}, formData)
      : await createCategoryAction({}, formData);

    if (result.error) {
      setErrorMsg(result.error);
      toast.error(result.error);
    } else {
      const msg = result.message || "İşlem başarılı.";
      setSuccessMsg(msg);
      toast.success(msg);
      setModalOpen(false);
    }
    setLoading(false);
  }

  function handleDeleteClick(cat: CategoryStat) {
    if (cat._count.products > 0) {
      const msg = `'${cat.name}' kategorisinde ${cat._count.products} adet ürün bulunmaktadır. Önce ürünleri başka kategoriye taşıyın.`;
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    if (cat._count.children > 0) {
      const msg = `'${cat.name}' kategorisine bağlı alt kategoriler bulunmaktadır.`;
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setCategoryToDelete(cat);
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const result = await deleteCategoryAction(categoryToDelete.id);
      if (result.error) {
        setErrorMsg(result.error);
        toast.error(result.error);
      } else {
        toast.success(`'${categoryToDelete.name}' kategorisi başarıyla silindi.`);
        setSuccessMsg("Kategori başarıyla silindi.");
        setCategoryToDelete(null);
      }
    } catch {
      toast.error("Kategori silinirken bir hata oluştu.");
      setErrorMsg("Kategori silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">Kategori Yönetimi</h1>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 font-mono">
              {categories.length} Kategori
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
            Ürün kategorileri, mega menü ağacı ve alt kategori hiyerarşisinin yönetimi.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer shrink-0"
        >
          <span className="text-base font-bold leading-none">+</span>
          <span>Yeni Kategori Ekle</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold font-inter flex justify-between items-center">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold font-inter flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer">✕</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between font-inter">
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="Kategori adı veya slug ile ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-slate-50/50"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">
              ✕
            </button>
          )}
        </div>
        <span className="text-xs text-slate-500 font-mono hidden sm:inline-block px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
          {filteredCategories.length} kategori listeleniyor
        </span>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden font-inter">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 min-w-[220px]">Kategori Adı</th>
                <th className="py-3.5 px-4 w-48">Slug (Kalıcı Bağlantı)</th>
                <th className="py-3.5 px-4 w-44">Üst Kategori</th>
                <th className="py-3.5 px-4 w-32 text-center">Ürün Sayısı</th>
                <th className="py-3.5 px-4 w-32 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                    Kategori bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{cat.name}</div>
                      {cat._count.children > 0 && (
                        <span className="text-[10px] text-slate-400 font-medium">({cat._count.children} alt kategori)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      /kategori/<span className="text-slate-900 font-semibold">{cat.slug}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {cat.parent ? (
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold border border-slate-200">
                          {cat.parent.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">Ana Kategori</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {cat._count.products} Ürün
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          aria-label={`'${cat.name}' kategorisini düzenle`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                          title="Düzenle"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(cat)}
                          disabled={isDeleting}
                          aria-label={`'${cat.name}' kategorisini sil`}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200 disabled:opacity-50"
                          title="Sil"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-inter">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-inter">
                {editingCategory ? "Kategoriyi & SEO Ayarlarını Düzenle" : "Yeni Kategori Ekle"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Kapat"
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕ Kapat
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Genel Bilgiler
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "seo"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                SEO &amp; Google SERP Ayarları
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "general" ? (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Adı *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingCategory?.name || ""}
                      placeholder="Örn: 3 Motorlu Hasta Karyolaları"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Slug (Opsiyonel - Boş bırakılırsa otomatik üretilir)
                    </label>
                    <input
                      type="text"
                      name="slug"
                      defaultValue={editingCategory?.slug || ""}
                      placeholder="3-motorlu-hasta-karyolalari"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Üst Kategori</label>
                    <select
                      name="parentId"
                      defaultValue={editingCategory?.parentId || ""}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 bg-white cursor-pointer"
                    >
                      <option value="">-- Yok (Ana Kategori Yap) --</option>
                      {categories
                        .filter((c) => !editingCategory || c.id !== editingCategory.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Özel Meta Title (Tarayıcı &amp; Google Başlığı)
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      defaultValue={editingCategory?.metaTitle || ""}
                      placeholder="Örn: 3 Motorlu Hasta Karyolaları & Fiyatları | Ankara Aynı Gün Teslimat"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <p className="text-[11px] text-slate-400 mt-0.5">Boş bırakılırsa standart 'Kategori Adı | MCARIS Medikal' kullanılır.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Özel H1 Başlığı
                    </label>
                    <input
                      type="text"
                      name="h1Title"
                      defaultValue={editingCategory?.h1Title || ""}
                      placeholder="Örn: 3 Motorlu Asansörlü Hasta Karyolaları & Ankara Modelleri"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meta Description (SERP Açıklaması - Max 160 Karakter)
                    </label>
                    <textarea
                      rows={2}
                      name="metaDescription"
                      defaultValue={editingCategory?.metaDescription || ""}
                      placeholder="Ankara içi gün içinde teslimat, 2 yıl yerinde servis garantili motorlu hasta yatakları..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kategori Altı Zengin SEO Tanıtım &amp; Rehber İçeriği
                    </label>
                    <textarea
                      rows={4}
                      name="seoContent"
                      defaultValue={editingCategory?.seoContent || ""}
                      placeholder="Kategori sayfasının en altında listelenecek Google indekslemeli rehber ve açıklama metni..."
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Kaydediliyor..." : editingCategory ? "Değişiklikleri Kaydet" : "Kategoriyi Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Kategoriyi Sil"
        description={`'${categoryToDelete?.name}' kategorisini tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Kategoriyi Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
