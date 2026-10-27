import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, BRAND_NAME, getBreadcrumbSchema, getFAQSchema, WHATSAPP_NUMBER } from "@/lib/seo";
import { BUSINESS_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ankara Hasta Yatağı Kiralama ve Satın Alma Çözümleri | MCARIS Medikal",
  description:
    "Ankara genelinde hijyenik dezenfekte edilmiş hasta yatağı kiralama ve 2 yıl garantili sıfır hasta karyolası satışı. Depozitosuz kiralama, hazır stoklu ürünlerde aynı gün adrese montaj ve kirayı satın almaya saydırma avantajı.",
  alternates: {
    canonical: "/kiralama-proseduru",
  },
  openGraph: {
    title: `Ankara Hasta Yatağı Kiralama ve Satın Alma Çözümleri | ${BRAND_NAME}`,
    description:
      "Ankara genelinde steril dezenfekte edilmiş hasta yatağı kiralama ve 2 yıl garantili sıfır hasta karyolası satışı. Depozitosuz süreç ve hazır stoklu modellerde aynı gün kata montaj.",
    url: `${SITE_URL}/kiralama-proseduru`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
  },
};

const KIRALAMA_FAQS = [
  {
    question: "Hasta yatağı kiralama için depozito gerekiyor mu?",
    answer:
      "Hayır. MCARIS Medikal olarak karşılıklı güven ilkesiyle çalışıyoruz. Kiralama süreçlerimizde depozito talep edilmez. Yalnızca teslimat anında düzenlenen şeffaf kiralama formu ve ilgili ayın kira bedeli ile süreç başlatılır.",
  },
  {
    question: "Kiralama sürecinde karyola hijyeni nasıl sağlanıyor?",
    answer:
      "Hastanızın enfeksiyon güvenliği bizim için en yüksek önceliktir. Kiralık hasta karyolası gövdeleri teslimat öncesinde hastane tipi medikal dezenfektanlarla titizlikle sterilize edilerek hijyenik olarak adrese sevk edilir.",
  },
  {
    question: "Kiraladığım hasta yatağını daha sonra satın alabilir miyim?",
    answer:
      "Evet. Hastanızın bakım süreci uzadığında veya kalıcı bakıma evrildiğinde, o güne kadar ödediğiniz kiralama bedelleri sıfır ürünün liste fiyatından mahsup edilir (satın almaya saydırma). Böylece ödediğiniz kira parası boşa gitmemiş olur.",
  },
  {
    question: "Ankara içi teslimat ve kurulum kiralama için de aynı gün yapılıyor mu?",
    answer:
      "Evet. Hazır stoklu kiralık hasta yatağı modellerimizde kendi mobil lojistik araçlarımız ve sertifikalı teknisyenlerimizle Ankara'nın tüm ilçelerine (Çankaya, Keçiören, Yenimahalle, Etimesgut, Mamak, Sincan vb.) gün içinde adrese ulaşıyor, katınıza çıkarıyor ve odanıza anahtar teslim montaj yapıyoruz.",
  },
  {
    question: "Hasta yatağını kiralamak mı, sıfır satın almak mı daha avantajlıdır?",
    answer:
      "1-3 aylık geçici ortopedik ameliyatlar (kalça/diz protezi, kırık tedavisi) ve kısa nekahet dönemleri için kiralama bütçe dostudur. 6 ayı aşan veya kalıcı yatağa bağımlı bakım süreçlerinde ise 2 yıl yerinde resmi garanti ve mülkiyet sağlayan sıfır satın alma seçeneği daha ekonomiktir.",
  },
];

