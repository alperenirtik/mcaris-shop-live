import type { Metadata } from "next";
import Link from "next/link";
import FAQClient from "@/components/faq/FAQClient";
import { getFaqs } from "@/lib/faq";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular (SSS) & Hasta Karyolası Destek Rehberi",
  description:
    "Motorlu hasta yatakları, kiralama koşulları, aynı gün teslimat, 2 yıl yerinde servis garantisi ve ödeme süreçleri hakkında sıkça sorulan sorular.",
  alternates: {
    canonical: "/sss",
  },
  openGraph: {
    title: `Sıkça Sorulan Sorular (SSS) | ${BRAND_NAME}`,
    description:
      "Motorlu hasta karyolaları, kiralama, teslimat ve teknik servis hakkında merak edilenler.",
    url: `${SITE_URL}/sss`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
  },
};

export default async function FAQPage() {
  const faqs = await getFaqs();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Sıkça Sorulan Sorular", url: "/sss" },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#FAFBFD] min-h-screen py-8 sm:py-12 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-neutral-900">Sıkça Sorulan Sorular</span>
          </nav>

          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-2xs space-y-4 font-inter">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800">
              <span className="text-neutral-900 font-extrabold">Yardım Merkezi</span>
              <span className="text-neutral-300">|</span>
              <span>Sıkça Sorulan Sorular</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
              Hasta Yatağı &amp; Medikal Ekipman Sıkça Sorulan Sorular
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Hasta karyolası seçimi, kiralama sözleşmesi, Ankara içi aynı gün teslimat, 2 yıl yerinde servis garantisi ve ödeme süreçleri hakkında en çok merak edilen konular.
            </p>
          </div>

          {/* Dynamic Interactive FAQ Client */}
          <FAQClient initialFaqs={faqs} />
        </div>
      </div>
    </>
  );
}
