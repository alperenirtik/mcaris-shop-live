export const SITE_URL = "https://shop.mcaris.com.tr";
export const BRAND_NAME = "MCARIS Medikal";
export const BRAND_LEGAL_NAME =
  "MC KAHVECİ SAĞLIK HİZMETLERİ TURİZM SANAYİ VE TİCARET ANONİM ŞİRKETİ";
export const BRAND_PHONE = "+905368200269";
export const WHATSAPP_NUMBER = "905368200269";
export const BRAND_EMAIL = "info@mcaris.com.tr";
export const BRAND_ADDRESS = {
  streetAddress:
    "Batı Sitesi Mah. 2308. Cad. Gersan Sanayi Sitesi Elektro Tek No: 62",
  addressLocality: "Yenimahalle",
  addressRegion: "Ankara",
  postalCode: "06370",
  addressCountry: "TR",
};

import { GOOGLE_MAPS_DIRECTIONS_URL } from "./constants";
import { isProbedCatalogSku } from "./probedCatalog";

/**
 * MedicalBusiness & Organization JSON-LD Şeması (EEAT Otoriterlik, Yerel SEO ve Güven)
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalSupplyStore", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    legalName: BRAND_LEGAL_NAME,
    alternateName: ["MCARIS", "MCARIS Hasta Yatakları", "MCaris Shop"],
    url: SITE_URL,
    logo: `${SITE_URL}/MCARIS-LOGO-2.webp`,
    image: `${SITE_URL}/og-image.png`,
    description:
      "MCARIS Medikal, Ankara Yenimahalle merkezli profesyonel hasta yatakları, hasta bakım ekipmanları ve medikal mobilya üreticisi & tedarikçisidir.",
    email: BRAND_EMAIL,
    telephone: BRAND_PHONE,
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      ...BRAND_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.95665,
      longitude: 32.69487,
    },
    hasMap: GOOGLE_MAPS_DIRECTIONS_URL,
    areaServed: [
      { "@type": "City", name: "Ankara" },
      { "@type": "AdministrativeArea", name: "Yenimahalle" },
      { "@type": "AdministrativeArea", name: "Çankaya" },
      { "@type": "AdministrativeArea", name: "Keçiören" },
      { "@type": "AdministrativeArea", name: "Etimesgut" },
      { "@type": "AdministrativeArea", name: "Mamak" },
      { "@type": "AdministrativeArea", name: "Sincan" },
      { "@type": "AdministrativeArea", name: "Altındağ" },
      { "@type": "AdministrativeArea", name: "Gölbaşı" },
      { "@type": "Country", name: "Türkiye" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:30",
        closes: "19:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/mcarismedikal",
      "https://www.facebook.com/mcarismedikal",
      "https://www.youtube.com/@mcarismedikal",
    ],
    // ✅ Google İşletme Puanınız (gerçek veriler)
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "14",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Medikal Ekipman & Hasta Yatağı Kataloğu",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Hasta Yatakları (Platinum, Gold, Silver)",
        },
        {
          "@type": "OfferCatalog",
          name: "Hasta Taşıma ve Transfer Liftleri",
        },
        {
          "@type": "OfferCatalog",
          name: "Bakım ve Muayene Masaları",
        },
      ],
    },
  };
}

/**
 * WebSite & Sitelinks Searchbox JSON-LD Şeması
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND_NAME,
    description:
      "Medikal Ekipman, Elektrikli Hasta Yatakları ve Hasta Bakım Çözümleri",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/urunler?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "tr-TR",
  };
}

/**
 * BreadcrumbList JSON-LD Şeması
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export interface ProductSchemaInput {
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: string;
  sku?: string;
  categoryName?: string;
  series?: string | null;
  stock?: number;
  specs?: Record<string, string>;
  reviews?: Array<{
    author: string;
    rating: number;
    comment: string;
    date?: string;
  }>;
}

/**
 * Product & Offer JSON-LD Şeması (Zengin ImageObject, additionalProperty ve EEAT)
 */
