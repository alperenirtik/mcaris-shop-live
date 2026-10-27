# MCaris Shop - AI Agent Entry Point & Kodlama Standartları

> ⚠️ **KRİTİK UYARI:**
> Bu belge ve `.agents/` kütüphanesi MCaris Shop projesinin **Tek Doğruluk Kaynağıdır (Single Source of Truth)**. 
> Kling Digital standartlarından türetilmiş olup, bu depoda görev alan tüm yapay zeka agent'ları için bağlayıcıdır.

---

## 1. KULLANICI TEMEL KURALLARI (USER CORE RULES - CRITICAL)

1. **Dürüstlük ve Teknik Doğruluk:** Kullanıcıyı memnun etmeye çalışmak veya sırf "evet" demek için geçici, sahte veya aldatıcı çözümler üretme.
2. **Boş İşlerden Kaçın:** Olmayacak bir şeyi oldurmaya çalışarak veya gerçekte sisteme fayda sağlamayan yüzeysel işler (fake work) yaparak vakit kaybetme.
3. **Doğruyu Savun ve Kökten Çöz:** İstenen işlem teknik olarak yanlışsa veya çalışmayacaksa bunu doğrudan ve açıkça belirt. Sorunu kökünden çözmek (örneğin veritabanı şemasını değiştirmek, doğru veri tipini modellemek) gerekiyorsa kolaya kaçıp (type casting `as any` vs. yaparak) etrafından dolanma; mimarinin ve mühendisliğin gerektirdiği doğru kök çözümü uygula.
4. **Kullanıcı Hitabı (MCaris):** Her yanıtta kullanıcıya doğrudan adıyla ("MCaris") hitap et. Bu durum hafızanın sıfırlanıp sıfırlanmadığının anlaşılmasını sağlar. Her yanıtta bu ismi kullanacaksın.
5. **Derinlemesine Doğrulama ve Bağlam Kontrolü:** Yalnızca linter ve build komutlarını çalıştırıp yeşil çıktı almakla işin bittiği veya hatasız olduğu ASLA varsayılamaz. Değişikliğin çalıştığı tüm akış, mantıksal bağlamlar, veri ilişkileri, çerez/oturum durumları, güvenlik manipülasyonları ve kenar durumları (edge cases) kökten incelenmeli ve tam olarak doğrulandıktan sonra başarı iddia edilmelidir. Birbirini etkileyen özellikler ve ortak alanlar da kontrol edilmelidir.
6. **Varsayım Yasak & Kanıta Dayalı Mühendislik (Zero Speculation):** Kod yazarken, kullanıcı niyetini yorumlarken veya hata ayıklarken asla varsayımlara dayanarak ezbere işlem yapılamaz. Emin olunmayan her noktada kod tabanı taranmalı, somut kanıt toplanmalı veya kullanıcıya doğrudan sorulmalıdır. Projeyi bozabilecek kör varsayımlar kesinlikle yasaktır.
7. **Her Zaman Seçilebilir ve Türkçe Soru Standardı:** Kullanıcıdan onay, tercih veya mimari karar alınması gereken tüm durumlarda sorular ASLA düz metinle açık uçlu bırakılamaz; her zaman `ask_question` aracı kullanılarak yapılandırılmış, seçenekli (seçilebilir) ve eksiksiz bir **Türkçe** dille yöneltilmelidir.

---

## 2. KATI MİMARİ VE KOD KALİTESİ KURALLARI (STRICT ARCHITECTURAL CONSTRAINTS)

- **Sıfır Ölü Kod (Zero Dead Code):** Kullanılmayan importlar, atıl bileşenler/fonksiyonlar, yetim dosyalar ve geçici test/scratch scriptleri projede barındırılamaz. İşi biten her geçici kod anında temizlenmelidir.
- **Sıfır Tip Kaçamağı (`as any`, `as unknown as X`, `@ts-ignore` KESİNLİKLE YASAKTIR):** Tip denetleyicisini susturmak için cast yapılamaz. Tüm veri yapıları açık tiplerle, runtime Type Guard'lar (`(x): x is Type`) veya Zod şemaları ile doğrulanmalıdır.
- **Prisma ORM ve Veritabanı Bütünlüğü:** 
  - Prisma'nın ürettiği tipler (`Prisma.JsonValue`, model tipleri) doğrudan kullanılmalıdır. Sahte cast'ler (`prisma as unknown as PrismaClient`) yapılamaz.
  - SQL sorgularında parametreli `prisma.$queryRaw` veya jenerik tipli `$queryRawUnsafe<T[]>` zorunludur. String birleştirme ile SQL oluşturulamaz.
  - N+1 sorgu problemi önlenmeli, ilişkili veriler döngü içinde değil `include` veya `select` ile çekilmelidir. İlgili indeksler (`@@index`) şemada tanımlanmalıdır.
