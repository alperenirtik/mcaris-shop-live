import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yönetim Paneli | MCARIS Medikal",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter antialiased">
      {/* Sidebar */}
      <AdminSidebar user={{ name: adminUser.name, email: adminUser.email }} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Modern Admin Topbar */}
        <AdminTopbar user={{ name: adminUser.name, email: adminUser.email }} />

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}