export function getProductSchema(product: ProductSchemaInput) {
  const fullImages = product.images.map((img) =>
    img.startsWith("http") ? img : `${SITE_URL}${img}`
  );

  const imageObjects = (fullImages.length > 0 ? fullImages : [`${SITE_URL}/og-image.png`]).map(
    (imgUrl, idx) => ({
      "@type": "ImageObject",
      contentUrl: imgUrl,
      url: imgUrl,
      name: `${product.name} - Görsel ${idx + 1}`,
      caption: `${product.name} ${product.categoryName || "Medikal Ekipman"} Detay Görseli`,
    })
  );

  // Teknik nitelikleri (specs) Schema.org PropertyValue dizisine dönüştür
  const specEntries = Object.entries(product.specs || {});
  const additionalProperties = specEntries.map(([name, val]) => ({
    "@type": "PropertyValue",
    name: name.trim(),
    value: typeof val === "object" ? JSON.stringify(val) : String(val ?? "").trim(),
  }));

  // Gerçek yorum verilerinden puan hesapla
  const reviews = product.reviews || [];
  const hasReviews = reviews.length > 0;
  const avgRating = hasReviews
    ? (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1)
    : null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    additionalType: "https://schema.org/MedicalDevice",
    "@id": `${SITE_URL}/urun/${product.slug}#product`,
    name: product.name,
    image: fullImages.length > 0 ? fullImages : [`${SITE_URL}/og-image.png`],
    subjectOf: imageObjects,
    description: product.description,
    sku: product.sku || product.slug,
    ...(product.sku && { mpn: product.sku }),
    brand: {
      "@type": "Brand",
      name: "MCARIS",
    },
    category: product.categoryName || "Medikal Ekipman",
    ...(additionalProperties.length > 0 && { additionalProperty: additionalProperties }),

    // MedicalDevice YMYL Klinik Nitelikleri
    safetyConsideration:
      "Amortisörlü hasta koruma korkulukları, güvenli çalışma mesafesi ve elektrik kesintisinde 9V acil durum indirme desteği.",
    purpose:
      "Evde bakım ve klinik ortamlarda yatalak veya hareket kısıtlılığı olan hastaların anatomik pozisyonlanması, solunum rahatlığı, bası yarası (dekübitus) riskinin önlenmesi ve bakıcı ergonomisinin korunması.",
    recognizingAuthority: {
      "@type": "Organization",
      name: "CE & ISO 9001:2015 Normları",
    },

    hasWarranty: {
      "@type": "WarrantyPromise",
      durationOfWarranty: {
        "@type": "QuantitativeValue",
        value: 2,
        unitCode: "ANN",
      },
      warrantyScope: "https://schema.org/FullWarranty",
    },


    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/urun/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        (product.stock ?? 1) > 0
          ? isProbedCatalogSku(product.sku)
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
        url: SITE_URL,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "TR",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0.00",
          currency: "TRY",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "TR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
          },
          cutoffTime: "16:00:00+03:00",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  // ✅ Sadece GERÇEK yorum varsa aggregateRating ekle
  if (hasReviews && avgRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: reviews.length.toString(),
      bestRating: "5",
      worstRating: "1",
    };

    // Gerçek yorumları da schema'ya ekle
    schema.review = reviews.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: r.comment,
      ...(r.date && { datePublished: r.date }),
    }));
  }

  return schema;
}

/**
 * MedicalDevice JSON-LD Şeması (Schema.org/MedicalDevice YMYL Klinik & Tıbbi Cihaz Tescili)
 */
