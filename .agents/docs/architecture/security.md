# MCaris Shop - Güvenlik ve Mimari Doğrulama Standartları

Bu belge, MCaris Shop e-ticaret platformunun veri güvenliği, girdi doğrulama, oturum yönetimi ve finansal hesaplama kurallarını tanımlar.

---

## 1. Zod Doğrulaması ve Girdi Sanitizasyonu

- **Zorunlu Zod Şemaları:** Tüm API route'ları (`POST`, `PUT`, `PATCH`, `DELETE`) ve Server Actions payload'ları, veritabanına veya harici servislere geçmeden önce Zod şemaları ile tam doğrulanmalıdır.
- **Tip Daraltma:** Zod tarafından parse edilmiş/doğrulanmış güvenli tipler (`z.infer<typeof schema>`) kullanılmalıdır.

---

## 2. Ortam Değişkenleri ve Sır İzolasyonu

- `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`, ödeme gateway anahtarları vb. hassas ortam değişkenleri yalnızca sunucu tarafında (Server Components, Route Handlers, Server Actions) okunabilir.
- İstemciye (`NEXT_PUBLIC_` ön eki harici) hassas bilgiler ASLA sızdırılamaz.

---

## 3. Finansal Hesaplama ve Kuruş Hassasiyeti

- E-ticaret sipariş, sepet, ürün indirimleri, kargo, KDV ve toplam tutar hesaplamalarında JavaScript float yuvarlama hatalarını önlemek için:
  ```ts
  export function roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  ```
- Tutarlar hesaplanırken kuruş/cent bazlı veya 2 basamaklı garantili yuvarlama fonksiyonları kullanılmalıdır.

---

## 4. Form Idempotency & Çift Tıklama Koruması

- Sipariş oluşturma, ödeme adımı, kupon uygulama ve kritik admin aksiyonlarında butonlar işlem sürerken `disabled={isPending || isSubmitting}` durumuna getirilmeli, işlem durumu kullanıcıya yükleniyor animasyonu ile bildirilmelidir.

---

## 5. Çerez ve Oturum Güvenliği

- Tüm kimlik doğrulama çerezlerinde `httpOnly: true`, üretimde `secure: true`, `sameSite: "lax"`, ve `path: "/"` yapılandırması zorunludur.
- JWT doğrulamasında token süre sonu (`exp`) katı şekilde kontrol edilmeli, geçersiz oturumlar anında reddedilmelidir.
