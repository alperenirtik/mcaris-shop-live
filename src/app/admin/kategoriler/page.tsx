import { getCategoriesWithStats } from"@/lib/categories";
import CategoryManagerClient from"./CategoryManagerClient";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithStats();

  return (
    <CategoryManagerClient
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        parentId: c.parentId,
        parent: c.parent ? { id: c.parent.id, name: c.parent.name } : null,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        h1Title: c.h1Title,
        seoContent: c.seoContent,
        _count: c._count,
      }))}
    />
  );
}