export function getMedicalDeviceSchema(product: ProductSchemaInput) {
  const fullImages = product.images.map((img) =>
    img.startsWith("http") ? img : `${SITE_URL}${img}`
  );

  const specEntries = Object.entries(product.specs || {});
  const additionalProperties = specEntries.map(([name, val]) => ({
    "@type": "PropertyValue",
    name: name.trim(),
    value: typeof val === "object" ? JSON.stringify(val) : String(val ?? "").trim(),
  }));

  const safeLoadCapacity =
    product.specs?.["Taşıma Kapasitesi"] ||
    product.specs?.["Tasima Kapasitesi"] ||
    "230 - 250 kg";

  const motorPower =
    product.specs?.["Motor Gücü"] ||
    product.specs?.["Motor Gucu"] ||
    "Medikal Lineer Aktüatör";

  return {
    "@context": "https://schema.org",
    "@type": "MedicalDevice",
    "@id": `${SITE_URL}/urun/${product.slug}#medical-device`,
    name: product.name,
    description: product.description,
    image: fullImages.length > 0 ? fullImages : [`${SITE_URL}/og-image.png`],
    code: product.sku || product.slug,
    manufacturer: {
      "@type": "Organization",
      name: "MCARIS Medikal",
      url: SITE_URL,
    },
    safetyConsideration:
      "Çift taraflı amortisörlü korkuluklar, anti-bakteriyel elektrostatik toz boyalı şasi ve elektrik kesintisinde 9V acil durum pil desteği.",
    purpose:
      "Evde bakım ve klinik ortamlarda yatalak veya hareket kısıtlılığı olan hastaların anatomik pozisyonlanması, solunum rahatlığı, bası yarası (dekübitus) profilaksisi ve refakatçi ergonomisinin korunması.",
    recognizingAuthority: {
      "@type": "Organization",
      name: "CE & ISO 9001:2015",
    },
    isRelatedTo: {
      "@type": "Product",
      "@id": `${SITE_URL}/urun/${product.slug}#product`,
    },
    additionalProperty: [
      ...additionalProperties,
      {
        "@type": "PropertyValue",
        name: "Kalite Tescili",
        value: "CE & ISO 9001:2015",
      },
      {
        "@type": "PropertyValue",
        name: "Güvenli Çalışma Yükü",
        value: safeLoadCapacity,
      },
      {
        "@type": "PropertyValue",
        name: "Motor İtiş Gücü",
        value: motorPower,
      },
      {
        "@type": "PropertyValue",
        name: "Garanti Süresi",
        value: "2 Yıl Yerinde Servis & 10 Yıl Yedek Parça Temini",
      },
      {
        "@type": "PropertyValue",
        name: "Paket Donanımı",
        value: "4 Parçalı CNC Kesim Şilte, Sıvı Geçirmez Alez ve Serum Askısı Dahildir",
      },
    ],
  };
}

/**
 * ItemList JSON-LD Şeması (Kategori ve Ürün Listeleme Sayfaları İçin)
 */
