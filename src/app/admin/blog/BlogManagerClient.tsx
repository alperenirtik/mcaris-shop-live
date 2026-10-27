"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  author: string;
  readTime: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  createdAt: Date | string;
}

export default function BlogManagerClient({ initialPosts }: { initialPosts: BlogPostItem[] }) {
  const [posts, setPosts] = useState<BlogPostItem[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [postToDelete, setPostToDelete] = useState<BlogPostItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  // Modal State
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Hasta Bakımı");
  const [coverImage, setCoverImage] = useState("");
  const [readTime, setReadTime] = useState("5 dk okuma");
  const [isPublished, setIsPublished] = useState(true);

  const categoriesList = ["Tümü", "Hasta Karyolası Rehberi", "Hasta Bakımı", "Satın Alma & Rehberler", "Teknik & Güvenlik"];

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = selectedCategory === "Tümü" || p.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  function openCreateModal() {
    setModalMode("create");
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("Hasta Bakımı");
    setCoverImage("");
    setReadTime("5 dk okuma");
    setIsPublished(true);
  }

  function openEditModal(post: BlogPostItem) {
    setModalMode("edit");
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setCoverImage(post.coverImage || "");
    setReadTime(post.readTime);
    setIsPublished(post.isPublished);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (modalMode === "create" && !slug) {
      const generated = val
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  }

  function insertMarkdown(tag: string) {
    let snippet = "";
    if (tag === "h2") snippet = "\n## Başlık 2\n";
    else if (tag === "h3") snippet = "\n### Alt Başlık 3\n";
    else if (tag === "bold") snippet = " **vurgulanan metin** ";
    else if (tag === "list") snippet = "\n- Madde 1\n- Madde 2\n- Madde 3\n";
    else if (tag === "table") snippet = "\n| Özellik | 2 Motorlu | 3 Motorlu | 4 Motorlu |\n| :--- | :--- | :--- | :--- |\n| Asansör | Hayır | Evet | Evet |\n| Trendelenburg | Hayır | Hayır | Evet |\n";
    else if (tag === "divider") snippet = "\n---\n";

    setContent((prev) => prev + snippet);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("Lütfen başlık, slug ve makale içeriğini eksiksiz doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            category,
            coverImage: coverImage.trim() || null,
            readTime,
            isPublished,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Makale oluşturulamadı.");

        toast.success("Yeni makale başarıyla oluşturuldu ve yayınlandı!");
        setPosts([data.post, ...posts]);
      } else {
        const res = await fetch("/api/admin/blog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            category,
            coverImage: coverImage.trim() || null,
            readTime,
            isPublished,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Makale güncellenemedi.");

        toast.success("Makale değişiklikleri kaydedildi!");
        setPosts(posts.map((p) => (p.id === editingId ? data.post : p)));
      }

      setModalMode(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function togglePublishStatus(post: BlogPostItem) {
    const nextStatus = !post.isPublished;
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, isPublished: nextStatus }),
      });
      if (!res.ok) throw new Error("Durum güncellenemedi.");

      toast.success(nextStatus ? "Makale yayına alındı!" : "Makale taslağa çekildi.");
      setPosts(posts.map((p) => (p.id === post.id ? { ...p, isPublished: nextStatus } : p)));
    } catch {
      toast.error("Durum değiştirilemedi.");
    }
  }

  function handleDelete(post: BlogPostItem) {
    setPostToDelete(post);
  }

  async function confirmDelete() {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog?id=${postToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Makale silinemedi.");

      toast.success("Makale başarıyla silindi.");
      setPosts(posts.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
    } catch {
      toast.error("Silme işlemi başarısız.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
            İÇERİK YÖNETİMİ
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-950">
            Medikal Blog &amp; Bilgi Bankası Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Toplam {posts.length} makale yayında. SEO makaleleri yazabilir, düzenleyebilir ve saniyeler içinde yayına alabilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Yeni Makale Yaz</span>
          </button>
        </div>
      </div>

      {/* Filter & Live Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Makale başlığı, slug veya özet ara..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 focus:bg-white"
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-inter">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Kategori</th>
                <th className="py-3 px-4 font-bold">Makale Başlığı</th>
                <th className="py-3 px-4 font-bold">Okunma &amp; Tarih</th>
                <th className="py-3 px-4 font-bold">Durum</th>
                <th className="py-3 px-4 font-bold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-neutral-800">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px]">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <span className="font-bold text-neutral-950 block truncate">{post.title}</span>
                    <span className="text-[11px] text-neutral-400 font-mono block">/blog/{post.slug}</span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    <span className="block font-semibold">{post.viewCount} Okunma</span>
                    <span className="text-[11px] text-neutral-400">{new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => togglePublishStatus(post)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        post.isPublished ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                      }`}
                    >
                      {post.isPublished ? "Yayında" : "Taslak"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-xs font-bold inline-block"
                      >
                        Gör
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditModal(post)}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Fullscreen Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-inter">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-950">
                {modalMode === "create" ? "Yeni Medikal Blog Makalesi Oluştur" : "Makaleyi Düzenle"}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-neutral-400 hover:text-neutral-900 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Makale Başlığı (H1 &amp; Meta Title)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Örn: Ankara Hasta Yatağı Kiralama Fiyatları 2026"
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ankara-hasta-yatagi-kiralama"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs font-mono text-neutral-700 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 cursor-pointer"
                  >
                    <option value="Hasta Karyolası Rehberi">Hasta Karyolası Rehberi</option>
                    <option value="Hasta Bakımı">Hasta Bakımı</option>
                    <option value="Satın Alma & Rehberler">Satın Alma &amp; Rehberler</option>
                    <option value="Teknik & Güvenlik">Teknik &amp; Güvenlik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">Okuma Süresi</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 dk okuma"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Özet (SERP Açıklaması)</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Google arama sonuçlarında çıkacak 150-160 karakterlik özet..."
                  className="w-full p-2.5 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Kapak Görseli URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="/uploads/products/gold-3-motorlu-1.jpg"
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              {/* Markdown Helper Toolbar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800">Makale İçeriği (Markdown)</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertMarkdown("h2")}
                      className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-[11px] font-bold text-neutral-700"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("h3")}
                      className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-[11px] font-bold text-neutral-700"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("bold")}
                      className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-[11px] font-bold text-neutral-700"
                    >
                      Kalın
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("list")}
                      className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-[11px] font-bold text-neutral-700"
                    >
                      Liste
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("table")}
                      className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-[11px] font-bold text-neutral-700"
                    >
                      Tablo
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("divider")}
                      className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-[11px] font-bold text-neutral-700"
                    >
                      Çizgi
                    </button>
                  </div>
                </div>

                <textarea
                  rows={10}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detaylı medikal makale içeriği..."
                  className="w-full p-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900"
                  />
                  <span className="text-xs font-bold text-neutral-800">Hemen Yayına Al</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-xs font-bold rounded-lg hover:bg-neutral-100 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Kaydediliyor..." : modalMode === "create" ? "Makaleyi Yayınla" : "Değişiklikleri Kaydet"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Makale Silme Onay Modalı */}
      <ConfirmModal
        isOpen={Boolean(postToDelete)}
        title="Makaleyi Sil"
        description={`"${postToDelete?.title}" başlıklı makaleyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isDeleting}
        onClose={() => setPostToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
