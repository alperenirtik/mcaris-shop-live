import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BlogPostSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  slug: z.string().min(3, "Slug en az 3 karakter olmalıdır"),
  excerpt: z.string().optional().default(""),
  content: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
  category: z.string().default("Hasta Bakımı"),
  coverImage: z.string().nullable().optional(),
  readTime: z.string().default("4 dk okuma"),
  isPublished: z.boolean().default(true),
});

const BlogPostUpdateSchema = BlogPostSchema.extend({
  id: z.string().min(1, "ID gereklidir"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    const result = BlogPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: result.error.format() },
        { status: 400 }
      );
    }

    const { title, slug, excerpt, content, category, coverImage, readTime, isPublished } = result.data;

    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu URL slug zaten kullanımda, lütfen farklı bir slug girin." },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        readTime,
        author: "MCARIS Medikal Uzman Heyeti",
        isPublished,
        tags: [category, "Hasta Bakımı", "Medikal Rehber"],
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/blog error:", error);
    return NextResponse.json(
      { error: "Makale kaydedilirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const body = await req.json();
    const result = BlogPostUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: result.error.format() },
        { status: 400 }
      );
    }

    const { id, title, slug, excerpt, content, category, coverImage, readTime, isPublished } = result.data;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        readTime,
        isPublished,
        tags: [category, "Hasta Bakımı", "Medikal Rehber"],
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("PUT /api/admin/blog error:", error);
    return NextResponse.json(
      { error: "Makale güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { id, isPublished } = await req.json();
    if (!id || typeof isPublished !== "boolean") {
      return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("PATCH /api/admin/blog error:", error);
    return NextResponse.json(
      { error: "Durum güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id parametresi zorunludur" }, { status: 400 });
    }

    const post = await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("DELETE /api/admin/blog error:", error);
    return NextResponse.json(
      { error: "Makale silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
