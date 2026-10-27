import type { Metadata } from"next";
import Image from"next/image";
import Link from"next/link";
import { BUSINESS_PHONE, WHATSAPP_NUMBER } from"@/lib/constants";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema } from"@/lib/seo";

export const metadata: Metadata = {
  title: "Hakkımızda & Medikal Uzmanlık Standartları",
  description:
    "MCARIS Medikal; CE ve ISO 9001 sertifikalı elektrikli hasta yatakları, transfer liftleri ve medikal bakım çözümleri üreticisi ve distribütörüdür. 2 yıl garanti ve Ankara içi aynı gün teslimat.",
  alternates: {
    canonical: "/hakkimizda",
  },
  openGraph: {
    title: `Hakkımızda & Medikal Uzmanlık | ${BRAND_NAME}`,
    description:
      "MCARIS Medikal; 2, 3 ve 4 motorlu elektrikli hasta yatakları, hasta transfer liftleri ve klinik çözümlerde güvenilir iş ortağınız.",
    url: `${SITE_URL}/hakkimizda`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `Hakkımızda — ${BRAND_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Hakkımızda | ${BRAND_NAME}`,
    description:
      "MCARIS Medikal üretim standartları, klinik çözümler ve kurumsal profil.",
    images: [`${SITE_URL}/og-image.png`],
  },
};


