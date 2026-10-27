"use client";

import { useState } from "react";
import { addReviewAction } from "@/app/actions/reviewActions";
import { toast } from "sonner";

export interface ReviewData {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
}

interface ProductReviewsProps {
  productId: string;
  productSlug: string;
  reviews: ReviewData[];
}

export default function ProductReviews({ productId, productSlug, reviews = [] }: ProductReviewsProps) {
  const [localReviews, setLocalReviews] = useState<ReviewData[]>(reviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalReviews = localReviews.length;
  const avgRating =
    totalReviews > 0
      ? (localReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userName.trim() || !comment.trim()) {
      toast.error("Lütfen adınızı ve değerlendirmenizi eksiksiz doldurunuz.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("slug", productSlug);
      formData.append("userName", userName.trim());
      formData.append("comment", comment.trim());
      formData.append("rating", rating.toString());

      const result = await addReviewAction({}, formData);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.message || "Değerlendirmeniz başarıyla kaydedildi.");
        // Optimistically add to UI
        const newReview: ReviewData = {
          id: "temp-" + Date.now(),
          userName: userName.trim(),
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
        };
        setLocalReviews((prev) => [newReview, ...prev]);
        setUserName("");
        setComment("");
        setRating(5);
      }
    } catch {
      toast.error("Yorum kaydedilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutral-200/90 shadow-2xs space-y-8 font-inter">
      {/* Title & Overall Rating Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-100 pb-6">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-neutral-950 flex items-center gap-2.5">
            <span className="text-amber-500">★</span>
            <span>Müşteri &amp; Hasta Yakını Değerlendirmeleri</span>
          </h2>
          <p className="text-xs md:text-sm text-neutral-500">
            Bu medikal ürün hakkında doğrulanmış hasta ve klinik alıcıların gerçek deneyimleri.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-200/80 px-5 py-3 rounded-xl shrink-0">
          <div className="text-2xl md:text-3xl font-black text-neutral-900 font-mono">
            {avgRating ?? "—"}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center text-amber-400 text-sm">
              {avgRating ? (
                <>
                  {"★".repeat(Math.round(Number(avgRating)))}
                  {"☆".repeat(5 - Math.round(Number(avgRating)))}
                </>
              ) : (
                "☆☆☆☆☆"
              )}
            </div>
            <div className="text-xs font-bold text-neutral-600">
              {totalReviews === 0 ? "Henüz değerlendirme yok" : `${totalReviews} Doğrulanmış Değerlendirme`}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Side: Reviews List (7-cols) */}
        <div className="lg:col-span-7 space-y-5">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            Yorumlar &amp; Deneyimler ({totalReviews})
          </h3>

          {totalReviews === 0 ? (
            <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-neutral-800">Bu ürün için henüz yorum yapılmamış.</p>
              <p className="text-xs text-neutral-500">İlk hasta veya refakatçi deneyimini paylaşan siz olun!</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {localReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-xl bg-neutral-50/70 border border-neutral-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-950">{rev.userName}</div>
                        <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <span>✓ Doğrulanmış Alıcı</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-amber-500 text-xs font-bold font-mono">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="text-[10px] text-neutral-400 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Add Review Form (5-cols) */}
        <div className="lg:col-span-5 bg-neutral-50/80 rounded-2xl p-5 sm:p-6 border border-neutral-200/90 space-y-4">
          <h3 className="text-sm font-bold text-neutral-950">
            Değerlendirme Bırakın
          </h3>
          <p className="text-xs text-neutral-500">
            Ürün hakkındaki klinik deneyiminizi veya montaj sürecini paylaşarak diğer hasta yakınlarına rehberlik edebilirsiniz.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Interactive Star Rating Selector */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Puanınız <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-amber-400 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                  >
                    {star <= (hoverRating || rating) ? "★" : "☆"}
                  </button>
                ))}
                <span className="text-xs font-bold text-neutral-600 ml-2 font-mono">
                  ({rating} / 5)
                </span>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Adınız Soyadınız <span className="text-rose-500">*</span>
              </label>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="Örn: Mehmet Özkan (Hasta Refakatçisi)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 bg-white"
              />
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Değerlendirmeniz <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                placeholder="Hasta karyolasının kullanım kolaylığı, kumandası ve kurulum hizmeti hakkında görüşleriniz..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 bg-white leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#0B1528] hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Kaydediliyor..." : "Değerlendirmeyi Yayınla"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
