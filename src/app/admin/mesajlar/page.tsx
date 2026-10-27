import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MessageManagerClient from "./MessageManagerClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gelen Mesajlar — MCARIS Admin",
  description: "İletişim formundan gelen müşteri mesajları ve talepleri.",
};

export default async function AdminMessagesPage() {
  await requireAdmin();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <MessageManagerClient messages={messages} />;
}
