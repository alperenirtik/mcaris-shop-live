import { prisma } from"@/lib/db";
import { requireAdmin } from"@/lib/auth";
import AdminUsersClient from"./AdminUsersClient";
import type { Metadata } from"next";

export const metadata: Metadata = {
  title:"Kullanıcı & Yetki Yönetimi — MCARIS Admin",
  description:"Kullanıcı yetkilerini ve rollerini yönetin.",
};

export const dynamic ="force-dynamic";
export const revalidate = 0;

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt:"desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: { orders: true },
      },
    },
  });

  return (
    <div className="space-y-6 font-inter">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <span className="text-[10px] md:text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">Kullanıcı Veritabanı</span>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-inter">Kullanıcı &amp; Yetkilendirme Kontrolü</h1>
        </div>
      </div>

      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
