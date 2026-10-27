import { prisma } from "@/lib/db";

export interface ShowcaseItemSetting {
  id: string;
  productId?: string;
  tabLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  image: string;
  features: string[];
}

export interface HeroSettings {
  pillCity: string;
  pillText: string;
  mainTitle: string;
  highlightTitle: string;
  description: string;
  whatsappText: string;
  whatsappNumber: string;
  showcaseItems: ShowcaseItemSetting[];
}

export interface StoreContactSettings {
  storeName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  city: string;
  country: string;
}

export interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string;
  googleVerification: string;
  analyticsId: string;
}

export interface StoreGeneralSettings {
  defaultVatRate: number;
}

export interface DealOfTheDaySettings {
  isActive: boolean;
  productId?: string;
  badgeText: string;
  title: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  discountPercentage: number;
  link: string;
  image: string;
  countdownHours: number;
}

export const DEFAULT_GENERAL_SETTINGS: StoreGeneralSettings = {
  defaultVatRate: 20,
};

export const DEFAULT_DEAL_OF_THE_DAY: DealOfTheDaySettings = {
  isActive: true,
  productId: "",
  badgeText: "Günün Fırsatı • Sınırlı Stok",
  title: "Burmeier Dali — 4 Motorlu Ahşap Alman Hasta Karyolası",
  description:
    "Almanya menşeili, kablosuz el kumandalı, Trendelenburg pozisyonlu en çok tercih edilen ev tipi ahşap hasta karyolası modelimizde avantajlı fiyat fırsatı.",
  originalPrice: 98000,
  dealPrice: 89500,
  discountPercentage: 9,
  link: "/urun/burmeier-dali-4-motorlu-alman-hasta-karyolasi",
  image: "/uploads/products/burmeier-dali-4-motorlu-alman-hasta-karyolasi-1-117f.webp",
  countdownHours: 24,
};

export const DEFAULT_SHOWCASE_ITEMS: ShowcaseItemSetting[] = [
  {
    id: "4-motorlu",
    tabLabel: "4 Motorlu",
    badge: "Alman Teknolojisi • Trendelenburg",
    title: "Burmeier Dali 4 Motorlu",
    subtitle: "Ahşap Alman Hasta Karyolası",
    description:
      "24V güvenli gerilim, kablosuz el kumandası, asansör ve Trendelenburg pozisyonlarıyla en üst düzey evde bakım.",
    link: "/urun/burmeier-dali-4-motorlu-alman-hasta-karyolasi",
    image: "/uploads/products/burmeier-dali-4-motorlu-alman-hasta-karyolasi-1-117f.webp",
    features: [
      "4 Bağımsız Güçlü Motor",
      "Trendelenburg & Asansör",
      "Ahşap / ABS Kaplama",
      "Alman Güvencesi & 2 Yıl Garanti",
    ],
  },
  {
    id: "3-motorlu",
    tabLabel: "3 Motorlu",
    badge: "Asansörlü & ABS Panelli",
    title: "MCARIS Gold 3 Motorlu",
    subtitle: "Asansörlü ABS Hasta Karyolası",
    description:
      "Sırt, ayak ve elektrikli asansör yükseklik ayarıyla hasta bakımını kolaylaştıran antibakteriyel ABS tasarım.",
    link: "/urun/mcaris-3-motorlu-abs-hasta-karyolasi",
    image: "/categories/gold-hasta-yataklari.png",
    features: [
      "3 Bağımsız Lineer Motor",
      "Yükseklik Ayarlı Asansör",
      "Alüminyum Tabanca Korkuluk",
      "Çapraz Kilitli Medikal Teker",
    ],
  },
  {
    id: "2-motorlu",
    tabLabel: "2 Motorlu",
    badge: "Ekonomik & Ev Tipi Baza",
    title: "MCARIS Platinum 2 Motorlu",
    subtitle: "Ev Tipi Baza Görünümlü Karyola",
    description:
      "Sırt ve ayak hareketlerini elektrikli motorla sağlayan, ev mobilyası görünümünde şık ve sessiz karyola.",
    link: "/urun/2-motorlu-baza-gorunumlu-hasta-karyolasi",
    image: "/categories/platinum-hasta-yataklari.png",
    features: [
      "2 Motorlu Dual Sistem",
      "Ev Mobilyası Uyumlu Baza",
      "Kablolu Ergonomik Kumanda",
      "Serum Askısı Yuvaları",
    ],
  },
  {
    id: "transfer-lift",
    tabLabel: "Transfer Lifti",
    badge: "Zahmetsiz Hasta Transferi",
    title: "Birdie EVO Katlanabilir",
    subtitle: "Elektrikli Hasta Transfer Lifti",
    description:
      "Yataktan tekerlekli sandalyeye veya banyoya hastayı tek kişiyle güvenle ve güç harcamadan taşıma çözümü.",
    link: "/urun/mcaris-birdie-evo-katlanabilir-hasta-tasima-ve-transfer-lifti",
    image: "/uploads/products/mcaris-birdie-evo-katlanabilir-hasta-tasima-ve-transfer-lifti-1-e098.webp",
    features: [
      "180 kg Taşıma Kapasitesi",
      "Şarjlı Kumandalı Motor",
      "Ayarlanabilir Ayak Açıklığı",
      "Özel Taşıma Askısı Dahil",
    ],
  },
];

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
  pillCity: "Ankara",
  pillText: "Aynı Gün Ücretsiz Teslimat & Kurulum",
  mainTitle: "Elektrikli Motorlu Hasta Karyolaları &",
  highlightTitle: "Evde Bakım Hasta Yatakları",
  description:
    "Evde bakım ve tedavi süreçleri için 2, 3 ve 4 motorlu, asansörlü ve Trendelenburg pozisyonlu elektrikli hasta karyolaları. Alman motor teknolojisi, CE & ISO sertifikalı ahşap/ABS tasarım, 2 yıl yerinde servis garantisi ve Ankara içi aynı gün ücretsiz teslimat & kurulum.",
  whatsappText: "WhatsApp Sipariş",
  whatsappNumber: "905368200269",
  showcaseItems: DEFAULT_SHOWCASE_ITEMS,
};

