import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const driverLocationSchema = z.object({
  orderId: z.string().min(1, "Sipariş ID gereklidir."),
  action: z.enum(["update", "complete"]).optional(),
  lat: z.union([z.number(), z.string()]).optional(),
  lng: z.union([z.number(), z.string()]).optional(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  driverPhoto: z.string().optional(),
  assistantName: z.string().optional(),
  assistantPhoto: z.string().optional(),
  carrier: z.string().optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parsed = driverLocationSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz konum verisi.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      orderId,
      lat,
      lng,
      action,
      driverName,
      driverPhone,
      driverPhoto,
      assistantName,
      assistantPhoto,
      carrier,
    } = parsed.data;

    if (action === "complete") {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "completed",
        },
      });
      revalidatePath("/admin/canli-takip");
      revalidatePath("/siparis-takip");
      return NextResponse.json({ ok: true, order });
    }

    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: "Konum koordinatları (lat, lng) eksik." }, { status: 400 });
    }

    const parsedLat = typeof lat === "string" ? parseFloat(lat) : lat;
    const parsedLng = typeof lng === "string" ? parseFloat(lng) : lng;

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return NextResponse.json({ error: "Geçersiz koordinat değerleri." }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "shipped",
        lat: parsedLat,
        lng: parsedLng,
        ...(driverName ? { driverName } : {}),
        ...(driverPhone ? { driverPhone } : {}),
        ...(driverPhoto ? { driverPhoto } : {}),
        ...(assistantName ? { assistantName } : {}),
        ...(assistantPhoto ? { assistantPhoto } : {}),
        ...(carrier ? { carrier } : {}),
      },
    });

    revalidatePath("/admin/canli-takip");
    revalidatePath("/siparis-takip");

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    console.error("Şoför konum API hatası:", error);
    return NextResponse.json({ error: "Konum güncellenemedi." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const token = searchParams.get("accessToken") || searchParams.get("token");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID gerekli" }, { status: 400 });
    }

    const user = await getCurrentUser();
    const isAdmin = user?.role === "ADMIN";

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        accessToken: true,
        userId: true,
        status: true,
        lat: true,
        lng: true,
        driverName: true,
        driverPhone: true,
        driverPhoto: true,
        assistantName: true,
        assistantPhoto: true,
        estimatedDelivery: true,
        carrier: true,
        updatedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    }

    const isAuthorized = isAdmin || (Boolean(token) && token === order.accessToken) || (Boolean(user) && user?.id === order.userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Yetkisiz erişim. Geçerli erişim kodu gereklidir." }, { status: 403 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        lat: order.lat,
        lng: order.lng,
        driverName: order.driverName,
        driverPhone: order.driverPhone,
        driverPhoto: order.driverPhoto,
        assistantName: order.assistantName,
        assistantPhoto: order.assistantPhoto,
        estimatedDelivery: order.estimatedDelivery,
        carrier: order.carrier,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Konum sorgulama hatası:", error);
    return NextResponse.json({ error: "Sorgu hatası." }, { status: 500 });
  }
}
