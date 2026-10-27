"use server";

import { requireAdmin } from"@/lib/auth";
import { createProduct, updateProduct, deleteProduct } from "@/lib/products";
import { formatProductCode } from "@/lib/productCode";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Series } from "@prisma/client";

export interface ProductFormState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function createProductAction(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const name = (formData.get("name") as string ||"").trim();
  const slug = (formData.get("slug") as string ||"").trim();
  const priceStr = (formData.get("price") as string ||"0").trim();
  const stockStr = (formData.get("stock") as string ||"0").trim();
  const categoryId = (formData.get("categoryId") as string ||"").trim();
  const rawSeries = (formData.get("series") as string || "").trim().toLowerCase();
  const validSeries: Series[] = ["platinum", "gold", "silver"];
  const series: Series | null = validSeries.includes(rawSeries as Series) ? (rawSeries as Series) : null;
  const shortDescription = (formData.get("shortDescription") as string || "").trim();
  const description = (formData.get("description") as string || "").trim();
  const imagesRaw = (formData.get("images") as string || "").trim();
  const specsRaw = (formData.get("specsRaw") as string || formData.get("specs") as string || "{}").trim();
  const searchKeywords = (formData.get("searchKeywords") as string || "").trim();
  const rawSku = (formData.get("sku") as string || formData.get("productCode") as string || "").trim();
  const sku = rawSku ? formatProductCode(rawSku) : null;
  const vatRateStr = (formData.get("vatRate") as string || "").trim();
  const vatRate = vatRateStr ? parseInt(vatRateStr, 10) : null;

  if (!name) {
    return { error: "Ürün adı zorunludur." };
  }

  if (!categoryId) {
    return { error: "Lütfen bir kategori seçin." };
  }

  try {
    let images: string[] = [];
    if (imagesRaw.startsWith("[")) {
      images = JSON.parse(imagesRaw);
    } else if (imagesRaw) {
      images = imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    }

    let specs: Record<string, string> = {};
    if (specsRaw) {
      try {
        specs = JSON.parse(specsRaw);
      } catch {
        specs = {};
      }
    }

    const price = parseFloat(priceStr) || 0;
    const stock = parseInt(stockStr, 10) || 0;

    await createProduct({
      name,
      slug: slug || undefined,
      sku,
      price,
      vatRate,
      stock,
      categoryId,
      series,
      shortDescription: shortDescription || null,
      description,
      images,
      specs,
      searchKeywords: searchKeywords || null,
    });

    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ürün oluşturulurken hata oluştu.";
    return { error: msg };
  }

  redirect("/admin/urunler");
}

