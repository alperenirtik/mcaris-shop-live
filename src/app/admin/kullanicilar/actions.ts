"use server";

import { prisma } from"@/lib/db";
import { requireAdmin } from"@/lib/auth";
import { revalidatePath } from"next/cache";
import { Role } from"@prisma/client";

export async function updateUserRoleAction(userId: string, newRole: Role) {
  const currentAdmin = await requireAdmin();

  if (currentAdmin.id === userId) {
    throw new Error("Kendi rolünüzü değiştiremezsiniz.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/kullanicilar");
}

export async function deleteUserAction(userId: string) {
  const currentAdmin = await requireAdmin();

  if (currentAdmin.id === userId) {
    throw new Error("Kendi hesabınızı silemezsiniz.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/kullanicilar");
}