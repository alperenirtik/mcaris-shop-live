import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { question, answer, category, order, isActive } = body;

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json({ error: "Soru ve cevap alanları zorunludur." }, { status: 400 });
    }

    const created = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || "Karyola & Modeller",
        order: Number(order) || 0,
        isActive: isActive !== false,
      },
    });

    revalidatePath("/sss");
    revalidatePath("/admin/sss");
    return NextResponse.json({ success: true, faq: created });
  } catch (error) {
    console.error("FAQ POST Error:", error);
    return NextResponse.json({ error: "Soru oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, question, answer, category, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Soru ID'si gereklidir." }, { status: 400 });
    }

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json({ error: "Soru ve cevap alanları zorunludur." }, { status: 400 });
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || "Karyola & Modeller",
        order: Number(order) || 0,
        isActive: Boolean(isActive),
      },
    });

    revalidatePath("/sss");
    revalidatePath("/admin/sss");
    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    console.error("FAQ PUT Error:", error);
    return NextResponse.json({ error: "Soru güncellenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, isActive, order } = body;

    if (!id) {
      return NextResponse.json({ error: "Soru ID'si gereklidir." }, { status: 400 });
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    revalidatePath("/sss");
    revalidatePath("/admin/sss");
    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    console.error("FAQ PATCH Error:", error);
    return NextResponse.json({ error: "Durum güncellenirken hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Silinecek soru ID'si bulunamadı." }, { status: 400 });
    }

    await prisma.faq.delete({
      where: { id },
    });

    revalidatePath("/sss");
    revalidatePath("/admin/sss");
    return NextResponse.json({ success: true, message: "Soru başarıyla silindi." });
  } catch (error) {
    console.error("FAQ DELETE Error:", error);
    return NextResponse.json({ error: "Soru silinirken hata oluştu." }, { status: 500 });
  }
}
