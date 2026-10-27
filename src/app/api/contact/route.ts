import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().trim().min(2, "İsim en az 2 karakter olmalıdır.").max(100),
  phone: z.string().trim().min(7, "Geçerli bir telefon numarası giriniz.").max(25),
  email: z.string().trim().email("Geçerli bir e-posta adresi giriniz.").max(100),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(5, "Mesajınız en az 5 karakter olmalıdır.").max(3000),
  hp: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    // Honeypot spam bot engeli
    if (rawBody?.hp || rawBody?.website) {
      return NextResponse.json({ success: true });
    }

    const parsed = contactSchema.safeParse(rawBody);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Lütfen tüm zorunlu alanları geçerli şekilde doldurunuz.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, phone, email, subject, message } = parsed.data;

    // 1. Veritabanı kaydı
    await prisma.contactMessage.create({
      data: {
        name,
        phone,
        email,
        subject: subject || null,
        message,
      },
    }).catch((dbErr: unknown) => {
      console.warn("İletişim mesajı DB kaydı uyarısı:", dbErr);
    });

    // 2. Web3Forms e-posta servis eklentisi (info@mcaris.com.tr)
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (accessKey) {
      try {
        const web3FormData = new FormData();
        web3FormData.append("access_key", accessKey);
        web3FormData.append("name", name);
        web3FormData.append("phone", phone);
        web3FormData.append("email", email);
        web3FormData.append("subject", `[MCARIS İletişim Formu] ${subject || "Yeni Mesaj"}`);
        web3FormData.append("message", message);
        web3FormData.append("from_name", "MCARIS Sağlık İletişim Formu");

        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: web3FormData,
        });
      } catch (err: unknown) {
        console.warn("Web3Forms e-posta eklentisi uyarısı:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("İletişim formu API hatası:", error);
    return NextResponse.json({ error: "Mesaj iletilirken bir hata oluştu." }, { status: 500 });
  }
}
