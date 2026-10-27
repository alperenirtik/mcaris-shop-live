import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import PaytrIframeClient from "./PaytrIframeClient";

export const metadata: Metadata = {
  title: "Güvenli Kartla Ödeme — MCARIS Medikal",
  description: "PayTR 256-Bit SSL korumalı 3D Secure güvenli ödeme ekranı.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PaytrPageProps {
  searchParams: Promise<{
    token?: string;
    orderId?: string;
  }>;
}

export default async function PaytrPage({ searchParams }: PaytrPageProps) {
  const params = await searchParams;
  const token = params.token;
  const orderId = params.orderId;

  if (!token) {
    redirect("/checkout?hata=odeme-token-bulunamadi");
  }

  let orderTotal: string | undefined = undefined;
  let customerName: string | undefined = undefined;

  if (orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { total: true, customerName: true },
      });
      if (order) {
        orderTotal = order.total.toString();
        customerName = order.customerName;
      }
    } catch {
      // Sipariş bulunamazsa token ile devam et
    }
  }

  return (
    <PaytrIframeClient
      token={token}
      orderId={orderId}
      orderTotal={orderTotal}
      customerName={customerName}
    />
  );
}