export const DEFAULT_STORE_CONTACT: StoreContactSettings = {
  storeName: "MCaris Medikal",
  phone: "+90 850 000 00 00",
  whatsapp: "905368200269",
  email: "info@mcaris.com.tr",
  address: "Ankara, Türkiye",
  workingHours: "09:00 - 19:00 (Pazartesi - Cumartesi)",
  city: "Ankara",
  country: "Türkiye",
};

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  defaultTitle: "MCARIS — Motorlu Hasta Yatakları & Medikal Ekipmanlar",
  titleTemplate: "%s | MCARIS Medikal",
  defaultDescription: "2, 3 ve 4 motorlu elektrikli hasta karyolaları, boru tipi havalı yataklar ve transfer liftleri. Ankara içi gün içinde ücretsiz teslimat ve montaj.",
  keywords: "hasta yatağı, hasta karyolası, 4 motorlu hasta karyolası, ankara hasta yatağı, medikal karyola, burmeier dali, transfer lifti",
  googleVerification: "",
  analyticsId: "",
};

export async function getStoreSettingJSON<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key },
    });
    if (!setting || !setting.value) return defaultValue;
    return JSON.parse(setting.value) as T;
  } catch {
    return defaultValue;
  }
}

export async function getHeroSettings(): Promise<HeroSettings> {
  return getStoreSettingJSON<HeroSettings>("hero_settings", DEFAULT_HERO_SETTINGS);
}

export async function getStoreContactSettings(): Promise<StoreContactSettings> {
  return getStoreSettingJSON<StoreContactSettings>("store_contact", DEFAULT_STORE_CONTACT);
}

export async function getSeoSettings(): Promise<SeoSettings> {
  return getStoreSettingJSON<SeoSettings>("seo_settings", DEFAULT_SEO_SETTINGS);
}

export async function getGeneralSettings(): Promise<StoreGeneralSettings> {
  return getStoreSettingJSON<StoreGeneralSettings>("general_settings", DEFAULT_GENERAL_SETTINGS);
}

export async function getDealOfTheDaySettings(): Promise<DealOfTheDaySettings> {
  return getStoreSettingJSON<DealOfTheDaySettings>("deal_of_the_day", DEFAULT_DEAL_OF_THE_DAY);
}

