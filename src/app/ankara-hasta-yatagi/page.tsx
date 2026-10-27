import type { Metadata } from "next";
import Link from "next/link";
import { ANKARA_DISTRICTS } from "@/lib/ankaraDistricts";
import { getFeaturedProducts } from "@/lib/products";
import { SITE_URL, BRAND_NAME, BRAND_PHONE, BRAND_ADDRESS } from "@/lib/seo";
import { WHATSAPP_NUMBER, BUSINESS_PHONE } from "@/lib/constants";
import ProductCard from "@/components/product/ProductCard";
import MarketplaceComparison from "@/components/product/MarketplaceComparison";

export const metadata: Metadata = {
  title: "Ankara Hasta Yatağı Satışı, Fiyatları & Aynı Gün Kurulum | MCARIS",
  description:
    "Ankara'nın 25 ilçesine gün içinde kapıda ücretsiz montaj! 2, 3 ve 4 motorlu elektrikli hasta karyolaları, 2026 güncel satış fiyatları, boru tipi havalı yatak ve 2 yıl yerinde servis garantisi.",
  keywords: [
    "ankara hasta yatağı",
    "ankara hasta karyolası",
    "ankara hasta yatağı satışı",
    "hasta yatağı fiyatları ankara",
    "hasta karyolası fiyatları 2026",
    "2 motorlu hasta yatağı ankara",
    "3 motorlu asansörlü hasta karyolası ankara",
    "4 motorlu hasta yatağı ankara",
    "çankaya hasta yatağı",
    "yenimahalle hasta karyolası",
    "keçiören hasta karyolası",
    "etimesgut hasta yatağı",
    "batıkent hasta yatağı",
    "sincan hasta karyolası",
    "boru tipi havalı yatak ankara",
    "mcaris medikal ankara",
  ],
  alternates: {
    canonical: "/ankara-hasta-yatagi",
  },
  openGraph: {
    title: "Ankara Hasta Yatağı Satışı & Yerinde Montaj | MCARIS Medikal",
    description: "Ankara geneli 25 ilçede gün içinde ücretsiz montaj. 2, 3, 4 motorlu elektrikli hasta karyolaları, doğrudan üretici fiyatları ve 2 yıl yerinde teknik servis.",
    url: `${SITE_URL}/ankara-hasta-yatagi`,
    type: "website",
  },
};

