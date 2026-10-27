import { fetchGoogleReviews } from "@/lib/googleReviews";
import ReviewAvatar from "./ReviewAvatar";

export default async function CustomerTestimonials() {
  const data = await fetchGoogleReviews();
  const reviews = data.reviews.slice(0, 3); // Son 3 yorumu göster

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-8 font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-neutral-200/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white leading-tight">
              DEĞERLENDİRME
            </span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Google Haritalar Deneyimleri
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
            MCaris Hasta Karyolası Modelleri Gelen Yorumlar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Google üzerinde <span className="font-bold text-neutral-950">{data.rating || "5.0"} Yıldız</span> ve <span className="font-bold text-neutral-950">{data.user_ratings_total || 104} Değerlendirme</span> ile %100 Müşteri Memnuniyeti
          </p>
        </div>

        <div className="shrink-0">
          <a 
            href="https://maps.app.goo.gl/Dpkg5DtDqbUxvhKw5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-neutral-200 px-4 py-2.5 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <span>Tüm Google Yorumlarını İncele</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {reviews.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200/90 rounded-xl p-5 md:p-6 flex flex-col justify-between hover:border-neutral-400 transition-all duration-200 group"
          >
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(Math.round(t.rating))].map((_, idx) => (
                  <svg key={idx} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed line-clamp-4">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>

            {/* Author info & Google Review Link */}
            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <a
                href={t.author_url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${t.author_name} — Google Haritalar Yorumu`}
                aria-label={`${t.author_name} tarafından yapılan Google Haritalar yorumunu incele`}
                className="flex items-center gap-2.5 group/author hover:opacity-85 transition-opacity"
              >
                <ReviewAvatar
                  src={t.profile_photo_url}
                  name={t.author_name}
                  size={32}
                />
                <div>
                  <p className="text-xs font-semibold text-neutral-900 group-hover/author:text-neutral-600 transition-colors">
                    {t.author_name}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {t.relative_time_description}
                  </p>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


