import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***@***.com";
  const [local, domain] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `${digits.slice(0, 3)} *** ** ${digits.slice(-2)}`;
}

function maskAddress(address: string): string {
  if (!address) return "";
  const parts = address.split(",");
  if (parts.length > 1) {
    const districtCity = parts.pop()?.trim() || address;
    return `***, ${districtCity}`;
  }
  return "***, Ankara";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId")?.trim();
    const phone = searchParams.get("phone")?.trim();

    if (!orderId) {
      return NextResponse.json(
        { error: "Lütfen geçerli bir Sipariş Numarası giriniz." },
        { status: 400 }
      );
    }

    const candidate = await prisma.order.findFirst({
      where: {
        OR: [
          { id: { equals: orderId, mode: "insensitive" } },
          { accessToken: { equals: orderId, mode: "insensitive" } },
        ],
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: true },
            },
          },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Sipariş bulunamadı. Lütfen bilgilerinizi kontrol ediniz." },
        { status: 404 }
      );
    }

    // Telefon kontrolü
    if (phone) {
      const reqDigits = phone.replace(/\D/g, "");
      const dbDigits = candidate.customerPhone.replace(/\D/g, "");
      if (reqDigits.length >= 4 && !dbDigits.endsWith(reqDigits.slice(-4)) && !reqDigits.endsWith(dbDigits.slice(-4))) {
        return NextResponse.json(
          { error: "Sipariş numarası ile telefon numarası uyuşmuyor." },
          { status: 403 }
        );
      }
    }

    const currentUser = await getCurrentUser();
    const isOwnerOrAdmin = currentUser && (currentUser.role === "ADMIN" || currentUser.id === candidate.userId || currentUser.email === candidate.customerEmail);

    // Açık veri sızıntısını engellemek için hassas alanları maskele
    const sanitizedOrder = {
      id: candidate.id,
      accessToken: isOwnerOrAdmin ? candidate.accessToken : undefined,
      status: candidate.status,
      customerName: isOwnerOrAdmin ? candidate.customerName : (candidate.customerName.split(" ")[0] || "") + " ***",
      customerPhone: isOwnerOrAdmin ? candidate.customerPhone : maskPhone(candidate.customerPhone),
      customerEmail: isOwnerOrAdmin ? candidate.customerEmail : maskEmail(candidate.customerEmail),
      shippingAddress: isOwnerOrAdmin ? candidate.shippingAddress : maskAddress(candidate.shippingAddress),
      subtotal: candidate.subtotal.toString(),
      shippingCost: candidate.shippingCost.toString(),
      total: candidate.total.toString(),
      carrier: candidate.carrier,
      trackingNumber: candidate.trackingNumber,
      driverName: candidate.driverName,
      driverPhone: candidate.driverPhone,
      driverPhoto: candidate.driverPhoto,
      assistantName: candidate.assistantName,
      assistantPhoto: candidate.assistantPhoto,
      estimatedDelivery: candidate.estimatedDelivery,
      lat: candidate.lat,
      lng: candidate.lng,
      createdAt: candidate.createdAt,
      items: candidate.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        unitPrice: item.unitPrice.toString(),
        quantity: item.quantity,
        lineTotal: item.lineTotal.toString(),
        product: item.product,
      })),
    };

    return NextResponse.json({ order: sanitizedOrder });
  } catch (error) {
    console.error("Sipariş takip API hatası:", error);
    return NextResponse.json(
      { error: "Sipariş bilgileri alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}

