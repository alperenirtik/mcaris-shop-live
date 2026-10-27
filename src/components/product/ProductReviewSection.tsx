"use client";

import { useState } from "react";
import { toast } from "sonner";

interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  title?: string | null;
  comment: string;
  verified?: boolean;
  createdAt: string | Date;
}

interface ProductReviewSectionProps {
  productId: string;
  initialReviews?: ReviewItem[];
}

export default function ProductReviewSection({
  productId,
  initialReviews = [],
}: ProductReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      toast.error("Lütfen isim ve yorum alanlarını doldurunuz.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userName: userName.trim(),
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Yorum kaydedilemedi.");
      }

      if (data.review?.isApproved) {
        toast.success("Değerlendirmeniz başarıyla yayınlandı!");
        setReviews([data.review, ...reviews]);
      } else {
        toast.success("Değerlendirmeniz alındı; yönetici onayından sonra yayınlanacaktır.");
      }
      setShowForm(false);
      setUserName("");
      setTitle("");
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-2xs space-y-8 font-inter">
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white">
              DEĞERLENDİRMELER
            </span>
            <span className="text-xs font-bold text-neutral-500">Kullanıcı Yorumları</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Müşteri Deneyimleri &amp; Yorumlar
          </h3>
        </div>

        {/* Aggregate Score & Action */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-3xl font-extrabold text-neutral-950">{averageRating}</span>
              <span className="text-amber-500 text-base">★★★★★</span>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              Toplam {totalReviews} Doğrulanmış Değerlendirme
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
          >
            {showForm ? "Formu Kapat" : "Değerlendirme Yap"}
          </button>
        </div>
      </div>

      {/* Review Submission Form Modal / Box */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-50/80 p-5 sm:p-6 rounded-2xl border border-neutral-200/90 space-y-4 animate-in fade-in duration-200"
        >
          <h4 className="text-sm sm:text-base font-bold text-neutral-950">
            Ürün Hakkındaki Deneyiminizi Paylaşın
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Adınız Soyadınız</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">Puanınız</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900 cursor-pointer font-bold text-amber-600"
              >
                <option value={5}>★★★★★ (5/5 - Mükemmel)</option>
                <option value={4}>★★★★☆ (4/5 - Çok İyi)</option>
                <option value={3}>★★★☆☆ (3/5 - Orta)</option>
                <option value={2}>★★☆☆☆ (2/5 - Yetersiz)</option>
                <option value={1}>★☆☆☆☆ (1/5 - Memnun Kalmadım)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">Başlık (Opsiyonel)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Aynı gün teslim edildi, motoru çok sessiz"
              className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1">Yorumunuz</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Karyola konforu, teslimat ve teknik servis hakkındaki görüşleriniz..."
              className="w-full p-3 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-xs font-bold rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Kaydediliyor..." : "Yorumu Yayınla"}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                    {rev.userName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">{rev.userName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 text-xs">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                      {rev.verified !== false && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 inline-flex items-center gap-1">
                          ✓ Onaylı Alıcı
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-neutral-400 font-medium">
                  {new Date(rev.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              {rev.title && (
                <h4 className="text-sm font-bold text-neutral-950 pt-1">{rev.title}</h4>
              )}

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border border-dashed border-neutral-200 rounded-2xl p-6 space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-neutral-600">
              Bu ürün için henüz müşteri yorumu eklenmemiş.
            </p>
            <p className="text-xs text-neutral-400">
              İlk deneyiminizi paylaşarak diğer hasta yakınlarına rehberlik edebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
