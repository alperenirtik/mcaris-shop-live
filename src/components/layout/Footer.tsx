import Image from "next/image";
import Link from "next/link";
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_SECONDARY,
  WHATSAPP_NUMBER,
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_LEGAL_NAME,
  INSTAGRAM_URL,
  FACEBOOK_URL,
} from "@/lib/constants";
import { ProtectedPhone, ProtectedEmail } from "@/components/ui/ProtectedContact";
import PaymentLogos from "@/components/layout/PaymentLogos";

export default function Footer() {
  return (
    <footer className="bg-white text-neutral-800 border-t border-neutral-200/90 font-inter relative">
      {/* Top 3-Column Trust & Value Props Bar */}
      <div className="border-b border-neutral-200/70 bg-[#fafafa] py-6 sm:py-8">
        <div className="max-w-container-max mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-neutral-200/80">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">
                Ankara İçi Aynı Gün
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Ücretsiz yerinde teslimat &amp; profesyonel montaj
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-neutral-200/80">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">
                2 Yıl Resmi Garanti
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                10 yıl yedek parça ve teknik servis güvencesi
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-neutral-200/80 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">
                7/24 Uzman Desteği
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Sağlık ve medikal ekipman danışmanlığı
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className="max-w-container-max mx-auto px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {/* Col 1: Brand & About */}
        <div className="space-y-4">
          <Link
            href="/"
            aria-label="MCARIS Medikal Ana Sayfaya Dön"
            title="MCARIS Medikal Ana Sayfaya Dön"
            className="inline-block"
          >
            <Image
              src="/MCARIS-LOGO-2.webp"
              alt="MCARIS"
              width={240}
              height={70}
              className="h-10 sm:h-12 w-auto"
            />
            <span className="sr-only">MCARIS Medikal Ana Sayfaya Dön</span>
          </Link>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
            Hasta yatakları, medikal koltuklar ve profesyonel tedavi ekipmanlarında Türkiye’nin lider üreticisi ve distribütörü.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="MCARIS Medikal Instagram"
              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors flex items-center justify-center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="MCARIS Medikal Facebook"
              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors flex items-center justify-center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 8h2V4h-2a4 4 0 0 0-4 4v2H9v4h2v6h4v-6h2.5l.5-4H15V8z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>

        {/* Col 2: Hasta Karyolası Serileri (SEO Odaklı) */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-neutral-900">
            Hasta Karyolası Serileri
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 font-medium">
            <li>
              <Link href="/seri/platinum" className="hover:text-black transition-colors flex items-center justify-between group">
                <span>Platinum Seri (4 Motorlu)</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700">Özel</span>
              </Link>
            </li>
            <li>
              <Link href="/seri/gold" className="hover:text-black transition-colors">
                Gold Seri (3 Motorlu Asansörlü)
              </Link>
            </li>
            <li>
              <Link href="/seri/silver" className="hover:text-black transition-colors">
                Silver Seri (2 Motorlu Baş/Ayak)
              </Link>
            </li>
            <li>
              <Link href="/ankara-hasta-yatagi" className="hover:text-black transition-colors">
                Ankara Hasta Yatağı Satışı
              </Link>
            </li>
            <li>
              <Link href="/kiralama-proseduru" className="hover:text-black transition-colors">
                Kiralama vs Satın Alma Rehberi
              </Link>
            </li>
            <li>
              <Link href="/sss" className="hover:text-black transition-colors">
                Sıkça Sorulan Sorular (SSS)
              </Link>
            </li>
            <li>
              <Link href="/kategori/hasta-yataklari" className="font-semibold text-neutral-900 hover:underline">
                Tüm Karyola Modelleri &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Medikal Ekipmanlar (SEO Odaklı) */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-neutral-900">
            Medikal Ekipmanlar
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 font-medium">
            <li>
              <Link href="/kategori/bakim-koltuklari" className="hover:text-black transition-colors">
                Elektrikli Bakım Koltukları
              </Link>
            </li>
            <li>
              <Link href="/kategori/muayene-ve-bakim-masalari" className="hover:text-black transition-colors">
                Muayene ve Tedavi Masaları
              </Link>
            </li>
            <li>
              <Link href="/kategori/cihaz-sehpasi" className="hover:text-black transition-colors">
                Cihaz &amp; Serum Sehpaları
              </Link>
            </li>
            <li>
              <Link href="/kategori/tabure-ve-sandalyeler" className="hover:text-black transition-colors">
                Medikal Hekim Tabureleri
              </Link>
            </li>
            <li>
              <Link href="/urunler" className="font-semibold text-neutral-900 hover:underline">
                Tüm Medikal Kataloğu &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Hızlı Erişim & Kurumsal */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-neutral-900">
            Kurumsal &amp; Destek
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 font-medium">
            <li>
              <Link href="/hakkimizda" className="hover:text-black transition-colors">
                Hakkımızda &amp; Standartlarımız
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-black transition-colors flex items-center justify-between group">
                <span>Medikal Blog &amp; Rehberler</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">Uzman Rehberler</span>
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-black transition-colors">
                İletişim &amp; Fabrika Adresi
              </Link>
            </li>
            <li>
              <Link href="/siparis-takip" className="hover:text-black transition-colors">
                Sipariş &amp; Kargo Takibi
              </Link>
            </li>
            <li>
              <Link href="/degisiklik-kayitlari" className="hover:text-black transition-colors">
                Sürüm Notları (Changelog)
              </Link>
            </li>
            <li>
              <Link href="/hesabim" className="hover:text-black transition-colors">
                Hesabım &amp; Siparişlerim
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Horizontal VIP Danışma & Destek CTA Container Below Columns */}
      <div className="max-w-container-max mx-auto px-4 md:px-6 pb-12 w-full">
        <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-7 md:p-10 border border-neutral-800 relative overflow-hidden w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 relative z-10 w-full min-w-0">
            {/* Left: Info & Description */}
            <div className="space-y-3 max-w-2xl w-full min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-neutral-300 border border-white/10 text-xs font-semibold tracking-wide">
                <span>7/24 Kesintisiz Danışma &amp; Destek</span>
              </div>

              <p className="text-lg sm:text-2xl font-bold tracking-tight text-white break-words">
                Hasta Bakım &amp; Medikal Ekipman Seçiminde Yanınızdayız
              </p>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed break-words">
                Doğrudan üreticiden hasta yatağı satışı, teknik servis ve uzman montaj süreçleriniz için medikal danışmanlarımıza dilediğiniz an ulaşabilirsiniz.
              </p>

              {/* Contact Information Cards Grid with Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2 w-full min-w-0">
                {/* Mobile / Direct Line */}
                <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3 flex items-center gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <span className="text-[10px] text-neutral-400 block font-medium">Mobil / WhatsApp</span>
                    <ProtectedPhone
                      phone={BUSINESS_PHONE}
                      display={BUSINESS_PHONE}
                      className="text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors truncate block"
                    />
                  </div>
                </div>

                {/* Landline */}
                <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3 flex items-center gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <span className="text-[10px] text-neutral-400 block font-medium">Sabit Telefon</span>
                    <ProtectedPhone
                      phone={BUSINESS_PHONE_SECONDARY}
                      display={BUSINESS_PHONE_SECONDARY}
                      className="text-xs sm:text-sm font-bold text-white hover:text-sky-400 transition-colors truncate block"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-3 flex items-center gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <span className="text-[10px] text-neutral-400 block font-medium">Kurumsal E-Posta</span>
                    <ProtectedEmail
                      user="info"
                      domain="mcaris.com.tr"
                      className="text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition-colors truncate block"
                    />
                  </div>
                </div>
              </div>

              {/* Address with Map Pin Icon */}
              <div className="flex items-center gap-2 pt-1 text-xs text-neutral-400 w-full min-w-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500 shrink-0">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="truncate min-w-0 flex-1">{BUSINESS_ADDRESS}</span>
              </div>
            </div>

            {/* Right: Action Buttons Group */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20hasta%20karyolas%C4%B1%20ve%20medikal%20ekipmanlar%20hakk%C4%B1nda%20dan%C4%B1%C5%9Fmak%20istiyorum.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm px-7 py-4 rounded-xl transition-all active:scale-98"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>WhatsApp Canlı Danışma</span>
              </a>

              <a
                href={`tel:${BUSINESS_PHONE}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all border border-white/10 active:scale-98"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Doğrudan Telefonla Ara</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Popular Search Terms & Medical Keywords Strip */}
      <div className="border-t border-neutral-200/90 bg-neutral-50/70 py-8">
        <div className="max-w-container-max mx-auto px-4 md:px-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-neutral-500">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Popüler Medikal Arama Terimleri &amp; Hizmet Bölgelerimiz</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-neutral-600 font-medium">
            <Link href="/ankara-hasta-yatagi" className="hover:text-black hover:underline">
              Ankara Hasta Yatağı Satışı &amp; Fiyatları
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/seri/platinum" className="hover:text-black hover:underline">
              4 Motorlu Ahşap Hasta Karyolası
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/seri/gold" className="hover:text-black hover:underline">
              3 Motorlu Asansörlü Hasta Yatağı
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/seri/silver" className="hover:text-black hover:underline">
              2 Motorlu Elektrikli Karyola
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/kategori/hasta-yataklari" className="hover:text-black hover:underline">
              Alman Motorlu Hasta Yatakları
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/kategori/hasta-yataklari" className="hover:text-black hover:underline">
              Hasta Transfer Lifti &amp; Vinç Fiyatları
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/kategori/bakim-koltuklari" className="hover:text-black hover:underline">
              Medikal Bakım &amp; Diyaliz Koltuğu
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/kategori/muayene-ve-bakim-masalari" className="hover:text-black hover:underline">
              Muayene ve Tedavi Masası İmalatı
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/kategori/cihaz-sehpasi" className="hover:text-black hover:underline">
              Medikal Cihaz &amp; Serum Taşıma Sehpası
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/hakkimizda" className="hover:text-black hover:underline">
              CE &amp; ISO 9001 Medikal Standartlar
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/blog" className="hover:text-black hover:underline font-semibold text-neutral-800">
              Medikal Bilgi Bankası &amp; Hasta Bakım Rehberleri
            </Link>
          </div>

          {/* Ankara Districts Programmatic SEO Internal Links */}
          <div className="pt-4 border-t border-neutral-200/60 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span className="text-xs font-bold text-neutral-800 inline-flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-neutral-500 shrink-0">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Ankara İlçe Hizmet Ağımız (Tüm Ankara İlçelerine Gün İçinde Kurulum &amp; Teslimat)</span>
              </span>
              <Link href="/ankara-hasta-yatagi" className="text-xs font-bold text-neutral-900 hover:underline shrink-0">
                Tüm Ankara İlçelerine Aynı Gün Teslimat &amp; Kurulum &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-600">
              {[
                { name: "Çankaya", slug: "cankaya" },
                { name: "Yenimahalle", slug: "yenimahalle" },
                { name: "Keçiören", slug: "kecioren" },
                { name: "Etimesgut", slug: "etimesgut" },
                { name: "Mamak", slug: "mamak" },
                { name: "Sincan", slug: "sincan" },
                { name: "Altındağ", slug: "altindag" },
                { name: "Gölbaşı", slug: "golbasi" },
                { name: "Pursaklar", slug: "pursaklar" },
                { name: "Polatlı", slug: "polatli" },
                { name: "Çubuk", slug: "cubuk" },
                { name: "Kahramankazan", slug: "kahramankazan" },
                { name: "Beypazarı", slug: "beypazari" },
                { name: "Elmadağ", slug: "elmadag" },
                { name: "Akyurt", slug: "akyurt" },
                { name: "Nallıhan", slug: "nallihan" },
                { name: "Haymana", slug: "haymana" },
                { name: "Kızılcahamam", slug: "kizilcahamam" },
                { name: "Bala", slug: "bala" },
                { name: "Kalecik", slug: "kalecik" },
                { name: "Ayaş", slug: "ayas" },
                { name: "Güdül", slug: "gudul" },
                { name: "Çamlıdere", slug: "camlidere" },
                { name: "Evren", slug: "evren" },
                { name: "Şereflikoçhisar", slug: "sereflikochisar" },
              ].map((d, idx, arr) => (
                <span key={d.slug} className="inline-flex items-center gap-1.5">
                  <Link
                    href={`/ankara-hasta-yatagi/${d.slug}`}
                    className="hover:text-neutral-950 hover:underline transition-colors"
                  >
                    {d.name} Hasta Yatağı
                  </Link>
                  {idx < arr.length - 1 && <span className="text-neutral-300">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="bg-[#f5f5f5] border-t border-neutral-200 py-6">
        <div className="max-w-container-max mx-auto px-4 md:px-6 space-y-5">

          {/* Payment Methods Logo Band Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL &amp; 3D Secure ile Güvenli Ödeme</span>
            </div>
            <PaymentLogos size="sm" />
          </div>

          <p className="text-[11px] leading-relaxed text-neutral-500 text-left">
            Bu internet sitesinde ödeme hizmetleri{" "}
            <a
              href="https://www.paytr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-700 hover:text-black underline-offset-2 hover:underline"
            >
              PayTR Ödeme ve Elektronik Para Kuruluşu A.Ş.
            </a>{" "}
            tarafından sağlanmaktadır.
          </p>

          {/* Copyright & Legal Links (Left-Aligned, with 100px mobile clearance for bottom navigation) */}
          <div className="flex flex-col items-start justify-start gap-2 text-left pb-[100px] lg:pb-0">
            {/* Copyright */}
            <div className="text-xs text-neutral-500 text-left">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-neutral-800">{BUSINESS_LEGAL_NAME}</span> — Tüm hakları saklıdır.
            </div>

            {/* Mini Menu */}
            <div className="flex flex-wrap items-center justify-start gap-x-3.5 gap-y-1 text-xs text-neutral-500 text-left">
              <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-black transition-colors">
                Mesafeli Satış Sözleşmesi
              </Link>
              <span className="text-neutral-300 select-none">&bull;</span>
              <Link href="/gizlilik-politikasi" className="hover:text-black transition-colors">
                Gizlilik &amp; KVKK
              </Link>
              <span className="text-neutral-300 select-none">&bull;</span>
              <Link href="/iptal-ve-iade-kosullari" className="hover:text-black transition-colors">
                İptal &amp; İade Koşulları
              </Link>
              <span className="text-neutral-300 select-none">&bull;</span>
              <a
                href="https://www.medikalhastayatak.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Hasta Yatakları"
                className="hover:text-black transition-colors"
              >
                Hasta Yatakları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
