"use server";

import { requireAdmin } from"@/lib/auth";
import { createCategory, updateCategory, deleteCategory } from"@/lib/categories";
import { revalidatePath } from"next/cache";

export interface CategoryFormState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function createCategoryAction(prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin();

  const name = (formData.get("name") as string || "").trim();
  const slug = (formData.get("slug") as string || "").trim();
  const parentId = (formData.get("parentId") as string || "").trim();
  const metaTitle = (formData.get("metaTitle") as string || "").trim();
  const metaDescription = (formData.get("metaDescription") as string || "").trim();
  const h1Title = (formData.get("h1Title") as string || "").trim();
  const seoContent = (formData.get("seoContent") as string || "").trim();

  if (!name) {
    return { error: "Kategori adı zorunludur." };
  }

  try {
    const created = await createCategory({
      name,
      slug: slug || undefined,
      parentId: parentId || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      h1Title: h1Title || null,
      seoContent: seoContent || null,
    });
    revalidatePath("/admin/kategoriler");
    revalidatePath("/");
    revalidatePath("/urunler");
    revalidatePath(`/kategori/${created.slug}`);
    revalidatePath("/sitemap.xml");
    return { success: true, message: "Kategori başarıyla oluşturuldu." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kategori oluşturulurken hata oluştu.";
    return { error: msg };
  }
}

export async function updateCategoryAction(
  arg1: string | CategoryFormState,
  arg2?: FormData | CategoryFormState,
  arg3?: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  let id = "";
  let formData: FormData;

  if (typeof arg1 === "string") {
    id = arg1;
    formData = (arg3 || arg2) as FormData;
  } else {
    formData = arg2 as FormData;
    id = (formData.get("id") as string || "").trim();
  }

  if (!id) {
    return { error: "Kategori ID gereklidir." };
  }

  const name = (formData.get("name") as string || "").trim();
  const slug = (formData.get("slug") as string || "").trim();
  const parentId = (formData.get("parentId") as string || "").trim();
  const metaTitle = formData.has("metaTitle") ? (formData.get("metaTitle") as string || "").trim() : undefined;
  const metaDescription = formData.has("metaDescription") ? (formData.get("metaDescription") as string || "").trim() : undefined;
  const h1Title = formData.has("h1Title") ? (formData.get("h1Title") as string || "").trim() : undefined;
  const seoContent = formData.has("seoContent") ? (formData.get("seoContent") as string || "").trim() : undefined;

  if (!name) {
    return { error: "Kategori adı zorunludur." };
  }

  try {
    const updated = await updateCategory(id, {
      name,
      slug: slug || undefined,
      parentId: parentId || null,
      metaTitle,
      metaDescription,
      h1Title,
      seoContent,
    });
    revalidatePath("/admin/kategoriler");
    revalidatePath("/");
    revalidatePath("/urunler");
    revalidatePath(`/kategori/${updated.slug}`);
    revalidatePath("/sitemap.xml");
    return { success: true, message: "Kategori başarıyla güncellendi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kategori güncellenirken hata oluştu.";
    return { error: msg };
  }
}

export async function deleteCategoryAction(idOrFormData: string | FormData): Promise<CategoryFormState> {
  await requireAdmin();

  const id = typeof idOrFormData === "string" ? idOrFormData : (idOrFormData.get("id") as string || "").trim();

  if (!id) {
    return { error: "Kategori ID gereklidir." };
  }

  try {
    await deleteCategory(id);
    revalidatePath("/admin/kategoriler");
    revalidatePath("/");
    revalidatePath("/urunler");
    return { success: true, message: "Kategori başarıyla silindi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kategori silinirken hata oluştu.";
    return { error: msg };
  }
}