import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_PHONE, BUSINESS_EMAIL } from "@/lib/constants";
import { SITE_URL, BRAND_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "İptal ve İade Koşulları — MCARIS Medikal",
  description: "MCARIS Medikal 14 gün cayma hakkı, iade, değişim şartları ve ücret iadesi süreçleri.",
  alternates: {
    canonical: "/iptal-ve-iade-kosullari",
  },
  openGraph: {
    title: `İptal ve İade Koşulları | ${BRAND_NAME}`,
    description: "MCARIS Medikal 14 gün cayma hakkı, iade, değişim şartları ve ücret iadesi süreçleri.",
    url: `${SITE_URL}/iptal-ve-iade-kosullari`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `İptal ve İade Koşulları | ${BRAND_NAME}`,
    description: "MCARIS Medikal 14 gün cayma hakkı ve iade süreçleri.",
    images: [`${SITE_URL}/og-image.png`],
  },
};


export default function IptalVeIadeKosullariPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-6 bg-white rounded-2xl p-6 md:p-10 border border-slate-200/80 space-y-6 text-slate-800 font-body">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Yasal Bilgilendirme
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-inter mt-3">
            İptal ve İade Koşulları
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-inter mt-1">
            Son Güncelleme: 17 Ağustos 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed border-t border-slate-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">1. CAYMA HAKKI (14 GÜN İADE İMKANI)</h2>
          <p>
            ALICI, satın aldığı ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin reddederek sözleşmeden cayma hakkına sahiptir.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">2. İADE ŞARTLARI VE SÜRECİ</h2>
          <p>
            İade edilecek ürünün ambalajının hasar görmemiş, kullanılmamış ve tüm aksesuarlarıyla (kumanda, motor aksamı, şilte vb.) eksiksiz olarak tarafımıza ulaştırılması gerekmektedir. İade talebi oluşturmak için <strong>{BUSINESS_PHONE}</strong> numaralı hattımızı arayabilir veya <strong>{BUSINESS_EMAIL}</strong> adresine bildirimde bulunabilirsiniz.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">3. ÜCRET İADESİ</h2>
          <p>
            İade edilen ürün tarafımıza ulaşıp kontrol edildikten sonra ödenen tutar 3 ila 7 iş günü içerisinde ödeme yaptığınız kredi kartınıza veya banka hesabınıza iyzico ödeme sistemi güvencesiyle iade edilir.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between font-inter">
          <Link href="/" className="text-xs sm:text-sm font-bold text-brand hover:underline">
            &larr; Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
