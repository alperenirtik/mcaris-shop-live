import { getCategories } from"@/lib/categories";
import ProductFormClient from"../ProductFormClient";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <ProductFormClient categories={categories} />
  );
}
