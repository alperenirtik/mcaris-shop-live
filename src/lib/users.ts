import { prisma } from"@/lib/db";
import { hashPassword } from"@/lib/auth";
import crypto from"crypto";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { addresses: true },
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("Bu e-posta adresiyle zaten kayıtlı bir hesap var.");
  }

  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: data.name.trim(),
      phone: data.phone?.trim() || null,
      address: data.address?.trim() || null,
    },
  });
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string; address?: string }
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.phone !== undefined && { phone: data.phone.trim() || null }),
      ...(data.address !== undefined && { address: data.address.trim() || null }),
    },
  });
}

export async function createPasswordResetToken(email: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    // Return null silently or handle in caller to avoid user enumeration
    return null;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpires: expires,
    },
  });

  return { user, token };
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error("Geçersiz veya süresi dolmuş sıfırlama bağlantısı.");
  }

  const passwordHash = await hashPassword(newPassword);
  return prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  });
}

export async function getUserOrders(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) return [];

  const normalizedEmail = user.email.toLowerCase().trim();

  // Link any unlinked orders placed with this user's email
  await prisma.order.updateMany({
    where: {
      userId: null,
      customerEmail: { equals: normalizedEmail, mode:"insensitive" },
    },
    data: {
      userId: user.id,
    },
  }).catch(() => {});

  return prisma.order.findMany({
    where: {
      OR: [
        { userId: user.id },
        { customerEmail: { equals: normalizedEmail, mode:"insensitive" } },
      ],
    },
    include: {
      items: true,
    },
    orderBy: { createdAt:"desc" },
  });
}
