import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const privateRoutes = [
    "/admin",
    "/admin/*",
    "/api/*",
    "/sofor",
    "/sofor/*",
    "/hesabim",
    "/hesabim/*",
    "/sepet",
    "/checkout",
    "/giris",
    "/kayit-ol",
    "/sifre-sifirla",
    "/sifremi-unuttum",
    "/siparis/*",
    "/favoriler",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privateRoutes,
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/product-sitemap.xml`,
    ],
    host: SITE_URL,
  };
}

