import { getCategories } from"@/lib/categories";
import { getProductById } from"@/lib/products";
import { notFound } from"next/navigation";
import ProductFormClient from"../ProductFormClient";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductFormClient
      categories={categories}
      initialData={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        vatRate: product.vatRate,
        categoryId: product.categoryId,
        series: product.series,
        shortDescription: product.shortDescription,
        description: product.description,
        images: product.images,
        specs: product.specs,
        searchKeywords: product.searchKeywords,
        sku: product.sku,
      }}
    />
  );
}
