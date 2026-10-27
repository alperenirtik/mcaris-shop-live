# MCaris Shop - Agent Dokümantasyon Vault'u (Genel Harita)

Bu dokümantasyon vault'u, Kling Digital standartlarından türetilmiş olup MCaris Shop projesinin tüm mimari, tasarım, yerel SEO, veritabanı, güvenlik ve geliştirme kurallarını barındırır.

---

## 📚 Doküman Ağacı

### 1. Geliştirme ve İş Akışları (Workflows)
- [development.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/workflows/development.md): Yerel ortam kurulumu, geliştirme kuralları, kullanıcı temel kuralları (MCaris hitabı, sıfır varsayım, derinlemesine doğrulama), React 19 / Next.js 16 standartları.
- [changelog.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/workflows/changelog.md): Değişiklik kayıtlarının yönetimi ve güncellenmesi.

### 2. Arayüz ve Tasarım Sistemi (Frontend)
- [design-system.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/frontend/design-system.md): MCaris Shop Kurumsal Tasarım Sistemi, Concentric UI prensipleri, SERP mikro rozetleri, 5x2 kategori vitrini, emoji yasağı, dokunmatik katman ayrımı, mobil yapışkan satın alma barı ve Tailwind standartları.

### 3. Mimari, Güvenlik & Yerel SEO (Architecture)
- [seo-and-local.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/architecture/seo-and-local.md): Ankara 25 ilçe Programmatic Local SEO ağı, Schema.org zengin veri şemaları, Google Görseller XML sitemap ve 301 yönlendirme mimarisi.
- [database-rules.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/architecture/database-rules.md): Prisma ORM standartları, şema bütünlüğü, N+1 optimizasyonu, ilişkisel sorgulamalar ve SQL güvenliği.
- [security.md](file:///c:/Users/KLING%20DIGITAL/Documents/GitHub/Shop.MCaris.COM.TR/.agents/docs/architecture/security.md): Zod doğrulama standartları, ortam değişkenleri sır izolasyonu, form güvenliği, oturum & JWT kuralları, form idempotency ve finansal hesaplama hassasiyeti.

---

## 🎯 Agent Sorumluluk Özeti

Kod yazmaya veya mimari bir değişiklik yapmaya başlamadan önce yukarıdaki ilgili rehberi incelemeniz zorunludur.
Tüm yanıtlarınızda Kullanıcı Temel Kurallarına harfiyen uyulmalı, kullanıcıya "MCaris" adıyla hitap edilmeli ve `ask_question` aracı ile Türkçe, yapılandırılmış seçenekler sunulmalıdır.
