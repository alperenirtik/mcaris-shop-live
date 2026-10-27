import type { Metadata } from "next";
import OrderTrackerClient from "@/components/orders/OrderTrackerClient";
import { getOrderByAccessToken } from "@/lib/orders";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SITE_URL, BRAND_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ürünüm Nerede? Canlı Sipariş & Kargo Takibi — MCARIS Medikal",
  description: "Sipariş numaranız veya erişim kodunuz ile canlı teslimat konumunu ve montaj aşamalarını anlık takip edin.",
  alternates: {
    canonical: "/siparis-takip",
  },
  openGraph: {
    title: `Canlı Sipariş & Kargo Takibi | ${BRAND_NAME}`,
    description: "Sipariş numaranız ile canlı teslimat konumunu ve sevkiyat aşamalarını takip edin.",
    url: `${SITE_URL}/siparis-takip`,
    siteName: BRAND_NAME,
    locale: "tr_TR",
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: BRAND_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Sipariş Takibi | ${BRAND_NAME}`,
    description: "MCARIS Canlı Sipariş ve Kargo Takip Sistemi.",
    images: [`${SITE_URL}/og-image.png`],
  },
};


export default async function OrderTrackingPage({
  searchParams,
}: {
  searchParams?: Promise<{ siparisNo?: string }>;
}) {
  let initialOrder = null;
  const sp = searchParams ? await searchParams : {};

  if (sp?.siparisNo) {
    try {
      initialOrder = await getOrderByAccessToken(sp.siparisNo);
    } catch {
      initialOrder = null;
    }
  }

  const currentUser = await getCurrentUser();
  let userOrders: Array<{

    id: string;
    accessToken: string;
    status: string;
    totalAmount: string;
    createdAt: Date;
    firstProductName: string;
  }> = [];


  if (currentUser?.email) {
    try {
      const rawOrders = await prisma.order.findMany({
        where: { customerEmail: currentUser.email },
        orderBy: { createdAt:"desc" },
        include: {
          items: {
            take: 1,
            select: { productName: true },
          },
        },
      });

      userOrders = rawOrders.map((o) => ({
        id: o.id,
        accessToken: o.accessToken,
        status: o.status,
        totalAmount: o.total.toString(),
        createdAt: o.createdAt,
        firstProductName: o.items[0]?.productName ||"Medikal Ürün",
      }));
    } catch (err) {
      console.error("Kullanıcı siparişleri alma hatası:", err);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16 font-body">
      <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
        
        {/* Page Header */}
        <div className="text-center space-y-2.5">
          <span className="px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200">
            MCARIS Canlı Sevkiyat &amp; Kurulum Takibi
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-inter">
            Ürünüm Nerede?
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto font-inter">
            Hasta yatakları, bakım koltukları ve medikal ekipmanlarınızın adresinize canlı teslimat sürecini an an takip edebilirsiniz.
          </p>
        </div>

        {/* Tracker Client Component */}
        <OrderTrackerClient initialOrder={initialOrder} userOrders={userOrders} />

      </div>
    </div>
  );
}