- **Otomatik Dev Server Yasağı:** AI Agent'ların arka planda otomatik olarak `npm run dev` başlatması KESİNLİKLE YASAKTIR. Bu durum port kilitlenmelerine ve bellek tükenmesine sebep olur. Geliştirme sunucusunu yalnızca geliştirici manuel başlatır.
- **React 19 & Next.js 16 Uyumluluğu:**
  - `useEffect` içinde senkron `setState` çağrıları render uyarılarına yol açar. Gerekli durumlarda microtask (`Promise.resolve().then(...)`) ve unmount/cleanup flag (`let active = true; return () => { active = false; }`) kullanılmalıdır.
  - Yeniden oluşturulmayı önlemek için handler'lar `useCallback` ile sarmalanmalıdır.
- **Zod Doğrulaması & Girdi Sanitizasyonu:** Tüm API route'larında (`POST`, `PUT`, `PATCH`, `DELETE`) ve Server Action çağrılarında gelen kullanıcı verileri Zod şemaları ile sıkı şekilde doğrulanmalı ve sanitize edilmelidir.
- **Next.js Revalidation Standartları:** Admin panelinde veya sistem genelinde dinamik veri güncellendiğinde (ürün, kategori, sipariş durumu, ayar vb.) ilgili sayfalar anında `revalidatePath` veya `revalidateTag` ile tazelenmelidir.
- **Güvenlik & Sır İzolasyonu:** `DATABASE_URL`, `JWT_SECRET`, API anahtarları vb. hassas ortam değişkenleri yalnızca sunucu tarafında okunabilir; istemciye (`NEXT_PUBLIC_` harici) sızdırılamaz.
- **Finansal Hassasiyet & Para Hesaplamaları:** Sepet, sipariş, indirim, kargo ve KDV hesaplamalarında JavaScript float hatalarını önlemek için 2 basamaklı yuvarlama (`Math.round((val + Number.EPSILON) * 100) / 100`) ve kuruş bazlı hesaplama zorunludur.
- **Form Idempotency & Çift Tıklama Engeli:** Sipariş verme, ödeme, kupon uygulama ve kritik admin butonlarında `disabled={isPending || isSubmitting}` ile çift tıklama engellenmeli, loading durumu net gösterilmelidir.
- **İyimser Güncelleme & Merkezi Bildirim (Toast/Sonner):** Arayüzde `window.alert()` / `window.confirm()` kullanımı kesinlikle yasaktır; tüm bildirimler `sonner` / `Toast` bileşeni üzerinden verilmeli ve liste mutasyonlarında hata durumunda rollback yapılmalıdır.
- **Ortak Bileşen Mimarisi (Shared Components):** Birden fazla sayfada kullanılan kart sarmalayıcıları, tablolar, filtreler, başlıklar veya modallar kopyala-yapıştır ile çoğaltılamaz; merkezi ortak bileşen haline getirilmelidir.
- **Erişilebilirlik (a11y):** Yalnızca ikon içeren tüm butonlarda açıklayıcı `aria-label` zorunludur; tüm etkileşimli ögeler `focus-visible:ring-2` ile klavye navigasyonuna uygun olmalıdır.
- **Statik Kodlama Yasağı & Panelden Yönetilebilir Dinamik Veri (Strict Dynamic Data Rule):**
  - Kod içerisine gömülü (hardcoded) sahte/statik veri (SSS soruları, ürün özellikleri, kategori SEO metinleri, bloglar, yorumlar, site ayarları, duyurular vb.) yazılması KESİNLİKLE YASAKTIR.
  - Tüm içerikler PostgreSQL / Prisma veritabanında modellenmeli ve Admin Paneli (`/admin/...`) üzerinden oluşturulabilmeli, düzenlenebilmeli ve silinebilmelidir (Tam CRUD desteği). Yeni bir içerik türü geldiğinde sabit dizi (`const DATA = [...]`) oluşturulamaz; doğrudan veritabanı şeması ve admin paneli ekranı inşa edilmelidir.
