import { NextResponse } from"next/server";
import { prisma } from"@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return new NextResponse("Order ID missing", { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return new NextResponse("Order not found", { status: 404 });
  }

  const token = order.iyzicoToken || `iyz-test-${order.id}-${Date.now()}`;

  const html = `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iyzico 3D Secure Güvenli Ödeme</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont,"Segoe UI", Roboto, sans-serif;
        background-color: #f0f4f8;
        margin: 0;
        padding: 40px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
      }
      .card {
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        max-width: 480px;
        width: 100%;
        padding: 32px;
        border: 1px solid #e2e8f0;
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #f1f5f9;
        padding-bottom: 20px;
        margin-bottom: 24px;
      }
      .logo {
        display: inline-block;
        font-size: 26px;
        font-weight: 900;
        color: #1E3A8A;
        letter-spacing: -0.5px;
      }
      .logo span {
        color: #2563EB;
      }
      .badge {
        display: block;
        width: max-content;
        margin: 8px auto 0;
        background: #dbeafe;
        color: #1e40af;
        font-size: 11px;
        font-weight: 800;
        padding: 4px 12px;
        border-radius: 20px;
        text-transform: uppercase;
      }
      .summary {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        margin-bottom: 8px;
        color: #64748b;
      }
      .summary-row.total {
        font-weight: 800;
        font-size: 16px;
        color: #0f172a;
        border-top: 1px solid #cbd5e1;
        padding-top: 10px;
        margin-bottom: 0;
      }
      .form-group {
        margin-bottom: 16px;
      }
      label {
        display: block;
        font-size: 12px;
        font-weight: 700;
        color: #334155;
        margin-bottom: 6px;
        text-transform: uppercase;
      }
      input {
        width: 100%;
        padding: 12px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
        background: #ffffff;
      }
      .btn {
        width: 100%;
        background-color: #2563EB;
        color: white;
        font-weight: 800;
        font-size: 15px;
        padding: 14px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 8px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }
      .btn:hover {
        background-color: #1d4ed8;
      }
      .footer-note {
        text-align: center;
        font-size: 11px;
        color: #94a3b8;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="logo">iyzi<span>co</span></div>
        <span class="badge">3D Secure 256-Bit Korumalı Ödeme</span>
      </div>

      <div class="summary">
        <div class="summary-row">
          <span>Sipariş Kodu:</span>
          <span style="font-family: monospace; font-weight: bold; color: #0f172a;">${order.id}</span>
        </div>
        <div class="summary-row">
          <span>Müşteri Adı:</span>
          <span>${order.customerName}</span>
        </div>
        <div class="summary-row total">
          <span>Ödenecek Tutar:</span>
          <span style="color: #2563EB;">₺${Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <form action="/api/odeme/callback" method="POST">
        <input type="hidden" name="token" value="${token}" />

        <div class="form-group">
          <label>Kart Üzerindeki İsim</label>
          <input type="text" value="${order.customerName.toUpperCase()}" readonly />
        </div>

        <div class="form-group">
          <label>Kart Numarası (Test Modu)</label>
          <input type="text" value="5890 0400 0000 0016 (iyzico Test Kartı)" readonly />
        </div>

        <div style="display: flex; gap: 12px;">
          <div class="form-group" style="flex: 1;">
            <label>SKT</label>
            <input type="text" value="12/28" readonly />
          </div>
          <div class="form-group" style="flex: 1;">
            <label>CVC</label>
            <input type="text" value="007" readonly />
          </div>
        </div>

        <div class="form-group">
          <label>3D SMS Onay Kodu</label>
          <input type="text" value="283910" readonly />
        </div>

        <button type="submit" class="btn">
          iyzico İle Güvenli Ödemeyi Tamamla (₺${Number(order.total).toLocaleString("tr-TR", { minimumFractionDigits: 2 })})
        </button>
      </form>

      <div class="footer-note">
        <span>MCARIS Medikal • 256-Bit SSL iyzico Sanal POS Entegrasyonu</span>
      </div>
    </div>
  </body>
  </html>
  `;

  return new NextResponse(html, {
    headers: {"Content-Type":"text/html; charset=utf-8" },
  });
}
