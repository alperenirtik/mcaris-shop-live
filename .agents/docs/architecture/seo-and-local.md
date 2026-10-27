# MCaris Shop - SEO & Programmatic Yerel SEO Mimarisi

Bu belge, MCaris Shop e-ticaret ekosisteminin teknik SEO, Schema.org yapılandırılmış veri, XML harita ve Ankara 25 ilçe Programmatic Local SEO standartlarını tanımlar.

---

## 1. Ankara 25 İlçe Programmatic Local SEO Ağı

- **Veri Kaynağı ([ankaraDistricts.ts](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/lib/ankaraDistricts.ts)):**
  - Ankara'nın 25 ilçesi (Çankaya, Yenimahalle, Keçiören, Etimesgut, Mamak, Sincan, Altındağ, Gölbaşı, Pursaklar, Polatlı vb.) için saat bazlı teslimat süresi (`deliveryTimeHours`), referans sağlık merkezleri (`nearbyHospitals`), hizmet verilen mahalleler (`popularNeighborhoods`) ve yerel SSS (`faq`) verilerini barındırır.
- **Dinamik Rotalama & Statik Üretim (SSG):**
  - `/ankara-hasta-yatagi` -> Ana hub sayfası.
  - `/ankara-hasta-yatagi/[ilce]` -> `generateStaticParams()` ile 25 ilçe için önceden derlenen (SSG) hızlı iniş sayfaları.
- **Dönüşüm Odaklı WhatsApp Entegrasyonu:**
  - İlçeye ve teslimat süresine göre dinamik pre-filled mesajla (`wa.me/${WHATSAPP_NUMBER}?text=...`) açılan tek tık sipariş ve danışma butonları.
- **İç Linkleme Ağı (Internal PageRank Mesh):**
  - [Footer.tsx](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/components/layout/Footer.tsx) ve ilçe sayfaları altındaki çapraz bağlantı ızgarasıyla tüm ilçeler birbirine bağlıdır.

---

## 2. Schema.org JSON-LD Yapılandırılmış Veri Standartları ([seo.ts](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/lib/seo.ts))

- **MedicalBusiness & MedicalSupplyStore:** Ankara Yenimahalle merkez koordinatları (`39.9565, 32.6949`), çalışma saatleri, telefon, harita linki ve hizmet verilen alanlar.
- **Product & Offer:** E-ticaret zengin kartları için fiyat (`TRY`), stok durumu (`InStock`), 2 yıl garanti (`WarrantyPromise`), 14 gün iade (`MerchantReturnPolicy`), teslimat (`OfferShippingDetails`), varsa gerçek yorumlar (`AggregateRating`) ve **tüm donanım parametreleri (`additionalProperty: PropertyValue[]`)**.
- **HTML5 Microdata & DOM Taranabilirliği:** Ürün özellik tablolarında (`SpecTable`) botların doğrudan ayrıştırabilmesi için `itemScope`, `itemType="https://schema.org/PropertyValue"`, `itemProp="name"` ve `itemProp="value"` semantik etiketleri zorunludur.
- **BreadcrumbList:** Hiyerarşik gezinme zinciri.
- **WebSite (SearchAction):** Google arama sonuçlarında doğrudan site içi arama kutusu.
- **FAQPage:** Sıkça sorulan soruların Google SERP'te zengin akordeon olarak çıkması.

---

## 3. Arama Motoru İndeksleme & Harita Mimarisi

- **XML Haritaları ve Ürün Beslemeleri:**
  - [sitemap.ts](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/app/sitemap.ts): Tüm kurumsal sayfalar, `/kiralama-proseduru`, `/sss` (173 soru-cevap), dinamik blog makaleleri (`/blog/[slug]`), yayında olan ürünler (`where: { isDraft: false }`), kategoriler, seriler, Ankara hub ve 25 ilçe sayfalarını eksiksiz içerir.
  - [product-sitemap.xml](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/app/product-sitemap.xml/route.ts): Google Görseller indekslemesi için yalnızca yayındaki ürünlerin fotoğraflarını `<image:image>` şemasıyla besler.
  - [Google Shopping Feed](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/lib/feed-generator.ts): `/feed.xml`, `/products.xml` ve dinamik kategori URL'leri üzerinden Merchant standartlarında İngilizce ürün beslemesi sağlar (`isDraft: false` filtreli).
- **SEO Dostu Sayfalama (Pagination):**
  - Ürün listeleme sayfalarında botların tüm sayfaları tarayabilmesi için temiz URL parametresi (`/urunler?sayfa=2`) kullanılmalıdır. Botların indeksleyemeyeceği istemci taraflı sonsuz scroll yapısı yasaktır.
- **Robots.txt ([robots.ts](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/app/robots.ts)):**
  - Vitrin sayfaları `allow`, hassas alanlar (`/admin`, `/sofor`, `/hesabim`, `/checkout`, `/sepet`, auth) `disallow` edilir.
