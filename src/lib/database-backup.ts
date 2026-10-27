import fs from "node:fs";
import path from "node:path";
import { prisma } from "./db";
import { createZipArchive, ZipEntry } from "./zip-archiver";

export interface DatabaseBackupStats {
  Category: number;
  Product: number;
  User: number;
  Address: number;
  Order: number;
  OrderItem: number;
  Cart: number;
  CartItem: number;
  Review: number;
  BlogPost: number;
  Coupon: number;
  Faq: number;
  StoreSetting: number;
  ContactMessage: number;
  [key: string]: number;
}

export interface BackupFileInfo {
  name: string;
  size: number;
  sizeFormatted: string;
  createdAt: string;
  extension: "sql" | "json" | "zip";
  isFullBackup?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatSqlValue(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  if (val instanceof Date) return `'${val.toISOString()}'`;
  if (typeof val === "object" && val !== null && "d" in val && "e" in val) {
    return `'${val.toString()}'`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "'{}'::text[]";
    const items = val.map((v) => `'${String(v).replace(/'/g, "''")}'`).join(", ");
    return `ARRAY[${items}]::text[]`;
  }
  if (typeof val === "object") {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

function generateTableInsertSql<T extends object>(tableName: string, rows: readonly T[]): string {
  if (!rows || rows.length === 0) {
    return `-- Tablo: "${tableName}" (0 kayıt)\n\n`;
  }

  const firstRow = rows[0] as Record<string, unknown>;
  const columns = Object.keys(firstRow);
  const quotedColumns = columns.map((c) => `"${c}"`).join(", ");

  let sql = `-- Tablo: "${tableName}" (${rows.length} kayıt)\n`;
  for (const row of rows) {
    const record = row as Record<string, unknown>;
    const values = columns.map((col) => formatSqlValue(record[col])).join(", ");
    sql += `INSERT INTO "${tableName}" (${quotedColumns}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
  }
  return sql + "\n";
}

export function getBackupDirectory(): string {
  const dir = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export async function getDatabaseStats(): Promise<{ stats: DatabaseBackupStats; totalRecords: number }> {
  const [
    category,
    product,
    user,
    address,
    order,
    orderItem,
    cart,
    cartItem,
    review,
    blogPost,
    coupon,
    faq,
    storeSetting,
    contactMessage,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.address.count(),
    prisma.order.count(),
    prisma.orderItem.count(),
    prisma.cart.count(),
    prisma.cartItem.count(),
    prisma.review.count(),
    prisma.blogPost.count(),
    prisma.coupon.count(),
    prisma.faq.count(),
    prisma.storeSetting.count(),
    prisma.contactMessage.count(),
  ]);

  const stats: DatabaseBackupStats = {
    Category: category,
    Product: product,
    User: user,
    Address: address,
    Order: order,
    OrderItem: orderItem,
    Cart: cart,
    CartItem: cartItem,
    Review: review,
    BlogPost: blogPost,
    Coupon: coupon,
    Faq: faq,
    StoreSetting: storeSetting,
    ContactMessage: contactMessage,
  };

  const totalRecords = Object.values(stats).reduce((acc, count) => acc + count, 0);
  return { stats, totalRecords };
}

export function getBackupFilesList(): BackupFileInfo[] {
  const backupDir = getBackupDirectory();
  try {
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith("backup-") && (f.endsWith(".json") || f.endsWith(".sql") || f.endsWith(".zip")))
      .map((fileName) => {
        const fullPath = path.join(backupDir, fileName);
        const stat = fs.statSync(fullPath);
        const ext = fileName.endsWith(".sql")
          ? ("sql" as const)
          : fileName.endsWith(".zip")
          ? ("zip" as const)
          : ("json" as const);
        return {
          name: fileName,
          size: stat.size,
          sizeFormatted: formatBytes(stat.size),
          createdAt: new Date(stat.mtimeMs).toISOString(),
          extension: ext,
          isFullBackup: fileName.includes("-full-"),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return files;
  } catch {
    return [];
  }
}

export function rotateOldBackups(maxKeep = 25): void {
  const backupDir = getBackupDirectory();
  try {
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith("backup-") && (f.endsWith(".json") || f.endsWith(".sql") || f.endsWith(".zip")))
      .map((f) => {
        const fullPath = path.join(backupDir, f);
        return { name: f, path: fullPath, time: fs.statSync(fullPath).mtimeMs };
      })
      .sort((a, b) => b.time - a.time);

    const jsonFiles = files.filter((f) => f.name.endsWith(".json"));
    const sqlFiles = files.filter((f) => f.name.endsWith(".sql"));
    const zipFiles = files.filter((f) => f.name.endsWith(".zip"));

    for (const file of jsonFiles.slice(maxKeep)) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
    }
    for (const file of sqlFiles.slice(maxKeep)) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
    }
    for (const file of zipFiles.slice(15)) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
    }
  } catch {}
}

export async function createDatabaseBackup(): Promise<{
  success: boolean;
  timestamp: string;
  totalRecords: number;
  stats: DatabaseBackupStats;
  jsonFileName: string;
  sqlFileName: string;
}> {
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
    now.getHours()
  )}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  const backupDir = getBackupDirectory();

  const [
    categories,
    products,
    users,
    addresses,
    orders,
    orderItems,
    carts,
    cartItems,
    reviews,
    blogPosts,
    coupons,
    faqs,
    storeSettings,
    contactMessages,
  ] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany(),
    prisma.user.findMany(),
    prisma.address.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
    prisma.cart.findMany(),
    prisma.cartItem.findMany(),
    prisma.review.findMany(),
    prisma.blogPost.findMany(),
    prisma.coupon.findMany(),
    prisma.faq.findMany(),
    prisma.storeSetting.findMany(),
    prisma.contactMessage.findMany(),
  ]);

  const stats: DatabaseBackupStats = {
    Category: categories.length,
    Product: products.length,
    User: users.length,
    Address: addresses.length,
    Order: orders.length,
    OrderItem: orderItems.length,
    Cart: carts.length,
    CartItem: cartItems.length,
    Review: reviews.length,
    BlogPost: blogPosts.length,
    Coupon: coupons.length,
    Faq: faqs.length,
    StoreSetting: storeSettings.length,
    ContactMessage: contactMessages.length,
  };

  const totalRecords = Object.values(stats).reduce((acc, count) => acc + count, 0);

  // 1. JSON Formatında Yedek
  const jsonBackup = {
    backupDate: now.toISOString(),
    timestamp,
    totalRecords,
    counts: stats,
    data: {
      categories,
      products,
      users,
      addresses,
      orders,
      orderItems,
      carts,
      cartItems,
      reviews,
      blogPosts,
      coupons,
      faqs,
      storeSettings,
      contactMessages,
    },
  };

  const jsonFileName = `backup-${timestamp}.json`;
  const jsonFilePath = path.join(backupDir, jsonFileName);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonBackup, null, 2), "utf-8");

  // 2. SQL Formatında Yedek (PostgreSQL uyumlu, FK kısıtlamalarını replica modunda aşar)
  let sqlDump = `-- ========================================================\n`;
  sqlDump += `-- MCARIS Shop PostgreSQL Canlı Veritabanı Yedeği\n`;
  sqlDump += `-- Tarih: ${now.toLocaleString("tr-TR")}\n`;
  sqlDump += `-- Toplam Kayıt: ${totalRecords}\n`;
  sqlDump += `-- ========================================================\n\n`;
  sqlDump += `SET session_replication_role = 'replica';\n\n`;

  sqlDump += generateTableInsertSql("Category", categories);
  sqlDump += generateTableInsertSql("Product", products);
  sqlDump += generateTableInsertSql("User", users);
  sqlDump += generateTableInsertSql("Address", addresses);
  sqlDump += generateTableInsertSql("Cart", carts);
  sqlDump += generateTableInsertSql("CartItem", cartItems);
  sqlDump += generateTableInsertSql("Order", orders);
  sqlDump += generateTableInsertSql("OrderItem", orderItems);
  sqlDump += generateTableInsertSql("Review", reviews);
  sqlDump += generateTableInsertSql("BlogPost", blogPosts);
  sqlDump += generateTableInsertSql("Coupon", coupons);
  sqlDump += generateTableInsertSql("Faq", faqs);
  sqlDump += generateTableInsertSql("StoreSetting", storeSettings);
  sqlDump += generateTableInsertSql("ContactMessage", contactMessages);

  sqlDump += `SET session_replication_role = 'origin';\n`;

  const sqlFileName = `backup-${timestamp}.sql`;
  const sqlFilePath = path.join(backupDir, sqlFileName);
  fs.writeFileSync(sqlFilePath, sqlDump, "utf-8");

  rotateOldBackups(25);

  return {
    success: true,
    timestamp,
    totalRecords,
    stats,
    jsonFileName,
    sqlFileName,
  };
}

/**
 * Veritabanı SQL/JSON dökümü ile public/uploads altındaki tüm görselleri ve faturaları
 * tek bir .ZIP arşivinde paketleyen Tam Sistem Yedeği oluşturur.
 */
export async function createFullSystemZipBackup(): Promise<{
  success: boolean;
  timestamp: string;
  zipFileName: string;
  fileCount: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  stats: DatabaseBackupStats;
}> {
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
    now.getHours()
  )}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  // Önce DB yedeğini oluştur
  const dbBackup = await createDatabaseBackup();
  const backupDir = getBackupDirectory();

  const entries: ZipEntry[] = [];

  // 1. SQL Dökümü
  const sqlPath = path.join(backupDir, dbBackup.sqlFileName);
  if (fs.existsSync(sqlPath)) {
    entries.push({
      path: "database.sql",
      data: fs.readFileSync(sqlPath),
    });
  }

  // 2. JSON Dökümü
  const jsonPath = path.join(backupDir, dbBackup.jsonFileName);
  if (fs.existsSync(jsonPath)) {
    entries.push({
      path: "database.json",
      data: fs.readFileSync(jsonPath),
    });
  }

  // 3. Ürün Görselleri (public/uploads/products)
  const uploadsProductsDir = path.resolve(process.cwd(), "public", "uploads", "products");
  if (fs.existsSync(uploadsProductsDir)) {
    const productFiles = fs.readdirSync(uploadsProductsDir);
    for (const file of productFiles) {
      if (file.startsWith(".")) continue;
      const fullPath = path.join(uploadsProductsDir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          entries.push({
            path: `uploads/products/${file}`,
            data: fs.readFileSync(fullPath),
          });
        }
      } catch {}
    }
  }

  // 4. Fatura Belgeleri (public/uploads/invoices)
  const uploadsInvoicesDir = path.resolve(process.cwd(), "public", "uploads", "invoices");
  if (fs.existsSync(uploadsInvoicesDir)) {
    const invoiceFiles = fs.readdirSync(uploadsInvoicesDir);
    for (const file of invoiceFiles) {
      if (file.startsWith(".")) continue;
      const fullPath = path.join(uploadsInvoicesDir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          entries.push({
            path: `uploads/invoices/${file}`,
            data: fs.readFileSync(fullPath),
          });
        }
      } catch {}
    }
  }

  // 5. Manifest / Meta Bilgi Dosyası
  const manifest = {
    system: "MCARIS Medikal E-Ticaret Platformu",
    type: "FULL_SYSTEM_BACKUP",
    date: now.toISOString(),
    timestamp,
    databaseStats: dbBackup.stats,
    totalRecords: dbBackup.totalRecords,
    archivedFilesCount: entries.length,
    description: "Bu arşiv veritabanı (SQL & JSON) ile tüm ürün ve fatura medya dosyalarını eksiksiz içerir.",
  };
  entries.push({
    path: "manifest.json",
    data: Buffer.from(JSON.stringify(manifest, null, 2), "utf-8"),
  });

  // ZIP Arşivini derle
  const zipBuffer = createZipArchive(entries);
  const zipFileName = `backup-full-${timestamp}.zip`;
  const zipFilePath = path.join(backupDir, zipFileName);
  fs.writeFileSync(zipFilePath, zipBuffer);

  rotateOldBackups(25);

  return {
    success: true,
    timestamp,
    zipFileName,
    fileCount: entries.length,
    totalSizeBytes: zipBuffer.length,
    totalSizeFormatted: formatBytes(zipBuffer.length),
    stats: dbBackup.stats,
  };
}

/**
 * Canlı sitede bulunan ancak yerel bilgisayarda (public/uploads) eksik olan tüm ürün ve blog
 * görsellerini HTTP üzerinden tarayıp yerel ortama indirir.
 */
export async function syncMissingMediaFromLive(liveBaseUrl?: string): Promise<{
  scannedCount: number;
  downloadedCount: number;
  skippedCount: number;
  errors: string[];
}> {
  const baseUrl = (
    liveBaseUrl ||
    process.env.LIVE_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://shop.mcaris.com.tr"
  ).replace(/\/+$/, "");

  console.log(`\n[Görsel Eşitleme] Canlı site taranıyor (${baseUrl})...`);

  const [products, blogPosts] = await Promise.all([
    prisma.product.findMany({ select: { images: true } }),
    prisma.blogPost.findMany({ select: { coverImage: true } }),
  ]);

  const uniquePaths = new Set<string>();

  for (const p of products) {
    for (const img of p.images || []) {
      if (img && typeof img === "string" && img.startsWith("/uploads/")) {
        uniquePaths.add(img);
      }
    }
  }

  for (const b of blogPosts) {
    if (b.coverImage && typeof b.coverImage === "string" && b.coverImage.startsWith("/uploads/")) {
      uniquePaths.add(b.coverImage);
    }
  }

  let downloadedCount = 0;
  let skippedCount = 0;
  const errors: string[] = [];

  for (const relPath of uniquePaths) {
    const cleanRelPath = relPath.replace(/^\/+/, "");
    const localFilePath = path.resolve(process.cwd(), "public", cleanRelPath);

    if (fs.existsSync(localFilePath)) {
      skippedCount++;
      continue;
    }

    const downloadUrl = `${baseUrl}${relPath}`;
    try {
      const parentDir = path.dirname(localFilePath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      const res = await fetch(downloadUrl);
      if (!res.ok) {
        errors.push(`${relPath} (HTTP ${res.status})`);
        continue;
      }

      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(localFilePath, Buffer.from(arrayBuffer));
      downloadedCount++;
      console.log(`   [İndirildi] ${relPath}`);
    } catch (err) {
      errors.push(`${relPath} (${err instanceof Error ? err.message : "Bağlantı hatası"})`);
    }
  }

  if (downloadedCount > 0) {
    console.log(`[Görsel Eşitleme Tamamlandı] Canlıdan ${downloadedCount} yeni görsel yerel ortama indirildi.`);
  } else {
    console.log(`[Görsel Eşitleme] Tüm görseller yerelde güncel (${skippedCount} görsel mevcut).`);
  }

  if (errors.length > 0) {
    console.warn(`[Uyarı] ${errors.length} görsel indirilemedi:`, errors.slice(0, 3));
  }

  return {
    scannedCount: uniquePaths.size,
    downloadedCount,
    skippedCount,
    errors,
  };
}
