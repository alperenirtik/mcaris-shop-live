import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_LEGAL_NAME } from "@/lib/constants";
import { SITE_URL, BRAND_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK — MCARIS Medikal",
  description: "MCARIS Medikal Gizlilik Politikası, KVKK Aydınlatma Metni ve Veri Güvenliği Standartları.",
  alternates: {
    canonical: "/gizlilik-politikasi",
  },
  openGraph: {
    title: `Gizlilik Politikası ve KVKK | ${BRAND_NAME}`,
    description: "MCARIS Medikal Gizlilik Politikası, KVKK Aydınlatma Metni ve Veri Güvenliği Standartları.",
    url: `${SITE_URL}/gizlilik-politikasi`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Gizlilik Politikası | ${BRAND_NAME}`,
    description: "MCARIS Medikal Veri Güvenliği ve KVKK Aydınlatma Metni.",
    images: [`${SITE_URL}/og-image.png`],
  },
};


export default function GizlilikPolitikasiPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-6 bg-white rounded-2xl p-6 md:p-10 border border-slate-200/80 space-y-6 text-slate-800 font-body">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand bg-brand/10 px-3 py-1 rounded-full border border-brand/30">
            KVKK &amp; Gizlilik
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-inter mt-3">
            Gizlilik ve Güvenlik Politikası
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-inter mt-1">
            Son Güncelleme: 26 Ağustos 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed border-t border-slate-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">1. GİZLİLİK VE VERİ GÜVENLİĞİ</h2>
          <p>
            {BUSINESS_LEGAL_NAME} (MCARIS Medikal) olarak kişisel verilerinizin güvenliğine büyük önem veriyoruz. Sitemiz üzerinden gerçekleştirilen tüm ödemeler 256-Bit SSL şifreleme ve iyzico 3D Secure altyapısıyla korunmaktadır. Kart bilgileriniz kesinlikle sunucularımızda saklanmaz.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">2. İŞLENEN KİŞİSEL VERİLER</h2>
          <p>
            Sipariş süreçlerinizin tamamlanabilmesi, faturalandırma ve adrese teslimat/kurulum hizmetlerinin sağlanabilmesi amacıyla Ad-Soyad, Telefon, E-Posta ve Teslimat Adresi bilgileriniz 6698 sayılı KVKK kapsamında işlenmektedir.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">3. İLETİŞİM VE VERİ SAHİBİ HAKLARI</h2>
          <p>
            Verileriniz hakkında bilgi almak, silinmesini veya güncellenmesini talep etmek için <strong>{BUSINESS_EMAIL}</strong> e-posta adresi veya <strong>{BUSINESS_PHONE}</strong> telefon numarası üzerinden bizlerle iletişime geçebilirsiniz.
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
