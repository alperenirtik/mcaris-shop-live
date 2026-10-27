import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const orderTrackingUpdateSchema = z.object({
  orderId: z.string().min(1, "Sipariş ID gereklidir."),
  status: z.enum(["pending", "paid", "shipped", "completed", "failed", "cancelled"]).optional(),
  carrier: z.string().optional(),
  trackingNumber: z.string().optional(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  estimatedDelivery: z.string().optional(),
});

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const rawBody = await request.json();
    const parsed = orderTrackingUpdateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { orderId, status, carrier, trackingNumber, driverName, driverPhone, estimatedDelivery } =
      parsed.data;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status ? { status } : {}),
        ...(carrier !== undefined ? { carrier } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        ...(driverName !== undefined ? { driverName } : {}),
        ...(driverPhone !== undefined ? { driverPhone } : {}),
        ...(estimatedDelivery !== undefined ? { estimatedDelivery } : {}),
      },
    });

    revalidatePath("/admin/canli-takip");
    revalidatePath("/siparis-takip");

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    console.error("Admin sipariş takip güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncelleme yapılamadı." }, { status: 500 });
  }
}