export default function AboutPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name:"Ana Sayfa", url:"/" },
    { name:"Hakkımızda", url:"/hakkimizda" },
  ]);

  const aboutSchema = {"@context":"https://schema.org","@type":"AboutPage","@id": `${SITE_URL}/hakkimizda#webpage`,
    url: `${SITE_URL}/hakkimizda`,
    name:"Hakkımızda — MCARIS Medikal",
    description:"MCARIS Medikal hakkında kurumsal bilgiler, medikal sertifikasyonlar, üretim standartları ve hasta odaklı çözümler.",
    publisher: {"@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <div className="w-full bg-background font-body pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Header Banner */}
      <section className="bg-[#0F1E36] text-white py-14 md:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-4 md:px-6 relative z-10 text-center space-y-3">
          <span className="px-3.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-slate-200 bg-slate-800 border border-slate-700 inline-flex items-center gap-2">
            <span>Herkes İçin Sağlık ve Konfor</span>
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white font-inter leading-tight">
            Hakkımızda &amp; <span className="text-slate-100">İleri Teknoloji Medikal Çözümler</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-3xl mx-auto font-inter leading-relaxed">
            MCARIS olarak, hastalarınızın tedavi ve iyileşme sürecini en konforlu hale getirmek için uzman ekibimizle global standartlarda medikal çözümler ve hasta yatakları sunuyoruz. Sadece bir e-ticaret mağazası değil, sağlığınız için çalışan güvenilir bir iş ortağıyız.
          </p>
        </div>
      </section>

      {/* Main Content & Story Section */}
      <section className="max-w-container-max mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left Text Content (Live Site Data) */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <span>Ankara İçi Aynı Gün Teslimat ve Kurulum</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 font-inter leading-snug">
              İhtiyacınıza Uygun <span className="text-primary">Kapsamlı Çözümler</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-inter">
              <p>
                <strong className="text-slate-900">Silver, Platinum ve Gold</strong> serisi hasta yataklarımız ile tedavi sürecinde ihtiyaç duyabileceğiniz tüm teknik donanımları tek bir platformdan, en yüksek kalite standartlarında temin edebilirsiniz. Ürün gamımızı, hastaların fiziksel ihtiyaçlarına en uygun çözümleri sunabilmek için sürekli olarak genişletiyoruz.
              </p>
              <p>
                Konusunda uzman ekiplerimiz, <strong className="text-slate-900">Ankara içerisinde aynı gün teslimat ve yerinde kurulum</strong> imkanı sağlayarak hasta ve hasta yakınlarının süreçlerini kolaylaştırmaktadır. Tüm ürünlerimizin 2 yıl garantisi vardır.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`tel:${BUSINESS_PHONE}`}
                className="bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                <span>Müşteri Hizmetleri: {BUSINESS_PHONE}</span>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                <span>WhatsApp Danışma Hattı</span>
              </a>
            </div>
          </div>

          {/* Right Visual Image Showcase */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
            <Image
              src="/images/hero-2.jpg"
              alt="MCARIS Medikal Çözümler"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/60 flex items-end p-6">
              <div className="text-white space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Güvenilir İş Ortağınız
                </span>
                <h4 className="text-lg font-extrabold font-inter">
                  Evde &amp; Hastanede Profesyonel Hasta Yatakları
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction & Ratings Banner (5.0 Tam Puan & Direct Google Link) */}
      <section className="bg-[#122036] text-white py-14 border-y-2 border-slate-800 my-8 relative shadow-xl">
        <div className="max-w-container-max mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider bg-slate-800 border border-slate-700 px-3 py-1 rounded-md inline-block">
              Binlerce Mutlu Müşteri
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold font-inter">
              Zorlu Süreçlerde Kalıcı ve Güven Veren Konfor
            </h3>
            <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-inter max-w-xl">
              Müşterilerimize sunduğumuz şeffaf ve teknik hizmetle gurur duyuyor, hasta ve hasta yakınlarının süreçlerini kolaylaştırmaktan mutluluk duyuyoruz. Amacımız sadece medikal ekipman sağlamak değil; zorlu süreçlerde kalıcı, pozitif ve güven veren bir konfor alanı yaratmaktır.
            </p>
          </div>

          {/* Rating Card with Clickable Google Maps Link & 5.0 Score */}
          <div className="flex flex-col items-center lg:items-end justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center max-w-sm w-full space-y-3 shadow-xl">
              <div className="text-yellow-400 text-2xl font-bold flex justify-center gap-1">
                ★★★★★
              </div>
              <div className="text-3xl font-black text-white font-inter tracking-tight">
                5.0 / 5.0
              </div>
              <p className="text-xs text-gray-200 font-medium">
                Google Haritalar değerlendirmelerine göre 5.0 tam müşteri memnuniyeti puanı!
              </p>
              <div className="pt-2">
                <a
                  href="https://www.google.com/maps/search/MCARIS+Ankara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 hover:bg-black px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <span>Google’da MCARIS Puanını Gör</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gerçek Hizmet Deneyimleri & Müşteri Görüşleri */}
      <section className="max-w-container-max mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand bg-brand/10 px-4 py-1.5 rounded-full border border-brand/30">
            Gerçek Müşteri Deneyimleri
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-inter mt-3">
            Müşteri İncelemeleri & Değerlendirmeler
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg space-y-4 hover:border-brand hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 text-brand-dark font-extrabold flex items-center justify-center text-base">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">Mehmet Demir</h4>
                  <span className="text-[11px] text-gray-400">Çankaya / Ankara</span>
                </div>
              </div>
              <span className="text-yellow-400 text-xs">★★★★★</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-inter italic">"Gersan Sanayi Sitesi'ndeki mağazalarında ürünleri yerinde inceleyerek Platinum 4 motorlu hasta yatağını tercih ettik. Ankara içine aynı gün gelip kurdular. 2 yıl motor garantisi olması ayrıca güven verdi."
            </p>
            <div className="text-[10px] font-bold text-gray-400 border-t border-gray-100 pt-3 flex items-center justify-between">
              <span>Doğrulanmış Mağaza Müşterisi</span>
              <span className="text-brand-dark">5.0 ★</span>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg space-y-4 hover:border-brand hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold-dark font-extrabold flex items-center justify-center text-base">
                  F
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">Fatma Öztürk</h4>
                  <span className="text-[11px] text-gray-400">Yenimahalle / Ankara</span>
                </div>
              </div>
              <span className="text-yellow-400 text-xs">★★★★★</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-inter italic">"Annem için 3 motorlu Gold serisi yatak aldık. Kurulumu yapan teknik ekip kumanda kullanımını ve bakımı çok detaylı anlattı. 2 yıl yedek parça temin garantisi olduğunu belirttiler, çok memnun kaldık."
            </p>
            <div className="text-[10px] font-bold text-gray-400 border-t border-gray-100 pt-3 flex items-center justify-between">
              <span>Doğrulanmış Ürün Teslimatı</span>
              <span className="text-brand-dark">5.0 ★</span>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg space-y-4 hover:border-brand hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 text-brand-dark font-extrabold flex items-center justify-center text-base">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">Dr. Murat Arslan</h4>
                  <span className="text-[11px] text-gray-400">Sağlık Hizmetleri Yöneticisi</span>
                </div>
              </div>
              <span className="text-yellow-400 text-xs">★★★★★</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-inter italic">"Klinik hastalarımız için medikal karyola ve bakım ekipmanları tedarik ediyoruz. Yerinde teknik destek, hızlı teslimat ve orijinal yedek parça garantisi konusunda son derece disiplinli bir firma."
            </p>
            <div className="text-[10px] font-bold text-gray-400 border-t border-gray-100 pt-3 flex items-center justify-between">
              <span>Kurumsal Tedarik Müşterisi</span>
              <span className="text-brand-dark">5.0 ★</span>
            </div>
          </div>
        </div>
      </section>

      {/* Series Standards Overview (Platinum, Gold, Silver) */}
      <section className="max-w-container-max mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand bg-brand/10 px-4 py-1.5 rounded-full border border-brand/30">
            Ürün Kategorilerimiz
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-inter mt-3">
            MCARIS Hasta Yatağı Serileri
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Platinum */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 relative flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <span className="bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3.5 border border-slate-200">
                PLATINUM SERİ
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 font-inter mb-2">
                Lüks &amp; Full Fonksiyonel
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-inter mb-4">
                4 motorlu, trendelenburg özellikli, ahşap ev tipi kaplamalı en üst segment lüks hasta yatakları.
              </p>
            </div>
            <Link
              href="/seri/platinum"
              className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1 mt-4"
            >
              <span>Platinum Seriyi İncele</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Gold */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 relative flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <span className="bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3.5 border border-slate-200">
                GOLD SERİ
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 font-inter mb-2">
                Profesyonel Bakım Yatakları
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-inter mb-4">
                2 ve 3 motorlu, tabancalı yan korkuluk sistemine sahip en çok tercih edilen konfor serimiz.
              </p>
            </div>
            <Link
              href="/seri/gold"
              className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1 mt-4"
            >
              <span>Gold Seriyi İncele</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Silver */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 relative flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <span className="bg-slate-100 text-slate-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3.5 border border-slate-200">
                SILVER SERİ
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 font-inter mb-2">
                Ekonomik &amp; Pratik Çözümler
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-inter mb-4">
                2 motorlu, dayanıklı korkuluklara sahip evde kullanım için pratik ve bütçe dostu medikal karyolalar.
              </p>
            </div>
            <Link
              href="/seri/silver"
              className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1 mt-4"
            >
              <span>Silver Seriyi İncele</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
