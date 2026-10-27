import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getDatabaseStats,
  getBackupFilesList,
  createDatabaseBackup,
  createFullSystemZipBackup,
  getBackupDirectory,
} from "@/lib/database-backup";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const downloadFileName = searchParams.get("download");

  // Dosya İndirme Talebi (.sql, .json, .zip)
  if (downloadFileName) {
    const safeRegex = /^backup-[\w\-.]+\.(json|sql|zip)$/;
    if (!safeRegex.test(downloadFileName)) {
      return NextResponse.json({ error: "Geçersiz dosya adı." }, { status: 400 });
    }

    const backupDir = getBackupDirectory();
    const filePath = path.join(backupDir, downloadFileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "İstenen yedek dosyası bulunamadı." }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    let contentType = "application/json";
    if (downloadFileName.endsWith(".sql")) {
      contentType = "application/sql";
    } else if (downloadFileName.endsWith(".zip")) {
      contentType = "application/zip";
    }

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": `${contentType}; charset=utf-8`,
        "Content-Disposition": `attachment; filename="${downloadFileName}"`,
        "Content-Length": String(fileBuffer.length),
      },
    });
  }

  // Durum ve Mevcut Dosyaları Listeleme Talebi
  try {
    const { stats, totalRecords } = await getDatabaseStats();
    const files = getBackupFilesList();

    return NextResponse.json({
      success: true,
      stats,
      totalRecords,
      files,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Veritabanı bilgileri alınamadı.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Yetkisiz erişim. Lütfen giriş yapın." }, { status: 401 });
  }

  try {
    let type = "database";
    try {
      const body = await request.json();
      if (body && body.type === "full") {
        type = "full";
      }
    } catch {
      // Body boşsa varsayılan olarak "database" çalışır
    }

    if (type === "full") {
      const result = await createFullSystemZipBackup();
      return NextResponse.json({
        success: true,
        message: `Tam sistem yedeği (.ZIP) başarıyla oluşturuldu (${result.fileCount} dosya arşivlendi: Veritabanı + Tüm Görseller).`,
        backup: result,
      });
    }

    const result = await createDatabaseBackup();
    return NextResponse.json({
      success: true,
      message: `Veritabanı yedeği başarıyla alındı (${result.totalRecords} kayıt arşivlendi).`,
      backup: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yedek alınırken hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