export default async function AnkaraHubPage() {
  const products = await getFeaturedProducts();

  const ankaraSchema = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalSupplyStore"],
    "@id": `${SITE_URL}/ankara-hasta-yatagi/#business`,
    name: `${BRAND_NAME} - Ankara Hasta Yatağı ve Medikal Ekipman Merkezi`,
    url: `${SITE_URL}/ankara-hasta-yatagi`,
    telephone: BRAND_PHONE,
    priceRange: "₺₺₺",
    address: {
      "@type": "PostalAddress",
      ...BRAND_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.9565,
      longitude: 32.6949,
    },
    areaServed: ANKARA_DISTRICTS.map((d) => ({
      "@type": "AdministrativeArea",
      name: `${d.name}, Ankara`,
    })),
    description:
      "Ankara geneli 25 ilçede 2, 3 ve 4 motorlu elektrikli ahşap ve ABS hasta karyolaları satışı, doğrudan fabrika güvencesi ve 7/24 yerinde teknik servis hizmeti.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Ankara'da hasta yatağı siparişi ne kadar sürede teslim edilir ve montaj ücretli midir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ankara'nın 25 ilçesinin tamamına (Çankaya, Yenimahalle, Keçiören, Etimesgut, Mamak, Sincan, Altındağ, Gölbaşı vb.) kendi mobil lojistik araçlarımızla gün içinde ücretsiz teslimat ve oda içi montaj yapıyoruz. Montaj, kata taşıma ve eğitim için ek ücret alınmaz."
        }
      },
      {
        "@type": "Question",
        name: "Ankara'da hasta yatağı kiralama ve satın alma seçenekleri nelerdir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MCARIS Medikal olarak Ankara genelinde hem aylık kiralama hem de 2 yıl yerinde servis garantili sıfır satış hizmeti sunuyoruz. 1-3 aylık kısa süreli ortopedik ameliyatlar ve kırık nekahetlerinde steril dezenfekte edilmiş kiralama bütçe dostu bir çözümdür. Uzun süreli yatağa bağımlı hastalarda ise sıfır satın alma önerilir. Ayrıca dileyen aileler kiralama süresince ödediği kira bedellerini sıfır ürün fiyatından mahsup ederek karyolayı satın alabilir."
        }
      },
      {
        "@type": "Question",
        name: "Sıfır hasta karyolası siparişlerinde garanti ve teknik servis süreci nasıldır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Satışını gerçekleştirdiğimiz tüm motorlu karyolalarımızda 2 yıl yerinde birebir teknik servis ve 10 yıl yedek parça temin garantisi sunulmaktadır. Ankara genelinde olası bir arıza veya bakım ihtiyacında kendi teknik servis ekibimiz gün içinde adresinize gelerek sorunu yerinde çözer."
        }
      },
      {
        "@type": "Question",
        name: "Hasta karyolası kurulumunu kim yapıyor, eğitim veriliyor mu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MCARIS Medikal'in kendi sertifikalı teknik personeli adrese gelir, yatağı hastanın odasına kurar, motor ve kumanda testlerini yapar, hasta yakınlarına kumanda kullanımı ve acil indirme pimi hakkında detaylı eğitim verir."
        }
      },
      {
        "@type": "Question",
        name: "Ankara'da yerinde teknik servis ve motor arızası desteği var mı?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet. Satın alınan tüm modellerimizde 2 yıl yerinde teknik servis ve 10 yıl yedek parça temin garantisi bulunur. Olası motor veya mekanik arızalarda servis ekibimiz gün içinde adresinize ulaşır; parça veya karyola birebir yenisiyle değiştirilir."
        }
      },
      {
        "@type": "Question",
        name: "MCARIS Medikal olarak SGK anlaşmanız var mı?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MCARIS Medikal olarak SGK anlaşmamız bulunmamaktadır. Bürokratik onaylar ve haftalarca süren bekleme süreleri yerine doğrudan birinci elden sıfır ürün satışı ve aynı gün randevulu adrese teslimat yapılmaktadır."
        }
      },
      {
        "@type": "Question",
        name: "Boru tipi havalı yatak neden baklava tipinden çok daha iyidir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Baklava tipi yataklar sadece yüzeysel hava akışı sağlar ve bası yarası açılmış hastalarda etkisiz kalır. A+B sıralı boru tipi havalı yataklar ise hücreleri sırayla şişirip indirerek vücuda mikro masaj yapar, ventilasyon delikleriyle terlemeyi önler ve bası yaralarını %90'a varan oranda engeller."
        }
      },
      {
        "@type": "Question",
        name: "Elektrik kesilince motorlu hasta yatağı çalışır mı?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet. Motor kontrol kutusundaki 9V acil durum pili veya manuel indirme pimi sayesinde, elektrik kesintisinde hasta kumandadaki butonla güvenle düz yatay pozisyona getirilebilir."
        }
      },
      {
        "@type": "Question",
        name: "Apartman asansörü dar veya yoksa karyola eve nasıl çıkarılır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Karyolalarımız modüler demonte edilebilir yapıdadır. Teknik ekibimiz parçaları dar merdivenlerden veya asansörsüz dik katlardan duvara ve mobilyalara zarar vermeden güvenle taşır ve odada birleştirir."
        }
      },
      {
        "@type": "Question",
        name: "Hastanın kilosu 150 kg üzerindeyse hangi model tercih edilmelidir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standart modellerimiz 150-180 kg taşıma kapasitelidir. 150 kg üzerindeki kilolu ve obez hastalar için çift motorlu, 2.5 mm güçlendirilmiş çelik şaseli ve 110-120 cm genişliğe sahip Bariatrik Hasta Yataklarımız önerilir."
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ankaraSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full font-sans pb-12">
        {/* Hero Section */}
        <section className="relative bg-[#fafbfc] border-b border-neutral-200/80 pt-3 sm:pt-4 pb-8 sm:pb-12 overflow-hidden">
          {/* Soft Framer Grids & Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-sky-200/40 via-blue-100/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-16 w-[480px] h-[480px] bg-gradient-to-tl from-cyan-100/35 via-teal-100/25 to-transparent rounded-full blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
              }}
            />
          </div>

        <div className="relative z-10 max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 flex items-center gap-2">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-semibold">Ankara Hasta Yatağı</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900 text-white text-xs font-bold">
              <span>Ankara Geneli 25 İlçede</span>
              <span className="text-neutral-400">&bull;</span>
              <span className="text-emerald-400">Ankara'da Gün İçinde Kurulum</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15]">
              Ankara Hasta Yatağı Satışı, Fiyatları &amp; Yerinde Teknik Servis
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              MCARIS Medikal olarak Ankara'nın tüm ilçelerine Alman motorlu 2, 3 ve 4 motorlu elektrikli hasta karyolaları, ev tipi ahşap baza yataklar ve hasta transfer liftleri ulaştırıyoruz. Kendi teknik servis filomuzla <strong>aynı gün ücretsiz teslimat, yerinde montaj ve 2 yıl resmi garanti</strong> sağlıyoruz.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, Ankara içi hasta yatağı modelleri, satış fiyatları ve gün içinde teslimat hakkında bilgi almak istiyorum.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>Hemen WhatsApp'tan Danışın</span>
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
        {/* 25 Districts Interactive Grid */}
        <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Ankara İlçe Hizmet Bölgelerimiz
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            İlçenizi seçerek teslimat sürelerini, yakınınızdaki referans hastaneleri ve özel modelleri inceleyin:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {ANKARA_DISTRICTS.map((district) => (
            <Link
              key={district.slug}
              href={`/ankara-hasta-yatagi/${district.slug}`}
              className="group bg-white border border-neutral-200/90 rounded-2xl p-4 hover:border-neutral-900 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors">
                    {district.name}
                  </h3>
                  <span className="text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-0.5 transition-all text-sm font-bold">
                    &rarr;
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {district.deliveryTimeHours}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Doğrudan Üretici &bull; Sıfır Satış &bull; Montaj</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-neutral-950">
              Gün İçinde Kapıda Montaj
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Ankara içi siparişlerinizde kargo beklemezsiniz. Kendi özel medikal sevkiyat araçlarımız ve uzman teknik kadromuz karyolayı evinize getirir, odanıza kurar.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-neutral-950">
              2 Yıl Resmi Garanti &amp; Yerinde Servis
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Tüm motorlu karyolalarımızda 2 yıl yerinde birebir teknik servis garantisi ve 10 yıl yedek parça temin garantisi sunuyoruz. Arıza anında evinize geliyoruz.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-neutral-950">
              Doğrudan Üreticiden Sıfır Satış
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Enfeksiyon ve bakteri riskini sıfıra indiren orijinal ambalajında sıfır ürünler. Aracı komisyonu olmadan en avantajlı fabrika fiyatlarıyla hastanıza özel ilk kurulum.
            </p>
          </div>
        </div>
      </section>

      {/* 2026 Ankara Fiyat Tablosu (Microdata Destekli) */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-4">
        <div className="border-b border-neutral-200 pb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-900 text-white text-[11px] font-bold mb-1">
            <span>2026 Ankara Fiyat Listesi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Ankara Hasta Karyolası 2026 Model ve Net Satış Fiyat Matrisi
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Tüm modellerimizde CNC lazer kesim medikal şilte, serum askısı, Ankara geneli adrese ücretsiz teslimat ve kata montaj dahildir:
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider">
                <th className="p-3.5 sm:p-4">Karyola Modeli ve Sınıfı</th>
                <th className="p-3.5 sm:p-4">Motor ve Donanım Nitelikleri</th>
                <th className="p-3.5 sm:p-4">Garanti &amp; Hizmet Kapsamı</th>
                <th className="p-3.5 sm:p-4">Net Satış Fiyatı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800">
              <tr
                itemScope
                itemType="https://schema.org/PropertyValue"
                className="hover:bg-neutral-50/80 transition-colors"
              >
                <td className="p-3.5 sm:p-4 font-bold text-neutral-950">
                  <span itemProp="name">2 Motorlu Giriş / Standart</span>
                  <span className="block text-[11px] font-normal text-neutral-500">Silver Seri • Ev Tipi</span>
                </td>
                <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                  Kumandayla bağımsız sırt ve ayak kaldırma, çift elektrikli motor
                </td>
                <td className="p-3.5 sm:p-4 font-semibold text-emerald-700">
                  2 Yıl Yerinde Servis &amp; Montaj
                </td>
                <td itemProp="value" className="p-3.5 sm:p-4 font-extrabold text-neutral-950 tabular-nums">
                  19.000 ₺ - 28.500 ₺
                </td>
              </tr>

              <tr
                itemScope
                itemType="https://schema.org/PropertyValue"
                className="hover:bg-neutral-50/80 transition-colors"
              >
                <td className="p-3.5 sm:p-4 font-bold text-neutral-950">
                  <span itemProp="name">Asansörlü Profesyonel 3 Motorlu</span>
                  <span className="block text-[11px] font-normal text-neutral-500">Silver &amp; Gold Seri</span>
                </td>
                <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                  Sırt + ayak + 45-90 cm dikey asansör yükseklik ayarı, refakatçi için sırt koruması
                </td>
                <td className="p-3.5 sm:p-4 font-semibold text-emerald-700">
                  2 Yıl Yerinde Servis &amp; Montaj
                </td>
                <td itemProp="value" className="p-3.5 sm:p-4 font-extrabold text-neutral-950 tabular-nums">
                  34.500 ₺ - 58.000 ₺
                </td>
              </tr>

              <tr
                itemScope
                itemType="https://schema.org/PropertyValue"
                className="hover:bg-neutral-50/80 transition-colors"
              >
                <td className="p-3.5 sm:p-4 font-bold text-neutral-950">
                  <span itemProp="name">Full Fonksiyon Yoğun Bakım 4 Motorlu</span>
                  <span className="block text-[11px] font-normal text-neutral-500">Gold Seri • Yoğun Bakım</span>
                </td>
                <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                  4 bağımsız motor, Trendelenburg ve Ters Trendelenburg eğimi, merkezi kilit teker
                </td>
                <td className="p-3.5 sm:p-4 font-semibold text-emerald-700">
                  2 Yıl Yerinde Servis &amp; CPR
                </td>
                <td itemProp="value" className="p-3.5 sm:p-4 font-extrabold text-neutral-950 tabular-nums">
                  37.500 ₺ - 68.000 ₺
                </td>
              </tr>

              <tr
                itemScope
                itemType="https://schema.org/PropertyValue"
                className="hover:bg-neutral-50/80 transition-colors"
              >
                <td className="p-3.5 sm:p-4 font-bold text-neutral-950">
                  <span itemProp="name">Lüks Ahşap Burmeier Dali &amp; Baza</span>
                  <span className="block text-[11px] font-normal text-neutral-500">Platinum Seri • Alman Tasarım</span>
                </td>
                <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                  Ev mobilyası estetiği, 24V güvenli gerilim, kablosuz el kumandası, ahşap korkuluk
                </td>
                <td className="p-3.5 sm:p-4 font-semibold text-emerald-700">
                  2 Yıl Linak Garanti &amp; Kurulum
                </td>
                <td itemProp="value" className="p-3.5 sm:p-4 font-extrabold text-neutral-950 tabular-nums">
                  55.990 ₺ - 89.500 ₺
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Marketplace vs MCARIS Direct Delivery & Assembly Comparison */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full">
        <MarketplaceComparison />
      </section>

      {/* Havalı Yatak & SGK Bilgi Kutuları */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md inline-block">
              Bası Yarası Önleme
            </span>
            <h3 className="text-lg font-bold text-neutral-950">
              Boru Tipi Havalı Yatak Neden Zorunludur?
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Uzun süre yatağa bağımlı kalan hastalarda kan dolaşımının durmasıyla oluşan dekübitüs (bası) yaraları haftalarca iyileşmez. MCARIS ventilasyonlu boru tipi havalı yataklar, sıralı A+B tüp hücreleri sayesinde vücut basıncını sürekli değiştirerek kan akışını korur ve terlemeyi önler.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block">
              Doğrudan Üretici Güvencesi
            </span>
            <h3 className="text-lg font-bold text-neutral-950">
              Bürokrasisiz Hızlı Kurulum &amp; Birinci Elden Satış
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              MCARIS Medikal doğrudan üreticiden halka satış yapan bağımsız bir medikal kuruluştur; SGK anlaşmamız bulunmamaktadır. Bürokratik onaylar ve haftalarca süren bekleme süreleri yerine, hastanız taburcu olduğu gün doğrudan birinci elden sıfır ürün satışı ve kendi mobil filomuzla kata teslimat/montaj gerçekleştirilmektedir.
            </p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      {products.length > 0 && (
        <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Ankara'da En Çok Tercih Edilen Hasta Karyolaları
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Alman motorlu 2, 3, 4 motorlu ve ahşap ev tipi modeller:
              </p>
            </div>
            <Link
              href="/urunler"
              className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-black inline-flex items-center gap-1"
            >
              <span>Tüm Modeller</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Accordion Section */}
      <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Ankara Hasta Yatağı Hakkında Sıkça Sorulan Sorular
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqSchema.mainEntity.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-2 shadow-xs"
            >
              <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                {faq.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {faq.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/sss"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <span>Tüm Sıkça Sorulan Soruları İnceleyin</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>
      </div>
    </div>
    </>
  );
}

