import { prisma } from "@/lib/db";

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category: "Karyola & Modeller" | "Satış & Avantajlar" | "Teslimat & Montaj" | "Teknik Servis & Garanti" | "Ödeme & Faturalandırma" | "Kullanım & Hasta Bakımı" | string;
  order?: number;
  isActive?: boolean;
}

export const INITIAL_FAQS: FAQItem[] = [
  // 1. Karyola & Modeller (10 Soru)
  {
    category: "Karyola & Modeller",
    question: "2, 3 ve 4 motorlu hasta karyolaları arasındaki temel farklar nelerdir?",
    answer:
      "2 motorlu karyolalar sırt (0°-85°) ve ayak ucu (0°-45°) açılarını kumandayla bağımsız ayarlar; temel oturma ve beslenme için idealdir. 3 motorlu karyolalar buna ek olarak asansör motoruyla yatağın komple yüksekliğini (45 cm - 90 cm) indirip kaldırarak refakatçinin eğilmeden pansuman ve bakım yapmasını sağlar. 4 motorlu yoğun bakım modelleri ise tüm bunlara ilaveten Trendelenburg ve Ters Trendelenburg (açılı eğim) fonksiyonlarıyla tansiyonu dengelemeye, solunumu rahatlatmaya ve akciğer drenajına destek olur.",
    order: 1,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Hasta karyolalarında kullanılan motorların gücü ve kalitesi nasıl belirlenir?",
    answer:
      "Hasta karyolalarında motor itiş gücü ve donanım özellikleri yatağın motor sayısına, asansör mekanizmasına ve taşıma kapasitesine bağlı olarak modelden modele değişir. MCARIS Medikal karyolalarında aşırı ısınma korumalı, fısıltı sessizliğinde çalışan ve yüksek taşıma direncine sahip güvenli medikal lineer aktüatör motorlar tercih edilir.",
    order: 2,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Hasta yatağının motoru elektrik kesildiğinde çalışır mı?",
    answer:
      "Evet. Tüm MCARIS motorlu karyolalarımızın kontrol ünitelerinde 9V acil durum yedek pil desteği ve motor şaftlarında manuel indirme pimi yer alır. Elektrik kesintisi durumunda kumandadaki acil durum butonuyla yatak güvenli bir şekilde yatay düz konuma getirilebilir.",
    order: 3,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Karyola şasisi metal mi yoksa plastik mi olmalı, et kalınlığı nedir?",
    answer:
      "Karyolanın ana taşıyıcı iskeleti kesinlikle et kalınlığı en az 1.5 - 2 mm olan yüksek dayanımlı çelik profilden üretilmeli ve paslanmaya karşı 200°C elektrostatik fırın toz boyayla kaplanmalıdır. Başlıklar ve korkuluklar ise darbeye dayanıklı, silinebilir anti-bakteriyel ABS veya hafif alüminyum malzemeden üretilmelidir.",
    order: 4,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Hasta yataklarında ABS başlık ve alüminyum korkuluk neden tercih edilmelidir?",
    answer:
      "ABS plastik başlıklar hafif, dezenfektanlara dirençli, paslanmaz ve kolay silinebilir özelliktedir. Alüminyum tabanca korkuluklar ve 4 parça ABS bağımsız korkuluklar ise tek elle mandalından pratikçe açılıp kapanabilir; hastanın istemsizce yataktan düşmesini veya kaymasını %100 oranında engellerken ferah bir görüş alanı sunar.",
    order: 5,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Yatak başlıkları neden sökülebilir mandallı sistem olmalıdır?",
    answer:
      "Acil tıbbi müdahale gerektiren durumlarda (kalp masajı, aspirasyon, solunum tüpü müdahalesi) sağlık personelinin baş ucundan hastaya doğrudan ulaşabilmesi şarttır. Ayrıca hastanın saç yıkama, yatak içi banyo veya transfer işlemlerinde başlığın saniyeler içinde çıkarılabilmesi bakım veren kişiye geniş bir hareket serbestliği sağlar.",
    order: 6,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Yatak sırt kısmı ve ayak ucu hareket açıları nasıldır?",
    answer:
      "Karyolalarımızın sırt açısı ergonomik el kumandasıyla dikleşerek hastanın rahat yemek yemesini, oturmasını ve nefes darlığını hafifletmesini sağlar. Ayak ucu ise kumandayla kademeli olarak kaldırılarak bacaklardaki kan dolaşımını destekler ve ödem oluşumunu azaltmaya yardımcı olur.",
    order: 7,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Hastamın kilosu çok yüksek (obez), standart karyolalar taşır mı?",
    answer:
      "Standart karyolalarımız 150-180 kg güvenli çalışma yüküne sahiptir. 150 kg üzerindeki kilolu ve obez hastalarımız için şasisi 2.5 mm çelikle güçlendirilmiş, çift pistonlu motorlarla donatılmış ve yatak genişliği 110-120 cm olan Bariatrik Ağır Bakım Karyolaları tercih edilmelidir.",
    order: 8,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Ev tipi ahşap baza görünümlü hasta karyolalarının avantajları nelerdir?",
    answer:
      "Burmeier Dali ve MCARIS Platinum gibi ahşap kaplama modeller, hastane odası psikolojisini ortadan kaldırarak ev mobilyası sıcaklığı sunar. Hastanın psikolojik moralini ve iyileşme motivasyonunu yükseltirken, gizli motor mekanizmaları sayesinde tüm profesyonel 4 motorlu yoğun bakım hareketlerini eksiksiz yerine getirir.",
    order: 9,
    isActive: true,
  },
  {
    category: "Karyola & Modeller",
    question: "Katlanabilir hasta bakım yatağı ne zaman ve neden tercih edilir?",
    answer:
      "Dar oda kapıları, dönüşü zor asansörsüz apartman merdivenleri veya dönemsel olarak odadan odaya taşınması gereken durumlarda katlanabilir kompakt şaseli modeller tercih edilir. Bu modeller taşıma kolaylığı sunarken işlev ve motor gücü bakımından sabit karyolalarla aynı performansı sunar.",
    order: 10,
    isActive: true,
  },

  // 2. Satış & Avantajlar (9 Soru)
  {
    category: "Satış & Avantajlar",
    question: "Hasta yatağı kiralama hizmetiniz var mı?",
    answer:
      "Evet. MCARIS Medikal olarak Ankara genelinde geçici ameliyatlar ve kısa-orta vadeli nekahet dönemleri için hastane tipi medikal dezenfeksiyon yapılmış hasta yatağı kiralama hizmeti sunuyoruz. Hazır stoklu modellerimizde depozitosuz olarak aynı gün adrese teslimat ve kata montaj yapılır. Ayrıca ödenen kira bedelleri istenirse sıfır ürünün liste fiyatından mahsup edilerek satın almaya saydırılabilir.",
    order: 11,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "Hasta karyolası kiralamak yerine neden sıfır satın almalıyım?",
    answer:
      "Birkaç aylık kiralama bedeli neredeyse sıfır bir hasta yatağının maliyetine ulaşmaktadır. Kiralık yataklarda önceki hastaların enfeksiyon ve bakteri bulaşma riski bulunurken; sıfır yatak satın aldığınızda 2 yıl resmi yerinde servis garantisi, sıfır motor ömrü ve kullanım bittiğinde ikinci elde yeniden satabilme veya bağışlama hakkına sahip olursunuz.",
    order: 12,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "Kiralık ve ikinci el hasta yataklarının hijyen riskleri nelerdir?",
    answer:
      "Hasta yatakları ter, idrar, kan ve vücut sıvılarına maruz kalabilen hassas medikal ekipmanlardır. Yüzeysel temizlik yatak profillerine ve motor mekanizmalarına sızan patojenleri tamamen yok edemez. Hastanızın bağışıklık sistemini korumak için doğrudan sıfır, ambalajlı ve açılmamış ürün kullanımı tıbben önerilir.",
    order: 13,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "İkinci el hasta yatağı satın almak neden risklidir?",
    answer:
      "İkinci el yataklarda motor dişlilerinin ömrünü tamamlamış olması, elektrik tesisatındaki gizli arızalar ve emniyet mandallarının aşınması hastanızı yarı yolda bırakabilir. Ayrıca kurumsal fatura, yedek parça temini ve resmi 2 yıl yerinde servis garantisi bulunmaz.",
    order: 14,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "Doğrudan üreticiden satın almanın avantajları nelerdir?",
    answer:
      "Aracı komisyonları olmadan en rekabetçi fabrika fiyatlarıyla alışveriş yaparsınız. Ankara merkezli showroom ve üretim ağımız sayesinde gün içinde adrese teslimat, kata çıkarma ve anahtar teslim kurulum avantajından faydalanırsınız.",
    order: 15,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "Hasta yatağı siparişlerinde teslimat, kurulum ve aksesuarlar nasıl işler?",
    answer:
      "Ankara içi tüm karyola siparişlerinde kendi servis araçlarımızla kata çıkarma ve hasta odasına anahtar teslim montaj fiyata dahildir; şehir dışı siparişlerde ise güvenli kargo ile sevk edilir. Hastanızın durumuna göre medikal şilte, boru tipi havalı yatak ve serum askısı gibi aksesuarlar siparişe opsiyonel olarak eklenebilir.",
    order: 16,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "Satın alma sonrası hastamız iyileştiğinde yatağı ne yapabiliriz?",
    answer:
      "MCARIS ürünleri yüksek kaliteli profil ve güçlü motorlara sahip olduğundan ikinci el piyasasında değerini çok iyi korur. İhtiyacınız sona erdiğinde yatağı kolayca satabilir veya ihtiyacı olan başka bir hasta yakınına bağışlayabilirsiniz.",
    order: 17,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "Hasta yatağı satın alırken resmi fatura düzenleniyor mu?",
    answer:
      "Evet. Tüm satış işlemlerimizde T.C. Maliye Bakanlığı onaylı kurumsal e-Fatura veya şahıs adına e-Arşiv fatura ve 2 yıl resmi garanti belgesi düzenlenmektedir.",
    order: 18,
    isActive: true,
  },
  {
    category: "Satış & Avantajlar",
    question: "Refakatçi için yatak veya dinlenme koltuğu satın alınabilir mi?",
    answer:
      "Evet. Hastanın yanında 7/24 nöbet tutan refakatçiler için yerden tasarruf sağlayan katlanabilir refakatçi karyolaları ve medikal dinlenme koltuklarımız mevcuttur.",
    order: 19,
    isActive: true,
  },

  // 3. Teslimat & Montaj (7 Soru)
  {
    category: "Teslimat & Montaj",
    question: "Ankara içi teslimat ne kadar sürer ve nakliye ücretli midir?",
    answer:
      "Ankara genelinde 25 ilçenin tamamında (Çankaya, Yenimahalle, Keçiören, Etimesgut, Mamak, Sincan, Gölbaşı vb.) kendi medikal lojistik araçlarımızla GÜN İÇİNDE teslimat ve montaj yapıyoruz. Nakliye, kata çıkarma ve oda içi montaj tamamen ÜCRETSİZDİR.",
    order: 20,
    isActive: true,
  },
  {
    category: "Teslimat & Montaj",
    question: "Ankara'nın hangi ilçelerine aynı gün teslimat hizmetiniz var?",
    answer:
      "Merkez ilçelerimiz (Çankaya, Keçiören, Yenimahalle, Mamak, Etimesgut, Sincan, Altındağ, Pursaklar, Gölbaşı) başta olmak üzere Polatlı, Beypazarı, Kahramankazan, Çubuk, Elmadağ, Akyurt ve diğer tüm ilçelere aynı gün randevulu sevkiyat ve montaj sağlıyoruz.",
    order: 21,
    isActive: true,
  },
  {
    category: "Teslimat & Montaj",
    question: "Karyola kurulumunu kim yapıyor, hasta yakınlarına eğitim veriliyor mu?",
    answer:
      "Kurulumu MCARIS Medikal'in kendi kadrolu, sertifikalı teknik personelleri gerçekleştirir. Yatak istenilen odaya taşınır, kurulur, tüm fonksiyonları test edilir ve hasta yakınlarına kumanda kullanımı, acil indirme pimi, korkuluk kilitleri ve bakım kuralları uygulamalı olarak anlatılır.",
    order: 22,
    isActive: true,
  },
  {
    category: "Teslimat & Montaj",
    question: "Hasta bakım yatağının montajı evde ne kadar sürer?",
    answer:
      "Modüler ve pratik tasarımlı karyolalarımızın montajı, elektrik bağlantıları ve fonksiyon testleri deneyimli teknisyenlerimiz tarafından ortalama 15-20 dakika içinde tamamlanarak hasta yatışına hazır hale getirilir.",
    order: 23,
    isActive: true,
  },
  {
    category: "Teslimat & Montaj",
    question: "Apartman asansörü dar veya yoksa karyola eve nasıl çıkarılır?",
    answer:
      "Lojistik ekiplerimiz iki veya üç kişilik teknik kadrolarla sevk edilir. Karyolalarımız modüler demonte edilebildiği için dar kapılardan ve asansörsüz dik merdivenlerden duvara veya mobilyalara zarar vermeden güvenle kata çıkarılır.",
    order: 24,
    isActive: true,
  },
  {
    category: "Teslimat & Montaj",
    question: "Hasta yatağı odada prize uzak bir yere kurulabilir mi?",
    answer:
      "Evet. Karyolalarımızın elektrik besleme kabloları standart olarak uzundur; ayrıca montaj ekiplerimiz ihtiyaç halinde akım korumalı kaliteli uzatma kabloları ile güvenli elektrik bağlantısını sağlar.",
    order: 25,
    isActive: true,
  },
  {
    category: "Teslimat & Montaj",
    question: "Hafta sonu veya tatil günlerinde acil teslimat yapıyor musunuz?",
    answer:
      "Evet. Hastaneden acil taburculuk veya beklenmedik cerrahi operasyon durumlarında Cumartesi ve Pazar günleri dahil olmak üzere haftanın 7 günü nöbetçi teknik sevkiyat araçlarımız hizmet vermektedir.",
    order: 26,
    isActive: true,
  },

  // 4. Teknik Servis & Garanti (7 Soru)
  {
    category: "Teknik Servis & Garanti",
    question: "Hasta karyolalarının garanti süresi ve kapsamı nedir?",
    answer:
      "Satın alınan tüm MCARIS hasta karyolaları 2 YIL YERİNDE SERVİS GARANTİSİ ve 10 YIL YEDEK PARÇA TEMİN GARANTİSİ altındadır. Motor, kontrol kutusu, el kumandası, şasi kaynağı ve hareketli makas sistemleri garanti kapsamındadır.",
    order: 27,
    isActive: true,
  },
  {
    category: "Teknik Servis & Garanti",
    question: "Satın alınan hasta yatağı bozulursa teknik servis süreci nasıl işler?",
    answer:
      "Herhangi bir arıza durumunda teknik servis hattımıza bildirim yaptığınızda, Ankara içinde randevulu olarak gün içinde, çevre illerde ise planlanan en kısa sürede gezici teknik servisimiz adresinize ulaşır. Arıza yerinde giderilir; parça beklenmesi gereken durumlarda yatak anında yenisiyle birebir değiştirilir.",
    order: 28,
    isActive: true,
  },
  {
    category: "Teknik Servis & Garanti",
    question: "Hasta yataklarında zamanla gıcırtı oluşursa nasıl önlenir?",
    answer:
      "Gıcırtı sesleri metal eklem noktalarının zamanla yağsız kalmasından kaynaklanabilir. 6 ayda bir hareketli makas mafsallarına ve motor pim yuvalarına sprey beyaz gres veya medikal silikon yağlayıcı sıkılarak sesler tamamen kesilebilir. MCARIS karyolaları kendinden burçlu yağsız sürtünme mafsallarıyla donatılmıştır.",
    order: 29,
    isActive: true,
  },
  {
    category: "Teknik Servis & Garanti",
    question: "Medikal yatak kumandasına sıvı kaçarsa veya kablosu koparsa ne yapılmalıdır?",
    answer:
      "Kumandalarımız IPX4 sıvı sıçramalarına karşı korumalıdır. Ancak yoğun çorba, su veya ilaç dökülmesi durumunda derhal fişi çekip kumandayı kurulayınız. Kablo ezilmesi veya tuş arızalarında teknik servisimizden hızla yedek kumanda temin edebilirsiniz.",
    order: 30,
    isActive: true,
  },
  {
    category: "Teknik Servis & Garanti",
    question: "Karyola motorları çok gürültü yapar mı, gece uykusunu böler mi?",
    answer:
      "Kesinlikle hayır. Modellerimizde kullanılan lineer pistonlu motorlar fısıltı sessizliğinde (45 desibelin altında) çalışır. Gece pozisyon değiştirirken ne hastayı ne de odadaki refakatçiyi rahatsız etmez.",
    order: 31,
    isActive: true,
  },
  {
    category: "Teknik Servis & Garanti",
    question: "Garanti süresi (2 yıl) dolduktan sonra yedek parça ve servis desteği sürer mi?",
    answer:
      "Evet. 10 yıl boyunca motor, kumanda, tekerlek, başlık, korkuluk ve şasi aksamları için orijinal yedek parça stoğu bulundurma garantimiz vardır. Garanti sonrasında da uygun maliyetli servis hizmetimiz devam eder.",
    order: 32,
    isActive: true,
  },
  {
    category: "Teknik Servis & Garanti",
    question: "Hastane yatağı tekerlekleri parke ve seramik zeminlere zarar verir mi?",
    answer:
      "Hayır. Tekerleklerimiz 360 derece dönebilen, medikal kauçuk kaplamalı ve zemin çizmez özelliktedir. Laminat parke, masif ahşap veya seramik zeminlerde leke bırakmaz ve sarsıntısız kayma sağlar.",
    order: 33,
    isActive: true,
  },

  // 5. Ödeme & Faturalandırma (7 Soru)
  {
    category: "Ödeme & Faturalandırma",
    question: "MCARIS Medikal olarak SGK anlaşmanız veya SGK geri ödeme desteğiniz var mı?",
    answer:
      "MCARIS Medikal olarak SGK anlaşmamız bulunmamaktadır. Şirketimiz doğrudan birinci elden satış yapan bağımsız bir üretici ve medikal e-ticaret kuruluşudur. Bürokratik onaylar, heyet raporu kuyrukları ve haftalarca süren bekleme süreleri yerine doğrudan fabrikadan birinci elden sıfır ürün satışı ve aynı gün teslimat gerçekleştirilmektedir.",
    order: 34,
    isActive: true,
  },
  {
    category: "Ödeme & Faturalandırma",
    question: "Fatura ve resmi garanti belgeleri nasıl düzenlenir?",
    answer:
      "Tüm satış işlemlerimizde T.C. Maliye Bakanlığı onaylı kurumsal e-Fatura veya e-Arşiv faturası düzenlenir. Faturanız teslimat esnasında sisteminize ve e-posta adresinize resmi garanti belgesiyle birlikte ulaştırılır.",
    order: 35,
    isActive: true,
  },
  {
    category: "Ödeme & Faturalandırma",
    question: "Banka havalesi veya FAST ile ödemelerde indirim uygulanıyor mu?",
    answer:
      "Evet. Siparişinizi web sitemiz üzerinden veya doğrudan çağrı merkezimizden havale/EFT/FAST seçeneği ile oluşturduğunuzda net %5 nakit ödeme indirimi uygulanmaktadır.",
    order: 36,
    isActive: true,
  },
  {
    category: "Ödeme & Faturalandırma",
    question: "Kurumsal firmalar ve sağlık kuruluşları için toplu alım faturası kesiliyor mu?",
    answer:
      "Evet. Özel hastaneler, tıp merkezleri, bakım evleri ve klinikler için kurumsal VKN bilgileriyle KDV dahil toplu alım e-Faturası düzenlenmektedir.",
    order: 37,
    isActive: true,
  },
  {
    category: "Ödeme & Faturalandırma",
    question: "Hangi ödeme yöntemleri geçerlidir, kapıda ödeme var mı?",
    answer:
      "Teslimat ve montaj anında kapıda nakit, tüm banka kartlarıyla POS cihazından tek çekim veya taksitli ödeme ile banka havalesi / FAST seçeneklerimiz geçerlidir.",
    order: 38,
    isActive: true,
  },
  {
    category: "Ödeme & Faturalandırma",
    question: "Kredi kartına taksit imkanı sunuluyor mu?",
    answer:
      "Evet. Anlaşmalı tüm banka ve kredi kartlarına (Bonus, Maximum, World, Axess, Paraf, CardFinans) web sitemiz üzerinden veya kapıda mobil POS ile vade farksız taksit imkanı sunulmaktadır.",
    order: 39,
    isActive: true,
  },
  {
    category: "Ödeme & Faturalandırma",
    question: "Faturalar şirket veya şahıs adına kesilebilir mi?",
    answer:
      "Evet. Tüm satış işlemlerimizde şahıs TC kimlik numarasına e-Arşiv veya kurumsal şirket bilgilerine e-Fatura düzenlenmektedir.",
    order: 40,
    isActive: true,
  },

  // 6. Kullanım & Hasta Bakımı (9 Soru)
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Boru tipi havalı yatak neden baklava tipinden çok daha etkilidir?",
    answer:
      "Baklava tipi havalı yataklar yalnızca yüzeysel hava akışı sağlar ve 1. evre bası riskinde kalır. Boru tipi havalı yataklar ise sıralı (A+B / A+B+C) bağımsız tüp hücre yapısıyla hastanın altındaki basınç noktalarını sürekli değiştirir, mikro hava üfleme (ventilasyon) delikleriyle cildi kuru tutar ve yatak yaralarını %90'a varan oranda önler.",
    order: 41,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Havalı yatağın kompresör motoru 24 saat kesintisiz çalışmalı mı?",
    answer:
      "Kesinlikle evet. Havalı yatak motoru fişten çekilir veya kapatılırsa borulardaki hava kısa sürede boşalır ve hasta doğrudan sert süngere temas ederek bası yarası riskine maruz kalır. Motorlarımız 7/24 kesintisiz çalışmaya uygun, enerji tasarruflu ve aşırı ısınma korumalı kompresör teknolojisine sahiptir.",
    order: 42,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Yatak yarası (dekübitüs / bası yarası) belirtileri nelerdir ve evde nasıl önlenir?",
    answer:
      "Kuyruk sokumu, topuklar, kalça ve kürek kemiklerinde kalıcı kızarıklık, ciltte ısı artışı ve hassasiyet ilk evre belirtileridir. Önlemek için mutlaka boru tipi havalı yatak kullanılmalı, hasta karyolası hareketleriyle günde en az 2 saatte bir pozisyon değiştirilmeli, cilt kuru tutulmalı ve bariyer kremler uygulanmalıdır.",
    order: 43,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Trendelenburg ve Anti-Trendelenburg pozisyonu hangi klinik durumlarda kullanılır?",
    answer:
      "Trendelenburg (ayaklar yukarıda, baş aşağıda) şok ve tansiyon düşmelerinde hayati organlara kan akışını artırmak için uygulanır. Anti-Trendelenburg (baş yukarıda, ayaklar eğimli) ise solunum sıkıntısı çeken, reflü yaşayan ve yatakta dik oturamayan yoğun bakım hastalarında göğüs kafesini rahatlatmak için doktor kontrolünde kullanılır.",
    order: 44,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Asansör (yükseklik ayarı) özelliği refakatçinin sağlığına nasıl katkı sağlar?",
    answer:
      "Yatak bel hizasına yükseltildiğinde hasta yakını veya bakıcı eğilmek zorunda kalmaz; bu da bakım verenlerde sıkça rastlanan bel fıtığı, kas spazmı ve boyun düzleşmesi gibi mesleki rahatsızlıkları engeller. Yatak indirildiğinde ise hastanın tekerlekli sandalyeye geçişi çok kolaylaşır.",
    order: 45,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Yatak şiltesi neden CNC lazer kesim kanallı medikal sünger olmalıdır?",
    answer:
      "Motorlu karyolalarda yatak 4 parçalı olarak katlandığı için sıradan yaylı veya sert süngerler kırılır ve motoru zorlar. Lazer kesim kanallı medikal şilteler karyolanın hareket açılarına kusursuz esner, vücut ağırlığını dengeler ve hava sirkülasyonu sağlayarak terlemeyi önler.",
    order: 46,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Yatağa bağımlı hastanın banyosu yatak içinde nasıl yaptırılır?",
    answer:
      "Sökülebilir mandallı ABS başlıklar ve korkuluklar indirildikten sonra, yatak üzerine özel su tahliyeli şişme 'Yatak İçi Banyo Seti' yerleştirilir. Karyolanın baş ve ayak ayarlarıyla hafif açı verilerek motorlu aksama su temas ettirmeden hastanın saç ve vücut banyosu konforla yaptırılabilir.",
    order: 47,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Hasta yatağının tekerlek kilitleri ve yan korkulukları neden hayati önemdedir?",
    answer:
      "Hasta yataktan kalkarken veya pozisyon değiştirirken yatağın kayması sonucu meydana gelen düşmeler ciddi kırıklara yol açabilir. Çapraz veya merkezi tekerlek kilitleri yatağı zemine sabitler; kilitlenebilir yan korkuluklar ise özellikle gece saatlerinde bilinç bulanıklığı yaşayan hastaların düşmesini tamamen önler.",
    order: 48,
    isActive: true,
  },
  {
    category: "Kullanım & Hasta Bakımı",
    question: "Serum askısı ve yatak üstü yemek masası karyolaya nasıl monte edilir?",
    answer:
      "Karyolalarımızın 4 köşesinde de standart serum askısı soketleri bulunur; askıyı takıp vidasını sıkmanız yeterlidir. Yatak üstü amortisörlü yemek masaları ise tekerlekli ayaklarıyla karyolanın altına girerek istenen yüksekliğe tek hareketle ayarlanabilir.",
    order: 49,
    isActive: true,
  },
];


