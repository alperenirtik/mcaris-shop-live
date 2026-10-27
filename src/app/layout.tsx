import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import FloatingLiveSupport from "@/components/layout/FloatingLiveSupport";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartDrawer from "@/components/cart/CartDrawer";
import AppShell from "@/components/layout/AppShell";
import GoogleAnalyticsTracker from "@/components/analytics/GoogleAnalyticsTracker";
import AdsConversionTracker from "@/components/analytics/AdsConversionTracker";
import ContactClickTracker from "@/components/analytics/ContactClickTracker";
import { FavoritesProvider } from "@/context/FavoritesContext";
import NavigationProgressBar from "@/components/layout/NavigationProgressBar";

import { CartDrawerProvider } from "@/context/CartDrawerContext";
import { Toaster } from "sonner";
import {
  SITE_URL,
  BRAND_NAME,
  getOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/seo";
import { getSeoSettings } from "@/lib/settings";


export const viewport: Viewport = {
  themeColor: "#152A4A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  const title = seo.defaultTitle || "MCARIS — Motorlu Hasta Yatakları & Medikal Ekipmanlar";
  const description =
    seo.defaultDescription ||
    "2, 3 ve 4 motorlu elektrikli hasta karyolaları, boru tipi havalı yataklar ve transfer liftleri. Ankara içi gün içinde ücretsiz teslimat ve montaj.";

  const dynamicKeywords = seo.keywords
    ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  const baseKeywords = [
    "mcaris",
    "mcaris medikal",
    "shop mcaris",
    "mcaris shop",
    "hasta yatağı",
    "hastane yatağı",
    "hasta karyolası",
    "hastane karyolası",
    "medikal yatak",
    "elektrikli hasta yatağı",
    "2 motorlu hasta yatağı",
    "3 motorlu hasta yatağı",
    "4 motorlu hasta yatağı",
    "ahşap hasta yatağı",
    "havalı yatak",
    "hasta transfer lifti",
    "medikal bakım masası",
    "muayene masası",
    "bakım koltuğu",
    "dövme koltuğu",
    "veteriner masası",
    "Ankara medikal ekipman",
    "ankara hasta yatağı",
    "ankara hastane yatağı",
    "hasta yatağı kiralama ve satış",
  ];

  const mergedKeywords = Array.from(new Set([...baseKeywords, ...dynamicKeywords]));

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: seo.titleTemplate || "%s | MCARIS Medikal",
    },
    description,
    keywords: mergedKeywords,
    authors: [{ name: BRAND_NAME, url: SITE_URL }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/icon.png?v=mcaris7", type: "image/png" },
        { url: "/favicon.ico?v=mcaris7", sizes: "any" },
      ],
      shortcut: "/favicon.ico?v=mcaris7",
      apple: "/apple-touch-icon.png?v=mcaris7",
    },
    manifest: "/manifest.json",
    verification: {
      ...(seo.googleVerification ? { google: seo.googleVerification } : {}),
      other: {
        "ahrefs-site-verification": "fa71c703dfe934cb72622cd84294aa92190d33df4e11b94b1217084a0a07a58e",
      },
    },
    other: {
      "geo.region": "TR-06",
      "geo.placename": "Ankara, Yenimahalle",
      "geo.position": "39.9565;32.6949",
      "ICBM": "39.9565, 32.6949",
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: SITE_URL,
      siteName: BRAND_NAME,
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: "MCARIS Medikal Ekipman & Hasta Yatakları",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/twitter-image`],
      creator: "@mcarismedikal",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html lang="tr" className={`${plusJakarta.variable} ${inter.variable}`}>
      <head>
        {/* ClickCease / CHEQ Click Fraud Protection */}
        <script
          async
          src="https://ob.buzzfufighter.com/i/88effe92366609ccaf50123a5121d7e2.js"
          className="ct_clicktrue"
        />

        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NJJ3NHH3QC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NJJ3NHH3QC');
            gtag('config', 'AW-18090129163');
          `}
        </Script>

        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="P5PSPYmb9QbKUinqaXlymQ"
          async
          strategy="afterInteractive"
        />





        {/* Tawk.to Live Chat — sol alt, biraz yukarı */}
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            Tawk_API.customStyle = {
              visibility: {
                desktop: { position: 'bl', xOffset: 10, yOffset: 88 },
                mobile: { position: 'bl', xOffset: 8, yOffset: 108 }
              }
            };
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6ab0479cd129db344d607d33/1k309fetk';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>

        {/* Schema.org Organization & MedicalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Schema.org WebSite & SearchAction JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
      </head>


      <body className="bg-white font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
        {/* ClickCease / CHEQ Click Fraud Protection (noscript) */}
        <noscript>
          <iframe
            src="https://ob.buzzfufighter.com/ns/88effe92366609ccaf50123a5121d7e2.html?ch="
            width="0"
            height="0"
            style={{ display: "none" }}
          />
        </noscript>
        <NavigationProgressBar />
        <GoogleAnalyticsTracker />
        <AdsConversionTracker />
        <ContactClickTracker />
        <FavoritesProvider>
          <CartDrawerProvider>
            <AppShell
              header={<Header />}
              categoryNav={<CategoryNav />}
              footer={<Footer />}
              mobileBottomNav={<MobileBottomNav />}
              floatingLiveSupport={<FloatingLiveSupport />}
              cartDrawer={<CartDrawer />}
            >
              {children}
            </AppShell>

            <Toaster position="bottom-center" richColors />
          </CartDrawerProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
