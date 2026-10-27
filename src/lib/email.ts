import nodemailer from "nodemailer";
import { Resend } from "resend";
import { formatPrice } from "./format";
import { BUSINESS_ADDRESS } from "./constants";

interface OrderWithItems {
  id: string;
  accessToken: string;
  customerName: string;
  customerEmail: string;
  total: string;
  items: Array<{ productName: string; quantity: number; unitPrice: string }>;
}

/* ──────────────────── Transport Helpers ──────────────────── */

/**
 * Birincil: cPanel SMTP transporter
 *   SMTP_HOST  = mail.mcaris.com.tr
 *   SMTP_PORT  = 465 (SSL) veya 587 (STARTTLS)
 *   SMTP_USER  = info@mcaris.com.tr
 *   SMTP_PASS  = e-posta şifresi
 */
function createSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

/**
 * Yedek: Resend API client (opsiyonel)
 *   RESEND_API_KEY      = re_xxxxx
 *   RESEND_FROM_EMAIL   = MCARIS <info@mcaris.com.tr>
 */
function createResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function smtpSenderAddress(): string {
  const name = process.env.SMTP_FROM_NAME ||"MCARIS";
  const email = process.env.SMTP_USER ||"info@mcaris.com.tr";
  return `"${name}" <${email}>`;
}

function resendSenderAddress(): string {
  return process.env.RESEND_FROM_EMAIL ||"MCARIS <info@mcaris.com.tr>";
}

function itemsSummary(items: OrderWithItems["items"]): string {
  return items.map((item) => `${item.productName} x${item.quantity} — ${formatPrice(item.unitPrice)}`).join("\n");
}

/* ──────────────────── Sipariş Onay E-Postası (Müşteriye) ──────────────────── */

export async function sendOrderConfirmationEmail(order: OrderWithItems): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL ||"http://localhost:3000";
  const trackingUrl = `${appUrl}/siparis/${order.accessToken}/tesekkurler`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 16px; font-weight: bold; color: #1e293b;">${item.productName}</td>
        <td style="padding: 12px 16px; text-align: center; color: #64748b;">${item.quantity} adet</td>
        <td style="padding: 12px 16px; text-align: right; font-weight: bold; color: #0284c7;">${formatPrice(item.unitPrice)}</td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #38bdf8;">MCARIS Medikal</h1>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #94a3b8;">Siparişiniz Başarıyla Alındı</p>
      </div>

      <div style="padding: 32px; color: #334155;">
        <h2 style="font-size: 18px; font-weight: 700; margin-top: 0;">Sayın ${order.customerName},</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          MCARIS Medikal'i tercih ettiğiniz için teşekkür ederiz. <strong>#${order.id}</strong> numaralı siparişiniz sistemimize ulaşmış ve hazırlanmaya başlanmıştır.
        </p>

        <div style="margin: 24px 0; background-color: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Sipariş Özeti</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 2px solid #cbd5e1; text-align: left; color: #475569;">
                <th style="padding: 8px 16px;">Ürün</th>
                <th style="padding: 8px 16px; text-align: center;">Adet</th>
                <th style="padding: 8px 16px; text-align: right;">Tutar</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; text-align: right;">
            <span style="font-size: 14px; font-weight: 600; color: #64748b;">Toplam Tutar: </span>
            <span style="font-size: 20px; font-weight: 800; color: #0284c7;">${formatPrice(order.total)}</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${trackingUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 10px rgba(2,132,199,0.25);">
            Canli Kurye & Siparis Takibi →
          </a>
        </div>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">MCARIS Medikal • ${BUSINESS_ADDRESS}</p>
        <p style="margin: 4px 0 0 0;">Müşteri Hizmetleri: 0536 820 02 69 • info@mcaris.com.tr</p>
      </div>
    </div>
  `;

  const subject = `Sipariş Onayı — #${order.id} (MCARIS Medikal)`;
  const plainText = `Sayın ${order.customerName},\n\nSiparişiniz alındı.\nSipariş No: #${order.id}\n\n${itemsSummary(order.items)}\n\nToplam: ${formatPrice(order.total)}\n\nSipariş Takibi: ${trackingUrl}`;

  // 1. Birincil: SMTP (cPanel Webmail)
  const transporter = createSmtpTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: smtpSenderAddress(),
        to: order.customerEmail,
        subject,
        html: htmlContent,
        text: plainText,
      });
      console.log(`[ORDER CONFIRMATION EMAIL SENT VIA SMTP] Customer: ${order.customerEmail} | Order: ${order.id}`);
      return;
    } catch (error) {
      console.error("SMTP sipariş onay e-postası gönderilemedi:", error);
    }
  }

  // 2. Yedek: Resend API
  const resend = createResendClient();
  if (resend) {
    try {
      const result = await resend.emails.send({
        from: resendSenderAddress(),
        to: order.customerEmail,
        subject,
        html: htmlContent,
        text: plainText,
      });
      if (result.error) {
        console.error("Resend sipariş e-postası hatası:", result.error);
      } else {
        console.log(`[ORDER CONFIRMATION EMAIL SENT VIA RESEND] Customer: ${order.customerEmail} | Order: ${order.id}`);
        return;
      }
    } catch (error) {
      console.error("Resend e-postası gönderilemedi:", error);
    }
  }

  console.warn("[EMAIL] SMTP ve Resend yapılandırılmadı veya ikisi de başarısız oldu.");
  console.log(`[ORDER CONFIRMATION DISPATCHED] Customer: ${order.customerEmail} | Order: ${order.id}`);
}

