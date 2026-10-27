import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import ReviewManagerClient from "./ReviewManagerClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ürün Yorumları — MCARIS Admin",
  description: "Müşteri ürün yorumları ve moderasyon yönetimi.",
};

export default async function AdminReviewsPage() {
  await requireAdmin();

  const reviews = await prisma.review.findMany({
    include: {
      product: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <ReviewManagerClient reviews={reviews} />;
}
