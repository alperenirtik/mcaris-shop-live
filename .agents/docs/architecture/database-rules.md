# MCaris Shop - Veritabanı ve Prisma Kuralları

Bu belge, veritabanı şema tasarımı, Prisma ORM kullanımı, sorgu optimizasyonu ve veri bütünlüğü kurallarını kapsar.

---

## 1. Prisma ORM Tipleri ve Bütünlük

- **Doğrudan Üretilen Tipler:** Veritabanı modelleriyle çalışırken Prisma'nın ürettiği tipler (`Prisma.JsonValue`, model tipleri, `Prisma.ProductGetPayload<{ include: { ... } }>`) doğrudan kullanılmalıdır.
- **Sahte Cast Yasak:** `prisma as unknown as PrismaClient` gibi sahte tip atamaları KESİNLİKLE YASAKTIR.
- **Dinamik Veriler:** Ürünler, kategoriler, siparişler, ayarlar, kuponlar ve kullanıcı rolleri ilişkisel Prisma modellerinde tutulur. Statik JSON dosyalarında dinamik iş mantığı verisi saklanamaz.

---

## 2. N+1 Sorgu Engelleme ve İndeksleme

- **Eager Loading:** Döngü içinde sorgu çalıştırmak (N+1) yasaktır. İlişkili veriler `include` veya `select` kullanılarak tek seferde çekilmelidir.
- **İndeksleme:** Sık filtrelenen veya sıralanan sütunlarda (`categorySlug`, `status`, `createdAt`, `userId`, `orderId`) `prisma/schema.prisma` üzerinde `@@index` tanımlanmalıdır.

---

## 3. SQL Güvenliği ve Raw Sorgular

- Eğer raw SQL kullanılması gerekiyorsa, kesinlikle parametreli `prisma.$queryRaw` veya güvenli generic dönüş tipli `prisma.$queryRawUnsafe<T[]>` kullanılmalıdır.
- Kullanıcı girdisiyle SQL metin birleştirmesi (string interpolation) KESİNLİKLE YASAKTIR.
- Veritabanı yedekleme ve dışa aktarmalarda tam `.sql` DDL ve transaction paketleri (`BEGIN...COMMIT`) tercih edilmelidir.

---

## 4. Statik Kodlama Yasağı & Admin Panelinden Yönetim Zorunluluğu

- **Kod İçi Sabit Dizi Tanımlanamaz:** Sıkça Sorulan Sorular (SSS), Kategori SEO metinleri, Ürün Nitelikleri (Specs), Bloglar, Yorumlar, Site İletişim & Sosyal Medya Ayarları, Bannerlar ve Duyurular gibi kullanıcıya sunulan içerikler **ASLA** kod içine `const FAQ_DATA = [...]` gibi gömülemez.
- **Modelleme & Admin Arayüzü Şarttır:** İhtiyaç duyulan her yeni veri türü için `prisma/schema.prisma` dosyasında ilgili model tanımlanmalı (`npx prisma db push`), veritabanına tohumlama (seeding) fonksiyonu eklenmeli ve `/admin/...` altında tam CRUD (Oluşturma, Okuma, Güncelleme, Silme, Sıralama, Aktif/Pasif) ekranları geliştirilmelidir.
- **Anında Revalidation:** Admin panelinden yapılan her güncelleme sonrasında ilgili sayfa rotası `revalidatePath(...)` ile anında tazelemelidir.

---

## 5. Ürün Taslak (isDraft) ve Dinamik İçerik Modelleri

- **`model Product` ve `isDraft` Alanı:**
  - `isDraft Boolean @default(false)` alanı ürünün vitrin statüsünü belirler. `isDraft: true` durumundaki ürünler vitrin sorgularından (`getProducts`, `getFeaturedProducts`, `getProductBySlug`), arama API'sinden, XML feed'lerinden ve sitemap'lerden izole edilir.
  - Admin panelinde tek tıkla (`toggleProductDraftAction`) anında `revalidatePath("/admin/urunler")`, `revalidatePath("/urunler")` ve `revalidatePath("/")` tetiklenir.
- **`model FAQ` (173 Aktif SSS):**
  - Sıkça sorulan sorular `category`, `question`, `answer`, `order`, `isPublished` alanlarıyla modellenir. 6 ana kategoride 173 soru `/admin/sss` panelinden tam CRUD yönetilebilir.
- **`model BlogPost` (19 Rehber Yazısı):**
  - Medikal blog içerikleri `slug`, `title`, `content`, `coverImage`, `category`, `isPublished` alanlarıyla PostgreSQL'de saklanır; `/blog` ve `/blog/[slug]` sayfalarında dinamik servis edilir.