/* ──────────────────── Yeni Sipariş Bildirimi (İşletmeye) ──────────────────── */

export async function sendOrderNotificationEmail(order: OrderWithItems): Promise<void> {
  const notifyAddress = process.env.ORDER_NOTIFICATION_EMAIL ||"info@mcaris.com.tr";
  if (!notifyAddress) return;

  const subject = `Yeni Sipariş Bildirimi — #${order.id}`;
  const plainText = `Yeni sipariş alındı.\n\nMüşteri: ${order.customerName} (${order.customerEmail})\n\n${itemsSummary(order.items)}\n\nToplam: ${formatPrice(order.total)}`;

  // 1. Birincil: SMTP
  const transporter = createSmtpTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: smtpSenderAddress(),
        to: notifyAddress,
        subject,
        text: plainText,
      });
      console.log(`[ORDER NOTIFICATION EMAIL SENT VIA SMTP] To: ${notifyAddress} | Order: ${order.id}`);
      return;
    } catch (error) {
      console.error("SMTP sipariş bildirim e-postası gönderilemedi:", error);
    }
  }

  // 2. Yedek: Resend
  const resend = createResendClient();
  if (resend) {
    try {
      const result = await resend.emails.send({
        from: resendSenderAddress(),
        to: notifyAddress,
        subject,
        text: plainText,
      });
      if (result.error) {
        console.error("Resend sipariş bildirim hatası:", result.error);
      } else {
        console.log(`[ORDER NOTIFICATION EMAIL SENT VIA RESEND] To: ${notifyAddress} | Order: ${order.id}`);
        return;
      }
    } catch (error) {
      console.error("Resend bildirim e-postası gönderilemedi:", error);
    }
  }

  console.warn("[EMAIL] Sipariş bildirim e-postası gönderilemedi — SMTP ve Resend yapılandırılmamış.");
}

/* ──────────────────── Şifre Sıfırlama E-Postası ──────────────────── */

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL ||"http://localhost:3000";
  const resetUrl = `${appUrl}/sifre-sifirla?token=${token}`;

  const subject ="MCARIS — Güvenli Şifre Sıfırlama Bağlantısı";
  const plainText = `Merhaba,\n\nMCARIS hesabınız (${email}) için şifre sıfırlama talebinde bulunuldu.\n\nŞifrenizi yenilemek için aşağıdaki bağlantıya tıklayın:\n${resetUrl}\n\nBu bağlantı 1 saat süreyle geçerlidir. Eğer bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.`;

  // 1. Birincil: SMTP
  const transporter = createSmtpTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: smtpSenderAddress(),
        to: email,
        subject,
        text: plainText,
      });
      console.log(`[PASSWORD RESET EMAIL SENT VIA SMTP] Target: ${email}`);
      return;
    } catch (error) {
      console.error("SMTP şifre sıfırlama e-postası gönderilemedi:", error);
    }
  }

  // 2. Yedek: Resend
  const resend = createResendClient();
  if (resend) {
    try {
      const result = await resend.emails.send({
        from: resendSenderAddress(),
        to: email,
        subject,
        text: plainText,
      });
      if (result.error) {
        console.error("Resend şifre sıfırlama hatası:", result.error);
      } else {
        console.log(`[PASSWORD RESET EMAIL SENT VIA RESEND] Target: ${email} | ID: ${result.data?.id}`);
        return;
      }
    } catch (error) {
      console.error("Resend şifre sıfırlama e-postası gönderilemedi:", error);
    }
  }

  console.warn("[EMAIL] Şifre sıfırlama e-postası gönderilemedi — SMTP ve Resend başarısız oldu.");
  console.log(`[PASSWORD RESET EMAIL DISPATCH] Target: ${email} | Reset Link: ${resetUrl}`);
  throw new Error("E-posta sunucusuna bağlanılamadı. Lütfen daha sonra tekrar deneyin veya iletişim formunu kullanın.");
}
