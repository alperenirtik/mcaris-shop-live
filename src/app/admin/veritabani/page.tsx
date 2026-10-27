import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDatabaseStats, getBackupFilesList } from "@/lib/database-backup";
import DatabaseBackupClient from "./DatabaseBackupClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Veritabanı & Canlı Yedekleme | MCARIS Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDatabaseBackupPage() {
  await requireAdmin();

  const { stats, totalRecords } = await getDatabaseStats();
  const files = getBackupFilesList();

  return (
    <DatabaseBackupClient
      initialStats={stats}
      initialTotalRecords={totalRecords}
      initialFiles={files}
    />
  );
}
