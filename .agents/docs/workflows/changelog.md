# MCaris Shop - Değişiklik Kayıtları (Changelog) Standartları

Bu belge, MCaris Shop projesinde yapılan mimari, tasarımsal ve işlevsel geliştirmelerin belgelenmesi kurallarını kapsar.

---

## 1. Zorunlu Güncelleme Kuralı

- Yapılan her anlamlı kod değişikliği, yeni özellik, hata düzeltmesi veya mimari güncelleme projedeki değişiklik kayıtları sayfasına (`/degisiklik-kayitlari`) veya ilgili changelog veri dosyasına işlenmelidir.
- AI Agent'lar tamamladıkları her ana görevden sonra yapılan işleri madde madde değişiklik kayıtlarına eklemekle yükümlüdür.

---

## 2. Kayıt Formatı ve Dil Standardı (KRİTİK)

Her değişiklik kaydı şu bilgileri içermelidir:
- **Tarih & Versiyon:** Değişikliğin yapıldığı tarih ve sürüm bilgisi.
- **Kategori:** `Özellik`, `İyileştirme`, `Düzeltme`, `Güvenlik`.
- **Açıklama (Patronun ve Yöneticinin Anlayacağı Sade Dil):**
  - **Teknik Jargon YASAKTIR:** Dosya adları (`src/lib/...`), kod terimleri (`<g:mpn>`, `Zod`, `Promise`, `Schema.org`, API rotaları vb.) kesinlikle kullanılmaz.
  - **İş ve Müşteri Odaklı Anlatım:** "Hangi kod yazıldı?" yerine "Mağazada ne düzeldi, müşteriye ve şirket operasyonuna ne fayda sağlandı?" sorusuna yanıt verilmelidir.
  - Şirket patronunun, mağaza müdürünün veya bir müşterinin okuduğunda bir çırpıda anlayabileceği sade, temiz ve kurumsal bir Türkçe kullanılmalıdır.

---

## 3. Doğru / Yanlış Örnekler

❌ **YANLIŞ (Teknik ve Anlaşılmaz):**
> "feed-generator.ts dosyasındaki SKU fallback zinciri güncellendi. <g:mpn> ve Schema.org mpn etiketlerine slug sızması engellendi. productCode.ts formatProductCode regex kuralı revize edildi."

✅ **DOĞRU (Patronun Rahatça Anlayacağı İş Dili):**
> "Google ve pazar yeri ürün listelerinde bazı ürünlerin kodları yerine web linki yazması sorunu giderildi; tüm ürünlere eksiksiz resmi ürün kodları tanımlanarak Google reklam ve katalog listelerinde hatasız sergilenmesi sağlandı."
