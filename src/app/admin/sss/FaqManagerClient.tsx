"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const FAQ_CATEGORIES = [
  "Tümü",
  "Karyola & Modeller",
  "Satış & Avantajlar",
  "Teslimat & Montaj",
  "Teknik Servis & Garanti",
  "Ödeme & Fatura",
];

export default function FaqManagerClient({ initialFaqs }: { initialFaqs: FaqRecord[] }) {
  const [faqs, setFaqs] = useState<FaqRecord[]>(initialFaqs);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqRecord | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<FaqRecord | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formCategory, setFormCategory] = useState("Karyola & Modeller");
  const [formOrder, setFormOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = activeCategory === "Tümü" || faq.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  function handleOpenCreate() {
    setEditingFaq(null);
    setFormQuestion("");
    setFormAnswer("");
    setFormCategory("Karyola & Modeller");
    setFormOrder(faqs.length + 1);
    setFormIsActive(true);
    setIsModalOpen(true);
  }

  function handleOpenEdit(faq: FaqRecord) {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category);
    setFormOrder(faq.order);
    setFormIsActive(faq.isActive);
    setIsModalOpen(true);
  }

  async function handleSaveFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      toast.error("Lütfen soru ve cevap alanlarını doldurun.");
      return;
    }

    try {
      setLoading(true);
      if (editingFaq) {
        const res = await fetch("/api/admin/faq", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingFaq.id,
            question: formQuestion,
            answer: formAnswer,
            category: formCategory,
            order: formOrder,
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFaqs((prev) => prev.map((f) => (f.id === editingFaq.id ? data.faq : f)));
          toast.success("Soru başarıyla güncellendi.");
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Güncellenirken hata oluştu.");
        }
      } else {
        const res = await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: formQuestion,
            answer: formAnswer,
            category: formCategory,
            order: formOrder,
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFaqs((prev) => [data.faq, ...prev]);
          toast.success("Yeni soru başarıyla eklendi.");
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Eklenirken hata oluştu.");
        }
      }
    } catch {
      toast.error("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(faq: FaqRecord) {
    try {
      const res = await fetch("/api/admin/faq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faq.id, isActive: !faq.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === faq.id ? { ...f, isActive: !f.isActive } : f))
        );
        toast.success(faq.isActive ? "Soru yayından kaldırıldı." : "Soru yayına alındı.");
      }
    } catch {
      toast.error("Durum güncellenemedi.");
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingFaq) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/faq?id=${deletingFaq.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== deletingFaq.id));
        toast.success("Soru başarıyla silindi.");
        setDeletingFaq(null);
      } else {
        toast.error(data.error || "Silinirken hata oluştu.");
      }
    } catch {
      toast.error("Silme işlemi başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-950">
            SSS &amp; Yardım Merkezi Yönetimi
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Müşterilerin ve Google botlarının gördüğü sıkça sorulan soruları ekleyin, düzenleyin ve sıralayın.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0B1528] hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>+ Yeni Soru Ekle</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sorularda veya cevaplarda ara..."
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900"
            />
            <svg
              className="absolute left-3 top-2.5 text-neutral-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <span className="text-xs font-bold text-neutral-500 font-mono">
            Toplam {filteredFaqs.length} Soru
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-neutral-900 text-white shadow-2xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200/90 text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Sıra</th>
                <th className="py-3 px-4">Soru &amp; Cevap</th>
                <th className="py-3 px-4 w-36">Kategori</th>
                <th className="py-3 px-4 w-24 text-center">Durum</th>
                <th className="py-3 px-4 w-28 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-neutral-400">
                    Aramanıza uygun soru bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-400 text-center">
                      {faq.order}
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <p className="font-bold text-neutral-900">{faq.question}</p>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[11px] font-semibold border border-neutral-200">
                        {faq.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(faq)}
                        className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                          faq.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200"
                        }`}
                      >
                        {faq.isActive ? "Yayında" : "Pasif"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(faq)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingFaq(faq)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        >
                          Sil
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-neutral-950">
                {editingFaq ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-950 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Soru Metni *
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Örn: 2 ve 3 motorlu hasta karyolaları arasındaki fark nedir?"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Kategori *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-neutral-900 cursor-pointer"
                >
                  {FAQ_CATEGORIES.filter((c) => c !== "Tümü").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Detaylı Cevap *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Hastanın ve refakatçinin anlayacağı dilde açıklayıcı cevap metni..."
                  className="w-full p-3 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-neutral-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Görüntülenme Sırası
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Yayın Durumu
                  </label>
                  <select
                    value={formIsActive ? "1" : "0"}
                    onChange={(e) => setFormIsActive(e.target.value === "1")}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs bg-white focus:outline-none focus:border-neutral-900 cursor-pointer"
                  >
                    <option value="1">Aktif (Yayında)</option>
                    <option value="0">Pasif (Taslak)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#0B1528] hover:bg-black text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Kaydediliyor..." : editingFaq ? "Değişiklikleri Kaydet" : "Soruyu Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingFaq)}
        onClose={() => setDeletingFaq(null)}
        onConfirm={handleDeleteConfirm}
        title="Soruyu Sil"
        description={`"${deletingFaq?.question}" sorusunu tamamen silmek istediğinize emin misiniz?`}
        confirmText="Evet, Soruyu Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
}
