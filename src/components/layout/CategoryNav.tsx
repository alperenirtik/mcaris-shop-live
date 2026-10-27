import { getCategories } from"@/lib/categories";
import CategoryNavClient from"./CategoryNavClient";

export default async function CategoryNav() {
  const categories = await getCategories();

  return <CategoryNavClient categories={categories} />;
}