- **Semantik Slug & 301 Kalıcı Yönlendirme:**
  - Kısa veya eski ürün SKU linkleri [src/app/urun/[slug]/page.tsx](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/app/urun/%5Bslug%5D/page.tsx) üzerinde otomatik olarak yeni semantik slug'a 301 kalıcı yönlendirilir.

---

## 4. Görsel SEO & HTML5 ImageObject DOM Standartları

- **HTML5 Semantic `<figure>` ve Schema.org `ImageObject`:**
  - Ürün detay galerilerinde ([ProductGallery.tsx](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/components/product/ProductGallery.tsx)) ana ürün görseli doğrudan `<figure itemProp="image" itemScope itemType="https://schema.org/ImageObject">` sarmalayıcısına alınmalıdır.
  - İçerisinde `<meta itemProp="url" content="..." />`, `<meta itemProp="contentUrl" content="..." />` ve semantik `<figcaption className="sr-only" itemProp="caption">` etiketleri yer almalıdır.
- **Kategoriye Duyarlı Temiz Alt & Title Etiketleri:**
  - Anahtar kelime yığması (keyword stuffing) engellenmeli; ürünün gerçek kategorisine göre dinamik `alt` (`${productName} - ${categoryName} Orijinal Görseli | MCARIS`) ve `title` (`${productName} - ${categoryName} Detay Görseli`) etiketleri atanmalıdır.
- **Semantik Dosya Adlandırma & Auto-Trim WebP Standardı ([image-optimizer.ts](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/lib/image-optimizer.ts)):**
  - Tüm ürün görselleri diskte ve veritabanında ürün slug'ı ile birebir uyumlu (`/uploads/products/${productSlug}-${sira}-${kisaHash}.webp`) olarak saklanır.
  - `sharp.trim({ threshold: 12 })` ile ürün fotoğraflarının çevresindeki gereksiz beyaz ve boşluk alanlar otomatik kırpılarak kadraja tam oturtulur.
  - `next.config.mjs` üzerinden `images.unoptimized: true` ile doğrudan saf statik URL (`https://shop.mcaris.com.tr/uploads/products/...`) servis edilir; `/_next/image?url=%2F...` proxy yükü ve `%2F` karakterleri tamamen sıfırlanmıştır.
- **OpenGraph & Twitter Card Görsel Metadata:**
  - Sosyal medya ve WhatsApp önizlemelerinde görsel kırpılmalarını önlemek için `generateMetadata` çıktısında açık `width: 1200`, `height: 630` ve doğru `alt` bilgisi zorunludur.

---

## 5. Uluslararası Standartta İngilizce XML Ürün Beslemesi (Product Feed)

- **Feed URL'leri ([src/lib/feed-generator.ts](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/src/lib/feed-generator.ts)):**
  - **Tüm Ürünler (Global):** `https://shop.mcaris.com.tr/feed.xml` *(veya `/products.xml`, `/google-shopping.xml`)*
  - **Hasta Yatakları:** `https://shop.mcaris.com.tr/feed/hasta-yataklari.xml` *(veya `/feed.xml?category=hasta-yataklari`, `/feed/yatak.xml`)*
  - **Dövme Kol Sehpaları:** `https://shop.mcaris.com.tr/feed/dovme-kol-sehpalari.xml` *(veya `/feed.xml?category=dovme-kol-sehpalari`, `/feed/dovme.xml`)*
  - **Bakım Koltukları:** `https://shop.mcaris.com.tr/feed/bakim-koltuklari.xml` *(veya `/feed/koltuk.xml`)*
  - **Muayene & Bakım Masaları:** `https://shop.mcaris.com.tr/feed/muayene-ve-bakim-masalari.xml` *(veya `/feed/masalar.xml`)*
  - **Medikal Kozmetik:** `https://shop.mcaris.com.tr/feed/medikal-kozmetik.xml` *(veya `/feed/kozmetik.xml`)*
  - **Dinamik Kategori Parametresi:** `https://shop.mcaris.com.tr/feed/[kategori-slug].xml`
- **Dahil Edilen Standart Alanlar:**
  - `<g:id>`: SKU / Ürün Kodu
  - `<g:title>` & `<g:description>`: CDATA korumalı temiz başlık ve metin
  - `<g:link>`: Ürün tam canonical URL'i
  - `<g:image_link>` & `<g:additional_image_link>`: Tam çözünürlüklü kapak ve galeri görselleri
  - `<g:availability>`: `in_stock` / `out_of_stock`
  - `<g:price>`: `TRY` ISO döviz kodlu fiyat
  - `<g:brand>`, `<g:condition>`, `<g:mpn>`, `<g:product_type>`
  - `<g:google_product_category>`: Google Merchant onaylı hiyerarşik kategori
  - `<g:custom_label_0>` & `<g:custom_label_1>`: Seri (`PLATINUM`, `GOLD`, `SILVER`) ve kategori segmentleri
  - `<g:shipping>`: Türkiye geneli ücretsiz teslimat ve montaj (`0.00 TRY`)
  - `<g:product_detail>`: Ürünün tüm donanım ve teknik nitelikleri (`Technical Specifications`)



