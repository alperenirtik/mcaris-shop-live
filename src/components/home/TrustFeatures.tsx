export default function TrustFeatures() {
  const features = [
    {
      title: "Ankara İçi Ücretsiz Montaj",
      description: "Ankara içi adrese teslimat & kata montaj, Türkiye geneli güvenli sevkiyat.",
      icon: (
        <svg className="w-6 h-6 text-slate-800" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: "Orijinal Ürün & Garanti",
      description: "%100 yerli üretim & Avrupa standartlarında 2 yıl garanti.",
      icon: (
        <svg className="w-6 h-6 text-slate-800" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "7/24 Kesintisiz Destek",
      description: "Uzman hasta bakım danışmanlarımız her zaman yanınızda.",
      icon: (
        <svg className="w-6 h-6 text-slate-800" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      title: "256-Bit 3D Güvenli Ödeme",
      description: "Tüm kredi kartlarına peşin fiyatına taksit ve Havale/EFT.",
      icon: (
        <svg className="w-6 h-6 text-slate-800" stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <section className="max-w-container-max mx-auto px-4 md:px-6 w-full py-4 font-inter">
      <div className="bg-white border border-neutral-200/90 rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
        {features.map((f, i) => (
          <div
            key={i}
            className={`flex items-center gap-3.5 p-1 ${
              i > 0 ? "pt-3 sm:pt-0 sm:pl-4 lg:pl-6" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-800">
              {f.icon}
            </div>
            <div>
              <p className="text-xs md:text-sm font-semibold text-neutral-900 leading-snug">
                {f.title}
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


