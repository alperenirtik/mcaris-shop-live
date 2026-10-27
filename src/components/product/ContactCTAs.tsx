import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_SECONDARY,
  WHATSAPP_NUMBER,
  BUSINESS_EMAIL,
} from "@/lib/constants";

export default function ContactCTAs({ productName }: { productName: string }) {
  const message = encodeURIComponent(`Merhaba, "${productName}" ürünü hakkında bilgi almak istiyorum.`);

  return (
    <section className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border border-slate-800 shadow-sm mt-8 font-inter">
      {/* Content Left */}
      <div className="flex items-start md:items-center gap-4 md:gap-5 z-10 w-full md:w-auto">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-center shrink-0 text-emerald-400 shadow-2xs">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-white font-inter">Müşteri &amp; Teknik Destek</h3>
            <span className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              7/24 VIP DANIŞMA
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-300">
            <a href={`tel:${BUSINESS_PHONE}`} className="hover:text-white transition-colors flex items-center gap-1.5">
              {BUSINESS_PHONE}
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a href={`tel:${BUSINESS_PHONE_SECONDARY}`} className="hover:text-white transition-colors">
              {BUSINESS_PHONE_SECONDARY}
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a href={`mailto:${BUSINESS_EMAIL}`} className="hover:text-white transition-colors">
              {BUSINESS_EMAIL}
            </a>
          </div>
        </div>
      </div>

      {/* Button Right */}
      <div className="z-10 w-full md:w-auto shrink-0">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          WhatsApp Canlı Danışma
        </a>
      </div>
    </section>
  );
}
