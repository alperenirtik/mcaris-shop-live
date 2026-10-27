"use client";

const ANNOUNCEMENT_ITEMS = ["Platinum Hasta Yatakları","Gold Hasta Yatakları","Silver Hasta Yatakları","7/24 Hizmet ve Kurulum Desteği","Türkiye Geneli Hızlı Kargo ve Teslimat",
];

export default function AnnouncementBarClient() {
  const items = [...ANNOUNCEMENT_ITEMS, ...ANNOUNCEMENT_ITEMS, ...ANNOUNCEMENT_ITEMS];

  return (
    <div className="bg-[#122238] text-white py-2 border-b border-slate-800 overflow-hidden whitespace-nowrap select-none">
      <div className="flex w-max items-center">
        <div className="animate-marquee flex items-center gap-8 shrink-0">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 inline-flex">
              <span className="font-bold text-slate-200 tracking-wider text-xs sm:text-sm uppercase">
                {item}
              </span>
              <span className="text-brand text-xs font-bold">&bull;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
