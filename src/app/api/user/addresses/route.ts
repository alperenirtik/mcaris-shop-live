import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const addressSchema = z.object({
  title: z.string().min(1, "Adres başlığı gereklidir."),
  fullText: z.string().min(5, "Adres detayları en az 5 karakter olmalıdır."),
  city: z.string().min(2, "Şehir adı gereklidir."),
  district: z.string().min(2, "İlçe adı gereklidir."),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const rawBody = await req.json();
    const parsed = addressSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz adres verisi.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { title, fullText, city, district, isDefault } = parsed.data;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        title,
        fullText,
        city,
        district,
        isDefault: isDefault || false,
      },
    });

    revalidatePath("/hesabim");
    return NextResponse.json(address);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID eksik" }, { status: 400 });

    await prisma.address.delete({
      where: { id, userId: user.id },
    });

    revalidatePath("/hesabim");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
