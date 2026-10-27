import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import BlogManagerClient from "./BlogManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin();

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <BlogManagerClient initialPosts={posts} />;
}