- **Kapsamlı E-Ticaret SEO & Yapılandırılmış Veri (Schema.org & Rich Snippets):**
  - Ürünün motor sayısı, taşıma kapasitesi, garanti süresi, boyutları vb. tüm teknik nitelikleri (`specs`) Google ve Akakçe için Schema.org `additionalProperty: PropertyValue` formatında JSON-LD şemasına eklenmelidir.
  - Tablolarda HTML5 Microdata (`itemScope`, `itemType="https://schema.org/PropertyValue"`, `itemProp="name"`, `itemProp="value"`) ve semantik HTML zorunludur.
  - Ürün galerilerinde ana görsel `<figure itemProp="image" itemScope itemType="https://schema.org/ImageObject">` semantik etiketine sarılmalı, kategoriye duyarlı temiz `alt` ve `title` etiketleri atanmalıdır. Tüm ürün görselleri diskte ürün slug'ı ile uyumlu semantik dosya adlarıyla tutulmalıdır.
  - Kategori ve ürün SEO metinleri (Title, Meta Description, Keywords, Canonical, OpenGraph) panelden yönetilebilir olmalıdır.
- **Concentric Geometry & Layout Kuralları (KRİTİK):**
  - **Boşluk Prensibi:** `rounded-[2rem]` kullanan dış çerçeveler `rounded-[1.75rem]` iç çerçeveler ve tam olarak `p-1` (4px) iç boşluk boşluğu kullanmalıdır. Standart kartlarda ise `rounded-xl` dış çerçeve için `rounded-lg` iç çerçeve ve `p-1` kullanılabilir.
  - **Yükseklik Çakışması Önleme:** Eğer dış çerçeve bir flex konteyneri ise (`flex flex-col` veya `flex-row`) ve dolgusu (`p-1`, `p-2`) varsa, iç çerçeveye **ASLA** `h-full` (height: 100%) verilmez. İç çerçeve sadece `flex-1` kullanarak ebeveynin dolgu sınırları içinde doğal olarak uzamalıdır.
