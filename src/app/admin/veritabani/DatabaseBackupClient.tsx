"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { DatabaseBackupStats, BackupFileInfo } from "@/lib/database-backup";

interface Props {
  initialStats: DatabaseBackupStats;
  initialTotalRecords: number;
  initialFiles: BackupFileInfo[];
}

export default function DatabaseBackupClient({
  initialStats,
  initialTotalRecords,
  initialFiles,
}: Props) {
  const [stats, setStats] = useState<DatabaseBackupStats>(initialStats);
  const [totalRecords, setTotalRecords] = useState<number>(initialTotalRecords);
  const [files, setFiles] = useState<BackupFileInfo[]>(initialFiles);
  const [isBackingUp, setIsBackingUp] = useState<"database" | "full" | null>(null);

  const handleTakeBackup = async (type: "database" | "full") => {
    setIsBackingUp(type);
    const loadingMessage =
      type === "full"
        ? "Tam sistem yedeği (.ZIP - Veritabanı + Tüm Görseller) hazırlanıyor..."
        : "Veritabanının tam yedeği alınıyor...";

    const toastId = toast.loading(loadingMessage);

    try {
      const response = await fetch("/api/admin/database/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Yedek alınamadı.");
      }

      toast.success(data.message || "Yedek başarıyla oluşturuldu!", { id: toastId });

      // Listeyi tazele
      const refreshRes = await fetch("/api/admin/database/backup");
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.success) {
          setStats(refreshData.stats);
          setTotalRecords(refreshData.totalRecords);
          setFiles(refreshData.files);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Yedekleme sırasında hata oluştu.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsBackingUp(null);
    }
  };

  const statItems = [
    {
      label: "Ürünler",
      value: stats.Product,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      label: "Kategoriler",
      value: stats.Category,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Siparişler",
      value: stats.Order,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      label: "Kullanıcılar",
      value: stats.User,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Blog Yazıları",
      value: stats.BlogPost,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      label: "Kuponlar",
      value: stats.Coupon,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
    },
    {
      label: "SSS Soruları",
      value: stats.Faq,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      label: "Yorumlar",
      value: stats.Review,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Two Backup Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <span>Veritabanı & Tam Sistem Yedekleme</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Coolify PostgreSQL Bağlı
            </span>
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Canlı veritabanını ve yüklenen tüm ürün görsellerini tek tıkla arşivleyin, indirin veya bilgisayarınızla eşitleyin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick DB Backup (SQL/JSON) */}
          <button
            type="button"
            onClick={() => handleTakeBackup("database")}
            disabled={isBackingUp !== null}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 text-xs sm:text-sm font-semibold rounded-xl border border-neutral-300 shadow-2xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isBackingUp === "database" ? (
              <>
                <svg className="animate-spin h-4 w-4 text-neutral-800" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>DB Yedekleniyor...</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <span>Hızlı DB Yedeği (SQL/JSON)</span>
              </>
            )}
          </button>

          {/* Full System Backup (.ZIP) */}
          <button
            type="button"
            onClick={() => handleTakeBackup("full")}
            disabled={isBackingUp !== null}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isBackingUp === "full" ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Tam Sistem (.ZIP) Paketleniyor...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Tam Sistem Yedeği (.ZIP - DB + Görseller)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs">
          <span className="text-xs font-medium text-neutral-500 block">Toplam DB Kaydı</span>
          <span className="text-2xl font-extrabold text-neutral-900 mt-1 block tabular-nums">
            {totalRecords.toLocaleString("tr-TR")}
          </span>
        </div>
        {statItems.slice(0, 3).map((item) => (
          <div key={item.label} className="bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs">
            <span className="text-xs font-medium text-neutral-500 flex items-center justify-between">
              <span>{item.label}</span>
              <span className="text-sm">{item.icon}</span>
            </span>
            <span className="text-2xl font-extrabold text-neutral-900 mt-1 block tabular-nums">
              {item.value?.toLocaleString("tr-TR") ?? 0}
            </span>
          </div>
        ))}
      </div>

      {/* Sync & Media Auto-Download Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/60 border border-blue-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2.5 bg-blue-100/90 text-blue-900 rounded-xl shrink-0 mt-0.5 shadow-2xs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm text-neutral-700 flex-1">
            <h3 className="font-bold text-neutral-950 text-sm sm:text-base flex items-center gap-2">
              <span>Tam Sistem Senkronizasyonu & Canlı Görsel Aktarımı</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">
                Otomatik (npm run dev)
              </span>
            </h3>
            <p className="leading-relaxed">
              Bilgisayarınızda <code className="bg-white/90 px-1.5 py-0.5 rounded border border-blue-200 text-neutral-900 font-mono text-xs">npm run dev</code> çalıştırdığınızda;
              canlı veritabanı yedeği bilgisayarınızdaki <code className="bg-white/90 px-1.5 py-0.5 rounded border border-blue-200 text-neutral-900 font-mono text-xs">backups/</code> klasörüne indirilir.
              Aynı anda canlıda olup <strong>yerelde eksik olan tüm ürün ve blog fotoğrafları</strong> da otomatik tespit edilerek yerel <code className="bg-white/90 px-1.5 py-0.5 rounded border border-blue-200 text-neutral-900 font-mono text-xs">public/uploads/</code> dizininize tek tek indirilir ve eşitlenir.
            </p>
          </div>
        </div>
      </div>

      {/* Backups List Table */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Arşivlenen Yedek Dosyaları</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              İstediğiniz yedeği doğrudan tarayıcınıza indirebilirsiniz. (En güncel 25 yedek tutulur)
            </p>
          </div>
          <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md border border-neutral-200 font-semibold">
            {files.length} Arşiv Dosyası
          </span>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 mx-auto mb-3 text-neutral-300">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-700">Henüz alınmış bir yedek bulunmuyor.</p>
            <p className="text-xs text-neutral-400 mt-1">Yukarıdaki butonlardan birine tıklayarak ilk yedeği oluşturabilirsiniz.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-100 text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Dosya Adı</th>
                  <th className="py-3 px-4">Format / İçerik</th>
                  <th className="py-3 px-4">Boyut</th>
                  <th className="py-3 px-4">Oluşturulma Tarihi</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {files.map((file) => (
                  <tr key={file.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-neutral-900 truncate max-w-[280px]">
                      {file.name}
                    </td>
                    <td className="py-3.5 px-4">
                      {file.extension === "zip" ? (
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 font-bold text-[11px] rounded-md border border-purple-200 inline-flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-700">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                          </svg>
                          <span>Tam Sistem (.ZIP)</span>
                        </span>
                      ) : file.extension === "sql" ? (
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[11px] rounded-md border border-blue-200 inline-flex items-center gap-1">
                          <span>PostgreSQL .sql</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-md border border-amber-200 inline-flex items-center gap-1">
                          <span>JSON .json</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 font-mono text-xs font-semibold">
                      {file.sizeFormatted}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 text-xs">
                      {new Date(file.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`/api/admin/database/backup?download=${file.name}`}
                        download={file.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded-lg border border-neutral-200 shadow-2xs transition-colors cursor-pointer"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>İndir</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
