# MCARIS Medikal E-Ticaret & Canlı Sevkiyat Yönetim Platformu

MCARIS Medikal için geliştirilmiş, yüksek performanslı, tam donanımlı ve modern e-ticaret platformu.

🌐 **Canlı Site:** [shop.mcaris.com.tr](https://shop.mcaris.com.tr)  
🚀 **Teknoloji:** Next.js 16.3.1 (App Router), React 19, TypeScript, Prisma ORM, PostgreSQL, TailwindCSS

---

## 🌟 Öne Çıkan Özellikler

### 🛍️ Müşteri Deneyimi & Vitrin
- **Modern Katalog & Filtreleme:** Kategori, seriler (Platinum, Gold, Silver), fiyat ve arama bazlı akıllı filtreleme.
- **Dinamik Sepet & Çekmece:** Sağdan açılan anlık sepet çekmecesi (CartDrawer), kupon kodu doğrulama ve dinamik kargo hesaplama.
- **Güvenli Ödeme:**
  - Havale / EFT ile sipariş tamamlama
  - **Ödeal 3D Secure** ve **iyzico** Sanal POS entegrasyonları
  - Otomatik stok düşümü ve e-posta bildirimleri (Müşteri & Yönetim)
- **Canlı Kargo & Sevkiyat Takibi (`/siparis-takip`):**
  - Müşteriler sipariş kodu ile teslimat durumunu ve canlı şoför konumunu anlık harita üzerinden izleyebilir.
- **Gelişmiş Mobil Gezinme & UX:**
  - Masaüstü paritesine sahip zengin kayar mobil çekmece (`MobileNav`): Klinik ekipmanlar, seriler, kiralama çözümleri ve rehberler.
  - Yatay kaydırılabilir hızlı erişim şeridi (`CategoryNav Quick Strip`) ve 5 sekmeli yapışkan alt menü (`MobileBottomNav`).
  - 360px dahil tüm mobil ekranlarda optimize edilmiş duyarlı tepe aksiyon butonları.
- **Ankara 25 İlçe Programmatic Local SEO Ağı (`/ankara-hasta-yatagi`):**
  - Çankaya'dan Keçiören'e 25 ilçeye özel dinamik semantik iniş sayfaları, 2 saatte acil teslimat & montaj kurgusu.
- **Sıkça Sorulan Sorular & Bilgi Bankası (`/sss`):**
  - 173'ün üzerinde kategorize edilmiş profesyonel hasta yatağı & medikal ekipman soru-cevap veritabanı.
- **Medikal Blog & Makaleler (`/blog`):**
  - Dinamik SEO uyumlu makale kütüphanesi ve hasta bakım rehberleri.
- **Kiralama Prosedürü Rehberi (`/kiralama-proseduru`):**
  - Adım adım hasta karyolası kiralama, teslimat ve hijyen standartları süreci.
- **Kullanıcı Paneli (`/hesabim`):** Profil düzenleme, şifre değiştirme, geçmiş siparişler ve fatura görüntüleme.
- **Kurumsal & Yasal Sayfalar:** Hakkımızda, İletişim, Gizlilik Politikası, İptal ve İade Koşulları, Mesafeli Satış Sözleşmesi, Değişiklik Günlüğü (`/degisiklik-kayitlari`).

### 🚚 Özel Medikal Filo & Şoför Paneli (`/sofor`)
- Canlı GPS koordinat yayını (Geolocation API)
- Sevkiyat tamamlama ve teslimat durumu güncelleme

### 🛡️ Yönetim Paneli (`/admin`)
- **Gelişmiş Ürün Yönetim Merkezi (`/admin/urunler`):**
  - Satır içi hızlı Fiyat (₺) ve Stok düzenleme.
  - Tek tıkla ürün klonlama / çoğaltma (Duplicate).
  - Çoklu seçimle toplu % fiyat artırma/indirme, toplu stok belirleme ve toplu kategori taşıma.
  - Depo KPI envanter ve kritik stok analiz kartları.
  - UTF-8 Türkçe destekli Excel / CSV dışa aktarımı.
- **Medya Yönetim Kütüphanesi (`/admin/medya`):**
  - `sharp` tabanlı otomatik WebP dönüştürücü ve beyaz kenar boşluğu kırpıcı (Auto-Trim).
  - Semantik dosya isimlendirmesi (`${slug}-${index}-${hash}.webp`) ve doğrudan temiz statik URL servisi.
- **Sipariş Kontrolü:** Sipariş durumları, müşteri bilgileri, PDF/görsel fatura yükleme ve silme.
- **Kategori Ağacı:** Hiyerarşik üst/alt kategori tanımlama.
- **Kupon & Kargo Ayarları:** Yüzde veya sabit TL indirim kuponları, tek tıkla aktif/pasif yapma, mağaza sabit kargo ücreti ve ücretsiz kargo alt limiti.
- **Kullanıcı & Yetki Kontrolü:** Tek tıkla Yönetici (ADMIN) / Müşteri (USER) rolü atama ve hesap silme.
- **Canlı Sevkiyat Radarı (`/admin/canli-takip`):** Sahadaki tüm araçların canlı konum ve sevkiyat durumları.

---

## 📡 XML Beslemeleri & Kategori Bazlı Feed'ler (Product Feeds & Sitemaps)

### 1. Ana Ürün Beslemeleri (Tüm Ürünler)
- **Tüm Ürünler (Global Feed):**  
  👉 `https://shop.mcaris.com.tr/feed.xml`  
  *(Alternatif Takma Adlar: `/products.xml`, `/google-feed.xml`, `/google-shopping.xml`)*

### 2. Kategoriye Özel Bağımsız Feed'ler (Dedicated Campaign Feeds)
- **Hasta Yatakları & Karyolaları Feed'i:**  
  👉 `https://shop.mcaris.com.tr/feed/hasta-yataklari.xml`  
  *(veya `/feed/yatak.xml`)*
- **Dövme Kol Sehpaları Feed'i:**  
  👉 `https://shop.mcaris.com.tr/feed/dovme-kol-sehpalari.xml`  
  *(veya `/feed/dovme.xml`)*
- **Bakım ve Muayene Koltukları Feed'i:**  
  👉 `https://shop.mcaris.com.tr/feed/bakim-koltuklari.xml`  
  *(veya `/feed/koltuk.xml`)*
- **Muayene ve Bakım Masaları Feed'i:**  
  👉 `https://shop.mcaris.com.tr/feed/muayene-ve-bakim-masalari.xml`  
  *(veya `/feed/masalar.xml`)*
- **Medikal Kozmetik Feed'i:**  
  👉 `https://shop.mcaris.com.tr/feed/medikal-kozmetik.xml`  
  *(veya `/feed/kozmetik.xml`)*
- **Cihaz Sehpaları Feed'i:**  
  👉 `https://shop.mcaris.com.tr/feed/cihaz-sehpasi.xml`
- **Tabure ve Sandalyeler Feed'i:**  
  👉 `https://shop.mcaris.com.tr/feed/tabure-ve-sandalyeler.xml`

### 3. SEO & Arama Motoru Haritaları
- **Site Haritası (Sitemap):** `https://shop.mcaris.com.tr/sitemap.xml`
- **Google Görsel Haritası (Image Sitemap):** `https://shop.mcaris.com.tr/product-sitemap.xml`
- **Robots.txt:** `https://shop.mcaris.com.tr/robots.txt`

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| **Framework** | Next.js 16.3.1 (App Router, Server Actions) |
| **UI Library** | React 19 |
| **Dil** | TypeScript 5 |
| **Veritabanı & ORM** | PostgreSQL & Prisma ORM 6.19 |
| **Stil & Tasarım** | TailwindCSS 3.4 & Vanilla CSS Tokens |
| **E-Posta Servisi** | cPanel SMTP Webmail (`nodemailer`) + Resend Fallback |
| **Ödeme Gateway** | Ödeal 3D POS & iyzico |
| **Test & Kalite** | Vitest 1.6 & React Testing Library |

---

## 🚀 Yerel Geliştirme Kurulumu

### 1. Gereksinimler
- Node.js 20+
- PostgreSQL 15+

### 2. Depoyu Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone https://github.com/mcaris/Shop.MCaris.COM.TR.git
cd Shop.MCaris.COM.TR
npm install
```

### 3. Çevresel Değişkenleri Ayarlayın
`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```
`.env` dosyasındaki `DATABASE_URL`, `JWT_SECRET`, `SMTP_PASS` vb. bilgileri yapılandırın.

### 4. Veritabanını Hazırlayın ve Seed Verisini Yükleyin
```bash
npx prisma db push
npx prisma db seed
```

### 5. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresini açın.

---

## 🧪 Test & Tip Doğrulama

```bash
# TypeScript tip kontrolü (0 hata garantisi)
npx tsc --noEmit

# Vitest birim & bileşen testleri
npm test

# Production build testi
npm run build
```

---

## 🌐 Coolify ile Canlı Sunucu Yayını

Coolify üzerinde PostgreSQL + Next.js App servisi olarak deploy etmek için:

1. **Build Pack:** Nixpacks veya Dockerfile
2. **Build Command:** `prisma generate && next build`
3. **Start Command:** `next start -p 3000`
4. **Port:** `3000`
5. **Gerekli Ortam Değişkenleri:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`
   - `ORDER_NOTIFICATION_EMAIL`
   - `ODEAL_API_KEY`, `ODEAL_SECRET_KEY`, `ODEAL_MERCHANT_ID`, `ODEAL_BASE_URL`

---

## 📄 Lisans & Telif Hakkı

© 2026 MCARIS Medikal. Tüm hakları saklıdır.
