import { generateProductFeedXml } from "@/lib/feed-generator";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  return generateProductFeedXml({
    categorySlug: category,
  });
}
