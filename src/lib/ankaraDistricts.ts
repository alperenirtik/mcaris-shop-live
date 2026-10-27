export interface AnkaraDistrict {
  slug: string;
  name: string;
  title: string;
  deliveryTimeHours: string;
  popularNeighborhoods: string[];
  nearbyHospitals: string[];
  description: string;
  faqs: { question: string; answer: string }[];
}

export const ANKARA_DISTRICTS: AnkaraDistrict[] = [
  {
    slug: "cankaya",
    name: "Çankaya",
    title: "Çankaya Hasta Yatağı Satışı, Fiyatları ve Teknik Servis",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Çayyolu", "Ümitköy", "Koru", "Yaşamkent", "Beytepe", "Bilkent", 
      "Kavaklıdere", "Ayrancı", "Gaziosmanpaşa", "Yıldız", "Birlik", "Dikmen", 
      "Öveçler", "Balgat", "Cebeci", "Kurtuluş", "Kızılay", "Bahçelievler"
    ],
    nearbyHospitals: [
      "Bilkent Şehir Hastanesi",
      "Hacettepe Üniversitesi Hastanesi",
      "Ankara Üniversitesi İbni Sina Hastanesi",
      "Gazi Üniversitesi Hastanesi",
      "Bayındır Hastanesi Söğütözü",
      "Güven Hastanesi"
    ],
    description:
      "Çankaya genelinde (Çayyolu, Ümitköy, Kızılay, Balgat, Dikmen) 2, 3 ve 4 motorlu elektrikli ahşap ve ABS hasta karyolaları, transfer liftleri doğrudan satış ve 7/24 teknik servis hizmeti. Kendi servis filomuzla aynı gün adresinize ücretsiz teslimat ve uzman teknisyenlerimizce yerinde anahtar teslim kurulum yapıyoruz.",
    faqs: [
      {
        question: "Çankaya ilçesinde hasta yatağı teslimatı ne kadar sürer?",
        answer: "Çankaya merkez ve çevre semtlerine (Çayyolu, Ümitköy, Dikmen vb.) aynı gün içinde adrese ücretsiz teslimat ve montaj yapıyoruz."
      },
      {
        question: "Çankaya'da hasta yatağı kiralama veya satın alma opsiyonları var mı?",
        answer: "Evet, Çankaya genelinde hem sıfır hasta karyolası satışı hem de ameliyat sonrası geçici nekahat dönemleri için aylık kiralama hizmeti sunuyoruz. Kiralık karyolalarımız steril dezenfekte edilmiş gövde ile hazır stoklu ürünlerimizde aynı gün adresinize teslim edilip kurulur. Dileyen müşterilerimiz kiralama süresince ödediği tutarı satın alma bedelinden düşürebilir."
      },
      {
        question: "Kurulumu ve teknik servisi kim yapıyor?",
        answer: "MCARIS Medikal'in kendi sertifikalı teknik personeli karyolayı evinize getirir, odanıza kurar ve hasta yakınlarına kumanda kullanım eğitimini eksiksiz verir."
      }
    ]
  },
  {
    slug: "yenimahalle",
    name: "Yenimahalle",
    title: "Yenimahalle Hasta Yatağı Satışı, Modelleri ve Aynı Gün Kurulum",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Batıkent", "Çakırlar", "Ergazi", "İlkyerleşim", "Kardelen", "Uğur Mumcu",
      "Demetevler", "Şentepe", "Ostim", "İvedik", "Gersan", "Macunköy", "Beştepe", "Varlık"
    ],
    nearbyHospitals: [
      "Dr. Abdurrahman Yurtaslan Ankara Onkoloji Eğitim ve Araştırma Hastanesi",
      "Yenimahalle Eğitim ve Araştırma Hastanesi (Batıkent)",
      "Medical Park Ankara Hastanesi (Batıkent)",
      "Gülhane Eğitim ve Araştırma Hastanesi (GATA Yakını)"
    ],
    description:
      "Merkez servis üssümüzün bulunduğu Yenimahalle ve Batıkent bölgesine gün içinde en hızlı hasta karyolası teslimatı ve teknik servis hizmeti. 4 motorlu ahşap Alman motorlu karyolalar, 3 motorlu asansörlü modeller ve transfer liftleri kapınıza kadar getirilir.",
    faqs: [
      {
        question: "Yenimahalle ve Batıkent'e teslimat süresi nedir?",
        answer: "Depomuz ve servis merkezimiz Gersan/Yenimahalle bölgesinde olduğu için siparişinizi takiben gün içinde kapınızda kurulum tamamlanır."
      },
      {
        question: "Onkoloji Hastanesi ve çevresine acil teslimat yapıyor musunuz?",
        answer: "Evet, taburcu olan hastalarımız için Onkoloji Hastanesi, Demetevler ve Batıkent bölgelerine öncelikli acil teslimat sağlamaktayız."
      }
    ]
  },
  {
    slug: "kecioren",
    name: "Keçiören",
    title: "Keçiören Hasta Yatağı Satışı, Fiyatları ve Motorlu Karyola",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Etlik", "Aşağı Eğlence", "İncirli", "Bağlum", "Ufuktepe", "Esertepe",
      "Dutluk", "Kuşcağız", "Ayvalı", "Kalaba", "Sanatoryum", "Aktepe", "Ovacık"
    ],
    nearbyHospitals: [
      "Etlik Şehir Hastanesi",
      "Sanatoryum Göğüs Hastalıkları Hastanesi",
      "Gülhane Eğitim ve Araştırma Hastanesi (GATA)",
      "Keçiören Eğitim ve Araştırma Hastanesi"
    ],
    description:
      "Keçiören ve Etlik Şehir Hastanesi çevresine özel aynı gün elektrikli hasta karyolası teslimatı. Yatalak ve felçli hasta bakımı için sırt, ayak ve asansör hareketli medikal yataklar, havalı yatak çeşitleri ve yerinde montaj desteği.",
    faqs: [
      {
        question: "Etlik Şehir Hastanesi'nden taburcu olan hasta için acil kurulum var mı?",
        answer: "Evet, hastanız taburcu olmadan önce siparişinizi vererek eve vardığınız anda yatağın kurulu ve kullanıma hazır olmasını sağlayabilirsiniz."
      },
      {
        question: "Keçiören'de dik merdivenli veya dar binalara taşıma yapıyor musunuz?",
        answer: "Tüm karyolalarımız modüler yapıdadır; teknik ekibimiz asansörsüz ve dar merdivenli binalara da sorunsuz şekilde taşıyıp odada montajını yapar."
      }
    ]
  },
  {
    slug: "etimesgut",
    name: "Etimesgut",
    title: "Etimesgut & Eryaman Hasta Yatağı Satışı ve 2 Yıl Garanti",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Eryaman", "Göksu", "Altay", "Şehit Osman Avcı", "Tunahan", "Devlet",
      "Bağlıca", "Elvankent", "Piyade", "Süvari", "İstasyon", "Alsancak", "Yapracık"
    ],
    nearbyHospitals: [
      "Etimesgut Şehit Sait Ertürk Devlet Hastanesi",
      "Korkut Ata Sağlık Merkezi",
      "Özel Eryaman Hastanesi"
    ],
    description:
      "Etimesgut, Eryaman ve Bağlıca bölgelerine aynı gün ücretsiz nakliye ve yerinde kurulum. Ev tipi ahşap baza görünümlü hasta karyolaları, 4 motorlu trendelenburg özellikli yoğun bakım yatakları ve 10 yıl parça garantisi.",
    faqs: [
      {
        question: "Eryaman ve Bağlıca'ye teslimat ücreti alınıyor mu?",
        answer: "Hayır, Etimesgut ve tüm semtlerine teslimat ve montaj tamamen ücretsizdir."
      }
    ]
  },
  {
    slug: "mamak",
    name: "Mamak",
    title: "Mamak Hasta Yatağı Satışı, Fiyatları ve Teknik Servis",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Abidinpaşa", "Tuzluçayır", "Saimekadın", "Akdere", "Demirlibahçe", "Gülveren",
      "Durali Alıç", "Kayaş", "Lalahan", "Yeşilbayır", "Ege Mahallesi", "Şafaktepe"
    ],
    nearbyHospitals: [
      "Ankara Üniversitesi Cebeci Hastanesi",
      "Mamak Devlet Hastanesi",
      "Gülveren Toplum Sağlığı Merkezi"
    ],
    description:
      "Mamak ilçesinde evde hasta bakan ailelerimize özel ekonomik 2 motorlu, 3 motorlu asansörlü ve 4 motorlu ful fonksiyonlu hasta yatakları. Serum askısı, kilitli tekerlekler ve antibakteriyel yatak şiltesi dahil eksiksiz setler.",
    faqs: [
      {
        question: "Mamak'ta teknik servis ve motor arızası desteğiniz var mı?",
        answer: "Evet, tüm Ankara'da olduğu gibi Mamak'ta da yerinde teknik servis, motor değişimi ve kumanda tamiri hizmetimiz mevcuttur."
      }
    ]
  },
  {
    slug: "sincan",
    name: "Sincan",
    title: "Sincan & Fatih Hasta Yatağı Satışı, Modelleri ve Servis",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Fatih", "Yenikent", "Törekent", "Plevne", "Malazgirt", "Tandoğan",
      "İstasyon", "GOP", "Osmanlı", "Akşemsettin", "Saraycık", "Temelli"
    ],
    nearbyHospitals: [
      "Sincan Dr. Nafiz Körez Devlet Hastanesi",
      "Lokman Hekim Sincan Hastanesi",
      "Sincan Ağız ve Diş Sağlığı Merkezi"
    ],
    description:
      "Sincan ve Yenikent bölgelerine kesintisiz hasta karyolası satış ve servis hizmeti. Yatak yaralarını önleyen lazer kesim CNC medikal süngerler ve havalı yatak sistemleriyle hastanızın konforunu güvenceye alın.",
    faqs: [
      {
        question: "Yenikent ve Temelli'ye teslimat yapıyor musunuz?",
        answer: "Evet, Sincan'ın tüm çevre mahallelerine ve Yenikent bölgesine aynı gün teslimat ve montaj yapıyoruz."
      }
    ]
  },
  {
    slug: "altindag",
    name: "Altındağ",
    title: "Altındağ Hasta Yatağı Satışı ve Hasta Karyolası Fiyatları",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Ulus", "Dışkapı", "Hasköy", "Aydınlıkevler", "Güneşevler", "Karapürçek",
      "Hacı Bayram", "Önder", "Ulubey", "Başpınar", "Battalgazi", "Feridun Çelik"
    ],
    nearbyHospitals: [
      "Dışkapı Yıldırım Beyazıt Eğitim ve Araştırma Hastanesi",
      "Ankara Üniversitesi Tıp Fakültesi",
      "Hacettepe Tıp Fakültesi Yakını"
    ],
    description:
      "Altındağ, Dışkapı ve Aydınlıkevler bölgelerine özel doğrudan hasta karyolası sıfır satış hizmetleri. Felçli, yaşlı ve ameliyat sonrası iyileşme sürecindeki hastalar için hekim onaylı ergonomik pozisyon veren karyolalar.",
    faqs: [
      {
        question: "Altındağ Karapürçek bölgesine teslimat yapılıyor mu?",
        answer: "Evet, Altındağ'ın tüm mahallelerine gün içerisinde adrese ücretsiz teslimat ve montaj sağlıyoruz."
      }
    ]
  },
  {
    slug: "golbasi",
    name: "Gölbaşı",
    title: "Gölbaşı & İncek Hasta Yatağı Satışı ve Fabrika Teslimat",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "İncek", "Taşpınar", "Tulumtaş", "Kızılcaşar", "Bahçelievler", "Şafak",
      "Gaziosmanpaşa", "Karşıyaka", "Hacılar", "Oyaca", "Ballıkpınar"
    ],
    nearbyHospitals: [
      "Gölbaşı Şehit Ahmet Özsoy Devlet Hastanesi",
      "Gölbaşı Ağız ve Diş Sağlığı Merkezi"
    ],
    description:
      "Gölbaşı, İncek ve Mogan çevresindeki müstakil evler, villalar ve dairelere uygun lüks ahşap kaplamalı hasta karyolaları. Sessiz çalışan güçlü Alman motor teknolojisi ve hastayı yormayan yumuşak hareket kabiliyeti.",
    faqs: [
      {
        question: "İncek bölgesine teslimat süreniz nedir?",
        answer: "İncek ve Gölbaşı merkezine gün içinde kendi aracımız ve teknisyenlerimizle teslimat yapıyoruz."
      }
    ]
  },
  {
    slug: "pursaklar",
    name: "Pursaklar",
    title: "Pursaklar & Saray Hasta Yatağı Satışı ve Modelleri",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Saray", "Merkez", "Mimar Sinan", "Tevfik İleri", "Fatih", "Abadan", "Sirkeli"
    ],
    nearbyHospitals: [
      "Pursaklar Devlet Hastanesi"
    ],
    description:
      "Pursaklar ve Saray bölgesine aynı gün hasta karyolası nakliye ve montaj hizmeti. Çift taraflı tabanca korkuluklu, serum askılı ve medikal tekerlekli hasta yatakları.",
    faqs: [
      {
        question: "Pursaklar'a teslimat ücretsiz mi?",
        answer: "Evet, Pursaklar ve Saray mahallelerine teslimat ve montaj tamamen ücretsizdir."
      }
    ]
  },
  {
    slug: "polatli",
    name: "Polatlı",
    title: "Polatlı Hasta Yatağı Satışı, Fiyatları ve Aynı Gün Servis",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: [
      "Cumhuriyet", "Gazi", "İstiklal", "Kurtuluş", "Mehmet Akif", "Şentepe", "Zafer"
    ],
    nearbyHospitals: [
      "Polatlı Duatepe Devlet Hastanesi",
      "Özel Polatlı Can Hastanesi"
    ],
    description:
      "Polatlı ilçe merkezi ve köylerine aynı gün hasta karyolası sevkiyatı. 2, 3 ve 4 motorlu modeller, 2 yıl garantili sıfır hasta yatakları yerinde kurulum güvencesiyle.",
    faqs: [
      {
        question: "Polatlı'ya servis araçlarınız her gün gidiyor mu?",
        answer: "Evet, Polatlı bölgesine her gün düzenli servis ve sevkiyat aracımız çıkmaktadır."
      }
    ]
  },
  {
    slug: "cubuk",
    name: "Çubuk",
    title: "Çubuk Hasta Yatağı Satışı ve Motorlu Karyola Modelleri",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Yavuzselim", "Yıldırım Beyazıt", "Cumhuriyet", "Atatürk", "Esenboğa"],
    nearbyHospitals: ["Halil Şıvgın Çubuk Devlet Hastanesi"],
    description: "Çubuk ve Esenboğa bölgesine özel hasta karyolası sıfır satış ve yerinde montaj. Hastane sonrası evde bakım için en güvenilir elektrikli medikal yataklar.",
    faqs: [{ question: "Çubuk köylerine teslimat var mı?", answer: "Evet, Çubuk merkez ve çevre köylerine adrese teslim montaj yapılmaktadır." }]
  },
  {
    slug: "kahramankazan",
    name: "Kahramankazan",
    title: "Kahramankazan & Saray Hasta Yatağı Satış ve Kurulum",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Saray", "Atatürk", "Kayı", "Fatih", "İmrendi"],
    nearbyHospitals: ["Kahramankazan Hamdi Eriş Devlet Hastanesi"],
    description: "Kahramankazan bölgesine hızlı hasta yatağı teslimatı. 2 yıl garanti, 10 yıl yedek parça temini ve yerinde servis avantajı.",
    faqs: [{ question: "Kazan bölgesine servis süreniz nedir?", answer: "Yenimahalle merkezimize yakınlığı sebebiyle gün içinde kurulum sağlanır." }]
  },
  {
    slug: "beypazari",
    name: "Beypazarı",
    title: "Beypazarı Hasta Yatağı Satışı ve Karyola Fiyatları",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Hacıkara", "Bahtiyar", "Beytepe", "Rüstempaşa", "Ayvaşık"],
    nearbyHospitals: ["Beypazarı Devlet Hastanesi"],
    description: "Beypazarı genelinde elektrikli motorlu hasta yatakları, havalı yataklar ve hasta transfer liftleri satışı ve teknik servis desteği.",
    faqs: [{ question: "Beypazarı'na montaj dahil mi?", answer: "Evet, teknik personelimiz yatağı evinize kurup çalışır vaziyette teslim eder." }]
  },
  {
    slug: "elmadag",
    name: "Elmadağ",
    title: "Elmadağ & Hasanoğlan Hasta Yatağı Satışı ve Servisi",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Hasanoğlan", "Kemalpaşa", "Yenimahalle", "Kurtuluş", "Lalabel"],
    nearbyHospitals: ["Elmadağ Dr. Hulusi Alataş Devlet Hastanesi"],
    description: "Elmadağ ve Hasanoğlan ilçelerine motorlu hasta karyolası satışı ve arıza durumunda yerinde tamir ve yedek parça desteği.",
    faqs: [{ question: "Hasanoğlan'a aynı gün gelir mi?", answer: "Evet, Elmadağ ve Hasanoğlan bölgesine aynı gün teslimat gerçekleştirilir." }]
  },
  {
    slug: "akyurt",
    name: "Akyurt",
    title: "Akyurt Hasta Yatağı Satışı ve Motorlu Karyola Modelleri",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Beyazıt", "Yıldırım", "Atatürk", "Yeşiltepe", "Balıkhisar"],
    nearbyHospitals: ["Akyurt Devlet Hastanesi"],
    description: "Akyurt ilçesine 2, 3 ve 4 motorlu hasta yatağı çözümleri. CE ve ISO 9001 standartlarında güvenli medikal bakım ekipmanları.",
    faqs: [{ question: "Akyurt'a nakliye ücreti var mı?", answer: "Tüm Ankara ilçelerinde olduğu gibi Akyurt'a da nakliye ve kurulum ücretsizdir." }]
  },
  {
    slug: "nallihan",
    name: "Nallıhan",
    title: "Nallıhan & Çayırhan Hasta Yatağı Hizmetleri",
    deliveryTimeHours: "Aynı Gün / Randevulu",
    popularNeighborhoods: ["Çayırhan", "Nasuhpaşa", "Aliefe", "Hacıbey"],
    nearbyHospitals: ["Nallıhan Devlet Hastanesi"],
    description: "Nallıhan ve Çayırhan bölgesine hasta karyolası ve medikal bakım yatağı satışı, teknik destek ve montaj hizmetleri.",
    faqs: [{ question: "Çayırhan'a teslimat yapıyor musunuz?", answer: "Evet, Nallıhan merkez ve Çayırhan beldesine adrese teslimat yapılmaktadır." }]
  },
  {
    slug: "haymana",
    name: "Haymana",
    title: "Haymana Hasta Yatağı Satışı ve Motorlu Karyolalar",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Kayabaşı", "Medrese", "Seyran", "Çaldağ"],
    nearbyHospitals: ["Haymana Devlet Hastanesi"],
    description: "Haymana ilçesinde evde bakım ve fizik tedavi hastalarına özel elektrikli kumandalı karyolalar ve hasta taşıma liftleri.",
    faqs: [{ question: "Haymana'da kurulum desteği var mı?", answer: "Evet, uzman ekibimiz tarafından yerinde kurulum yapılır." }]
  },
  {
    slug: "kizilcahamam",
    name: "Kızılcahamam",
    title: "Kızılcahamam Hasta Yatağı Satışı ve Modelleri",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Akçay", "Karşıyaka", "Yenice", "İsmetpaşa"],
    nearbyHospitals: ["Kızılcahamam Devlet Hastanesi"],
    description: "Kızılcahamam ve çevre termal/sağlık merkezlerine özel medikal hasta yatakları, 2 yıl yerinde garantili doğrudan satış.",
    faqs: [{ question: "Kızılcahamam'a teslimat nasıl işliyor?", answer: "Siparişinizi takiben servis aracımız gün içerisinde gelerek montajı tamamlar." }]
  },
  {
    slug: "bala",
    name: "Bala",
    title: "Bala Hasta Yatağı Satışı ve Adrese Teslimat",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Kartaltepe", "Şentepe", "Hamidiye"],
    nearbyHospitals: ["Bala İlçe Devlet Hastanesi"],
    description: "Bala ilçesi ve köylerine sıfır hasta karyolası tedariki, teslimat ve yerinde montaj hizmetleri.",
    faqs: [{ question: "Bala'ya teslimat süresi nedir?", answer: "Aynı gün içerisinde adrese teslim edilip kurulur." }]
  },
  {
    slug: "kalecik",
    name: "Kalecik",
    title: "Kalecik Hasta Yatağı Satışı ve 2 Yıl Garanti",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Ahiler", "Cuma", "Halitcevri", "Çanşa"],
    nearbyHospitals: ["Kalecik Devlet Hastanesi"],
    description: "Kalecik bölgesine hasta yatakları satışı, yedek parça ve yerinde teknik servis güvencesi.",
    faqs: [{ question: "Kalecik'e servis hizmeti var mı?", answer: "Evet, yerinde montaj ve garanti kapsamı Kalecik için de geçerlidir." }]
  },
  {
    slug: "ayas",
    name: "Ayaş",
    title: "Ayaş Hasta Yatağı Satışı ve Motorlu Karyola Modelleri",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Hacıveli", "Ömeroğlu", "Şeyhmuhittin", "Ferahfaki"],
    nearbyHospitals: ["Ayaş Şehit Mehmet Çifci Devlet Hastanesi"],
    description: "Ayaş ilçesinde evde bakım ve fizik tedavi amaçlı elektrikli hasta yatağı modelleri ve montaj desteği.",
    faqs: [{ question: "Ayaş'a teslimat yapılıyor mu?", answer: "Evet, Ayaş genelinde ücretsiz teslimat ve kurulum sağlıyoruz." }]
  },
  {
    slug: "gudul",
    name: "Güdül",
    title: "Güdül Hasta Yatağı Satışı ve Kumandalı Modeller",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Aşağı", "Yukarı", "Emirler", "Yeni"],
    nearbyHospitals: ["Güdül İlçe Entegre Devlet Hastanesi"],
    description: "Güdül ilçesinde hasta karyolası doğrudan satış hizmetleri, kumandalı motorlu yataklar.",
    faqs: [{ question: "Güdül'e garanti geçerli mi?", answer: "Evet, tüm ürünlerimizde 2 yıl yerinde servis garantisi vardır." }]
  },
  {
    slug: "camlidere",
    name: "Çamlıdere",
    title: "Çamlıdere Hasta Yatağı Satışı ve Medikal Karyolalar",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Beyler", "Kayabaşı", "Körler", "Özbağ"],
    nearbyHospitals: ["Çamlıdere İlçe Devlet Hastanesi"],
    description: "Çamlıdere ilçesine elektrikli hasta karyolaları ve medikal transfer liftleri ulaştırıyoruz.",
    faqs: [{ question: "Çamlıdere'ye teslimat nasıl yapılır?", answer: "Kendi nakliye aracımızla kapınıza kadar getirip kuruyoruz." }]
  },
  {
    slug: "evren",
    name: "Evren",
    title: "Evren Hasta Yatağı Satışı ve Adrese Teslimat",
    deliveryTimeHours: "Aynı Gün / Randevulu",
    popularNeighborhoods: ["Modern", "Yeni", "Şerefli"],
    nearbyHospitals: ["Evren Sağlık Merkezi"],
    description: "Evren ilçesi ve Hirfanlı Barajı çevresindeki yerleşimlere doğrudan hasta karyolası satışı ve teknik montaj desteği.",
    faqs: [{ question: "Evren ilçesine sevkiyat var mı?", answer: "Evet, planlı servis araçlarımızla teslimat yapılır." }]
  },
  {
    slug: "sereflikochisar",
    name: "Şereflikoçhisar",
    title: "Şereflikoçhisar Hasta Yatağı Satışı ve Teknik Servis",
    deliveryTimeHours: "Gün İçinde Kurulum",
    popularNeighborhoods: ["Emek", "İstiklal", "Tuzgölü", "Sarıkaya", "Boğaziçi"],
    nearbyHospitals: ["Şereflikoçhisar Devlet Hastanesi"],
    description: "Şereflikoçhisar genelinde 2, 3 ve 4 motorlu hasta karyolaları satışı, sıfır ürün güvencesi, yedek parça ve teknik destek.",
    faqs: [{ question: "Şereflikoçhisar'a teslimat ücretsiz mi?", answer: "Evet, kurulum ve teslimat teknisyenlerimiz tarafından ücretsiz yapılır." }]
  }
];

export function getDistrictBySlug(slug: string): AnkaraDistrict | undefined {
  return ANKARA_DISTRICTS.find((d) => d.slug === slug);
}
