"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { MediaFileInfo } from "@/app/api/admin/media/route";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaFileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<MediaFileInfo | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaFileInfo | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (folderFilter !== "all") params.set("folder", folderFilter);

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.files || []);
      }
    } catch {
      toast.error("Medya dosyaları yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, folderFilter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.urls) {
        toast.success(`${data.urls.length} görsel başarıyla yüklendi!`);
        await fetchMedia();
      } else {
        toast.error(data.error || "Görsel yüklenemedi.");
      }
    } catch {
      toast.error("Görsel yüklenirken sunucu hatası oluştu.");
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(media: MediaFileInfo) {
    setMediaToDelete(media);
  }

  async function confirmDelete() {
    if (!mediaToDelete) return;

    setDeletingUrl(mediaToDelete.url);
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: mediaToDelete.url }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Dosya başarıyla silindi.");
        setMediaList((prev) => prev.filter((item) => item.url !== mediaToDelete.url));
        if (previewImage?.url === mediaToDelete.url) setPreviewImage(null);
        setMediaToDelete(null);
      } else {
        toast.error(data.error || "Dosya silinemedi.");
      }
    } catch {
      toast.error("Silme işlemi sırasında hata oluştu.");
    } finally {
      setDeletingUrl(null);
    }
  }

  function handleCopyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("Görsel bağlantısı panoya kopyalandı!");
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Medya &amp; Görsel Kütüphanesi
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Ürün, kategori ve vitrin görsellerini görüntüleyin, yönetin ve ürünlere atayın ({mediaList.length} Dosya)
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{uploading ? "Yükleniyor..." : "Yeni Medya Yükle"}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </label>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Dosya adına göre filtrele (örn: dali, karyola, lift, sehpa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        {/* Folder Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "Tüm Medyalar" },
            { id: "products", label: "Ürün Fotoğrafları" },
            { id: "categories", label: "Kategori Görselleri" },
            { id: "uploads", label: "Genel Yüklemeler" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFolderFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                folderFilter === tab.id
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-16 flex flex-col items-center justify-center text-neutral-400 gap-3">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-700">Medyalar taranıyor...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-16 text-center text-neutral-400 space-y-2">
          <p className="text-base font-bold text-neutral-800">Eşleşen Medya Bulunamadı</p>
          <p className="text-xs text-neutral-500">Arama filtrenizi temizleyin veya yeni görsel yükleyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaList.map((media) => (
            <div
              key={media.url}
              className="group bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image Preview Box */}
              <div
                onClick={() => setPreviewImage(media)}
                className="relative aspect-square w-full bg-neutral-50 cursor-pointer overflow-hidden"
              >
                <Image
                  src={media.url}
                  alt={media.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />

                {/* Folder Badge */}
                <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-900/80 text-white backdrop-blur-xs">
                  {media.folder === "products" ? "Ürün" : media.folder === "categories" ? "Kategori" : "Genel"}
                </span>

                {/* Hover Quick Action Buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30">
                    Büyüt
                  </span>
                </div>
              </div>

              {/* Card Footer Details & Actions */}
              <div className="p-3 border-t border-neutral-100 space-y-2">
                <div>
                  <p className="text-xs font-bold text-neutral-900 truncate leading-tight" title={media.name}>
                    {media.name}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {formatBytes(media.size)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(media.url)}
                    className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-semibold transition-colors truncate text-center cursor-pointer"
                    title="URL Kopyala"
                  >
                    URL Kopyala
                  </button>

                  <button
                    type="button"
                    disabled={deletingUrl === media.url}
                    onClick={() => handleDelete(media)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                    title="Dosyayı Sil"
                    aria-label="Dosyayı Sil"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* High-Resolution Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 truncate max-w-md">
                  {previewImage.name}
                </h3>
                <p className="text-xs text-neutral-500">
                  {formatBytes(previewImage.size)} &bull; {previewImage.folder}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="relative aspect-video w-full bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100 flex items-center justify-center">
              <Image
                src={previewImage.url}
                alt={previewImage.name}
                fill
                className="object-contain p-4"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <code className="text-xs bg-neutral-100 text-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 truncate max-w-md font-mono">
                {previewImage.url}
              </code>

              <button
                type="button"
                onClick={() => handleCopyUrl(previewImage.url)}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                URL'yi Kopyala
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medya Silme Onay Modalı */}
      <ConfirmModal
        isOpen={Boolean(mediaToDelete)}
        title="Görseli Sil"
        description={`"${mediaToDelete?.name}" dosyasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu görseli kullanan ürünlerin galerisinden çıkarılacaktır.`}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={Boolean(deletingUrl)}
        onClose={() => setMediaToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