export const FAQ_DATA = INITIAL_FAQS;

async function syncFaqsIfMissing(): Promise<void> {
  try {
    const existing = await prisma.faq.findMany({ select: { question: true } });
    const existingQuestions = new Set(existing.map((e) => e.question.trim().toLowerCase()));

    const missing = INITIAL_FAQS.filter(
      (item) => !existingQuestions.has(item.question.trim().toLowerCase())
    );

    if (missing.length > 0) {
      for (const item of missing) {
        await prisma.faq.create({
          data: {
            question: item.question,
            answer: item.answer,
            category: item.category,
            order: item.order ?? 0,
            isActive: true,
          },
        });
      }
    }
  } catch (error) {
    console.error("syncFaqsIfMissing error:", error);
  }
}

export async function getFaqs(): Promise<FAQItem[]> {
  try {
    const count = await prisma.faq.count();
    if (count < INITIAL_FAQS.length) {
      await syncFaqsIfMissing();
    }

    const items = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return items.map((i) => ({
      id: i.id,
      question: i.question,
      answer: i.answer,
      category: i.category,
      order: i.order,
      isActive: i.isActive,
    }));
  } catch (error) {
    console.error("getFaqs error:", error);
    return INITIAL_FAQS;
  }
}

export async function getAllFaqsForAdmin() {
  try {
    const count = await prisma.faq.count();
    if (count < INITIAL_FAQS.length) {
      await syncFaqsIfMissing();
    }

    return await prisma.faq.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("getAllFaqsForAdmin error:", error);
    return [];
  }
}