- **Shadcn UI Standartları & AI-Generated Tasarım Karşıtı İlkeler (Strict Anti-AI Slop & Shadcn UI Calibration):**
  - **Yapay Süslemeler Yasaktır:** Bulanık pastel gradyan bulutları (`blur-3xl`, çok renkli mesh glow'lar), neon/pastel dumanlar, yapay noktalı/ızgara desenleri (`radial-gradient`) arayüze KESİNLİKLE EKLENEMEZ. Sitenin görsel dili; temiz, güven veren ve İsviçre grafik tasarım disiplinini benimseyen kurumsal medikal e-ticaret estetiğidir.
  - **Standart Tipografi ve Grid Disiplini:** Tailwind'in varsayılan font skalası (12px, 14px, 16px, 18px, 20px, 24px vb.) esastır. `13.5px`, `16.5px` gibi yapay ondalıklı piksel tanımlamaları yapılamaz.
  - **Ölçülü Köşe Yuvarlama (Radius) ve Keskin Kenarlıklar (Border):** Aşırı büyük veya çizgi film vari `rounded-[2rem]`, `rounded-[32px]` gibi yapay köşeler yerine; shadcn/ui standardı olan `--radius: 0.5rem` (8px), kartlarda `rounded-xl` (12px) veya `rounded-lg` (8px) ve mikro rozetlerde `rounded-md` (6px) kullanılır. Tüm çerçeveler keskin 1px `border-border` (Slate-200 / `#e2e8f0`) standardındadır.
  - **CSS Değişkenleri ve Semantik Renk Mimarisi (Shadcn Tokens):** Renkler doğrudan rastgele sınıflar yerine CSS değişkenleri ile tanımlanmış semantik tokenlar üzerinden yönetilir (`bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-muted`, `text-muted-foreground`, `border-border`, `ring-ring`). Ana palet: **Klinik Slate & Derin Medikal Lacivert (`#0f172a` / `#152a4a`)**, aksiyon için **Canlı Zümrüt Yeşili (`#25d366` / `#10b981`)**.
  - **Ortak İlkel UI Bileşenleri Zorunluluğu (`src/components/ui/`):** Butonlar, rozetler, kartlar ve form elemanları her sayfada 20 sınıflık rastgele Tailwind dizileriyle elle yazılamaz. `src/components/ui/button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`, `separator.tsx` gibi standart varyantlı ve erişilebilir shadcn ilkel bileşenleri kullanılır.
  - **`cn()` Yardımcı Fonksiyonu:** Sınıf birleştirmelerinde string concatenation veya template literal yerine `src/lib/utils.ts` içindeki `cn(...)` (`clsx` + `tailwind-merge`) kullanılır.
- **Görsel Yerleşimi ve object-cover Zorunluluğu (object-contain KESİNLİKLE YASAKTIR):** Ürün kartlarında (`ProductCard`), vitrin alanlarında (`HeroClient`), ürün detay galerilerinde (`ProductGallery`) ve küçük önizlemelerde (thumbnails) `object-contain` kullanımı ve görsellere iç boşluk (`p-*` padding) verilmesi KESİNLİKLE YASAKTIR. `object-contain` kullanımı e-ticaret vitrininde amatörce boşluklara (letterboxing), küçülmüş/havada asılı duran ürün kutularına ve görsel tutarsızlığa sebep olur. Tüm ürün görselleri çerçeveyi kenardan kenara dolduran `object-cover w-full h-full` standardı ile sergilenmelidir.
- **Harici Backlink Ağı & Script Enjeksiyonu Yasağı (Strict Link Scheme Prohibition):** `bck.js`, `seo.mcaris.com.tr` veya benzeri harici PBN/kardeş site backlink enjeksiyon scriptlerinin mağazaya eklenmesi KESİNLİKLE YASAKTIR. Google Arama Temelleri (SpamBrain & Link Schemes) politikalarına aykırı olan ve sitenin arama motoru ceza riskini (algoritmik/manuel ceza) tetikleyen yapay footer link ağları projede barındırılamaz.
- **Teslimata Saat Yazma Yasağı (Strict Prohibition of Specific Delivery Hours):** Teslimat vaatlerinde, ürün sayfalarında, duyurularda veya blog yazılarında "1-3 saat içinde", "2-4 saatte teslim", "1 saatte kapınızda", "45 dakikada teslimat" vb. gibi dakikalı/saatli spesifik zaman taahhütleri yazılması KESİNLİKLE YASAKTIR. Şehir içi trafik, montaj yoğunluğu ve lojistik değişkenlikler sebebiyle operasyonu zora sokacak saat vaadi verilemez. Standart kurumsal ifade: *"Aynı gün teslimat"*, *"Randevulu teslimat"* veya *"Kendi servis araçlarımızla gün içinde güvenli teslimat ve kata montaj"* şeklindedir.
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
  - Yapılan her anlamlı değişiklik, özellik ekleme veya hata düzeltmesi projedeki değişiklik kayıtları sistemine (`/degisiklik-kayitlari`) yansıtılmalıdır.
  - **Patron ve Yönetici Odaklı Sade Anlatım (Teknik Jargon YASAKTIR):** Değişiklik kayıtları teknik jargonla, dosya yollarıyla (`src/...`), kod parçacıklarıyla (`<g:mpn>`, `Zod`, `Promise`, `Schema.org` vb.) veya yazılım mühendisliği terimleriyle KESİNLİKLE YAZILAMAZ. Tüm maddeler doğrudan şirket patronunun, mağaza yöneticisinin veya müşterinin rahatça anlayacağı; **iş değerine**, **mağaza operasyonuna**, **katalog düzenine** ve **müşteri deneyimine** sağlanan somut faydaya odaklanan sade, anlaşılır ve kurumsal bir Türkçe ile kaleme alınmalıdır ("Hangi dosyayı/kodu yazdık?" yerine "İşletmede ve mağazada ne düzeldi, ne kazandık?").
  - **Canlı ve Tıklanabilir Tam URL Standartları (Mandatory Full URL Links):** Yenilenen, eklenen veya düzenlenen tüm sayfa, kategori, ürün, rehber veya karşılaştırma alanlarının altına yöneticinin ve müşterinin doğrudan tıklayıp canlı sonucu görebilmesi için ilgili rota/sayfa bağlantıları tam URL olarak (`links: [{ href: "https://shop.mcaris.com.tr/...", label: "..." }]`) hem değişiklik kayıtları (`/degisiklik-kayitlari`) kartlarının altına hem de rapor ve agent yanıtlarına eksiksiz eklenmelidir.

---

## 3. BELGELER VE REHBERLER HARİTASI

Daha detaylı yönergeler için lütfen aşağıdaki modüler rehberlere başvurun:
- **Genel Harita:** [.agents/docs/README.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/README.md)
- **Tasarım Sistemi & UI Kuralları:** [.agents/docs/frontend/design-system.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/frontend/design-system.md)
- **Geliştirme & Doğrulama Standartları:** [.agents/docs/workflows/development.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/workflows/development.md)
- **Veritabanı & Model Kuralları:** [.agents/docs/architecture/database-rules.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/architecture/database-rules.md)
- **Güvenlik & Doğrulama:** [.agents/docs/architecture/security.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/architecture/security.md)
- **Değişiklik Kayıtları:** [.agents/docs/workflows/changelog.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/workflows/changelog.md)
