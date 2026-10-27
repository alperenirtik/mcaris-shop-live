# MCaris Shop - Tasarım Sistemi & UI Standartları

Bu belge, MCaris Shop e-ticaret platformunun görsel dilini, bileşen hiyerarşisini, Concentric UI geometri prensiplerini, mobil etkileşim kurallarını ve Tailwind standartlarını tanımlar.

---

## 1. Concentric Geometry & Kart Düzenleme Kuralları (KRİTİK)

Çift katmanlı kartlarda görsel kayma, kenar mesafesi asimetrisi ve dikey taşmaları önlemek için:
- **Köşe Yuvarlama ve Dolgu Orantısı:** 
  - `rounded-[2rem]` dış kart -> `rounded-[1.75rem]` iç kart -> `p-1` (4px) boşluk.
  - `rounded-2xl` dış kart -> `rounded-xl` iç kart -> `p-1` veya `p-1.5` boşluk.
- **Yükseklik Çakışması Önleme:** Dış kart `flex flex-col` veya `flex-row` ve padding içeriyorsa, iç karta **ASLA** `h-full` verilmez. İç kart `flex-1` ile ebeveynin sınırları içinde esnemelidir.

---

## 2. Renk Paleti ve Shadcn UI Semantik Token Mimarisi

Renkler ve zemin tonları CSS değişkenleri tabanlı shadcn/ui semantik token sistemi üzerinden yönetilir:
- **Temel Nötrler (Background & Foreground):** 
  - `bg-background` (`hsl(var(--background))` - `#f8fafc` / Slate-50 temiz klinik arka plan)
  - `text-foreground` (`hsl(var(--foreground))` - `#020817` / Slate-950 net kontrast)
- **Kartlar & Popoverlar:**
  - `bg-card` / `bg-popover` (`#ffffff` saf klinik beyaz)
  - `border-border` (`#e2e8f0` / Slate-200 keskin, ince 1px kenarlıklar)
- **Ana Renk (Primary):**
  - `bg-primary` / `text-primary-foreground` (`#152A4A` / `#0F172A` - Derin Kurumsal Medikal Lacivert)
- **İkincil & Muted:**
  - `bg-secondary` / `bg-muted` (`#f1f5f9` - Soft Slate yumuşak zeminler)
  - `text-muted-foreground` (`#64748b` - Slate-500 okunaklı ikincil açıklamalar)
- **Aksiyon ve İletişim (Accent & WhatsApp):**
  - WhatsApp & CTA: `#25D366` / `#10b981` (Canlı Zümrüt Yeşili)
- **Segmentasyon & Miras Kimlik Renkleri:**
  - Platinum (`#2C3E6B`), Gold (`#C8A951`), Silver (`#8E99A4`), Brand (`#26425E`)
- **Durum Renkleri:**
  - `destructive` (`#ef4444` / Danger `#E53935`), Warning (`#FF9800`), Success (`#4CAF50` / `#10b981`).

---

## 3. Tipografi, Rozetler ve Mikro SERP Standartları

- **Başlık Fontu:** `Poppins` (Ekstra kalın 800 veya kalın 700 - Sayfa hiyerarşisi, ürün isimleri ve modal başlıkları).
- **Gövde Metni:** `Inter` (Okunaklı gövde, ürün açıklamaları, teknik tablolar, form alanları).
- **Fiyat Formatı:** `tabular-nums` kullanılarak rakamların alt alta kusursuz hizalanması sağlanmalıdır.
- **SERP Tarzı Monokrom Mikro Rozet Standardı:** 
  - Başlıkların yanına yapay duran renkli yuvarlak noktalar (yeşil, sarı, kırmızı noktalar) koymak KESİNLİKLE YASAKTIR.
  - Müşteri arayüzünde geliştirici/şablon çıktısı izlenimi veren köşeli parantezli `[...]` metinler yerine temiz, kurumsal mikro metin rozetleri (`KATALOG`, `DEĞERLENDİRME`, `SAĞLIK MERKEZLERİ`, `TESLİMAT AĞI`) kullanılmalıdır (`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white leading-tight`).
- **Emoji Yasağı:** Arayüzde hiçbir yerde renkli emoji (⚡, 📍, 🏥, ⭐ vb.) kullanılamaz; daima temiz vektörel SVG ikonları ve tipografi kullanılmalıdır.
- **Sayısal Sayaç Kirliliği Yasağı:** Menü, bağlantı ve CTA metinlerinde doğrudan mekanik sayaç ifadeleri (`(173 Soru)`, `(25 İlçe)`, `(49 Soru & Yanıt)`) yazılması yasaktır; insan odaklı, akıcı e-ticaret dili esastır.

