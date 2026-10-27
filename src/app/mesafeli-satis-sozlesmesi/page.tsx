import type { Metadata } from "next";
import Link from "next/link";
import {
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  BUSINESS_LEGAL_NAME,
  BUSINESS_TAX_OFFICE,
  BUSINESS_TAX_NUMBER,
} from "@/lib/constants";
import { SITE_URL, BRAND_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi — MCARIS Medikal",
  description: "MCARIS Medikal Mesafeli Satış Sözleşmesi, Tüketici Hakları ve Yasal Satış Şartları.",
  alternates: {
    canonical: "/mesafeli-satis-sozlesmesi",
  },
  openGraph: {
    title: `Mesafeli Satış Sözleşmesi | ${BRAND_NAME}`,
    description: "MCARIS Medikal Mesafeli Satış Sözleşmesi ve Yasal Satış Şartları.",
    url: `${SITE_URL}/mesafeli-satis-sozlesmesi`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Mesafeli Satış Sözleşmesi | ${BRAND_NAME}`,
    description: "MCARIS Medikal Mesafeli Satış Sözleşmesi.",
    images: [`${SITE_URL}/og-image.png`],
  },
};


export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-6 bg-white rounded-2xl p-6 md:p-10 border border-slate-200/80 space-y-6 text-slate-800 font-body">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            Yasal Bilgilendirme
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-inter mt-3">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-inter mt-1">
            Son Güncelleme: 26 Ağustos 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed border-t border-slate-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">MADDE 1 - TARAFLAR</h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <p><strong>SATICI ÜNVANI:</strong> {BUSINESS_LEGAL_NAME}</p>
            <p><strong>VERGİ DAİRESİ / NO:</strong> {BUSINESS_TAX_OFFICE} V.D. / {BUSINESS_TAX_NUMBER}</p>
            <p><strong>ADRES:</strong> {BUSINESS_ADDRESS}</p>
            <p><strong>TELEFON:</strong> {BUSINESS_PHONE}</p>
            <p><strong>E-POSTA:</strong> {BUSINESS_EMAIL}</p>
          </div>
          <p>
            <strong>ALICI:</strong> www.mcaris.com.tr e-ticaret sitesinden ürün sipariş eden ve iletişim bilgileri sipariş formunda yer alan gerçek veya tüzel kişidir.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">MADDE 2 - SÖZLEŞMENİN KONUSU</h2>
          <p>
            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait e-ticaret sitesinden elektronik ortamda siparişini yaptığı hasta yatakları, bakım koltukları ve medikal ürünlerin satışı, teslimi ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">MADDE 3 - TESLİMAT VE KURULUM ŞARTLARI</h2>
          <p>
            Sipariş konusu ürün, ALICI'nın belirttiği teslimat adresine güvenli korumalı ambalajlar içerisinde sevk edilir. Ankara içi adreslerde aynı gün yerinde ücretsiz teslimat ve teknik kurulum imkanı sağlanır. Diğer illere korumalı kargo ve ambalaj standartları ile gönderim yapılır.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 font-inter">MADDE 4 - ÖDEME VE GÜVENLİK</h2>
          <p>
            Ödemeler iyzico 256-Bit SSL korumalı altyapı üzerinden 3D Secure güvenlik SMS doğrulaması ile kredi kartı, banka kartı veya Havale/EFT yöntemiyle gerçekleştirilir.
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
