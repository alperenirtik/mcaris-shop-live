import type { Metadata } from"next";
import {
  BUSINESS_ADDRESS,
  BUSINESS_PHONE,
  BUSINESS_PHONE_SECONDARY,
  WHATSAPP_NUMBER,
  BUSINESS_EMAIL,
  GOOGLE_MAPS_EMBED_SRC,
  GOOGLE_MAPS_DIRECTIONS_URL,
  INSTAGRAM_URL,
  FACEBOOK_URL,
} from"@/lib/constants";
import { ProtectedPhone, ProtectedEmail } from "@/components/ui/ProtectedContact";
import ContactFormClient from"./ContactFormClient";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema } from"@/lib/seo";

export const metadata: Metadata = {
  title: "İletişim & Mağaza Konumu — 7/24 Medikal Destek",
  description:
    "MCARIS Medikal Ankara merkez mağazası iletişim bilgileri, telefon numaraları, adres ve Google Haritalar konumu. 7/24 acil hasta yatağı ve medikal danışma hattı.",
  alternates: {
    canonical: "/iletisim",
  },
  openGraph: {
    title: `İletişim & Medikal Danışma | ${BRAND_NAME}`,
    description:
      "Hasta yatakları ve medikal ekipmanlar için bize ulaşın. Telefon: 0536 820 02 69 - Ankara Yenimahalle.",
    url: `${SITE_URL}/iletisim`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `İletişim & Mağaza Konumu — ${BRAND_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `İletişim | ${BRAND_NAME}`,
    description:
      "MCARIS Medikal Ankara mağazası adres, telefon ve danışma bilgileri.",
    images: [`${SITE_URL}/og-image.png`],
  },
};


export default function ContactPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name:"Ana Sayfa", url:"/" },
    { name:"İletişim", url:"/iletisim" },
  ]);

  const contactSchema = {"@context":"https://schema.org","@type":"ContactPage","@id": `${SITE_URL}/iletisim#webpage`,
    url: `${SITE_URL}/iletisim`,
    name:"İletişim — MCARIS Medikal",
    description:"MCARIS Medikal 7/24 müşteri destek ve iletişim merkezi.",
    mainEntity: {"@type":"MedicalSupplyStore",
      name: BRAND_NAME,
      telephone: BUSINESS_PHONE,
      email: BUSINESS_EMAIL,
      address: {"@type":"PostalAddress",
        streetAddress: BUSINESS_ADDRESS,
        addressLocality:"Yenimahalle",
        addressRegion:"Ankara",
        addressCountry:"TR",
      },
    },
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50/50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Header Section */}
      <section className="relative w-full bg-[#0F1E36] text-white py-14 md:py-20 overflow-hidden border-b border-slate-800">
        <div className="max-w-container-max mx-auto px-4 md:px-6 relative z-10 text-center flex flex-col items-center gap-3">
          <span className="px-3.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-slate-200 bg-slate-800 border border-slate-700 inline-flex items-center gap-2">
            <span>MCARIS Sağlık &amp; Medikal İletişim</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-inter leading-tight">
            Bizimle İletişime Geçin
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-inter">
            Hasta yatakları, medikal ürünler veya siparişleriniz hakkında merak ettiğiniz tüm sorular için 7/24 uzman kadromuzla yanınızdayız.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-container-max mx-auto px-4 md:px-6 -mt-8 relative z-20 w-full space-y-10">
        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Card 1: Telefon */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Telefon Destek
              </h3>
              <ProtectedPhone
                phone={BUSINESS_PHONE}
                display={BUSINESS_PHONE}
                className="text-base font-bold text-slate-900 hover:text-brand transition-colors block font-mono"
              />
              <ProtectedPhone
                phone={BUSINESS_PHONE_SECONDARY}
                display={BUSINESS_PHONE_SECONDARY}
                prefix="Tel: "
                className="text-xs text-slate-500 hover:text-brand transition-colors block font-mono mt-1"
              />
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex gap-2">
              <ProtectedPhone
                phone={BUSINESS_PHONE}
                display="Hemen Ara"
                className="flex-1 bg-[#0F1E36] hover:bg-[#183158] text-white text-xs font-bold py-2 rounded-lg text-center transition-colors inline-block"
              />
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg text-center transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Card 2: Adres */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Merkez Mağaza & Adres
              </h3>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                {BUSINESS_ADDRESS}
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100">
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block bg-slate-100 text-slate-900 hover:bg-slate-200 text-xs font-bold py-2 rounded-lg text-center transition-colors"
              >
                Haritada Yol Tarifi Al →
              </a>
            </div>
          </div>

          {/* Card 3: E-Posta */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                E-Posta & Teklif
              </h3>
              <ProtectedEmail
                user="info"
                domain="mcaris.com.tr"
                className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand transition-colors block font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Kurumsal teklifler için gün içinde dönüş.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100">
              <ProtectedEmail
                user="info"
                domain="mcaris.com.tr"
                display="E-Posta Gönder →"
                className="w-full inline-block bg-slate-100 text-slate-900 hover:bg-slate-200 text-xs font-bold py-2 rounded-lg text-center transition-colors"
              />
            </div>
          </div>

          {/* Card 4: Çalışma Saatleri */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Çalışma Saatleri
              </h3>
              <p className="text-xs font-bold text-slate-900">
                Pazartesi - Cumartesi: 09:00 - 19:00
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Pazar günleri acil servisimiz hizmet vermektedir.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-500">Sosyal:</span>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-700 hover:text-brand transition-colors"
              >
                Instagram
              </a>
              <span className="text-slate-300">•</span>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-700 hover:text-brand transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Split Section: Contact Form + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Form */}
          <ContactFormClient />

          {/* Right Map Card */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 space-y-4 font-inter">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-inter">
                  Mağaza Konumumuz
                </h3>
                <p className="text-xs text-slate-500 font-inter">
                  Ankara Yenimahalle merkez mağazamızı ziyaret edebilirsiniz.
                </p>
              </div>
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-full border border-slate-200 transition-colors inline-flex items-center gap-1"
                aria-label="Google Haritalar üzerinden yol tarifi al"
              >
                <span>Google Maps</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <iframe
                title="Harita"
                src={GOOGLE_MAPS_EMBED_SRC}
                width="100%"
                height="440"
                loading="lazy"
                className="w-full border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
