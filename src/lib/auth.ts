import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "mcaris-super-secret-jwt-key-change-in-prod";
export const AUTH_COOKIE_NAME = "mcaris_session";

export interface AuthPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createAuthToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function requireUser(): Promise<AuthPayload> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/giris");
  }

  // Database verification to ensure account is active
  let dbUser: AuthPayload | null = null;
  let dbError = false;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true },
    });
  } catch {
    dbError = true;
  }

  if (dbError) {
    return user;
  }

  if (!dbUser) {
    await clearAuthCookie();
    redirect("/giris");
  }
  return dbUser;
}

export async function requireAdmin(): Promise<AuthPayload> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/giris?redirect=/admin");
  }

  // Database verification to prevent stale JWT role elevation
  let dbUser: AuthPayload | null = null;
  let dbError = false;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true },
    });
  } catch {
    dbError = true;
  }

  if (dbError) {
    await clearAuthCookie();
    redirect("/giris?redirect=/admin");
  }

  if (!dbUser || dbUser.role !== "ADMIN") {
    await clearAuthCookie();
    redirect("/giris?redirect=/admin");
  }
  return dbUser;
}
