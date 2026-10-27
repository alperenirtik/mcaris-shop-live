import type { Metadata } from"next";
import { SITE_URL, BRAND_NAME } from"@/lib/seo";

export const metadata: Metadata = {
  title:"Değişiklik Kayıtları (Changelog) & Sürüm Güncellemeleri",
  description:"MCARIS Medikal e-ticaret platformundaki en son mimari güncellemeler, yeni özellikler, güvenlik standartları ve sistem iyileştirmeleri.",
  alternates: {
    canonical:"/degisiklik-kayitlari",
  },
  openGraph: {
    title: `Değişiklik Kayıtları (Changelog) | ${BRAND_NAME}`,
    description:"MCARIS Medikal platform güncelleme geçmişi ve teknik sürüm notları.",
    url: `${SITE_URL}/degisiklik-kayitlari`,
    siteName: BRAND_NAME,
    locale:"tr_TR",
    type:"website",
  },
};

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