export function getItemListSchema(
  products: Array<{ name: string; slug: string; images?: string[] }>,
  listName: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/urun/${product.slug}`,
      name: product.name,
      ...(product.images && product.images.length > 0
        ? {
          image: product.images[0].startsWith("http")
            ? product.images[0]
            : `${SITE_URL}${product.images[0]}`,
        }
        : {}),
    })),
  };
}

export interface CategoryProductItem {
  name: string;
  slug: string;
  price?: number | string;
  images?: string[];
  stock?: number;
}

/**
 * Zengin Kategori & Koleksiyon JSON-LD Şeması (Akakçe ve Google SERP Fiyat/Filtre Snippet'ları)
 */
export function getCategoryCollectionSchema(params: {
  categoryName: string;
  description?: string;
  url: string;
  products: CategoryProductItem[];
  lowPrice?: number;
  highPrice?: number;
}) {
  const fullUrl = params.url.startsWith("http") ? params.url : `${SITE_URL}${params.url}`;

  const itemListElements = params.products.map((p, index) => {
    const productUrl = `${SITE_URL}/urun/${p.slug}`;
    const pPrice = p.price !== undefined ? parseFloat(p.price.toString()) : undefined;
    const imgUrl =
      p.images && p.images.length > 0
        ? p.images[0].startsWith("http")
          ? p.images[0]
          : `${SITE_URL}${p.images[0].startsWith("/") ? "" : "/"}${p.images[0]}`
        : `${SITE_URL}/og-image.png`;

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: productUrl,
        image: imgUrl,
        ...(pPrice !== undefined && !isNaN(pPrice)
          ? {
            offers: {
              "@type": "Offer",
              price: pPrice.toFixed(2),
              priceCurrency: "TRY",
              priceValidUntil: "2027-12-31",
              availability: (p.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: {
                "@type": "Organization",
                name: BRAND_NAME,
              },
            },
          }
          : {}),
      },
    };
  });

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.categoryName,
    url: fullUrl,
    ...(params.description ? { description: params.description } : {}),
    mainEntity: {
      "@type": "ItemList",
      name: params.categoryName,
      numberOfItems: params.products.length,
      itemListElement: itemListElements,
    },
  };

  if (params.lowPrice !== undefined && params.highPrice !== undefined && params.lowPrice > 0) {
    schema.offers = {
      "@type": "AggregateOffer",
      lowPrice: params.lowPrice.toFixed(2),
      highPrice: params.highPrice.toFixed(2),
      priceCurrency: "TRY",
      offerCount: params.products.length,
    };
  }

  return schema;
}

/**
 * FAQPage JSON-LD Şeması (Google Arama Zengin Sonuçları için)
 */
export function getFAQSchema(
  faqs?: Array<{ question: string; answer: string }>
) {
  const defaultFaqs = [
    {
      question: "Elektrikli hasta yatağı alırken motor sayısı neden önemlidir?",
      answer:
        "Hasta yatağının motor sayısı fonksiyonelliğini belirler. 2 motorlu yataklar baş ve ayak ucunu hareket ettirir. 3 motorlu modeller bunlara ek olarak yatağın genel yüksekliğini (asansör hareketi) ayarlar; bu da refakatçinin bakımını kolaylaştırır. 4 motorlu Platinum modeller ise Trendelenburg ve ters Trendelenburg pozisyonları sunarak yoğun bakım ve ileri seviye konfor sağlar.",
    },
    {
      question: "Ankara içi teslimat ve kurulum nasıl yapılmaktadır?",
      answer:
        "MCARIS Medikal olarak Ankara ili sınırları içerisindeki tüm siparişlerde aynı gün ücretsiz yerinde teslimat ve uzman teknik ekibimiz tarafından montaj/eğitim hizmeti sunuyoruz.",
    },
    {
      question: "Ürünlerin garanti süresi ve teknik servis desteği nasıldır?",
      answer:
        "Tüm hasta karyolaları ve medikal ürünlerimiz 2 yıl resmi garantiye sahiptir. Ayrıca 10 yıl boyunca yedek parça temin ve teknik servis garantisi sunulmaktadır.",
    },
    {
      question: "Hasta yatağı kiralama hizmetiniz var mı?",
      answer:
        "Evet, MCARIS Medikal olarak Ankara genelinde ameliyat sonrası ve geçici nekahat dönemleri için hasta karyolası kiralama hizmeti sunuyoruz. Kiralık ürünlerimiz hastane tipi medikal dezenfektanlarla titizlikle sterilize edilerek hazır stoklu modellerimizde aynı gün adrese teslim edilir ve montajı yapılır. Ayrıca kiralama süresince ödenen bedeller sıfır ürünün satın alma fiyatından mahsup edilebilmektedir.",
    },
  ];

  const list = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * HTML/Markdown içerik içerisindeki <details><summary> SSS bloklarını
 * Schema.org Question/Answer çiftlerine ayrıştırır.
 */
export function extractFaqsFromHtml(
  html: string
): Array<{ question: string; answer: string }> {
  if (!html) return [];
  const faqs: Array<{ question: string; answer: string }> = [];

  const detailsRegex = /<details[^>]*>([\s\S]*?)<\/details>/gi;
  let match: RegExpExecArray | null;

  while ((match = detailsRegex.exec(html)) !== null) {
    const detailsContent = match[1];

    const summaryMatch = /<summary[^>]*>([\s\S]*?)<\/summary>/i.exec(detailsContent);
    if (!summaryMatch) continue;

    const question = summaryMatch[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .trim();

    const answerHtml = detailsContent.replace(/<summary[^>]*>[\s\S]*?<\/summary>/i, "");
    const answer = answerHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