---

## 4. Popüler Kategoriler Grid Mimarisi (5x2 Standardı)

- Hero bölümü altındaki popüler kategoriler bloğu tam olarak 10 öğeli (5 sütun x 2 satır) dengeli grid yapısında (`grid-cols-2 sm:grid-cols-3 md:grid-cols-5`) olmalıdır.
- Tüm kategori kapsüllerinin nesne şeması (`name`, `href`, `image`, `badge`) eşit satır ve veri yapısında tutulmalıdır.

---

## 5. Dokunmatik Katman Ayrımı & Mobil Etkileşim (UX)

- **Ürün Kartı Katman Standardı ([ProductCard.tsx](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/components/product/ProductCard.tsx)):**
  - Kart gövdesi `div relative` olarak kurulmalı; `<FavoriteButton>` (kalp butonu) ASLA bir `<a>` veya `<Link>` etiketinin içine gömülmemelidir.
  - Linkler zemin/içerik katmanına, favori butonu ise bağımsız `z-20` dokunmatik katmanına yerleştirilmelidir.
- **Mobil Sepet Çekmecesi ([CartDrawer.tsx](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/components/cart/CartDrawer.tsx)):**
  - iPhone Safari adres çubuğu hareketlerine karşı `h-[100dvh]` ve `safe-area-inset-bottom` koruma dolgusu zorunludur.
- **Mobil Yapışkan (Sticky) Satın Alma Barı ([ProductStickyMobileBar.tsx](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/components/product/ProductStickyMobileBar.tsx)):**
  - Ürün detay sayfalarında 350px kaydırma sonrasında mobilde alt gezinme çubuğunun hemen üzerinde beliren mini satın alma & WhatsApp barı standarttır.

---

## 6. Ortak Bileşenler (Shared Components) ve Tasarımsal Bütünlük

- Birden fazla sayfada kullanılan ürün kartı, filtre barı, sayfalama, modal, admin tablosu veya aksiyon butonu kopyala-yapıştır ile çoğaltılamaz.
- Tüm ortak UI ögeleri `src/components/` altında modüler bileşenler olarak geliştirilmelidir.
- Ham tarayıcı diyalogları (`window.alert()`, `window.confirm()`) KESİNLİKLE YASAKTIR; tüm etkileşim bildirimleri `sonner` / `Toast` ile verilmelidir.

---

## 7. Erişilebilirlik (a11y) & Görsel Optimizasyon

- **Aria-Label:** Yalnızca ikon içeren butonlarda açıklayıcı `aria-label` zorunludur.
- **Odaklanma:** Tüm tıklanabilir ögeler klavye ile gezinirken `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none` ile net görünür halkaya sahip olmalıdır.
- **Next/Image:** `next/image` ögelerinde CLS'yi sıfırlamak için explicit `width/height` veya `fill` + `aspect-ratio` belirtilmelidir. Banner ögelerinde `priority={true}` kullanılır.

---

## 8. Ürün Görseli Yerleşim Standardı (Full-Bleed `object-cover` Kuralı)

- **Sıfır İç Boşluk (Zero Padding):** Ürün vitrin kartlarında ([ProductCard.tsx](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/components/product/ProductCard.tsx)), kategori ve yerel ilçe sayfalarındaki görsel kutularında `p-1`, `p-2`, `p-3` gibi iç boşluklar (padding) kullanılamaz.
- **Kusursuz `object-cover`:** Görseller `object-contain` yerine daima `object-cover w-full h-full` olarak tanımlanmalıdır. Bu sayede farklı en-boy oranına (4:3, 16:9 vb.) sahip medikal fotoğraflarda üstten veya alttan orantısız şerit boşlukları (letterboxing) oluşmaz; görsel kartın kare kadrajına kenardan kenara (full-bleed) tam oturur.
- **Hover Ölçekleme:** Hover etkileşimlerinde yumuşak mikro zoom (`group-hover:scale-105 transition-transform duration-500 ease-out`) kullanılırken ebeveyn konteynerde `overflow-hidden` ile taşmalar engellenir.

---

## 9. Ürün Taslak (Draft Mode) Vitrin İzolasyonu

- **Çift Durumlu Yaşam Döngüsü:** Veritabanındaki `Product.isDraft` alanı `true` olan ürünler (hazırlık aşamasındaki modeller, rakip siteden çekilen taslaklar vb.) genel mağaza vitrininden, ana sayfadan, kategori listelerinden, canlı aramadan, sitemap dosyalarından ve Google XML feed'lerinden tamamen izole edilir.
- **Yönetim Paneli Görünürlüğü:** Taslak ürünler yalnızca `/admin/urunler` listesinde sarı renkli `[TASLAK]` rozeti ve filtreleme sekmeleriyle görüntülenir; yönetici tarafından tek tıkla anında yayına alınabilir veya tekrar taslağa çekilebilir.

