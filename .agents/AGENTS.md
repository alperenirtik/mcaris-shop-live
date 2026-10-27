# MCaris Shop Workspace - Agent System Rules & Memory

Bu belge, Kling Digital standartları temel alınarak MCaris Shop e-ticaret ekosistemi için hazırlanmış birincil mühendislik ve mimari kural sistemidir.

---

## 1. Concentric Geometry & Layout Kuralları (KRİTİK)

Çift katmanlı kart sarmalayıcılarında (card wrappers) görsel kaymaları ve taşmaları önlemek için:
- **Boşluk Prensibi:** `rounded-[2rem]` kullanan dış çerçeveler `rounded-[1.75rem]` iç çerçeveler ve tam olarak `p-1` (4px) iç boşluk boşluğu kullanmalıdır. Standart kartlarda ise `rounded-xl` dış çerçeve için `rounded-lg` iç çerçeve ve `p-1` kullanılabilir.
- **Yükseklik Çakışması Önleme:** Eğer dış çerçeve bir flex konteyneri ise (`flex flex-col` veya `flex-row`) ve dolgusu (`p-1`, `p-2`) varsa, iç çerçeveye **ASLA** `h-full` (height: 100%) verilmez. İç çerçeve sadece `flex-1` kullanarak ebeveynin dolgu sınırları içinde doğal olarak uzamalıdır.

---

## 2. Kullanıcı Temel Kuralları (CRITICAL USER CORE RULES)

1. **Dürüstlük ve Teknik Doğruluk:** Kullanıcıyı memnun etmeye çalışmak veya sırf "evet" demek için geçici, sahte veya aldatıcı çözümler üretme.
2. **Boş İşlerden Kaçın:** Olmayacak bir şeyi oldurmaya çalışarak veya gerçekte sisteme fayda sağlamayan yüzeysel işler (fake work) yaparak vakit kaybetme.
3. **Doğruyu Savun ve Kökten Çöz:** İstenen işlem teknik olarak yanlışsa veya çalışmayacaksa bunu doğrudan ve açıkça belirt. Sorunu kökünden çözmek (örneğin veritabanı şemasını değiştirmek, doğru veri tipini modellemek) gerekiyorsa kolaya kaçıp (type casting `as any` vs. yaparak) etrafından dolanma; mimarinin ve mühendisliğin gerektirdiği doğru kök çözümü uygula.
4. **Kullanıcı Hitabı (MCaris):** Her yanıtta kullanıcıya doğrudan adıyla ("MCaris") hitap et. Bu durum hafızanın sıfırlanıp sıfırlanmadığının anlaşılmasını sağlar. Her yanıtta bu ismi kullanacaksın.
5. **Derinlemesine Doğrulama ve Bağlam Kontrolü:** Yalnızca linter ve build komutlarını çalıştırıp yeşil çıktı almakla işin bittiği veya hatasız olduğu ASLA varsayılamaz. Değişikliğin çalıştığı tüm akış, mantıksal bağlamlar, veri ilişkileri, çerez/oturum durumları, güvenlik manipülasyonları ve kenar durumları (edge cases) kökten incelenmeli ve tam olarak doğrulandıktan sonra başarı iddia edilmelidir. Birbirini etkileyen özellikler ve ortak alanlar da kontrol edilmelidir.
6. **Varsayım Yasak & Kanıta Dayalı Mühendislik (Zero Speculation):** Kod yazarken, kullanıcı niyetini yorumlarken veya hata ayıklarken asla varsayımlara dayanarak ezbere işlem yapılamaz. Emin olunmayan her noktada kod tabanı taranmalı, somut kanıt toplanmalı veya kullanıcıya doğrudan sorulmalıdır. Projeyi bozabilecek kör varsayımlar kesinlikle yasaktır.
7. **Her Zaman Seçilebilir ve Türkçe Soru Standardı:** Kullanıcıdan onay, tercih veya mimari karar alınması gereken tüm durumlarda sorular ASLA düz metinle açık uçlu bırakılamaz; her zaman `ask_question` aracı kullanılarak yapılandırılmış, seçenekli (seçilebilir) ve eksiksiz bir **Türkçe** dille yöneltilmelidir.

