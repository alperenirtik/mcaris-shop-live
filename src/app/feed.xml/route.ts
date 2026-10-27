import { generateProductFeedXml } from "@/lib/feed-generator";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || searchParams.get("cat") || searchParams.get("kategori") || undefined;

  return generateProductFeedXml({
    categorySlug: category,
  });
}
