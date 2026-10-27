import type { Metadata } from "next";
import { getAllFaqsForAdmin } from "@/lib/faq";
import FaqManagerClient from "./FaqManagerClient";

export const metadata: Metadata = {
  title: "SSS & Yardım Merkezi Yönetimi | Admin Paneli",
};

export default async function AdminFaqPage() {
  const faqs = await getAllFaqsForAdmin();

  return (
    <FaqManagerClient
      initialFaqs={faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        order: f.order,
        isActive: f.isActive,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
      }))}
    />
  );
}