---

## 10. Mobil Gezinme ve Dokunmatik UX Standartları

- **Masaüstü Paritesi (`MobileNav`):** Mobil gezinme çekmecesi masaüstü menülerinden eksik bırakılamaz. Klinik & Bakım Ekipmanları, Seriler (Platinum, Gold, Silver), Kiralama Çözümleri, Ankara 25 İlçe Local SEO Ağı, Kiralama Prosedürü, SSS ve Blog bağlantıları mobil menüde tam kapsamlı olarak yer almalıdır.
- **Yatay Hızlı Erişim Şeridi (`CategoryNav Quick Strip`):** Arama çubuğunun hemen altında yer alan yatay kaydırılabilir hap etiketler en kritik kategori ve hizmetleri (`Tüm Ürünler`, `Hasta Karyolası`, `Platinum/Gold/Silver Seri`, `Bakım Koltukları`, `Muayene Masaları`, `Cihaz Sehpaları`, `Kiralık Karyolalar`, `Ankara İlçe Bölgeleri`) tek dokunuşla sunmalıdır.
- **Sabit Alt Gezinme (`MobileBottomNav`):** 5 sekmeli yapışkan alt menüde `/kategori` ve `/seri` gezinmelerinde "Ürünler" sekmesi aktif vurgusunu korumalıdır. Tüm butonlar açıklayıcı `aria-label` değerine sahip olmalıdır.
- **Duyarlı Tepe Barı:** Dar mobil ekranlarda (360px) tepe aksiyon butonlarının (`w-9 h-9 sm:w-10 sm:h-10`) ve arama çubuğunun taşma yapmadan sığması zorunludur.
- **Footer Alt Boşluk Koruması:** `MobileBottomNav` sabit 64px yükseklikte olduğundan, sayfa sonundaki telif ve yasal bağlantıların örtülmemesi için Footer en alt barında `pb-24 lg:pb-6` güvenlik dolgusu kullanılmalıdır.

---

## 11. Shadcn UI Kalitesi & AI-Generated Tasarım Karşıtı Standartlar (Anti-AI Slop)

- **Yapay Bulanıklıklar ve Mesh Gradyan Yasağı:** 
  - Arka planlara yapay derinlik katmak amacıyla konulan çok renkli pastel blur bulutları (`blur-3xl`, `bg-gradient-to-br from-sky-200...`), neon/pastel dumanlar veya radial nokta dokuları (`radial-gradient`) KESİNLİKLE YASAKTIR.
  - Mağaza estetiği; İsviçre grafik tasarım disiplinini yansıtan temiz, yüksek kontrastlı, güven veren ve cerrahi hassasiyetteki medikal e-ticaret düzenidir.
- **Standart Tipografi Ölçeği:**
  - Tailwind'in doğal font skalası (`text-xs`: 12px, `text-sm`: 14px, `text-base`: 16px, `text-lg`: 18px, `text-xl`: 20px, `text-2xl`: 24px) kullanılır. `13.5px`, `16.5px` gibi yapay ondalıklı piksel tanımlamaları yasaktır.
  - Başlıklarda `tracking-tight` ve gövde metinlerinde `leading-relaxed` standarttır.
- **Ölçülü Köşe Yuvarlama (Border Radius):**
  - Çizgi film vari veya abartılı `rounded-[2rem]`, `rounded-[32px]` yerine shadcn/ui standartları geçerlidir:
    - Genel UI elemanları: `--radius: 0.5rem` (8px)
    - Kartlar: `rounded-xl` (12px) veya `rounded-lg` (8px)
    - Rozetler: `rounded-md` (6px) veya `rounded-full` (hap rozetler)
- **Ortak Shadcn UI Primitifleri Kullanım Zorunluluğu (`src/components/ui/`):**
  - Butonlar için `<Button variant="..." size="...">`,
  - Rozetler için `<Badge variant="...">`,
  - Kartlar için `<Card>`, `<CardHeader>`, `<CardContent>`,
  - Form girdileri için `<Input>`,
  - Ayırıcılar için `<Separator>` bileşenleri kullanılmalıdır.
- **`cn()` Yardımcı Fonksiyonu:**
  - Koşullu sınıflar ve birleştirmeler daima `src/lib/utils.ts` içindeki `cn()` (`clsx` + `tailwind-merge`) ile yapılmalıdır.


