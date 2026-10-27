import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ANKARA_DISTRICTS, getDistrictBySlug } from "@/lib/ankaraDistricts";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import MarketplaceComparison from "@/components/product/MarketplaceComparison";
import { SITE_URL, BRAND_NAME, BRAND_PHONE, BRAND_ADDRESS } from "@/lib/seo";
import { WHATSAPP_NUMBER, BUSINESS_PHONE } from "@/lib/constants";

interface Props {
  params: Promise<{ ilce: string }>;
}

export async function generateStaticParams() {
  return ANKARA_DISTRICTS.map((d) => ({
    ilce: d.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ilce } = await params;
  const district = getDistrictBySlug(ilce);

  if (!district) {
    return {
      title: "İlçe Bulunamadı | MCARIS Medikal Ankara",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const neighborhoodSample = district.popularNeighborhoods.slice(0, 4).join(", ");

  return {
    title: `${district.name} Hasta Yatağı Satışı & ${district.deliveryTimeHours} Kurulum | MCARIS`,
    description: `${district.name} ve çevresine (${neighborhoodSample}) gün içinde ücretsiz teslimat ve montaj! 2, 3 ve 4 motorlu ahşap/ABS elektrikli hasta karyolaları, transfer liftleri satışı ve yerinde teknik servis.`,
    keywords: [
      `${district.name.toLowerCase()} hasta yatağı`,
      `${district.name.toLowerCase()} hasta karyolası`,
      `${district.name.toLowerCase()} elektrikli hasta karyolası`,
      `${district.name.toLowerCase()} hasta yatağı satışı`,
      `${district.name.toLowerCase()} 4 motorlu hasta karyolası`,
      `${district.name.toLowerCase()} hasta yatağı tamiri`,
      ...district.popularNeighborhoods.map((n) => `${n.toLowerCase()} hasta yatağı`),
    ],
    alternates: {
      canonical: `/ankara-hasta-yatagi/${district.slug}`,
    },
    openGraph: {
      title: `${district.name} Hasta Yatağı Satışı & Kurulum | MCARIS Medikal`,
      description: `${district.name} ilçesine gün içinde ücretsiz teslimat ve uzman montaj. 2, 3, 4 motorlu modeller.`,
      url: `${SITE_URL}/ankara-hasta-yatagi/${district.slug}`,
      type: "website",
    },
  };
}

export default async function DistrictPage({ params }: Props) {
  const { ilce } = await params;
  const district = getDistrictBySlug(ilce);

  if (!district) {
    notFound();
  }

  const products = await getFeaturedProducts();

  const districtSchema = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalSupplyStore"],
    "@id": `${SITE_URL}/ankara-hasta-yatagi/${district.slug}/#business`,
    name: `${BRAND_NAME} - ${district.name} Hasta Yatağı Satış & Kurulum`,
    url: `${SITE_URL}/ankara-hasta-yatagi/${district.slug}`,
    telephone: BRAND_PHONE,
    priceRange: "₺₺₺",
    address: {
      "@type": "PostalAddress",
      ...BRAND_ADDRESS,
      addressLocality: district.name,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.9565,
      longitude: 32.6949,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${district.name}, Ankara`,
    },
    description: district.description,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ankara Hasta Yatağı",
        item: `${SITE_URL}/ankara-hasta-yatagi`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: district.name,
        item: `${SITE_URL}/ankara-hasta-yatagi/${district.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: district.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const otherDistricts = ANKARA_DISTRICTS.filter((d) => d.slug !== district.slug);

  const prefilledWaMessage = encodeURIComponent(
    `Merhaba, ${district.name} ilçesine hasta karyolası siparişi ve gün içinde kurulum hakkında bilgi almak istiyorum.`
  );

  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(districtSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full font-sans pb-12">
        {/* District Hero Header */}
        <section className="relative bg-[#fafbfc] border-b border-neutral-200/80 pt-3 sm:pt-4 pb-8 sm:pb-12 overflow-hidden">
          {/* Soft Framer Grids & Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-sky-200/35 via-blue-100/25 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-16 w-[480px] h-[480px] bg-gradient-to-tl from-cyan-100/35 via-teal-100/20 to-transparent rounded-full blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />
          </div>

        <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 flex items-center gap-2">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/ankara-hasta-yatagi" className="hover:text-neutral-900 transition-colors">
              Ankara Hasta Yatağı
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">{district.name}</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            {/* Top Local Delivery Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900 text-white text-xs font-bold">
              <span className="text-emerald-400">{district.deliveryTimeHours}</span>
              <span className="text-neutral-500">|</span>
              <span>{district.name} Adresine Ücretsiz Kurulum</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15]">
              {district.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {district.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${prefilledWaMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>{district.name} İçin WhatsApp Sipariş</span>
              </a>

              <a
                href={`tel:${BUSINESS_PHONE}`}
                className="bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm px-5 py-3.5 rounded-xl border border-neutral-200 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{BUSINESS_PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="space-y-10 sm:space-y-14 mt-6 sm:mt-8">
        {/* Local EEAT Medical Trust: Nearby Hospitals & Neighborhoods */}
        <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nearby Hospitals */}
            {district.nearbyHospitals.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-neutral-900 font-bold text-base">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white leading-tight">
                    SAĞLIK MERKEZLERİ
                  </span>
                  <h2>{district.name} ve Çevresindeki Referans Hastaneler</h2>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Aşağıdaki hastanelerden taburcu olan veya tedavi gören hastalarımız için adrese öncelikli acil teslimat yapıyoruz:
                </p>
                <div className="flex flex-wrap gap-2">
                  {district.nearbyHospitals.map((hosp, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-semibold border border-neutral-200/60"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      <span>{hosp}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Neighborhoods */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-neutral-900 font-bold text-base">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white leading-tight">
                  TESLİMAT AĞI
                </span>
                <h2>{district.name} Hizmet Mahalleleri</h2>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Kendi servis aracımızla gün içinde kapıya teslim ve oda montajı yaptığımız başlıca bölgeler:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {district.popularNeighborhoods.map((nh, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-50 text-neutral-700 text-xs font-medium border border-neutral-200/60"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{nh}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Services in District */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
              Satış Hizmeti
            </span>
            <h3 className="text-base font-bold text-neutral-950">
              {district.name} Sıfır Hasta Karyolası Satışı
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              2, 3 ve 4 motorlu ahşap kaplama ve ABS panelli hasta yatakları 2 yıl yerinde birebir servis garantisiyle satıştadır.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              Montaj ve Kurulum
            </span>
            <h3 className="text-base font-bold text-neutral-950">
              {district.name} Ücretsiz Adrese Teslim &amp; Kurulum
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Kendi servis araçlarımızla hastanızın odasına kadar çıkarma, montaj ve kumanda kullanımı eğitimi eksiksiz sağlanır.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Teknik Servis
            </span>
            <h3 className="text-base font-bold text-neutral-950">
              {district.name} Yerinde Motor &amp; Parça Tamiri
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Motor arızası, kumanda değişimi, piston ve mekanik bakım hizmetleri uzman teknisyenlerimizce adresinizde çözülür.
            </p>
          </div>
        </div>
      </section>

      {/* Marketplace vs MCARIS Direct Delivery & Assembly Comparison */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full">
        <MarketplaceComparison districtName={district.name} />
      </section>

      {/* Recommended Products for District */}
      {products.length > 0 && (
        <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
                {district.name} İçin Önerilen Hasta Karyolaları
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {district.name} adresinize gün içinde ücretsiz teslim edilecek modeller:
              </p>
            </div>
            <Link
              href="/urunler"
              className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-black inline-flex items-center gap-1"
            >
              <span>Tümünü Gör</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* District Specific FAQs */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
            {district.name} Hasta Yatağı Hizmeti Hakkında Sıkça Sorulanlar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {district.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-2 shadow-xs"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Other Ankara Districts Cross-linking Section */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-4 pt-4">
        <div className="border-b border-neutral-200 pb-3">
          <h2 className="text-lg font-bold text-neutral-950">
            Diğer Ankara İlçeleri İçin Hasta Yatağı Hizmetlerimiz
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {otherDistricts.map((d) => (
            <Link
              key={d.slug}
              href={`/ankara-hasta-yatagi/${d.slug}`}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs font-semibold transition-all border border-neutral-200/80"
            >
              {d.name} Hasta Yatağı &rarr;
            </Link>
          ))}
        </div>
      </section>
      </div>
    </div>
    </>
  );
}
