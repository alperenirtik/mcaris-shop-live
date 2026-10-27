"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ──────────────────── Types ──────────────────── */
type ChangeCategory =
  | "Yeni"
  | "İyileştirme"
  | "Altyapı"
  | "Güvenlik"
  | "Düzeltme"
  | "Tasarım"
  | "Yeni Özellik"
  | "Tasarım & Medya";

interface ChangelogLink {
  href: string;
  label: string;
}

interface ChangelogItem {
  title: string;
  category: ChangeCategory;
  details: string[];
  links?: ChangelogLink[];
}

interface ChangelogRelease {
  version: string;
  date: string;
  badge?: string;
  summary: string;
  items: ChangelogItem[];
}

/* ──────────────────── Structured Changelog Data ──────────────────── */
const CHANGELOG_RELEASES: ChangelogRelease[] = [
  {
    version: "v3.0.1",
    date: "8 Ekim 2026",
    badge: "Güncel Sürüm",
    summary:
      "Yeni eklenen katalog ürünlerinde aynı fotoğrafın birden fazla üründe görünmesi giderildi. Mağaza açılışında depodaki doğru ürün fotoğrafları, daha önce karışan kopyaların üzerine yazılıyor.",
    items: [
      {
        title: "Ürün fotoğraflarının doğru üründe açılması",
        category: "Düzeltme",
        details: [
          "Fotoğrafı henüz yerine oturmamış yeni ürünlerde, ada benzeyen başka bir ürünün görseli kopyalanıp aynıymış gibi gösteriliyordu.",
          "Bu kopyalama kapatıldı. Mağaza her yayında depodaki kendi fotoğraflarını ilgili ürünlerin üzerine yerleştiriyor.",
          "MC-6103 ve MC-6104 ameliyat masaları artık birbirinin görselini paylaşmıyor; her biri kendi masasını gösteriyor.",
        ],
        links: [
          {
            href: "https://shop.mcaris.com.tr/urun/veteriner-ameliyat-ve-operasyon-masasi-mc-6103",
            label: "MC-6103 Veteriner Ameliyat Masası",
          },
          {
            href: "https://shop.mcaris.com.tr/urun/veteriner-ameliyat-ve-operasyon-masasi-mc-6104",
            label: "MC-6104 Veteriner Ameliyat Masası",
          },
        ],
      },
    ],
  },
  {
    version: "v3.0.0",
    date: "1 Ekim 2026",
    summary:
      "Mağaza genelinde görsel kalite ve kurumsal kimlik baştan aşağı yenilendi. Yapay zeka çıktısını andıran aşırı renkli, bulanık arka plan sisleri ve göz yoran süslemeler vitrinden tamamen temizlendi. Yerine medikal sektörün kurumsal güvenilirliğini yansıtan ferah, sade, keskin hatlı ve yüksek kontrastlı bir vitrin düzeni kazandırıldı. Ziyaretçilerin hasta karyolalarını incelemesi, WhatsApp sipariş hattına bağlanması ve 7/24 danışma alması çok daha hızlı ve ergonomik hale getirildi.",
    items: [
      {
        title: "Kurumsal Vitrin ve Görsel Sadeleşme Hamlesi",
        category: "Tasarım",
        details: [
          "Ana sayfa vitrinindeki göz yoran bulanık renkli sisler ve yapay desenler kaldırılarak yerine doğrudan hasta yataklarını ve medikal özellikleri öne çıkaran net bir mağaza düzeni getirildi.",
          "Hasta karyolası inceleme, WhatsApp ile hızlı sipariş ve 7/24 canlı danışma butonları daha okunaklı ve modern bir standartla yenilendi.",
          "2 yıl resmi yerinde servis garantisi ve Ankara içi aynı gün ücretsiz teslimat rozetleri daha belirgin ve güven verici şekilde konumlandırıldı.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr", label: "Yenilenen Ana Sayfa Vitrini" },
          { href: "https://shop.mcaris.com.tr/urunler", label: "Hasta Karyolası Modelleri Kataloğu" },
        ],
      },
      {
        title: "Günün Fırsatı ve Kampanya Alanı Kalibrasyonu",
        category: "İyileştirme",
        details: [
          "Sınırlı süreli indirimli hasta karyolası vitrininde kalan süre sayacı ve indirim oranı çok daha net ve kurumsal bir kontrastla düzenlendi.",
          "Hasta yakınlarının acil ihtiyaç duyduğu kampanyalı modeli tek bakışta inceleyip sepete veya WhatsApp siparişine yönelmesi kolaylaştırıldı.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr", label: "Günün Kampanyalı Ürünü" },
        ],
      },
      {
        title: "İç İçe Kart Yığılmasının (Çift Çerçeve) Sadeleştirilmesi",
        category: "Tasarım",
        details: [
          "Pazaryeri ve MCARIS karşılaştırma tablosunun dışındaki gereksiz kart kutusu, çifte kenarlıklar ve ekranı daraltan fazla boşluklar kaldırıldı.",
          "Karşılaştırma tablosu doğrudan ferah bir düzenle sergilenerek mobil ve masaüstü ekranlarda kriterlerin çok daha rahat okunması sağlandı.",
          "Ana sayfa rehber bloğundaki hantal dış kutu kenarlıkları da inceltilerek mağaza bölümleri arasında akıcı bir görsel bütünlük oluşturuldu.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr", label: "Sadeleştirilen Karşılaştırma Alanı" },
          { href: "https://shop.mcaris.com.tr/ankara-hasta-yatagi", label: "Ankara Hizmet Karşılaştırması" },
        ],
      },
      {
        title: "Ürün Galerisi Önizleme (Thumbnail) Çerçeve ve Taşma Düzeltmesi",
        category: "Düzeltme",
        details: [
          "Ürün detay sayfalarındaki görsel galerisinde, seçili küçük resmi vurgulayan odak çerçevesi ve gölgenin alt/sol kenarlarda kesilmesine sebep olan kaydırma taşması (overflow) sorunu kökten çözüldü.",
          "Küçük görsel listesine dört taraftan rahat nefes payı kazandırılarak aktif görsel çerçevelerinin kesilmeden, pürüzsüz ve net hatlarla sergilenmesi sağlandı.",
          "Seçim geçişlerinde piksel kaymaları ve bulanıklık yaratan yapay ölçeklendirmeler temizlendi, kurumsal estetik standart korundu.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/urunler", label: "Hasta Karyolası Modelleri Galerisi" },
        ],
      },
      {
        title: "Renkli Hap Rozetlerin ve Yapay Hareketli Noktaların Temizlenmesi",
        category: "Tasarım",
        details: [
          "Menülerde, sipariş takip haritasında, kategori şeridinde ve sayfa başlıklarında yer alan rengarenk pastel hap kutucukları ile yanıp sönen yapay yeşil/turkuaz noktalar tamamen kaldırıldı.",
          "Yerine İsviçre medikal grafik disiplinine uygun klinik arduvaz grisi, derin medikal lacivert ve net kurumsal rozet standartları uygulandı.",
          "Canlı sevkiyat aracı haritası ve sipariş takip ekranı gereksiz noktalı ızgara desenlerinden arındırılarak sade ve profesyonel bir görünüme kavuşturuldu.",
          "Ankara içi teslimat ve montaj şartları ile 81 ile ambarlı sevkiyat bilgileri tüm vitrin başlıklarında doğru ve şeffaf ifadelerle netleştirildi.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/siparis-takip", label: "Yenilenen Sipariş & Sevkiyat Takip Ekranı" },
          { href: "https://shop.mcaris.com.tr/hakkimizda", label: "Kurumsal Hakkımızda Sayfası" },
          { href: "https://shop.mcaris.com.tr/iletisim", label: "Canlı İletişim & Destek Merkezi" },
        ],
      },
      {
        title: "Platform Motoru Güncellemesi ve Bellek Verimliliği İyileştirmesi",
        category: "Altyapı",
        details: [
          "Mağazanın temel çalışma motoru en güncel ve kararlı sürüm olan Next.js 16.3.8 standardına yükseltildi.",
          "Veritabanı bağlantı yönetimi optimize edilerek sunucu belleğini gereksiz yere meşgul eden mükerrer bağlantı açılışları tamamen engellendi.",
          "Ürün arama kutucuğu, sipariş takip ekranı ve medya yükleme pencerelerinde sayfa geçişleri sırasında arka planda asılı kalan sorgu yükleri temizlenerek cihaz bellek tüketimi rahatlatıldı.",
          "Özellikle mobil cihazlarda ve uzun süreli mağaza ziyaretlerinde tarayıcı kasmaları ve aşırı RAM tüketimi kökten çözüldü.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr", label: "Performansı Artırılmış Mağaza Vitrini" },
          { href: "https://shop.mcaris.com.tr/urunler", label: "Hızlı Ürün Kataloğu" },
          { href: "https://shop.mcaris.com.tr/siparis-takip", label: "Optimize Edilmiş Sipariş Takip Ekranı" },
        ],
      },
      {
        title: "Ana Sayfa Vitrininde Kalabalık Sekmeler Yerine Zarif Noktalı Kaydırıcı (Dot Slider)",
        category: "Tasarım",
        details: [
          "Sağ vitrin kartının üstünde yer alan ve dar alan sebebiyle metinleri kesilen ('Evde Bakım Kary...', 'Veteriner Ekipma...' gibi) kalabalık sekme butonları tamamen kaldırıldı.",
          "Karyola modellerini ve ekipmanları vitrinde daha ferah ve odaklı sergilemek amacıyla, vitrin kartının altına minimalist ve interaktif bir noktalı kaydırıcı (dot slider) yerleştirildi.",
          "Ziyaretçiler artık ürünler arasında tek dokunuşla akıcı şekilde geçiş yapabiliyor; otomatik vitrin akışında hangi ürünün ekranda olduğu alt kısımdaki zarif göstergeden anlık takip edilebiliyor.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr", label: "Yenilenen Vitrin ve Noktalı Kaydırıcı" },
          { href: "https://shop.mcaris.com.tr/urunler", label: "Hasta Karyolası Modelleri Kataloğu" },
        ],
      },
    ],
  },
  {
    version: "v2.9.99",
    date: "1 Ekim 2026",
    summary:
      "Hasta karyolası kiralama & satış hibrit modeli, Ankara içi anahtar teslim montaj güvencesi ve zengin arama motoru görünürlüğü mağazaya kazandırıldı. Ankara genelinde yoğun organik arama trafiği çeken hasta karyolası kiralama hizmetimiz için depozitosuz kiralama prosedürü, hazır stoklu modellerde aynı gün kata montaj ve ödenen kiraları sıfır ürünün liste fiyatından düşerek satın almaya saydırma esnekliği devreye alındı. Ankara içi adrese teslimat, kata çıkarma ve odaya montaj hizmetinin yerel mobil servis araçlarımızla fiyata dahil sağlandığı, şehir dışı siparişlerde ise güvenli kargo sevkiyatı yapıldığı şeffaf şekilde açıklandı. Google aramalarında kategori sayfalarımızın soru-cevap kutucuklarıyla en üstte yer almasını sağlayan zengin sonuç altyapısı yayına alındı.",
    items: [
      {
        title: "2 Motorlu Elektrikli Hasta Karyolaları Kategorisi",
        category: "Yeni Özellik",
        details: [
          "Evde nekahet ve kısa-orta vadeli bakım gören hastalar için baş ve ayak ucu kablolu kumandayla bağımsız hareket eden pratik modellerin vitrini açıldı.",
          "Ankara genelinde aynı gün adrese teslimat, kata çıkarma ve odaya anahtar teslim montaj hizmeti tüm modellerde güvence altına alındı.",
          "Hastanın durumuna göre karyolaya tam uyumlu medikal şilte ve havalı yatak seçenekleri sunuldu.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/kategori/2-motorlu-hasta-yataklari", label: "2 Motorlu Karyolalar Sayfası" },
        ],
      },
      {
        title: "3 Motorlu Dikey Asansörlü Hasta Karyolaları Kategorisi",
        category: "Yeni Özellik",
        details: [
          "Hastanın baş ve ayak hareketlerine ilave olarak yatağı yerden dikey olarak bel hizasına yükseltebilen asansörlü modeller için özel tanıtım sayfası hazırlandı.",
          "Refakatçinin eğilmeden pansuman, yemek ve kişisel bakım yapabilmesini sağlayarak bakıcı bel ve omurga sağlığını koruyan modeller ön plana çıkarıldı.",
          "Teknik özellik karşılaştırma tablosu ve en sık sorulan sorular akordeon formatında sayfaya eklendi.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/kategori/asansorlu-3-motorlu-karyolalar", label: "3 Motorlu Asansörlü Karyolalar Sayfası" },
        ],
      },
      {
        title: "4 Motorlu Yoğun Bakım ve Trendelenburg Karyolaları Kategorisi",
        category: "Yeni Özellik",
        details: [
          "Hastanelerin yoğun bakım konforunu eve taşıyan, kan dolaşımını destekleyen Trendelenburg ve kardiyak koltuk pozisyonlu 4 motorlu modeller için vitrin açıldı.",
          "Fısıltı sessizliğinde çalışan güçlü kolon motorlar, bağımsız amortisörlü ABS korkuluklar ve acil durum mandalları tüm teknik detaylarıyla sergilendi.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/kategori/4-motorlu-yogun-bakim-karyolalari", label: "4 Motorlu Yoğun Bakım Karyolaları Sayfası" },
        ],
      },
      {
        title: "Ev Tipi Ahşap Mobilya Tasarımlı Hasta Karyolaları Kategorisi",
        category: "Yeni Özellik",
        details: [
          "Hastane ortamının soğuk görüntüsünü evden uzaklaştırmak isteyen aileler için tasarlanan ahşap ve deri detaylı şık hasta karyolalarına özel sayfa açıldı.",
          "Modern ev mobilyası estetiğini elektrikli karyola fonksiyonelliğiyle buluşturan ergonomik tasarımlar yayına alındı.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/kategori/ahsap-ev-tipi-hasta-karyolasi", label: "Ev Tipi Ahşap Karyolalar Sayfası" },
        ],
      },
      {
        title: "CE ve ISO 9001:2015 Fabrika Kalite Standartları ve Kurumsal Güvence",
        category: "Güvenlik",
        details: [
          "Tüm ürün sayfalarında ve kurumsal alanlarda üretici kalite onayları, CE uygunluğu, ISO 9001:2015 yönetim sistemi ve 2 yıl resmi yerinde servis garantisi açıkça sunuldu.",
          "Yetkili teknik servis ekibimiz ve 10 yıl yedek parça temin garantisiyle hasta yakınlarının satış sonrası endişeleri giderildi.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/hakkimizda", label: "Kurumsal Güvence & Kalite Belgelerimiz" },
          { href: "https://shop.mcaris.com.tr/urun/2-motorlu-ekonomik-hasta-karyolasi", label: "Ürün Sayfası Güvence Alanı" },
        ],
      },
      {
        title: "Kategori Sayfalarına Akıllı Sıkça Sorulan Sorular ve Zengin Arama Sonuçları",
        category: "İyileştirme",
        details: [
          "Kategori sayfalarında yer alan sıkça sorulan sorular arama motorlarının zengin sonuç formatına uygun hale getirilerek Google aramalarında doğrudan açılır-kapanır soru-cevap kutucuklarıyla öne çıkma kabiliyeti kazanıldı.",
          "Yönetim panelinden güncellenen veya yeni eklenen tüm kategori soruları anında arama motoruyla senkronize çalışacak dinamik yapıya kavuşturuldu.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/kategori/hasta-yataklari", label: "Kategori Sayfası SSS Alanı" },
        ],
      },
      {
        title: "Ankara Hasta Yatağı Kiralama ve Satın Alma Çözümleri Rehberi",
        category: "Yeni",
        details: [
          "Ameliyat sonrası ve geçici nekahat dönemleri için steril dezenfekte edilmiş aylık kiralama prosedürü ve depozitosuz şeffaf süreç rehberi yayına alındı.",
          "Ankara içi hazır stoklu modellerimizde aynı gün adrese teslimat ve odaya montaj garantisi sağlandı.",
          "Kiralama süresi uzayan hastalar için ödenen kira bedellerinin sıfır ürünün liste fiyatından mahsup edilerek doğrudan satın almaya saydırılması avantajı eklendi.",
          "Ankara genelinde kiralama araması yapan yoğun organik trafiğin hem aylık kiralama hem de 2 yıl yerinde garantili sıfır satın alma modellerimize kolayca ulaşması sağlandı.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/kiralama-proseduru", label: "Kiralama ve Satın Alma Rehberi" },
        ],
      },
      {
        title: "Pazaryeri Kargo Teslimatına Karşı Ankara İçi Odada Anahtar Teslim Montaj Karşılaştırması",
        category: "Yeni Özellik",
        details: [
          "Trendyol, Hepsiburada gibi genel pazaryerlerinin 100 kg'lık ağır medikal sandığı bina kapısına bırakıp montaj ve danışmanlık sunamaması açığına karşılık, MCARIS'in Ankara içi kata çıkarma, odada montaj ve refakatçiye kumanda eğitimi veren üstün hizmet modeli ürün sayfalarına ve ana sayfaya işlendi.",
          "Pazaryerlerinden veya internetten şehir dışına giden tüm siparişlerde montaj imkanımızın bulunmadığı, ürünlerin kargo/ambar ile kapıya teslim edildiği ve alıcı tarafından taşınıp kurulduğu şeffaf bir dille vurgulandı.",
          "Ankara'daki hasta yakınlarının kargo sandığını katlara çıkarma veya tek başına vidalama çilesi yaşamadan anahtar teslim hizmet alabileceği açık bir karşılaştırma tablosuyla gösterildi.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/urun/2-motorlu-ekonomik-hasta-karyolasi", label: "Ürün Sayfası Karşılaştırma Tablosu" },
          { href: "https://shop.mcaris.com.tr/", label: "Ana Sayfa Karşılaştırma Tablosu" },
        ],
      },
      {
        title: "Karyola Uyumu & Aksesuar Danışmanlığı ve Ankara İlçe Sayfaları Güçlendirmesi",
        category: "İyileştirme",
        details: [
          "Karşılaştırma ve ürün alanlarında karyolanın motor ve profil açılarına %100 uyumlu 4 parçalı medikal şilte, boru tipi havalı yatak ve serum askısı seçeneklerinin uzman danışmanlarımızca hastanın klinik ihtiyacına göre eşleştirildiği belirtildi.",
          "Pazaryerlerindeki rastgele ve uyumsuz sünger gönderimlerine karşı hastanın ihtiyacına göre orijinal medikal aksesuar desteği vurgulandı.",
          "Ankara'nın 25 ilçesine özel sayfalarda pazaryerlerinin kargo gecikmelerine karşı MCARIS'in aynı gün adrese teslim ve kata montaj üstünlüğü vurgulandı.",
        ],
        links: [
          { href: "/ankara-hasta-yatagi", label: "Ankara İlçe Hizmet Ağı" },
          { href: "/ankara-hasta-yatagi/cankaya", label: "Çankaya İlçe Sayfası" },
        ],
      },
    ],
  },
  {
    version: "v2.9.98",
    date: "1 Ekim 2026",
    summary:
      "Hasta yatakları ve evde bakım kategorilerinde mağaza görünürlüğünü ve doğrudan satın alma deneyimini en üst seviyeye taşıyan kapsamlı içerik ve katalog genişletmesi tamamlandı. 2, 3 ve 4 motorlu hasta karyolaları, asansörlü modeller, ahşap ev tipi karyolalar ve tam teşekküllü evde bakım setleri için detaylı teknik karşılaştırma tabloları, sıkça sorulan sorular ve şeffaf paket içerikleri yayına alındı. Ayrıca hasta yakınlarının en çok merak ettiği korkuluk güvenliği, motor güçleri ve acil durum sistemlerini açıklayan uzman teknik rehberler blog bölümüne kazandırıldı.",
    items: [
      {
        title: "Hasta Yatakları ve Evde Bakım Setleri İçin Kapsamlı Kategori Rehberleri",
        category: "Yeni Özellik",
        details: [
          "2 motorlu, 3 motorlu asansörlü, 4 motorlu yoğun bakım, ahşap ev tipi karyolalar ve tam evde bakım setleri için zengin içerikli rehber sayfaları, teknik özellik karşılaştırma tabloları ve sıkça sorulan sorular bölümleri mağazamıza eklendi.",
          "Tüm karyola kategorilerinde Ankara içine aynı gün adrese teslimat ve odaya montaj hizmetinin sağlandığı; şilte ve aksesuarların hastanın klinik ihtiyacına göre opsiyonel sunulduğu şeffafça vurgulandı.",
          "Hasta yakınlarının hastalarının sağlık durumuna göre en doğru karyolayı (baş-ayak hareketli, bakıcı belini koruyan dikey asansörlü veya kardiyak koltuk pozisyonlu yoğun bakım modelleri) kolayca seçebilmesi sağlandı.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/kategori/hasta-yataklari", label: "Hasta Yatakları Kategorisi" },
        ],
      },
      {
        title: "Hasta Güvenliği ve Donanım Tercihleri İçin Uzman Teknik Blog Rehberleri",
        category: "Yeni",
        details: [
          "ABS amortisörlü korkuluklar ile metal tabanca korkuluklar arasındaki güvenlik ve uzuv sıkışmasını önleyen standart farklarını açıklayan kapsamlı bir rehber yayına alındı.",
          "Hasta karyolalarında kullanılan fısıltı sessizliğindeki güçlü lineer motorların ve Linak/T-Motion aktüatörlerin dayanıklılık avantajlarını anlatan teknik makale eklendi.",
          "Elektrik kesintilerinde hastanın yataktan güvenle indirilebilmesini sağlayan 9V acil durum pil desteği ve acil kalp masajı müdahalelerinde hayati önem taşıyan CPR mandalının önemini anlatan uzman rehber hazırlandı.",
        ],
        links: [
          { href: "https://shop.mcaris.com.tr/blog", label: "Medikal Blog ve Rehberler" },
        ],
      },
    ],
  },
  {
    version: "v2.9.97",
    date: "1 Ekim 2026",
    summary:
      "Mağaza genelinde müşteri deneyimini, sipariş güvenliğini ve katalog kalitesini artıran kapsamlı bir bakım ve optimizasyon paketi tamamlandı. Mobil cihazlarda canlı destek penceresinin sipariş butonunu engellemesi önlendi, Ankara ve ilçe sayfalarındaki fiyat ve montaj taahhütleri güncellendi, ödeme bildirimlerinin güvenilirliği pekiştirildi ve ürün değerlendirmelerinin anında vitrine yansıması sağlandı.",
    items: [
      {
        title: "Mobil Alışveriş Kolaylığı ve Canlı Destek İyileştirmesi",
        category: "İyileştirme",
        details: [
          "Akıllı telefonlardan ürün detaylarını inceleyen müşterilerimizin hızlıca sepete ürün eklemesini veya doğrudan WhatsApp üzerinden danışmasını engelleyen ekran çakışması giderildi.",
          "Canlı destek danışma penceresini kapatan ziyaretçilere aynı oturumda tekrar tekrar otomatik açılıp rahatsızlık vermesi engellendi; müşteri dilediği an butona dokunarak danışmanlarımıza ulaşabilir hale getirildi.",
          "Yönetim paneli ve sevkiyat ekranlarında müşteri danışma butonları gizlenerek mağaza çalışanlarına ferah bir çalışma alanı sağlandı.",
        ],
      },
      {
        title: "Ankara ve İlçe Tanıtım Sayfalarında Fiyat ve Hizmet Bütünlüğü",
        category: "İyileştirme",
        details: [
          "Ankara merkez ve ilçe sayfalarındaki tüm hizmet kartları güncellenerek, kiralama yerine doğrudan fabrikadan 2 yıl garantili sıfır ürün temini, aynı gün teslimat ve adrese kata ücretsiz kurulum güvencesi netleştirildi.",
          "2026 güncel hasta yatağı fiyat matrisine giriş seviyesi 2 motorlu modeller dahil edildi; hasta yakınlarının bütçelerine uygun çözümü şeffafça karşılaştırması sağlandı.",
          "İlçe sayfalarındaki ürün listeleri mağaza genelindeki kurumsal ürün kartı standardına kavuşturularak ürün bilgileri ve görselleri kusursuz hale getirildi.",
        ],
      },
      {
        title: "Ödeme Güvenliği ve Müşteri Değerlendirmeleri Akışı",
        category: "Güvenlik",
        details: [
          "Ödeme altyapısında geç veya mükerrer gelen bildirimlerin, başarıyla tahsil edilmiş siparişlerin durumunu hatalı olarak değiştirmesini engelleyen tam koruma sağlandı.",
          "Mağazamızdan sipariş vermiş doğrulanmış müşterilerimizin ürün sayfalarına yazdığı memnuniyet ve ürün yorumlarının gecikmeksizin vitrinde yayınlanması ve güncel puanların anında güncellenmesi sağlandı.",
          "Medikal kozmetik, hekim tabureleri ve hasta yemek masaları gibi tüm mağaza kategorilerinin arama motorlarındaki başlık ve tanıtım metinleri tamamlanarak ürünlerin Google'da daha kolay bulunması sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.96",
    date: "28 Eylül 2026",
    summary:
      "Mağaza genelinde hasta sağlığı ve hijyen ilkelerimiz doğrultusunda 'kiralama' ifadeleri tamamen kaldırılarak; arama motorlarında en çok aranan 'Hasta Yatağı Fiyatları', 'Ev Tipi Ahşap Karyolalar', '2 ve 3 Motorlu Modeller' ve doğrudan sıfır satış avantajlarına odaklanan kapsamlı bir optimizasyon tamamlandı. Kiralık yatak arayan ziyaretçileri hijyen riskleri ve maliyet avantajları konusunda aydınlatıp sıfır ürün satışına yönlendiren karşılaştırma rehberi yayına alındı.",
    items: [
      {
        title: "Kiralama İfadelerinin Temizlenmesi ve Popüler Arama Terimleri Odaklı SEO",
        category: "İyileştirme",
        details: [
          "Üst menü, mobil gezinme, kategori çubukları ve alt bilgi (footer) alanlarındaki kiralama yönlendirmeleri kaldırılarak yerlerine en popüler hasta karyolası arama terimleri ('Hasta Yatağı Fiyatları', 'Ankara Hasta Yatağı Satışı', 'Ev Tipi Ahşap Karyolalar') yerleştirildi.",
          "Tanıtım afişlerindeki kiralama panosu, ev ortamına tam uyumlu ve yüksek talep gören ahşap hasta karyolalarını öne çıkaracak şekilde yenilendi.",
          "Ankara'nın 25 ilçesine özel hazırlanan yerel arama sayfalarındaki kiralama vaatleri temizlenerek doğrudan fabrikadan 2 yıl garantili sıfır ürün temini, aynı gün teslimat ve ücretsiz montaj vurgusu güçlendirildi.",
        ],
      },
      {
        title: "Kiralama vs Sıfır Satın Alma Bilgilendirme ve Satış Rehberi",
        category: "Yeni Özellik",
        details: [
          "Arama motorlarından hasta yatağı kiralama aramasıyla gelen ziyaretçilere; kiralık yataklardaki enfeksiyon risklerini ve 2-3 aylık kira bedeline sıfır garantili bir yatak sahibi olmanın ekonomik avantajlarını anlatan şeffaf bir karşılaştırma sayfası sunuldu.",
          "Sıkça sorulan sorular, arama motoru veri şemaları ve mağaza içi arama kutusu doğrudan sıfır hasta yatağı avantajlarını anlatacak şekilde optimize edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.95",
    date: "28 Eylül 2026",
    summary:
      "Ana sayfa ürün vitrinleri ve müşteri değerlendirmeleri bölüm başlıkları; mağaza kataloğundaki motorlu hasta yatakları ve medikal ekipman çeşitliliğini daha net yansıtacak, ziyaretçilerin aradıkları hasta karyolası ve popüler bakım ürünlerine doğrudan odaklanmasını sağlayacak şekilde güncellendi.",
    items: [
      {
        title: "Ana Vitrin ve Müşteri Değerlendirmeleri Başlık Düzenlemeleri",
        category: "İyileştirme",
        details: [
          "Öne çıkan ürünler vitrini 'Çok Tercih Edilen Hasta Yatağı Modelleri' başlığıyla güncellenerek ziyaretçilerin en popüler hasta yataklarına odaklanması kolaylaştırıldı.",
          "Yeni eklenen ürünler bölümü 'Motorlu Hasta Yatakları & Diğer Ürünler' olarak adlandırılarak mağazamızın hem motorlu karyola hem de tamamlayıcı medikal ekipman zenginliği öne çıkarıldı.",
          "Haftanın çok satanları vitrini 'Hasta Karyolası Modelleri & Popüler Ürünler' başlığına kavuşturularak en çok rağbet gören medikal çözümler belirginleştirildi.",
          "Müşteri ve kurum deneyimleri alanı 'MCaris Hasta Karyolası Modelleri Gelen Yorumlar' başlığıyla kurumsal marka kimliğimizle bütünleştirilerek güven ve şeffaflık pekiştirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.94",
    date: "26 Eylül 2026",
    summary:
      "Arama motorlarının 'sayfa üzerindeki bağlantı metinleri benzersiz ve açıklayıcı olmalıdır' kalite kuralı doğrultusunda, ana sayfadaki tüm gezinme butonları, iletişim yönlendirmeleri ve ürün vitrinleri baştan sona ayrıştırıldı. Ziyaretçilere ve arama motorlarına aynı modellerin mükerrer sunulması engellenerek mağaza vitrininde 16 farklı hasta yatağı ve bakım ekipmanının zengin bir çeşitlilikle sergilenmesi sağlandı.",
    items: [
      {
        title: "Benzersiz Yönlendirme Metinleri ve İletişim Açıklığı",
        category: "İyileştirme",
        details: [
          "WhatsApp sipariş, uzman danışma hattı ve telefonla arama yönlendirmeleri bulundukları bölüme göre (sipariş verme, ürün hakkında danışma, Ankara içi teslimat bilgisi alma) özelleştirilerek arama motorlarının her bağlantının amacını net olarak kavraması sağlandı.",
          "Tanıtım kartlarındaki genel butonlar doğrudan ilgili kategoriyi işaret eden kurumsal ifadelere ('Kiralama Prosedürünü İncele', 'Yemek Masalarını İncele' vb.) dönüştürüldü.",
          "Masaüstü ve mobil gezinme menülerindeki favoriler ve hesap bağlantıları birbirinden bağımsız açıklayıcı metinlerle ayrıştırıldı.",
        ],
      },
      {
        title: "Zengin ve Çeşitlendirilmiş Ürün Vitrini Mimarisi",
        category: "İyileştirme",
        details: [
          "Yeni gelenler ve haftanın çok satanları bölümleri, öne çıkan hasta karyolalarıyla çakışmayacak akıllı bir filtreleme sistemine bağlandı. Böylece aynı karyola modelinin sayfada art arda tekrarlanması önlendi.",
          "Mağaza ziyaretçileri tek bir sayfada 16 farklı hasta yatağı ve medikal ekipmanı inceleme fırsatına kavuşurken, her ürün kartının bağlantısı arama motorları nezdinde %100 benzersiz ve temiz bir yapıya kavuşturuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.93",
    date: "26 Eylül 2026",
    summary:
      "Arama motorlarının 'sayfadaki başlık sayısı metin miktarıyla orantılı olmalıdır' kalite kuralı doğrultusunda, ana sayfa başlık hiyerarşisi sadeleştirilerek altın orana kavuşturuldu. Promosyon kartları, blog özetleri ve alt bilgi alanındaki yapısal olmayan başlıklar semantik düzenlemeyle dengelendi; ana bölümlerin ve rehber konularının arama motorlarındaki ağırlığı en üst düzeye çıkarıldı.",
    items: [
      {
        title: "Ana Sayfa Başlık - Metin Orantısı ve Hiyerarşi Optimizasyonu",
        category: "İyileştirme",
        details: [
          "Ana sayfadaki toplam başlık sayısı 30'dan 15'e indirilerek metin yoğunluğuyla tam orantılı, her başlığın altında ortalama 200 kelimelik zengin içerik sunan ideal bir arama motoru mimarisi oluşturuldu.",
          "Alt bilgi (footer) alanındaki menü başlıkları ve destek panosu, sayfa gövdesinin başlık hiyerarşisini kirletmeyecek şekilde standart semantik metin formatına uyarlandı.",
          "Tanıtım kartları ve blog vitrinindeki kart içi başlıklar sadeleştirilerek ana sayfa H1 ve H2 başlıklarının indeksleme gücü ve otoritesi artırıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.92",
    date: "26 Eylül 2026",
    summary:
      "Arama motorlarının görsel indeksleme ve sayfa içeriği analizinde tam puan alabilmesi için müşteri değerlendirmeleri ve kullanıcı avatarları dahil mağaza genelindeki tüm görsellere semantik, açıklayıcı alternatif metin (alt attribute) tanımlamaları yapıldı.",
    items: [
      {
        title: "Görsel Erişilebilirliği & Arama Motoru İndeksleme Güçlendirmesi",
        category: "İyileştirme",
        details: [
          "Google Haritalar üzerinden mağazamıza yorum bırakan hasta ve hasta yakınlarının profil avatarlarına arama motorlarının içeriği ve müşteri memnuniyetini eksiksiz analiz edebileceği açıklayıcı metin etiketleri kazandırıldı.",
          "Mağaza genelinde alt etiketi bulunmayan hiçbir görsel kalmayacak şekilde denetim tamamlanarak arama motoru görsel optimizasyon puanı en üst seviyeye taşındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.91",
    date: "26 Eylül 2026",
    summary:
      "Arama motoru denetim ve kalite standartları doğrultusunda mağaza içi bağlantı yapısı, başlık hiyerarşisi ve gezinme erişilebilirliği baştan sona optimize edildi. Arama robotlarının ana sayfamızı ve ürünlerimizi daha net okuması, mağaza içi bağlantıların müşteriye ve arama motorlarına daha net ve açıklayıcı bilgi sunması sağlandı.",
    items: [
      {
        title: "Mağaza İçi Bağlantı ve Gezinme Açıklık İyileştirmesi",
        category: "İyileştirme",
        details: [
          "Tüm ürün ve vitrin kartlarındaki bağlantı metinleri optimize edildi. 'Tümünü Gör' gibi genel ve belirsiz butonlar yerine 'Tüm Yeni Modelleri Gör', 'Tüm Popüler Modelleri Gör' ve ilgili rehberin konusunu belirten açıklayıcı bağlantılar tanımlandı.",
          "Müşteri yorumlarında ve ürün kartlarında gereksiz uzun link yapıları sadeleştirilerek doğrudan ilgili modelin adına odaklanan yalın ve arama motoru dostu yönlendirmeler oluşturuldu.",
          "Mağaza logosu, sosyal medya butonları ve güvenlik sertifikası gibi görsel bağlantılara arama motoru ve görme engelli okuyucularının tanıyabileceği kurumsal açıklayıcı etiketler tanımlandı.",
        ],
      },
      {
        title: "Ana Sayfa Başlık Düzeni ve İçerik Dengelemesi",
        category: "İyileştirme",
        details: [
          "Ana sayfa üzerinde yer alan bölüm başlıkları, öne çıkan modeller ve kurumsal tanıtımlar arama motoru standartlarındaki doğru oran ve hiyerarşiye kavuşturuldu. Yinelenen ürün kartı başlıkları giderilerek ana sayfadaki ana başlıkların ağırlığı ve gücü artırıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.90",
    date: "26 Eylül 2026",
    summary:
      "Mağaza ana sayfamızın arama motoru denetimlerinde tespit edilen başlık yapısı, açılış hızı ve içerik indeksleme eksiklikleri kökten giderildi. Google ve harici denetim botlarının mağaza ana sayfasındaki tüm ürünleri, 3.000'i aşkın zengin rehber kelimesini ve ana başlığı ilk anda eksiksiz okuması sağlanarak arama motorlarındaki görünürlük ve sıralama performansı en üst seviyeye çıkarıldı.",
    items: [
      {
        title: "Ana Sayfa Arama Motoru İndeksleme ve Başlık Yapısı İyileştirmesi",
        category: "Düzeltme",
        details: [
          "Arama motoru robotlarının ve web denetim araçlarının ana sayfa açılışında ana başlığı ve ürün bölümlerini gecikmeli okumasına neden olan yükleme yapısı tamamen revize edildi; tüm ürün modellerimiz, hasta yatağı başlıklarımız ve 3.000'i aşkın zengin SEO içeriğimiz arama motorlarına ilk anda eksiksiz sunulur hale getirildi.",
          "Arama motorlarının en çok önem verdiği ana sayfa başlık hiyerarşisi (H1, H2, H3) ve bölümler arası geçiş düzeni kusursuzlaştırıldı.",
        ],
      },
      {
        title: "Arama Sonuçları Başlık (Title) & Açıklama Optimizasyonu",
        category: "İyileştirme",
        details: [
          "Google arama sonuçlarında mağaza başlığımızın cep telefonlarında ve masaüstü aramalarda kesintiye uğramadan (üç nokta ile bölünmeden) tam görünmesi için ana sayfa başlığı ve tanıtım metni uluslararası 50-60 karakter standardına uyarlandı.",
        ],
      },
      {
        title: "Ana Sayfa Açılış Hızı ve Bellek Önbellekleme Güçlendirmesi",
        category: "İyileştirme",
        details: [
          "Ana sayfa için yüksek hızlı akıllı önbellekleme devreye alındı. Sayfa açılış tepki süresi 0.05 saniyenin altına indirilerek ziyaretçilere ve arama motoru botlarına ışık hızında bir mağaza deneyimi sunuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.89",
    date: "25 Eylül 2026",
    summary:
      "Google arama motorunda pazar yerlerinin ve fiyat karşılaştırma sitelerinin üst sıralarında yer alabilmek için 'Hasta Karyolası Fiyatları 2026' vitrini, zengin fiyat aralığı etiketleri ve akıllı arama yönlendirmeleri devreye alındı. Google Alışveriş kataloğumuz yerel ticari standartlara tam uyumlu hale getirildi.",
    items: [
      {
        title: "Google Arama Sonuçlarında Zengin Fiyat ve Model Vitrini",
        category: "Yeni Özellik",
        details: [
          "Google arama sonuçlarında Akakçe gibi platformlarda görülen kategori fiyat aralıkları (en düşük - en yüksek fiyat), stok mevcudiyeti ve motor seçenekleri doğrudan Google sonuçlarında gösterilecek şekilde mağaza altyapısına kazandırıldı.",
          "Müşterilerin Google'da en çok arattığı 'hasta karyolası fiyatları', 'ev tipi ahşap karyola', 'kumandalı modeller' ve '4 motorlu yoğun bakım yatakları' gibi yüksek ticari değere sahip ifadeler kategori vitrin başlıklarımıza ve tanıtım açıklamalarımıza entegre edildi.",
        ],
      },
      {
        title: "Kullanıcı Arama Niyeti & Akıllı Kategori Yönlendirmesi",
        category: "İyileştirme",
        details: [
          "Mağaza içi aramada ve arama motorlarında '4 motorlu', '3 motorlu', 'ev tipi' veya 'kumandalı' araması yapan hasta ve hasta yakınları, doğrudan en doğru modellerin bulunduğu özel kategori sayfalarına yönlendirilerek aradıkları ürüne saniyeler içinde ulaşmaları sağlandı.",
          "İkinci el arayışında olan vatandaşlarımız için riskli ve hijyenik olmayan kullanılmış ürünler yerine doğrudan üreticiden 2 yıl garantili ve sıfır ekonomik modellerin öne çıkarılması sağlandı.",
        ],
      },
      {
        title: "Google Alışveriş & Merchant Center Yerelleştirmesi",
        category: "İyileştirme",
        details: [
          "Google Merchant Center üzerinden Google Alışveriş vitrinine aktarılan ürün kataloğumuzdaki teknik özellikler, teslimat hizmetleri ve ürün açıklamaları eksiksiz Türkçe kurumsal standartlara kavuşturuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.88",
    date: "25 Eylül 2026",
    summary:
      "Blog ve Medikal Bilgi Bankası tamamen yönetim panelinden yönetilebilir dinamik sisteme taşındı; 116 makalenin tamamı kurumsal dürüstlük ve teslimat standartlarımıza göre yenilendi. Arama motorları için ürün görsel haritaları, Google Merchant mağaza kataloğu ve zengin arama etiketleri eksiksiz doğrulanarak Google standartlarında en üst seviyeye taşındı.",
    items: [
      {
        title: "Dinamik Bilgi Bankası & Yönetim Paneli Entegrasyonu",
        category: "Yeni Özellik",
        details: [
          "Daha önce kod içerisine gömülü olan medikal rehberler ve hasta bakım makaleleri tamamen merkezi veritabanına aktarıldı; mağaza yöneticilerinin tek tıkla panelden yeni makale ekleyebilmesi, mevcut içerikleri düzenleyebilmesi ve yayınlayabilmesi sağlandı.",
          "Veritabanındaki 116 uzman makalenin tamamı taranarak SGK anlaşması bulunmadığı ve doğrudan üreticiden satış yapıldığı şeffaflıkla belirtildi; müşteriyi yanıltabilecek saatli teslimat ifadeleri temizlendi.",
        ],
      },
      {
        title: "Arama Motoru (SEO) ve Google Görsel Haritaları Güçlendirmesi",
        category: "İyileştirme",
        details: [
          "Google Arama Motoru için özel ürün görsel haritası devreye alındı; böylece medikal ürünlerimizin yüksek çözünürlüklü tüm fotoğrafları Google Görsellerde anında dizine eklenir hale getirildi.",
          "Google Alışveriş ve Merchant Center ürün besleme akışı kusursuzlaştırıldı; ürünlerimizin stok, fiyat ve teslimat detayları Google arama vitrininde eksiksiz sergilenecek şekilde yapılandırıldı.",
          "Tüm mağaza sayfalarının başlık hiyerarşisi, arama motoru açıklamaları ve sosyal medya kartları tek tek incelenerek arama motoru uyumluluğu tam güvenceye alındı.",
        ],
      },
      {
        title: "Kullanıcı Gizliliği & Güvenli Arama İzolasyonu",
        category: "Güvenlik",
        details: [
          "Müşteri sepetleri, üyelik profilleri ve şifre işlemleri gibi kişisel verilerin arama motorları tarafından dizine eklenmesi tamamen engellenerek müşteri gizliliği en üst seviyeye çıkarıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.87",
    date: "25 Eylül 2026",
    summary:
      "Mağaza genelinde kurumsal şeffaflık ve iletişim standartları tam uyumlu hale getirildi: SGK ile anlaşmamızın bulunmadığı, bürokrasi ve evrak bekleme yerine doğrudan üreticiden birinci elden sıfır satış yapıldığı müşteri bilgilendirme alanlarında netleştirildi. Teslimat taahhütleri operasyonel gerçeklerle uyumlu olarak 'Aynı Gün / Gün İçinde Teslimat' standardına kavuşturuldu. Arama motoru haritası ve sayfa yükleme performansı güçlendirildi.",
    items: [
      {
        title: "Doğrudan Üretici Satışı & Şeffaf Fatura Standartları",
        category: "İyileştirme",
        details: [
          "Mağazamızın SGK ile bir anlaşmasının bulunmadığı; haftalar süren reçete ve geri ödeme bürokrasisi yerine hastalarımıza doğrudan fabrikadan sıfır ürün temin ettiğimiz gerçeği Sıkça Sorulan Sorular, blog rehberleri ve tanıtım sayfalarında açık ve net bir dille ifade edildi.",
          "Müşterilerimizin kurumsal fatura, şirket gideri ve özel sigorta belgeleri için resmi e-fatura desteği ile havale/EFT işlemlerine özel anında indirim avantajları belirginleştirildi.",
        ],
      },
      {
        title: "Operasyonel Teslimat Standartları & Net Bilgilendirme",
        category: "Düzeltme",
        details: [
          "Trafik ve teknik montaj değişkenlikleri sebebiyle risk oluşturan saatli teslimat ifadeleri kaldırıldı; tüm sipariş ve takip ekranlarında standart olarak 'Aynı Gün / Gün İçinde Teslimat ve Kata Montaj' taahhüdümüz esas alındı.",
          "Mobil sipariş takibi ve bilgilendirme ekranlarındaki durum bildirimleri güncellendi.",
        ],
      },
      {
        title: "Arama Motoru & Sistem İstikrarı Güçlendirmesi",
        category: "Altyapı",
        details: [
          "Google ve arama motorları için site haritası kesintisiz çalışacak şekilde güçlendirildi; yoğun anlarda dahi ürün ve kategori listeleri daima eksiksiz taranabilir kılındı.",
          "Mobil filtreleme panellerinin açılış tepkiselliği artırıldı, harici bağlantı güvenlik standartları tamamlandı ve uygulama genelinde veri tekrarları giderildi.",
        ],
      },
      {
        title: "Blog ve Rehberlerin Tamamen Yönetim Paneline Aktarılması & Şeffaf İçerik Düzeni",
        category: "Altyapı",
        details: [
          "Mağazamızın bilgi bankasındaki 116 uzman medikal rehberin tamamı veritabanına taşındı ve yönetim paneli üzerinden anında güncellenebilir, düzenlenebilir dinamik yapıya kavuşturuldu.",
          "Rehberlerin içerisindeki eski bürokrasi/SGK vaatleri ve saatli teslimat ifadeleri temizlendi; doğrudan fabrikadan satış ilkemiz tüm makalelere yansıtıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.86",
    date: "21 Eylül 2026",
    summary:
      "Mağazaya Tawk.to canlı sohbet penceresi eklendi; ziyaretçiler sayfa altından anında uzman desteğine yazabiliyor.",
    items: [
      {
        title: "Tawk.to Canlı Sohbet Entegrasyonu",
        category: "Yeni",
        details: [
          "Tüm mağaza sayfalarına Tawk.to canlı destek sohbeti eklendi.",
          "Ziyaretçiler ürün, kiralama ve teslimat sorularını sayfadan ayrılmadan yazılı olarak iletebiliyor.",
        ],
      },
    ],
  },
  {
    version: "v2.9.85",
    date: "21 Eylül 2026",
    summary:
      "Google arama motorunda Ankara bölgesinde hasta yatağı arayan hasta yakınlarını doğrudan doğru ürüne, şeffaf fiyatlara ve hızlı siparişe yönlendiren kapsamlı 'Ankara Hasta Yatağı Modelleri ve Elektrikli Sistemler: Gersan Showroom, 2026 Fiyatları ve Aynı Gün Kurulum Rehberi' başyapıt olarak yayına alındı. 5.300 kelimelik bu dev rehber; 2, 3 ve 4 motorlu elektrikli karyolaların net fiyatlarını ve doğrudan satın alma bağlantılarını sunmakta, kiralama ile sıfır satın almanın 6 aylık finansal tablosunu karşılaştırmakta, yatak yaralarını önleyen havalı yatak teknolojilerini açıklamakta ve Ankara'nın 25 ilçesine kendi teknik araçlarımızla sunulan aynı gün ücretsiz teslimat, kata montaj ve kullanıcı eğitimi ayrıcalıklarını sergilemektedir. Ayrıca Yenimahalle Gersan Sanayi Sitesi showroom'umuzun canlı deneme imkanı ve doğrudan iletişim hatları ön plana çıkarılarak ziyaretçilerin güvenle sipariş vermesi sağlandı.",
    items: [
      {
        title: "Ankara Hasta Yatağı Satın Alma ve Gersan Showroom Başyapıt Rehberi Yayında",
        category: "Yeni Özellik",
        details: [
          "2 motorlu, 3 motorlu ve 4 motorlu elektrikli hasta karyolalarımızın güncel 2026 liste fiyatları, öne çıkan fonksiyonları ve doğrudan tek tıkla sepete ekleme bağlantıları rehber içerisine entegre edildi.",
          "Yenimahalle Batı Sitesi Mahallesi Gersan Sanayi Sitesi Elektro Tek 62 adresindeki geniş showroom'umuzda motor sesini, kumandayı ve havalı yatakları canlı deneyimleme imkanı harita tarifleriyle ziyaretçilere sunuldu.",
          "Ankara'nın merkez ve çevre tüm 25 ilçesine (Yenimahalle, Çankaya, Keçiören, Etimesgut, Mamak, Sincan, Gölbaşı, Polatlı, Kahramankazan vb.) kendi servis araçlarımızla aynı gün hızlı teslimat ve kata çıkarma standartları belgelendi.",
          "Haftalarca süren resmi kurum bekleme süreleri ve bürokrasiye gerek kalmadan, doğrudan birinci elden sıfır ambalajında ve garantili hasta yatağı temin etmenin avantajları açıklandı.",
        ],
      },
      {
        title: "Şeffaf Fiyatlandırma, Doğrudan Satın Alma ve Tüketici Güven Standartları",
        category: "İyileştirme",
        details: [
          "Ziyaretçiyi 'fiyat için arayın' belirsizliğinden kurtararak tüm modellerde KDV ve Ankara içi kurulum dahil şeffaf fiyat sunuldu; 12 taksit ve kapıda ödeme kolaylıkları vurgulandı.",
          "Kiralık ikinci el yataklardaki bulaşıcı hastalık ve gizli maliyet tuzakları açıklanarak sıfır yatak satın almanın aile bütçesine ve hasta sağlığına sağladığı uzun vadeli tasarruf rakamlarla kanıtlandı.",
          "Yatak yarası (dekübitis) riski taşıyan hastalar için boru tipi ventilasyonlu havalı yatakların ve yatak üstü amortisörlü yemek masalarının önemi klinik gerekçeleriyle açıklandı.",
        ],
      },
      {
        title: "Gersan Showroom ve MCARIS Kurumsal Logosuyla Donatılmış Özgün Kapak Görseli",
        category: "Tasarım & Medya",
        details: [
          "Yeni rehberimiz için Yenimahalle Gersan Sanayi Sitesi showroom'umuzu, elektrikli hasta karyolamızı ve resmi MCARIS amblemini yüksek çözünürlükte yansıtan prestijli bir kapak görseli hazırlanarak sisteme dahil edildi.",
          "Canlı rehber arşivimiz toplam 117 kapsamlı uzman içeriğine ulaşarak Ankara ve Türkiye genelinde lider e-ticaret danışma merkezi konumunu pekiştirdi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.84",
    date: "21 Eylül 2026",
    summary:
      "Aşırı kilolu hastalar için 250-400 kg taşıma kapasiteli bariatrik karyola şasi standartları, felçli ve yatalak hastalarda cilt maserasyonunu önleyen yatak içi hijyen ve banyo uygulamaları, hasta karyolası kiralama ile satın alma arasındaki 1, 3, 6 ve 12 aylık finansal maliyet ve enfeksiyon güvenliği kıyaslaması, ameliyat sonrası nekahet döneminde dikiş koruması, derin ven trombozu önleme ve erken mobilizasyon protokolleri ile elektrik kesintilerinde hayat kurtaran 9V acil durum pili, hidrolik frenli mekanik CPR ve yangın tahliye adımlarını kapsayan 5 yeni derinlemesine uzman rehberi yayına alındı. Her biri 3.000 kelimeyi aşan, kapsamlı teknik karşılaştırma tabloları, 12 maddelik denetim listeleri, 8 tehlikeli tüketici tuzağı ve 18 detaylı soru-cevap alanı içeren bu içeriklerle mağazamızın canlı uzman rehber kütüphanesi 116 makaleye ulaştı. Tüm yeni makale görsellerinde MCARIS kurumsal marka logosu ve amblemi stüdyo kalitesinde işlenerek mağazamızın kurumsal kimliği ve güvenilirliği en üst seviyeye taşındı.",
    items: [
      {
        title: "Bariatrik Karyolalar, Yatak İçi Banyo, Kiralama vs Satın Alma, Ameliyat Sonrası Bakım ve Acil Durum Güvenlik Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Bariatrik Ağır Hasta Karyolası Seçimi ve Güçlendirilmiş Şasi Standartları': 250-400 kg taşıma kapasitesi, 2.5 mm güçlendirilmiş çelik karkas, 100-120 cm genişletilmiş bariatrik platform ve 8000 Newton çift motor itiş teknolojisiyle ağır kilolu hastaların güvenliği ve refakatçi ergonomisi güvenceye alındı.",
          "'Felçli ve Yatalak Hastalarda Yatak İçi Hijyen ve Banyo Uygulamaları': Şişirilebilir yatak içi banyo küvetleri, saç yıkama havuzları, durulamasız antibakteriyel medikal lifler, cilt maserasyonunu önleme teknikleri ve yatak içi pratik çarşaf değiştirme yöntemleri tüm ayrıntılarıyla açıklandı.",
          "'Hasta Karyolası Kiralama mı Satın Alma mı?': 1, 3, 6 ve 12 aylık toplam maliyet projeksiyonu, kiralık yataklardaki tehlikeli dirençli hastane bakterisi riskleri, 3. aydan sonra kiralama yapmanın aile bütçesine getirdiği ağır kayıplar ve sıfır karyolanın ikinci el geri satım değeri matematiksel olarak ortaya konuldu.",
          "'Ameliyat Sonrası Evde Nekahet Döneminde Hasta Karyolası Kullanımı': Ortopedik protez, batın cerrahisi ve açık kalp ameliyatı sonrası dikişleri koruyan oturma açıları, derin ven trombozunu engelleyen ayak kaldırma hareketleri, cerrahi dren yönetimi ve yataktan güvenle ayağa kalkış adımları incelendi.",
          "'Hasta Karyolasında Elektrik Kesintisi ve Acil Durum Güvenlik Protokolleri': Kontrol kutusundaki 9V pil ile acil indirme desteği, kalp durması anında tek mandalla yatağı düzelten hidrolik frenli mekanik CPR kolu, voltaj dalgalanmalarına karşı anahtarlamalı güç devreleri ve yangın tahliye adımları açıklandı.",
        ],
      },
      {
        title: "Tüketiciyi Yanıltıcı Kiralama Tuzaklarına ve Acil Durum Risklerine Karşı Koruma",
        category: "İyileştirme",
        details: [
          "Kiralık yataklarda uygulanan gizli çift yön nakliye masrafları, başkasının kullandığı mikrop yuvası şilteler, teminat senedi tehlikesi ve kalitesiz motorların yarattığı arızalar gibi 8 büyük tüketici tuzağı aydınlatılarak ailelerin bilinçli karar vermesi sağlandı.",
          "MCARIS kurumsal marka güvencesiyle doğrudan birinci elden satış, 2 yıl tam garanti, 10 yıl kesintisiz parça güvencesi ve 81 ilimize ahşap sandıklı sigortalı lojistik standartları tüm rehberlerimizde belgelendi.",
        ],
      },
      {
        title: "MCARIS Kurumsal Logosu ve Amblemiyle Birebir Donatılmış Özgün Görsel Standartları",
        category: "Tasarım & Medya",
        details: [
          "Tüm rehber kapaklarında ve ürün görsellerinde doğrudan MCARIS tescilli amblemi ve logosu kullanılarak, yabancı markaların veya sahte yazıların yer almadığı, hastane showroom ve modern ev bakım kalitesini yansıtan 5 yeni yüksek çözünürlüklü özgün görsel devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.83",
    date: "21 Eylül 2026",
    summary:
      "Hasta karyolası fiyatlarını belirleyen motor gücü, çelik profil kalınlığı ve donanım kalitesi parametreleri, motorlu yatakların günlük kullanımı, temizliği ve periyodik mekanik bakım disiplini, sarsıntısız pozisyonlandırma sağlayan gazlı amortisör ve hidrolik güvenlik sistemleri, bası yaralarını önleyen CNC kesimli medikal sünger şilte ve boru tipi havalı yatak entegrasyonu ile 81 ilimize hasarsız sevkiyat sağlayan 5 katmanlı ahşap sandıklı güvenli lojistik ve görüntülü canlı kurulum standartlarını kapsayan 5 yeni derinlemesine uzman rehberi yayına alındı. Her biri 3.000 kelimeyi aşan, kapsamlı teknik karşılaştırma tabloları, 12 maddelik denetim listeleri, 8 tehlikeli tüketici tuzağı ve 18 detaylı soru-cevap alanı içeren bu içeriklerle mağazamızın canlı uzman rehber kütüphanesi 111 makaleye ulaştı. Tüm yeni makale görsellerinde MCARIS kurumsal marka logosu ve amblemi stüdyo kalitesinde işlenerek mağazamızın kurumsal kimliği ve güvenilirliği en üst seviyeye taşındı.",
    items: [
      {
        title: "Fiyat Faktörleri, Günlük Bakım Rutinleri, Amortisör Teknolojisi, Şilte Entegrasyonu ve Ahşap Sandıklı Lojistik Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Hasta Karyolası Fiyatlarını Belirleyen Faktörler': Motor itiş kuvveti, 2 mm DKP çelik profil et kalınlığı, elektrostatik fırın boya, ABS hijyen tablaları ve şilte dahiliyeti gibi maliyeti doğrudan belirleyen tüm teknik bileşenler şeffaf bir analizle hasta yakınlarına sunuldu.",
          "'Hasta Karyolası Kullanımı ve Günlük Bakım Rutinleri': Yemek yeme ve solunum açısı ayarları, düşme önleyici korkuluk kilitleri, haftalık şilte altı havalandırması ve 3 aylık mafsal bakım takvimi ile yatakların kullanım ömrünü 10 yılın üzerine çıkaran adımlar açıklandı.",
          "'Hasta Karyolalarında Amortisör ve Hidrolik Güvenlik Teknolojileri': Parmak sıkışmasını önleyen yavaş süzülen amortisörlü korkuluklar, ani kalp durmasında omurgayı çarpmadan indiren hidrolik frenli CPR mekanizması ve sarsıntısız transfer konforu incelendi.",
          "'Hasta Karyolasına Uygun Medikal Şilte ve Havalı Yatak Entegrasyonu': 4 parçalı karyola hareketine tam uyumlu CNC lazer kesimli 32 DNS medikal süngerler, 24 saat kılcal dolaşımı canlı tutan boru tipi havalı yataklar ve sıvı geçirmez nefes alabilen koruyucu kılıf standartları detaylandırıldı.",
          "'Hasta Karyolası Lojistiği ve Ahşap Sandıklı Güvenli Teslimat Standartları': Ankara içi kendi uzman personelimizle randevulu oda montajı, 81 ilimize darbe emici 5 katmanlı masif ahşap sandık içinde tam sigortalı sevkiyat ve WhatsApp üzerinden görüntülü canlı kurulum desteği güvenceye bağlandı.",
        ],
      },
      {
        title: "Tüketiciyi Yanıltıcı Uygulamalara Karşı Koruyan Güvenlik Bariyerleri",
        category: "İyileştirme",
        details: [
          "İnce profilli derme çatma yataklar, yaylı yatak kullanarak motor yakma tehlikeleri, kargoda motor millerinin kırılmasına yol açan naylon ambalajlar ve kontrolsüz düşen tehlikeli korkuluklar gibi 8 tüketici tuzağı açıklanarak ailelerin maddi ve manevi mağduriyet yaşaması önlendi.",
          "MCARIS kurumsal marka güvencesiyle 2 yıl koşulsuz garanti ve 10 yıl kesintisiz orijinal yedek parça bulundurma taahhüdü tüm rehberlerimizde belgelendi.",
        ],
      },
      {
        title: "MCARIS Kurumsal Logosu ve Amblemiyle Birebir Donatılmış Özgün Görsel Standartları",
        category: "Tasarım & Medya",
        details: [
          "Tüm rehber kapaklarında ve ürün görsellerinde doğrudan MCARIS tescilli amblemi ve logosu kullanılarak, başka markaların veya jenerik yazıların yer almadığı, hastane showroom ve modern ev bakım kalitesini yansıtan 5 yeni yüksek çözünürlüklü özgün görsel devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.82",
    date: "21 Eylül 2026",
    summary:
      "Elektrikli motorlu hasta yataklarının solunum kapasitesi, bacak dolaşımı ve yatak yaralarını önlemedeki hayati klinik faydaları, korkuluk kilit emniyeti, tekerlek frenleri ve elektriksel güvenlik kuralları, hasta karyolası satın alma ve kiralamada fiyat-kalite dengesi ile bütçe analizi, doğru karyola seçiminin iyileşme hızına ve refakatçi tükenmişliğini önlemeye etkileri ile lineer aktüatör motorlarının çalışma prensipleri ve Newton itme kuvveti mühendisliğini kapsayan 5 yeni derinlemesine uzman rehberi yayına alındı. Her biri en az 3.000 kelimeden oluşan, kapsamlı karşılaştırma matrisleri, 12 maddelik kontrol listeleri, 8 tehlikeli tüketici tuzağı ve 16 detaylı soru-cevap alanı içeren bu içeriklerle mağazamızın canlı rehber kütüphanesi 106 uzman makaleye ulaştı; hasta yakınları ve sağlık profesyonelleri için en güvenilir medikal bilgi merkezi olma vizyonumuz güçlendirildi.",
    items: [
      {
        title: "Motorlu Karyola Faydaları, Güvenlik Kuralları, Fiyat-Kalite Dengesi, Evde Bakım Önemi ve Motor Teknolojisi Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Motorlu Hasta Karyolası Faydaları ve Kullanım Alanları': Semi-Fowler solunum desteği, bacak ödemini dağıtan venöz dolaşım açısı, bası yarası önleme ve refakatçinin bel sağlığını koruyan 3 motorlu asansör sistemi detaylandırıldı.",
          "'Hasta Karyolası Kullanırken Dikkat Edilmesi Gereken Güvenlik Kuralları': Uluslararası IEC 60601-2-52 12 cm parmaklık kuralı, çift kademeli kilit mandalları, tekerlek fren protokolleri, 24V düşük voltaj ve acil durum CPR prosedürleri açıklandı.",
          "'Hasta Karyolası Seçiminde Fiyat ve Kalite Dengesi: Bütçe ve Performans Kılavuzu': Fiyatı belirleyen çelik et kalınlığı ve motor torku, ucuz yatak almanın gizli arıza ve yara bakım maliyetleri ile 1, 3, 6 ve 12 aylık kiralama vs satın alma matematiği paylaşıldı.",
          "'Evde Hasta Bakımında Karyola Seçiminin Önemi ve İyileşme Sürecine Etkileri': Hastane enfeksiyonlarından korunma, hasta onuru ve bağımsızlık psikolojisi, refakatçi tükenmişlik sendromunu önleme ve ahşap mobilya sıcaklığı incelendi.",
          "'Hasta Karyolası Motorları ve Çalışma Prensipleri: Lineer Aktüatör Teknolojisi': 24V DC doğru akım güvenliği, 4000-8000 Newton itme kuvveti, kendinden kilitli çelik sonsuz vida dişli mimarisi, IPX4 su sızdırmazlık ve 9V acil durum pil desteği ele alındı.",
        ],
      },
      {
        title: "Tüketiciyi Koruyan Güvenlik Protokolleri ve Şeffaf Lojistik Taahhüdü",
        category: "İyileştirme",
        details: [
          "Piyasadaki hurda motorlu teneke karyolalar, kiralık yatakların taşıdığı bakteri riskleri, yaylı baza kullanımının ölümcül tehlikeleri ve hayali 2 saatte teslimat vaatleri gibi 8 kritik tuzak deşifre edilerek hasta yakınları koruma altına alındı.",
          "MCARIS kurumsal güvencesiyle Türkiye genelindeki 81 ilimize 5 katmanlı ahşap paletli sandıklarda sigortalı kargo ile ulaştırılması ve görüntülü canlı kurulum desteği tüm makalelere işlendi.",
        ],
      },
      {
        title: "Mühendislik ve Güvenliği Somutlaştıran 5 Yeni Yüksek Çözünürlüklü Görsel",
        category: "Tasarım & Medya",
        details: [
          "Motorlu karyola faydalarını, mekanik güvenlik kilitlerini, medikal showroom kalite dengesini, evde bakımın şefkatli atmosferini ve lineer aktüatör motor mühendisliğini temsil eden 5 yeni özgün stüdyo fotoğrafı üretilerek rehber kapaklarına uygulandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.81",
    date: "21 Eylül 2026",
    summary:
      "Hasta bakım karyolalarında uluslararası medikal mühendislik normları ve teknik çeşitler, hastanın klinik tablosu ve bağımsızlık derecesine göre doğru model tercihi, çelik şasi mukavemeti ve uluslararası IEC 60601-2-52 standartlarında korkuluk güvenliği, hasta karyolası satın alma sürecinde ailelerin bilmesi gereken 12 maddelik eksiksiz kontrol listesi ile ev koşulları ve refakatçi ergonomisine en uygun hasta yatağını belirleme uzmanlık kılavuzunu kapsayan 5 yeni derinlemesine rehber yayına alındı. Her biri en az 3.000 kelimeden oluşan, kapsamlı karşılaştırma matrisleri, 12 maddelik kontrol listeleri, 8 tehlikeli tüketici tuzağı ve 16 detaylı soru-cevap alanı içeren bu içeriklerle mağazamızın canlı rehber kütüphanesi 101 uzman makaleye ulaştı; hasta yakınları ve sağlık profesyonelleri için en güvenilir medikal bilgi merkezi olma vizyonumuz güçlendirildi.",
    items: [
      {
        title: "Teknik Standartlar, Klinik Seçim, Korkuluk Güvenliği, Satın Alma Kontrol Listesi ve İhtiyaç Belirleme Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Hasta Bakım Karyolası Çeşitleri ve Teknik Standartlar': 2, 3 ve 4 motorlu karyola sistemleri, 24V düşük voltajlı güvenli motorlar, 200 derecede fırınlanmış elektrostatik toz boya, demonte şasi avantajı ve modüler yapı incelendi.",
          "'Hasta Bakım Yatağı Seçiminde Klinik Duruma Göre Tercih': Geçici kırık nekahetinden tam yatağa bağımlı yoğun bakım hastalarına kadar Braden risk skalası, reflü ve aspirasyon önleme ile doğru şilte entegrasyonu rehberliği sunuldu.",
          "'Hasta Karyolalarında Dayanıklılık ve Korkuluk Güvenliği': Şasi profil et kalınlığı, 220-400 kg güvenli çalışma yükü, uluslararası IEC 60601-2-52 12 cm sıkışma kuralı, 1000 Newton yanal darbe testi ve amortisörlü korkuluk mekanizmaları açıklandı.",
          "'Hasta Karyolası Alırken Bilinmesi Gerekenler: Kapsamlı Kontrol Listesi': Motor sayısı, bakıcı bel sağlığı, korkuluk emniyeti, CNC medikal şilte uyumu, oda ve kapı geçiş ölçüleri ile acil durum pil desteğini içeren 12 maddelik kontrol kılavuzu paylaşıldı.",
          "'İhtiyaca Uygun Hasta Yatağı Belirleme Kılavuzu: Klinik ve Evde Bakım Rehberi': Hastanın nörolojik ve ortopedik durumu, refakatçi tükenmişliğini önleyen asansör yüksekliği, hasta taşıma lifti uyumu ve kiralama yerine satın alma analizi detaylandırıldı.",
        ],
      },
      {
        title: "Tüketiciyi Koruyan Güvenlik Protokolleri ve Şeffaf Lojistik Taahhüdü",
        category: "İyileştirme",
        details: [
          "Piyasadaki merdiven altı ince teneke profilli yataklar, yaylı baza süngeri kullanımının ölümcül riskleri, kiralık yatakların taşıdığı hastane mikropları ve hayali hızlı teslimat vaatleri gibi 8 kritik aldatmaca deşifre edilerek hasta yakınları koruma altına alındı.",
          "MCARIS kurumsal güvencesiyle Türkiye genelindeki 81 ilimize 5 katmanlı ahşap paletli sandıklarda sigortalı kargo ile ulaştırılması ve görüntülü canlı kurulum desteği tüm makalelere işlendi.",
        ],
      },
      {
        title: "Mühendislik ve Güvenliği Somutlaştıran 5 Yeni Yüksek Çözünürlüklü Görsel",
        category: "Tasarım & Medya",
        details: [
          "Teknik standartları, klinik hasta seçimini, korkuluk dayanıklılığını, satın alma kontrol sürecini ve ev ortamında doğru model eşleştirmesini görselleştiren 5 yeni özgün stüdyo fotoğrafı üretilerek rehber kapaklarına uygulandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.80",
    date: "20 Eylül 2026",
    summary:
      "Felçli ve inme geçiren bireylerin evde rehabilitasyonunu destekleyen ve transfer güvenliğini sağlayan motorlu karyola çözümleri, 7/24 yatağa bağımlı (yatalak) hastaların bakımında bası yaralarını önleyen Braden skalası ve 2 saatlik pozisyonlama protokolleri, yaşlı aile büyüklerimizin gece yataktan düşmesini engelleyen alçak seviyeli (low-bed) ahşap geriatrik modeller, bypass, protez ve batın cerrahileri sonrası dikiş açılmasını önleyen ameliyat sonrası yatak yönetimi ile pelvis, femur ve omurga kırıkları sonrası kemik kaynamasını koruyan trapeze askılı ortopedik karyola çözümlerini kapsayan 5 yeni derinlemesine uzman rehberi yayına alındı. Her biri en az 3.000 kelimeden oluşan, kapsamlı karşılaştırma tabloları, 12 maddelik kontrol listeleri, yanıltıcı tüketici tuzakları ve 16 detaylı soru-cevap alanı içeren bu içeriklerle mağazamızın canlı rehber kütüphanesi 96 uzman makaleye ulaştı; hasta yakınları ve sağlık profesyonelleri için en güvenilir medikal bilgi merkezi olma vizyonumuz güçlendirildi.",
    items: [
      {
        title: "Felçli Hastalar, Yatalak Bakım, Yaşlı Güvenliği, Ameliyat Sonrası ve Ortopedik Travma Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Felçli Hastalar İçin En Uygun Hasta Yatağı Modelleri': Hemipleji ve inme sonrası etkilenen tarafa göre yatak yerleşimi, transfer tahtası güvenliği, omuz subluksasyonu önleme ve bağımsız hareketi artıran motorlu açı ayarları detaylandırıldı.",
          "'Yatalak Hasta Bakımında Hasta Yatağının Rolü ve Önemi': Hücresel düzeyde 32 mmHg kılcal damar tıkanması riski, Braden bası yarası risk değerlendirmesi, PEG/nazogastrik beslenme açıları, inkontinans yönetimi ve 2 saatlik 24 saatlik pozisyonlama çizelgesi paylaşıldı.",
          "'Yaşlılar İçin Hasta Yatağı Seçimi: Güvenlik ve Konfor Kriterleri': Gece yataktan düşmeleri sıfırlayan alçak yatak (low-bed) teknolojisi, uluslararası IEC 60601-2-52 sıkışma standartları, ahşap ev mobilyası estetiği ve kalp yetersizliğinde ortopne dik duruşu ele alındı.",
          "'Ameliyat Sonrası Hasta Yatağı Kullanımı: İyileşmeyi Hızlandıran İpuçları': Koroner bypass sternotomi koruması, kalça ve diz protezinde 90 derece dislokasyon kuralı, batın ameliyatlarında Semi-Fowler karın gevşetme açısı ve erken mobilizasyon (ERAS) faydaları açıklandı.",
          "'Kırık ve Travma Sonrası Hasta Yatağı İhtiyacı ve Çözümleri': Kemik kallus kaynama biyolojisi, kompartman sendromunu önleyen bacak elevasyonu, pelvis ve femur kırıklarında trapeze (maymun askısı) kullanımı ve rijit çelik karkas güvencesi sunuldu.",
        ],
      },
      {
        title: "Hasta Bağımsızlığı ve Refakatçi Bel Sağlığını Koruyan Klinik Standartlar",
        category: "İyileştirme",
        details: [
          "Ameliyatlı veya kırıklı hastanın altını temizlerken refakatçinin 90 derece eğilmesini engelleyen 3 motorlu asansör sistemi ve yatak içi hijyen pratikleri vurgulandı.",
          "Piyasadaki yetersiz baza kullanımı, kiralık ve enfeksiyonlu yatakların getirdiği cerrahi sepsis tehlikeleri ve hayali teslimat vaatleri gibi 8 kritik tüketici tuzağı detaylandırılarak ailelerin bilinçlenmesi sağlandı.",
          "MCARIS kurumsal marka güvencesiyle doğrudan birinci elden satış, 81 ilimize 5 katmanlı ahşap paletli sigortalı lojistik ve kesintisiz WhatsApp görüntülü canlı kurulum rehberliği taahhüdü tüm rehberlere entegre edildi.",
        ],
      },
      {
        title: "Klinik Tedavi ve Evde Rehabilitasyonu Canlandıran 5 Yeni Yüksek Çözünürlüklü Görsel",
        category: "Tasarım & Medya",
        details: [
          "Felçli hasta transferi, yatalak hasta bakımı ve havalı yatak uyumu, yaşlılar için sıcak ahşap alçak karyola, ameliyat sonrası refakatçi desteği ve kırık travma hastalarında trapeze askılı ortopedik yatak dinamiklerini temsil eden 5 yeni özgün stüdyo fotoğrafı üretilerek rehberlerin kapak alanlarına işlendi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.79",
    date: "20 Eylül 2026",
    summary:
      "Evde ve klinik ortamlarda hasta bakım yatağının hayati fizyolojik rolü, cerrahi operasyon ve felç rehabilitasyonunda iyileşmeyi hızlandıran açısal çözümler, ev için doğru model seçiminde adım adım kontrol kriterleri, ev ortamına sıcaklık katan ahşap tasarımlı asansörlü modeller ile evde kurulum, topraklama güvenliği ve medikal dezenfeksiyon standartlarını kapsayan 5 yeni derinlemesine uzman rehberi yayına alındı. Her biri 3.000 kelime barajını aşan, 12 maddelik güvenlik kontrol listeleri, yanıltıcı tüketici tuzakları analizleri ve detaylı soru-cevap alanlarıyla zenginleştirilen rehberler sayesinde mağazamızın canlı rehber kütüphanesi 91 makaleye ulaştı; hasta yakınlarına ve refakatçilere yol gösteren sektörel liderliğimiz daha da güçlendirildi.",
    items: [
      {
        title: "Ev ve Klinik Bakımı, İyileşme Süreci, Seçim Kriterleri, Ev Tipi Tasarımlar ve Dezenfeksiyon Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Evde ve Klinikte Hasta Bakım Yatağı: Önemi ve Uzman Önerileri': Dekübitus (bası yarası) önleme mekaniği, mikroklima yönetimi, akciğer kapasitesini artıran Fowler pozisyonu ve 24 saatlik klinik pozisyonlama çizelgesi açıklandı.",
          "'İyileşme Sürecini Kolaylaştıran En İyi Hasta Yatağı Seçenekleri': Kalça ve diz protezi, omurga cerrahisi ve inme vakalarında ağrıyı azaltan sarsıntısız motor teknolojisi, vasküler ayak kaldırma ve yatak içi egzersiz teknikleri ele alındı.",
          "'Ev İçin Hasta Yatağı Seçerken Nelere Bakılmalı? Adım Adım Rehber': 80-90 cm'lik standart ev kapılarından modüler geçiş, 360 derece oda yerleşimi, 3 motorlu asansörün refakatçi bel sağlığına faydası ve kiralama yerine satın almanın avantajları incelendi.",
          "'Ev Tipi Hasta Yatağı Modelleri ile Bakımı Kolaylaştırma Yolları': Hastane odası soğukluğunu kıran doğal ahşap paneller, demans ve Alzheimer hastalarını sakinleştiren koruma bariyerleri, gizlenmiş kolon motorlar ve tekerlekli yemek masası entegrasyonu detaylandırıldı.",
          "'Evde Hasta Yatağı Kurulumu, Dezenfeksiyon ve Doğru Kullanım Kılavuzu': Gerçek topraklı priz güvencesi, oksijen konsantratörü yangın önlemleri, hastane tipi kuarterner amonyum ve alkol bazlı dezenfeksiyon protokolleri ve elektrik kesintisinde 9V acil pil indirme adımları paylaşıldı.",
        ],
      },
      {
        title: "Refakatçi Ergonomisi ve Tüketici Güvenliğini Koruyan Kapsamlı Analizler",
        category: "İyileştirme",
        details: [
          "Refakatçilerin omurga sağlığını tehdit eden 90 derece eğilme riskine karşı asansörlü yatakların sunduğu tork azaltımı ve kişiselleştirilmiş çalışma yüksekliği avantajları somutlaştırıldı.",
          "Ailelerin piyasadaki yetersiz marangoz işi bazalar, sahte motor güçleri ve faturasız ürünler gibi yanıltıcı tüketici tuzaklarına karşı dikkat etmesi gereken 8 kritik uyarı rehberlere eklendi.",
          "Ankara merkezli üretim kimliğimiz vurgulanarak; Ankara içi siparişlerde randevulu uzman kata montaj ve kumanda eğitimi, Türkiye genelindeki 81 ile ise 5 katmanlı ahşap paletli sigortalı kargo taahhüdü tüm içeriklerde teyit edildi.",
        ],
      },
      {
        title: "Evde Bakım ve Profesyonel Medikal Hijyeni Yansıtan 5 Yeni Stüdyo Fotoğrafı",
        category: "Tasarım & Medya",
        details: [
          "Ev dekoruna uyumlu ahşap panelli hasta yataklarından refakatçinin bel hizasında çalışma ergonomisine, klinik düzeyde yüzey dezenfeksiyonundan modern nekahet odalarına kadar 5 yeni yüksek çözünürlüklü görsel kataloğa eklendi.",
          "Tüm görseller masaüstü, tablet ve mobil cihazlarda optimize edilmiş hızlı yükleme süreleriyle ziyaretçilerimizin erişimine sunuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.78",
    date: "20 Eylül 2026",
    summary:
      "Hasta yatağı kurulumu ve refakatçi eğitimi, çağrı merkezinden kapıya güvenli sipariş protokolleri, piyasadaki aşırı ucuz ve merdiven altı karyolaların taşıdığı ölümcül güvenlik riskleri, aile bütçesini koruyan akılcı tasarruf yöntemleri ile Türkiye geneli 81 ile ahşap paletli sigortalı sevkiyat standartlarını ele alan 5 yeni kapsamlı rehber makale yayına alındı. Her biri 3.000 kelimeyi aşan derinlikli içerikler; hastanın odasındaki ada yerleşiminden Fowler solunum açılarına, 10 dakikada aletsiz montajdan canlı WhatsApp teknik desteğine, kiralama yerine satın almanın finansal üstünlüğünden 2 yıl yerinde servis güvencesine kadar evde bakım üstlenen ailelerin tüm ihtiyaçlarına eksiksiz cevap veriyor. Canlı rehber kütüphanemiz 86 makaleye ulaşarak mağazamızın sektörel güven ve bilgi otoritesini zirveye taşıdı.",
    items: [
      {
        title: "Kurulum & Refakatçi Eğitimi, Güvenli Sipariş ve 81 İl Sevkiyat Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Hasta Yatağı Satışı Sürecinde Kurulum ve Refakatçi Eğitimi': Odanın çift taraflı ada yerleşimi, yemek ve solunum için Fowler açıları, bası yarası önleme saatleri ve refakatçinin bel sağlığını koruyan transfer teknikleri detaylandırıldı.",
          "'Hızlı ve Güvenli Hasta Yatağı Sipariş Süreci': Hastanın klinik ihtiyaç tespiti, SGK uyumlu e-fatura düzenlenmesi, 3D Secure güvenli ödeme ve kapıda hasarsız teslimat protokolü şeffaflaştırıldı.",
          "'Bütçe Dostu Ucuz Hasta Yatağı Seçerken Dikkat Edilmesi Gereken Güvenlik Riskleri': 0.8 mm saclı şasilerin çökme tehlikesi, 220V elektrik kaçağı, korkuluk boğulma riskleri ve ucuz süngerlerin yarattığı bası yarası faciaları analiz edildi.",
          "'Bütçenizi Koruyan Uygun Fiyatlı Hasta Yatağı Çözümleri': Doğrudan üreticiden alarak aracı kârını silme, SGK nakdi geri ödemesini tahsil etme, Full Set paketlerle %35 tasarruf ve kiralama yerine satın almanın kazancı açıklandı.",
          "'Türkiye Geneli Hasta Yatağı Sevkiyat Ağı, Ahşap Paletli Kargo ve Garanti Rehberi': 81 ile 5 katmanlı darbe emici ahşap paletleme, %100 nakliye kaskosu, canlı WhatsApp görüntülü montaj ve 2 yıl yerinde servis güvencesi sunuldu.",
        ],
      },
      {
        title: "Tüketiciyi Bilinçlendiren 12 Maddelik Denetimler ve Güvenlik Matrisleri",
        category: "İyileştirme",
        details: [
          "Ailelerin ucuzluk aldatmacasıyla sahte 'Alman motoru' ve faturasız satış tuzaklarına düşmesini engelleyen 8 kritik tüketici koruma maddesi rehberlere işlendi.",
          "Ankara merkezli üretim kimliğimiz vurgulanarak; Ankara içine randevulu uzman kata montaj, Türkiye'nin 80 iline ise hasarsız ahşap paletli sevkiyat taahhüdü pekiştirildi.",
          "Tüm makalelere arama motoru özet bilgi kutuları, detaylı teknik karşılaştırma matrisleri ve 10'ar adet uzman onaylı soru-cevap alanı entegre edildi.",
        ],
      },
      {
        title: "Evde Bakım ve Güvenli Lojistiği Yansıtan 5 Yeni Gerçekçi Fotoğraf Koleksiyonu",
        category: "Tasarım & Medya",
        details: [
          "Refakatçiye kumanda eğitimi veren uzman teknisyenden çağrı merkezi koordinasyonuna, mühendislik güvenlik testinden ahşap paletli medikal sevkiyata kadar 5 yeni stüdyo ve operasyon fotoğrafı yayına alındı.",
          "Tüm görseller masaüstü ve mobil ekranlarda yüksek çözünürlük ve optimize edilmiş sayfa yükleme hızıyla kullanıma sunuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.77",
    date: "20 Eylül 2026",
    summary:
      "Medikal sektörde güvenilir tedarikçi seçimi, internet üzerinden güvenli tıbbi cihaz siparişi, Sağlık Bakanlığı Ürün Takip Sistemi (ÜTS) ve yasal ruhsat denetimleri, klinik duruma göre adım adım doğru model belirleme ve aile bütçesini koruyan tasarruf ipuçlarını ele alan 5 yeni kapsamlı rehber yayına alındı. Her biri 3.000 kelimeyi aşan derinlikli içerikler; merdiven altı üretim tuzaklarından sahte garanti belgelerine, e-fatura ile SGK nakdi geri ödeme adımlarından 81 ile ahşap paletli sigortalı sevkiyat güvencesine kadar hasta yakınlarının tüm soru işaretlerini gideriyor. Canlı rehber kütüphanemiz 81 makaleye ulaşarak mağazamızın güvenilir medikal liderliğini pekiştirdi.",
    items: [
      {
        title: "Güvenilir Tedarikçi, Online Sipariş ve Yasal Belge Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "'Güvenilir Hasta Yatağı Mağazası ve Medikal Tedarikçi Seçimi': Tıbbi cihaz satış merkezlerinin yetki belgeleri, 2 yıl yerinde teknik servis güvencesi ve 10 yıl yedek parça garantisinin önemi detaylandırıldı.",
          "'Hasta Yatağı Online Sipariş Süreci ve Güvenli Medikal Alışveriş': İnternetten medikal ürün alırken dikkat edilecek güvenlik unsurları, ağır yük kargo sigortası ve kapıda hasarsız teslim alma adımları açıklandı.",
          "'Güvenilir Hasta Yatağı Satan Firmaların Sahip Olması Gereken Yasal Belgeler': CE, ISO 13485 ve Sağlık Bakanlığı ÜTS kayıt sorgulaması vatandaşların kendi cep telefonlarından 1 dakikada yapabileceği şekilde adım adım gösterildi.",
          "'Hasta Yatağı Satın Alırken Adım Adım Doğru Seçim Kılavuzu': Hastanın fiziksel hareket kabiliyeti, kilosu, günlük yatakta kalma süresi ve bası yarası riskine göre en uygun motor ve karyola tipini belirleme matrisi sunuldu.",
          "'Hasta Yatağı Satın Alma Kılavuzu: Aileler İçin Tasarruf, Güvenlik ve Konfor İpuçları': SGK geri ödeme desteğinden faydalanma yolları, paket set kampanyaları ile %35 tasarruf imkanı ve gereksiz lüks harcamalardan kaçınma stratejileri paylaşıldı.",
        ],
      },
      {
        title: "Tüketiciyi Koruyan 12 Maddelik Denetim Listeleri ve Şeffaf Lojistik Standartları",
        category: "İyileştirme",
        details: [
          "Piyasadaki belgesiz merdiven altı satışlar, sahte garanti vaatleri ve afaki acil teslimat söylemleri gibi 8 yaygın tüketici tuzağına karşı aileleri bilinçlendiren koruma maddeleri hazırlandı.",
          "Ankara merkezli doğrudan üretici dürüstlüğüyle; Ankara içi planlı randevulu kata montaj ve Türkiye'nin 80 iline hasarsız ahşap paletli kargo ile canlı WhatsApp kurulum desteği ilkesi vurgulandı.",
          "Her makaleye arama motorlarında öne çıkan hızlı bilgi kutuları, detaylı karşılaştırma tabloları ve 10'ar adet uzman onaylı soru-cevap alanı eklendi.",
        ],
      },
      {
        title: "Medikal Mağaza ve Evde Bakım Güvenini Yansıtan 5 Yeni Gerçekçi Fotoğraf",
        category: "Tasarım & Medya",
        details: [
          "Güvenilir medikal mağaza atmosferinden online güvenli sipariş onayına, resmi sertifikasyon denetiminden aile danışmanlığına kadar 5 yeni stüdyo ve ev ortamı fotoğrafı rehberlere işlendi.",
          "Yüksek çözünürlüklü ve optimize edilmiş tüm görseller masaüstü ve mobil ziyaretçilere hızlı ve akıcı bir deneyim sunacak şekilde yayına alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.76",
    date: "20 Eylül 2026",
    summary:
      "Arama motorlarında en yoğun talep gören dört ana kavram olan 'hasta yatağı', 'hasta karyolası', 'hastane yatağı' ve 'hastane karyolası' aramalarında sektörel liderliği perçinleyen 4 dev sütun rehber yayına alındı. Her biri 3.000 kelimeyi aşan derinlikli içerikler; ev tipi konfordan yoğun bakım klinik standartlarına, motor ve şasi mukavemetinden dürüst lojistik kurallarına kadar hasta yakınlarının tüm soru işaretlerini aydınlatırken mağaza kategori vitrinleri bu stratejik terimlerle tam uyumlu hale getirildi. Canlı rehber kütüphanemiz 76 makaleye ulaşarak mağazamızın güvenilir medikal otoritesini daha da yukarılara taşıdı.",
    items: [
      {
        title: "Dört Büyük Arama Hacmi İçin Kapsamlı Sütun Rehberler Yayında",
        category: "Yeni Özellik",
        details: [
          "'Hasta Yatağı Çeşitleri ve 2026 Evde Bakım Rehberi': Standart ev yatakları ile medikal yataklar arasındaki farklar, motor kademeleri, bası yarası önleme ve doğru seçim kriterleri ele alındı.",
          "'Hasta Karyolası Mekanizmaları ve Güvenlik Standartları': Taşıyıcı çelik iskeletin sac kalınlıkları, aktüatör itme güçleri, kilitli korkuluklar ve tekerlek emniyet donanımları açıklandı.",
          "'Hastane Yatağı Özellikleri ve Ev Tipi vs. Klinik Karşılaştırması': Yoğun bakım ve palyatif servis standartları, acil durum mekanik CPR sistemleri ve evde kullanım gereksinimleri detaylandırıldı.",
          "'Hastane Karyolası Standartları ve Trendelenburg Pozisyonları': Kan dolaşımı ve solunumu destekleyen tıbbi açılandırmalar, teleskopik kolon motorları ve uluslararası klinik emniyet normları rehberleştirildi.",
        ],
      },
      {
        title: "Kategori Vitrini Optimizasyonu ve Ankara Merkezli Dürüst Lojistik Standartları",
        category: "İyileştirme",
        details: [
          "Hasta yatakları ana kategori sayfası başlık ve tanıtım metinleri, dört ana arama kavramını ve dürüst teslimat ilkelerimizi yansıtacak şekilde baştan sona yenilendi.",
          "Ankara merkezli doğrudan üretici kimliğimiz öne çıkarılarak; Ankara sınırları içinde randevulu uzman montaj, 81 ile ahşap paletli korumalı nakliye ve görüntülü teknik destek standardı netleştirildi.",
          "Her yeni sütun rehbere Google özet bilgi kutuları, 12 maddelik denetim listeleri, 8 yaygın tüketici tuzağı ve 10'ar adet detaylı uzman soru-cevap alanı entegre edildi.",
        ],
      },
      {
        title: "Klinik ve Ev Bakımını Yansıtan 4 Yeni Gerçekçi Fotoğraf Koleksiyonu",
        category: "Tasarım & Medya",
        details: [
          "Ev konforundaki 2 motorlu hasta yatağından yoğun bakım klinik donanımlarına kadar her bir sütun rehber için özel olarak üretilmiş 4 adet gerçekçi fotoğraf sisteme dahil edildi.",
          "Tüm görseller masaüstü ve mobil ekranlarda yüksek çözünürlük ve hızlı yükleme performansıyla yayına sunuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.75",
    date: "20 Eylül 2026",
    summary:
      "Hasta karyolası alışverişinde aile bütçesini koruyan ekonomik model seçenekleri, 2026 yılı motor ve şasi maliyet analizi, güncel piyasa fiyat dengeleri ve tam donanımlı set alımlarında %35'e varan indirim fırsatlarını ele alan 5 yeni kapsamlı rehber makale yayına alındı. Her biri 3.000 kelimeyi aşan derinlikli içerikler; motor gücünden sac profil kalınlığına, gizli nakliye tuzaklarından SGK geri ödeme stratejilerine kadar medikal harcamaları en akılcı şekilde yönetmek isteyen hasta yakınlarına eksiksiz bir rehberlik sunuyor.",
    items: [
      {
        title: "Ekonomik Karyola Seçenekleri, Maliyet Analizi ve 2026 Piyasa Fiyat Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "Bütçeyi sarsmadan en temel klinik ihtiyaçları eksiksiz karşılayan 2 motorlu ekonomik hasta karyolaları ve gereksiz lüks maliyetlerden kaçınma yolları detaylandırıldı.",
          "Hasta karyolası fiyatını belirleyen aktüatör itme kuvveti, DKP çelik profil et kalınlığı, ABS korkuluk teknolojisi ve medikal sünger dansitesi kalem kalem şeffaflaştırıldı.",
          "2026 yılı güncel medikal piyasasında 2, 3 ve 4 motorlu modellerin fiyat segmentleri, kiralama ile satın alma arasındaki kârlılık dengesi ve amortisman hesabı sunuldu.",
          "Karyola, medikal sünger, boru tipi havalı yatak ve serum askısını bir araya getiren 'Full Set Kampanyaları' ile aile bütçesinde %35'e varan net tasarruf imkanı rehberleştirildi.",
          "Yıl sonu stok eritme, Dünya Yaşlılar Haftası ve üreticiden doğrudan satış günleri gibi yılın en avantajlı alışveriş dönemleri ile SGK nakdi geri ödeme protokolleri açıklandı.",
        ],
      },
      {
        title: "Bütçe ve Maliyet Karşılaştırma Matrisleri ile 12 Maddelik Satın Alma Denetimleri",
        category: "İyileştirme",
        details: [
          "Ailelerin kendi bütçe ve klinik gereksinimlerine göre en doğru yatak segmentini bir bakışta seçebileceği 2026 Fiyat ve Donanım Matrisleri yayına alındı.",
          "Piyasadaki faturasız satış, hurda çıkma motor kullanımı, gizli kat taşıma ücretleri ve yetersiz sünger gibi 8 yaygın tüketici tuzağına karşı korunma yolları eklendi.",
          "Her makaleye Google özet bilgi kutuları, 12 maddelik adım adım satın alma ve kurulum kontrol listeleri ile 10'ar adet detaylı uzman soru-cevap bölümü entegre edildi.",
        ],
      },
      {
        title: "Modern Ev ve Showroom Ortamlarını Yansıtan 5 Yeni Gerçekçi Görsel Koleksiyonu",
        category: "Tasarım & Medya",
        details: [
          "Sıcak ahşap detaylı ekonomik hasta karyolasından ileri teknoloji medikal şasi ayrıntılarına kadar 5 yeni stüdyo ve ev ortamı fotoğrafı rehberlere işlendi.",
          "Medikal showroom alanı, tam donanımlı boru tipi havalı yataklı bakım paketi ve uzman danışman eşliğinde aile bilgilendirme kareleri görsel zenginlik kazandırdı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.74",
    date: "20 Eylül 2026",
    summary:
      "İstanbul güncel karyola fiyat dinamikleri ve kiralama-satın alma karşılaştırması, İzmir genelinde Ege ve Dokuz Eylül tıp fakülteleri taburculuk protokolleri ile Türkiye'nin 81 iline sigortalı ağır yük kargo güvencesini anlatan 4 yeni dev rehber yayına sunuldu. Her biri 3.000 kelimeyi aşan kapsamlı içerikler; 5 katmanlı darbe emici ahşap paletli ambalajlama standartlarından 10 dakikada aletsiz kuruluma, İzmir körfez nemine dayanıklı fırın boyalı şasilerden SGK heyet raporu geri ödeme adımlarına kadar hasta yakınlarının karar verme sürecini bütünüyle şeffaflaştırıyor.",
    items: [
      {
        title: "İstanbul Fiyat Kıyaslaması, İzmir Teslimat Ağı ve 81 İl Kargo Rehberleri Yayında",
        category: "Yeni Özellik",
        details: [
          "İstanbul medikal pazarında 2, 3 ve 4 motorlu yatakların fiyat aralıkları, kiralama ile satın alma arasındaki 3 aylık maliyet tablosu ve SGK destek baremleri açıklandı.",
          "Ankara merkezli operasyonumuzdan İzmir ve Ege Bölgesi genelindeki hastaneler ve evde bakım hastaları için planlı medikal sevkiyat, kata teslimat ve teknik servis rehberliği açıklandı.",
          "İzmir'de ikamet eden hastalar için Ege Üniversitesi ve Dokuz Eylül Tıp Fakültesi çıkışlarında Sağlık Kurulu Raporu alma ve SGK Konak SSGM başvuru adımları detaylandırıldı.",
          "Türkiye'nin 81 iline ve tüm ilçelerine ahşap paletli, darbe emici 5 katmanlı ambalajlama ve görüntülü WhatsApp desteğiyle 10 dakikada aletsiz kurulum güvencesi sunuldu.",
        ],
      },
      {
        title: "Maliyet Karşılaştırma Matrisleri ve 10 Dakikalık Hızlı Montaj Çizelgeleri",
        category: "İyileştirme",
        details: [
          "Ailelerin 3 aylık kiralama masrafı ile sıfır yatak satın alma arasındaki ekonomik farkı ve geri satış avantajını net olarak görebileceği karşılaştırma tabloları eklendi.",
          "Kargo ile gelen modüler hasta karyolasının hiçbir alet ve vida gerektirmeden elle birleştirilmesini sağlayan 6 adımlı resimli montaj tablosu sisteme kazandırıldı.",
          "Her makaleye hızlı karar vermeyi sağlayan Google özet bilgi kutuları ve 10'ar adet ilçe/bölge odaklı detaylı uzman soru-cevap alanı entegre edildi.",
        ],
      },
      {
        title: "Türkiye Geneli Lojistik ve Ege Mimarisi Fotoğraf Koleksiyonu Eklendi",
        category: "Tasarım & Medya",
        details: [
          "İzmir'in aydınlık ev ortamlarını, medikal lojistik dağıtım merkezlerini ve hasta karyolası montajını belgeleyen gerçekçi, yüksek çözünürlüklü özel fotoğraflar üretilerek rehberlere dahil edildi.",
          "Tüm görsel içeriklerin mobil ve masaüstü tarayıcılarda hızlı, net ve kesintisiz yüklenmesi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.73",
    date: "20 Eylül 2026",
    summary:
      "Ankara, Antalya, Bursa ve İstanbul gibi büyükşehirlerimizde ikamet eden veya şehir hastanelerinden evde bakıma geçen hastalarımız için aynı gün teslimat, kata taşıma ve oda içi profesyonel montaj süreçlerini adım adım anlatan 5 yeni kapsamlı şehir lojistik rehberi yayına alındı. Her biri 3.000 kelimeyi aşan zengin içerikler; dar merdivenli apartman çözümlerinden Akdeniz'in nemli sıcağına dayanıklı medikal şiltelere, SGK il müdürlükleri heyet raporu onay adımlarından ambulansla eş zamanlı eve transfer protokollerine kadar hasta yakınlarının operasyonel tüm sorularını aydınlatıyor.",
    items: [
      {
        title: "4 Büyükşehir İçin Kapsamlı Hasta Yatağı Lojistik ve Montaj Kılavuzları Yayında",
        category: "Yeni Özellik",
        details: [
          "Ankara genelinde Bilkent ve Etlik Şehir Hastanelerinden taburculuk sonrası aynı gün ücretsiz kurulum ve İbni Sina SGK başvuru adımları rehberleştirildi.",
          "Ankara'da doğru hasta yatağı seçimi, medikal heyet raporu çıkarma ve 2-3-4 motorlu model karşılaştırma kılavuzu ailelerin hizmetine sunuldu.",
          "Antalya ve Akdeniz sahil ilçelerinde yaz sıcağında yatak yaralarını önleyen hava üflemeli ventilasyonlu yataklar ve neme dayanıklı fırın boyalı karyola standartları detaylandırıldı.",
          "Bursa Şehir Hastanesi ve Uludağ Tıp Fakültesi çıkışları için Nilüfer'den Osmangazi'nin dik yokuşlarına kadar kata taşıma ve montaj protokolleri hazırlandı.",
          "İstanbul'un iki yakasında 39 ilçeye anlaşmalı lojistik filomuzla kata teslimat, asansörsüz tarihi binalarda kata çıkarma ve Çam ve Sakura taburculuk koordinasyonu ele alındı.",
        ],
      },
      {
        title: "İlçe Bazlı Teslimat Matrisleri ve 12 Maddelik Güvenli Kurulum Kontrol Listeleri",
        category: "İyileştirme",
        details: [
          "Hasta yakınlarının teslimat süresini ve bina giriş şartlarını önceden görebileceği ilçe lojistik karar tabloları eklendi.",
          "Teknik servis eve geldiğinde motor testinden tekerlek frenine, acil durum pilinden şilte hijyenine kadar kontrol edilebilecek 12 maddelik teslim alma listeleri hazırlandı.",
          "Kullanıcıların aradığı bilgilere saniyeler içinde ulaşabilmesi için her başlığın altına hızlı özet bilgi kutuları ve ilçe bazlı uzman soru-cevap bölümleri dahil edildi.",
        ],
      },
      {
        title: "Bölgesel Evde Bakım Fotoğraf Koleksiyonu Zenginleştirildi",
        category: "Tasarım & Medya",
        details: [
          "İstanbul boğaz hattı, Ankara konutları, Antalya sahil mimarisi ve Bursa evlerinde hasta bakımını yansıtan yüksek kaliteli, gerçekçi fotoğraflar üretilerek rehberlere eklendi.",
          "Görsellerin tüm akıllı telefonlarda ve bilgisayarlarda yüksek netlikte ve hızlı yüklenmesi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.72",
    date: "20 Eylül 2026",
    summary:
      "Motorlu hasta yatakları arasındaki klinik ve teknik farklar, periyodik bakım protokolleri, bası yarasını önleyen pozisyon sistemleri, bakıcı omurga sağlığını koruyan asansörlü modeller ve geçici nekahet dönemleri için manuel karyola çözümlerini kapsayan 5 adet büyük başvuru rehberi 3.000 kelimeyi aşan zengin içeriklerle yayına alındı. Hastaların konforunu artıran, refakatçi yükünü sıfırlayan ve aile bütçesini koruyan yeni karar kılavuzları bilgi bankasına kazandırıldı.",
    items: [
      {
        title: "5 Yeni Kapsamlı Hasta Karyolası ve Bakım Rehberi Bilgi Bankasına Eklendi",
        category: "Yeni Özellik",
        details: [
          "1'den 5 motora kadar tüm hasta karyolası çeşitlerinin klinik karşılaştırmasını sunan başvuru kılavuzu hazırlandı.",
          "Otomatik elektrikli hasta yataklarının günlük kullanımı, temizlik hijyen standartları ve arıza önleyici periyodik bakım yöntemleri detaylandırıldı.",
          "Yatağa bağımlı ve felçli hastalarda yatak yaralarını (dekübitus) önleyen sağa-sola pozisyon veren karyola teknolojileri ve havalı yatak uyumu ele alındı.",
          "Bakıcıların bel fıtığı olmasını engelleyen ve tekerlekli sandalyeye transferi kolaylaştıran asansörlü yatak ergonomisi rehberleştirildi.",
          "Kısa süreli kırık ve nekahet süreçleri için bütçe dostu tek motorlu ve mekanik çevirmeli manuel karyola kılavuzu oluşturuldu.",
        ],
      },
      {
        title: "Klinik Karar Matrisleri ve Bakıcı Sağlığını Koruma Çizelgeleri",
        category: "İyileştirme",
        details: [
          "Ailelerin hastanın kilosuna, hareket kabiliyetine ve bakım süresine göre en doğru yatak segmentini seçmesini sağlayan karar tabloları eklendi.",
          "Refakatçiler için yatak içi banyo, çarşaf değişimi ve günlük omurga sağlığını koruyucu postür egzersizleri rehberlere dahil edildi.",
          "Arama motoru kullanıcılarının sorularına tek bakışta net cevap veren hızlı özet bilgi kutuları ve 10'ar adet detaylı uzman soru-cevap alanı sisteme entegre edildi.",
        ],
      },
      {
        title: "Gerçekçi Özel Medikal Fotoğraf Koleksiyonu Zenginleştirildi",
        category: "Tasarım & Medya",
        details: [
          "Yeni eklenen 5 rehber için ev ortamında hasta bakımını ve medikal konforu yansıtan gerçekçi, yüksek çözünürlüklü özel fotoğraflar üretilerek yayına sunuldu.",
          "Görsellerin mobil cihazlarda ve masaüstünde kesintisiz, hızlı ve estetik bir biçimde görüntülenmesi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.71",
    date: "20 Eylül 2026",
    summary:
      "Hasta ve refakatçi deneyimini en üst seviyeye taşımak amacıyla 5 adet kapsamlı hasta yatağı başvuru rehberi 3.000 kelimeyi aşan zengin içeriklerle yayına alındı. Hastaların tanısına göre (inme, ameliyat nekahati, KOAH, Alzheimer) doğru modeli seçmeyi sağlayan karar matrisleri, 12 maddelik kontrol listeleri ve gerçekçi özel görseller bilgi bankasına eklendi.",
    items: [
      {
        title: "5 Adet Kapsamlı Hasta Yatağı Başvuru Rehberi Yayına Alındı",
        category: "Yeni Özellik",
        details: [
          "Ayarlanabilir hasta yatakları, çift motorlu baş-ayak hareket mekaniği, evde elektrik güvenliği, teknik seçim kriterleri ve kolay kumanda kullanımı konularında her biri 3.000 kelimeyi aşan ana başvuru rehberleri hazırlandı.",
          "Ailelerin hasta durumuna göre (kalça kırığı, felç, nefes darlığı, yaşlılık) en doğru karyolayı seçebilmesi için adım adım yönlendiren Klinik Karar Matrisleri entegre edildi.",
        ],
      },
      {
        title: "Arama Motorlarında Doğrudan Çözüm Sunan Hızlı Bilgi Kutuları",
        category: "İyileştirme",
        details: [
          "Hasta yakınlarının en çok merak ettiği konulara rehberlerin her bölümünde anında yanıt veren Google 0. Sıra özet bilgi kutuları oluşturuldu.",
          "Yatak satın alırken ve eve kurulum yapılırken refakatçilerin kolayca takip edebileceği 12 maddelik pratik kontrol listeleri (Checklist) rehberlere eklendi.",
        ],
      },
      {
        title: "Gerçekçi ve Yüksek Kaliteli Özel Medikal Görseller Entegre Edildi",
        category: "Tasarım & Medya",
        details: [
          "Yayınlanan yeni rehber makaleler için ev konforunu ve klinik güvenliği yansıtan gerçekçi, yüksek çözünürlüklü özel medikal fotoğraflar üretilerek yayına alındı.",
          "Görsellerin mağaza tasarımına tam uyum sağlayacak şekilde optimize edilmesi ve hızlı yüklenmesi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.70",
    date: "20 Eylül 2026",
    summary:
      "Arama motoru dizinleme ve tarama performansı kökten iyileştirildi. Mağazadaki 63 adet uzman hasta bakım rehberi ve makalesi tek tek taranarak veri bütünlüğü teyit edildi. Makale ve ana sayfa açılış hızları optimize edildi; alt bilgi alanına doğrudan bilgi bankası bağlantıları eklenerek arama motorlarının tüm rehberleri eksiksiz indekslemesi sağlandı.",
    items: [
      {
        title: "Rehber ve Makale Sayfa Açılış Hızları Artırıldı",
        category: "İyileştirme",
        details: [
          "Hasta bakımı, kiralama rehberleri ve dekübitüs yara önleme makaleleri açılırken arka planda çalışan gereksiz veri döngüleri sonlandırılarak doğrudan saf listeleme mimarisine geçildi.",
          "Ziyaretçilerin ve arama motorlarının makalelere ve ana sayfaya anında, bekleme yaşamadan erişmesi sağlandı; sunucu performansı hafifletildi.",
        ],
      },
      {
        title: "Mağaza Bilgi Bankası Alt Bilgiye (Footer) Dahil Edildi",
        category: "İyileştirme",
        details: [
          "Mağaza alt bilgi alanına 63 makalelik Medikal Blog ve Rehberler bağlantısı ile popüler hasta bakım konuları entegre edildi.",
          "Müşterilerin ihtiyaç duydukları medikal rehberlere sitenin her yerinden kolayca ulaşabilmesi ve Google'ın bu rehberleri vitrinde öne çıkarması kolaylaştırıldı.",
        ],
      },
      {
        title: "Arama Motoru Dizinleme ve Filtreleme Düzeni Güçlendirildi",
        category: "İyileştirme",
        details: [
          "Ürün arama ve filtreleme sayfalarında arama motorlarının indeksleme uyarıları vermesini önleyen teknik tarama düzenlemeleri tamamlandı.",
          "Arama motorlarının mağaza modellerini ve ana ürün vitrinini en temiz ve doğru sayfalar üzerinden indekslemesi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.69",
    date: "17 Eylül 2026",
    summary:
      "Kategori sayfalarında hasta karyolası motor seçenekleri (2 motorlu, 3 motorlu, 4 motorlu) ve ürün serisi filtrelemeleri kusursuzlaştırıldı. Motor seçeneklerine tıklandığında ürünlerin filtrelenememesi ve hatalı başlık oluşumu kökten giderilerek ilgili motor kategorilerine anında ve pürüzsüz geçiş sağlandı. Sol filtre menüsündeki ürün adetleri gerçek katalog modelleriyle tam uyumlu hale getirildi.",
    items: [
      {
        title: "Hasta Karyolası Motor Filtreleri ve Model Geçişleri Kökten Düzeltildi",
        category: "Düzeltme",
        details: [
          "3 motorlu veya diğer hasta karyolası sayfalarında 2 motorlu ya da 4 motorlu seçeneklerine tıklandığında modellerin değişmemesi sorunu çözüldü.",
          "Müşteri herhangi bir motor seçeneğine tıkladığında ilgili modeller anında listelenir ve doğrudan o motor grubuna ait resmi vitrine pürüzsüzce yönlendirilir.",
          "Filtreleme esnasında oluşan çift ve karışık sayfa başlığı görünümü düzeltilerek mağaza ciddiyetine uygun net başlıklar sağlandı.",
        ],
      },
      {
        title: "Ürün Serisi Filtreleri Kategori Sayfalarına Entegre Edildi",
        category: "İyileştirme",
        details: [
          "Kategori sayfalarında filtre panelinden Gold, Silver veya Platinum seri seçimi yapıldığında modellerin filtrelenmesi sağlandı.",
          "Müşterilerin bütçelerine ve aradıkları donanım seviyesine göre ürünleri kategori içerisinde anında ayıklayabilmesi kolaylaştırıldı.",
        ],
      },
      {
        title: "Kategori Menüsünde Gerçek Model Adetleri ve Liste Düzeni",
        category: "İyileştirme",
        details: [
          "Filtre menüsünde 2, 3 ve 4 motorlu kategorilerin yanında '0' görünmesi engellendi; mağazadaki gerçek aktif model adetleri (6 adet 2 motorlu, 2 adet 3 motorlu, 6 adet 4 motorlu) tam olarak yansıtıldı.",
          "Kullanılmayan boş kategori satırları menüden temizlenerek müşterilere sade, güvenilir ve düzenli bir katalog rehberi sunuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.68",
    date: "17 Eylül 2026",
    summary:
      "Mağaza alt bilgi alanındaki PayTR güven rozeti resmi yüksek çözünürlüklü vektörel renkli logosuyla güncellendi. Akıllı telefonlarda sayfa sonuna gelindiğinde sabit alt gezinme çubuğunun sözleşme ve telif metinlerini kapatmasını önleyen ergonomik alt boşluk eklendi.",
    items: [
      {
        title: "Resmi PayTR Güven Rozeti Güncellendi",
        category: "Tasarım",
        details: [
          "Ödeme yöntemleri rozet şeridindeki PayTR logosu orijinal yatay ve renkli vektörel sürümüne dönüştürülerek kurumsal güvenilirlik pekiştirildi.",
          "Farklı ekran çözünürlüklerinde pürüzsüz ve net görünüm sağlandı.",
        ],
      },
      {
        title: "Mobil Alt Bilgi ve Yasal Bağlantılar Ergonomisi",
        category: "İyileştirme",
        details: [
          "Mobil ekranlarda sayfa sonuna inildiğinde telif, mesafeli satış ve gizlilik bağlantılarının alt gezinme çubuğunun arkasında kalması engellendi.",
          "Yasal metinlerin ve menü bağlantılarının tek dokunuşla rahatça okunabilmesi ve tıklanabilmesi için ferah bir alt boşluk tanımlandı.",
        ],
      },
      {
        title: "Tüm WhatsApp Danışma Butonları Resmi Marka Rengine Kavuştu",
        category: "Tasarım",
        details: [
          "Site genelindeki tüm WhatsApp sipariş ve danışma butonları resmi WhatsApp yeşili ve beyaz simgeleriyle tek tip hale getirilerek kurumsal bütünlük sağlandı.",
          "Müşterilerin uzman desteğine ve sipariş hattına tek bakışta güvenle ulaşabilmesi kolaylaştırıldı.",
        ],
      },
      {
        title: "Müşteri Değerlendirmeleri Profil Görselleri İyileştirildi",
        category: "Düzeltme",
        details: [
          "Google Haritalar üzerinden aktarılan gerçek müşteri değerlendirmelerinde profil fotoğraflarının harici kaynak kısıtlamaları nedeniyle kırık görünmesi engellendi.",
          "Görsellerin güvenle ve kesintisiz yüklenmesi sağlandı; profil resmi bulunmayan veya yüklenemeyen hesaplar için modern ve renkli isim baş harfi rozetleri devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.67",
    date: "16 Eylül 2026",
    summary:
      "Mobil ürün kataloğu deneyimi baştan sona yenilendi. Cep telefonlarında ürünleri ekranın altına iten hantal filtre alanı kaldırılarak tek dokunuşla alttan açılan modern bir filtreleme çekmecesine dönüştürüldü. Sayfa tepesine eklenen parmak kaydırmalı hızlı kategori bandı ve tek satırda toplanan işlem çubuğu ile ürün kartlarının hizalamaları milimetrik olarak kusursuzlaştırıldı.",
    items: [
      {
        title: "Alttan Açılan Modern Mobil Filtreleme Çekmecesi",
        category: "Tasarım",
        details: [
          "Masaüstündeki sol filtre paneli cep telefonlarında ekranı işgal etmeyecek şekilde, tek dokunuşla alttan açılan zarif bir çekmece haline getirildi.",
          "Hasta karyolası motor seçenekleri, ürün serileri ve kategoriler müşterilerin tek elle rahatça seçebileceği butonlarla donatıldı.",
          "Aktif seçilen filtreler sayfa üzerinde renkli rozetler halinde listelenerek tek dokunuşla kaldırılabilme kolaylığı sağlandı.",
        ],
      },
      {
        title: "Tek Dokunuşla Hızlı Kategori Geçiş Şeridi",
        category: "İyileştirme",
        details: [
          "Ürün kataloğunun en üstüne yatayda pürüzsüzce kaydırılabilen kategori butonları eklendi.",
          "Müşteriler hasta yatakları, yemek masaları, bakım koltukları ve diğer ürün grupları arasında sayfadan ayrılmadan anında geçiş yapabilir hale geldi.",
        ],
      },
      {
        title: "Kompakt İşlem Çubuğu ve Doğrudan Ürün Görünürlüğü",
        category: "İyileştirme",
        details: [
          "Filtreleme butonu, akıllı sıralama listesi ve tekli/ikili vitrin görünüm butonları tek bir kompakt satırda toplandı.",
          "Sayfa açılır açılmaz ürünlerin doğrudan müşterinin karşısına gelmesi sağlanarak ilk bakışta satın alma ilgisi artırıldı.",
        ],
      },
      {
        title: "İki Sütunlu Ürün Kartlarında Kusursuz Boy ve Satır Hizalaması",
        category: "Düzeltme",
        details: [
          "Yan yana duran iki ürünün farklı uzunluktaki isimlerinden kaynaklanan yükseklik dalgalanmaları ve çarpıklıklar tamamen giderildi.",
          "Fiyat etiketleri, stok durumu göstergeleri ve ürün fotoğrafları aynı hizaya kilitlenerek katalog vitrini tertemiz bir intizama kavuşturuldu.",
        ],
      },
      {
        title: "Ürün Kartı Başlıklarındaki Harf Kesilme ve Satır Sıkışması Düzeltildi",
        category: "Düzeltme",
        details: [
          "Uzun ürün isimlerinin ikinci satırında harflerin alt kısımlarının kesilmesine yol açan yükseklik kısıtlaması kaldırıldı.",
          "Ürün isimleri için doğal satır yüksekliği ve nefes alma payı tanımlanarak tüm harflerin, Türkçe karakterlerin ve ürün adlarının kristal netliğinde tam okunması sağlandı.",
          "Farklı uzunluktaki başlıkların vitrindeki kart yüksekliklerini bozması engellenerek fiyat ve stok etiketlerinin kusursuz yatay hizası korundu.",
        ],
      },
      {
        title: "Mobil Güvence Rozetleri ve Kategori Başlığında Kusursuz Simetri",
        category: "Tasarım",
        details: [
          "Ana sayfadaki güvence kartları cep telefonlarında iki eşit sütun halinde sol ve sağa tam dengeli şekilde yerleştirildi; tek kalan rozet mobilde gizlenerek görsel dağınıklık önlendi.",
          "Popüler kategoriler başlık alanındaki metin ve bağlantının dar mobil ekranlarda alt alta kırılması ve sıkışması engellendi; tek satırda ferah ve kurumsal bir görünüme kavuşturuldu.",
        ],
      },
      {
        title: "Tam Ekran Mobil Menü ve Güvenli Yönetici Paneli İzolasyonu",
        category: "Tasarım",
        details: [
          "Açılır mobil menü cep telefonlarında kenarda boşluk bırakmayacak şekilde %100 tam ekran genişliğine kavuşturuldu; müşterilerin menü ögelerine çok daha ferah ve odaklanmış şekilde erişmesi sağlandı.",
          "Menü içerisindeki yönetici paneli kısayol kutusu katı rol denetimiyle izole edildi; yönetici yetkisi bulunmayan veya giriş yapmamış müşterilere hiçbir şekilde gösterilmediği doğrulandı.",
        ],
      },
      {
        title: "Katalog Vitrinine 2, 3 ve 4 Motorlu Hasta Karyolası Kategorileri Eklendi",
        category: "İyileştirme",
        details: [
          "Müşterilerin teknik seriler yerine doğrudan ihtiyacı olan motor sayısına göre seçim yapabilmesi için ana sayfa vitrinine '2 Motorlu', '3 Motorlu (Asansörlü)' ve '4 Motorlu (Trendelenburg)' kategorileri yerleştirildi.",
          "Genel 'Tüm Modeller' kartı kaldırılarak yerine doğrudan aranan motorlu ürün gruplarına giden bağımsız ve Google indeksine tam uyumlu açılış sayfaları bağlandı.",
          "Vitrin toplam 10 kategori kartına tamamlanarak masaüstünde 5x2, cep telefonlarında 2 sütunluk kusursuz bir görsel intizama kavuşturuldu.",
        ],
      },
      {
        title: "Kullanıcı Hesap Butonu ve Sürüm Rozeti İkonunda Kusursuz Hizalama",
        category: "Düzeltme",
        details: [
          "Giriş yapmış müşterilerin üst menüde adını gösteren hesap butonundaki iç boşluklar ve baş harf simgesi milimetrik olarak dengelendi; dairesel hatlar ve metin hizası kusursuz bir estetiğe kavuşturuldu.",
          "Değişiklik kayıtları sayfasının tepe afişinde yer alan sürüm dağıtım rozetindeki takvim simgesi yüksek kontrastlı beyaz renge dönüştürülerek okunabilirliği artırıldı.",
        ],
      },
      {
        title: "Kayan Canlı Danışma Butonu ve Otomatik Açılan Destek Penceresi Yenilendi",
        category: "İyileştirme",
        details: [
          "Ekranın sağ alt köşesinde yer alan canlı danışma butonu, üst menüdeki sipariş butonuyla tam bir görsel uyum yakalayacak şekilde zümrüt yeşili kurumsal tasarım standardına kavuşturuldu.",
          "Daha önce çalışmayan otomatik açılma işlevi düzeltildi; sayfa açıldıktan 2 saniye sonra uzman danışma ve doğrudan telefon arama seçeneklerini içeren bilgilendirme penceresi müşteriyi karşılayacak şekilde devreye alındı.",
        ],
      },
      {
        title: "Alt Bilgi (Footer) Yasal Metinler ve Telif Alanı Sola Hizalandı",
        category: "Tasarım",
        details: [
          "Sayfa altındaki şirket unvanı, telif hakları bildirimi ve sözleşme bağlantıları kurumsal sayfa akışına uygun olarak sola yaslandı.",
          "Ödeme güvenliği bilgilendirme satırı ile yasal bağlantıların hizası eşitlenerek alt bilgi alanında kusursuz bir görsel intizam sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.66",
    date: "16 Eylül 2026",
    summary:
      "Mobil sayfa altındaki kurumsal danışma ve iletişim kartında yaşanan ekran dışına taşma ve metin kesilme sorunu kökten giderildi. Kartın genişliği cep telefonu ekranlarına tam uyumlu hale getirilerek başlıkların, iletişim numaralarının ve fabrika adresinin kusursuz bir simetriyle sergilenmesi sağlandı.",
    items: [
      {
        title: "Mobil İletişim Kartı Görsel Düzeni ve Taşma Sorunu Düzeltildi",
        category: "Düzeltme",
        details: [
          "Cep telefonlarında alt bilgi alanındaki siyah danışma kartının sağ taraftan ekran dışına taşmasına yol açan genişlik uyumsuzluğu giderildi.",
          "Başlık ('Hasta Bakım & Medikal Ekipman Seçiminde Yanınızdayız') ve açıklama metinlerinin kelime bölünmeden satır içine düzgünce yerleşmesi sağlandı.",
          "İletişim kartı sağ ve sol kenarlardan eşit boşlukla ortalanarak telefon, e-posta ve adres bilgilerinin okunabilirliği artırıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.65",
    date: "16 Eylül 2026",
    summary:
      "Mobil mağaza deneyimi baştan sona ferahlatıldı. Cep telefonlarında ekran alanını kısıtlayan alt kategori şeridi kaldırılarak açılır menü arama çubuğunun yanına taşındı. Mağaza yöneticileri için mobil menü içerisine doğrudan sipariş, ürün ve yönetim paneli kısayolları entegre edildi.",
    items: [
      {
        title: "Mobil Ekran Alanı ve Görsel Ferahlık Sağlandı",
        category: "Tasarım",
        details: [
          "Telefon ve küçük ekranlarda sayfa tepe alanında gereksiz yer kaplayan yatay kategori bandı kaldırılarak vitrinin doğrudan ekrana gelmesi sağlandı.",
          "Müşterilerin sayfayı kaydırırken ürünleri, fiyatları ve kampanyaları daha geniş bir görüş alanında incelemesi sağlandı.",
        ],
      },
      {
        title: "Kullanışlı Mobil Menü ve Arama Entegrasyonu",
        category: "İyileştirme",
        details: [
          "Menü butonu arama kutusunun hemen soluna, tek elle parmak erişimine en uygun noktaya yerleştirildi.",
          "Açılır menünün ekranı tam kaplayan pürüzsüz yapısı sayesinde kategoriler ve hizmetler arasında kaybolmadan geçiş yapılması sağlandı.",
        ],
      },
      {
        title: "Eksiksiz Ürün, Kiralama ve Hizmet Kataloğu",
        category: "İyileştirme",
        details: [
          "Hasta karyolası serileri (Platinum, Gold, Silver), klinik bakım ekipmanları, kiralama prosedürü ve ilçe teslimat rehberleri tek çatı altında toplandı.",
          "Telefonla 7/24 arama ve doğrudan WhatsApp sipariş bağlantıları menünün en üstüne eklenerek anında iletişim kanalı oluşturuldu.",
        ],
      },
      {
        title: "Yöneticiler İçin Hızlı Mobil Kontrol Menüsü",
        category: "Yeni",
        details: [
          "Mağaza yöneticileri giriş yaptığında mobil menü üzerinden siparişlere, ürün yönetimine ve site ayarlarına tek tıkla ulaşabilecekleri özel yönetim paneli devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.64",
    date: "16 Eylül 2026",
    summary:
      "Mağaza üst gezinme alanı (header) ve mobil menü, modern ve aydınlık bir kurumsal anlayışla baştan aşağı yenilendi. Müşterilerin hasta yatağı serilerine, klinik ekipmanlara ve danışma hatlarına zahmetsizce ulaşmasını sağlayan ferah, sade ve gözü yormayan birinci sınıf bir vitrin mimarisi devreye alındı.",
    items: [
      {
        title: "Modern ve Aydınlık Üst Gezinme Deneyimi Devreye Alındı",
        category: "Tasarım",
        details: [
          "Mağaza üst menüsü ferah, aydınlık ve kurumsal çizgilerle yeniden tasarlandı; göz yoran yapay animasyonlar yerine oturaklı ve sade bir duruş benimsendi.",
          "Üst kategori menüsü ile ana vitrin banner alanı arasındaki gereksiz beyaz boşluk şeridi tamamen kaldırılarak bütünleşik ve akıcı bir görsel geçiş sağlandı.",
          "Giriş yap ve kullanıcı işlem butonunun iç boşlukları genişletildi, buton simgesi ve metnin kenarlara yapışması engellenerek ferah bir görünüm kazandırıldı.",
          "Üst bilgi çubuğundaki destek bağlantıları arasına sönük ayırıcı noktalar eklenerek görsel denge ve okunabilirlik artırıldı.",
          "Hasta yatağı serileri ve klinik bakım ekipmanları için geniş ve düzenli başlık pencereleri oluşturularak müşterilerin aradıkları ürün grubunu tek bakışta bulması kolaylaştırıldı.",
          "Arama kutusu ve hızlı sipariş butonları sadeleştirildi, mobilde ve masaüstünde sipariş verme akışı hızlandırıldı.",
        ],
      },
      {
        title: "Ana Sayfa Vitrin Kartı ve Katalog Görünümü İyileştirildi",
        category: "İyileştirme",
        details: [
          "Ana sayfa tepe başlığı ve açıklaması, Google'da en çok aranan 'Elektrikli Motorlu Hasta Karyolaları & Evde Bakım Hasta Yatakları' sorgularını ve Alman motor teknolojisi güvencesini tam karşılayacak kurumsal ve güçlü bir dille güncellendi.",
          "Mobil ekranlarda ana sayfa tepe rozet metni ('Ankara | Aynı Gün Ücretsiz Teslimat & Kurulum') tek satıra sığacak şekilde optimize edildi; iki satıra bölünme ve görsel taşma sorunu çözüldü.",
          "Telefon ve tabletlerde sayfa uzunluğunu gereksiz artıran tepe vitrin ürün kartı alanı mobilde gizlendi; mobil ziyaretçilerin doğrudan ana başlıktan, hızlı arama ve danışma butonlarından popüler kategori ve ürünlere akması sağlandı.",
          "Ekranın sağ alt köşesinde yer alan sabit destek butonu üst menüyle uyumlu kapsül tasarımına dönüştürüldü; sayfa açıldıktan sonra otomatik genişleyerek açık kalması ve tıklandığında açılıp kapanabilen canlı danışma penceresi korundu.",
          "Ana sayfa vitrin öne çıkan ürün kartında iç ve dış köşe kavisleri milimetrik olarak dengelendi; kart çerçevesi ile işlem butonunun köşe açıları birbiriyle uyumlu ve paralel hale getirildi.",
          "Vitrin ürün görseli üzerindeki mükerrer yazı ve rozetler temizlenerek ürün fotoğraflarının net ve ferah sergilenmesi sağlandı.",
          "Katalog ürün listeleme alanında masaüstü varsayılan sıralama 4'lü vitrin düzenine ayarlandı; müşterilerin sayfayı kaydırmadan daha fazla ürünü bir arada görmesi sağlandı.",
        ],
      },
      {
        title: "Mobil Mağaza Menüsü Baştan Tasarlandı",
        category: "İyileştirme",
        details: [
          "Telefon ve tabletlerden bağlanan müşteriler için açılır menü ferah ve yalın bir düzene kavuşturuldu, kategori geçişleri akıcı hale getirildi.",
          "7/24 çağrı ve WhatsApp sipariş bağlantıları tek dokunuşla ulaşılabilecek şekilde öne çıkarıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.63",
    date: "16 Eylül 2026",
    summary:
      "Mağaza alt bilgi alanının üstünde yer alan ve sayfa içeriği ile güven rozetleri arasında görsel kopukluğa yol açan boş şerit tamamen giderildi. Sayfa akışı ile Ankara içi teslimat, 2 yıl garanti ve 7/24 destek kartları kusursuz bir kurumsal bütünlükle birleştirildi.",
    items: [
      {
        title: "Alt Bilgi ve Güven Rozetleri Görsel Düzeni İyileştirildi",
        category: "Tasarım",
        details: [
          "Sayfa sonu ile teslimat ve garanti güvencelerini gösteren 3'lü kart alanı arasındaki fazladan boşluk kaldırılarak daha akıcı ve şık bir vitrin geçişi sağlandı.",
          "Mobil ve masaüstü cihazlarda alt gezinme çubuğu ile mağaza içeriği arasındaki dikey denge optimize edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.62",
    date: "16 Eylül 2026",
    summary:
      "Tek motorlu ekonomik modeller ile 1, 2, 3, 4 ve 5 motorlu karyolaların eksiksiz seçim matrisi ve Ankara merkezli acil aynı gün teslimat/lojistik rehberleri mağazaya kazandırıldı. Bilkent ve Etlik Şehir Hastaneleri taburculuklarında adrese 2 saatte doğrudan montaj, apartman mimarisi ve SGK heyet raporu rehberleri yayınlandı.",
    items: [
      {
        title: "Tek Motorlu Karyola ve Kapsamlı Motor Karşılaştırma Rehberleri",
        category: "Yeni",
        details: [
          "Geçici ortopedik nekahat süreçleri için tek motorlu ve manuel krank mekanizmalı modellerin klinik kullanım kılavuzu yayınlandı.",
          "1, 2, 3, 4 ve 5 motorlu modellerin tüm teknik, mekanik ve refakatçi ergonomisi farklarını ortaya koyan büyük karar matrisi eklendi.",
        ],
      },
      {
        title: "Ankara ve Yakın Çevre Acil Medikal Lojistik Rehberleri",
        category: "Yeni",
        details: [
          "Bilkent ve Etlik Şehir Hastaneleri taburculuklarıyla senkronize 2-4 saat içinde adrese ücretsiz kurulum ve refakatçi eğitimi süreci rehberleştirildi.",
          "Hafta sonu ve nöbetçi medikal arayışında olan aileler için 81 il acil sevkiyat ağı ve kapıda güvenli ödeme standartları belgelendi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.61",
    date: "16 Eylül 2026",
    summary:
      "Hasta yataklarında 2 motorlu ev tipi, 3 motorlu asansörlü, 4 motorlu yoğun bakım ve 5 motorlu otomatik sağa-sola dönüş (lateral tilt) teknolojilerini kapsayan 4 adet amiral gemisi rehber makale ansiklopedik derinlikte (her biri 2.000–2.500+ kelime) güncellendi. Hasta yakınları ve refakatçiler için omurga ergonomisi, güvenli transfer protokolleri, teknik karşılaştırma tabloları ve klinik soru-cevaplar mağazaya kazandırıldı.",
    items: [
      {
        title: "Amiral Gemisi Hasta Yatağı Rehberlerinin Ansiklopedik Genişletilmesi",
        category: "Yeni",
        details: [
          "2, 3, 4 ve 5 motorlu karyola modellerimizin klinik açılandırmalarını, refakatçi bel sağlığını koruma yöntemlerini ve düşme önleme standartlarını anlatan 4 adet kapsamlı ana rehber yayınlandı.",
          "Her rehbere detaylı teknik karşılaştırma tabloları, şasi metalurjisi, elektrik güvenlik standartları ve 10'ar maddelik ayrıntılı sıkça sorulan sorular bölümü eklendi.",
        ],
      },
      {
        title: "İleri Düzey Yoğun Bakım ve Otomatik Dönüş Teknolojileri Kılavuzu",
        category: "İyileştirme",
        details: [
          "Yoğun bakımdan eve taburcu olan hastalar için Trendelenburg, kardiyak koltuk pozisyonu ve acil durum mekanik kalp masajı (CPR) fonksiyonlarının hayati önemi detaylandırıldı.",
          "ALS ve ağır yatalak hastalar için gece uykusunda hastayı insan eli değmeden sağa ve sola çeviren 5 motorlu otomatik rotasyon ve akciğer sekresyon drenajı teknolojisi rehberleştirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.60",
    date: "16 Eylül 2026",
    summary:
      "Havalı yataklar (antidekübit bası yarası önleme) ile hasta yatağı kiralama ve satın alma karşılaştırması üzerine 2 adet yeni klinik rehber makale yayınlandı. Mağaza içi arama motoruna 'kiralık hasta yatağı', 'havalı yatak' ve 'yatak yarası' gibi aramalara özel akıllı niyet yönlendirmeleri, rehber kısayolları ve canlı WhatsApp danışma desteği kazandırıldı.",
    items: [
      {
        title: "Havalı Yatak ve Antidekübit Yara Önleme Modelleri Rehberi",
        category: "Yeni",
        details: [
          "Boru tipi ve baklava tipi havalı yatakların bası yarası (dekübitüs) önleme farklarını, ventilasyon mikro hava üfleme teknolojisini ve A/B dalgalı basınç çalışma prensiplerini anlatan kapsamlı rehber yayınlandı.",
          "Hücre yüksekliği, taşıma kapasitesi ve kompresör sessizlik kriterlerini listeleyen detaylı teknik karşılaştırma tablosu içeriğe eklendi.",
        ],
      },
      {
        title: "Hasta Yatağı Kiralama ve Satın Alma Karşılaştırma Rehberi",
        category: "Yeni",
        details: [
          "Geçici nekahat süreçleri ile kronik bakım hastaları için kiralama ve satın alma maliyetlerini karşılaştıran ekonomik analiz rehberi hazırlandı.",
          "İkinci el yataklardaki bakteriyel kontaminasyon ve motor yorgunluğu risklerine karşı sıfır şilte ve medikal dezenfeksiyon standartları açıklandı.",
        ],
      },
      {
        title: "Arama Motorunda Kiralama ve Havalı Yatak Akıllı Niyeti",
        category: "İyileştirme",
        details: [
          "Ziyaretçiler mağazada 'kiralık hasta yatağı' veya 'havalı yatak' araması yaptığında ilgili rehber makalelere, kiralama prosedürüne ve canlı WhatsApp hattına tek tıkla ulaşabilecekleri özel niyet vitrini devreye alındı.",
          "Arama terimleri otomatik eşleşmeyle tüm hasta karyolaları ve medikal destek ürünleriyle senkronize edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.59",
    date: "16 Eylül 2026",
    summary:
      "Hasta yatakları ve hasta karyolası arayan ziyaretçiler için 5 adet kapsamlı, klinik onaylı ve satın alma/kiralama rehberi niteliğinde SEO makalesi yayınlandı. Tek motorlu, çift motorlu, 3 motorlu asansörlü ve 4 motorlu Trendelenburg karyolaların teknik karşılaştırma tabloları, refakatçi ergonomisi ve canlı WhatsApp danışma butonları doğrudan makale içeriklerine entegre edildi.",
    items: [
      {
        title: "Kapsamlı Hasta Yatağı ve Karyolası Seçim Rehberi (2026)",
        category: "Yeni",
        details: [
          "Ev tipi ve hastane tipi elektrikli hasta karyolaları arasındaki farkları, ABS ve ahşap gövde avantajlarını anlatan rehber makale yayınlandı.",
          "Hasta konforu ve bası yarası önleme kriterlerini detaylandıran karşılaştırmalı teknik tablo makaleye dahil edildi.",
        ],
      },
      {
        title: "Motor Sayılarına Göre Ayrıntılı Karyola İncelemeleri",
        category: "Yeni",
        details: [
          "Tek motorlu ve manuel karyolaların hangi hafif nekahat hastaları için yeterli olduğunu açıklayan detaylı analiz eklendi.",
          "Çift motorlu (2 motorlu) sırt ve ayak hareketli karyolaların Fowler pozisyonu ve kan dolaşımı faydaları incelendi.",
          "Üç motorlu (3 motorlu) asansörlü modellerin hasta bakıcılarının bel fıtığı ve sakatlık riskini nasıl önlediği açıklandı.",
          "Dört motorlu (4 motorlu) Trendelenburg ve kardiyak koltuk özellikli yoğun bakım ve Alman Burmeier Dali modelleri rehberleştirildi.",
        ],
      },
      {
        title: "Doğrudan Ürün ve Canlı WhatsApp Danışma Entegrasyonu",
        category: "İyileştirme",
        details: [
          "Tüm makalelerin içerisine ilgili MCARIS ürün bağlantıları ve Ankara içi aynı gün teslimat sağlayan doğrudan WhatsApp uzman danışma hattı yerleştirildi.",
          "Yayınlanan tüm makaleler arama motoru dizini ve site haritası (sitemap.xml) ile tam senkronize edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.58",
    date: "16 Eylül 2026",
    summary:
      "Mağaza içi arama motoru, marka sorguları ve sektörel arama terimleri için baştan sona yenilendi. 'mcaris' marka aramasında tüm ürünlerin eksiksiz listelenmesi, 'hastane yatağı' ve 'hasta karyolası' gibi farklı müşteri arama terimlerinin doğru ürünlerle anında eşleşmesi sağlandı; arama sonuçları sayfasına zengin niyet kartları, hızlı motor filtreleri ve müşteri danışma desteği kazandırıldı.",
    items: [
      {
        title: "MCARIS Marka Araması ve Akıllı Katalog Vitrini",
        category: "Yeni",
        details: [
          "Müşteriler mağaza içi arama kutusuna doğrudan 'mcaris' veya 'mcaris medikal' yazdığında boş sonuçla karşılaşma sorunu giderildi; resmi marka sorgusu olarak algılanarak tüm popüler ürünlerin ve ana kategorilerin vitrinde eksiksiz sergilenmesi sağlandı.",
          "Canlı arama açılır penceresinde marka araması yapan ziyaretçilere resmi üretici kataloğu hızlı erişim seçenekleriyle sunuldu.",
        ],
      },
      {
        title: "Sektörel ve Halk Dili Arama Eşleştirmesi (Hastane Yatağı & Karyola)",
        category: "İyileştirme",
        details: [
          "Müşterilerin günlük dilde sıkça kullandığı 'hastane yatağı', 'hastane karyolası', 'havalı yatak' veya 'muayene sedyesi' gibi terimler sistem tarafından akıllıca algılanarak mağazadaki tüm ilgili hasta yatakları ve klinik mobilyalarının eksiksiz listelenmesi sağlandı.",
          "Türkçe ses ve ek uyumundaki yumuşamalar ('yatağı', 'karyolası', 'koltuğu') otomatik olarak kök kelimelerle eşleştirilerek hiçbir ürünün arama dışı kalmaması garanti altına alındı.",
        ],
      },
      {
        title: "Arama Sonuç İçeriği ve Akıllı Niyet Yönlendirmeleri",
        category: "Tasarım",
        details: [
          "Arama sonuçları sayfasının üst kısmına aranan ürün grubunu özetleyen kurumsal niyet paneli eklendi; ziyaretçilere motor seçeneklerine göre (2 motorlu, 3 motorlu, 4 motorlu) hızlı filtreleme butonları sunuldu.",
          "Aranan terimle doğrudan eşleşen ana kategoriye tek tıkla geçiş imkanı sağlandı.",
        ],
      },
      {
        title: "Sonuç Bulunamayan Aramalarda Zengin Müşteri Desteği",
        category: "İyileştirme",
        details: [
          "Yazım yanlışı yapılan veya sonuç bulunamayan aramalarda düz ve soğuk boş sayfa gösterimi kaldırıldı; yerine popüler arama etiketleri, ana kategori kısayolları ve tek tıkla uzman desteği sağlayan canlı WhatsApp danışma hattı yerleştirildi.",
          "Ziyaretçilerin siteden ayrılmasını önlemek amacıyla popüler ürün önerileri ve rehber yönlendirmeleri devreye alındı.",
        ],
      },
      {
        title: "Google Arama Motoru Görünürlüğü ve Doğrulama Entegrasyonu",
        category: "Altyapı",
        details: [
          "Mağaza genelinde 'mcaris', 'mcaris medikal', 'hastane yatağı' ve 'hasta karyolası' terimleri arama motoru dizinine güçlü şekilde işlendi.",
          "Yönetim panelinden girilen Google arama motoru doğrulama kodlarının ve özel arama anahtar kelimelerinin mağazada anında geçerli olması sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.57",
    date: "16 Eylül 2026",
    summary:
      "Arama motoru güvenliği ve mağaza prestiji kapsamında alt bilgi (footer) harici bağlantı havuzları temizlendi; sitenin Google spam algoritmalarından korunması sağlandı.",
    items: [
      {
        title: "Google SEO Güvenliği ve Harici Script Temizliği",
        category: "Güvenlik",
        details: [
          "Alt bilgi alanındaki harici script bağlantısı kaldırıldı; mağazanın Google arama motoru dizinleme sağlığı ve kurumsal marka güvenilirliği koruma altına alındı.",
          "Alt bilgi navigasyonu sadeleştirilerek yalnızca resmi yasal sözleşmeler ve kurumsal bağlantılar bırakıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.56",
    date: "16 Eylül 2026",
    summary:
      "Ürün Yönetim Merkezi listesine KDV sütunu eklendi; yöneticiler ürün detayına girmeden her satırdan KDV oranını anında güncelleyebilir.",
    items: [
      {
        title: "Ürün Listesinde Satır İçi KDV Güncelleme",
        category: "İyileştirme",
        details: [
          "Ürün listesi tablosuna KDV sütunu eklendi.",
          "Mağaza varsayılanı, %20, %10, %1 ve %0 seçenekleriyle ürünün KDV oranı ürün kartını açmadan değiştirilebilir hale getirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.55",
    date: "16 Eylül 2026",
    summary:
      "Mağaza yönetim paneline tam yetkili yeni bir yönetici hesabı tanımlandı; operasyon ekibinin admin paneline güvenli giriş yapabilmesi sağlandı.",
    items: [
      {
        title: "Yeni Tam Yetkili Yönetici Hesabı",
        category: "Altyapı",
        details: [
          "figen@mcaris.com.tr adresiyle tam yetkili (ADMIN) yönetici hesabı oluşturuldu.",
          "Hesap canlı sistemde aktif edildi; yönetim paneline bu e-posta ile giriş yapılabilir.",
        ],
      },
    ],
  },
  {
    version: "v2.9.54",
    date: "15 Eylül 2026",
    summary:
      "Mağaza genelinde müşteri verilerinin gizliliği, yönetici paneli erişim güvenliği, sipariş takip emniyeti ve arama motoru katalog uyumu en üst standartlara kavuşturuldu. Müşteri sipariş ve adres bilgilerinin yetkisiz erişimlere karşı korunması sağlandı, kullanıcı yorumlarına satın alma doğrulaması getirilerek vitrin güvenilirliği pekiştirildi, Google Alışveriş ürün beslemelerindeki kargo tutarları mağazanın güncel kargo barajıyla tam senkronize hale getirildi.",
    items: [
      {
        title: "Müşteri Kişisel Verileri ve Sipariş Takip Emniyeti",
        category: "Güvenlik",
        details: [
          "Sipariş takip ekranında müşteri ev adresleri ve iletişim bilgileri koruma altına alındı; halka açık sorgularda sokak ve kapı numaraları gizlenerek yalnızca ilçe ve şehir düzeyinde güvenli teslimat bilgisi gösterildi.",
          "Sipariş durumunu sorgulayan müşterilerin yalnızca kendi siparişlerine erişebilmesi sağlandı; üçüncü şahısların rastgele telefon sorgulamalarıyla müşteri detaylarına ulaşması kesin olarak engellendi.",
        ],
      },
      {
        title: "Yönetici Paneli ve Sistem Erişim Yetkilendirmesi",
        category: "Güvenlik",
        details: [
          "Yönetim paneline giriş kontrolleri kökten sağlamlaştırılarak yetkisi değiştirilmiş veya sonlandırılmış hesapların anında güvenli çıkış yapması sağlandı.",
          "Görsel ve fatura yükleme alanlarında yalnızca onaylı ve güvenli dosya formatlarının kabul edilmesi sağlanarak dış tehditlere karşı tam koruma sağlandı.",
        ],
      },
      {
        title: "Kullanıcı Yorumları ve Doğrulanmış Müşteri Rozeti",
        category: "İyileştirme",
        details: [
          "Ürün sayfalarındaki 'Doğrulanmış Alıcı' rozeti yalnızca ürünü gerçekten satın almış müşterilere otomatik atanacak şekilde güvenceye alındı.",
          "Yetkisiz ve sahte değerlendirmelerin mağaza vitrinine doğrudan yansıması engellendi; mağaza yönetiminin onay sürecine bağlandı.",
        ],
      },
      {
        title: "Google Alışveriş Beslemesi ve Kargo Eşitlemesi",
        category: "Altyapı",
        details: [
          "Google Alışveriş ve dijital pazar yeri katalog beslemelerindeki teslimat tutarları mağazanın güncel kargo politikasıyla birebir uyumlu hale getirildi.",
          "Katalog sistemindeki kargo hesaplaması mağaza kasasıyla eşitlenerek arama motoru ile sipariş adımları arasındaki fiyat uyumsuzlukları kalıcı olarak giderildi.",
        ],
      },
      {
        title: "Veritabanı Hızlandırma ve Arama Motoru İndeks Düzeni",
        category: "Altyapı",
        details: [
          "Katalogda yüzlerce ürün ve sipariş biriktiğinde mağazanın yavaşlamasını önleyen akıllı veri düzeni devreye alındı; ürün listeleme ve kategori açılış hızları hissedilir şekilde artırıldı.",
          "Motor sayısına göre filtrelenen hasta yatağı modellerinin Google arama sonuçlarında doğru ve özgün başlıklarla listelenmesi temin edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.53",
    date: "11 Eylül 2026",
    summary:
      "Mağaza içi gezinme deneyimi ve sayfa geçiş hızı en üst seviyeye taşındı. Müşterilerin ürünlere, kategorilere veya menülere tıkladığı anda sistemin hemen yanıt verdiğini gösteren akıllı üst ilerleme göstergesi devreye alındı. Sayfa geçişlerindeki donma ve bekleme hissi tamamen ortadan kaldırılarak mağaza vitrini çok daha seri ve akıcı hale getirildi.",
    items: [
      {
        title: "Anında Tıklama Algılama ve Akıllı Üst İlerleme Göstergesi",
        category: "İyileştirme",
        details: [
          "Müşterilerin herhangi bir ürüne, kategoriye veya menü butonuna tıkladığı anda ekranın en üstünde beliren kurumsal turkuaz ilerleme çubuğu devreye alındı.",
          "Tıklamanın sisteme ulaştığı anında görsel olarak teyit edilerek müşterilerin 'tıkladım mı, sayfa dondu mu?' tereddüdü ve mükerrer tıklamaları tamamen önlendi.",
        ],
      },
      {
        title: "Sayfa Geçişlerinde Kesintisiz Yükleme ve Vitrin Akıcılığı",
        category: "Altyapı",
        details: [
          "Mağaza sayfaları arasında dolaşırken ekranın kilitlenmesini önleyen akıllı yükleme mimarisi entegre edildi; yeni sayfa hazırlanırken ekranda zarif bir geçiş sağlandı.",
          "Önemli kategori ve ürün bağlantılarının arka planda hazır tutulması sağlanarak tıklanan sayfaların çok daha seri açılması temin edildi.",
        ],
      },
      {
        title: "Mobil Menü ve Dokunmatik Geri Bildirim Güçlendirmesi",
        category: "İyileştirme",
        details: [
          "Mobil cihazlardan alışveriş yapan müşteriler için alt gezinme butonlarına anlık dokunma hissi kazandırıldı.",
          "Telefon ve tabletlerde sepet, favoriler ve ürün menüleri arasındaki geçişler pürüzsüzleştirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.52",
    date: "11 Eylül 2026",
    summary:
      "Mağaza güvenlik altyapısı, kupon yönetimi, teslimat notları ve sipariş tamamlama süreçleri baştan sona denetlenerek güçlendirildi. Panelden tanımlanan indirim kuponlarının sepette anında ve hatasız çalışması sağlandı; müşterilerin girdiği özel teslimat ve montaj notlarının kargo operasyonuna eksiksiz iletilmesi güvenceye alındı; kartlı ödemeler sonrasında sepetin otomatik sıfırlanması ve şoför canlı takip sisteminin yetkilendirilmesi tamamlandı.",
    items: [
      {
        title: "İndirim Kuponlarının Mağaza ve Sepetle Tam Entegrasyonu",
        category: "Düzeltme",
        details: [
          "Yönetim panelinden tanımlanan tüm indirim kuponlarının, sepet ve ödeme aşamasında anında doğrulanabilmesi sağlandı; müşterilerin geçerli kupon kodlarında geçersiz uyarısı alması sorunu tamamen çözüldü.",
          "İndirim tutarlarının kuruş bazlı hesaplanması güvenceye alınarak kasa ve muhasebe tutarlılığı pekiştirildi.",
          "Mağaza başlangıç kuponları veritabanı sistemine işlenerek yönetim panelinden kolayca güncellenebilir hale getirildi.",
        ],
      },
      {
        title: "Müşteri Sipariş ve Montaj Notlarının Korunması",
        category: "İyileştirme",
        details: [
          "Ödeme adımında müşterilerin girdiği kat, asansör bilgisi ve teslimat tercihleri gibi kritik notların sipariş adresine otomatik iliştirilmesi sağlandı.",
          "Teknik teslimat ekibimizin ve montaj personelimizin müşteri notlarını doğrudan sipariş fişinde görmesi temin edildi.",
        ],
      },
      {
        title: "Kartlı Ödemelerde Sepet Sıfırlama ve Temizlik Süreci",
        category: "İyileştirme",
        details: [
          "Güvenli kart ödemesini tamamlayarak sipariş onay sayfasına ulaşan müşterilerin tarayıcı sepetinin anında sıfırlanması sağlandı.",
          "Satın alma işlemi biten ürünlerin sepet çekmecesinde takılı kalması ve mükerrer sipariş kafa karışıklığı tamamen giderildi.",
        ],
      },
      {
        title: "Sipariş Takip ve İdari Panel Güvenlik Kalkanı",
        category: "Güvenlik",
        details: [
          "Şoför canlı konum ve teslimat durumu bildirim kanalı koruma altına alındı; yalnızca yetkili personelin teslimat durumunu değiştirebilmesi güvenceye alındı.",
          "Kullanıcı giriş ekranındaki yönlendirmelere güvenlik filtresi eklenerek müşterilerin harici bağlantılara yönlendirilme riski ortadan kaldırıldı.",
          "Blog ve medya yönetim ekranlarında tarayıcı kutucukları yerine modern kurumsal onay pencereleri devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.51",
    date: "11 Eylül 2026",
    summary:
      "Hasta karyolası satış ve kiralama fiyat tablosu güncellendi; 3.500 ₺ ve 4.500 ₺'lik 2 motorlu modeller listeden çıkarıldı, asansörlü 3 motorlu aylık kiralama 8.500 ₺'ye, 4 motorlu yoğun bakım ve Burmeier Dali kiralama bedelleri 10.500 ₺'ye yükseltildi.",
    items: [
      {
        title: "Kiralama Matrisinde Model ve Fiyat Güncellemesi",
        category: "İyileştirme",
        details: [
          "Ana sayfa ve Ankara hasta yatağı sayfasındaki fiyat tablosundan Ekonomik Ev Tipi 2 Motorlu (3.500 ₺/Ay) ile Standart ABS Tabancalı 2 Motorlu (4.500 ₺/Ay) satırları kaldırıldı.",
          "Asansörlü Profesyonel 3 Motorlu aylık kiralama bedeli 8.500 ₺ olarak güncellendi.",
          "Full Fonksiyon Yoğun Bakım 4 Motorlu ve Lüks Ahşap Baza & Burmeier Dali aylık kiralama bedelleri 10.500 ₺ olarak eşitlendi.",
          "Net satış fiyat aralıkları bu sürümde değiştirilmedi; sonraki güncellemede ayrıca netleştirilecek.",
        ],
      },
    ],
  },
  {
    version: "v2.9.50",
    date: "10 Eylül 2026",
    summary:
      "Altbilgi alanına Ankara'nın tüm ilçelerini kapsayan kurumsal teslimat ve montaj güvencesi yerleştirildi; müşterilerde tek bir semte sıkışmışlık algısı tamamen önlenirken, 25 ilçenin tamamında gün içinde adrese teslimat, yerinde montaj ve teknik destek ağı vitrine taşındı.",
    items: [
      {
        title: "Tüm Ankara İlçelerini Kapsayan Hızlı Teslimat ve Kurulum Ağı",
        category: "İyileştirme",
        details: [
          "Sitenin en alt bilgi alanına 'Tüm Ankara İlçelerine Aynı Gün Teslimat & Kurulum' ana bağlantısı yerleştirildi; mağazamızın yalnızca belirli semtlerle sınırlı kalmadığı, başkentin tüm noktalarına ulaştığı kurumsal olarak vurgulandı.",
          "Çankaya, Keçiören, Yenimahalle, Mamak, Etimesgut, Sincan ve Gölbaşı başta olmak üzere Ankara'nın 25 ilçesinin tamamına yönelik hasta yatağı satışı, kiralama ve teknik servis sayfaları tek tıkla ulaşılabilir hale getirildi.",
          "Hasta yakınlarının bulundukları ilçeden mağazamıza ulaştıklarında doğrudan kendi bölgelerine özel gün içi adrese teslimat, yerinde kurulum ve teknik destek imkanlarını görebilmeleri sağlandı; kesin saat sözü verilmeden dürüst ve şeffaf hizmet bilgisi sunuldu.",
        ],
      },
      {
        title: "Resmi Ödeme ve Güvenlik Kuruluşu Güvencesi",
        category: "Güvenlik",
        details: [
          "Altbilgiye lisanslı ödeme kuruluşu PayTR, yerli kartımız Troy, Visa ve Mastercard logoları ile 256-Bit SSL şifreleme rozetleri yerleştirildi.",
          "Müşterilere kart ödemelerinin Merkez Bankası lisanslı resmi kuruluş güvencesinde ve banka onaylı koruma altında yapıldığını bildiren kurumsal güvence metni sunuldu; satın alma tereddütleri en aza indirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.49",
    date: "10 Eylül 2026",
    summary:
      "PayTR resmi sanal POS entegrasyonu canlı modda devreye alındı; müşteriler için tüm banka ve kredi kartlarına 3D Secure güvencesiyle tek çekim ve 12 aya varan taksitli ödeme altyapısı aktif edildi, sipariş onayları ve stok düşümleri tam otomatik hale getirildi.",
    items: [
      {
        title: "Canlı Sanal POS ve Taksitli Güvenli Ödeme Altyapısı",
        category: "Yeni",
        details: [
          "Onaylanan resmi PayTR mağaza bilgileriyle sanal POS altyapısı canlı modda devreye alındı; mağazamız tüm banka ve kredi kartlarından (Bonus, Maximum, World, Axess, CardFinans, Paraf, Troy vb.) tek çekim ve 12 aya varan taksit seçenekleriyle ödeme almaya başladı.",
          "Ödeme aşamasında 256-Bit SSL şifreleme ve banka SMS onaylı 3D Secure güvenlik adımları kurularak müşterilere en üst düzeyde satın alma güveni sağlandı.",
          "Müşteriler sipariş tamamlama adımında kesintisiz, mobil uyumlu ve şık PayTR ödeme ekranı üzerinden işlemlerini kolayca tamamlayabiliyor.",
        ],
      },
      {
        title: "Otomatik Sipariş Onayı, Stok Yönetimi ve Canlı Bildirimler",
        category: "Altyapı",
        details: [
          "Kart ödemesi bankadan onaylandığı anda sistem ödemeyi otomatik doğrulayarak sipariş durumunu anında 'Tahsil Edildi' konumuna getiriyor.",
          "Satın alınan medikal ürünlerin stok adetleri sistem tarafından otomatik olarak düşürülüyor; mükerrer çekim ve stok çakışması riskleri tamamen önlendi.",
          "Başarılı ödemenin ardından hem alıcı müşteriye hem de mağaza operasyon ekibine detaylı sipariş onay e-postaları anlık olarak iletiliyor.",
          "Mağaza yönetim panelindeki Ödemeler ekranına PayTR işlem referans numaraları entegre edildi; yöneticiler tahsilat detaylarını tek ekrandan canlı olarak takip edebiliyor.",
        ],
      },
    ],
  },
  {
    version: "v2.9.48",
    date: "9 Eylül 2026",
    summary:
      "Ürün satın alma ve sepet alanında yer alan, şehir dışı müşterilerde 'sadece Ankara'ya mı hizmet veriliyor?' tereddüdü yaratan yerel teslimat mesajları temizlendi. Yerine 81 ilin tamamına hitap eden kurumsal ve güvenli sevkiyat mesajları yerleştirilerek Türkiye genelindeki satış kayıplarının önüne geçildi.",
    items: [
      {
        title: "Şehir Dışı Müşterilerde Satın Alma Güveninin Artırılması",
        category: "İyileştirme",
        details: [
          "Sepete ekleme butonunun altındaki güven alanından yalnızca Ankara'ya işaret eden kısıtlayıcı montaj mesajı kaldırıldı; yerine tüm Türkiye'ye özenli ve güvenli sevkiyat yapıldığını açıkça belirten kurumsal güven rozeti yerleştirildi.",
          "Fiyat ve sipariş kutularındaki bölgesel teslimat ifadeleri genel sevkiyat standardına dönüştürülerek İstanbul, İzmir, Bursa, Antalya başta olmak üzere 81 ilden gelen ziyaretçilerin tereddütsüz sipariş vermesi sağlandı.",
          "Müşterilerin satış temsilcisine tek tıkla ulaştığı WhatsApp danışma hattında, teslimat sürecine dair hazır mesaj şablonu tüm Türkiye operasyonunu kapsayacak şekilde profesyonelleştirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.47",
    date: "9 Eylül 2026",
    summary:
      "Ürün yönetim sistemine 'Stokta Yok' seçeneği kazandırıldı; stokta olmayan ürünlerde olumsuz uyarılar yerine müşteriyi doğrudan WhatsApp danışma hattına bağlayan, ürün adı ve kodunu hazır mesajla ileten kurumsal 'Stok Sor' butonu devreye alındı.",
    items: [
      {
        title: "Yönetim Paneline 'Stokta Yok' Seçeneği ve Hızlı Stok Yönetimi",
        category: "Yeni",
        details: [
          "Ürün ekleme ve düzenleme ekranına 'Stok Durumu Seçeneği' eklendi; mağaza yöneticisi dilediği ürünü tek tıkla 'Stokta Var' veya 'Stokta Yok (Stok Sor)' moduna alabiliyor.",
          "Stokta Yok seçildiğinde stok miktarı otomatik olarak pasife alınıp güvenle kaydediliyor; istendiğinde tekrar stok adedi girilerek tek tıkla satışa açılabiliyor.",
          "Ürün listesi ekranında ve toplu işlem penceresinde seçilen birden fazla ürün tek tıkla 'Stokta Yok (Stok Sor)' durumuna getirilebiliyor.",
        ],
      },
      {
        title: "Müşteri Arayüzünde WhatsApp 'Stok Sor' Entegrasyonu",
        category: "İyileştirme",
        details: [
          "Stokta olmayan ürünlerde soğuk ve olumsuz 'Tükendi' ibareleri kaldırılarak yerine doğrudan WhatsApp temsilcisine bağlayan yeşil 'Stok Sor' butonu yerleştirildi.",
          "Müşteri butona bastığında ürünün adı ve ürün kodu WhatsApp mesajında otomatik hazır olarak açılıyor; müşteri tekrar yazmakla uğraşmadan hemen bilgi alabiliyor.",
          "Kategori sayfalarında ve vitrin kartlarında ürünün durumu şık 'Stok Sor' rozetiyle gösterilerek müşteri deneyimi ve dönüşüm oranı artırıldı.",
          "Akıllı telefonlarda ekranın altında sabit duran hızlı işlem çubuğunda da 'Stok Sor' butonu aktif çalışacak şekilde uyarlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.46",
    date: "8 Eylül 2026",
    summary:
      "Mağaza yönetim panelinde ve genel arayüzde yer alan işletim sistemine bağımlı renkli emojiler kaldırılarak yerlerine modern, yüksek çözünürlüklü ve kurumsal tasarım diliyle uyumlu vektörel UI ikonları entegre edildi; yönetim ekranlarında tam görsel tutarlılık ve profesyonel standart sağlandı.",
    items: [
      {
        title: "Yönetim Paneli Arayüzünde Kurumsal İkon Standardizasyonu",
        category: "Tasarım",
        details: [
          "Yönetim panelinde mağaza ayarları, vitrin düzenleme, ürün kataloğu, sipariş operasyonları ve kupon yönetimi ekranlarında bulunan tüm işletim sistemi emojileri temizlendi.",
          "Toplu ürün güncelleme, kategori taşıma, stok düzenleme, sipariş kargolama ve e-fatura butonlarına modern, yüksek çözünürlüklü vektörel simgeler kazandırıldı.",
          "Farklı işletim sistemlerinde (Windows, Mac, iOS, Android) renk ve biçim tutarsızlığı yaratan emoji görünümü yerine, her cihaz ve ekranda aynı kurumsal kaliteyi sunan standart simge yapısı devreye alındı.",
          "Sistem durumu ve yayında/pasif göstergeleri göz yormayan, modern ve şık durum rozetleriyle yenilendi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.45",
    date: "8 Eylül 2026",
    summary:
      "Anasayfa vitrin alanının sağ tarafında yer alan 4 model sekmesine katalogdan tek tıkla ürün seçme ve tüm teknik detayları otomatik doldurma yeteneği kazandırıldı; anasayfadaki Günün Fırsatı alanı yönetim paneline bağlanarak kampanya ürünü, indirimli fiyat, sayaç süresi ve anlık canlı vitrin önizlemesiyle birlikte tamamen yönetilebilir hale getirildi.",
    items: [
      {
        title: "Hero Sağ Vitrin Kartlarına Katalogdan Otomatik Ürün Seçici",
        category: "Yeni",
        details: [
          "Yönetim paneli Hero & Vitrin ayarları ekranına akıllı katalog ürün seçicisi entegre edildi; mağaza yöneticisi listeden bir ürün seçtiğinde başlık, alt başlık, sayfa linki, görsel ve teknik donanım maddeleri anında otomatik dolduruluyor.",
          "Ürün seçildiğinde sistem motor sayısını, serisini ve öne çıkan niteliklerini otomatik algılayarak kart başlıklarını en uygun biçimde hazırlıyor.",
          "Otomatik doldurulan tüm alanlar istendiğinde mağaza yöneticisi tarafından serbestçe düzenlenebilir ve özelleştirilebilir olmaya devam ediyor.",
          "Görsel seçimi medya kütüphanesiyle tam entegre çalışacak şekilde güçlendirildi; katalog dışı özel afiş veya kampanya görselleri de rahatlıkla atanabiliyor.",
        ],
      },
      {
        title: "Günün Fırsatı (Deal of the Day) Alanının Yönetim Paneline Bağlanması",
        category: "Yeni",
        details: [
          "Anasayfada yer alan ve önceden sabit duran Günün Fırsatı kampanya alanı yönetim panelinde özel bir sekmeye kavuşturuldu; hangi ürünün kampanya ürünü olacağı mağaza yöneticisinin tam kontrolüne verildi.",
          "Katalogdan kampanya ürünü seçildiğinde ürünün adı, görseli ve normal liste fiyatı otomatik aktarılıyor; indirimli kampanya fiyatı belirlendiğinde indirim oranı yüzdesi sistem tarafından anında hesaplanıyor.",
          "Günün fırsatı alanı istenildiğinde tek tıkla kapatılarak anasayfadan gizlenebiliyor veya yeni bir kampanya hazırlandığında tek tıkla anında yayına alınabiliyor.",
          "Geri sayım sayacının döngü süresi (saat olarak) yönetim panelinden esnek biçimde ayarlanabiliyor.",
        ],
      },
      {
        title: "Yönetim Paneli İçi Canlı Vitrin Önizleme Ekranı",
        category: "Tasarım",
        details: [
          "Yönetim panelinde Günün Fırsatı ayarları yapılırken, girilen kampanya metinlerinin, sayaç kutusunun, fiyat indiriminin ve görselin anasayfada nasıl duracağını gösteren birebir canlı önizleme vitrini eklendi.",
          "Mağaza yöneticisi yayına almadan önce vitrinin görünümünü anlık olarak kontrol edebilme konforuna kavuştu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.44",
    date: "8 Eylül 2026",
    summary:
      "Mağaza genelinde sabit uygulanan KDV oranları hem genel mağaza ayarlarından hem de her ürünün kendi kartından bağımsız olarak yönetilebilir hale getirildi; tüm ürünler ve kategori sayfalarında motor sayısı ve ürün serisi gibi filtrelerin ürünlerin gerçek özelliklerine göre otomatik yüklenmesi sağlandı ve vitrin tasarımındaki görsel uyumsuzluklar giderildi.",
    items: [
      {
        title: "Yönetilebilir Esnek KDV Sistemi (Mağaza Geneli ve Ürün Bazlı)",
        category: "Yeni",
        details: [
          "Yönetim panelindeki Mağaza Ayarları ekranına 'Genel & KDV Ayarları' bölümü eklendi; mağazanın genel varsayılan KDV oranı (%20, %10, %1 veya %0) tek tıkla belirlenebiliyor.",
          "Ürün ekleme ve düzenleme formlarına KDV seçimi alanı getirildi; farklı vergi dilimine giren ürünler için mağaza varsayılanından bağımsız özel KDV oranı tanımlanabiliyor.",
          "Ürün detay sayfasında ve mağaza vitrininde fiyata dahil olan KDV oranı dinamik olarak müşteriye şeffaf biçimde yansıtılıyor.",
          "Yönetim paneli ürün listesinde her ürünün KDV oranı fiyatının hemen altında açıkça gösterilerek hızlı kontrol imkanı sağlandı.",
        ],
      },
      {
        title: "Dinamik Ürün Filtreleme Sistemi (Motor Sayısı ve Ürün Serisi)",
        category: "İyileştirme",
        details: [
          "Tüm Ürünler ve Kategori sayfalarında sabit filtreler yerine, sayfada yer alan ürünlerin gerçek donanım özelliklerine göre otomatik yüklenen akıllı filtreleme sistemi devreye alındı.",
          "Katalogdaki hasta yataklarının 2, 3 ve 4 motorlu seçenekleri ile Platinum, Gold ve Silver serileri gerçek ürün adetleriyle birlikte filtrelenebiliyor.",
          "Filtre başlıklarının yanında o seçenekte kaç adet ürün bulunduğu anlık olarak gösteriliyor; tek tıkla filtreleri temizleme kolaylığı sağlandı.",
        ],
      },
      {
        title: "Vitrin ve Ürün Sayfası Tasarım Düzeltmeleri",
        category: "Tasarım",
        details: [
          "Ürün detay sayfasında hem üst etiket alanında hem de başlığın altında iki kez tekrarlanan ürün kodu gösterimi sadeleştirildi; başlık altındaki kurumsal rozet korunarak üstteki mükerrer gösterim kaldırıldı.",
          "Ana sayfadaki 'Günün Fırsatı' vitrin kartında görselin etrafında oluşan gereksiz iç boşluklar kaldırıldı, görsel çerçeveyi kenardan kenara dolduracak şekilde modern vitrin standardına getirildi.",
          "Ürün sıralama altyapısında ürünlerin eklenme tarihlerine göre en yeniye doğru kusursuz sıralanması güvenceye alındı.",
        ],
      },
      {
        title: "Pazar Yeri ve Entegrasyon Barkod Standartları (İdefix & Pazarama Tam Uyumluluğu)",
        category: "İyileştirme",
        details: [
          "Pazar yeri entegrasyonlarında uygulanan en az 6 karakter barkod kuralı güvenceye alındı; 5 karakter kalan Herrman etajer ürün kodu 'MC-YME1' olarak 1 karakter artırılarak İdefix ve pazar yeri aktarımlarının reddedilmesi engellendi.",
          "Pazarama ve diğer platformlarda aktarımı durduran boşluklu barkod yapısı giderildi; Birdie transfer lifti kodu 'MC-BIRDIE-EVO' olarak tireli kurumsal formata kavuşturuldu.",
          "Ürün kodu ve katalog akış sistemine tüm barkodların boşluksuz ve en az 6 karakter alfanümerik olmasını sağlayan otomatik güvenlik standardı eklenerek 63 ürünün tamamının pazar yerlerine firesiz aktarımı sağlandı.",
        ],
      },
      {
        title: "Arama Motoru (SEO) ve Filtrelenmiş Sayfa Standartları (Google Uyumluluğu)",
        category: "İyileştirme",
        details: [
          "Seri filtreleri (Platinum, Gold, Silver) seçildiğinde ara yönlendirmeler kaldırılarak doğrudan temiz ve resmi seri adreslerine bağlanması sağlandı; Google tarayıcılarının yönlendirme zincirlerine takılması önlendi.",
          "Kategori ve mağaza sayfalarında motor sayısı seçildiğinde sayfa başlığı ve ana başlık (H1) dinamik olarak '4 Motorlu Hasta Karyolaları' gibi aranma hacmi yüksek ifadelere dönüşerek Google sıralama gücü artırıldı.",
          "Sıralama ve filtre varyasyonlarında arama motoru indeks şişmesini önleyici kurallar devreye alındı; Google'ın sitenin asıl kategorilerini ve ürünlerini en yüksek güçle indekslemesi güvenceye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.43",
    date: "8 Eylül 2026",
    summary:
      "Google reklamları ve ürün listelerinde bazı modellerin ürün kodları yerine karmaşık web linklerinin görünmesi sorunu giderildi; Carine serisi ve eksik kalan tüm ürünlere resmi mağaza kodları tanımlanarak katalogdaki 63 ürünün tamamı eksiksiz ve kurumsal hale getirildi.",
    items: [
      {
        title: "Google Reklam ve Alışveriş Listelerinde Ürün Kodu Düzenlemesi",
        category: "Düzeltme",
        details: [
          "Google Alışveriş ve pazar yeri ürün listelerine ürün aktarılırken, kodu olmayan ürünlerde kod alanına uzun web adreslerinin yazılması engellendi.",
          "Artık tüm ürünler Google ve alışveriş platformlarında kendi resmi ürün kodlarıyla ve düzenli bir şekilde listeleniyor.",
          "Düzenleme öncesinde mağaza veritabanının tam güvenlik yedeği eksiksiz olarak arşivlendi.",
        ],
      },
      {
        title: "Tüm Ürün Kodlarında Kurumsal Tireli Format Standardı (MC-)",
        category: "İyileştirme",
        details: [
          "Tüm ürün kodları aralarında okunaklı tire olacak şekilde (örn. MC-ECO2200, MC-DALI, MC-BAZA2000, MC-CRN001) standartlaştırıldı.",
          "Medikal Kozmetik kategorisindeki 16 adet Carine bakım ürününün tamamına kurumsal MC-CRN001 ile MC-CRN016 arası resmi ürün kodları tanımlandı.",
          "Kodu bulunmayan hasta yatağı, yemek masası, koltuk ve sehpalar için de resmi ürün kodları sisteme işlendi.",
          "Mağazadaki 63 ürünün tamamı artık resmi ve okunaklı MC- ürün koduna sahip; kodsuz veya eksik ürün kalmadı.",
        ],
      },
      {
        title: "İletişim Sayfası Google Haritalar Doğrudan Yol Tarifi",
        category: "İyileştirme",
        details: [
          "İletişim sayfasındaki 'Haritada Yol Tarifi Al' butonu ve harita rozeti, doğrudan MCaris Yenimahalle merkez mağazamıza rota oluşturan resmi Google Haritalar navigasyon bağlantısına bağlandı; müşterilerin tek tıkla mağazamıza rota başlatabilmesi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.42",
    date: "7 Eylül 2026",
    summary:
      "Blog makale kapak görsellerinin Docker persistent volume masking nedeniyle 404 vermesini önleyen statik varlık mimarisi (/images/blog) ve geriye dönük Next.js rewrite kuralları devreye alındı. Tarayıcı Core Web Vitals telemetrisi doğrulandı.",
    items: [
      {
        title: "Blog Görselleri İçin Statik Dizin Ayrımı ve 404 Kök Çözümü",
        category: "Düzeltme",
        details: [
          "Docker üretim ortamında persistent volume (/app/public/uploads) konteyner içindeki statik repo görsellerini maskelediği için 15 yeni blog makalesinin kapak görselleri /public/images/blog/ dizinine taşındı.",
          "next.config.mjs içerisine /uploads/blog/:path* -> /images/blog/:path* rewrite kuralı tanımlanarak mevcut veritabanı kayıtları, arama motoru dizinleri ve istemci önbellekleri için sıfır 404 güvencesi sağlandı.",
          "src/lib/blog-posts-extended.ts dosyasındaki 15 makalenin kapak görseli yolları /images/blog/... olarak güncellendi ve BlogPost senkronizasyonu için hazırlandı.",
          "Dockerfile runner aşamasında public dizini --chown=nextjs:nodejs yetkilendirmesiyle güçlendirildi.",
        ],
      },
      {
        title: "Tarayıcı Web Vitals 'startTime' Konsol Telemetrisi Analizi",
        category: "İyileştirme",
        details: [
          "Chrome DevTools Soft Navigations ve Web Vitals uzantılarının enjekte ettiği VM betiklerinde (et.reportAllChanges) PerformanceEntry boş kaldığında tetiklenen zararsız 'startTime' hatası izole edildi; uygulama çekirdeğinde web-vitals bağımlılığı olmadığı ve Next.js/React çalışmasını etkilemediği doğrulandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.41",
    date: "7 Eylül 2026",
    summary:
      "Google ve arama motorlarında topikal otoriteyi (Topic Authority) pekiştiren 15 yeni kapsamlı medikal SEO blog rehberi yayımlandı; Ankara Şehir Hastaneleri taburculuk protokolleri, medikal koltuklar, muayene masaları, tamamlayıcı mobilyalar ve ileri evre kronik hastalık bakım rehberleri veritabanına entegre edildi.",
    items: [
      {
        title: "15 Yeni Kapsamlı Medikal SEO Blog Makalesi ve Topikal Otorite Mimarisi",
        category: "Yeni",
        details: [
          "Küme 1 (Ankara Şehir Hastaneleri & Taburculuk): Bilkent Şehir Hastanesi hasta yatağı kiralama ve acil teslimat rehberi, Etlik Şehir Hastanesi taburculuk süreci ve Keçiören/Yenimahalle lojistiği, Ankara üniversite hastaneleri (Hacettepe, Gazi, İbni Sina) eve geçiş ve SGK medikal karyola geri ödeme kılavuzu.",
          "Küme 2 (Medikal Bakım & Tedavi Koltukları): Diyaliz ve kemoterapi koltuğu seçim kriterleri (Trendelenburg & ergonomi), klinik kan alma ve laboratuvar koltukları hijyen ve kol dayama standartları, saç ekim ve estetik operasyon koltukları 3-4 motorlu ayar avantajları.",
          "Küme 3 (Muayene, Masaj & Cilt Bakım Masaları): İki motorlu klinik muayene masası avantajları ve hekim ergonomisi, profesyonel masaj ve manuel terapi masası taşıma kapasitesi ve sünger yoğunluğu rehberi, güzellik merkezi ve medikal cilt bakım yatakları motorlu kontrol sistemleri.",
          "Küme 4 (Amortisörlü Masalar & Tamamlayıcı Mobilyalar): Amortisörlü hasta yemek masası kullanım rehberi ve yatak üstü beslenme ergonomisi, medikal cihaz taşıma sehpası ve klinik setup organizasyonu, amortisörlü kol dayama ve enjeksiyon sehpası klinik kullanım standartları.",
          "Küme 5 (Hastalık Bazlı İleri Bakım Rehberleri): ALS ve solunum yetmezliği hastalarında motorlu hasta karyolası ve yarı oturur Fowler pozisyonu, Parkinson hastalarında yatak içi düşme riskini önleme ve Low-Entry alçak yatak kullanımı, palyatif bakım ve felçli hasta odası yerleşimi ile refakatçi ergonomisi.",
          "Tüm makalelerde Schema.org Article ve MedicalWebPage uyumlu JSON-LD yapılandırılmış veri şemaları, teknik veri tabloları, iç bağlantı ağları ve gerçek ürün görsel referansları (/uploads/products/...) eksiksiz uygulandı.",
          "Modüler mimari korunarak makaleler src/lib/blog-posts-extended.ts üzerinde izole edildi, src/lib/blog.ts üzerinden toplam 34 makalelik birleşik yapı sağlandı ve PostgreSQL veritabanında BlogPost modeline senkronize edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.40",
    date: "7 Eylül 2026",
    summary:
      "Ankara içi lojistik ve montaj taahhütlerindeki katı saat süreleri ('2 saatte', '2-4 saatte') kaldırılarak 'Ankara'da Gün İçinde Kurulum' ve 'Gün İçinde Teslimat & Montaj' genel güvence mesajı standartlaştırıldı.",
    items: [
      {
        title: "Ankara Lojistik & Kurulum Mesajının 'Gün İçinde Kurulum' Standardına Alınması",
        category: "İyileştirme",
        details: [
          "Masaüstü ve mobil TopBar şeridinde yer alan '2 Saatte' ibareleri kaldırılarak 'Ankara İçi Gün İçinde Ücretsiz Teslimat & Montaj' ve 'Ankara'da Gün İçinde Kurulum' olarak güncellendi.",
          "Ürün detay sayfasındaki (urun/[slug]) teslimat güven rozeti 'Ankara'da Gün İçinde Kurulum | Adresinize ücretsiz oda montajı' olarak revize edildi.",
          "Footer ilçe hizmet ağı başlığı 'Ankara İlçe Hizmet Ağımız (Ankara'da Gün İçinde Kurulum & Teslimat)' şeklinde güncellendi.",
          "Ankara 25 ilçe veritabanı (ankaraDistricts.ts) ve ilçe açılış sayfalarındaki (ankara-hasta-yatagi/[ilce]) deliveryTimeHours değerleri 'Gün İçinde Kurulum' standardına bağlandı; ilçe SSS'lerindeki katı saat vaatleri temizlendi.",
          "Kiralama Prosedürü, Sıkça Sorulan Sorular (SSS), Blog makaleleri ve Kategori SEO açıklamalarındaki teslimat vaatleri gün içinde adrese anahtar teslim montaj vurgusuyla senkronize edildi.",
          "Tıbbi içeriklerde yer alan basınç yarası önleme kılavuzları (2 saatte bir pozisyon verme rutini) korunarak lojistik mesajlarından hassasiyetle ayrıştırıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.39",
    date: "7 Eylül 2026",
    summary:
      "PB ürün kodları 'PB-' ön eki kaldırılarak 'MC5311' formatında kurumsal standarda kavuşturuldu; yapay/rastgele hash kodu motoru kaldırılarak yalnızca doğrulanmış veritabanı SKU'ları birincil kılındı ve canlı veritabanı tam yedeği alındı.",
    items: [
      {
        title: "PB Model Kodları Standartlaşması (MCXXXX) ve Sahte Kodların Kaldırılması",
        category: "İyileştirme",
        details: [
          "productCode.ts motorundaki yapay matematiksel hash kodu üretimi (MC-1000..9999) sıfır toleransla tamamen kaldırıldı; kodu bulunmayan ürünler için sahte kod üretilmesi engellendi.",
          "PB model numaraları ('PB-5311', '5311', 'MC-5311') otomatik olarak kurumsal 'MC5311' birleşik formatına dönüştürülecek şekilde normalize edildi.",
          "Veritabanında kayıtlı mevcut 18 ürünün 'MC-xxxx' kodları 'MCxxxx' kurumsal formatına güncellendi.",
          "Ürün kartları (ProductCard), ürün detay sayfası (urun/[slug]) ve arama açılır kutusunda (HeaderClient) yalnızca geçerli bir SKU tanımlıysa rozet gösterilecek şekilde şartlı render uygulandı.",
          "Admin panelinde (ProductListClient) SKU'su henüz girilmemiş ürünler için 'Kodsuz' gri rozeti eklenerek katalog eksikleri görünür kılındı.",
          "Canlı veritabanından 1.204 kayıt ve 4 eksik görsel 'backups/backup-2026-09-07_14-59-51' olarak tam yedeklendi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.38",
    date: "7 Eylül 2026",
    summary:
      "Tüm aktif ürün görselleri (183 adet) 'object-cover' kart standartlarına uygun olarak %14 ferahlık boşluğu ile 1:1 kare tuvale genişletildi; tuval rengini dinamik algılayan ve sınır çizgilerini yumuşatan feathering algoritmasıyla dikiş izi (seam line) sıfırlandı.",
    items: [
      {
        title: "Katalog Görselleri 1:1 Kare Tuval ve Dikiş İzsiz (Seam-free) Genişletme",
        category: "Tasarım",
        details: [
          "183 aktif ürün görselinin tamamı orijinal halleriyle 'public/uploads/products_backup/' klasörüne yedeklendi.",
          "Stüdyo fotoğraflarında (87 adet) sabit beyaz basmak yerine fotoğrafın gerçek tuval rengi kenarlardan dinamik örneklendi ve 12px yumuşak geçiş (feathering) ile dikiş izi/kutu çerçevesi tamamen yok edildi.",
          "Klinik ve oda ortam fotoğrafları (96 adet) yumuşak 35px ambiyans buğusu arka planı ve ferahlık boşluğu ile 1:1 kareye tamamlandı.",
          "Hasta karyolalarının serum askıları, tekerlekleri, koltukların ayakları ve kozmetik ürünlerinin kapakları kart sınırlarına yapışmadan estetik ve ferah bir vitrin görünümüne kavuşturuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.37",
    date: "7 Eylül 2026",
    summary:
      "Google Merchant Center ve XML ürün katalog beslemelerinde (feed.xml) ürün başlıkları standartlaştırıldı; 'MCaris' ön eki başlık yerine Google standartlarına uygun olarak <g:brand>MCARIS</g:brand> etiketine kilitlendi.",
    items: [
      {
        title: "XML Feed Başlık Standardı ve Marka Ayrıştırması",
        category: "İyileştirme",
        details: [
          "XML feed jeneratöründe (feed-generator.ts) ürün başlıkları cleanProductTitle ile sterilize edilerek <title> ve <g:title> etiketlerine sade ürün adının basılması güvenceye alındı.",
          "Marka adı, Google Merchant Center ve Akakçe standartlarına uygun olarak ayrı <g:brand>MCARIS</g:brand> etiketine kilitlenerek başlıkta gereksiz/spam marka tekrarı engellendi.",
          "Veritabanındaki yeni sku sütunu XML feed için birincil <g:id> ve <g:mpn> kaynağı olarak bağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.36",
    date: "7 Eylül 2026",
    summary:
      "Ürün Kodu (SKU) alanı veritabanı modeline bağımsız benzersiz sütun olarak eklendi; admin panelinden ekleme ve düzenleme desteği ile storefront canlı AJAX araması ve ürün detay sayfasına tam entegre edildi.",
    items: [
      {
        title: "Ürün Kodu (SKU) Model ve Veritabanı Mimarisi",
        category: "Yeni",
        details: [
          "Prisma Product modeline ve PostgreSQL veritabanına benzersiz 'sku String? @unique' sütunu eklendi.",
          "Veritabanında kayıtlı mevcut ürünlerin ürün kodları (MC-xxxx) yeni sku sütununa eksiksiz taşındı.",
          "Ürün çoğaltma (duplicateProduct) işleminde SKU çakışmasını önleyen benzersiz kod türetme algoritması entegre edildi.",
        ],
      },
      {
        title: "Admin Paneli Yönetimi ve Storefront Arama Entegrasyonu",
        category: "İyileştirme",
        details: [
          "Admin ürün oluşturma ve düzenleme ekranına (ProductFormClient) Ürün Kodu (SKU) alanı entegre edilerek büyük harf (uppercase) standartlaştırması uygulandı.",
          "Site içi canlı arama motoru (buildSearchWhereClauses), kullanıcıların ürün kodu (örn: MC-8576) aramalarında ilgili ürünü anında bulacak şekilde genişletildi.",
          "Canlı arama açılır kutusunda (HeaderClient) ürün adının yanında ürün kodu rozeti gösterildi.",
          "Ürün detay sayfasında (urun/[slug]) başlık yanında 'KOD: MC-XXXX' rozeti sergilendi ve Schema.org JSON-LD yapılandırılmış verisine doğrudan aktarıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.35",
    date: "7 Eylül 2026",
    summary:
      "Katalogda yer almayan 5 adet boru tipi havalı yatak ürünü ve 'Havalı Yatak Sistemleri' kategorisi veritabanından kalıcı olarak silindi; ana sayfa hero hapları, promosyon bannerları ve mobil menüdeki havalı yatak blokları kaldırıldı.",
    items: [
      {
        title: "Boru Tipi Havalı Yatakların ve Kategorisinin Veritabanından Kaldırılması",
        category: "Düzeltme",
        details: [
          "Veritabanındaki 5 adet boru tipi havalı yatak (P10, P20, P30, P40, P50) kalıcı olarak silindi.",
          "Boşalan 'Havalı Yatak Sistemleri' (havali-yatak-sistemleri) kategorisi veritabanından temizlendi.",
          "Sıralama listeleri, filtreler ve arama motoru kategori dizinlerinden havali-yatak-sistemleri kaldırıldı.",
        ],
      },
      {
        title: "Vitrin, Banner ve Menülerin Güncellenmesi",
        category: "Tasarım",
        details: [
          "HeroClient bileşenindeki kategori haplarından 'Havalı Yatak' kaldırıldı.",
          "PromoBanners bileşenindeki 3. banner, 'Yatak Üstü Yemek Masaları' (hasta-yemek-masalari) olarak güncellenerek 3 sütunlu vitrin dengesi korundu.",
          "MobileNav hızlı servis menüsünden 'Havalı Yatak Sistemleri' kaldırıldı.",
          "/urunler sayfasındaki eski havalı yatak kategori yönlendirmesi 404 oluşmasını önlemek amacıyla kaldırıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.34",
    date: "7 Eylül 2026",
    summary:
      "Ürünlere özel 'Site İçi Arama Anahtar Kelimeleri & Etiketler' (searchKeywords) alanı Prisma şemasına, veritabanına, arama motoruna ve Yönetim Paneline kazandırıldı; ürün başlıklarındaki gereksiz 'MCaris' ön ekleri veritabanı düzeyinde kalıcı olarak temizlendi.",
    items: [
      {
        title: "Site İçi Arama Anahtar Kelimeleri & Etiketler (searchKeywords) Alanı",
        category: "Yeni",
        details: [
          "Prisma Product modeline ve PostgreSQL veritabanına 'searchKeywords' sütunu eklendi.",
          "Site içi arama algoritması (buildSearchWhereClauses), kullanıcı aramalarını Türkçe ve ASCII varyasyonlarıyla searchKeywords alanı üzerinden de sorgulayacak şekilde genişletildi.",
          "Admin ürün oluşturma ve düzenleme formuna (ProductFormClient) arama etiketleri alanı eklenerek yöneticilerin ürünlere özel arama terimleri tanımlaması sağlandı.",
          "Ürün çoğaltma (duplicateProduct) ve sunucu eylemlerine (productActions) searchKeywords desteği entegre edildi.",
        ],
      },
      {
        title: "Ürün Başlıklarındaki 'MCaris' Ön Eklerinin Veritabanından Temizlenmesi",
        category: "Düzeltme",
        details: [
          "Veritabanında kayıtlı ürünlerin başlıklarındaki mükerrer ve gereksiz 'MCaris' / 'MCARIS' ibareleri doğrudan veritabanı düzeyinde temizlendi.",
          "Ürün URL slug'larının temiz kalması sağlandı; arama için slug manipülasyonu ihtiyacı ortadan kaldırıldı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.33",
    date: "7 Eylül 2026",
    summary:
      "Ürün kartlarında 1:1 kare çerçeve standardı pekiştirildi; 'object-contain' ve iç dolgu (padding) kalıcı olarak yasaklanarak tüm vitrin kenardan kenara dolduran 'object-cover w-full h-full' standardına kilitlendi.",
    items: [
      {
        title: "Ürün Kartı ve Galeri object-cover Standardının Katı Kurala Bağlanması",
        category: "Tasarım",
        details: [
          "ProductCard bileşenindeki görsel çerçevesi 1:1 kare (aspect-square) olarak sabitlendi, gereksiz iç boşluklar (padding) tamamen temizlendi.",
          "object-contain davranışı hem ProductCard hem de ProductGallery ana görselinde kesin olarak engellendi; kenardan kenara tam oturan 'object-cover w-full h-full' uygulandı.",
          "AGENTS.md ve .agents/AGENTS.md sistem kurallarına 'object-contain KESİNLİKLE YASAKTIR' maddesi bağlayıcı mimari kural olarak işlendi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.32",
    date: "7 Eylül 2026",
    summary:
      "iyzico üye işyeri onayında eksik görülen 'iyzico ile Öde', Visa ve Mastercard logoları footer ve ödeme ekranında ayrı, taranabilir görseller olarak yayınlandı.",
    items: [
      {
        title: "iyzico Web Sitesi Logo Kriterlerinin Karşılanması",
        category: "Güvenlik",
        details: [
          "Footer'daki tek birleşik ödeme şeridi (logo_band), iyzico tarayıcısının aradığı ayrı 'iyzico ile Öde', Visa ve Mastercard <img> etiketleriyle değiştirildi.",
          "Resmi iyzico logo paketindeki Visa ve Mastercard işaretleri public/images altına eklendi; iyzico logosu resmi siteye bağlandı.",
          "Ödeme (checkout) güven rozetleri alanına aynı üç logo ortak PaymentLogos bileşeniyle eklendi.",
          "Footer ödeme logoları küçük (sm) boyuta alındı; checkout varsayılan boyutta bırakıldı.",
        ],
      },
      {
        title: "Ürün Detayından SGK / ÜTS Faturası Rozetinin Kaldırılması",
        category: "Tasarım",
        details: [
          "Ürün detay sayfasındaki 'SGK / ÜTS Faturası — Resmi medikal geri ödeme desteği' güven rozeti kaldırıldı; teslimat, servis ve CE/ISO rozetleri üç sütunlu düzende bırakıldı.",
        ],
      },
      {
        title: "Ürün Kartı ve Galeri Görsellerinde object-cover Tam Dolum",
        category: "Tasarım",
        details: [
          "ProductCard ve ürün detay galerisindeki object-contain + padding kaynaklı yan boşluklar kaldırıldı; görseller çerçeveyi object-cover ile dolduruyor.",
        ],
      },
    ],
  },
  {
    version: "v2.9.31",
    date: "6 Eylül 2026",
    summary:
      "Ürün başlıklarındaki baştaki 'MCARIS' ibareleri arındırıldı; ürün başlığı sterilizasyon motoru devreye alındı ve atıl kalan WooCommerce senkronizasyon altyapısı projeden tamamen temizlendi.",
    items: [
      {
        title: "Ürün Başlıklarından MCARIS İbaresi Temizliği & Otomasyonu",
        category: "Düzeltme",
        details: [
          "Veritabanında ürün adlarının başında yer alan 'MCARIS / Mcaris' ön ekleri ve ardışık ayırıcı işaretlerin tek tıkla arındırılması için temizleme altyapısı (clean:titles) ve doğrudan SQL sorguları hazırlandı.",
          "serializeProduct, createProduct ve updateProduct metotlarına cleanProductTitle filtrelemesi entegre edilerek hem vitrin hem de admin girişleri güvenceye alındı.",
        ],
      },
      {
        title: "Eski WooCommerce Senkronizasyon Altyapısının Kaldırılması",
        category: "Altyapı",
        details: [
          "Eski sitenin tamamen kapatılması sebebiyle artık ihtiyaç duyulmayan WooCommerce senkronizasyon scripti (sync-woocommerce.ts), birim testleri ve package.json bağımlılıkları sıfır ölü kod prensibiyle projeden temizlendi.",
        ],
      },
      {
        title: "Yönetim Paneli 'Veritabanı & Tam Sistem Yedekleme' (/admin/veritabani)",
        category: "Yeni",
        details: [
          "Admin menüsündeki 'Veritabanı & Yedekler' sayfasına hem 'Hızlı DB Yedeği (SQL/JSON)' hem de tek tıkla 'Tam Sistem Yedeği (.ZIP)' alma yeteneği eklendi.",
          "Tam Sistem Yedeği (.ZIP); PostgreSQL veritabanı dökümlerini (SQL & JSON), manifest dosyasını ve public/uploads altındaki tüm ürün fotoğrafları ile faturaları tek bir sıkıştırılmış pakette toplar.",
          "GET/POST /api/admin/database/backup uç noktası üzerinden .zip formatında tam felaket kurtarma arşivi doğrudan tarayıcıya indirilebilir hale getirildi.",
        ],
      },
      {
        title: "Otomatik Geliştirme Ortamı Veritabanı & Görsel Eşitleme Motoru (predev / db:backup / media:sync)",
        category: "Yeni",
        details: [
          "npm run dev çalıştırıldığında Coolify PostgreSQL canlı veritabanındaki 14 tablonun tamamı bilgisayardaki /backups klasörüne arşivlenir.",
          "Canlı sitede bulunup yerel bilgisayarda eksik olan tüm ürün ve blog fotoğrafları otomatik taranarak HTTP üzerinden yerel public/uploads klasörüne indirilir ve eşitlenir.",
          "LOCAL_DATABASE_URL tanımlı olduğunda canlıdaki eksik kategorileri, ürünleri, blogları, SSS ve ayarları yerel veritabanına otomatik eşitleyen (Upsert/Sync) mekanizma devreye alındı.",
          "Eski yedeklerin diski şişirmemesi için son 25 DB ve son 15 ZIP yedeğini saklayan akıllı rotasyon uygulandı.",
        ],
      },
      {
        title: "Pinterest & Sosyal Medya RSS 2.0 Akış Uyumluluğu (/feed.xml)",
        category: "İyileştirme",
        details: [
          "XML ürün beslemesine standart RSS 2.0 <link>, <guid>, <pubDate>, <enclosure> ve Yahoo Media <media:content> etiketleri eklendi.",
          "Pinterest Toplu Pin oluşturucu ve otomatik yayınlama botunun ürün bağlantılarını ve kapak görsellerini eksiksiz çözümlemesi sağlandı.",
        ],
      },
      {
        title: "Sepet & Ödeme İndirim Kuponu Taşıntı (Overflow) Düzeltmesi",
        category: "Tasarım",
        details: [
          "Sepet ve ödeme özeti kenar çubuğunda (320px) yer alan 'İndirim Kuponu' alanındaki 'Uygula' butonunun kart sınırları dışına taşmasına yol açan flexbox intrinsic min-width problemi min-w-0, shrink-0 ve overflow-hidden ile kökten çözüldü.",
          "Girdi kutusuna duyarlı placeholder stili ve çift tıklamayı önleyen form idempotency doğrulaması entegre edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.30",
    date: "5 Eylül 2026",
    summary:
      "Site içi gezinme, promosyon bannerları ve mobil menüde yer alan arama parametreli sorgu bağlantıları (/urunler?q=...) kaldırılarak kalıcı kanonik kategori iniş sayfalarına (/kategori/...) dönüştürüldü; kategori ve ürün bazlı kullanıcı/yönetici kontrollü SEO Title ve Meta Description sistemi devreye alındı.",
    items: [
      {
        title: "Kanonik Kategori İniş Sayfaları & Arama Parametresi Temizliği",
        category: "İyileştirme",
        details: [
          "Masaüstü kategori menüsü (CategoryNavClient), mobil çekmece menüsü (MobileNav) ve ana sayfa promosyon bannerlarındaki /urunler?q=havali+yatak ve /urunler?q=yemek+masasi sorgu bağlantıları, doğrudan taranabilir ve dizine eklenebilir kanonik /kategori/havali-yatak-sistemleri ve /kategori/hasta-yemek-masalari bağlantılarıyla değiştirildi.",
          "Mobil gezinme menüsündeki tüm kategori linkleri /urunler?kategori=... yerine doğrudan /kategori/[slug] kanonik sayfalarına yönlendirilecek şekilde güncellendi.",
          "Hakkımızda sayfasındaki seri bağlantıları (/urunler?seri=...) kanonik /seri/[slug] sayfalarına bağlandı.",
        ],
      },
      {
        title: "Akıllı 308 Kalıcı Yönlendirme (Permanent Redirect) & SEO Konsolidasyonu",
        category: "Altyapı",
        details: [
          "Eski arama motoru dizinlerinden veya yer imlerinden /urunler?q=havali+yatak, /urunler?q=yemek+masasi, /urunler?q=kiralik veya kategori parametresiyle (/urunler?kategori=...) gelen tüm kullanıcı ve arama motoru botları, HTTP 308 kalıcı yönlendirmeyle hedef kanonik kategori ve kiralama sayfalarına yönlendirildi.",
          "Bu sayede iç ve dış SEO bağlantı gücünün (link juice) doğrudan kanonik iniş sayfalarında toplanması sağlandı.",
        ],
      },
      {
        title: "Kullanıcı ve Yönetici Kontrollü Özel SEO Title & Meta Description Sistemi",
        category: "Yeni",
        details: [
          "Ürün yönetim paneline (Admin > Ürün Ekle / Düzenle) özel 'Arama Motoru Optimizasyonu (SEO & Meta)' modülü eklendi; yöneticilerin her ürün için özel Google başlığı (seoTitle) ve SERP açıklaması (seoDescription) belirleyebilmesi sağlandı.",
          "Ürün detay sayfalarında (generateMetadata) özel belirlenen SEO başlık ve açıklamaları otomatik olarak Google arama sonuçlarına, Akakçe botlarına, OpenGraph ve Twitter Cards meta etiketlerine yansıtıldı.",
          "Teknik özellik tablosunda (SpecTable) bu SEO meta verilerinin müşteriye yönelik fiziksel tabloda gösterilmemesi için filtreleme yapıldı.",
          "Kategori oluşturma ve düzenleme aksiyonlarına dinamik sitemap.xml anlık yenileme (revalidatePath) tetikleyicisi entegre edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.29",
    date: "5 Eylül 2026",
    summary:
      "Arama motoru Türkçe karakter duyarsız (ı-i, ş-s, ç-c vb.) ve çok alanlı eşleşmeyle güçlendirildi; taslakta kalan Havalı Yatak ve Yemek Masası modelleri yayına alınarak menü bağlantıları doğrudan kiralama prosedürüne bağlandı.",
    items: [
      {
        title: "Türkçe Arama Motoru & Akıllı Kök Eşleştirme Mimarisi",
        category: "Altyapı",
        details: [
          "Ürün arama motoru Türkçe-İngilizce karakter farklarını (havali/havalı, masasi/masası) kökten çözen varyant motoru ile donatıldı; başlık, slug, açıklama ve kategori alanlarında eş zamanlı arama aktif edildi.",
          "Taslak modunda (draft) bekleyen 5 adet boru tipi havalı yatak (P10, P20, P30, P40, P50) ve amortisörlü hasta yemek masası yayına alınarak tüm aramalarda anında listelenmesi sağlandı.",
        ],
      },
      {
        title: "Gezinme Menüsü Kiralık Karyola Yönlendirmesi",
        category: "İyileştirme",
        details: [
          "Masaüstü ve mobil gezinme menülerindeki 'Kiralık Karyolalar' bağlantısı, müşterilere doğrudan kiralama şartlarını ve adrese montaj standartlarını sunan /kiralama-proseduru sayfasına bağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.28",
    date: "5 Eylül 2026",
    badge: "Tasarım",
    summary:
      "Site alt bilgisi (Footer) alanında yasal sözleşme bağlantıları ve telif metni dikey hizalanarak görsel kaymalar giderildi; Ankara ilçe bağlantısı daha açıklayıcı hale getirildi.",
    items: [
      {
        title: "Alt Bilgi (Footer) Dikey Hizalama & Tipografi İyileştirmesi",
        category: "Tasarım",
        details: [
          "Telif hakkı satırı ve mesafeli satış/KVKK/iade sözleşme bağlantıları tek merkezde alt alta hizalandı; dar alan kaynaklı satır kırılmaları ve asimetrik görünüm giderildi.",
          "Ankara ilçe rehberi bağlantısı 'Tüm Ankara Hasta Yatakları →' olarak tamamlanarak eksik metin algısı düzeltildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.27",
    date: "5 Eylül 2026",
    badge: "Tasarım",
    summary:
      "Üst gezinti çubuğundaki (Header) beyaz MCARIS marka logosu, şeffaf arka planlı, yüksek çözünürlüklü ve modern tipografiye sahip yeni tasarımla güncellendi.",
    items: [
      {
        title: "Header Yüksek Çözünürlüklü Beyaz Logo Yenilemesi",
        category: "Tasarım",
        details: [
          "Üst gezinme çubuğunda (Header) yer alan MCARIS marka logosu, sıkıştırma izlerinden arındırılmış, şeffaf arka planlı ve kristal netliğinde modern tipografi içeren yüksek çözünürlüklü (600x167) yeni logoyla değiştirildi.",
          "Görsel oranları ve Next.js Image bileşeni intrinsic boyutları optimize edilerek sıfır CLS (Cumulative Layout Shift) güvenceye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.26",
    date: "5 Eylül 2026",
    badge: "Tasarım",
    summary:
      "Ödeme güvenliği ve müşteri güvenini artıran resmi iyzico ile Öde ve çoklu ödeme yöntemleri (Visa, MasterCard, Troy, American Express) görsel logoları ödeme formuna ve site alt bilgisine entegre edildi.",
    items: [
      {
        title: "Site Altı (Footer) Güvenli Ödeme Yöntemleri Şeridi",
        category: "Tasarım",
        details: [
          "Tüm sayfalarda görünen site alt bilgisi (Footer) alanına 256-bit SSL ve 3D Secure güvencesiyle birlikte resmi colored ödeme yöntemleri logo şeridi (Visa, MasterCard, Troy, American Express vb.) yerleştirildi.",
          "Müşteriler için görsel güvenilirlik ve kurumsal e-ticaret standartları pekiştirildi.",
        ],
      },
      {
        title: "Güvenli Ödeme Ekranı (Checkout) Resmi iyzico Entegrasyonu",
        category: "Tasarım",
        details: [
          "Ödeme tamamlama formunda kredi kartı seçim kartına ve güvenlik rozetleri alanına resmi 'iyzico ile Öde' renkli SVG logosu dahil edildi.",
          "3D Secure tek çekim ve 12 aya varan taksit seçenekleri kullanıcıya şeffaf ve profesyonel bir görsel dille sunuldu.",
        ],
      },
    ],
  },
  {
    version: "v2.9.25",
    date: "5 Eylül 2026",
    badge: "İyileştirme",
    summary:
      "Arama motoru optimizasyonu (SEO), indeks güvenliği ve Schema.org yapılandırılmış veri standartları kökten denetlenerek Google yönergelerine tam uyumlu hale getirildi.",
    items: [
      {
        title: "Schema.org Yapılandırılmış Veri & Zengin Sonuç Standartları",
        category: "İyileştirme",
        details: [
          "Google Zengin Sonuçlar (Rich Results) yönergeleri doğrultusunda kök şablondaki mükerrer ve sayfa dışı FAQPage şeması arındırıldı; soru-cevap zengin verisi yalnızca ilgili SSS ve bölgesel rehber sayfalarında tutularak arama motoru uyumluluğu sağlandı.",
          "Ürün ve kategori kanonik yönlendirmeleri HTTP 301 kalıcı yönlendirme standardına kavuşturularak bağlantı gücü ve PageRank otoritesi %100 koruma altına alındı.",
        ],
      },
      {
        title: "Arama Motoru İndeks Güvenliği ve Tarama Bütçesi Optimizasyonu",
        category: "Güvenlik",
        details: [
          "Yönetim ve operasyonel mobil panellere açık noindex/nofollow robot direktifleri tanımlanarak arama motorlarında indekslenmeleri kalıcı olarak engellendi.",
          "Dahili arama parametreleri için robot tarama kuralları optimize edildi; tarama bütçesi (crawl budget) korunarak kopya ve zayıf içerik indeksleme riskleri sıfırlandı.",
          "Katalogda bulunamayan veya geçerliliğini yitirmiş ürün, kategori ve içerik sorgularında anında noindex yanıtı verilerek Soft-404 hataları önlendi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.24",
    date: "5 Eylül 2026",
    badge: "Altyapı",
    summary:
      "Mağaza altyapısı ve platform performans mimarisi modernize edilerek sayfa yükleme hızları, sunucu yanıt süreleri ve yüksek trafik anlarındaki sistem kararlılığı en üst düzeye çıkarıldı.",
    items: [
      {
        title: "Platform Performansı ve Hızlı Yanıt Mimarisi",
        category: "Altyapı",
        details: [
          "Üretim dağıtım altyapısı ve akıllı önbellekleme katmanı optimize edilerek platform genelinde sayfa geçişleri ve katalog sorgularındaki yanıt süreleri hızlandırıldı.",
          "Veri işleme ve arka plan derleme döngüleri sadeleştirilerek sunucu kaynak tüketimi verimli hale getirildi.",
        ],
      },
      {
        title: "Sistem Kararlılığı ve Kesintisiz Hizmet Güvencesi",
        category: "Altyapı",
        details: [
          "Yüksek ziyaretçi trafiğinde ve eşzamanlı işlem yoğunluğunda platform kararlılığını koruyan gelişmiş bellek ve kaynak yönetim standartları devreye alındı.",
          "Üretim paketi ve varlık yükleme süreçleri arındırılarak güvenli, hafif ve kesintisiz bir alışveriş altyapısı sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.23",
    date: "5 Eylül 2026",
    badge: "Tasarım",
    summary:
      "Kategori menüsünün sağında yer alan ve tepe çubuğuyla mükerrerlik oluşturan montaj rozeti menüden kaldırılarak gezinme bağlantılarına daha ferah bir alan açıldı.",
    items: [
      {
        title: "Ana Menü Sağ Rozet Sadeleştirmesi",
        category: "Tasarım",
        details: [
          "CategoryNav şeridinin sağında bulunan ve tepe çubuğunda (TopBar) zaten vurgulanan 'Ankara İçi: Aynı Gün 2 Saatte Montaj' rozeti menüden kaldırılarak görsel karmaşa giderildi.",
          "Hızlı ürün ve kiralama bağlantılarına daha geniş bir yatay hareket ve nefes alanı sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.22",
    date: "5 Eylül 2026",
    badge: "İyileştirme",
    summary:
      "Medikal Ekipmanlar açılır menüsü 720px genişliğe çıkartılarak metin taşması ve kırpılmalar kalıcı olarak giderildi; kategori filtreleri mobilde yatay kaydırılabilir hap etiketlere dönüştürüldü ve mobil kullanıcı deneyimi eksiksiz optimize edildi.",
    items: [
      {
        title: "Medikal Ekipmanlar ve Seri Açılır Menülerinin Genişletilmesi",
        category: "Tasarım",
        details: [
          "Medikal Ekipmanlar açılır menü genişliği 580px'den 720px'e çıkartıldı; 'Dövme Kol Sehpaları' ve 'Ergonomik Ayarlı' rozetinin sığmayarak üç nokta (...) ile kesilmesi sorunu tamamen çözüldü.",
          "Hasta Karyolası Serilerimiz açılır menüsü 400px genişliğe çekilerek rahat nefes alan bir tipografik düzene kavuşturuldu.",
          "Menü başlıklarındaki statik mermi noktaları semantik klinik artı ve yatak serisi SVG ikonlarıyla değiştirildi.",
        ],
      },
      {
        title: "Kapsamlı Mobil Deneyim ve Kategori Gezinme Optimizasyonu",
        category: "İyileştirme",
        details: [
          "Ürün listeleme sayfalarında (ProductFilters) mobilde ürünleri 400px aşağı iten dikey filtre kutusu yerine akıcı, yatay kaydırılabilir hap etiket mimarisi uygulandı; kullanıcılar ürünleri anında ilk ekranda görüyor.",
          "Mobil yatay hızlı navigasyon şeridine eksik olan Dövme Kol Sehpaları, Tabure & Sandalyeler ve Medikal Kozmetik kategorileri eklendi.",
          "Müşteri hesap panelinde (AccountClient) sekmeler mobilde yatay kaydırılabilir pill menüye, sipariş kartı başlıkları ise 2 sütunlu duyarlı ızgaraya dönüştürüldü.",
        ],
      },
    ],
  },
  {
    version: "v2.9.21",
    date: "5 Eylül 2026",
    badge: "Önemli İyileştirme",
    summary:
      "Arayüz genelinde yapay duran tüm animasyonlu nabız noktaları (animate-pulse ve animate-ping) kaldırılarak kurumsal medikal kimliğe uygun temiz SVG mikro ikonlarla değiştirildi; ana sayfadaki mükerrer kategori bloğu temizlenerek akış kusursuzlaştırıldı.",
    items: [
      {
        title: "Yapay Zeka Şablonu Nabız Noktalarının (Pulse / Ping) Temizlenmesi",
        category: "Tasarım",
        details: [
          "TopBar tepe çubuğunda ve CategoryNav şeridinde yer alan yeşil yanıp sönen noktalar (animate-pulse) kaldırılarak kurumsal lojistik teslimat aracı SVG ikonlarıyla değiştirildi.",
          "Müşteri hesap panelinde (AccountClient) kargo ve hazırlık durumlarındaki yanıp sönen ping halkaları (animate-ping) kaldırılarak semantik kargo aracı ve hazırlık paketi SVG ikonlarına dönüştürüldü.",
          "Yönetim paneli analitik kartındaki yanıp sönen nokta temizlenerek kurumsal SVG onay ikonu uygulandı.",
        ],
      },
      {
        title: "Mükerrer Kategori Bloğunun Kaldırılması ve Ana Sayfa Akışı",
        category: "İyileştirme",
        details: [
          "Hero vitrini altında zaten 10'lu 5x2 görsel kategori gridi yer aldığı için, TrustFeatures hemen sonrasındaki mükerrer CategoryShortcuts bloğu kaldırılarak sıfır ölü kod kuralıyla temizlendi.",
          "Ziyaretçi doğrudan Hero ve güven rozetlerinin ardından en çok tercih edilen 8 amiral gemisi hasta karyolası modeline (FeaturedProducts) kesintisiz ulaşıyor.",
        ],
      },
    ],
  },
  {
    version: "v2.9.20",
    date: "5 Eylül 2026",
    summary:
      "Ana sayfa bölüm akışı e-ticaret dönüşüm hunisine uygun olarak yeniden düzenlendi; vitrin kartlarındaki görsel alanı en-boy oranı (aspect ratio) yatay medikal ürün formuna göre optimize edilerek dikey yükseklik fazlalığı giderildi.",
    items: [
      {
        title: "Ürün Kartı Görsel Alanı Optimizasyonu (Aspect Ratio 4:3)",
        category: "Tasarım",
        details: [
          "ProductCard bileşenindeki görsel kapsayıcısı 1:1 kare (aspect-square) formatından 4:3 (aspect-[4/3]) oranına dönüştürüldü.",
          "Hasta karyolası, klinik masası ve bakım koltukları gibi yatay formdaki medikal ürün fotoğraflarının dikeyde oluşturduğu aşırı beyaz boşluk dengelendi; kartlar daha kompakt, şık ve okunabilir hale getirildi.",
        ],
      },
      {
        title: "Ana Sayfa Bölüm Akışı ve Huni İyileştirmesi",
        category: "İyileştirme",
        details: [
          "Kategori vitrininin (CategoryShortcuts) hemen ardından doğrudan 8 ana model içeren 'En Çok Tercih Edilen Hasta Karyolaları' (FeaturedProducts) konumlandırıldı.",
          "Günün Fırsatı (DealOfTheDay) sayacı ve 'En Son Eklenen Modeller' (NewArrivals) stratejik olarak ana vitrin sonrasına yerleştirildi.",
          "PromoBanners üzerindeki kiralama ve havalı yatak yönlendirmeleri doğrudan '/kiralama-proseduru' ve filtreli arama sayfalarına bağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.19",
    date: "5 Eylül 2026",
    summary:
      "Mobil gezinme mimarisi (MobileNav, MobileBottomNav ve CategoryNav Quick Strip) masaüstü standartlarıyla tam pariteye kavuşturuldu; klinik bakım ekipmanları, hızlı kiralama seçenekleri, Ankara ilçe ağları ve rehberler mobil çekmeceye entegre edilerek dar ekran uyumluluğu mükemmelleştirildi.",
    items: [
      {
        title: "Kapsamlı Mobil Navigasyon Çekmecesi (MobileNav Full Parity)",
        category: "İyileştirme",
        details: [
          "Mobil gezinme çekmecesine Klinik & Bakım Ekipmanları (Bakım Koltukları, Muayene Masaları, Cihaz Sehpaları, Dövme Kol Sehpaları, Tabure & Sandalyeler, Medikal Kozmetik) tam liste olarak eklendi.",
          "Hızlı Kiralama ve Popüler Çözümler (Kiralık Karyolalar, Havalı Yataklar, Yemek Masaları & Etajer) mobil çekmeceye dahil edildi.",
          "Rehber & Destek bölümü altına Ankara İlçe Hizmet Bölgeleri (25 İlçe), Kiralama Prosedürü, SSS Bilgi Bankası ve Medikal Blog bağlantıları yerleştirildi.",
          "Mobil çekmece açıkken arka plan kaydırması (body scroll lock) kilitlendi; Escape tuşu ve karartma arka planı ile sezgisel kapanış desteklendi.",
        ],
      },
      {
        title: "Mobil Yatay Hızlı Şerit ve Alt Gezinme İyileştirmesi",
        category: "Tasarım",
        details: [
          "CategoryNav altındaki mobil yatay kaydırılabilir hap etiketlere 'Cihaz Sehpaları', 'Kiralık Karyolalar' ve 'Ankara İlçe Bölgeleri' eklenerek tek kaydırmayla erişim sağlandı.",
          "MobileBottomNav alt gezinme çubuğunda /kategori ve /seri gezinmeleri sırasında 'Ürünler' sekmesinin aktif vurgusunun korunması sağlandı.",
          "Ekran okuyucular ve a11y standartları için tüm mobil alt ve üst gezinme butonlarına açıklayıcı aria-label etiketleri tanımlandı.",
          "Dar mobil ekranlarda (360px) tepe aksiyon butonlarının (WhatsApp, Favoriler, Sepet, Giriş) taşmasını ve sıkışmasını önleyen duyarlı boyutlandırma uygulandı.",
          "Footer en alt yasal barına mobil alt çubuğun (MobileBottomNav) arkasında kalmasını önleyecek pb-24 alt dolgusu eklendi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.18",
    date: "5 Eylül 2026",
    summary:
      "Kullanıcı deneyimini bozan ve geliştirici/debug çıktısı izlenimi veren mekanik sayaç etiketleri ('173 Soru', '25 İlçe', '49 Soru & Yanıt') ve köşeli parantezli rozetler temizlenerek tüm metinler insan odaklı, akıcı ve profesyonel e-ticaret diline dönüştürüldü.",
    items: [
      {
        title: "Kullanıcı Deneyimi ve Metin Dili Temizliği (UX Refinement)",
        category: "Düzeltme",
        details: [
          "Ana sayfa SEO bloğundaki gezinme bağlantısında yer alan 'Sıkça Sorulan Sorular (173 Soru)' etiketi sadeleştirilerek 'Sıkça Sorulan Sorular' haline getirildi.",
          "'Ankara Hasta Yatağı Hub (25 İlçe)' teknik ifadesi yerine ziyaretçiler için anlaşılır 'Ankara İlçe Hizmet Bölgeleri' ibaresi uygulandı.",
          "Ankara ilçe iniş sayfasındaki 'Ankara İlçe Hizmet Bölgelerimiz (25 İlçe)' başlığı ve altındaki 'Tüm Sıkça Sorulan Soruları (49 Soru & Yanıt) Görün' aksiyon butonu gereksiz sayısal parantezlerden arındırılarak 'Tüm Sıkça Sorulan Soruları İnceleyin' standardına kavuşturuldu.",
          "SSS, Blog ve Kiralama Prosedürü sayfalarındaki köşeli parantezli rozetler ([YARDIM MERKEZİ], [BİLGİ BANKASI], [MCARIS GÜVENCESİ], [MCARIS MEDİKAL]) temiz, parantezsiz şık pill badge görünümüne geçirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.17",
    date: "5 Eylül 2026",
    summary:
      "Ana sayfa tepe bölümündeki Vitrin (Hero Showcase) ürün kartında yer alan 'object-contain' ve iç dolgu (p-2) kaynaklı yan boşluklar (letterboxing) kalıcı olarak giderildi; Burmeier Dali ve tüm vitrin modelleri kenardan kenara tam oturan 'object-cover' standardına geçirildi.",
    items: [
      {
        title: "Vitrin (Hero Showcase) Görsel Alanı 'object-cover' Tam Alan Standardı",
        category: "Düzeltme",
        details: [
          "HeroClient bileşenindeki vitrin ürün görseli sarmalayıcısında bulunan p-2 iç boşluğu ve 'object-contain' davranışı kaldırılarak 'object-cover w-full h-full' standardı uygulandı.",
          "Burmeier Dali 4 Motorlu Ahşap Karyola ve diğer sekme modellerinin kart içerisinde sağ ve solda oluşturduğu beyaz boşluklar/şeritler tamamen yok edildi; görsel kart sınırlarını kusursuzca dolduracak şekilde kenardan kenara (full-bleed) hizalandı.",
          "Görsel yüksekliği sm:h-64 seviyesine optimize edilerek mobil ve masaüstünde yüksek çözünürlüklü estetik vitrin görünümü sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.16",
    date: "5 Eylül 2026",
    summary:
      "Modern e-ticaret hiyerarşisi standardında yeni TopBar (Üst İnce Bilgi & Destek Çubuğu) bileşeni geliştirilerek kurumsal ve destek bağlantıları (Kiralama Prosedürü, Blog, SSS, Hakkımızda, İletişim, Sipariş Takibi, Ankara 2 Saatte Kurulum Rozeti) en üste taşındı; ana menü (CategoryNav) %100 oranında e-ticaret ürün ve kategorilerine tahsis edildi.",
    items: [
      {
        title: "Yeni 'TopBar' Üst Bilgi, Lojistik & Müşteri Hizmetleri Çubuğu",
        category: "Yeni",
        details: [
          "Header'ın en üstüne konumlandırılan h-8 (32px) yüksekliğinde, koyu lacivert (#060D1A) zeminli zarif TopBar bileşeni (TopBar.tsx) oluşturuldu.",
          "Sol tarafa Ankara Bölge Lojistik Filosu için 'Ankara İçi 2 Saatte Ücretsiz Teslimat & Montaj' nabız animasyonlu durum rozeti ve tek tıkla arama sağlayan '7/24 Çağrı & Destek: 0536 820 02 69' bağlantısı eklendi.",
          "Sağ tarafa Kiralama Prosedürü, Medikal Blog, SSS, Hakkımızda, İletişim ve SVG kargo ikonuyla ayrıştırılan Sipariş Takibi bağlantıları yerleştirildi.",
          "Mobilde ekran alanını korumak için 28px yüksekliğinde temiz ve taşmayan tek satırlık teslimat bildirim şeridi olarak uyarlandı.",
        ],
      },
      {
        title: "Ana Menünün (CategoryNav) %100 Ürün ve Satış Odaklı Yeniden Yapılandırılması",
        category: "İyileştirme",
        details: [
          "Kurumsal ve destek sayfalarının TopBar'a taşınmasıyla boşalan ana menü satırı tamamen ürün ve satış odaklı hale getirildi: Tüm Ürünler, Hasta Karyolaları, Hasta Yatağı Serilerimiz [Özel], Medikal Ekipmanlar [Klinik], Havalı Yatak Sistemleri, Kiralık Karyolalar, Yemek Masaları & Aksesuar.",
          "Sağ alana mükerrer buton yerine güven artıran 'Ankara İçi Aynı Gün 2 Saatte Montaj' rozeti eklendi.",
          "1024px ile 1440px arasındaki tüm ekran çözünürlüklerinde yatay taşma, sıkışma veya kırpılma olmadan ferah bir hiyerarşi ve kullanıcı deneyimi elde edildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.15",
    date: "5 Eylül 2026",
    summary:
      "Üst navigasyon çubuğunda (CategoryNav) yerleşim alanına sığmayarak kırpılan klinik kategorileri (Bakım Koltukları, Muayene Masaları, Cihaz Sehpaları), 'Hasta Yatağı Serilerimiz' dropdown mimarisine paralel olarak 2 sütunlu, zengin içerikli ve tam erişilebilir 'Medikal Ekipmanlar [Klinik]' açılır kartına dönüştürüldü; tüm ekran genişliklerinde kusursuz hizalama sağlandı.",
    items: [
      {
        title: "Klinik Kategorileri İçin 'Medikal Ekipmanlar' Açılır Menüsü (Dropdown)",
        category: "Yeni",
        details: [
          "Masaüstü menü satırında yatay taşmaya ve en sağdaki bağlantıların (İletişim, Sipariş Takibi) kırpılmasına sebep olan Bakım Koltukları, Muayene Masaları ve Cihaz Sehpaları bağımsız linklerden çıkarılarak 'Medikal Ekipmanlar [Klinik]' dropdown kartı altına toplandı.",
          "Menü kartı; Bakım Koltukları (Motorlu), Muayene Masaları (Klinik & Ahşap), Cihaz Sehpaları (Tekerlekli & Raflı), Dövme Kol Sehpaları (Ayarlanabilir), Tabure & Sandalyeler (Amortisörlü) ve Medikal Kozmetik (Klinik Sarf) olmak üzere 6 kategoriyi 2 sütunlu şık bir ızgarada özel SVG ikonları, rozetleri ve açıklamalarıyla sunacak şekilde inşa edildi.",
          "Alt bölüme 'Tüm Medikal & Klinik Ekipmanlarını İncele →' hızlı aksiyon linki eklendi.",
        ],
      },
      {
        title: "Çift Dropdown Etkileşim ve Erişilebilirlik Mimarisi",
        category: "İyileştirme",
        details: [
          "CategoryNavClient bileşeninde 'Hasta Yatağı Serilerimiz' ve 'Medikal Ekipmanlar' açılır kartları birbirine duyarlı hale getirildi; bir menü açıldığında diğeri otomatik kapanacak şekilde debounce'lu hover/click senkronizasyonu kuruldu.",
          "Her iki menü için bağımsız useRef ve document click/escape keydown dinleyicileri eklenerek dışa tıklandığında veya ESC tuşuna basıldığında kapanma garantilendi.",
          "Menü kartı 'shrink-0' ebeveyn içerisine konumlandırılarak dikey veya yatay CSS overflow kırpılması (clipping) kökten engellendi.",
        ],
      },
      {
        title: "Menü Genişliği Dengelemesi ve Mobil Şerit Genişletmesi",
        category: "İyileştirme",
        details: [
          "Ana navigasyon linkleri kompakt ve net hale getirildi (Tüm Ürünler, Hasta Karyolaları, Hasta Yatağı Serilerimiz [Özel], Medikal Ekipmanlar [Klinik], Kiralama Prosedürü, Medikal Blog, SSS, Hakkımızda, İletişim, Sipariş Takibi); 1024px ile 1440px arasındaki tüm çözünürlüklerde yatay kaydırma çubuğu oluşmadan tek satırda ferah görünüm elde edildi.",
          "Mobil yatay hızlı erişim şeridine (MobileNav Quick Strip) 'Bakım Koltukları' ve 'Muayene Masaları' eklenerek mobil kullanıcıların klinik ürünlere tek dokunuşla ulaşması sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v2.9.14",
    date: "5 Eylül 2026",
    summary:
      "WordPress (metromas.com / Platin Yatak) entegrasyonu tamamlanarak; sağlanan tüm soru havuzunu eksiksiz kapsayan 173 adet aktif soru-cevaplık devasa SSS veritabanı, 7 yeni derinlemesine medikal ve lojistik rehber yazısı, 5 model boru tipi havalı yatak ve amortisörlü yemek masası ürünleri görselleri ve zengin teknik özellikleriyle sisteme kazandırıldı; Kiralama Prosedürü sayfası yayına alındı.",
    items: [
      {
        title: "173 Soru-Cevaplık Devasa SSS (FAQ) Veritabanı ve Akıllı Kategori Senkronizasyonu",
        category: "Yeni",
        details: [
          "Kullanıcı tarafından iletilen 117+ soruluk listenin tamamı taranarak hiçbir soru atlanmadan MCARIS Medikal kurumsal kimliğine ve Ankara lojistiğine uyarlandı.",
          "PostgreSQL veritabanındaki aktif SSS sayısı 173'e çıkarıldı; Karyola & Modeller (52), Kiralama & Satış (38), Kullanım & Hasta Bakımı (32), Teknik Servis & Garanti (22), Teslimat & Montaj (17) ve Ödeme & SGK (12) olmak üzere 6 ana kategoride tam CRUD yönetilebilir hale getirildi.",
        ],
      },
      {
        title: "7 Yeni Kapsamlı Medikal & Lojistik Rehber Makalesi (Blog Genişletmesi)",
        category: "Yeni",
        details: [
          "Metromas üzerindeki en değerli içerikler MCARIS standartlarında yeniden yazılarak blog sistemine eklendi: Yaşlılarda Düşme Riskini Önleme, Ekonomik Hasta Yatağı Seçimi, Mobilyalı Ahşap Karyolalar, 2 Motorlu Karyola Çalışma Prensibi, Havalı Yatak 7/24 Kullanımı, Evde Bakımda Gerekli Medikal Ürünler ve Türkiye Geneli Güvenli Kargo Rehberi.",
          "Tüm makaleler semantik H2/H3 başlıklar, Schema.org Article yapılandırılmış verisi ve Ankara aynı gün teslimat vurgusuyla PostgreSQL blogPost modelinde aktif edildi.",
        ],
      },
      {
        title: "5 Model Boru Tipi Havalı Yatak ve Amortisörlü Yemek Masası Kataloğa Eklendi",
        category: "Yeni",
        details: [
          "Katalogdaki havalı yatak açığı kapatılarak P10 (8cm A+B), P20 (12cm A+B), P30 (12cm A+B+C), P40 (35° Pozisyon Veren), P50 (45° Ultra Pozisyon Veren) ve Amortisörlü Yemek Masası ürünleri eklendi.",
          "Ürün görselleri yerel depolama alanına (/uploads/products/) aktarıldı; motor gücü, ventilasyon borusu, taşıma kapasitesi ve CPR valfi gibi teknik nitelikler Schema.org microdata uyumlu specs JSON formatında işlendi.",
        ],
      },
      {
        title: "Kiralama Prosedürü ve Şartları Sayfası (/kiralama-proseduru)",
        category: "Yeni",
        details: [
          "30 günlük kiralama periyodu, hijyenik jelatinli şilte garantisi, depozitosuz kiralama, 2-4 saatte acil teknik servis ve adresten teslim alma şartlarını şeffafça açıklayan yeni kurumsal sayfa oluşturuldu.",
          "Footer navigasyonuna ve XML site haritasına (sitemap.ts) eklenerek arama motoru indekslemesi optimize edildi.",
        ],
      },
      {
        title: "Ürün ve Vitrin Kartlarında 'object-cover' Tam Alan Yerleşim Standardı",
        category: "Düzeltme",
        details: [
          "ProductCard bileşenindeki iç boşluk (p-2) ve 'object-contain' davranışı kaldırılarak 'object-cover w-full h-full' standardına geçirildi.",
          "Ankara ilçe hub sayfaları, sepet çekmecesi (CartDrawer), sipariş takip (OrderTracker), arama dropdown sonuçları ve admin medya seçici modalındaki tüm ürün thumbnail ve kart alanları kenardan kenara tam oturan (full-bleed) görünüme kavuşturuldu.",
          "Kare veya dikdörtgen şablonlarda görsellerin üst ve altında oluşan orantısız boşluklar ve gri şeritler (letterboxing) kalıcı olarak giderildi.",
        ],
      },
      {
        title: "Ankara Lojistik Filosu Hızlı Hizmet İlçeleri ve CTA Butonları Etkileşimi",
        category: "İyileştirme",
        details: [
          "Ana sayfa SEO alanındaki Ankara Bölge Lojistik Filosu bannerında yer alan statik 'Hızlı Hizmet İlçelerimiz' metinleri, 25 ilçenin yerel SEO iniş sayfalarına (/ankara-hasta-yatagi/[ilce]) giden tıklanabilir bağlantılara dönüştürüldü.",
          "Telefonla arama butonu telefon SVG ikonu ve biçimlendirilmiş numara ile (0536 820 02 69) yenilendi; yanına tek tıkla doğrudan WhatsApp danışma ve acil sipariş butonu eklendi.",
          "Hızlı ilçe linklerinin sonuna 'Tüm 25 İlçe →' hub bağlantısı eklenerek iç linkleme ve kullanıcı gezinmesi güçlendirildi.",
        ],
      },
    ],
  },
  {
    version: "v2.9.13",
    date: "5 Eylül 2026",
    summary:
      "SEO içerik ve strateji analizi tamamlanarak kopya içeriğe düşmeden tamamen MCARIS Medikal'in gerçek ürün ve fiyatlarına (19.000 ₺ - 89.500 ₺ satış / 3.500 ₺ - 9.500 ₺ kiralama) uyarlanmış 49 maddelik SSS veritabanı, 2026 fiyat ve kiralama matrisi, ana sayfa SEO akışı ve Ankara 25 ilçe hub sayfası inşa edildi.",
    items: [
      {
        title: "49 Maddelik Kapsamlı SSS (FAQ) Veritabanı ve Senkronizasyonu",
        category: "Yeni",
        details: [
          "MCARIS Medikal standartlarına uyarlanan ve 6 kategoriye (Karyola & Modeller, Kiralama & Satış, Teslimat & Montaj, Teknik Servis & Garanti, Ödeme & SGK, Kullanım & Hasta Bakımı) ayrılan 49 soru-cevap hazırlandı.",
          "Sorular PostgreSQL veritabanına otomatik senkronize edilerek /admin/sss paneli üzerinden tam CRUD (ekleme, düzenleme, silme) yönetilebilir hale getirildi; /sss sayfasında Schema.org FAQPage ve anlık filtrelemeli arayüz ile yayınlandı.",
        ],
      },
      {
        title: "2026 Güncel Hasta Yatağı Satış ve Kiralama Fiyat Matrisi",
        category: "Yeni",
        details: [
          "Kopya veri veya rakip fiyatları yerine MCARIS'in veritabanındaki reel ürün ve serilerine ait gerçek fiyatlar (19.000 ₺ - 89.500 ₺ satış, 3.500 ₺ - 9.500 ₺ kiralama) ile 2026 fiyat tablosu oluşturuldu.",
          "Tabloda 2 motorlu, 3 motorlu asansörlü, 4 motorlu Trendelenburg ve ahşap Burmeier Dali modelleri için donanım, kiralama ve satış bedelleri semantik microdata standartlarında listelendi.",
        ],
      },
      {
        title: "Ankara Odaklı SEO ve Hub Sayfası Güçlendirmesi",
        category: "İyileştirme",
        details: [
          "'Ankara hasta yatağı', 'ankara hasta yatağı kiralama', 'ankara hasta karyolası' aramalarında ilk sıra hedefiyle ana sayfa SEO içerik akışı ve /ankara-hasta-yatagi sayfası baştan sona zenginleştirildi.",
          "25 ilçede aynı gün 2 saatte ücretsiz teslimat, yerinde oda içi montaj, 2 yıl resmi servis garantisi, boru tipi havalı yatak bası yarası önleme kılavuzu ve SGK heyet raporu başvuru adımları eklendi.",
        ],
      },
    ],
  },

  {
    version: "v2.9.12",
    date: "5 Eylül 2026",
    summary:
      "Tüm ürün görsellerindeki (184 adet WebP) 16 piksellik yapay beyaz çerçeveler Sharp ile kayıpsız olarak kökten temizlendi (zero-border trim); tam ekran lightbox'taki görsel çökme ve görünmeme sorunu in-flow duyarlı yapı ile çözülerek dış boşluğa tıklayarak kapatma deneyimi mükemmelleştirildi.",
    items: [
      {
        title:
          "Ürün Görsellerinde 16px Beyaz Çerçevelerin Kökten Temizlenmesi (Trim)",
        category: "Düzeltme",
        details: [
          "Tüm ürün görsellerinin (184 adet WebP dosyasının) etrafında kaynak dosyalardan gelen 16 piksellik gömülü beyaz sınır pikselleri tespit edilerek Sharp optimizasyon hattıyla kayıpsız olarak kırpıldı (trim).",
          "Böylece galeri vitrininde ve küçük önizleme kartlarında (thumbnails) 'object-cover' kullanıldığında üst ve altta beliren beyaz aralıklar tamamen ortadan kalktı; stüdyo zeminleri çerçeveye sıfıra sıfır oturdu.",
        ],
      },
      {
        title:
          "Tam Ekran Lightbox Görsel Çökmesi & Görünmeme Hatası Düzeltildi",
        category: "Düzeltme",
        details: [
          "Lightbox içinde dinamik en-boy oranı hesaplanırken ortaya çıkan 0x0 piksel konteyner çökmesi ve görselin görünmemesi sorunu in-flow duyarlı görsel mimarisi ile kökten giderildi.",
          "Görsel sınırları hassas biçimde korunarak; görsel içine tıklama, çift tıklamayla yakınlaştırma, tekerlek zoom'u ve dış boşluğa (backdrop) tıklayarak tek hamlede kapatma deneyimi eksiksiz sağlandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.11",
    date: "5 Eylül 2026",
    summary:
      "Ürün detay sayfası galeri bileşenindeki ana vitrin görseli ve küçük önizleme kartları (thumbnails) 'object-cover' mimarisine geçirilerek kenar boşlukları sıfırlandı; fotoğrafların çerçeveye tam ve kusursuz oturması sağlandı.",
    items: [
      {
        title: "Ürün Galerisi Görsel Yerleşimi & Object-Cover Kök Çözümü",
        category: "Tasarım",
        details: [
          "Ana galeri kartındaki iç dolgular (padding) kaldırılarak görsel 'object-cover' ile 1:1 kare çerçeveye tam oturtuldu; üst ve altta oluşan boşluklar tamamen giderildi.",
          "Küçük önizleme (thumbnail) butonlarındaki gereksiz iç boşluklar ve 'object-contain' kaldırılıp 'object-cover' standardına geçirildi.",
          "Tam ekran lightbox altındaki küçük önizleme rayı da 'object-cover' standardına uyarlanarak görsel bütünlük korundu.",
        ],
      },
    ],
  },

  {
    version: "v2.9.10",
    date: "5 Eylül 2026",
    summary:
      "Ürün galerisi tam ekran lightbox modülüne akıllı dış boşluk (backdrop) tıklayarak kapatma deneyimi eklendi; sürükleme (drag/swipe) koruması, görsel içi tıklama izolasyonu, doğal en-boy oranı (aspect-ratio) uyumu ve sezgisel zoom-out imleci ile kullanıcı deneyimi (UX) mükemmelleştirildi.",
    items: [
      {
        title:
          "Tam Ekran Lightbox Dış Boşluk Tıklaması ve Akıllı Sürükleme İzolasyonu",
        category: "İyileştirme",
        details: [
          "Görselin etrafındaki tüm karanlık sahne boşluklarına (sol, sağ, üst, alt) tıklandığında lightbox'ın tek dokunuşla kapanması sağlandı.",
          "Sürükleme ve Pan Koruması: Kullanıcı görseli veya sahneyi kaydırdığında (drag/swipe) parmak/fare kalktığında modalın yanlışlıkla kapanmasını önleyen akıllı pointer mesafe takip mekanizması entegre edildi.",
          "Doğal En-Boy Oranı & Çift Katmanlı İzolasyon: Görselin doğal en-boy oranı (naturalWidth/naturalHeight) ile kutu sınırları tam hizalandı; resim içi tıklamaların dış sahneye sızması engellendi.",
          "Kullanıcı Deneyimi (UX) & İmleç Geri Bildirimi: Dış boşlukta gezinirken kullanıcıya kapanış hissini anlatan 'cursor-zoom-out' imleci ve açıklayıcı ipucu metinleri devreye alındı.",
          "Birim testleri (10/10) başarıyla tamamlandı; boşluğa tıklama, görsel içi tıklama ve sürükleme izolasyonu testleri doğrulandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.9",
    date: "5 Eylül 2026",
    summary:
      "Ürün galerisi tam ekran lightbox modülündeki fare tekerleği (mouse wheel) yakınlaştırma ve uzaklaştırma hatası giderildi; passive listener engeli aşılarak kesintisiz ve akıcı 0.25 kademeli zoom mimarisi devreye alındı.",
    items: [
      {
        title: "Ürün Galerisi Lightbox Fare Tekerleği (Wheel Zoom) Kök Çözümü",
        category: "Düzeltme",
        details: [
          "Framer Motion 'animate' bloğundaki statik 'scale: 1' çakışması giderilerek görsel ölçeklendirmesi dinamik 'scale' durumuna bağlandı.",
          "Tarayıcılarda varsayılan pasif tekerlek dinleyicilerinin e.preventDefault() çağrısını engellemesi sorunu, DOM düzeyinde '{ passive: false }' dinleyicisiyle kökten çözüldü.",
          "Fare tekerleği yukarı kaydırıldığında 0.25'lik adımlarla %100'den %300'e kadar kesintisiz büyüme, aşağı kaydırıldığında pürüzsüz küçülme sağlandı.",
          "ProductGallery.test.tsx test süitine fare tekerleği ile zoom test senaryosu eklenerek tüm birim testler yeşile çekildi.",
        ],
      },
    ],
  },

  {
    version: "v2.9.8",
    date: "5 Eylül 2026",
    summary:
      "Kategori açılır menüsü (Hasta Yatağı Serilerimiz) karanlık neon görünümden arındırılarak klinik ve modern beyaz tonda yeniden modellendi; üst bar arama formu ve 'Ara' butonu kusursuz iç/dış konsantrik (concentric) rounded-full geometriye uyarlandı.",
    items: [
      {
        title: "Kategori Açılır Menüsü Beyaz Ton & Kurumsal Yenileme",
        category: "Tasarım",
        details: [
          "Açılır menü (dropdown) yapay zeka jenerasyonu hissi veren koyu neon kart görünümünden temizlenerek saf beyaz (bg-white), hafif gri sınır (border-neutral-200) ve derinlikli gölge (shadow-2xl) mimarisine dönüştürüldü.",
          "Platinum, Gold ve Silver serileri için tıp ve yatak donanımını simgeleyen semantik minimalist SVG ikonlar ve kurumsal etiketler (VIP, Popüler, Ekonomik) entegre edildi.",
          "Menü açıkken 'Hasta Yatağı Serilerimiz' tetikleyici butonu beyaz renge dönerek altındaki beyaz açılır kartla kusursuz görsel bütünlük sağlandı.",
        ],
      },
      {
        title: "Üst Bar Arama Formu & Buton Konsantrik (Rounded-Full) Geometri",
        category: "İyileştirme",
        details: [
          "Arama formu dış kapsayıcısı ve içerisindeki 'Ara' butonu 'rounded-full' kapsül geometrisine kavuşturuldu.",
          "Dış form ve iç buton arasında eşit 4 piksellik (p-1) homojen konsantrik pay bırakılarak (Router - Rinner = 4px) tüm yay boyunca matematiksel açı uyumu sağlandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.7",
    date: "5 Eylül 2026",
    summary:
      "Ürün kartlarında yalnızca 'İncele' butonunun tıklanabilir olması kısıtı kaldırılarak, görsel, başlık, fiyat ve tüm kart gövdesini kapsayan tam yüzey (full-surface) tıklanabilirlik ve hover mimarisi entegre edildi.",
    items: [
      {
        title: "Ürün Kartı Tam Yüzey Tıklanabilirlik & UX Dönüşümü",
        category: "İyileştirme",
        details: [
          "Yalnızca alt köşedeki 'İncele' butonuna tıklama zorunluluğu ortadan kaldırıldı; kart dış kapsayıcısı doğrudan semantic Next.js <Link> bileşeni ile sarmalandı.",
          "Görsel, başlık, kategori adı ve kart boşluğunun tamamı tek dokunuşla veya tıklamayla anında ilgili ürün detay sayfasına yönlendirir hale getirildi.",
          "Kartın üzerine gelindiğinde tüm kartı ve görseli canlandıran 'hover:border-neutral-900', 'hover:shadow-md' ve 'group-hover:scale-105' micro-animasyonları entegre edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.9.6",
    date: "5 Eylül 2026",
    summary:
      "Canlı AJAX ürün arama API rotasındaki (/api/search) şema uyumsuzluğu (olmayan 'isActive' alanı) ve 500 hatası giderildi; çoklu kelime tokenizasyonu ve insensitive SQL LIKE aramasıyla canlı ürün önerileri aktif hale getirildi.",
    items: [
      {
        title:
          "Canlı AJAX Arama (Search API) Kök Hata Düzeltmesi & Çoklu Token Eşleştirme",
        category: "Düzeltme",
        details: [
          "Veritabanı şemasında Product modelinde bulunmayan 'isActive: true' parametresinin Prisma sorgusunda 500 Internal Server Error fırlatması ve aramayı kilitlemesi sorunu kökten çözüldü.",
          "Arama sorgusu kelimelere bölünerek (tokenize) ürün adı, slug, kısa açıklama, detaylı açıklama ve kategori adında büyük/küçük harf duyarsız (case-insensitive) akıllı arama yapacak şekilde genişletildi.",
          "GET /api/search rotası için kapsamlı birim test paketi (route.test.ts) yazılarak tüm arama varyasyonları doğrulandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.5",
    date: "5 Eylül 2026",
    summary:
      "Kategori navigasyon barında 'Hasta Yatağı Serilerimiz' alt menü açılır kartının (dropdown) 'overflow-x-auto' kapsayıcısı tarafından kırpılarak gizlenmesi (clipping) sorunu giderildi; birincil menü ve açılır kart mimarisi taşma izolasyonuyla kusursuz açılır hale getirildi.",
    items: [
      {
        title: "Kategori Menüsü Dropdown Kırpılma (Clipping) Çözümü",
        category: "Düzeltme",
        details: [
          "CategoryNavClient bileşeninde 'overflow-x-auto' sınıfı içeren ebeveyn kapsayıcının, içerisindeki 'absolute' konumlu 338 piksellik alt menü kartını dikeyde kırparak gizlemesi sorunu kökten çözüldü.",
          "Birincil mağaza bağlantıları ve açılır menü (Tüm Ürünler, Hasta Karyolaları, Hasta Yatağı Serilerimiz) taşma kısıtlamasından izole edilerek 'overflow: visible' bloğuna alındı.",
          "İkincil sayfalar (Bakım Koltukları, Muayene Masaları vb.) dar ekranlarda bağımsız yatay kaydırma konteynerine alınarak dropdown etkileşiminden ayrıştırıldı.",
          "Masaüstü görünümünde 'Hasta Yatağı Serilerimiz' tıklandığında veya üzerine gelindiğinde kartın pürüzsüzce aşağı doğru açıldığı ve tam görünür olduğu doğrulandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.4",
    date: "5 Eylül 2026",
    summary:
      "Header favoriler (kalp) ve sepet sayaç rozetlerindeki geçersiz boyut sınıfları ve sıfır padding hatası giderildi; daire/hap geometri, min-w-[19px], px-1 ve zemin halkası (ring-2) ile kusursuz hale getirildi.",
    items: [
      {
        title: "Favoriler & Sepet Rozeti Geometri ve Padding Düzeltmesi",
        category: "Düzeltme",
        details: [
          "Tailwind CSS tarafından desteklenmeyen ve tarayıcıda geçersiz kalan 'w-4.5 h-4.5' sınıfları kaldırılarak 'min-w-[19px] h-[19px] px-1' standartlarına geçildi.",
          "Tek basamaklı sayılarda ('4') sayının kenarlara yapışarak dikey basık elips oluşturması hatası giderildi; sayı tam ortalanmış dairesel forma kavuşturuldu.",
          "Çift basamaklı sayılarda ('12', '99+') rozetin pürüzsüz yatay kapsül haline gelmesi ve kenarlardan taşmaması sağlandı.",
          "Header zemin rengiyle kontrast sağlayan 'ring-2 ring-[#0B1528]' halkası ve 'tabular-nums' font hizalaması entegre edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.9.3",
    date: "5 Eylül 2026",
    summary:
      "Mobil ekranda fixed header'ın içerik üstünü örtme ve örtüşme (overlap) problemi giderildi; AppShell header mimarisi 'sticky top-0' doğal akış standardına geçirilerek tüm sayfa başlıkları ve rozetler pürüzsüz görünür kılındı.",
    items: [
      {
        title: "Mobil Header Sticky Mimari & İçerik Örtüşme (Overlap) Çözümü",
        category: "Düzeltme",
        details: [
          "AppShell bileşeninde katı 'fixed top-0' ve hardcoded 'pt-[116px]' yapısı kaldırılarak modern 'sticky top-0' standardına geçildi.",
          "Mobilde 179 piksele ulaşan 2 katmanlı header'ın (Logo + Arama + Kategori şeridi), sayfanın en üstündeki şehir/güven rozetini ('Ankara | Aynı Gün Ücretsiz Teslimat') ve H1 ana başlığını kesip arkasında bırakması sorunu tamamen çözüldü.",
          "HeaderClient içindeki mükerrer iç <header> etiketi semantik <div> ile düzeltilerek W3C DOM hiyerarşisi sağlandı.",
          "Mobil arama barı beyaz kapsül ada buton tasarımı ve responsive kaydırma etkileşimleri test edilerek doğrulandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.2",
    date: "5 Eylül 2026",
    summary:
      "Vitrin kategori kartları (Popüler Hasta Karyolası & Medikal Kategoriler) tam dolum (object-cover) ve Concentric UI standartlarına uyarlandı; oda arka planlı ve oransız görseller 4:3 oranında saf beyaz zeminli yüksek çözünürlüklü dekupe medikal görsellerle yenilendi.",
    items: [
      {
        title:
          "Vitrin Kategori Kartları Object-Cover & Görsel Standardizasyonu",
        category: "Tasarım",
        details: [
          "Vitrin kategori kartlarında iç görsel alanı tam dolum ('object-cover w-full h-full') standardına geçirildi; padding kaynaklı çerçeve kırılmaları ve oran bozulmaları giderildi.",
          "Orijinalinde oda arka planlı, tavanı ve başlığı kesilen 'Platinum Seri' görseli yerine 4 motorlu Burmeier Dali hasta karyolasının 1000x750 (4:3) saf beyaz zeminli stüdyo dekupe görseli yerleştirildi.",
          "Kategori vitrininde mükerrer karyola resmi gösteren 'Transfer Lifti' kartı için Invacare Birdie EVO hasta transfer liftinin 1000x750 (4:3) dekupe medikal görseli üretilerek entegre edildi.",
          "Tüm vitrin görselleri (Platinum, Gold, Silver, Hasta Yatakları vb.) kartın 4:3 en-boy oranına piksel piksel kalibre edilerek pürüzsüz Concentric geometri sağlandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.1",
    date: "5 Eylül 2026",
    summary:
      "Header arama barı Concentric UI geometri standartlarına göre yenilendi; 'Ara' butonu beyaz kapsülün içine p-1 boşluklu ada buton olarak yerleştirilerek pikselleşmiş beyaz kenar sızıntısı tamamen sıfırlandı.",
    items: [
      {
        title: "Header Arama Barı Concentric Geometri & Piksel Düzeltmesi",
        category: "Düzeltme",
        details: [
          "Arama formu dış çerçevesine 'p-1' dolgu verilerek 'Ara' butonu 'rounded-lg' ile beyaz kapsülün içine ada buton olarak yerleştirildi.",
          "Koyu butonun beyaz taşıyıcı çerçeveyle kesişimindeki 1 piksellik beyaz kenar sızıntısı ve taşma hatası tamamen giderildi.",
          "Header.test.tsx birim testleri güncellenerek tüm testler başarıyla doğrulandı.",
        ],
      },
    ],
  },

  {
    version: "v2.9.0",
    date: "5 Eylül 2026",
    summary:
      "Ürün detay sayfası galeri arayüzü sıfırdan yenilendi; React 19 ve Framer Motion destekli sinematik tam ekran Lightbox modülü (çift tıklama/tekerlek zoom, pan, dokunmatik swipe gezinme, klavye kısayolları) ve akıllı küçük resim önizleme mimarisi entegre edildi.",
    items: [
      {
        title: "Yeni Nesil Sinematik Lightbox & Galeri Mimarisi",
        category: "Yeni",
        details: [
          "Sıfır harici paket bağımlılığıyla React 19 ve Framer Motion tabanlı modüler 'ProductLightbox' bileşeni inşa edildi.",
          "Kademeli zoom (%100 - %300), fare tekerleğiyle yakınlaştırma, çift tıklama geçişi ve yakınlaştırılmış görselde serbest pan (sürükleme) kontrolleri eklendi.",
          "Masaüstü ve mobil ekranlarda yön duyarlı slide geçişi, touch swipe jestleri ve aktif görseli otomatik ortalayan akıllı küçük resim şeridi geliştirildi.",
          "Klavye erişilebilirliği (Esc, Sol/Sağ ok tuşları, +, -, 0 reset, F tam ekran) ve Schema.org ImageObject semantik yapısı entegre edildi.",
          "Kapsamlı birim test paketi (ProductGallery.test.tsx) ile tüm etkileşimler doğrulandı.",
        ],
      },
    ],
  },

  {
    version: "v2.8.6",
    date: "4 Eylül 2026",
    summary:
      "Footer alt yasal ve mini bağlantı alanına 'Hasta Yatakları' dış bağlantısı entegre edildi, bileşen birim testleri güncellendi.",
    items: [
      {
        title: "Footer Dış Bağlantı & Test Güncellemesi",
        category: "İyileştirme",
        details: [
          "Footer alt yasal menüsüne doğrudan 'Hasta Yatakları' (https://www.medikalhastayatak.com/) bağlantısı eklendi.",
          "Footer.test.tsx birim testleri yeni bağlantı doğrulaması ve kurumsal sayfa bağlantı eşleştirmesi ile güncellendi.",
        ],
      },
    ],
  },

  {
    version: "v2.8.5",
    date: "2 Eylül 2026",
    summary:
      "Tüm katalogdaki 62 medikal ürünün görselleri kaynak klasör hiyerarşisi üzerinden birebir eşleştirilerek Sharp auto-trim ve WebP optimizasyonuyla veritabanına ve medya kütüphanesine işlendi.",
    items: [
      {
        title: "Birebir Ürün-Görsel Kaynak Eşleştirmesi & Optimizasyon",
        category: "İyileştirme",
        details: [
          "Kaynak klasördeki ürün adları, WooCommerce ID'leri ve model hiyerarşileri taranarak 62 ürünün tamamı için 182 adet orijinal görsel eşleştirildi.",
          "Tüm görseller beyaz kenar boşlukları kırpılarak (Auto-Trim) doğrudan saf statik WebP formatına dönüştürüldü ve veritabanı kayıtları güncellendi.",
        ],
      },
    ],
  },

  {
    version: "v2.8.4",
    date: "2 Eylül 2026",
    summary:
      "Tüm ürünlerin teknik özellikleri, görselleri, stok durumu, fiyat ve kargo detaylarını içeren uluslararası standartta İngilizce Google Merchant Center & Shopping XML Feed rotası (/feed.xml, /products.xml, /google-shopping.xml) oluşturuldu.",
    items: [
      {
        title: "İngilizce Google Shopping & Merchant Center Product XML Feed",
        category: "Yeni",
        details: [
          "Google Shopping RSS 2.0 ve XML standartlarında ('/feed.xml') tüm ürün alanlarını (ID/SKU, Title, Description, Image/Gallery Links, Availability, Price TRY, Brand, Condition, Category, Shipping, Technical Specs) içeren dinamik besleme rotası inşa edildi.",
          "'/products.xml', '/google-feed.xml' ve '/google-shopping.xml' takma adları 'next.config.mjs' rewrites ile yapılandırıldı.",
        ],
      },
    ],
  },

  {
    version: "v2.8.3",
    date: "2 Eylül 2026",
    summary:
      "Admin Ürün Yönetim Merkezi (/admin/urunler) baştan aşağı yenilendi: Satır içi hızlı fiyat/stok düzenleme, tek tıkla ürün klonlama (çoğaltma), toplu yüzde bazlı fiyat artışı/indirimi, toplu stok ve kategori taşıma, depo KPI özet kartları ve Excel/CSV dışa aktarım desteği devreye alındı.",
    items: [
      {
        title: "Satır İçi Hızlı Düzenleme & Ürün Klonlama",
        category: "Yeni",
        details: [
          "Tablodan ayrılmadan Fiyat ve Stok alanları üzerine tıklanarak anında satır içinde güncellenebilir hale getirildi.",
          "Mevcut bir medikal ürünü tüm teknik özellikleri ve görselleriyle tek tıkla çoğaltmayı sağlayan 'Klonla' motoru eklendi.",
        ],
      },
      {
        title: "Toplu İşlemler Çubuğu & Excel / CSV Dışa Aktarım",
        category: "Yeni",
        details: [
          "Çoklu ürün seçimiyle toplu yüzde bazlı fiyat zam/indirim (%10, %20 vb.), toplu stok belirleme ve toplu kategori taşıma yeteneği inşa edildi.",
          "Filtrelenmiş ürün listesini Türkçe karakter destekli UTF-8 Excel CSV dosyası olarak indirme özelliği eklendi.",
        ],
      },
    ],
  },

  {
    version: "v2.8.2",
    date: "2 Eylül 2026",
    summary:
      "Next.js görsel proxy URL'sindeki '%2F' slash kodlamaları ve query parametreleri tamamen kaldırılarak, önceden WebP formatında optimize edilmiş tüm ürün fotoğraflarının doğrudan saf statik URL ('https://shop.mcaris.com.tr/uploads/products/...') ile en yüksek hız ve kusursuz SEO ile servis edilmesi sağlandı.",
    items: [
      {
        title: "Doğrudan Temiz Statik URL Mimarisi & '%2F' Temizliği",
        category: "İyileştirme",
        details: [
          "'next.config.mjs' üzerinde 'images.unoptimized = true' yapılandırılarak Next.js'in URL encode edilmiş '/_next/image?url=%2F...' sarmalayıcısı devre dışı bırakıldı.",
          "Tüm ürün ve vitrin görselleri doğrudan temiz ve saf '/uploads/products/urun-1-hash.webp' adresiyle servis edilmeye başlandı.",
          "Görsel yüklenme hızı CPU proxy gecikmesi olmadan sıfır ek yüke indirildi.",
        ],
      },
    ],
  },

  {
    version: "v2.8.1",
    date: "2 Eylül 2026",
    summary:
      "Tüm ürün fotoğraflarının çevresindeki gereksiz beyaz ve boşluk alanlar 'sharp.trim()' algoritmasıyla otomatik kırpılarak ürünlerin kadraja tam ve boşluksuz oturması sağlandı; görsel URL yapısı sadeleştirilmiş 4 haneli benzersiz SEO hash standardına bağlandı.",
    items: [
      {
        title: "Otomatik Kenar Boşluğu Kırpma (Sharp Auto-Trim) & Sade URL",
        category: "İyileştirme",
        details: [
          "Görsellerin çevresindeki orantısız beyaz/şeffaf kenar boşlukları otomatik kırpılarak fotoğrafların vitrinde tam ve zengin görünmesi sağlandı.",
          "Görsel dosya adları '${productSlug}-${sira}-${kisaHash}.webp' formatında sadeleştirildi.",
          "Mevcut 156 ürün görseli yeni kırpma standardıyla baştan işlendi.",
        ],
      },
    ],
  },

  {
    version: "v2.8.0",
    date: "2 Eylül 2026",
    summary:
      "Tüm 62 ürünün veritabanındaki 156 görseli 'sharp' motoru ile optimize edilerek doğrudan '${productSlug}-${sira}-${kisaHash}.webp' semantik SEO formatına dönüştürüldü; eski 'product-1786...' dosya adları tamamen temizlendi.",
    items: [
      {
        title: "Tüm Ürün Görsellerinin Semantik WebP Formatına Toplu Göçü",
        category: "İyileştirme",
        details: [
          "Veritabanındaki 62 ürünün tamamının görsel yolları '/uploads/products/${productSlug}-${sira}-${kisaHash}.webp' olarak güncellendi.",
          "Hero vitrini, Günün Fırsatı ve ürün detay sayfaları yeni optimize WebP dosya adlarıyla senkronize edildi.",
          "Diskteki tüm eski 'product-1786...' dosyaları temizlenerek sunucu depolaması optimize edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.7.9",
    date: "2 Eylül 2026",
    summary:
      "Tüm görsel yükleme ve barındırma altyapısı 'sharp' motoru ile otomatik WebP formatına ve '${productSlug}-${sira}-${kisaHash}.webp' semantik SEO yapısına dönüştürüldü; Admin Medya Kütüphanesi (/admin/medya) ve ürün formu görsel seçici modalı devreye alındı.",
    items: [
      {
        title: "Otomatik WebP Dönüştürme & Semantik SEO İsimlendirmesi",
        category: "Yeni",
        details: [
          "'sharp' kütüphanesi entegre edilerek tüm yüklenen görseller otomatik WebP formatına çevrilip disk boyutu %70 küçültüldü.",
          "Görsel URL yapısı '${productSlug}-${index}-${hash}.webp' semantik standardına bağlandı.",
        ],
      },
      {
        title: "Admin Medya Yönetim Merkezi (/admin/medya)",
        category: "Yeni",
        details: [
          "Diskteki tüm görselleri listeleme, canlı arama, 'ürüne bağlı / boşta' filtreleme ve tek tıkla silme/eşleme ekranı inşa edildi.",
          "Ürün formlarında ('/admin/urunler/[id]') diskteki görsellerden seçim ve sıralama yapmayı sağlayan 'MediaPickerModal' devreye alındı.",
        ],
      },
    ],
  },

  {
    version: "v2.7.8",
    date: "2 Eylül 2026",
    summary:
      "Eski ve atıl 'master' dalı hem yerel ortamdan hem de GitHub uzak deposundan tamamen temizlenerek, tüm geliştirmelerin tek doğruluk kaynağı olan 'main' dalı tekil ana dal olarak konsolide edildi.",
    items: [
      {
        title: "Git Dal Standardizasyonu & 'master' Temizliği",
        category: "İyileştirme",
        details: [
          "17 Ağustos tarihli eski 'master' dalı yerel ve uzak (remote origin) depodan silindi.",
          "Tüm proje akışı ve üretim ortamı 'main' dalı üzerinde standartlaştırıldı.",
        ],
      },
    ],
  },

  {
    version: "v2.7.7",
    date: "2 Eylül 2026",
    summary:
      "Tüm 62 ürünün görsel eşleşmeleri kategori ve model bazında tek tek denetlenerek; hasta karyolaları, transfer liftleri, kol sehpaları, muayene masaları, bakım koltukları ve kozmetik ürünleri ait oldukları gerçek klinik fotoğraflarla %100 senkronize edildi.",
    items: [
      {
        title: "Kategori & Model Bazlı Kesin Görsel Eşleştirmesi",
        category: "Düzeltme",
        details: [
          "Hasta karyolalarına (2, 3, 4 motorlu, Burmeier Dali, Baza) yanlışlıkla atanan sehpa ve tabure görselleri kaldırılarak yerlerine gerçek hasta yatağı fotoğrafları bağlandı.",
          "Dövme kol sehpaları, tabureler, bakım koltukları, veteriner masaları ve Carine dermokozmetik ürünlerinin tüm galeri bağlantıları modellerine göre eksiksiz yapılandırıldı.",
        ],
      },
    ],
  },

  {
    version: "v2.7.6",
    date: "2 Eylül 2026",
    summary:
      "Tüm ürünlerin görsel dosya adları, MD5 kriptografik hash doğrulaması ile 2 gün önceki (31 Ağustos) orijinal 227 dosya adına (%100 matematiksel eşleşmeyle) geri döndürüldü ve sonradan üretilen 213 klon dosya temizlendi.",
    items: [
      {
        title: "2 Gün Önceki Orijinal Görsel Havuzuna Kusursuz Dönüş",
        category: "Düzeltme",
        details: [
          "Diskteki 210 ürün görseli, 2 gün önceki 'product-1786...' orijinal dosyalarıyla MD5 hash seviyesinde eşleştirilerek veritabanına aktarıldı.",
          "Dün oluşturulan 213 adet kopya/klon dosya diskten silinerek 'public/uploads/products/' dizini 227 orijinal dosyaya indirildi.",
          "Hero vitrini ve Günün Fırsatı bileşenlerindeki görsel referansları güncellendi.",
        ],
      },
    ],
  },

  {
    version: "v2.7.5",
    date: "2 Eylül 2026",
    summary:
      "Tüm 62 ürünün görsel dizileri tam regex eşleşmesiyle taranarak, çapraz alt-slug karışıklıkları (örneğin kol dayama sehpası 1 ve 2 arasındaki görsel çakışmaları) giderildi ve tüm ürünler orijinal fotoğraflarıyla senkronize edildi.",
    items: [
      {
        title: "Tüm 62 Ürün İçin Birebir Orijinal Görsel Eşleşmesi",
        category: "Düzeltme",
        details: [
          "Veritabanındaki 62 ürünün tamamı taranarak her ürünün yalnızca kendi gerçek fotoğraflarını içermesi sağlandı.",
          "Çapraz dosya ve ön-ek karışıklıkları giderilerek tüm galeri bağlantıları eksiksiz hale getirildi.",
        ],
      },
    ],
  },

  {
    version: "v2.7.4",
    date: "2 Eylül 2026",
    summary:
      "Ürün görsellerinin dosya adlandırmaları ve fiziksel görsel eşleştirmeleri, orijinal kararlı yükleme yapılarına (dali-low-entry-econ, silver-2-motorlu, gold-3-motorlu, vesta, regia, isa-compact vb.) eksiksiz geri döndürüldü.",
    items: [
      {
        title: "Orijinal Görsel Dosya Adlandırmalarına Geri Dönüş",
        category: "Düzeltme",
        details: [
          "Dün sabahki kararlı ve orijinal görsel dosya adları veritabanında ilgili 62 ürünle birebir eşleştirilerek restore edildi.",
          "Burmeier Dali, ISA Compact Lift, Vesta Koltuk, Regia Çift Kişilik Karyola, Herrman ve Pinea modelleri orijinal yüksek kaliteli kaynak fotoğraflarına bağlandı.",
        ],
      },
    ],
  },

  {
    version: "v2.7.3",
    date: "2 Eylül 2026",
    summary:
      "Ürün detay sayfalarındaki görsel SEO mimarisi, HTML5 semantik <figure> yapısı, Schema.org ImageObject DOM mikro verileri ve 62 ürünün doğru semantik görsel dosyalarıyla eşleştirilmesi tamamlandı.",
    items: [
      {
        title: "Ürün Görseli & Dosya Adı Senkronizasyonu",
        category: "Düzeltme",
        details: [
          "Veritabanında Lift ve karyola ürünlerinde tespit edilen dosya adı ve görsel eşleşmeleri diskteki gerçek semantik dosyalarla (örneğin 'mcaris-birdie-evo-katlanabilir-hasta-tasima-ve-transfer-lifti-1.webp') senkronize edildi.",
          "Tüm 62 ürünün görsel dizisi düzeltildi.",
        ],
      },
      {
        title: "HTML5 Semantic <figure> & Schema.org ImageObject",
        category: "İyileştirme",
        details: [
          "Ürün galerisi ana görseli <figure itemProp='image' itemScope itemType='https://schema.org/ImageObject'> sarmalayıcısına alındı.",
          "Dinamik kategori bazlı 'alt' ve 'title' etiketleri (anahtar kelime yığması engellenerek) optimize edildi.",
          "OpenGraph görsel metadata standartları 1200x630 çözünürlük ile güçlendirildi.",
        ],
      },
    ],
  },

  {
    version: "v2.7.2",
    date: "2 Eylül 2026",
    summary:
      "Eski arayüz mimarisindeki 13 kritik bölümün tamamı (Güven Rozetleri, Kategori Izgarası, Yeni Gelenler, Çok Satanlar ve Canlı İstatistik Sayacı) eksiksiz olarak ana sayfa akışına restore edildi.",
    items: [
      {
        title: "Tam 13 Bölümlü Ana Sayfa Akış Restorasyonu",
        category: "İyileştirme",
        details: [
          "Eksik kalan 'TrustFeatures' (4'lü Garanti ve Sevkiyat Rozetleri) ve 'CategoryShortcuts' (8'li Kategori Izgarası) eklendi.",
          "Yeni Gelenler ('NewArrivals') ve Haftanın En Çok Tercih Edilenleri ('PopularProducts') ürün vitrinleri entegre edildi.",
          "Koyu lacivert 4'lü 'LiveStatsBanner' (10.000+ Mutlu Hasta, 81 İl, %100 Memnuniyet, 15+ Yıl Tecrübe) sayacı ana sayfaya bağlandı.",
        ],
      },
    ],
  },

  {
    version: "v2.7.1",
    date: "2 Eylül 2026",
    summary:
      "Ana sayfa akışındaki tüm bölümler (Hero, Öne Çıkan 8'li Ürün Izgarası, Günün Fırsatı, Promo Bannerlar, Google Yorumları, Medikal Blog ve SEO Bilgi Bankası) baştan sona denetlenerek eksik bölümler ve veri sorguları giderildi.",
    items: [
      {
        title: "Dinamik 8'li Öne Çıkan Ürün Izgarası (getFeaturedProducts)",
        category: "Düzeltme",
        details: [
          "Daha önce yalnızca 3 adet ürünle sınırlı kalan sorgu mantığı 8 ürüne genişletildi.",
          "Platinum, Gold, Silver serileri ve popüler hasta yatakları öncelikli olmak üzere 8'li grid eksiksiz ve zengin şekilde dolduruldu.",
        ],
      },
      {
        title: "Ana Sayfa Dinamik Medikal Blog Bloğu (HomeBlogSection)",
        category: "Yeni",
        details: [
          "Ana sayfaya PostgreSQL veritabanından ve admin panelinden yönetilen en son 3 medikal rehber yazısını çeken dinamik 'HomeBlogSection' bileşeni eklendi.",
          "İç linkleme (PageRank) ve hasta bakım rehberi kullanıcı deneyimi güçlendirildi.",
        ],
      },
    ],
  },

  {
    version: "v2.7.0",
    date: "2 Eylül 2026",
    summary:
      "Fiyat ve teslimat kutusuna kurumsal cam efektli (glassmorphism) minimalist SVG lojistik/teslimat ikonu entegre edilerek estetik denge sağlandı.",
    items: [
      {
        title: "Kurumsal Lojistik & Hızlı Sevk İkonu",
        category: "Tasarım",
        details: [
          "Fiyat kutusunun sağ sütununa 36x36px 'bg-white/10' cam zeminli net SVG teslimat ikonu eklendi.",
          "Tipografi, ikon ve fiyat alanları dikeyde tam merkezlenerek üst düzey e-ticaret standardına getirildi.",
        ],
      },
    ],
  },

  {
    version: "v2.6.9",
    date: "2 Eylül 2026",
    summary:
      "Fiyat kutusundaki yapay rozet/hap elementleri tamamen kaldırılarak, Shopier ve Apple Store standartlarında saf ve kurumsal tipografik hiyerarşi uygulandı.",
    items: [
      {
        title: "Saf Tipografik Fiyat & Sevkiyat Bloğu",
        category: "Tasarım",
        details: [
          "Fiyat kutusundaki yapay yeşil dot/kapsül rozet kaldırıldı.",
          "Fiyat, KDV ve stok/aynı gün sevk bilgisi kurumsal metin hiyerarşisiyle birbirine dengeli iki sütun halinde yapılandırıldı.",
        ],
      },
    ],
  },

  {
    version: "v2.6.8",
    date: "2 Eylül 2026",
    summary:
      "Ürün teknik nitelikleri (specs) Google Rich Snippets için Schema.org 'additionalProperty' (PropertyValue) ve DOM HTML5 Microdata formatında arama motoru botlarına tam indekslenebilir hale getirildi.",
    items: [
      {
        title: "Schema.org additionalProperty & PropertyValue Entegrasyonu",
        category: "İyileştirme",
        details: [
          "Ürünün motor sayısı, taşıma kapasitesi, korkuluk tipi, şase kalınlığı, kilitli tekerlek vb. tüm teknik parametreleri Google JSON-LD şemasına 'additionalProperty' olarak eklendi.",
          "SpecTable bileşenine HTML5 Microdata (itemScope, itemType, itemProp='name', itemProp='value') tanımlanarak botların sayfayı doğrudan taranması sağlandı.",
          "generateMetadata keywords dizisi ürünün teknik parametreleriyle otomatik olarak zenginleştirildi.",
        ],
      },
    ],
  },

  {
    version: "v2.6.7",
    date: "2 Eylül 2026",
    summary:
      "Ürün kısa açıklama alanında eski içe aktarım (import) hatasından kaynaklanan '...de bakım' başlangıç kırpılması veritabanı düzeyinde düzeltilerek metin bütünlüğü sağlandı.",
    items: [
      {
        title: "Kısa Açıklama Metin Bütünlüğü Doğrulaması",
        category: "Düzeltme",
        details: [
          "Veritabanındaki 'mcaris-2-motorlu-abs-hasta-karyolasi' kaydının eksik olan 'Hem evde bakım süreçlerinde...' başlangıç cümlesi eksiksiz olarak güncellendi.",
          "Ürün detay sayfasındaki kısa açıklama kutusu (%100 tam ve akıcı Türkçe cümle yapısıyla) senkronize edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.6.6",
    date: "2 Eylül 2026",
    summary:
      "Görsel galerisindeki solukluk/şeffaflık hatası, fiyat kutusundaki yapay yeşil hap rozet ve ikonsuz 4 güven kartı düzeltilerek Shopier/Apple standardında rafine edildi.",
    items: [
      {
        title: "Ürün Galerisi Thumbnail Netliği (ProductGallery)",
        category: "Tasarım",
        details: [
          "Pasif görsellerdeki 'opacity-60' solukluk/gri filtre kaldırıldı; tüm küçük önizlemelerin %100 canlı ve net kalması sağlandı.",
          "Aktif görsel çerçevesi keskin 'border-neutral-950' ile sadeleştirildi.",
        ],
      },
      {
        title: "Minimalist Stok Durumu & İkonlu 4 Güven Sütunu",
        category: "Tasarım",
        details: [
          "Fiyat kutusundaki yapay yeşil hap rozet yerine temiz beyaz/yeşil durum noktası entegre edildi.",
          "İçi boş 4 güven kartına medikal lojistik ve servis SVG ikonları eklenerek kurumsal Concentric UI tasarımına kavuşturuldu.",
        ],
      },
    ],
  },

  {
    version: "v2.6.5",
    date: "2 Eylül 2026",
    summary:
      "Ürün detay sayfasındaki sahte 1 yorum fallback hatası tamamen temizlendi; gerçek veritabanı puan ve yorum hesaplaması, iyimser yorum gönderimi ve moderasyon paneli senkronize edildi.",
    items: [
      {
        title: "Dinamik Yorum Sayacı & Yıldız Puanı Doğrulaması",
        category: "Düzeltme",
        details: [
          "Veritabanında onaylı yorum bulunmadığında başlıkta '1 Yorum' gösterilmesine yol açan statik fallback kodu kaldırıldı.",
          "Onaylı yorum yoksa 'Henüz Değerlendirilmedi - İlk Yorumu Bırakın' rozeti, onaylı yorumlar varsa gerçek aritmetik ortalama puan ve gerçek yorum sayısı dinamik olarak hesaplanıp listelenmektedir.",
        ],
      },
      {
        title:
          "Kullanıcı Yorum Formu & Sonner Bildirim Entegrasyonu (ProductReviews)",
        category: "İyileştirme",
        details: [
          "İstemci tarafında form gönderildiğinde sonner toast bildirimi ve anlık iyimser güncelleme devreye alındı.",
          "Admin onay akışı (/admin/yorumlar) ile tam uyumlu çalışacak şekilde yapılandırıldı.",
        ],
      },
    ],
  },

  {
    version: "v2.6.4",
    date: "2 Eylül 2026",
    summary:
      "Statik SSS verileri PostgreSQL veritabanına ve Admin Yönetim Paneline (/admin/sss) taşındı; otomatik tohumlama (seeding), dinamik CRUD ve vitrin senkronizasyonu devreye alındı.",
    items: [
      {
        title: "Admin SSS & Destek Yönetim Paneli (/admin/sss)",
        category: "Yeni",
        details: [
          "Admin panelinde soru ekleme, düzenleme, silme, sıralama ve yayın durumu (aktif/pasif) değiştirme modülü geliştirildi.",
          "Veritabanında Faq modeli tanımlandı ve ilk 11 medikal hasta karyolası sorusu otomatik olarak veritabanına aktarıldı.",
        ],
      },
      {
        title: "Dinamik SSS & Schema.org JSON-LD Entegrasyonu (/sss)",
        category: "İyileştirme",
        details: [
          "Vitrin SSS sayfası ve Google FAQPage arama motoru şeması doğrudan veritabanındaki dinamik içeriklerle senkronize edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.6.3",
    date: "2 Eylül 2026",
    summary:
      "Ürün detay sayfası (/urun/[slug]) ve interaktif ürün galerisi baştan sona modernize edildi; Shopier / Stripe standardında yüksek kontrastlı tipografi, 4'lü klinik güven sütunu ve akıcı satın alma/WhatsApp deneyimi devreye alındı.",
    items: [
      {
        title: "Ürün Galerisi & Lightbox Modernizasyonu (ProductGallery)",
        category: "Tasarım",
        details: [
          "Görsel galerisindeki eski yapılar kaldırılarak yüksek DPI destekli, yumuşak kaydırma animasyonlu ve Esc/klavye kontrollü tam ekran lightbox devreye alındı.",
          "Gereksiz dekoratif AI noktaları kaldırılarak minimalist numaratör ve aktif görsel halkası entegre edildi.",
        ],
      },
      {
        title: "Ürün İç Sayfası Concentric UI & 4 Güven Sütunu (/urun/[slug])",
        category: "İyileştirme",
        details: [
          "Koyu lacivert (#0B1528) fiyat bloğu, KDV dahil rozeti ve anlık stok durumu göstergesi eklendi.",
          "Ankara içi 2-4 saatte aynı gün oda kurulumu, 2 yıl yerinde servis garantisi, SGK uyumlu fatura ve CE & ISO 9001 sertifika rozetleri 4 sütunlu kart yapısına dönüştürüldü.",
          "Sepete ekle ve anında WhatsApp ile uzman klinik sipariş butonları optimize edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.6.2",
    date: "2 Eylül 2026",
    summary:
      "SEO düşmanı sayfa parametreleri (?sayfa=2) tamamen kaldırılarak tüm katalog, kategori ve seri sayfaları tek seferde eksiksiz taranabilir ve indekslenebilir monolitik mimariye geçirildi.",
    items: [
      {
        title: "SEO Dostu Tek Sayfa Katalog & Kategori Mimarisi",
        category: "İyileştirme",
        details: [
          "/urunler, /kategori/[slug] ve /seri/[seri] sayfalarında arama motoru botlarını ve kullanıcıları bölen ?sayfa=2 parametresi ve sayfalama barı kaldırıldı.",
          "Tüm ürünler tek bir temiz kanonik URL altında (canonical URL) eksiksiz olarak yüklenerek Google ItemList şemasına %100 oranında dahil edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.6.1",
    date: "2 Eylül 2026",
    summary:
      "Kategori filtre sidebar'ı Concentric UI ve modern koyu lacivert badge mimarisiyle baştan tasarlandı; Admin panelinden dinamik Kategori SEO & SERP yönetimi (Meta Title, Description, H1, Kategori Altı SEO Rehberi) canlıya alındı.",
    items: [
      {
        title: "Kategori Filtre Sidebar Redesign (ProductFilters)",
        category: "Tasarım",
        details: [
          "Ekran görüntüsündeki sade ve eski görünüm kaldırılarak Concentric Geometry (rounded-2xl + p-4/5), koyu lacivert aktif durumlar (#0B1528) ve kompakt rozet sayıları yerleştirildi.",
          "Sidebar altına doğrudan tek tıkla açılan WhatsApp acil medikal danışma kutusu entegre edildi.",
        ],
      },
      {
        title: "Panelden Yönetilebilir Kategori SEO & Google SERP Sistemi",
        category: "Yeni",
        details: [
          "/admin/kategoriler paneline 'SEO & SERP Ayarları' sekmesi eklenerek her kategori için özel Meta Title, Meta Description, H1 Başlığı ve Kategori Altı SEO Tanıtım Metni düzenleme altyapısı kuruldu.",
          "/kategori/[slug] sayfaları ve generateMetadata bu dinamik SEO verilerine bağlandı; sayfa altına Google indekslemeli zengin rehber alanı eklendi.",
        ],
      },
    ],
  },

  {
    version: "v2.6.0",
    date: "2 Eylül 2026",
    summary:
      "Medikal Bilgi Bankası & Blog Sistemi, Kapsamlı SSS & Yardım Merkezi, Gelişmiş Admin Finans/Sipariş Raporlama Paneli ve Kullanıcı Yorum & Değerlendirme Modülü canlıya alındı.",
    items: [
      {
        title: "Medikal Bilgi Bankası & Blog Sistemi (/blog)",
        category: "Yeni",
        details: [
          "Hasta bakımı, hasta karyolası seçimi ve transfer lifti kullanım rehberlerini barındıran zengin içerikli blog sistemi ve /admin/blog yönetim editörü devreye alındı.",
          "Ankara medikal rakiplerinin (Bircan, Royalsan, Elit, Respirox, ECE, Emek) SEO boşluklarını kapatan 5 derinlikli klinik ve kiralama rehberi yayına alındı.",
          "Google için Schema.org Article ve BreadcrumbList zengin verileri eklendi; sitemap.ts ve dinamik URL taranabilirliği kuruldu.",
        ],
      },
      {
        title: "Kapsamlı SSS & Yardım Merkezi (/sss)",
        category: "Yeni",
        details: [
          "Kiralama, teslimat, teknik servis ve fatura süreçlerini kapsayan canlı aramalı interaktif akordeon SSS sayfası yayına alındı.",
          "Google Arama Sonuçları (SERP) için Schema.org FAQPage yapılandırılmış veri şeması entegre edildi.",
        ],
      },
      {
        title: "Gelişmiş Admin Finans & Sipariş Raporları (/admin/raporlar)",
        category: "Yeni",
        details: [
          "Brüt ciro, ortalama sepet büyüklüğü (AOV), tamamlanan sipariş adetleri ve en çok satan model analizlerini içeren finansal raporlama paneli kuruldu.",
          "Ankara ilçelerine göre sipariş yoğunluğu dağılım haritası ve canlı sipariş hareketleri akışı eklendi.",
        ],
      },
      {
        title: "Kullanıcı Yorum & Değerlendirme Sistemi (/api/reviews)",
        category: "Yeni",
        details: [
          "Ürün detay sayfalarında müşteri yıldız puanlama, onaylı alıcı rozeti ve Zod doğrulamalı yorum formu devreye alındı.",
          "/admin/yorumlar üzerinden tek tıkla inceleme ve moderasyon paneli kuruldu.",
        ],
      },
    ],
  },

  {
    version: "v2.5.1",
    date: "2 Eylül 2026",
    summary:
      "Ana Header ve Kategori Menüsü kurumsal koyu lacivert renk kalibrasyonu, popüler kategorilerde Concentric UI geometrisi ve cover görsel mimarisi, güven rozetleri dolgu optimizasyonu ve Hero vitrin kartı çift aksiyonlu (Modeli İncele + WhatsApp) modernizasyonu.",
    items: [
      {
        title: "Header & Kategori Menüsü Renk Kalibrasyonu",
        category: "Tasarım",
        details: [
          "Ana Header (#0B1528) ile Kategori Menüsü (#0E1A30) arasındaki zıtlık giderilerek tek parça kurumsal koyu lacivert bütünlük sağlandı.",
          "Menü linkleri okunaklı açık tipografi ve yumuşak hover efektleriyle kalibre edildi; arama butonu header tonuyla 1-e-1 eşleştirildi.",
        ],
      },
      {
        title: "Concentric Geometry & Cover Kategori Vitrini",
        category: "Tasarım",
        details: [
          "5x2 Popüler Kategoriler vitrininde küçük kutu kısıtlaması kaldırılarak kartı tamamen dolduran aspect-[4/3] object-cover görsel düzenine geçirildi.",
          "Concentric UI formülü (R_dış 16px - Padding 6px = R_iç 10px) uygulanarak iç-dış köşe kavisleri ve dolguları kusursuzlaştırıldı.",
        ],
      },
      {
        title: "Hero Güven Rozetleri Genişlik Optimizasyonu",
        category: "İyileştirme",
        details: [
          "Hero bölümündeki 3 güven kartı zoraki sütun genişlemesinden çıkarılarak içerik genişliğinde (inline-flex shrink-0) kompakt ve şık rozet yapısına kavuşturuldu.",
        ],
      },
      {
        title: "Hero Vitrin Kartı & Çift Aksiyon Mimarisi",
        category: "Yeni",
        details: [
          "Eski 01/04 sayaç artığı ve noktalı animasyonlar kaldırılarak kurumsal 'AYNI GÜN SEVKİYAT' SERP etiketi ve '2 Yıl Yerinde Servis' garanti rozeti eklendi.",
          "Kart başlığı okunaklı hale getirildi, teknik özellikler SVG ikonlarla zenginleştirildi.",
          "'Modeli & Fiyatları İncele' ana butonunun yanına tek tıkla modele özel mesajla açılan hızlı yeşil WhatsApp sipariş aksiyonu entegre edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.5.0",
    date: "2 Eylül 2026",
    summary:
      "Ankara ve 25 ilçe için Programmatic Local SEO ve teslimat ağı sayfaları, dinamik Admin Site & Vitrin Ayarları ve Medya Kütüphanesi entegrasyonu, 5x2 dengeli kategori mimarisi, Google Harita yorumları ve SERP tarzı mikro rozet tasarımı iyileştirmeleri.",
    items: [
      {
        title: "Ankara ve 25 İlçe Programmatic Local SEO Ağı",
        category: "Yeni",
        details: [
          "Ankara ana SEO merkezi (/ankara-hasta-yatagi) ve 25 ilçenin tamamı (Çankaya, Yenimahalle, Keçiören, Etimesgut vb.) için özel programmatic landing page sistemi yayına alındı.",
          "İlçelere özel aynı gün teslimat süresi vaatleri, referans sağlık merkezleri ve önceden doldurulmuş tek tık WhatsApp sipariş entegrasyonu kuruldu.",
          "İlçe sayfaları için Schema.org MedicalBusiness, Service, BreadcrumbList ve FAQPage yapılandırılmış verileri eklendi.",
        ],
      },
      {
        title: "Dinamik Site Ayarları & Vitrin Yönetimi (/admin/ayarlar)",
        category: "Yeni",
        details: [
          "Hero vitrini, teslimat rozetleri, WhatsApp iletişim bilgileri ve SEO meta ayarlarının Admin Panel üzerinden anında güncellenebilmesini sağlayan yönetim paneli devreye alındı.",
          "Sunucu önbelleğini anında tazeleyen revalidate mimarisi ile veri güncellemeleri canlıya anında yansıtıldı.",
        ],
      },
      {
        title: "Admin Medya & Görsel Kütüphanesi (/admin/medya)",
        category: "Yeni",
        details: [
          "Tüm ürün ve kategori görsellerini listeleyen, canlı filtreleyen ve ürün formunda 'Medya Kütüphanesinden Seç' butonuyla tek tıkla ürünlere atanmasını sağlayan modal sistemi geliştirildi.",
        ],
      },
      {
        title: "5x2 Popüler Kategoriler Grid Mimarisi",
        category: "Tasarım",
        details: [
          "Hero altındaki popüler kategoriler bölümü 5 sütun x 2 satır (5x2) simetrik düzene geçirildi; kart ve görsel ölçekleri ferahlatılarak kullanıcı deneyimi optimize edildi.",
        ],
      },
      {
        title: "SERP Tarzı Mikro Metin Rozetleri & Arayüz İyileştirmeleri",
        category: "Tasarım",
        details: [
          "Başlık yanlarında monokrom kurumsal [KATALOG], [DEĞERLENDİRME], [SAĞLIK MERKEZLERİ] ve [TESLİMAT AĞI] mikro rozetleri uygulandı.",
          "Hero CTA butonlarının iç dolgu ve taşma durumları optimize edildi.",
        ],
      },
      {
        title: "Google Yorumları & Değerlendirme Hizalaması",
        category: "İyileştirme",
        details: [
          "Google Harita müşteri değerlendirmeleri başlık ve buton düzeni modern, dengeli ve sola hizalı formata kavuşturuldu.",
        ],
      },
      {
        title: "Dinamik XML Sitemap & İç Linkleme Ağı",
        category: "Altyapı",
        details: [
          "Yeni Ankara ana sayfası ve 25 ilçe rotası dinamik XML sitemap sistemine ve site genel alt menüsüne (Footer) eklenerek arama motoru taranabilirliği maksimize edildi.",
        ],
      },
    ],
  },

  {
    version: "v2.4.0",
    date: "2 Eylül 2026",
    summary:
      "Tüm ürün kategorilerinde yüksek çözünürlüklü görsel güncellemesi, ana sayfa 'Günün Fırsatı' vitrini, arama motoru (SEO) ve anahtar kelime tutarlılığı optimizasyonları, erişilebilirlik iyileştirmeleri ve medikal bilgi bankası entegrasyonu.",
    items: [
      {
        title: "Ürün Görselleri & Galeri Deneyimi",
        category: "İyileştirme",
        details: [
          "Hasta karyolaları, hasta transfer liftleri, bakım koltukları ve medikal kozmetik ürünlerinin görsel galerileri yüksek çözünürlüklü orijinal ürün fotoğraflarıyla güncellendi.",
          "Görsel yükleme hızları ve ürün detay sayfası sunum kalitesi artırıldı.",
        ],
      },
      {
        title: "Günün Fırsatı Vitrini",
        category: "Yeni",
        details: [
          "Öne çıkan avantajlı medikal modeller için canlı geri sayım sayacı ve özel indirim rozetine sahip 'Günün Fırsatı' vitrini ana sayfada yayına alındı.",
        ],
      },
      {
        title: "Arama Motoru (SEO) & Anahtar Kelime Uyumu",
        category: "İyileştirme",
        details: [
          "Sayfa başlıkları (Title) ve meta açıklamaları hedeflenen medikal arama terimleriyle tam uyumlu hale getirildi.",
          "Arama motoru indeksleme standartlarına uygun meta uzunluk ve metin yoğunluğu optimizasyonları tamamlandı.",
        ],
      },
      {
        title: "Erişilebilirlik (A11y) & Sayfa Hiyerarşisi",
        category: "İyileştirme",
        details: [
          "Sayfa başlık hiyerarşisi optimize edildi; tüm buton ve gezinme bağlantılarına ekran okuyucu ve erişilebilirlik etiketleri eklendi.",
          "Genel web standartları ve güvenlik başlıkları güncellendi.",
        ],
      },
      {
        title: "Medikal Bilgi Bankası & Uzman Rehberi",
        category: "Yeni",
        details: [
          "Evde hasta bakımı süreçlerinde doğru hasta yatağı ve transfer ekipmanı seçimini kolaylaştıran bilgilendirici uzman rehberi ana sayfaya entegre edildi.",
        ],
      },
      {
        title: "Geniş Ekran & Yerleşim Mimarisi",
        category: "Tasarım",
        details: [
          "Site genel maksimum genişlik sınırı 100px artırılarak masaüstü ve geniş ekranlarda daha ferah, modern ve okunaklı bir e-ticaret gezinme deneyimi sağlandı.",
        ],
      },
    ],
  },

  {
    version: "v2.3.0",

    date: "1 Eylül 2026",
    summary:
      "Semantik SEO URL ve 301 kalıcı yönlendirme motoru, self-healing görsel sunucusu ve otomatik disk onarımı, kurumsal ürün kodu (MC-XXXX SKU) mimarisi, yerel ve görsel SEO şemaları, Hero sıfır kayma (CLS = 0) ve bildirim rozet geometrisi optimizasyonu.",

    items: [
      {
        title: "Semantik SEO URL Motoru & 301 Kalıcı Yönlendirme",
        category: "İyileştirme",
        details: [
          "Ürün başlıklarından Türkçe karakter ve URL sanitizasyonu ile tam semantik SEO slugları üreten motor devreye alındı.",
          "Eski kısa SKU bağlantıları ve harici arama botu istekleri için otomatik 301 Permanent Redirect mimarisi entegre edildi.",
        ],
      },
      {
        title: "Self-Healing Görsel Sunucu & Onarım Motoru",
        category: "Altyapı",
        details: [
          "Next.js Image Optimizer isteklerinde disk ve veritabanı arasındaki ad uyuşmazlıklarını anlık onaran stem-matching ve dosya klonlama rotası devreye alındı.",
          "400 Bad Request görsel yükleme hataları tamamen sıfırlandı.",
        ],
      },
      {
        title: "Kurumsal Ürün Kodu (MC-XXXX SKU) Mimarisi",
        category: "Yeni",
        details: [
          "Ürün detay sayfasında URL slug'ının kod olarak görünmesi hatası giderilerek deterministik ve düzenlenebilir MC-XXXX kurumsal stok kodları bağlandı.",
          "Yönetici paneli ürün ekleme ve düzenleme formuna bağımsız Ürün Kodu (SKU) alanı ve otomatik kod üretici eklendi.",
          "Yönetici ürün listesinde her ürün için koyu zeminli kurumsal kod rozetleri konumlandırıldı.",
        ],
      },
      {
        title: "Görsel SEO, Yerel SEO ve Zengin Şema Seti",
        category: "İyileştirme",
        details: [
          "Ankara Yenimahalle coğrafi konum bilgileri için geo.region (TR-06), geo.placename, geo.position ve ICBM meta etiketleri kök layout'a eklendi.",
          "MedicalBusiness ve Organization şemalarına hasMap, areaServed ilçe tanımları (Çankaya, Yenimahalle, Keçiören vb.) ve FAQPage zengin snippet'i dahil edildi.",
          "Google Image Sitemap şemasına görsel başlığı, caption ve Ankara coğrafi konum etiketleri entegre edildi.",
        ],
      },
      {
        title: "Hero Sıfır Kayma (CLS = 0) ve Rozet Geometrisi",
        category: "Tasarım",
        details: [
          "Hero vitrin sekme geçişlerindeki yükseklik kaymaları sabit kutu ölçülendirmeleriyle sıfırlandı (CLS = 0).",
          "Favori ve sepet bildirim sayaç rozetleri kusursuz tam daire (aspect-square) geometrisine kavuşturuldu.",
          "Admin ürün formundaki görsel konteyner gölgeleri sadeleştirildi, kenar yuvarlaklıkları optimize edildi ve hazır şablon emojileri modern SVG ikonlarıyla yenilendi.",
        ],
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "1 Eylül 2026",
    summary:
      "Google Analytics 4 e-ticaret dönüşüm ölçümlemesi, kapsamlı teknik SEO ve Schema.org yapısal veri standartları, yenilenen akıllı ürün görsel galerisi ve yönetici etkileşim istatistik paneli.",
    items: [
      {
        title: "Google Analytics 4 & E-Ticaret Dönüşüm Takibi",
        category: "Yeni",
        details: [
          "Tek sayfa uygulama (SPA) mimarisine tam uyumlu anlık sayfa ve rota geçişleri ölçümlemesi devreye alındı.",
          "Ürün inceleme, sepete ekleme, sepetten çıkarma, ödeme başlatma ve başarılı satın alma adımlarını kapsayan standart 5 aşamalı e-ticaret dönüşüm hunisi entegre edildi.",
        ],
      },
      {
        title: "Kapsamlı Teknik SEO & Arama Motoru Optimizasyonu",
        category: "İyileştirme",
        details: [
          "Google Arama zengin sonuçları için FAQPage (Sıkça Sorulan Sorular) ve ItemList yapısal veri şemaları (JSON-LD) sisteme eklendi.",
          "Sosyal medya paylaşımları için dinamik OpenGraph ve Twitter Cards görsel/meta kartları zenginleştirildi.",
          "Arama motoru tarama bütçesini optimize eden robots.txt ve canonical bağlantı standartları tüm rotalarda eksiksiz hale getirildi.",
          "Ürün görsellerine semantik anahtar kelime eşleştirmeli SEO dosya adlandırma ve alt etiketleme yapısı kazandırıldı.",
        ],
      },
      {
        title: "Ürün Görsel Galerisi & Akıllı Mobil Lightbox",
        category: "Tasarım",
        details: [
          "Ürün detay sayfasında tam ekran görsel inceleme moduna dış alana tıklayarak hızlı kapatma ve ESC tuşu desteği eklendi.",
          "Görsel listesi kaydırma çubuğu tüm modern tarayıcılarda optimize edilerek görsel kirlilik sıfırlandı.",
          "Tam ekran modunda arka plan kaydırma kilidi ve mobil dokunmatik kaydırma (swipe) deneyimi pürüzsüzleştirildi.",
        ],
      },
      {
        title: "Yönetici Kontrol Merkezi Etkileşim & Ciro Paneli",
        category: "Yeni",
        details: [
          "Yönetici ana paneline tahsil edilen ciro, ortalama sepet tutarı (AOV) ve dönüşüm hunisi aşamalarını gösteren anlık etkileşim istatistik kartı eklendi.",
        ],
      },
      {
        title: "PWA & Mobil Tarayıcı Entegrasyonu",
        category: "Altyapı",
        details: [
          "Mobil cihazlar ve tarayıcılar için kurumsal renk paleti ve ikon tanımlarına sahip Web App Manifest altyapısı kuruldu.",
          "Kullanıcıları site içerisinde tutan ve ilgili kategorilere yönlendiren modern 404 hata sayfası yayına alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "28 Ağustos 2026",
    summary:
      "Kupon ve ödeme entegrasyonu standardizasyonu, otomatik stok senkronizasyonu, müşteri adres defteri yönetimi, güvenli kurye paneli ve yeni yönetici iletişim & yorum denetim merkezleri.",
    items: [
      {
        title: "Kupon ve Ödeme İndirimi Entegrasyonu",
        category: "İyileştirme",
        details: [
          "Sepet ve ödeme aşamasında uygulanan indirim kuponlarının tüm sipariş tutarlarına, banka ve kartlı ödeme adımlarına eksiksiz yansıması sağlandı.",
          "Havale ve EFT ile verilen siparişlerde ödeme tamamlandıktan sonra sepetin otomatik temizlenmesi sağlandı.",
        ],
      },
      {
        title: "Otomatik ve Güvenilir Stok Senkronizasyonu",
        category: "Altyapı",
        details: [
          "Banka havalesi, online kart veya yönetici paneli üzerinden gerçekleşen tüm siparişlerde ürün stoklarının anlık ve hatasız güncellenmesi sağlandı.",
          "İptal edilen siparişlerde ürün stoklarının mağazaya otomatik iade edilmesi sağlandı.",
        ],
      },
      {
        title: "Müşteri Adres Defteri Yönetimi",
        category: "Yeni",
        details: [
          "Hesabım panelinde kayıtlı teslimat ve fatura adreslerinin kolayca eklenmesi, düzenlenmesi ve silinmesi aktif hale getirildi.",
          "Sipariş aşamasında kayıtlı adreslerin tek tıkla seçilebilmesi kolaylaştırıldı.",
        ],
      },
      {
        title: "Yönetici İletişim & Ürün Yorumları Denetim Merkezi",
        category: "Yeni",
        details: [
          "Ziyaretçilerden gelen iletişim formu mesajlarının yönetici panelinden incelenmesi, e-posta veya WhatsApp ile tek tıkla yanıtlanması sağlandı.",
          "Müşteriler tarafından yapılan ürün değerlendirmeleri ve puanlamaların yönetici onayından geçmesini sağlayan moderasyon paneli kuruldu.",
        ],
      },
      {
        title: "Kurye ve Sevkiyat Paneli Güvenlik Katmanı",
        category: "Güvenlik",
        details: [
          "Şoför ve sevkiyat takip sayfasına yetkisiz erişimler engellenerek müşteri adres ve iletişim verilerinin gizliliği tam güvence altına alındı.",
          "Sipariş takip sorgulamalarında gelişmiş güvenlik ve telefon doğrulama kontrolleri devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "27 Ağustos 2026",
    summary:
      "Kullanıcı deneyimi ve veri güvenliği standardizasyonu: Modern onay pencereleri, akıllı veri doğrulama ve anlık sayfa senkronizasyonu, yüksek hızlı görsel optimizasyonu ve tam erişilebilirlik geliştirmeleri.",
    items: [
      {
        title: "Modern Onay Pencereleri & Şık Bildirimler",
        category: "Tasarım",
        details: [
          "Eski tip tarayıcı uyarıları yerine mağaza tasarım diliyle birebir uyumlu, şık ve modern onay pencereleri entegre edildi.",
          "Ürün silme, favori listesini temizleme, kupon yönetimi ve kullanıcı yetkilendirme işlemlerinde yanlışlıkla yapılan adımları önleyen güvenli onay mekanizması kuruldu.",
          "İşlem sonuçları ve bilgilendirme mesajları daha akıcı, modern bildirim balonları ile gösterilmeye başlandı.",
        ],
      },
      {
        title: "Gelişmiş Veri Güvenliği ve Anlık Senkronizasyon",
        category: "Güvenlik",
        details: [
          "Sipariş takip sorguları, kurye canlı lokasyonu ve adres güncellemelerinde çok katmanlı veri doğrulama altyapısı devreye alındı.",
          "Yönetici panelinde veya müşteri hesabında yapılan tüm güncellemelerin sayfayı yenilemeye gerek kalmadan ilgili tüm ekranlara anında yansıması sağlandı.",
          "Sipariş ve ödeme süreçlerinde veri bütünlüğü ve işlem kararlılığı en üst düzeye çıkarıldı.",
        ],
      },
      {
        title: "Görsel Hızlandırma ve Tam Erişilebilirlik",
        category: "İyileştirme",
        details: [
          "Canlı kargo ve sevkiyat takip ekranındaki görseller optimize edilerek sayfa açılış hızları artırıldı ve görsel kaymaları sıfırlandı.",
          "Kategori gezinme okları, sepet adet butonları, filtre temizleyiciler ve form elemanları ekran okuyucular ve klavye kullanımıyla tam uyumlu hale getirildi.",
          "Form gönderimlerinde internet yavaşlığından kaynaklanan mükerrer veya çift tıklamaları engelleyen akıllı buton koruması devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v1.9.9",
    date: "27 Ağustos 2026",
    summary:
      "Yönetici panelinin tam ekran çalışma alanına dönüştürülmesi, tek tıkla hazır ürün şablonları, siparişlerde toplu durum güncelleme ve ödeme detay inceleme penceresi geliştirmeleri.",
    items: [
      {
        title: "Yönetici Paneli Tam Ekran Çalışma Alanı",
        category: "Tasarım",
        details: [
          "Yönetici sayfalarında mağaza üst ve alt menüleri gizlenerek tam ekran genişliğinde ferah bir çalışma ortamı oluşturuldu.",
          "Üst kontrol çubuğuna tek tıkla yeni ürün ekleme, mağaza vitrinini açma ve bulunulan sayfayı gösteren yönlendirmeler eklendi.",
          "Tablolardaki sütun genişlikleri dengelenerek yazıların kayması ve üst üste binmesi önlendi.",
        ],
      },
      {
        title: "Kolay Ürün Ekleme & Hazır Medikal Şablonlar",
        category: "Yeni",
        details: [
          "Ürün ekleme sayfasına Hasta Karyolası, Transfer Lifti ve Muayene Masası için hazır teknik özellikleri tek tıkla dolduran şablon butonları eklendi.",
          "Ürün fotoğraflarını sürükleyip bırakarak yükleme ve kapak fotoğrafını tek tıkla seçme kolaylığı getirildi.",
        ],
      },
      {
        title: "Siparişlerde Toplu İşlem & Ödeme İnceleme Penceresi",
        category: "İyileştirme",
        details: [
          "Gelen siparişler listesinden birden fazla sipariş seçilerek tek tuşla kargoya verildi veya tamamlandı durumuna getirme özelliği eklendi.",
          "Ödemeler sayfasına her işlemin banka tahsilat detayını, tutarını ve müşteri bilgilerini gösteren detaylı inceleme penceresi eklendi.",
        ],
      },
      {
        title: "Canlı Sevkiyat ve İndirim Kuponu Kolaylıkları",
        category: "İyileştirme",
        details: [
          "Canlı takip ekranı temizlenerek gerçek teslimat ekiplerinin atanabileceği sade bir yapıya kavuşturuldu.",
          "Kupon yönetim sayfasına arama kutusu, kupon kodunu tek tıkla kopyalama butonu ve sayfa kaydırıldığında sabit kalan pratik kupon formu eklendi.",
        ],
      },
    ],
  },
  {
    version: "v1.9.8",
    date: "26 Ağustos 2026",
    summary:
      "Resmi şirket yasal bilgileri ve Ziraat Bankası ödeme hesaplarının güncellenmesi, kupon uygulama alanının sadeleştirilerek kişiye özel tanımlara uyarlanması ve ödeme yöntemleri metin standardizasyonu.",
    items: [
      {
        title: "Resmi Şirket & Banka Hesap Bilgilerinin Güncellenmesi",
        category: "Altyapı",
        details: [
          "Şirket resmi ticaret ünvanı, vergi dairesi ve kurumsal adres bilgileri Mesafeli Satış Sözleşmesi, Gizlilik Politikası ve arama motoru (JSON-LD) şemalarında güncellendi.",
          "Havale ve EFT ile sipariş tamamlama süreçlerindeki resmi kurumsal Ziraat Bankası IBAN hesabı tanımlandı.",
          "Tüm kurumsal ve finansal iletişim parametreleri merkezi sabitler yapısına bağlandı.",
        ],
      },
      {
        title: "Kupon Giriş Alanı & Özel İndirim Altyapısı",
        category: "İyileştirme",
        details: [
          "Sepet ve ödeme adımlarındaki kupon giriş alanı sadeleştirilerek doğrudan kişiye/müşteriye özel tanımlanan kodların girilebilmesi sağlandı.",
          "Arayüzdeki örnek yönlendirmeler kaldırılarak daha temiz ve kurumsal bir ödeme deneyimi oluşturuldu.",
          "Veritabanı ve sistemsel kupon doğrulama mekanizması optimize edildi.",
        ],
      },
      {
        title: "Ödeme Yöntemleri ve Bilgilendirme Metinleri Standardizasyonu",
        category: "Düzeltme",
        details: [
          "Ödeme ve ürün detay sayfalarındaki seçenek metinleri sadeleştirilerek güvenli alışveriş adımları netleştirildi.",
          "Havale/EFT ve kredi kartı ödeme bilgilendirme alanları güncel bankacılık standartlarına göre revize edildi.",
        ],
      },
    ],
  },
  {
    version: "v1.9.7",
    date: "24 Ağustos 2026",
    summary:
      "Muayene ve Bakım Masaları kategori ve 301 URL standardizasyonu, Hakkımızda ve İletişim sayfalarındaki koyu zemin renk kontrastı kalibrasyonu ve header düzen optimizasyonu.",
    items: [
      {
        title: "Muayene ve Bakım Masaları Kategori & 301 URL Standardizasyonu",
        category: "İyileştirme",
        details: [
          "Genişleyen medikal masalar ve bakım ekipmanları ürün gamını karşılamak adına kategori adı 'Muayene ve Bakım Masaları', kalıcı bağlantısı ise /kategori/muayene-ve-bakim-masalari olarak güncellendi.",
          "Eski bağlantı trafiği ve SEO değerini korumak için /kategori/bakim-yataklari adresinden kalıcı 301 yönlendirmesi devreye alındı.",
          "Footer navigasyonu, kategori mega menüsü, filtreleme panelleri ve veritabanı tohumlama kuralları senkronize edildi.",
        ],
      },
      {
        title: "Koyu Hero Alanları Renk & Kontrast Kalibrasyonu",
        category: "Düzeltme",
        details: [
          "Hakkımızda ve İletişim sayfalarındaki koyu lacivert zeminlerde (#0F1E36) kontrast düşüklüğü yaşayan rozet ve vurgu metinleri, kurumsal medikal turkuaz rengine (#0EA5A4) dönüştürülerek net ve okunaklı hale getirildi.",
          "Hakkımızda sayfası görsel rozeti ve müşteri memnuniyeti puanlama kutusu butonları koyu tema standartlarına uyarlandı.",
        ],
      },
      {
        title: "Header Düzeni & Kayan Bant Optimizasyonu",
        category: "Tasarım",
        details: [
          "Daha temiz, ferah ve modern bir gezinme deneyimi için üst kayan duyuru bandı kodu korunarak pasife alındı.",
          "Sayfa üst boşlukları (padding-top) başlık ve menü yüksekliğiyle piksel hassasiyetinde yeniden hizalandı.",
        ],
      },
    ],
  },
  {
    version: "v1.9.6",
    date: "20 Ağustos 2026",
    summary:
      "Popüler kategori kartlarında gerçek ürün küçük resimlerinin entegrasyonu, hover karanlık leke efektinin giderilmesi ve web scraper botlarına karşı dinamik ProtectedContact korumasının devreye alınması.",
    items: [
      {
        title: "Anti-Scraper & Spam Bot İletişim Koruması (ProtectedContact)",
        category: "Güvenlik",
        details: [
          "Otomatik arama ve e-posta hasat botlarının (harvester bots) kaynak koddan izinsiz veri toplamasını engelleyen ProtectedEmail ve ProtectedPhone güvenlik modülleri geliştirildi.",
          "Footer VIP destek paneli, İletişim sayfası kartları, Header hızlı sipariş hattı ve Canlı Destek modalındaki tüm telefon ve e-posta bağlantıları korumaya alındı.",
          "Gerçek kullanıcılar için sıfır gecikmeli, anında tıklanabilir ve kopyalanabilir kusursuz kullanıcı deneyimi sağlandı.",
        ],
      },
      {
        title: "Popüler Kategoriler Görsel & Hover Kalibrasyonu",
        category: "Tasarım",
        details: [
          "Ana sayfa popüler kategori kartlarında hover durumunda oluşan karanlık kutu efekti kaldırılarak açık medikal arka plan ve turkuaz kenarlık geçişi uygulandı.",
          "Her kategori için gerçek medikal ekipman küçük resimleri (thumbnail images) entegre edildi.",
        ],
      },
    ],
  },
  {
    version: "v1.9.5",
    date: "20 Ağustos 2026",
    badge: "Mükemmel UI & İleri Düzey UX",
    summary:
      "Daha premium bir görünüm için sayfa yerleşimleri (layout), ürün akışları, grid görünümleri ve ikonlar baştan aşağı optimize edildi.",
    items: [
      {
        title: "Dinamik Ürün Izgarası (Grid Görünümleri)",
        category: "Yeni",
        details: [
          "Ürün listeleme sayfalarına kullanıcı kontrollü izgara (grid) modları eklendi. Masaüstü için (2, 3 ve 4 kolon), mobil için ise (1 ve 2 kolon) görünümleri arasından anlık geçiş yapılabilir hale getirildi.",
        ],
      },
      {
        title: "Ana Sayfa Dönüşüm Optimizasyonları",
        category: "Yeni",
        details: [
          "Müşterilerin odağını ürünlere çekmek ve sıcak satış ihtimalini artırmak adına Ana Sayfaya 'Yeni Gelenler' ve 'Çok Satanlar' olmak üzere iki ayrı yatay ürün akışı modülü entegre edildi.",
          "Üstteki yatay kategori menüsünden (scroll nav) gereksiz yer kaplayan 'Ana Sayfa' linki kaldırılarak menü sadeleştirildi.",
        ],
      },
      {
        title: "Kusursuz E-Ticaret Düzeni (Dönüşüm Odaklı)",
        category: "İyileştirme",
        details: [
          "Ürün detay sayfasındaki fiyat kutusu, doğrudan satışa yönlendirmek amacıyla e-ticaret standartlarına uygun şekilde Kısa Açıklama'nın üzerine ve Başlık/Yıldızların hemen altına taşındı.",
          "Sayfalardaki aşırı dar veya geniş üst boşluklar (padding) düzeltilerek ürün başlıklarının çok daha ferah görünmesi sağlandı.",
        ],
      },
      {
        title: "Header ve Arama Çubuğu Revizyonu",
        category: "Tasarım",
        details: [
          "Koyu lacivert üst menüdeki Arama Çubuğu'nun (Ara butonu) etrafında oluşan ve şık durmayan beyaz dış çerçeve (border) tamamen kaldırılarak arama kısmı karanlık temayla bütünleştirildi.",
          "Koyu lacivert üst menüdeki Telefon ve Favori ikonlarının karanlıkta kaybolma sorunu çözülerek ikonlar bembeyaz ve net olacak şekilde vurgulandı.",
          "Kategori gezinme menüsündeki kaydırma okları gizli halden çıkartılarak her zaman aktif, belirgin ve dokunulabilir butonlar haline getirildi.",
        ],
      },
      {
        title: "Favori İkonu ve Footer Tasarımı",
        category: "Düzeltme",
        details: [
          "Eski uzun 'Favorilere Ekle' butonu tamamen kaldırılarak, ürün başlığının yanına tam konumlandırılmış modern ve yuvarlak bir Kalp ikonuna dönüştürüldü. Boş durumda kaybolmaması için kalbin içi hafif gri ile dolduruldu ve netleştirildi.",
          "Footer (en alt) bölümündeki sıkışık 'VIP Danışma' sütunu tamamen iptal edilip, yerine boydan boya uzanan şık yatay bir 'İletişim ve WhatsApp Danışma' banner'ı eklendi.",
          "Footer'daki Telif Hakkı (Copyright) yazısı ve alt menü, ödeme logolarıyla aynı hizaya getirilerek daha minimal bir şerit oluşturuldu.",
        ],
      },
    ],
  },
  {
    version: "v1.9.4",
    date: "20 Ağustos 2026",
    badge: "Yeni Özellikler & UX",
    summary:
      "Gelişmiş kullanıcı deneyimi, adres defteri, UI/UX düzeltmeleri ve renk/kontrast optimizasyonları.",
    items: [
      {
        title: "Kapsamlı UI & Kontrast Düzeltmeleri",
        category: "Tasarım",
        details: [
          "Günün Fırsatı, Medikal Danışma Banner'ı ve İstatistik Banner'ı gibi koyu renkli alanlarda okunmayan metin ve ikonlar canlı Turkuaz (#0EA5A4) rengi ile güncellenerek okunaklı hale getirildi.",
          "Günün Fırsatı görselindeki sivri köşeler yumuşatıldı (border-radius), gölge efekti (shadow) azaltılarak doğallaştırıldı ve hover sırasında büyüyen rahatsız edici animasyon tamamen kaldırıldı.",
          "Ana sayfadaki eksik ve çalışmayan SVG ikonları onarılarak renk sorunu (görünmeme hatası) çözüldü.",
        ],
      },
      {
        title: "Adres Defteri ve Yönetimi",
        category: "Yeni",
        details: [
          "Kullanıcı Paneli'ne 'Adres Defterim' sekmesi eklendi. Artık müşteriler farklı teslimat ve fatura adreslerini kaydedebilir ve yönetebilir.",
          "Sistem altyapısına güçlü bir Adres veritabanı modeli (Address Schema) entegre edildi.",
        ],
      },
      {
        title: "Ürün ve Sepet Deneyimi (UX)",
        category: "İyileştirme",
        details: [
          "Ürün detay sayfasındaki ürün açıklama özeti, okunabilirliği artırmak için başlık ve yıldız değerlendirmelerinin hemen altına taşındı.",
          "Ürün listeleme sayfalarındaki ızgara (grid) yapısı mobil öncelikli olarak 4'lüden daha ferah olan 3'lü dizilime çevrildi.",
          "Sepete Ekle ve Hemen Satın Al işlemlerindeki eski yöntem (sayfa yenileme / form) tamamen kaldırılarak milisaniyeler içinde çalışan şimşek hızında SPA geçişine (Router) dönüştürüldü.",
          "Ürün galerisine akıllı telefon ve tablet kullanıcıları için çok beklenen yatay kaydırma (touch swipe) desteği eklendi.",
          "Favorilere ekleme/çıkarma işlemi yapıldığında ekranın köşesinde zarif bildirim mesajları (Toast Notifications) çıkması sağlandı.",
        ],
      },
      {
        title: "Navigasyon ve Kurumsal Kimlik (Header/Footer)",
        category: "İyileştirme",
        details: [
          "Footer alanındaki marka logosu yeni tasarımla (MCARIS-LOGO-2.webp) değiştirildi ve orijinal renklerinin parlaması için karartma filtreleri kaldırıldı.",
          "Header'da bulunan Kategori menüsüne 'sürükle bırak (drag-to-scroll)' desteği getirildi. Fare veya dokunmatik ekranlarla yana kaydırma çok daha akıcı hale getirildi.",
          "Görsel kirlilik yaratan Scrollbar (kaydırma çubuğu) gizlenerek yerine ekranın iki köşesinde sadece ihtiyaç anında beliren sağ-sol ok ikonları eklendi.",
          "Footer linkleri taranıp tamamı güncel SEO formatlı Kategori ve Seri bağlantılarına entegre edildi.",
        ],
      },
    ],
  },
  {
    version: "v1.9.3",
    date: "20 Ağustos 2026",
    summary:
      "Otomatik SEO dostu bağlantı inşası (slug) ve breadcrumb hiyerarşisinin tam olarak doğru sayfalara yönlendirilmesi.",
    items: [
      {
        title: "Otomatik SEO Dostu Bağlantı (Slug) Oluşturma",
        category: "Altyapı",
        details: [
          "Veritabanına girilen tüm ürün ve kategori link yapıları (slug) otomatik olarak küçük harfe çevrilip, Türkçe karakterlerden ve boşluklardan arındırılarak tireli SEO uyumlu formata dönüştürüldü.",
          "Veritabanındaki eski büyük-küçük harfli bağlantıların tamamı standart tireli yapıya geçirilerek link hataları (404) giderildi.",
        ],
      },
      {
        title: "Breadcrumb Link Hiyerarşisi Optimizasyonu",
        category: "İyileştirme",
        details: [
          "Ürün detay sayfalarındaki breadcrumb (ekmek kırıntısı) navigasyonunda yer alan Kategori bağlantısı `/urunler?kategori=...` yerine doğrudan SEO uyumlu özel kategori sayfasına (`/kategori/[slug]`) yönlendirilecek şekilde düzeltildi.",
        ],
      },
    ],
  },
  {
    version: "v1.9.2",
    date: "20 Ağustos 2026",
    summary:
      "Kullanıcı paneli (Dashboard) modernizasyonu, sistem genelinde Poppins tipografisine geçiş, Footer revizyonu ve yasal ünvan güncellemeleri.",
    items: [
      {
        title: "Modern Kullanıcı Paneli (Dashboard)",
        category: "Tasarım",
        details: [
          "Hesabım sayfası sıradan bir form olmaktan çıkarılarak, sol yan menülü (Sidebar) premium bir panele dönüştürüldü.",
          "Profil, Şifre Değiştirme ve Sipariş Geçmişi sekmeleri modern kart yapıları ve geçiş animasyonları (fade-in, slide) ile ayrıştırıldı.",
          "Siparişlerin durumunu belirten rozetler görsel ikonlar ve renk kodlarıyla desteklendi.",
        ],
      },
      {
        title: "Tipografi ve Font Standardizasyonu",
        category: "Tasarım",
        details: [
          "Sistem genelindeki yazı tipleri Inter'den daha okunaklı ve estetik olan Poppins fontuna yükseltildi.",
          "Okunabilirliği artırmak amacıyla site genelindeki temel metin boyutları 2-4px aralığında orantılı olarak büyütüldü.",
        ],
      },
      {
        title: "Footer ve Kurumsal Ünvan Güncellemeleri",
        category: "İyileştirme",
        details: [
          "Footer alanındaki koyu gradyan ve parlamalar (glow) kaldırılarak, modern ve estetik beyaz bir zemin tasarımına geçildi.",
          "Mesafeli satış sözleşmesi ve Footer'da yer alan şirket yasal ünvanı 'Mc Kahveci Sağlık Hizmetleri Turizm Sanayi ve Ticaret Anonim Şirketi' olarak güncellendi.",
        ],
      },
    ],
  },
  {
    version: "v1.9.1",
    date: "20 Ağustos 2026",
    summary:
      "Şifre sıfırlama akışında kullanıcı dostu hata mesajları eklendi ve e-posta gönderim hatalarının yakalanması sağlandı.",
    items: [
      {
        title: "Şifre Sıfırlama Uyarıları ve Hata Yönetimi",
        category: "İyileştirme",
        details: [
          'Sistemde kayıtlı olmayan bir e-posta adresiyle şifre sıfırlama talep edildiğinde gösterilen "Öncelikle üye olmalısınız" benzeri uyarı mesajı eklendi.',
          "E-posta sunucusuna (SMTP) veya yedek sunucuya erişilemediği durumlarda işlemin sessizce başarısız olması engellenerek, kullanıcıya anlamlı bir hata mesajı gösterilmesi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v1.9.0",
    date: "19 Ağustos 2026",
    summary:
      "SEO dostu dinamik kategori (/kategori/[slug]) ve seri (/seri/[seri]) URL mimarisine geçiş, Hero vitrin alanı, üst arama çubuğu ve navigasyon bileşenlerinin tam modernizasyonu.",
    items: [
      {
        title: "SEO Dostu Kategori ve Seri URL Mimarisi",
        category: "Yeni",
        details: [
          "Sorgu parametreli URL'ler yerine arama motoru ve kullanıcı dostu /kategori/[slug] ve /seri/[seri] rotaları devreye alındı.",
          "Her kategori ve seri sayfası için özel dinamik OpenGraph, Twitter Cards ve JSON-LD Breadcrumb SEO meta etiketleri yapılandırıldı.",
          "Site haritası (sitemap.ts) tüm yeni kategori ve seri rotalarını kapsayacak şekilde güncellendi.",
        ],
      },
      {
        title: "Hero Vitrin & Yüzen Canlı Destek Modernizasyonu",
        category: "Tasarım",
        details: [
          "Hero alanı yüksek kontrastlı sol donanma degrade koruması, 3 odaklı dinamik slaytlar ve kalite güvence hapları ile yenilendi.",
          "Canlı Destek butonu modern koyu donanma FAB tasarımı ve hızlı WhatsApp/telefon danışma modalıyla güncellendi.",
          "Üst arama kutusu, kategori butonu ve promosyon kartları rounded-xl flat tasarım standartlarına kavuşturuldu.",
        ],
      },
    ],
  },
  {
    version: "v1.8.1",
    date: "19 Ağustos 2026",
    summary:
      "Vitrin ürünleri ve popüler kategorilerin 4'lü simetrik grid mimarisine uyarlanması, Burmeier Dali görsel optimizasyonu ve kurumsal Footer'ın düz renk kalibrasyonuyla komple yenilenmesi.",
    items: [
      {
        title: "4'lü Standart Ürün ve Kategori Grid Mimarisi",
        category: "Tasarım",
        details: [
          "Ana sayfa popüler kategoriler (CategoryShortcuts) 4'lü modern kurumsal kart gridine dönüştürüldü.",
          "Öne çıkan ürünler (FeaturedProducts) ve katalog ızgarası (ProductGrid) masaüstü ekranlarda simetrik 4 sütunlu düzene optimize edildi.",
        ],
      },
      {
        title: "Günün Fırsatı & Burmeier Dali Görsel Entegrasyonu",
        category: "İyileştirme",
        details: [
          "Günün Fırsatı modülündeki Burmeier Dali 4 motorlu hasta karyolası görseli gerçek yüksek çözünürlüklü ürün görseliyle eşleştirildi.",
          "Fırsat detay bağlantısı ve etiketleri güncel ürün detayına bağlandı.",
        ],
      },
      {
        title: "Kurumsal Footer & Renk Kalibrasyonu",
        category: "Tasarım",
        details: [
          "Alt bilgi (Footer) bileşeni degrade/gölge öğelerinden arındırılarak düz kurumsal navy (#0B1727 / #0F1E36) ve turkuaz (#00B4D8) renk paletine uyarlandı.",
          "3'lü güven rozetleri, kurumsal bağlantılar, 7/24 VIP müşteri iletişim paneli ve ödeme/güvenlik sertifikaları standartlaştırıldı.",
        ],
      },
    ],
  },
  {
    version: "v1.8.0",
    date: "19 Ağustos 2026",
    summary:
      "Porto e-ticaret teması standartlarında kapsamlı UI/UX modernizasyonu, vitrin modülleri (Günün Fırsatı, Promosyon Bannerları, Müşteri Yorumları, Yardım Bandı) ve Mobil Sticky Alt Menü entegrasyonu.",
    items: [
      {
        title: "Porto Tarzı Header & Canlı Arama Mimarisi",
        category: "Tasarım",
        details: [
          "Genişletilmiş hızlı canlı arama çubuğu ve 7/24 telefon destek kapsülü entegre edildi.",
          "Sayaç rozetli sepet ve favori butonları ile modern profil/giriş aksiyonları devreye alındı.",
          "Kategori mega-menüsü temiz beyaz zemin ve mikro-border mimarisine geçirildi.",
        ],
      },
      {
        title: "Geri Sayımlı Günün Fırsatı & Split Promosyon Bannerları",
        category: "Yeni",
        details: [
          "Geri sayım sayacı (Countdown timer) ile öne çıkan indirimli medikal karyolalar için /DealOfTheDay vitrin modülü eklendi.",
          "Hasta Karyolası Kiralama, 4 Motorlu Yoğun Bakım ve Havalı Yatak & Aksesuarlar için 3'lü split promosyon kartları kurgulandı.",
        ],
      },
      {
        title: "Mobil Sticky Alt Navigasyon Barı (Bottom Navigation)",
        category: "Yeni",
        details: [
          "Mobil kullanıcılar için ekranın altında sabit kalan 5 sekmeli (Ana Sayfa, Ürünler, Canlı Sayaçlı Sepetim, Favorilerim, WhatsApp Danışma) modern alt bar devreye alındı.",
          "Mobil ekranlarda içeriklerin alt bar altında kalmasını engelleyen güvenli alt boşluk (safe-area padding) tanımlandı.",
        ],
      },
      {
        title: "Doğrulanmış Müşteri Yorumları & Uzman Destek Bandı",
        category: "Yeni",
        details: [
          "5 yıldızlı puanlama ve hasta yakını/sağlık profesyoneli deneyimlerini gösteren CustomerTestimonials bileşeni entegre edildi.",
          "Doğru ürün seçimi için tek tıkla arama ve WhatsApp danışma sağlayan HelpContactBanner modülü eklendi.",
        ],
      },
      {
        title: "Kurumsal Medikal Tasarım Dili Standardizasyonu",
        category: "İyileştirme",
        details: [
          "Tüm renkli emojiler kaldırılarak kurumsal monokrom SVG ikonlar ve temiz tipografi ile değiştirildi.",
          "Gereksiz arka plan gradyanları (gradients) düz kurumsal renk paletine (solid slate & navy) dönüştürüldü.",
          "Arayüz genelindeki ağır gölgeler (box-shadows) temizlenerek düz (flat) mikro-kenarlık mimarisine geçildi.",
        ],
      },
    ],
  },
  {
    version: "v1.7.0",
    date: "19 Ağustos 2026",
    summary:
      "Pazaryeri ve fiyat karşılaştırma platformları (Akakçe vb.) için dinamik ürün site haritası entegrasyonu, kurumsal ürün kartı ve tipografi sadeleştirmesi.",
    items: [
      {
        title:
          "Dinamik Ürün Site Haritası (Product Sitemap XML) & Akakçe Entegrasyonu",
        category: "Yeni",
        details: [
          "Akakçe ve arama motoru botlarının ürünleri anlık ve eksiksiz indeksleyebilmesi için /product-sitemap.xml dinamik XML besleme motoru geliştirildi.",
          "Ürünlerin güncel URL, stok, son değişiklik tarihi ve görsel bilgilerini barındıran Google & Akakçe uyumlu <image:image> etiketleri entegre edildi.",
          "robots.txt yapılandırması arama botlarının ürün haritasını otomatik keşfetmesini sağlayacak şekilde güncellendi.",
        ],
      },
      {
        title: "Ürün Kartları, Görsel Yerleşimi ve Arayüz Sadeleştirmesi",
        category: "Tasarım",
        details: [
          "Ürün listeleme kartları (ProductCard) kurumsal medikal kimliğe uygun olarak optimize edildi; ürün görselleri kartı tam ve estetik kaplayacak (cover) biçime getirildi.",
          "Kart kavisleri, favori butonları ve seri rozetleri sadeleştirilerek arayüzdeki kaba gölgeler ve dikkat dağıtıcı animasyonlar temizlendi.",
          "İletişim panellerindeki terminoloji ve etiketler (sabit hat / GSM ayrımları) kurumsal standartlara uyarlandı.",
        ],
      },
    ],
  },
  {
    version: "v1.6.0",
    date: "18 Ağustos 2026",
    summary:
      "Kurumsal E-Posta altyapısı (SMTP) güvenlik protokolleri iyileştirmesi ve kapsamlı UI/UX modernizasyonu.",
    items: [
      {
        title: "Güvenli E-Posta İletimi (SMTP) Optimizasyonu",
        category: "Altyapı",
        details: [
          "cPanel ve kurumsal e-posta sunucuları için TLS (Transport Layer Security) katmanında doğrulama sertifikası optimizasyonları yapıldı.",
          "Şifre sıfırlama, sipariş onay ve bildirim e-postalarının daha kararlı bir şekilde iletilmesi sağlandı.",
        ],
      },
      {
        title: "Modern ve Minimalist UI/UX Revizyonu",
        category: "Tasarım",
        details: [
          "Karmaşık renk geçişleri ve arka plan gradyanları (gradients) kaldırılarak, markanın kurumsal renklerini ön plana çıkaran sade ve sağlam (solid) renk paletine geçiş yapıldı.",
          "Eski nesil sivri ve keskin tasarım hatları yerine, modern tasarım diline uygun yumuşatılmış köşe (rounded) yapıları tüm bileşenlerde standart hale getirildi.",
          "Kullanıcı deneyimini sadeleştirmek ve metin okunabilirliğini artırmak amacıyla gereksiz grafik öğeleri (emojiler) temizlendi.",
        ],
      },
    ],
  },
  {
    version: "v1.5.0",
    date: "17 Ağustos 2026",
    summary:
      "Kapsamlı SEO ve Schema.org altyapısı, dinamik OpenGraph önizleme görselleri, site haritası, veritabanı senkronizasyonu ve Next.js 16 çekirdek modernizasyonu.",
    items: [
      {
        title:
          "Kapsamlı Arama Motoru Optimizasyonu (SEO) ve Schema.org (JSON-LD)",
        category: "Yeni",
        details: [
          "Google ve Yandex zengin sonuçları (Rich Snippets) için MedicalBusiness, Organization, WebSite ve BreadcrumbList şemaları entegre edildi.",
          "Ürün sayfalarına dinamik fiyat, stok, kargo koşulları ve değerlendirmeleri içeren yapısal Product & Offer şemaları eklendi.",
          "EEAT (Deneyim, Uzmanlık, Otoriterlik ve Güvenilirlik) standartlarına uygun kurumsal sertifikasyon ve merkez mağaza konum bilgileri tanıtıldı.",
        ],
      },
      {
        title:
          "Dinamik Sosyal Medya Önizleme Motoru (OpenGraph & Twitter Card)",
        category: "Yeni",
        details: [
          "WhatsApp, Telegram, Twitter, LinkedIn ve iMessage paylaşımları için 1200x630 piksel boyutunda kurumsal dinamik görsel motoru geliştirildi.",
          "Ürün bağlantıları paylaşıldığında ürünün yüksek çözünürlüklü görseli, güncel fiyatı ve teknik özellikleri otomatik olarak önizleme kartına yansıtıldı.",
        ],
      },
      {
        title:
          "Dinamik Site Haritası (Sitemap.xml) ve Bot Yönetimi (Robots.txt)",
        category: "İyileştirme",
        details: [
          "Tüm medikal ürünleri, kategorileri ve kurumsal sayfaları anlık listeleyen dinamik /sitemap.xml motoru kuruldu.",
          "Arama motoru botlarının siteyi hızlı ve doğru indekslemesini sağlayan dinamik /robots.txt kuralları devreye alındı.",
        ],
      },
      {
        title: "Medikal Ürün ve Kategori Veri Tabanı Senkronizasyonu",
        category: "Altyapı",
        details: [
          "63 adet sertifikalı hasta yatağı, transfer lifti ve medikal bakım ürünü teknik özellikleri, detaylı görselleri ve serileriyle (Platinum, Gold, Silver) sisteme aktarıldı.",
          "Tüm ürün kategorileri ve teknik parametre tabloları listeleme altyapısına bağlandı.",
        ],
      },
      {
        title: "Next.js 16.3 ve React 19 Mimari Modernizasyonu",
        category: "Altyapı",
        details: [
          "Platform çekirdeği Next.js 16.3 ve React 19 mimarisine yükseltildi.",
          "Form ve sepet bileşenleri modern useActionState altyapısına uyarlandı.",
          "Turbopack derleme optimizasyonu ile sayfa yükleme ve derleme hızları artırıldı.",
        ],
      },
      {
        title:
          "Güvenli Ödeme Altyapısı Standardizasyonu (iyzico 3D Secure & Havale/EFT)",
        category: "Güvenlik",
        details: [
          "Çevrim içi kartlı ödemeler 256-Bit SSL şifrelemeli resmi iyzico 3D Secure Sanal POS altyapısına bağlandı.",
          "Havale ve EFT ile ödemelerde doğrudan güvenli sipariş oluşturma ve otomatik sipariş teyit mekanizması entegre edildi.",
        ],
      },
      {
        title: "Çift Katmanlı E-Posta Bildirim Sistemi",
        category: "Altyapı",
        details: [
          "Müşteri sipariş onayları, kargo bildirimleri ve yönetici uyarıları için kurumsal SSL SMTP e-posta motoru kuruldu.",
          "Olası ağ kesintilerine karşı yedekli e-posta iletim altyapısı devreye alındı.",
        ],
      },
    ],
  },
  {
    version: "v1.4.0",
    date: "16 Ağustos 2026",
    summary:
      "Canlı kargo ve sevkiyat takip sistemi, mobil teslimat koordinasyonu ve sipariş yönetim modülleri.",
    items: [
      {
        title: "Canlı Kargo ve Sevkiyat Takip Portalı",
        category: "Yeni",
        details: [
          "Müşteriler için sipariş kodu ile anlık GPS kargo konumu, kurye iletişim bilgileri ve teslimat rotası gösterimi eklendi.",
          "Sevkiyat personeli ve kuryeler için sahadan anlık durum bildiren özel mobil teslimat arayüzü devreye alındı.",
        ],
      },
      {
        title: "Gelişmiş Sipariş ve Operasyon Yönetim Merkezi",
        category: "Yeni",
        details: [
          "Sipariş durumu güncelleme, e-fatura/irsaliye ekleme ve otomatik müşteri SMS/e-posta bilgilendirme modülü kuruldu.",
          "Çoklu ürün görseli, teknik özellik tablosu yönetimi ve dinamik ürün katalog modülleri tamamlandı.",
          "Hiyerarşik kategori ağacı yönetimi, özel indirim kuponları ve ücretsiz kargo eşiği ayarları eklendi.",
          "Sahadaki aktif sevkiyat araçlarını harita üzerinden izleyen Canlı Sevkiyat Radarı geliştirildi.",
        ],
      },
    ],
  },
  {
    version: "v1.3.0",
    date: "15 Ağustos 2026",
    summary:
      "Dinamik sepet çekmecesi, indirim kuponları ve 81 il entegrasyonlu sipariş tamamlama akışı.",
    items: [
      {
        title: "Dinamik Sepet Çekmecesi & Kupon Motoru",
        category: "Yeni",
        details: [
          "Sayfadan ayrılmadan sağdan açılan CartDrawer sepet çekmecesi ve anlık miktar güncelleme efektleri geliştirildi.",
          "Yüzdesel ve sabit tutarlı indirim kuponu doğrulama motoru eklendi.",
          "Sipariş formunda 81 il otomatik adres eşleme ve fatura tipi (Bireysel / Kurumsal) seçimi sağlandı.",
        ],
      },
    ],
  },
  {
    version: "v1.2.0",
    date: "14 Ağustos 2026",
    summary:
      "Detaylı ürün galerisi, teknik özellikler tablosu ve müşteri danışma butonları.",
    items: [
      {
        title: "Ürün Detay ve Medikal Özellikler Galerisi (/urun/[slug])",
        category: "Tasarım",
        details: [
          "Çoklu görsel galerisi, yakınlaştırma (zoom), teknik özellik tablosu (SpecTable) ve müşteri yorumları modülü tamamlandı.",
          "Müşteri temsilcisine tek tıkla ulaşan WhatsApp danışma ve VIP telefon destek butonları entegre edildi.",
        ],
      },
    ],
  },
  {
    version: "v1.1.0",
    date: "13 Ağustos 2026",
    summary:
      "Kategori mega menüsü, seri filtreleri ve kurumsal altbilgi tasarımı.",
    items: [
      {
        title: "Kategori Navigasyonu ve Filtreleme Altyapısı",
        category: "Yeni",
        details: [
          "Mega menü navigasyonu, Seri filtreleri (Platinum, Gold, Silver), fiyat aralığı ve sayfalama altyapısı kuruldu.",
          "4 kolonlu modern kurumsal Footer ve güvenli ödeme rozetleri eklendi.",
        ],
      },
    ],
  },
  {
    version: "v1.0.1",
    date: "12 Ağustos 2026",
    summary: "Kurumsal sayfalar, yasal metinler ve sözleşme altyapıları.",
    items: [
      {
        title: "Kurumsal Sayfalar ve Yasal Metinler",
        category: "Yeni",
        details: [
          "KVKK Aydınlatma Metni, Gizlilik Politikası, İptal ve İade Koşulları, Mesafeli Satış Sözleşmesi, Hakkımızda ve İletişim sayfaları tamamlandı.",
        ],
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "10 Ağustos 2026",
    summary:
      "MCARIS Medikal e-ticaret platformunun kuruluşu ve kurumsal tasarım sistemi.",
    items: [
      {
        title: "Proje Başlangıcı ve Kurumsal Tasarım Sistemi",
        category: "Yeni",
        details: [
          "Next.js App Router, TailwindCSS kurumsal turkuaz ve altın tasarım sistemiyle platform temelleri atıldı.",
          "PostgreSQL veritabanı şeması modellendi.",
        ],
      },
    ],
  },
];

/* ──────────────────── Helpers ──────────────────── */
function getCategoryBadge(cat: ChangeCategory) {
  switch (cat) {
    case "Yeni":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    case "İyileştirme":
      return {
        bg: "bg-sky-50 text-sky-700 border-sky-200",
        dot: "bg-sky-500",
      };
    case "Altyapı":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    case "Güvenlik":
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-500",
      };
    case "Tasarım":
      return {
        bg: "bg-violet-50 text-violet-700 border-violet-200",
        dot: "bg-violet-500",
      };
    case "Düzeltme":
      return {
        bg: "bg-orange-50 text-orange-700 border-orange-200",
        dot: "bg-orange-500",
      };
    default:
      return {
        bg: "bg-gray-50 text-gray-700 border-gray-200",
        dot: "bg-gray-400",
      };
  }
}

/* ──────────────────── Icons ──────────────────── */
function SearchIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function CalendarIcon({ className = "w-4 h-4 text-white" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TagIcon({ className = "w-3.5 h-3.5 text-white" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

/* ──────────────────── Main Component ──────────────────── */
export default function ChangelogsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    () => new Set(CHANGELOG_RELEASES.slice(0, 2).map((r) => r.version)),
  );

  const categories = [
    "Tümü",
    "Yeni",
    "İyileştirme",
    "Altyapı",
    "Güvenlik",
    "Tasarım",
  ];

  const filteredReleases = useMemo(() => {
    const q = search.trim().toLowerCase();

    return CHANGELOG_RELEASES.map((release) => {
      const matchesVersion = release.version.toLowerCase().includes(q);
      const matchesDate = release.date.toLowerCase().includes(q);
      const matchesSummary = release.summary.toLowerCase().includes(q);

      const matchingItems = release.items.filter((item) => {
        const matchesCat =
          selectedCategory === "Tümü" || item.category === selectedCategory;
        if (!matchesCat) return false;

        if (!q) return true;

        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDetails = item.details.some((d) =>
          d.toLowerCase().includes(q),
        );
        return (
          matchesTitle ||
          matchesDetails ||
          matchesVersion ||
          matchesDate ||
          matchesSummary
        );
      });

      return {
        ...release,
        items: matchingItems,
      };
    }).filter((r) => r.items.length > 0);
  }, [search, selectedCategory]);

  const totalReleases = CHANGELOG_RELEASES.length;
  const totalFeatures = CHANGELOG_RELEASES.reduce(
    (sum, r) => sum + r.items.length,
    0,
  );

  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) next.delete(version);
      else next.add(version);
      return next;
    });
  };

  const expandAll = () =>
    setExpandedVersions(new Set(filteredReleases.map((r) => r.version)));
  const collapseAll = () => setExpandedVersions(new Set());

  return (
    <div className="w-full bg-[#F8FAFC] font-body pb-24">
      <section className="bg-slate-900 text-white py-14 md:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-6 relative z-10 text-center space-y-4">
          <span className="px-3.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-slate-200 bg-slate-800 border border-slate-700 inline-flex items-center gap-2">
            <span>Sürekli Gelişim &amp; Şeffaflık</span>
          </span>

          <h1 className="text-3xl md:text-5xl font-black text-white font-inter leading-tight">
            Değişiklik <span className="text-slate-100">Kayıtları</span>
          </h1>

          <p className="text-gray-200 text-sm md:text-base max-w-3xl mx-auto font-inter leading-relaxed">
            MCARIS Medikal e-ticaret platformundaki tüm teknik yenilikleri,
            güvenlik güncellemelerini, arama optimizasyonlarını ve geliştirme
            geçmişini buradan şeffaflıkla takip edebilirsiniz.
          </p>

          {/* Stats Badges */}
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white shadow-xs">
              <CalendarIcon />
              <span>{totalReleases} Sürüm Dağıtımı</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white shadow-xs">
              <TagIcon />
              <span>{totalFeatures} Geliştirme & İyileştirme</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-container-max mx-auto px-6 py-12 space-y-8">
        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
              <input
                id="changelog-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Güncellemelerde ara... (örneğin: SEO, sepet, kargo, iyzico, admin)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-sm font-inter text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={expandAll}
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 hover:bg-brand/10 hover:text-brand-dark hover:border-brand/30 transition-all"
              >
                Tümünü Aç
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 hover:bg-brand/10 hover:text-brand-dark hover:border-brand/30 transition-all"
              >
                Tümünü Kapat
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs font-bold text-gray-400 mr-1 shrink-0">
              Kategori:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? "bg-brand text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Releases Timeline List */}
        <div className="space-y-6">
          {filteredReleases.map((release) => {
            const isOpen = expandedVersions.has(release.version);

            return (
              <div
                key={release.version}
                className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden transition-all hover:border-brand/50 hover:shadow-md"
              >
                {/* Header Banner - Clickable */}
                <button
                  onClick={() => toggleVersion(release.version)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="px-3.5 py-1 bg-brand/15 text-brand-dark border border-brand/30 text-sm font-black rounded-xl font-mono">
                      {release.version}
                    </span>
                    {release.badge && (
                      <span className="px-2.5 py-0.5 bg-gold/15 text-gold-dark border border-gold/30 text-xs font-extrabold rounded-full">
                        {release.badge}
                      </span>
                    )}
                    <span className="text-xs font-bold text-gray-400 font-inter">
                      {release.date}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold hidden md:inline">
                      • {release.items.length} Başlık
                    </span>
                  </div>
                  <ChevronIcon open={isOpen} />
                </button>

                {/* Release Summary */}
                <div className="px-6 pb-4 -mt-2">
                  <p className="text-xs md:text-sm text-gray-600 font-inter leading-relaxed">
                    {release.summary}
                  </p>
                </div>

                {/* Expanded Details List */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-4 bg-gray-50/30">
                    {release.items.map((item, idx) => {
                      const badge = getCategoryBadge(item.category);

                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-3"
                        >
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${badge.bg}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                              />
                              {item.category}
                            </span>
                            <h3 className="text-sm md:text-base font-bold text-slate-900 font-inter">
                              {item.title}
                            </h3>
                          </div>

                          <ul className="space-y-1.5 pl-2">
                            {item.details.map((detail, dIdx) => (
                              <li
                                key={dIdx}
                                className="text-xs md:text-sm text-gray-600 font-inter flex items-start gap-2 leading-relaxed"
                              >
                                <span className="text-brand font-bold mt-0.5">
                                  •
                                </span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>

                          {item.links && item.links.length > 0 && (
                            <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Sayfa Bağlantısı:
                              </span>
                              {item.links.map((link, lIdx) => (
                                <Link
                                  key={lIdx}
                                  href={link.href}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark bg-brand/10 hover:bg-brand/20 border border-brand/25 px-2.5 py-1 rounded-lg transition-colors"
                                >
                                  <span>{link.label}</span>
                                  <span aria-hidden="true" className="font-extrabold">&rarr;</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredReleases.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 space-y-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <SearchIcon />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Eşleşen Değişiklik Kaydı Bulunamadı
            </h3>
            <p className="text-xs text-gray-500 font-inter max-w-sm mx-auto">
              &ldquo;{search}&rdquo; aramanız ile eşleşen bir kayıt bulunamadı.
              Filtreleri temizleyerek tekrar deneyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("Tümü");
              }}
              className="text-xs text-brand-dark font-extrabold hover:underline pt-2"
            >
              Aramayı ve Filtreleri Temizle
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
