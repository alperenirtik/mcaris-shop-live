"use server";

import { getUserByEmail, createUser, createPasswordResetToken, resetPasswordWithToken } from"@/lib/users";
import { verifyPassword, createAuthToken, setAuthCookie, clearAuthCookie } from"@/lib/auth";
import { redirect } from"next/navigation";

export interface FormState {
  error?: string;
  success?: boolean;
  message?: string;
  token?: string;
  emailPreviewUrl?: string;
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = (formData.get("email") as string ||"").trim();
  const password = (formData.get("password") as string ||"").trim();
  const redirectUrl = (formData.get("redirect") as string ||"").trim();

  if (!email || !password) {
    return { error:"Lütfen e-posta adresinizi ve şifrenizi girin." };
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return { error:"E-posta adresi veya şifre hatalı." };
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error:"E-posta adresi veya şifre hatalı." };
  }

  const token = createAuthToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await setAuthCookie(token);

  let target = redirectUrl;
  const isSafeRelativeUrl = target && target.startsWith("/") && !target.startsWith("//") && !target.includes("://");
  if (!isSafeRelativeUrl || (target.startsWith("/admin") && user.role !== "ADMIN")) {
    target = user.role === "ADMIN" ? "/admin" : "/hesabim";
  }
  redirect(target);
}

export async function registerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = (formData.get("name") as string ||"").trim();
  const email = (formData.get("email") as string ||"").trim();
  const phone = (formData.get("phone") as string ||"").trim();
  const password = (formData.get("password") as string ||"").trim();
  const passwordConfirm = (formData.get("passwordConfirm") as string ||"").trim();

  if (!name || !email || !password) {
    return { error:"Lütfen tüm zorunlu alanları doldurun." };
  }

  if (password.length < 6) {
    return { error:"Şifre en az 6 karakter olmalıdır." };
  }

  if (password !== passwordConfirm) {
    return { error:"Girdiğiniz şifreler birbiriyle eşleşmiyor." };
  }

  try {
    const user = await createUser({
      name,
      email,
      phone,
      password,
    });

    const token = createAuthToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAuthCookie(token);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Kayıt sırasında bir hata oluştu.";
    return { error: msg };
  }

  redirect("/hesabim");
}

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
  redirect("/giris");
}

export async function forgotPasswordAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = (formData.get("email") as string ||"").trim();
  if (!email) {
    return { error:"Lütfen e-posta adresinizi girin." };
  }

  try {
    const resetResult = await createPasswordResetToken(email);
    if (!resetResult) {
      return { error: "Sistemimizde bu e-posta adresine ait bir hesap bulunamadı. Lütfen önce kayıt olun." };
    }

    const { sendPasswordResetEmail } = await import("@/lib/email");
    await sendPasswordResetEmail(email, resetResult.token);
    
    return { success: true, message:"Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Şifre sıfırlama işlemi sırasında hata oluştu.";
    return { error: msg };
  }
}

export async function resetPasswordAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const token = (formData.get("token") as string ||"").trim();
  const newPassword = (formData.get("newPassword") as string ||"").trim();
  const confirmPassword = (formData.get("confirmPassword") as string ||"").trim();

  if (!token || !newPassword) {
    return { error:"Eksik bilgi. Lütfen tüm alanları doldurun." };
  }

  if (newPassword.length < 6) {
    return { error:"Yeni şifre en az 6 karakter olmalıdır." };
  }

  if (newPassword !== confirmPassword) {
    return { error:"Girdiğiniz şifreler birbiriyle eşleşmiyor." };
  }

  try {
    await resetPasswordWithToken(token, newPassword);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Şifre sıfırlama sırasında hata oluştu.";
    return { error: msg };
  }

  redirect("/giris?reset=success");
}