export async function updateProductAction(
  arg1: string | ProductFormState,
  arg2?: FormData | ProductFormState,
  arg3?: FormData
): Promise<ProductFormState> {
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
    return { error: "Ürün ID gereklidir." };
  }

  const name = (formData.get("name") as string || "").trim();
  const slug = (formData.get("slug") as string || "").trim();
  const priceStr = (formData.get("price") as string || "0").trim();
  const stockStr = (formData.get("stock") as string || "0").trim();
  const categoryId = (formData.get("categoryId") as string || "").trim();
  const rawSeries = (formData.get("series") as string || "").trim().toLowerCase();
  const validSeries: Series[] = ["platinum", "gold", "silver"];
  const series: Series | null = validSeries.includes(rawSeries as Series) ? (rawSeries as Series) : null;
  const shortDescription = (formData.get("shortDescription") as string || "").trim();
  const description = (formData.get("description") as string || "").trim();
  const imagesRaw = (formData.get("images") as string || "").trim();
  const specsRaw = (formData.get("specsRaw") as string || formData.get("specs") as string || "{}").trim();
  const searchKeywords = (formData.get("searchKeywords") as string || "").trim();
  const rawSku = (formData.get("sku") as string || formData.get("productCode") as string || "").trim();
  const sku = rawSku ? formatProductCode(rawSku) : null;
  const vatRateStr = (formData.get("vatRate") as string || "").trim();
  const vatRate = vatRateStr ? parseInt(vatRateStr, 10) : null;

  if (!name) {
    return { error: "Ürün adı zorunludur." };
  }

  try {
    let images: string[] = [];
    if (imagesRaw.startsWith("[")) {
      images = JSON.parse(imagesRaw);
    } else if (imagesRaw) {
      images = imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    }

    let specs: Record<string, string> = {};
    if (specsRaw) {
      try {
        specs = JSON.parse(specsRaw);
      } catch {
        specs = {};
      }
    }

    const price = parseFloat(priceStr) || 0;
    const stock = parseInt(stockStr, 10) || 0;

    await updateProduct(id, {
      name,
      slug: slug || undefined,
      sku,
      price,
      vatRate,
      stock,
      categoryId: categoryId || undefined,
      series,
      shortDescription: shortDescription || null,
      description,
      images,
      specs,
      searchKeywords: searchKeywords || null,
    });

    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
    if (slug) {
      revalidatePath(`/urun/${slug}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message :"Ürün güncellenirken hata oluştu.";
    return { error: msg };
  }

  redirect("/admin/urunler");
}

export async function deleteProductAction(idOrFormData: string | FormData): Promise<ProductFormState> {
  await requireAdmin();

  const id = typeof idOrFormData === "string" ? idOrFormData : (idOrFormData.get("id") as string || "").trim();

  if (!id) {
    return { error: "Ürün ID gereklidir." };
  }

  try {
    await deleteProduct(id);
    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
    return { success: true, message: "Ürün başarıyla silindi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ürün silinirken hata oluştu.";
    return { error: msg };
  }
}

export async function quickUpdateProductAction(
  id: string,
  data: { price?: number | string; stock?: number; vatRate?: number | null }
): Promise<{
  success?: boolean;
  error?: string;
  updated?: { id: string; price: string; stock: number; vatRate: number | null };
}> {
  await requireAdmin();

  if (!id) {
    return { error: "Ürün ID gereklidir." };
  }

  try {
    const { quickUpdateProduct } = await import("@/lib/products");
    const updated = await quickUpdateProduct(id, data);
    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
    revalidatePath(`/urun/${updated.slug}`);
    return {
      success: true,
      updated: {
        id: updated.id,
        price: updated.price,
        stock: updated.stock,
        vatRate: updated.vatRate ?? null,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Hızlı güncelleme başarısız.";
    return { error: msg };
  }
}

export async function duplicateProductAction(id: string): Promise<{ success?: boolean; error?: string; duplicatedProduct?: { id: string; name: string; slug: string } }> {
  await requireAdmin();

  if (!id) {
    return { error: "Ürün ID gereklidir." };
  }

  try {
    const { duplicateProduct } = await import("@/lib/products");
    const duplicated = await duplicateProduct(id);
    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
    return {
      success: true,
      duplicatedProduct: {
        id: duplicated.id,
        name: duplicated.name,
        slug: duplicated.slug,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ürün çoğaltılırken hata oluştu.";
    return { error: msg };
  }
}

export async function bulkUpdateProductsAction(params: {
  productIds: string[];
  action: "adjust_price_percent" | "set_stock" | "change_category" | "delete";
  value?: number | string;
}): Promise<{ success?: boolean; error?: string; affectedCount?: number }> {
  await requireAdmin();

  try {
    const { bulkUpdateProducts } = await import("@/lib/products");
    const res = await bulkUpdateProducts(params);
    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
    return { success: true, affectedCount: res.affectedCount };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Toplu işlem sırasında hata oluştu.";
    return { error: msg };
  }
}

export async function toggleProductDraftAction(id: string): Promise<{ success: boolean; isDraft?: boolean; error?: string }> {
  await requireAdmin();
  if (!id) return { success: false, error: "Ürün ID gereklidir." };

  try {
    const { prisma } = await import("@/lib/db");
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Ürün bulunamadı." };

    const updated = await prisma.product.update({
      where: { id },
      data: { isDraft: !existing.isDraft },
    });

    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
    return { success: true, isDraft: updated.isDraft };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Durum güncellenirken hata oluştu.";
    return { success: false, error: msg };
  }
}