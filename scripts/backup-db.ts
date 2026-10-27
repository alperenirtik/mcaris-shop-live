import { Prisma, PrismaClient } from "@prisma/client";
import { createDatabaseBackup, DatabaseBackupStats, syncMissingMediaFromLive } from "../src/lib/database-backup";
import { prisma } from "../src/lib/db";

async function syncToLocalDatabase() {
  const localDbUrl = process.env.LOCAL_DATABASE_URL;
  if (!localDbUrl) {
    console.log("💡 [Yerel Eşitleme] LOCAL_DATABASE_URL ortam değişkeni tanımlı değil.");
    console.log("   Canlı veritabanı yedeği yerel 'backups/' klasörüne başarıyla indirildi.");
    console.log("   (Yerel PostgreSQL'e otomatik eşitleme için .env dosyasına LOCAL_DATABASE_URL ekleyebilirsiniz)\n");
    return;
  }

  console.log("🔄 [Yerel Eşitleme] Canlı veriler yerel veritabanına aktarılıyor...");
  const localPrisma = new PrismaClient({
    datasources: {
      db: { url: localDbUrl },
    },
  });

  try {
    // 1. Kategoriler
    const categories = await prisma.category.findMany();
    for (const cat of categories) {
      await localPrisma.category.upsert({
        where: { id: cat.id },
        update: { ...cat },
        create: { ...cat },
      });
    }

    // 2. Ürünler
    const products = await prisma.product.findMany();
    for (const prod of products) {
      const prodData = {
        ...prod,
        specs: prod.specs === null ? Prisma.JsonNull : (prod.specs as Prisma.InputJsonValue),
      };
      await localPrisma.product.upsert({
        where: { id: prod.id },
        update: prodData,
        create: prodData,
      });
    }

    // 3. Blog Yazıları
    const blogPosts = await prisma.blogPost.findMany();
    for (const post of blogPosts) {
      await localPrisma.blogPost.upsert({
        where: { id: post.id },
        update: { ...post },
        create: { ...post },
      });
    }

    // 4. SSS
    const faqs = await prisma.faq.findMany();
    for (const faq of faqs) {
      await localPrisma.faq.upsert({
        where: { id: faq.id },
        update: { ...faq },
        create: { ...faq },
      });
    }

    // 5. Kuponlar
    const coupons = await prisma.coupon.findMany();
    for (const coupon of coupons) {
      await localPrisma.coupon.upsert({
        where: { id: coupon.id },
        update: { ...coupon },
        create: { ...coupon },
      });
    }

    // 6. Mağaza Ayarları
    const storeSettings = await prisma.storeSetting.findMany();
    for (const setting of storeSettings) {
      await localPrisma.storeSetting.upsert({
        where: { id: setting.id },
        update: { ...setting },
        create: { ...setting },
      });
    }

    console.log(`✅ [Yerel Eşitleme Tamamlandı]`);
    console.log(`   - ${categories.length} Kategori`);
    console.log(`   - ${products.length} Ürün`);
    console.log(`   - ${blogPosts.length} Blog`);
    console.log(`   - ${faqs.length} SSS`);
    console.log(`   - ${coupons.length} Kupon`);
    console.log(`   - ${storeSettings.length} Ayar yerel veritabanınızla eşitlendi.\n`);
  } catch (syncError) {
    console.warn(
      "⚠️  [Yerel Eşitleme Uyarısı] Yerel veritabanına aktarım sırasında hata:",
      syncError instanceof Error ? syncError.message : syncError
    );
  } finally {
    await localPrisma.$disconnect();
  }
}

export async function runDatabaseBackup(): Promise<boolean> {
  console.log("\n📦 [Veritabanı Yedeği] Coolify PostgreSQL canlı veritabanı taranıyor...");

  try {
    const result = await createDatabaseBackup();

    console.log(`✅ [Yedek Başarılı] Toplam ${result.totalRecords} kayıt başarıyla arşivlendi.`);
    console.log(`   📄 JSON: backups/${result.jsonFileName}`);
    console.log(`   🗄️  SQL:  backups/${result.sqlFileName}\n`);

    // Tablo özetleri
    const s = result.stats as DatabaseBackupStats;
    console.log(
      `   📊 Tablo Dağılımı: ${s.Product} Ürün, ${s.Category} Kategori, ${s.Order} Sipariş, ${s.User} Kullanıcı, ${s.BlogPost} Blog\n`
    );

    // Eğer yerel veritabanı varsa eşitle
    await syncToLocalDatabase();

    // Canlıdaki eksik görselleri yerel public/uploads klasörüne eşitle
    await syncMissingMediaFromLive();

    return true;
  } catch (error) {
    console.warn(
      `⚠️  [Yedek Uyarısı] Veritabanı yedeği alınırken hata oluştu (Çevrimdışı/Erişim yok):`,
      error instanceof Error ? error.message : error
    );
    console.warn(`   Geliştirme sunucusu başlatılmaya devam ediliyor...\n`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.includes("backup-db")) {
  runDatabaseBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(0)); // Dev başlatılmasını engellememek için daima 0 ile çık
}
