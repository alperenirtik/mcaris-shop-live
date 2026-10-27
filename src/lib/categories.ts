import { prisma } from"./db";

export function slugifyTurkish(text: string): string {
  if (!text) return "";
  const processed = text
    .toString()
    .trim()
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .replace(/Ğ/g, "g")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/ş/g, "s")
    .replace(/Ö/g, "o")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/ç/g, "c")
    .toLowerCase();

  return processed
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCategories(): Promise<
  {
    id: string;
    name: string;
    slug: string;
    productCount: number;
    metaTitle?: string | null;
    metaDescription?: string | null;
    h1Title?: string | null;
    seoContent?: string | null;
  }[]
> {
  try {
    const [categories, bedProducts] = await Promise.all([
      prisma.category.findMany({
        where: {
          slug: {
            notIn: ["platinum-hasta-yataklari", "gold-hasta-yataklari", "silver-hasta-yataklari"],
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
          h1Title: true,
          seoContent: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: {
          isDraft: false,
          OR: [
            { category: { slug: "hasta-yataklari" } },
            { category: { slug: "2-motorlu-hasta-yataklari" } },
            { category: { slug: "3-motorlu-hasta-yataklari" } },
            { category: { slug: "4-motorlu-hasta-yataklari" } },
          ],
        },
        select: { specs: true },
      }),
    ]);

    let motor2Count = 0;
    let motor3Count = 0;
    let motor4Count = 0;

    for (const p of bedProducts) {
      const specs = (p.specs as Record<string, string>) || {};
      const motor =
        specs["Motor Sayısı"] ||
        specs["Motor Sayisi"] ||
        specs["motor sayısı"] ||
        specs["motor_sayisi"] ||
        "";
      const match = motor.match(/\d+/);
      const val = match ? match[0] : motor.trim();
      if (val === "2") motor2Count++;
      else if (val === "3") motor3Count++;
      else if (val === "4") motor4Count++;
    }

    return categories.map((c) => {
      let productCount = c._count.products;
      if (c.slug === "2-motorlu-hasta-yataklari") {
        productCount = motor2Count || productCount;
      } else if (c.slug === "3-motorlu-hasta-yataklari" || c.slug === "asansorlu-3-motorlu-karyolalar") {
        productCount = motor3Count || productCount;
      } else if (c.slug === "4-motorlu-hasta-yataklari" || c.slug === "4-motorlu-yogun-bakim-karyolalari") {
        productCount = motor4Count || productCount;
      }

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        h1Title: c.h1Title,
        seoContent: c.seoContent,
        productCount,
      };
    });
  } catch (error) {
    console.warn("[getCategories] Fallback during build/offline:", error);
    return [];
  }
}

const INITIAL_CATEGORY_SEO: Record<string, { metaTitle: string; metaDescription: string; h1Title: string; seoContent: string }> = {
  "hasta-yataklari": {
    metaTitle: "Hasta Karyolası Fiyatları 2026 | Elektrikli Hasta Yatağı Modelleri | MCARIS",
    metaDescription: "2026 hasta karyolası fiyatları: 2, 3 ve 4 motorlu kumandalı, ev tipi ve ahşap hasta yatağı modelleri. 2. el yerine sıfır üretici garantisi, randevulu teslimat & montaj.",
    h1Title: "Hasta Karyolası Fiyatları ve Elektrikli Motorlu Modeller",
    seoContent: "MCARIS Medikal güvencesiyle 2026'nın en konforlu ve CE sertifikalı hasta karyolası modellerini doğrudan birinci elden üretici avantajıyla sunuyoruz. Ev tipi ahşap tasarımlardan kumandalı 2 motorlu pratik karyolalara, bakıcı bel sağlığını koruyan 3 motorlu asansörlü yataklardan tam donanımlı 4 motorlu Trendelenburg yoğun bakım sistemlerine kadar tüm modeller stoktan teslim edilmektedir. İkinci el riskine girmeden sıfır, CE ve ISO sertifikalı, 2 yıl yerinde servis garantili hasta karyolalarını inceleyebilir; Ankara içi randevulu kata montaj ve Türkiye geneli ahşap sandıklı sevkiyatla güvenle satın alabilirsiniz.",
  },
  "bakim-koltuklari": {
    metaTitle: "Medikal Bakım Koltukları & Kan Alma Koltuğu Fiyatları | MCARIS",
    metaDescription: "Elektrikli motorlu hasta bakım, diyaliz, kemoterapi ve kan alma koltukları. Ergonomik tasarım, 2 yıl garanti ve hızlı teslimat.",
    h1Title: "Elektrikli Motorlu Medikal Bakım ve Tedavi Koltukları",
    seoContent: "Klinik, hastane ve evde bakım için tasarlanmış 2, 3 ve 4 motorlu hareketli medikal koltuklar. Sırt, ayak ve yükseklik ayarlarını tek tuşla yaparak hasta konforunu maksimum seviyeye çıkarır.",
  },
  "muayene-ve-bakim-masalari": {
    metaTitle: "Klinik Muayene Masaları & Ahşap Masaj Masası Modelleri | MCARIS",
    metaDescription: "Klinik muayene masaları, ahşap spa ve masaj masaları. Yüksek taşıma kapasitesi, elektrostatik fırın boyalı sağlam şasi.",
    h1Title: "Profesyonel Klinik Muayene ve Bakım Masaları",
    seoContent: "Doktor muayenehaneleri, klinikler, fizik tedavi merkezleri ve spa salonları için elektrostatik toz boyalı ve masif ahşap muayene masaları. 2 yıl resmi garanti güvencesiyle.",
  },
  "cihaz-sehpasi": {
    metaTitle: "Medikal Cihaz Taşıma Sehpaları & Etajer Fiyatları | MCARIS",
    metaDescription: "2 ve 3 raflı, çekmeceli, kilitli tekerlekli medikal cihaz sehpaları. Hastane ve klinik tipi profesyonel taşıma sehpaları.",
    h1Title: "Medikal Cihaz Taşıma ve Setup Sehpaları",
    seoContent: "Hassas medikal cihazlar, solunum cihazları, ultrason ve lazer sistemleri için kablo geçiş kanallı, elektrostatik boyalı dayanıklı cihaz sehpaları.",
  },
  "2-motorlu-hasta-yataklari": {
    metaTitle: "2 Motorlu Hasta Yatakları Fiyatları 2026 | MCARIS Medikal",
    metaDescription: "2 motorlu elektrikli hasta karyolaları. Ankara içi aynı gün adrese teslimat, kata çıkarma ve odaya montaj güvencesiyle hemen sipariş verin.",
    h1Title: "2 Motorlu Elektrikli Hasta Karyolaları & Ev Tipi Yataklar",
    seoContent: "2 motorlu hasta karyolaları, ev tipi hasta bakımında en çok tercih edilen pratik ve ekonomik modellerdir. Baş ve ayak bölgelerini kablolu el kumandasıyla bağımsız olarak ayarlayarak hastanın rahat yemek yemesini, televizyon izlemesini ve dinlenmesini sağlar. Ankara genelinde aynı gün adrese teslimat ve yerinde montaj dahildir.",
  },
  "3-motorlu-hasta-yataklari": {
    metaTitle: "3 Motorlu Asansörlü Hasta Karyolası Fiyatları | MCARIS Ankara",
    metaDescription: "Bakıcı bel sağlığını koruyan dikey asansörlü 3 motorlu hasta karyolaları. Ankara içi aynı gün adrese teslimat ve yerinde montaj güvencesi.",
    h1Title: "3 Motorlu Asansörlü Elektrikli Hasta Karyolası Modelleri",
    seoContent: "3 motorlu hasta karyolası serimiz; baş ve ayak hareketlerine ek olarak yatağın yerden yüksekliğini dikey olarak asansör hareketiyle ayarlamanıza imkan tanır. Yatağın bel seviyesine yükseltilebilmesi sayesinde refakatçi bel sağlığını korur.",
  },
  "asansorlu-3-motorlu-karyolalar": {
    metaTitle: "3 Motorlu Asansörlü Hasta Karyolası Fiyatları | MCARIS Ankara",
    metaDescription: "Bakıcı bel sağlığını koruyan dikey asansörlü 3 motorlu hasta karyolaları. Ankara içi aynı gün adrese teslimat ve yerinde montaj güvencesi.",
    h1Title: "3 Motorlu Asansörlü Hasta Karyolası Modelleri ve Fiyatları",
    seoContent: "3 motorlu elektrikli hasta karyolaları; baş ve ayak hareketlerine ilave olarak yatağın tamamını yerden dikey eksende 45 cm ile 90 cm yüksekliğe kaldırıp indirebilen asansör (hi-lo) donanımına sahiptir. Refakatçi bel sağlığını korur, transferi kolaylaştırır.",
  },
  "4-motorlu-hasta-yataklari": {
    metaTitle: "4 Motorlu Yoğun Bakım Hasta Karyolası Fiyatları | MCARIS Shop",
    metaDescription: "Trendelenburg ve CPR donanımlı 4 motorlu yoğun bakım hasta karyolaları. Ankara içi aynı gün adrese teslimat, odaya montaj ve 2 yıl resmi garanti.",
    h1Title: "4 Motorlu Yoğun Bakım Hasta Karyolası Modelleri",
    seoContent: "4 motorlu hasta karyolaları; Trendelenburg ve anti-Trendelenburg gibi hayati medikal pozisyonları sağlayarak kan dolaşımını destekleyen, ödem oluşumunu engelleyen ve solunumu rahatlatan en üst donanım sınıfıdır. Kolon motor teknolojisi ve darbe emici ABS gövdesiyle donatılmıştır.",
  },
  "4-motorlu-yogun-bakim-karyolalari": {
    metaTitle: "4 Motorlu Yoğun Bakım Hasta Karyolası Fiyatları | MCARIS Shop",
    metaDescription: "Trendelenburg ve CPR donanımlı 4 motorlu yoğun bakım hasta karyolaları. Ankara içi aynı gün adrese teslimat, odaya montaj ve 2 yıl resmi garanti.",
    h1Title: "4 Motorlu Yoğun Bakım Hasta Karyolası Modelleri",
    seoContent: "Hastanelerin yoğun bakım ünitelerinde kullanılan medikal standartları evinize taşıyan 4 motorlu elektrikli hasta karyolaları; sırt, ayak ve asansör hareketlerine ek olarak Trendelenburg ve Anti-Trendelenburg klinik pozisyonlarını sunar.",
  },
  "ahsap-ev-tipi-hasta-karyolalari": {
    metaTitle: "Ahşap Ev Tipi Hasta Karyolası Modelleri | MCARIS Medikal",
    metaDescription: "Ev mobilyası sıcaklığında motorlu ahşap hasta karyolası ve Burmeier modelleri. Şilte ve askı dahil, Ankara içi aynı gün teslimat ve kata oda içi montaj.",
    h1Title: "Ahşap Ev Tipi Hasta Karyolası Modelleri",
    seoContent: "Hastane ortamının soğuk görüntüsünü evden uzaklaştırmak isteyen aileler için tasarlanan ahşap ev tipi hasta karyolaları; modern mobilya estetiğini elektrikli hasta karyolası teknolojisiyle birleştirir.",
  },
  "tam-evde-bakim-setleri": {
    metaTitle: "Tam Teşekküllü Evde Hasta Bakım Setleri | Fırsat Paketleri",
    metaDescription: "Karyola + Havalı Yatak + Yemek Masası + Şilte tam evde bakım setleri. İndirimli fabrika fiyatları ve Ankara içi aynı gün adrese ücretsiz oda montajı.",
    h1Title: "Tam Teşekküllü Evde Hasta Bakım Setleri",
    seoContent: "Hastaneden eve taburcu olan hastalar için motorlu hasta karyolası, bası yarası önleyici boru tipi havalı yatak, amortisörlü yemek masası ve tekerlekli etajeri tek bir avantajlı pakette birleştirir.",
  },
  "dovme-kol-sehpalari": {
    metaTitle: "Dövme Kol Dayama Sehpası Fiyatları & Profesyonel Tattoo Ekipmanları | MCARIS",
    metaDescription: "Profesyonel dövme ve tattoo sanatçıları için kademesiz açı ayarlı, 360 derece dönebilen ergonomik dövme kol dayama sehpası modelleri.",
    h1Title: "Profesyonel Dövme Kol Dayama Sehpası ve Tattoo Ekipmanları",
    seoContent: "Dövme stüdyoları ve tattoo artistleri için özel olarak tasarlanmış ağır döküm tabanlı, kademesiz yükseklik ve eğim ayarlı profesyonel dövme kol dayama sehpaları.",
  },
  "hasta-yemek-masalari": {
    metaTitle: "Hasta Yemek Masası Modelleri & Yatak Üstü Amortisörlü Masa Fiyatları | MCARIS",
    metaDescription: "Amortisörlü yatak üstü hasta yemek masaları, tekerlekli etajerli medikal yemek masaları. Kolay temizlenebilir, ergonomik yükseklik ayarlı ve garantili.",
    h1Title: "Amortisörlü Hasta Yemek Masaları ve Aksesuarları",
    seoContent: "Yatağa bağımlı ve dinlenme sürecindeki hastaların yatak içinde rahatça beslenmesini, ilaç almasını ve kişisel eşyalarını kullanmasını sağlayan hidrolik ve amortisörlü yükseklik ayarlı hasta yemek masaları. Kilitlenebilir tekerlekleri, kolay silinebilir antibakteriyel tabla yapısı ve yatak altına giren C-ayak tasarımıyla ev ve hastane kullanımına tam uyumludur.",
  },
  "medikal-kozmetik": {
    metaTitle: "Medikal & Kozmetik Bakım Ekipmanları Fiyatları | MCARIS",
    metaDescription: "Güzellik merkezleri, estetik klinikleri ve cilt bakım salonları için profesyonel medikal kozmetik sedyeleri, bakım koltukları ve ekipmanlar. 2 yıl garanti.",
    h1Title: "Profesyonel Medikal ve Kozmetik Bakım Ekipmanları",
    seoContent: "Medikal estetik merkezleri, güzellik salonları ve dermatoloji klinikleri için tasarlanan ergonomik, motorlu ve hidrolik bakım sedyeleri, cilt bakım masaları ve medikal cihaz taşıma çözümleri. Dayanıklı gövde mimarisi, kolay dezenfekte edilen antibakteriyel döşeme ve 2 yıl resmi üretici garantisiyle.",
  },
  "tabure-ve-sandalyeler": {
    metaTitle: "Medikal Doktor & Hekim Tabureleri | Ergonomik Sırtlı Tabure Fiyatları | MCARIS",
    metaDescription: "Amortisörlü, sırtlı ve sırtsız medikal doktor tabureleri, klinik ve laboratuvar çalışma sandalyeleri. 360 derece döner tekerlekli, dayanıklı ve ergonomik modeller.",
    h1Title: "Ergonomik Medikal Hekim Tabureleri ve Klinik Sandalyeleri",
    seoContent: "Klinik, hastane muayenehanesi, diş hekimliği ve güzellik merkezlerinde hekim ve uzmanların uzun süreli çalışma konforunu sağlayan ergonomik amortisörlü medikal tabureler. Sırt destekli, halkalı ayak koyma üniteli ve sessiz poliüretan tekerlekli şasisiyle yüksek dayanıklılık ve 2 yıl resmi garanti.",
  },
};

export async function getCategoriesWithStats() {
  try {
    // Seed missing category SEO data
    for (const [slug, seo] of Object.entries(INITIAL_CATEGORY_SEO)) {
      await prisma.category.updateMany({
        where: { slug, metaTitle: null },
        data: seo,
      });
    }
  } catch {
    // ignore
  }

  return prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: { parent: true },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug: slugifyTurkish(slug) },
    include: { parent: true },
  });
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  parentId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  h1Title?: string | null;
  seoContent?: string | null;
}) {
  const name = data.name.trim();
  const slug = slugifyTurkish(data.slug?.trim() || name) || `cat-${Date.now()}`;

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    throw new Error(`'${slug}' slug değerine sahip başka bir kategori zaten var.`);
  }

  return prisma.category.create({
    data: {
      name,
      slug,
      parentId: data.parentId || null,
      metaTitle: data.metaTitle?.trim() || null,
      metaDescription: data.metaDescription?.trim() || null,
      h1Title: data.h1Title?.trim() || null,
      seoContent: data.seoContent?.trim() || null,
    },
  });
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    parentId?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    h1Title?: string | null;
    seoContent?: string | null;
  }
) {
  if (data.parentId && data.parentId === id) {
    throw new Error("Bir kategori kendisinin üst kategorisi olamaz.");
  }

  const name = data.name?.trim();
  let slug = data.slug?.trim();

  if (name && !slug) {
    slug = slugifyTurkish(name);
  } else if (slug) {
    slug = slugifyTurkish(slug);
  }

  if (slug) {
    const existing = await prisma.category.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      throw new Error(`'${slug}' slug değerine sahip başka bir kategori zaten var.`);
    }
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(data.parentId !== undefined && { parentId: data.parentId || null }),
      ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle?.trim() || null }),
      ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription?.trim() || null }),
      ...(data.h1Title !== undefined && { h1Title: data.h1Title?.trim() || null }),
      ...(data.seoContent !== undefined && { seoContent: data.seoContent?.trim() || null }),
    },
  });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true, children: true },
      },
    },
  });

  if (!category) {
    throw new Error("Silinmek istenen kategori bulunamadı.");
  }

  if (category._count.products > 0) {
    throw new Error(`Bu kategoriye bağlı ${category._count.products} adet ürün bulunmaktadır. Önce ürünleri başka kategoriye taşıyın.`);
  }

  if (category._count.children > 0) {
    throw new Error(`Bu kategoriye bağlı ${category._count.children} adet alt kategori bulunmaktadır.`);
  }

  return prisma.category.delete({
    where: { id },
  });
}
