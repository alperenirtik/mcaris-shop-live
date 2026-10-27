import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Veritabanı canlı kurulum ve tohumlama başlatılıyor...");

  // 1. Admin Kullanıcı (admin@mcaris.com.tr)
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@mcaris.com.tr" },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: "admin@mcaris.com.tr",
      name: "MCARIS Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+903125110772",
      address: "Yenimahalle / Ankara",
    },
  });
  console.log("✅ Admin Kullanıcı Oluşturuldu: admin@mcaris.com.tr");

  // 1b. Tam yetkili admin (figen@mcaris.com.tr)
  const figenPasswordHash = await bcrypt.hash("Figen196565*", 10);
  await prisma.user.upsert({
    where: { email: "figen@mcaris.com.tr" },
    update: {
      passwordHash: figenPasswordHash,
      role: "ADMIN",
      name: "Figen",
    },
    create: {
      email: "figen@mcaris.com.tr",
      name: "Figen",
      passwordHash: figenPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin Kullanıcı Oluşturuldu: figen@mcaris.com.tr");

  // 2. 9 Ana Kategori Entegrasyonu
  const allowedCategories = [
    { name: "Platinum Hasta Yatakları", slug: "platinum-hasta-yataklari" },
    { name: "Gold Hasta Yatakları", slug: "gold-hasta-yataklari" },
    { name: "Silver Hasta Yatakları", slug: "silver-hasta-yataklari" },
    { name: "Muayene ve Bakım Masaları", slug: "muayene-ve-bakim-masalari" },
    { name: "Bakım Koltukları", slug: "bakim-koltuklari" },
    { name: "Medikal Kozmetik", slug: "medikal-kozmetik" },
    { name: "Tabure ve Sandalyeler", slug: "tabure-ve-sandalyeler" },
    { name: "Cihaz Sehpası", slug: "cihaz-sehpasi" },
    { name: "Dövme Kol Sehpaları", slug: "dovme-kol-sehpalari" },
  ];

  for (const cat of allowedCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  console.log("✅ 9 Ana Kategori Veritabanında Doğrulandı.");
  console.log("✅ Gerçek Kullanıcı Ürünleri Korundu. Sahte (Dummy) Ürün Eklenmedi.");

  // 3. Başlangıç İndirim Kuponları
  const initialCoupons = [
    {
      code: "MCARIS900",
      type: "fixed",
      value: 900,
      minSubtotal: 900,
      description: "900 TL Net İndirim",
      isActive: true,
    },
    {
      code: "FIRSAT900",
      type: "fixed",
      value: 900,
      minSubtotal: 900,
      description: "900 TL Özel Fırsat İndirimi",
      isActive: true,
    },
    {
      code: "HOSGELDIN200",
      type: "fixed",
      value: 200,
      minSubtotal: 1000,
      description: "1.000 TL üzeri 200 TL Net İndirim",
      isActive: true,
    },
    {
      code: "SAGLIK15",
      type: "percentage",
      value: 15,
      minSubtotal: 2500,
      description: "2.500 TL üzeri %15 Medikal İndirimi",
      isActive: true,
    },
  ];

  for (const c of initialCoupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log("✅ Başlangıç İndirim Kuponları Veritabanında Doğrulandı.");

  // 4. Blog Makaleleri Tohumlama (Veritabanı boşsa tohumla)
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    const blogBackupPath = path.join(process.cwd(), "prisma", "blog-posts-normalized.json");
    if (fs.existsSync(blogBackupPath)) {
      const postsData = JSON.parse(fs.readFileSync(blogBackupPath, "utf-8"));
      for (const p of postsData) {
        await prisma.blogPost.create({
          data: {
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || "",
            content: p.content,
            coverImage: p.coverImage,
            author: p.author || "MCARIS Medikal Uzman Heyeti",
            readTime: p.readTime || "4 dk okuma",
            category: p.category || "Hasta Bakımı",
            tags: p.tags || [],
            isPublished: p.isPublished ?? true,
          },
        });
      }
      console.log(`✅ ${postsData.length} Blog Makalesi Veritabanına Tohumlandı.`);
    }
  } else {
    console.log(`✅ Blog Makaleleri Veritabanında Mevcut (${blogCount} Makale).`);
  }
}

main()
  .catch((e) => {
    console.error("Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
