"use server";

import { getCurrentUser } from"@/lib/auth";
import { updateUserProfile } from"@/lib/users";
import { revalidatePath } from"next/cache";

export interface FormState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function updateProfileAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error:"Bu işlem için giriş yapmanız gerekmektedir." };
  }

  const name = (formData.get("name") as string ||"").trim();
  const phone = (formData.get("phone") as string ||"").trim();
  const address = (formData.get("address") as string ||"").trim();

  if (!name) {
    return { error:"Ad soyad zorunludur." };
  }

  try {
    await updateUserProfile(user.id, {
      name,
      phone: phone || undefined,
      address: address || undefined,
    });

    revalidatePath("/hesabim");
    return { success: true, message:"Profiliniz başarıyla güncellendi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Profil güncellenirken hata oluştu.";
    return { error: msg };
  }
}

export async function changePasswordAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { error:"Bu işlem için giriş yapmanız gerekmektedir." };
  }

  const currentPassword = (formData.get("currentPassword") as string ||"").trim();
  const newPassword = (formData.get("newPassword") as string ||"").trim();
  const confirmPassword = (formData.get("confirmPassword") as string ||"").trim();

  if (!currentPassword || !newPassword) {
    return { error:"Mevcut şifre ve yeni şifre zorunludur." };
  }

  if (newPassword.length < 6) {
    return { error:"Yeni şifre en az 6 karakter olmalıdır." };
  }

  if (newPassword !== confirmPassword) {
    return { error:"Girdiğiniz şifreler birbiriyle eşleşmiyor." };
  }

  try {
    const { verifyPassword, hashPassword } = await import("@/lib/auth");
    const { prisma } = await import("@/lib/db");

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return { error:"Kullanıcı bulunamadı." };
    }

    const isValid = await verifyPassword(currentPassword, dbUser.passwordHash);
    if (!isValid) {
      return { error:"Mevcut şifreniz hatalı." };
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return { success: true, message:"Şifreniz başarıyla güncellendi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Şifre değiştirilirken hata oluştu.";
    return { error: msg };
  }
}