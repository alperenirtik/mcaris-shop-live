export type Series ="platinum" |"gold" |"silver";

export type ProductSpec = Record<string, string>;

export interface ProductWithCategory {
  id: string;
  wcId: number | null;
  name: string;
  slug: string;
  sku?: string | null;
  price: string;
  shortDescription: string | null;
  description: string;
  searchKeywords?: string | null;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  series: Series | null;
  images: string[];
  specs: ProductSpec;
  stock: number;
  vatRate?: number | null;
  isDraft?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
