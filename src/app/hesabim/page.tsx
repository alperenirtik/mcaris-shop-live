import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getUserById, getUserOrders } from "@/lib/users";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hesabım — MCARIS Medikal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const currentUser = await requireUser();
  const dbUser = await getUserById(currentUser.id);

  if (!dbUser) {
    // Fallback if deleted from DB
    return (
      <div className="max-w-container-max mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Kullanıcı hesabı bulunamadı.</p>
      </div>
    );
  }

  const orders = await getUserOrders(currentUser.id);

  return (
    <AccountClient
      user={{
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        address: dbUser.address,
        role: dbUser.role,
        addresses: dbUser.addresses,
      }}
      orders={orders}
    />
  );
}