---

## 3. Katı Kod Kalitesi, Sıfır Ölü Kod ve Mimari Yasaklar

- **Sıfır Ölü Kod & Atıl Dosyalar:** Kullanılmayan importlar, ölü fonksiyonlar, yetim UI bileşenleri ve geçici scriptler projede barındırılamaz. Anında silinmelidir.
- **Sıfır Tip Kaçamağı (`as any`, `as unknown as X`, `@ts-ignore` KESİNLİKLE YASAKTIR):** TypeScript derleyicisini susturmak yasaktır. Tüm modeller, handler'lar ve view'lar katı TypeScript tipleri, Type Guard'lar (`(item): item is Type`) veya Zod şemaları ile tanımlanmalıdır.
- **Katı Prisma ORM ve Veritabanı Bütünlüğü:**
  - Prisma'nın ürettiği tipler (`Prisma.JsonValue`, model tipleri ve payload ilişkileri) doğrudan kullanılmalıdır. Sahte cast'ler (`prisma as unknown as PrismaClient`) yapılamaz.
  - Dinamik veriler (ürünler, kategoriler, siparişler, ayarlar, kuponlar) ilişkisel Prisma modellerinde tutulur.
  - Raw SQL sorgularında parametreli `prisma.$queryRaw` veya jenerik tipli `$queryRawUnsafe<T[]>` zorunludur. String concatenation yasaktır.
- **Otomatik Dev Server Yasağı:** AI Agent'ların arka planda otomatik olarak `npm run dev` çalıştırması yasaktır. Port çakışmalarını ve bellek sızıntılarını önlemek için geliştirici manuel başlatır.
- **Next.js & React 19 Kuralları:**
  - `useEffect` içinde senkron `setState` çağrıları render uyarılarına yol açar. Gerekli durumlarda microtask (`Promise.resolve().then(...)`) ve unmount/cleanup flag (`let active = true; return () => { active = false; }`) kullanılmalıdır.
  - Handler fonksiyonları `useCallback` ile stabilize edilmelidir.
- **Sıkı Zod Doğrulaması & Payload Sanitizasyonu:** Tüm API endpoint'leri (`POST`, `PUT`, `PATCH`, `DELETE`) ve Server Actions payload'ları Zod şemaları ile doğrulanmalıdır.
- **Next.js Revalidation Standartları:** Dinamik veri güncellendiğinde (ürün ekleme/düzenleme, stok değişimi vb.) `revalidatePath` veya `revalidateTag` tetiklenmelidir.
- **E-Ticaret Finansal Hesaplama Hassasiyeti:** Para, sepet tutarı, KDV, kargo ve indirim hesaplamalarında JavaScript float hatalarını engellemek için 2 basamaklı yuvarlama (`Math.round((val + Number.EPSILON) * 100) / 100`) ve kuruş bazlı hesaplama standarttır.
- **Form Idempotency & Çift Tıklama Engeli:** Sipariş tamamlama, ödeme ve form butonlarında `disabled={isPending || isSubmitting}` ile mükerrer işlem engellenir.
- **İyimser Güncelleme & Merkezi Bildirim (Toast):** `window.alert()` / `window.confirm()` kullanımı kesinlikle yasaktır; tüm bildirimler `sonner` üzerinden verilir.
- **Statik Kodlama Yasağı & Panelden Yönetilebilir Dinamik Veri:**
  - Kod içerisine gömülü (hardcoded) sahte/statik veri (SSS soruları, ürün donanımları, kategori SEO metinleri, bloglar, yorumlar, site ayarları, duyurular vb.) barındırılamaz.
  - Tüm içerikler PostgreSQL / Prisma modellerinde tutulmalı ve Admin Paneli (`/admin/...`) üzerinden yönetilebilir (Full CRUD) olmalıdır. Yeni bir veri türü geldiğinde `const DATA = [...]` yazmak yasaktır.
