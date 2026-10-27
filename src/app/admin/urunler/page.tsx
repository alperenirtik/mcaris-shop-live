import { prisma } from"@/lib/db";
import { getCategories } from"@/lib/categories";
import ProductListClient from"./ProductListClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt:"desc" },
    }),
    getCategories(),
  ]);

  return (
    <ProductListClient
      products={products.map((p) => ({
        id: p.id,
        wcId: p.wcId,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        price: p.price.toString(),
        stock: p.stock,
        vatRate: p.vatRate,
        isDraft: p.isDraft,
        series: p.series,
        category: p.category,
        images: p.images,
        specs: (p.specs as Record<string, string>) || {},
        createdAt: p.createdAt,
      }))}
      categories={categories}
    />
  );
}
