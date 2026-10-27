"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { MediaFileInfo } from "@/app/api/admin/media/route";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  multiple?: boolean;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  multiple = true,
  title = "Medya Kütüphanesinden Seç",
}: MediaPickerModalProps) {
  const [mediaList, setMediaList] = useState<MediaFileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    } catch (err) {
      console.error("Medya yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, folderFilter]);

  useEffect(() => {
    let active = true;
    if (isOpen) {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (folderFilter !== "all") params.set("folder", folderFilter);

      fetch(`/api/admin/media?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (active && data) setMediaList(data.files || []);
        })
        .catch((err) => {
          if (active) console.error("Medya yüklenemedi:", err);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      setSelectedUrls([]);
      setUploadError(null);
    }
    return () => {
      active = false;
    };
  }, [isOpen, searchQuery, folderFilter]);

  if (!isOpen) return null;

  function handleToggleSelect(url: string) {
    if (!multiple) {
      setSelectedUrls([url]);
      return;
    }
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  }

  function handleConfirm() {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onClose();
    }
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

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
        await fetchMedia();
        if (multiple) {
          setSelectedUrls((prev) => [...prev, ...data.urls]);
        } else if (data.urls.length > 0) {
          setSelectedUrls([data.urls[0]]);
        }
      } else {
        setUploadError(data.error || "Görsel yüklenemedi.");
      }
    } catch {
      setUploadError("Görsel yüklenirken sunucu hatası oluştu.");
    } finally {
      setUploading(false);
    }
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50 font-sans">
      <div className="bg-white w-full max-w-5xl h-[90vh] max-h-[850px] rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-none">
                {title}
              </h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Mevcut ürün veya kategori fotoğraflarından seçim yapın ya da yeni yükleyin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filter Toolbar & Quick Upload */}
        <div className="p-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Görsel adına göre ara (örn: dali, karyola, lift)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          {/* Folder Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "Tümü" },
              { id: "products", label: "Ürünler" },
              { id: "categories", label: "Kategoriler" },
              { id: "uploads", label: "Genel Yüklemeler" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFolderFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  folderFilter === f.id
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quick Direct Upload Button */}
          <label className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>{uploading ? "Yükleniyor..." : "Yeni Görsel Yükle"}</span>
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

        {uploadError && (
          <div className="mx-4 mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium shrink-0">
            {uploadError}
          </div>
        )}

        {/* Media Grid View Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-2 py-16">
              <div className="w-7 h-7 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
              <span className="text-xs font-medium">Medya kütüphanesi taranıyor...</span>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-2 py-16">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-sm font-semibold text-neutral-700">Görsel bulunamadı</p>
              <p className="text-xs text-neutral-400">Arama filtrenizi değiştirin veya yeni görsel yükleyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {mediaList.map((media) => {
                const isSelected = selectedUrls.includes(media.url);
                return (
                  <div
                    key={media.url}
                    onClick={() => handleToggleSelect(media.url)}
                    className={`group relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer bg-neutral-50 flex flex-col justify-between ${
                      isSelected
                        ? "border-neutral-900 ring-2 ring-neutral-900/20 bg-neutral-100 shadow-md scale-[0.98]"
                        : "border-neutral-200 hover:border-neutral-400 hover:shadow-xs"
                    }`}
                  >
                    {/* Image Preview Box */}
                    <div className="relative aspect-square w-full bg-white overflow-hidden">
                      <Image
                        src={media.url}
                        alt={media.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      />

                      {/* Selection Checkmark Badge */}
                      <div
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-neutral-900 text-white shadow-xs scale-100"
                            : "bg-white/80 text-transparent border border-neutral-300 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>

                      {/* Folder Badge */}
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-900/80 text-white backdrop-blur-xs">
                        {media.folder === "products" ? "Ürün" : media.folder === "categories" ? "Kategori" : "Yükleme"}
                      </span>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2 bg-white border-t border-neutral-100 text-left">
                      <p className="text-[11px] font-semibold text-neutral-900 truncate leading-tight" title={media.name}>
                        {media.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {formatBytes(media.size)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Confirm Bar */}
        <div className="px-5 py-3.5 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between shrink-0">
          <div className="text-xs font-semibold text-neutral-600">
            {selectedUrls.length > 0 ? (
              <span className="text-neutral-950 font-bold">
                {selectedUrls.length} görsel seçildi
              </span>
            ) : (
              <span>Seçim yapmak için görsellere tıklayın</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="button"
              disabled={selectedUrls.length === 0}
              onClick={handleConfirm}
              className="px-5 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer active:scale-98"
            >
              {multiple ? `Seçilenleri Ekle (${selectedUrls.length})` : "Görseli Seç"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
