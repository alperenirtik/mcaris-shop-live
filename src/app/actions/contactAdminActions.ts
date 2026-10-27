"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteContactMessageAction(id: string) {
  await requireAdmin();

  if (!id) {
    return { error: "Mesaj ID gereklidir." };
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    revalidatePath("/admin/mesajlar");
    return { success: true, message: "Mesaj silindi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Mesaj silinirken hata oluştu.";
    return { error: msg };
  }
}