export default function KiralamaProseduruPage() {
  const breadcrumbs = [
    { name: "Ana Sayfa", url: "/" },
    { name: "Kiralama ve Satın Alma Çözümleri", url: "/kiralama-proseduru" },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);
  const faqSchema = getFAQSchema(KIRALAMA_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema]) }}
      />

      <div className="bg-[#FAFBFD] min-h-screen py-8 sm:py-12 font-sans">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-bold">Kiralama ve Satın Alma Çözümleri</span>
          </nav>

          {/* Hero Banner Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800">
              <span className="text-neutral-900 font-extrabold">MCARIS MEDİKAL</span>
              <span className="text-neutral-300">|</span>
              <span className="text-emerald-700">Ankara Kiralama &amp; Satış Hibrit Modeli</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Ankara Hasta Yatağı Kiralama ve Satın Alma Hizmetleri
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
              Evde hasta bakımına başlarken hastanızın tedavi süresine en uygun çözümü sunuyoruz. Geçici ortopedik operasyonlar ve kısa nekahat dönemleri için <strong>steril dezenfekte edilmiş aylık kiralama</strong>; uzun süreli ve kalıcı bakım gereksinimleri için ise <strong>2 yıl yerinde resmi garantiyle sıfır hasta karyolası satışı</strong> sağlıyoruz. Ankara genelinde kendi araçlarımızla hazır stoklu modellerimizde aynı gün adrese teslimat ve odaya montaj standarttır.
            </p>

            {/* Hybrid Flexibility Feature Box */}
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 sm:p-5 rounded-r-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <span>🔄</span>
                <span>Esnek Çözüm: Kiralamayı Satın Almaya Saydırma Avantajı</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                Kiraladığınız hasta karyolasının kullanım süresi uzadığında ödediğiniz kira bedelleri boşa gitmez! O güne kadar ödediğiniz tüm kira bedelleri sıfır ürünün liste fiyatından düşülür ve karyola doğrudan mülkiyetinize geçer.
              </p>
            </div>
          </div>

          {/* 4 Steps to Rent a Bed */}
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-3">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Zahmetsiz ve Şeffaf Süreç
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                4 Kolay Adımda Hasta Yatağı Kiralama Prosedürü
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-base">
                    1
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">Modelinizi Belirleyin</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Hastanızın hareket durumuna göre 2 motorlu (baş-ayak hareketli), 3 motorlu (asansörlü) veya 4 motorlu (yoğun bakım) modellerimizden birini uzmanımızla seçin.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-sky-700 block">Klinik İhtiyaca Uygun</span>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                    2
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">Depozitosuz Randevu</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Depozito veya gizli ek nakliye ücreti olmadan şeffaf aylık kiralama formunu doldurarak hazır stoklu modellerimiz için aynı gün teslimat randevunuzu oluşturun.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 block">Hızlı &amp; Kolay Süreç</span>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-base">
                    3
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">Adrese Teslim &amp; Montaj</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Kendi teknik ekibimiz karyolayı katınıza çıkarır, hastanızın odasında eksiksiz kurar ve elektrik bağlantılarını test eder.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 block">Kargo Kapıda Bırakmaz</span>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                    4
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">Kumanda Eğitimi &amp; Servis</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Refakatçiye sırt, ayak ve asansör açılarının kumandadan nasıl kontrol edileceği uygulamalı öğretilir. Süreç boyunca 7/24 teknik destek sağlanır.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 block">Birebir Kullanıcı Eğitimi</span>
              </div>
            </div>
          </div>

          {/* Kiralama vs Satın Alma Comparison Table */}
          <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-2xs space-y-6">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Doğru Karar Kılavuzu
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Kiralama mı Yoksa Sıfır Satın Alma mı Sizin İçin Uygun?
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider">
                    <th className="p-3.5 sm:p-4">Kriter</th>
                    <th className="p-3.5 sm:p-4 text-sky-400">MCARIS Aylık Kiralama</th>
                    <th className="p-3.5 sm:p-4 text-emerald-400">MCARIS Sıfır Satın Alma</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-800">
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-neutral-950">İdeal Tedavi Süresi</td>
                    <td className="p-3.5 sm:p-4 text-sky-900 font-semibold">1 - 3 Ay (Geçici nekahat, kalça/diz protezi)</td>
                    <td className="p-3.5 sm:p-4 text-emerald-900 font-semibold">6 Ay ve Üzeri (Kalıcı bakım, felç, ALS, demans)</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-neutral-950">Maliyet Avantajı</td>
                    <td className="p-3.5 sm:p-4 text-neutral-600">Düşük başlangıç maliyeti, aylık bütçe dostu</td>
                    <td className="p-3.5 sm:p-4 text-emerald-700 font-bold">Uzun vadede en ekonomik çözüm, tam mülkiyet</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-neutral-950">Hijyen &amp; Dezenfeksiyon Durumu</td>
                    <td className="p-3.5 sm:p-4 text-neutral-800">Hastane tipi medikal dezenfeksiyon yapılmış gövde</td>
                    <td className="p-3.5 sm:p-4 text-emerald-700 font-bold">%100 Fabrikadan yeni sıfır ürün</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-neutral-950">Garanti ve Teknik Servis</td>
                    <td className="p-3.5 sm:p-4 text-neutral-600">Kiralama süresince ücretsiz yerinde arıza desteği</td>
                    <td className="p-3.5 sm:p-4 text-emerald-700 font-bold">2 Yıl resmi yerinde garanti + 10 yıl parça güvencesi</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-neutral-950">Satın Almaya Saydırma</td>
                    <td className="p-3.5 sm:p-4 text-sky-800 font-bold">✅ Ödenen kira bedelleri liste fiyatından mahsup edilir</td>
                    <td className="p-3.5 sm:p-4 text-emerald-700 font-bold">✅ Doğrudan mülkiyet, ikinci elde değerini korur</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Featured Rental & Sales Bed Models */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Kiralık &amp; Satılık Popüler Modeller
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  Ankara İçi Hazır Stoktan Gün İçinde Teslim Edilen Karyolalar
                </h2>
              </div>
              <Link
                href="/kategori/hasta-yataklari"
                className="text-xs font-bold text-neutral-700 hover:text-black hover:underline"
              >
                Tüm Karyolaları İncele &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 2 Motorlu Card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-md inline-block">
                    2 Motorlu Standart
                  </span>
                  <h3 className="text-base font-bold text-neutral-900">2 Motorlu Full ABS Karyola</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Sırt ve ayak kaldırma fonksiyonu, bağımsız tabanca korkuluklar ve güçlü aktüatör motorlar. Kısa süreli nekahet için en ekonomik kiralık modeldir.
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Kiralık &amp; Satılık</span>
                  <Link
                    href="/kategori/2-motorlu-hasta-yataklari"
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                  >
                    Modelleri Gör &rarr;
                  </Link>
                </div>
              </div>

              {/* 3 Motorlu Card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md inline-block">
                    3 Motorlu Asansörlü
                  </span>
                  <h3 className="text-base font-bold text-neutral-900">3 Motorlu Asansörlü Karyola</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Dikey yükseklik ayarı sayesinde refakatçinin belini zorlamadan bakım ve pansuman yapmasını sağlar. Sürekli yatan hastalar için ideal konfigürasyon.
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Kiralık &amp; Satılık</span>
                  <Link
                    href="/kategori/asansorlu-3-motorlu-karyolalar"
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                  >
                    Modelleri Gör &rarr;
                  </Link>
                </div>
              </div>

              {/* 4 Motorlu Card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-2xs">
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md inline-block">
                    4 Motorlu Yoğun Bakım
                  </span>
                  <h3 className="text-base font-bold text-neutral-900">4 Motorlu Trendelenburg Karyola</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Trendelenburg ve Anti-Trendelenburg açıları, solunum rahatlatıcı kardiyak koltuk pozisyonu. Klinik yoğun bakım donanımını evinize taşır.
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500">Kiralık &amp; Satılık</span>
                  <Link
                    href="/kategori/4-motorlu-yogun-bakim-karyolalari"
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                  >
                    Modelleri Gör &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SSS Accordion Section */}
          <section className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Merak Edilen Sorular
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Hasta Yatağı Kiralama ve Satın Alma Hakkında Sıkça Sorulan Sorular
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {KIRALAMA_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70 open:bg-white open:border-neutral-300 transition-all"
                >
                  <summary className="font-bold text-xs sm:text-sm text-neutral-900 cursor-pointer flex items-center justify-between gap-3 list-none">
                    <span>{faq.question}</span>
                    <span className="text-neutral-400 group-open:rotate-180 transition-transform text-xs shrink-0">
                      ▼
                    </span>
                  </summary>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-2.5 border-t border-neutral-100 mt-2.5">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Quick CTA Box */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold">Kiralama veya Satın Alma İçin Danışın</h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                Ankara genelinde hazır stoklu ürünlerde aynı gün adrese teslimat, kata çıkarma ve anahtar teslim montaj yapıyoruz.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href={`tel:${BUSINESS_PHONE.replace(/\s+/g, "")}`}
                className="px-5 py-3 rounded-xl bg-white text-neutral-900 font-bold text-sm hover:bg-neutral-100 transition-colors"
              >
                Hemen Arayın: {BUSINESS_PHONE}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Merhaba, Ankara hasta yatağı kiralama prosedürü ve satın alma modelleri hakkında bilgi almak istiyorum.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20ba59] transition-colors inline-flex items-center gap-2"
              >
                WhatsApp ile Danışın
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
