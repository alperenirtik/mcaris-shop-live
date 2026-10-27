"use client";

import { useState } from "react";
import { toggleReviewApprovalAction, deleteReviewAction } from "@/app/actions/reviewAdminActions";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Link from "next/link";

interface ProductReviewItem {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  product: {
    name: string;
    slug: string;
  };
}

interface ReviewManagerClientProps {
  reviews: ProductReviewItem[];
}

export default function ReviewManagerClient({ reviews: initialReviews }: ReviewManagerClientProps) {
  const [reviews, setReviews] = useState<ProductReviewItem[]>(initialReviews);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    const res = await toggleReviewApprovalAction(id, currentStatus);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: !currentStatus } : r))
      );
    }
    setUpdatingId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteReviewAction(deleteId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.message);
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-inter">Ürün Yorumları &amp; Moderasyon</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-inter mt-1">
            Ürün sayfalarına bırakılan müşteri değerlendirmelerini onaylayın veya yönetin.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto font-mono">
          Toplam {reviews.length} Yorum
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 font-medium text-sm">Henüz ürün değerlendirmesi yapılmamış.</p>
        </div>
      ) : (
        <div className="space-y-4 font-inter">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all space-y-4 ${
                rev.isApproved ? "border-slate-200" : "border-amber-300 bg-amber-50/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{rev.userName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rev.isApproved ? "Yayında" : "Onay Bekliyor / Gizli"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Ürün:{" "}
                    <Link
                      href={`/urun/${rev.product.slug}`}
                      target="_blank"
                      className="text-brand font-bold hover:underline"
                    >
                      {rev.product.name} ↗
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                    ))}
                    <span className="ml-1 text-slate-500 font-bold font-mono text-[11px]">({rev.rating}/5)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  disabled={updatingId === rev.id}
                  onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                    rev.isApproved
                      ? "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  {updatingId === rev.id
                    ? "İşleniyor..."
                    : rev.isApproved
                    ? "Yayından Kaldır"
                    : "Onayla & Yayınla"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(rev.id)}
                  className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Yorumu Sil"
        description="Bu ürün yorumunu kalıcı olarak silmek istediğinizden emin misiniz?"
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
