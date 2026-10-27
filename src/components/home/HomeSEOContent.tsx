import Link from "next/link";
import { BUSINESS_PHONE, WHATSAPP_NUMBER } from "@/lib/constants";
import { ANKARA_DISTRICTS } from "@/lib/ankaraDistricts";
import MarketplaceComparison from "@/components/product/MarketplaceComparison";

const MAJOR_DISTRICT_SLUGS = [
  "cankaya",
  "yenimahalle",
  "kecioren",
  "etimesgut",
  "mamak",
  "sincan",
  "altindag",
  "pursaklar",
  "golbasi",
  "polatli",
];

export default function HomeSEOContent() {
  return (
    <section className="max-w-container-max mx-auto px-4 sm:px-6 w-full py-8 sm:py-12 font-sans">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs space-y-8 sm:space-y-10">
        
        {/* Header Intro */}
        <div className="border-b border-neutral-200 pb-6 sm:pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800">
            <span className="text-neutral-900 font-extrabold">MCARIS MEDİKAL</span>
            <span className="text-neutral-300">|</span>
            <span className="text-emerald-700">Ankara Merkezli Profesyonel Evde Bakım Çözümleri</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
            Ankara Hasta Yatağı Satışı, Fiyatları ve Evde Bakım Teknolojileri Rehberi
          </h2>
          
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-4xl">
            Evde hasta bakım süreci, hem hastanın iyileşme konforunu hem de refakatçinin fiziksel sağlığını doğrudan etkileyen kritik bir dönemdir. Standart ev yatakları, hastanın gün içindeki oturma ve yatış pozisyonlarını sağlayamadığı gibi bası yarası (dekübitüs) riskini katlar. <strong>MCARIS Medikal</strong> olarak, güçlü elektrikli motor sistemlerine sahip 2, 3 ve 4 motorlu elektrikli hasta karyolalarını, havalı yatak sistemlerini ve hasta taşıma liftlerini Ankara genelinde <strong>gün içinde ücretsiz teslimat, yerinde montaj ve 2 yıl resmi garanti</strong> ile sunuyoruz.
          </p>
        </div>

        {/* 1. Hayati Önemi & Bası Yarası Mekanizması */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            <span>Evde Bakım Sürecinde Profesyonel Hasta Karyolasının Rolü</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>
              Uzun süre yatmak zorunda kalan hastalarda vücut ağırlığının kuyruk sokumu, topuk ve kürek kemiklerine sürekli baskı yapması, kılcal kan damarlarını sıkıştırarak doku beslenmesini engeller. Bu durum, tıp dilinde dekübitüs olarak bilinen derin ve tedavisi güç yatak yaralarına yol açar. Bu kritik bası yarası riskini en aza indiren asıl medikal teknoloji, sıralı basınç değişimi sağlayan profesyonel <strong>havalı yatak sistemleridir</strong>. Motorlu hasta karyolası ise hastaya yemek yeme, oturma, nefes alma ve vasküler dinlenme pozisyonlarını sağlayarak bakım verenin ergonomisini korur ve havalı yatakla tam uyum içinde çalışır.
            </p>
            <p>
              Aynı zamanda yatağın baş kısmının dikleşebilmesi, hastanın akciğer kapasitesini artırarak nefes darlığını hafifletir, reflü ve aspirasyon (akciğere gıda kaçması) tehlikesini önler ve yatak içi beslenmeyi konforlu hale getirir. Refakatçiler içinse hastayı kaldırıp indirme zorunluluğu kalktığından bel ve boyun fıtığı gibi sakatlıklar önlenir.
            </p>
          </div>
        </div>

        {/* 2. Motor Sayısına Göre Karyola Modelleri (Cards) */}
        <div className="space-y-6">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              <span>Motor Sayısı ve Donanım Konfigürasyonuna Göre Hasta Yatakları</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Hastanızın hareket kabiliyetine ve tedavi sürecine en uygun motor seçeneğini belirleyin:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 2 Motorlu */}
            <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-5 sm:p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md inline-block">
                  2 Motorlu Giriş / Standart
                </span>
                <p className="text-base sm:text-lg font-bold text-neutral-950">
                  Baş ve Ayak Ucu Hareketli
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  İki bağımsız elektrikli motor ile sırt kısmı dikleşebilir ve ayak ucu kumandayla bağımsız kaldırılabilir. Kendi başına ayağa kalkabilen, kısa ve orta vadeli ameliyat sonrası nekahat dönemindeki hastalar için en ekonomik çözümdür.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-xs font-semibold text-neutral-700">
                <span>Silver Seri • 19.000 TL'den başlayan fiyatlar</span>
              </div>
            </div>

            {/* 3 Motorlu */}
            <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-5 sm:p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md inline-block">
                  3 Motorlu Asansörlü Profesyonel
                </span>
                <p className="text-base sm:text-lg font-bold text-neutral-950">
                  Dikey Yükseklik Ayarlı &amp; ABS Kasa
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Baş ve ayak hareketlerine ilave olarak yatağın dikey eksende 45-90 cm aralığında asansör gibi yükselip alçalmasını sağlar. Bakım verenin eğilmeden pansuman yapabilmesini, hastanın tekerlekli sandalyeye kolay transferini sağlar.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-xs font-semibold text-neutral-700">
                <span>Silver &amp; Gold Seri • 34.500 TL'den itibaren</span>
              </div>
            </div>

            {/* 4 Motorlu */}
            <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-5 sm:p-6 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block">
                  4 Motorlu Yoğun Bakım
                </span>
                <p className="text-base sm:text-lg font-bold text-neutral-950">
                  Trendelenburg &amp; Ters Eğim Pozisyonu
                </p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Klinik yoğun bakım donanımına sahiptir. Asansör ve sırt/ayak hareketlerine ek olarak Trendelenburg eğimi verir. Tansiyon dengeleme, solunum yolu drenajı ve yarı koltuk oturuş pozisyonunu tam sağlar.
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-200 text-xs font-semibold text-neutral-700">
                <span>Gold &amp; Platinum • 37.500 TL - 89.500 TL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 2026 Satış ve Kiralama Fiyat Tablosu (Microdata) */}
        <div className="space-y-4">
          <div className="border-b border-neutral-200 pb-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
              Şeffaf Fiyatlandırma ve Sözleşme Güvencesi
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-950">
              2026 Güncel Hasta Karyolası Modelleri ve Satış Fiyat Tablosu
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              MCARIS Medikal güvencesiyle Ankara merkezli reel fiyatlandırma matrisi:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider">
                  <th className="p-3.5 sm:p-4">Model ve Seri</th>
                  <th className="p-3.5 sm:p-4">Motor &amp; Donanım Nitelikleri</th>
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
                  <td itemProp="name" className="p-3.5 sm:p-4 font-bold text-neutral-950">
                    Standart Giriş 2 Motorlu
                    <span className="block text-[11px] font-normal text-neutral-500">Silver Seri</span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                    Çift elektrikli motor, sırt ve ayak ucu kalkar, kablolu el kumandası, ekonomik bakım
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
                  <td itemProp="name" className="p-3.5 sm:p-4 font-bold text-neutral-950">
                    Asansörlü Profesyonel 3 Motorlu
                    <span className="block text-[11px] font-normal text-neutral-500">Silver &amp; Gold Seri</span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                    Sırt + ayak + 45-90 cm dikey asansör yükseklik ayarı, refakatçi ergonomisi
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
                  <td itemProp="name" className="p-3.5 sm:p-4 font-bold text-neutral-950">
                    Full Fonksiyon Yoğun Bakım 4 Motorlu
                    <span className="block text-[11px] font-normal text-neutral-500">Gold Seri</span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                    4 bağımsız motor, Trendelenburg ve Anti-Trendelenburg açısı, merkezi kilit teker
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
                  <td itemProp="name" className="p-3.5 sm:p-4 font-bold text-neutral-950">
                    Lüks Ahşap Baza &amp; Burmeier Dali
                    <span className="block text-[11px] font-normal text-neutral-500">Platinum Seri (Alman)</span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-neutral-600">
                    Ev mobilyası görünümü, 24V güvenli gerilim, kablosuz kumanda, tam ahşap gövde
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
          <p className="text-[11px] text-neutral-500 italic">
            * Bilgi Notu: MCARIS Medikal olarak Ankara genelinde hem aylık kiralama hem de 2 yıl garantili sıfır hasta karyolası satışı yapmaktayız. Ankara genelinde hazır stoklu ürünlerde aynı gün adrese teslimat, kata çıkarma, yerinde montaj ve refakatçiye kumanda eğitimi sağlanır. Hastanızın durumuna göre uyumlu 4 parçalı medikal şilte, havalı yatak ve aksesuarlar uzman danışmanlarımızca önerilmektedir. Kiralama bedelleri dileyen müşterilerimiz için satın alma fiyatından mahsup edilebilmektedir.
          </p>
        </div>

        {/* 4. Bası Yarasına Karşı Havalı Yataklar */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            <span>Yatak Yaralarına (Dekübitüs) Karşı Boru Tipi Havalı Yatak Sistemleri</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <div className="space-y-2">
              <p className="font-bold text-neutral-900 text-sm sm:text-base">
                Boru Tipi ve Ventilasyon Teknolojisinin Üstünlüğü
              </p>
              <p>
                Geleneksel baklava tipi yataklar yalnızca yüzeysel hava akışı sağlar ve 1. evreden sonra yetersiz kalır. MCARIS bünyesindeki profesyonel <strong>boru tipi havalı yataklar</strong>, bağımsız A+B veya A+B+C tüp hücre döngüsü ile çalışır. Sıralı şişip inen hücreler vücut basıncını sürekli yer değiştirerek kılcal damarları rahatlatır ve kan akışını canlandırır.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-neutral-900 text-sm sm:text-base">
                7/24 Kesintisiz ve Ultra-Sessiz Kompresör
              </p>
              <p>
                Havalı yatak motorları asla fişten çekilmemelidir; motor durduğunda yatağın havası boşalır ve bası yarası riski dakikalar içinde yeniden başlar. Cihazlarımız 45 desibelin altında çalışan fısıltı sessizliğinde kompresör motorlarına ve terlemeyi kesen mikro hava üfleme (ventilasyon) deliklerine sahiptir.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Ankara Lojistik Ağı & 25 İlçe */}
        <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Ankara Bölge Lojistik Filosu
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Ankara'nın 25 İlçesinde Gün İçinde Kapıda Montaj
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`tel:${BUSINESS_PHONE}`}
                className="px-4 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs inline-flex items-center gap-2 transition-colors active:scale-98 cursor-pointer shadow-xs"
                title="Hemen Arayın: 0536 820 02 69"
                aria-label="Telefonla Arayın: 0536 820 02 69"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>0536 820 02 69</span>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, Ankara içi hasta yatağı modelleri, satış fiyatları ve aynı gün teslimat hakkında bilgi almak istiyorum.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs inline-flex items-center gap-2 transition-colors active:scale-98 cursor-pointer shadow-xs"
                title="WhatsApp Canlı Danışma & Sipariş"
                aria-label="WhatsApp Canlı Danışma & Sipariş"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>WhatsApp Ankara İletişim</span>
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Hastaneden eve taburcu olan hastaların yatak bekleyecek zamanı yoktur. MCARIS Medikal olarak Çankaya, Yenimahalle, Keçiören, Etimesgut, Mamak, Sincan, Altındağ, Pursaklar, Gölbaşı, Polatlı ve Kahramankazan başta olmak üzere Ankara'nın tüm ilçelerine kendi lojistik araçlarımızla gün içinde adresinize ulaşıyoruz. Karyola katınıza çıkarılır, istediğiniz odaya kurulur ve hasta yakınlarına tüm fonksiyonlar uygulamalı olarak öğretilir.
          </p>

          <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400">
            <span className="font-bold text-neutral-200 mr-1">Hızlı Hizmet İlçelerimiz:</span>
            {ANKARA_DISTRICTS.filter((d) => MAJOR_DISTRICT_SLUGS.includes(d.slug)).map((district, idx, arr) => (
              <span key={district.slug} className="inline-flex items-center gap-1.5">
                <Link
                  href={`/ankara-hasta-yatagi/${district.slug}`}
                  className="text-neutral-300 hover:text-white hover:underline transition-colors font-medium"
                  title={`${district.name} Hasta Yatağı Hizmeti`}
                >
                  {district.name}
                </Link>
                {idx < arr.length - 1 && <span className="text-neutral-600">•</span>}
              </span>
            ))}
            <Link
              href="/ankara-hasta-yatagi"
              className="ml-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 font-bold transition-colors inline-flex items-center gap-1"
            >
              Tüm 25 İlçe &rarr;
            </Link>
          </div>
        </div>

        {/* Marketplace vs MCARIS Direct Delivery & Assembly Comparison */}
        <MarketplaceComparison />

        {/* 6. Doğrudan Üreticiden Birinci Elden Satış & Şeffaf Süreç */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            <span>Doğrudan Üreticiden Birinci Elden Satış &amp; Şeffaf Hizmet</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-neutral-600">
            <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-4 space-y-2">
              <span className="font-bold text-neutral-950 block text-sm">1. Doğrudan Fabrika Satışı</span>
              <p className="text-xs leading-relaxed">
                MCARIS Medikal, doğrudan birinci elden üretim ve satış yapan bağımsız bir medikal ve e-ticaret kuruluşudur. Aracı kârlarını ortadan kaldırarak birinci sınıf motorlu karyolaları en uygun maliyetle sunar.
              </p>
            </div>

            <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-4 space-y-2">
              <span className="font-bold text-neutral-950 block text-sm">2. Bürokrasi Yok, Anında Teslim</span>
              <p className="text-xs leading-relaxed">
                MCARIS Medikal olarak SGK anlaşmamız bulunmamaktadır. Bürokratik onaylar ve haftalarca süren bekleme süreleri yerine hastanız taburcu olduğu gün doğrudan sıfır ürünle oda içi kurulum hizmeti sağlanır.
              </p>
            </div>

            <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-xl p-4 space-y-2">
              <span className="font-bold text-neutral-950 block text-sm">3. Resmi Fatura &amp; 2 Yıl Garanti</span>
              <p className="text-xs leading-relaxed">
                Tüm siparişlerinizde T.C. Maliye onaylı kurumsal e-Fatura düzenlenir. Tüm motor ve mekanik aksamlar 2 yıl resmi yerinde servis ve 10 yıl yedek parça temin garantisi altındadır.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Footer Nav & Internal Linking */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-neutral-600">
            <span className="font-bold text-neutral-900">İçerik Gezintisi:</span>
            <Link href="/ankara-hasta-yatagi" className="text-neutral-950 hover:underline font-semibold">
              Ankara İlçe Hizmet Bölgeleri
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/kategori/hasta-yataklari" className="text-neutral-950 hover:underline font-semibold">
              Tüm Karyola Modelleri
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/seri/platinum" className="text-neutral-950 hover:underline font-semibold">
              Platinum Lüks Seriler
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/sss" className="text-neutral-950 hover:underline font-semibold">
              Sıkça Sorulan Sorular
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, Ankara içi hasta yatağı modelleri ve fiyatları hakkında bilgi almak istiyorum.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
            >
              <span>Ankara Teslimat &amp; Sipariş Danışma</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
