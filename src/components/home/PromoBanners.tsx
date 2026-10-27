import Link from "next/link";

export default function PromoBanners() {
  const banners = [
    {
      badge: "Popüler Ev Tipi Seri",
      title: "Ev Tipi Ahşap Hasta Karyolaları",
      subtitle:
        "Hastane havasından uzak, evinizin sıcaklığına uyum sağlayan konforlu ve sessiz motorlu hasta yatakları.",
      buttonText: "Ahşap Karyolaları İncele",
      href: "/kategori/hasta-yataklari",
      bgClass: "bg-neutral-900 text-white border-neutral-800",
      badgeClass: "text-neutral-400 font-semibold",
      btnClass: "bg-white text-neutral-900 hover:bg-neutral-100",
    },
    {
      badge: "Premium Seri",
      title: "4 Motorlu Yoğun Bakım Karyolaları",
      subtitle:
        "Hemşire kontrol paneli, Trendelenburg ve X-Ray geçirgen sırt yüzeyli medikal teknoloji.",
      buttonText: "Yoğun Bakım Modellerini Gör",
      href: "/seri/platinum",
      bgClass: "bg-neutral-800 text-white border-neutral-700",
      badgeClass: "text-neutral-300 font-semibold",
      btnClass: "bg-white text-neutral-900 hover:bg-neutral-100",
    },
    {
      badge: "Tamamlayıcı Bakım",
      title: "Yatak Üstü Yemek Masaları",
      subtitle:
        "Amortisörlü yükseklik ayarı, tekerlekli fren sistemi ve dayanıklı laminat yüzeyli medikal masalar.",
      buttonText: "Yemek Masalarını İncele",
      href: "/kategori/hasta-yemek-masalari",
      bgClass: "bg-neutral-100 text-neutral-900 border-neutral-200",
      badgeClass: "text-neutral-500 font-semibold",
      btnClass: "bg-neutral-900 text-white hover:bg-black",
    },
  ];

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {banners.map((b, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-200 ${b.bgClass}`}
          >
            <div className="space-y-2.5">
              <span className={`text-[11px] font-bold tracking-wide block ${b.badgeClass}`}>
                {b.badge}
              </span>
              <p className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
                {b.title}
              </p>
              <p className="text-xs opacity-80 leading-relaxed">
                {b.subtitle}
              </p>
            </div>

            <div className="pt-6">
              <Link
                href={b.href}
                aria-label={`${b.title} - ${b.buttonText}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all active:scale-98 ${b.btnClass}`}
              >
                <span>{b.buttonText}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


