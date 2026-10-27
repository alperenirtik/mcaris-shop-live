/**
 * QR Menü ürününü vitrinden kaldır (draft + stok 0).
 */
import { PrismaClient } from "@prisma/client";

async function main() {
  const p = new PrismaClient();
  const rows = await p.product.findMany({
    where: {
      OR: [
        { sku: { contains: "QR", mode: "insensitive" } },
        { slug: { contains: "qr-menu", mode: "insensitive" } },
        { name: { contains: "QR Menü", mode: "insensitive" } },
        { name: { contains: "QR Menu", mode: "insensitive" } },
        { sku: { equals: "MCQRMENUPRO", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      sku: true,
      slug: true,
      name: true,
      isDraft: true,
      stock: true,
    },
  });
  console.log("found", rows.length, rows);
  for (const r of rows) {
    const u = await p.product.update({
      where: { id: r.id },
      data: { stock: 0, isDraft: true },
    });
    console.log("delisted", u.sku, u.slug, "stock", u.stock, "draft", u.isDraft);
  }
  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
