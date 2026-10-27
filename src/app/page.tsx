import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import TrustFeatures from "@/components/home/TrustFeatures";
import NewArrivals from "@/components/home/NewArrivals";
import DealOfTheDay from "@/components/home/DealOfTheDay";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanners from "@/components/home/PromoBanners";
import PopularProducts from "@/components/home/PopularProducts";
import LiveStatsBanner from "@/components/home/LiveStatsBanner";
import CustomerTestimonials from "@/components/home/CustomerTestimonials";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import HomeSEOContent from "@/components/home/HomeSEOContent";
import HelpContactBanner from "@/components/home/HelpContactBanner";
import { SITE_URL, BRAND_NAME, getFAQSchema } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "MCARIS — Motorlu Hasta Yatakları & Medikal Ekipmanlar",
  description:
    "2, 3 ve 4 motorlu elektrikli hasta karyolaları, boru tipi havalı yataklar ve transfer liftleri. Ankara içi gün içinde ücretsiz teslimat ve montaj.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "MCARIS — Motorlu Hasta Yatakları & Medikal Ekipmanlar",
    description:
      "2, 3 ve 4 motorlu elektrikli hasta karyolaları, transfer liftleri ve medikal bakım ekipmanları. CE & ISO sertifikalı, aynı gün sevkiyat.",
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MCARIS Medikal Ekipman & Hasta Yatakları",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCARIS — Motorlu Hasta Yatakları & Medikal Ekipmanlar",
    description:
      "2, 3 ve 4 motorlu elektrikli hasta karyolaları, transfer liftleri ve medikal çözümler. CE & ISO sertifikalı.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function HomePage() {
  const faqSchema = getFAQSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="flex flex-col w-full">
        {/* 1. Hero Showcase with 2/3/4 Motor Beds & 5x2 Category Capsules */}
        <Hero />

        {/* Subsequent Home Sections with Balanced Spacing */}
        <div className="flex flex-col w-full space-y-4 sm:space-y-8 mt-3 sm:mt-5">
          {/* 2. 4 Quick Trust Features Bar (Sevkiyat, Garanti, Destek, Güvenli Ödeme) */}
          <TrustFeatures />

          {/* 3. Featured Products Grid (Çok Tercih Edilen Hasta Yatağı Modelleri) */}
          <FeaturedProducts />

          {/* 5. Deal of the Day (Günün Fırsatı - Sınırlı Süre Sayacı) */}
          <DealOfTheDay />

          {/* 6. New Arrivals (Motorlu Hasta Yatakları & Diğer Ürünler) */}
          <NewArrivals />

          {/* 7. Promo Banners (Ev Tipi Ahşap & Tamamlayıcı Bakım) */}
          <PromoBanners />

          {/* 8. Popular Picks Grid (Hasta Karyolası Modelleri & Popüler Ürünler) */}
          <PopularProducts />

          {/* 9. Live Stats Banner (10.000+ Mutlu Hasta, 81 İl, %100 Memnuniyet) */}
          <LiveStatsBanner />

          {/* 10. Verified Customer & Clinic Reviews (Google Haritalar Deneyimleri) */}
          <CustomerTestimonials />

          {/* 11. Dynamic Medical Blog & Guides (Medikal Bilgi Rehberleri) */}
          <HomeBlogSection />

          {/* 12. Medical Knowledge Bank & Rich SEO Content */}
          <HomeSEOContent />

          {/* 13. VIP Medical Consultation & WhatsApp CTA Banner (Closing CTA) */}
          <HelpContactBanner />
        </div>
      </div>
    </>
  );
}