- **Kapsamlı E-Ticaret SEO & Yapılandırılmış Veri:**
  - Ürün donanım ve parametreleri (`specs`) Google JSON-LD şemasına `additionalProperty: PropertyValue` formatında eklenmelidir.
  - Teknik tablolarda (`SpecTable`) HTML5 Microdata (`itemScope`, `itemType="https://schema.org/PropertyValue"`, `itemProp="name"`, `itemProp="value"`) zorunludur.
  - Ürün galerisi ana görselinde `<figure itemProp="image" itemScope itemType="https://schema.org/ImageObject">` ve dinamik kategori bazlı `alt`/`title` kullanımı zorunludur. Tüm ürün görselleri diskte ürün slug'ı ile uyumlu semantik dosya adlarıyla tutulmalıdır.
- **Shadcn UI Standartları & AI-Generated Tasarım Karşıtı İlkeler (Strict Anti-AI Slop & Shadcn UI Calibration):**
  - **Yapay Süslemeler Yasaktır:** Bulanık pastel gradyan bulutları (`blur-3xl`, çok renkli mesh glow'lar), neon/pastel dumanlar, yapay noktalı/ızgara desenleri (`radial-gradient`) arayüze KESİNLİKLE EKLENEMEZ. Sitenin görsel dili; temiz, güven veren ve İsviçre grafik tasarım disiplinini benimseyen kurumsal medikal e-ticaret estetiğidir.
  - **Standart Tipografi ve Grid Disiplini:** Tailwind'in varsayılan font skalası (12px, 14px, 16px, 18px, 20px, 24px vb.) esastır. `13.5px`, `16.5px` gibi yapay ondalıklı piksel tanımlamaları yapılamaz.
  - **Ölçülü Köşe Yuvarlama (Radius) ve Keskin Kenarlıklar (Border):** Aşırı büyük veya çizgi film vari `rounded-[2rem]`, `rounded-[32px]` gibi yapay köşeler yerine; shadcn/ui standardı olan `--radius: 0.5rem` (8px), kartlarda `rounded-xl` (12px) veya `rounded-lg` (8px) ve mikro rozetlerde `rounded-md` (6px) kullanılır. Tüm çerçeveler keskin 1px `border-border` (Slate-200 / `#e2e8f0`) standardındadır.
  - **CSS Değişkenleri ve Semantik Renk Mimarisi (Shadcn Tokens):** Renkler doğrudan rastgele sınıflar yerine CSS değişkenleri ile tanımlanmış semantik tokenlar üzerinden yönetilir (`bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-muted`, `text-muted-foreground`, `border-border`, `ring-ring`). Ana palet: **Klinik Slate & Derin Medikal Lacivert (`#0f172a` / `#152a4a`)**, aksiyon için **Canlı Zümrüt Yeşili (`#25d366` / `#10b981`)**.
  - **Ortak İlkel UI Bileşenleri Zorunluluğu (`src/components/ui/`):** Butonlar, rozetler, kartlar ve form elemanları her sayfada 20 sınıflık rastgele Tailwind dizileriyle elle yazılamaz. `src/components/ui/button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`, `separator.tsx` gibi standart varyantlı ve erişilebilir shadcn ilkel bileşenleri kullanılır.
  - **`cn()` Yardımcı Fonksiyonu:** Sınıf birleştirmelerinde string concatenation veya template literal yerine `src/lib/utils.ts` içindeki `cn(...)` (`clsx` + `tailwind-merge`) kullanılır.
- **Görsel Yerleşimi ve object-cover Zorunluluğu (object-contain KESİNLİKLE YASAKTIR):** Ürün kartlarında (`ProductCard`), vitrin alanlarında (`HeroClient`), ürün detay galerilerinde (`ProductGallery`) ve küçük önizlemelerde (thumbnails) `object-contain` kullanımı ve görsellere iç boşluk (`p-*` padding) verilmesi KESİNLİKLE YASAKTIR. `object-contain` kullanımı e-ticaret vitrininde amatörce boşluklara (letterboxing), küçülmüş/havada asılı duran ürün kutularına ve görsel tutarsızlığa sebep olur. Tüm ürün görselleri çerçeveyi kenardan kenara dolduran `object-cover w-full h-full` standardı ile sergilenmelidir.
- **Harici Backlink Ağı & Script Enjeksiyonu Yasağı (Strict Link Scheme Prohibition):** `bck.js`, `seo.mcaris.com.tr` veya benzeri harici PBN/kardeş site backlink enjeksiyon scriptlerinin mağazaya eklenmesi KESİNLİKLE YASAKTIR. Google Arama Temelleri (SpamBrain & Link Schemes) politikalarına aykırı olan ve sitenin arama motoru ceza riskini (algoritmik/manuel ceza) tetikleyen yapay footer link ağları projede barındırılamaz.
- **Dekübitik Yatak Yaraları ve Havalı Yatak Ayrımı (Strict Pressure Ulcer & Air Mattress Rule):**
  - Uzun süre yatmaya bağlı kuyruk sokumu, topuk ve kürek kemiklerinde oluşan dekübitüs (bası/yatak) yaralarını doğrudan önleyen ve doku perfüzyonunu koruyan asıl medikal donanım **havalı yatak sistemleridir** (özellikle boru tipi, sıralı A+B hücre döngülü modeller).
  - Hasta karyolası ise hastaya oturma, beslenme, nefes alma ve reflüyü önleme pozisyonları sağlar; refakatçinin bakım ergonomisini kolaylaştırır ancak tek başına bası yarasını engelleyemez.
  - Sitede, bloglarda, ürün açıklamalarında veya SEO metinlerinde *"hasta karyolası yatak yarasını önler/bitirir"* gibi sahte ve yanıltıcı tıbbi iddialar KESİNLİKLE yazılamaz. Yatak yarası riskine karşı karyola ile birlikte mutlaka havalı yatak kullanımı önerilmelidir.
- **Sabit Motor Gücü ve Tork (6000N / Nm) Belirtme Yasağı (Strict Prohibition of Hardcoded Motor Force):**
  - Hasta karyolalarında motor itiş gücü (Newton / N) ve donanım özellikleri kullanılan motor markasına (T-Motion, Linak vb.), motor sayısına (2, 3, 4 motor) ve yatağın şasi tipine göre modelden modele değişiklik gösterir.
  - Kod tabanına, tablolara veya vitrin alanlarına ezbere "6000N", "6000Nm" gibi sabit motor güçleri yazılması KESİNLİKLE YASAKTIR. Standart kurumsal ifade: *"Güçlü ve fısıltı sessizliğinde çalışan lineer motor sistemleri"* veya *"Bağımsız elektrikli aktüatör motorlar"* şeklindedir.
- **Ayak Ucu Açısı ve Hareket Standartları (Footrest Articulation Rule):**
  - Hasta karyolalarının ayak ucu kaldırma açıları için ezbere yanlış açılar (örneğin sabit "30°-35°" veya uydurma dereceler) yazılamaz.
  - Standart kurumsal ifade: *"Kumanda kontrollü kademeli ayak ucu kaldırma"* veya modelin resmi teknik kataloğundaki kesin üretici verisidir.
- **Teslimat ve Montaj Sınırı (Sadece Ankara İçi Dahildir):** Adrese teslimat, kata çıkarma ve odaya montaj **SADECE Ankara ili sınırları içerisindeki siparişlerde fiyata dahildir**. Ankara dışına ve pazaryerlerinden (Trendyol, Hepsiburada vb.) şehir dışına giden tüm siparişlerde montaj imkanı kesinlikle yoktur; ürünler kargo/ambar ile sevk edilir, alıcı kendisi teslim alır, taşır ve kurar. Sitede "tüm Türkiye'ye montaj yapıyoruz" gibi operasyonel gerçek dışı vaatler verilemez.
- **Hasta Karyolası Kiralama & Satış Hibrit Modeli ve SGK Durumu (Strict Rental & Sales Hybrid Policy):**
  - **Kiralama ve Satış Hizmeti:** MCARIS Medikal hem 2 yıl garantili sıfır ürün satışı hem de özellikle kısa-orta vadeli nekahat dönemleri, geçici ameliyatlar (kalça/diz protezi, kırık vb.) ve geçici hasta bakımı için **Ankara genelinde profesyonel hasta karyolası kiralama hizmeti** sunmaktadır. Kiralama aramaları mağaza için yüksek organik trafik ve dönüşüm sağlayan birincil kanallardan biridir.
  - **Kiralama Standartları:** Kiralama hizmetinde hastane tipi medikal dezenfeksiyon, depozitosuz şeffaf sözleşme, **hazır stoklu modellerde Ankara genelinde aynı gün adrese teslimat**, kata çıkarma ve odaya montaj esastır.
  - **Satın Almaya Saydırma:** Kiralama süresi uzayan veya kalıcı bakıma geçen aileler için ödenen kira bedellerinin sıfır ürünün liste fiyatından mahsup edilerek satın almaya dönüştürülmesi avantajı sunulur.
  - **SGK Durumu:** Şirketin SGK ile kurumsal anlaşması, SUT geri ödeme desteği veya SGK danışmanlığı bulunmamaktadır. Bürokratik onaylar ve haftalarca süren bekleme süreleri yerine hastanın acil ihtiyacı doğrudan kiralama veya satın alma yoluyla çözülür. Sitede kullanıcıyı "SGK geri ödemesi / danışmanlığı" gibi sahte beklentilere sokacak içerik üretilemez.
- **Resmi Sertifikasyon ve ÜTS / EN 60601 Beyan Yasağı:** ÜTS firma tescil belgesi resmi olarak tamamlanana kadar sitede, rozetlerde, SEO şemalarında veya değişiklik kayıtlarında ÜTS kaydı ve EN 60601-2-52 standart iddiaları kesinlikle barındırılamaz. Mağaza CE uygunluğu, ISO 9001:2015 üretim sistemi, 2 yıl resmi garanti ve 10 yıl yedek parça desteği üzerine konumlandırılır.
- **Set Paketleri İptali ve Opsiyonel Donanım Standardı:** "Tam Teşekküllü Evde Hasta Bakım Paketleri" (`/kategori/evde-hasta-bakim-paketleri`) iptal edilmiştir; şilte, alez ve havalı yatak gibi aksesuarlar fiyata zorunlu gömülü değil, müşterinin talebine göre opsiyonel sunulur.
- **Değişiklik Kayıtları (Changelog) ve İş Odaklı Dil Standardı (KRİTİK):**
  - Yapılan her anlamlı geliştirme projedeki değişiklik kayıtları sistemine (`/degisiklik-kayitlari`) yansıtılır.
  - **Patron ve Yönetici Odaklı Sade Anlatım (Teknik Jargon YASAKTIR):** Değişiklik kayıtları teknik jargonla, dosya yollarıyla (`src/...`), kod parçacıklarıyla (`<g:mpn>`, `Zod`, `Promise`, `Schema.org` vb.) veya yazılım mühendisliği terimleriyle KESİNLİKLE YAZILAMAZ. Tüm maddeler doğrudan şirket patronunun, mağaza yöneticisinin veya müşterinin rahatça anlayacağı; **iş değerine**, **mağaza operasyonuna**, **katalog düzenine** ve **müşteri deneyimine** sağlanan somut faydaya odaklanan sade, anlaşılır ve kurumsal bir Türkçe ile kaleme alınmalıdır ("Hangi dosyayı/kodu yazdık?" yerine "İşletmede ve mağazada ne düzeldi, ne kazandık?").
  - **Canlı ve Tıklanabilir Tam URL Standartları (Mandatory Full URL Links):** Yenilenen, eklenen veya düzenlenen tüm sayfa, kategori, ürün, rehber veya karşılaştırma alanlarının altına yöneticinin ve müşterinin doğrudan tıklayıp canlı sonucu görebilmesi için ilgili rota/sayfa bağlantıları tam URL olarak (`links: [{ href: "https://shop.mcaris.com.tr/...", label: "..." }]`) hem değişiklik kayıtları (`/degisiklik-kayitlari`) kartlarının altına hem de rapor ve agent yanıtlarına eksiksiz eklenmelidir.
