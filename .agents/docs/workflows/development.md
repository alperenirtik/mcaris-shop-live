# Development Rules & Workflow Standartları

## 1. Yerel Geliştirme ve Başlatma Kuralları

Bellek tükenmesini önlemek için yerel geliştirmede Node bellek alanı yapılandırılabilir:
```powershell
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

- **Prisma DLL / Client Kilidi:** `npm run dev` dev server aktifken `query_engine` dosyasını kilitlediği durumlarda `npx prisma generate` komutu hata verirse dev server durdurulmalı veya geçici kilit dosyası çözülmelidir.
- **Git Komut Yürütümü:** Sistem PATH'inde git bulunmaması durumunda GitHub Desktop git yürütücüsü kullanılabilir.

> [!CAUTION] Otomatik Dev Server Başlatma Yasağı
> AI agent'ların arka planda otomatik olarak geliştirme sunucusunu (`npm run dev`) başlatması KESİNLİKLE YASAKTIR. Bu durum arka planda port kilitlenmelerine ve bellek sızıntılarına yol açar. Dev server yalnızca geliştirici tarafından manuel olarak başlatılır.

---

## 2. Mühendislik Standartları ve Kullanıcı Temel Kuralları (KRİTİK)

1. **Dürüstlük ve Teknik Doğruluk:** Kullanıcıyı memnun etmeye çalışmak veya sırf "evet" demek için geçici, sahte veya aldatıcı çözümler üretme.
2. **Boş İşlerden Kaçın:** Olmayacak bir şeyi oldurmaya çalışarak veya gerçekte sisteme fayda sağlamayan yüzeysel işler (fake work) yaparak vakit kaybetme.
3. **Doğruyu Savun ve Kökten Çöz:** İstenen işlem teknik olarak yanlışsa veya çalışmayacaksa bunu doğrudan ve açıkça belirt. Sorunu kökünden çözmek (örneğin veritabanı şemasını değiştirmek, doğru veri tipini modellemek) gerekiyorsa kolaya kaçıp (type casting `as any` vs. yaparak) etrafından dolanma; mimarinin ve mühendisliğin gerektirdiği doğru kök çözümü uygula.
4. **Kullanıcı Hitabı (MCaris):** Her yanıtta kullanıcıya doğrudan adıyla ("MCaris") hitap et. Bu durum hafızanın sıfırlanıp sıfırlanmadığının anlaşılmasını sağlar. Her yanıtta bu isim kullanılacaktır.
5. **Derinlemesine Doğrulama ve Bağlam Kontrolü:** Yalnızca linter ve build komutlarını çalıştırıp yeşil çıktı almakla işin bittiği veya hatasız olduğu ASLA varsayılamaz. Değişikliğin çalıştığı tüm akış, mantıksal bağlamlar, veri ilişkileri, çerez/oturum durumları, güvenlik manipülasyonları ve kenar durumları (edge cases) kökten incelenmeli ve tam olarak doğrulandıktan sonra başarı iddia edilmelidir. Birbirini etkileyen özellikler ve ortak alanlar da kontrol edilmelidir.
6. **Varsayım Yasak & Kanıta Dayalı Mühendislik (Zero Speculation):** Kod yazarken, kullanıcı niyetini yorumlarken veya hata ayıklarken asla varsayımlara dayanarak ezbere işlem yapılamaz. Emin olunmayan her noktada kod tabanı taranmalı, somut kanıt toplanmalı veya kullanıcıya doğrudan sorulmalıdır. Projeyi bozabilecek kör varsayımlar kesinlikle yasaktır.
7. **Her Zaman Seçilebilir ve Türkçe Soru Standardı:** Kullanıcıdan onay, tercih veya mimari karar alınması gereken tüm durumlarda sorular ASLA düz metinle açık uçlu bırakılamaz; her zaman `ask_question` aracı kullanılarak yapılandırılmış, seçenekli (seçilebilir) ve eksiksiz bir **Türkçe** dille yöneltilmelidir.

---

## 3. Kod Kalitesi, Tipler ve Hata Yönetimi

- **Sıfır Ölü Kod:** Kullanılmayan importlar, atıl değişkenler, gereksiz mock kodlar ve yetim dosyalar hemen temizlenmelidir.
- **Sıfır Tip Kaçamağı (`as any`, `as unknown as X`, `@ts-ignore` KESİNLİKLE YASAKTIR):**
  - Çift tip zorlamaları (`as unknown as Type`) veya `as any` kullanımı derleyiciyi susturup çalışma zamanında (`TypeError: Cannot read properties of undefined`) çökmelere yol açar.
  - Tüm veri dönüşümleri, JSON payload'ları ve dinamik özellikler Type Guard (`(item): item is Type`), Zod şemaları veya açık tip daraltma (`typeof x === "string"`) ile doğrulanmalıdır.
- **React 19 & Next.js 16 Hook ve State Kuralları:**
  - `useEffect` içinde senkron `setState` çağırmak ardışık render uyarılarına yol açar.
  - Mount anında güvenli veri çekmek için çağrıları asenkron microtask (`Promise.resolve().then(...)`) ile sarmalayın ve yarış durumlarını (race conditions) önlemek için yerel temizleme bayrağı (`let active = true; ... return () => { active = false; }`) uygulayın.
  - Bağımlılık listelerinde kararsız fonksiyon referanslarını önlemek için fetch handler'larını `useCallback` ile önbelleğe alın.
- **Hata Yönetimi (Error Handling):** Tüm `try/catch` bloklarında hatalar katı tiplenmeli (`catch (e) { const error = e instanceof Error ? e.message : 'Bilinmeyen hata'; ... }`).
- **Doğrulama Komutları:** İş bitiminde mutlaka TypeScript derleme kontrolü (`npx tsc --noEmit` veya `npm run lint`) ile doğrulanmalı, başarı kanıtsız iddia edilmemelidir.
