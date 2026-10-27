import { ImageResponse } from"next/og";

export const runtime ="nodejs";
export const alt ="MCARIS Medikal Ekipman & Hasta Çözümleri";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType ="image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height:"100%",
          width:"100%",
          display:"flex",
          flexDirection:"column",
          alignItems:"flex-start",
          justifyContent:"space-between",
          backgroundColor:"#0B1528",
          padding:"60px 80px",
          fontFamily:"sans-serif",
          position:"relative",
        }}
      >
        {/* Top Header / Brand */}
        <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
          <div
            style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              width:"64px",
              height:"64px",
              borderRadius:"16px",
              backgroundColor:"#152A4A",
              color:"#FFFFFF",
              fontSize:"32px",
              fontWeight:"bold",
              border:"1px solid rgba(255,255,255,0.2)",
            }}
          >
            M
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <span
              style={{
                fontSize:"36px",
                fontWeight:"bold",
                color:"#FFFFFF",
                letterSpacing:"-0.5px",
              }}
            >
              MCARIS
            </span>
            <span
              style={{
                fontSize:"16px",
                fontWeight:"bold",
                color:"#10B981",
                letterSpacing:"2px",
                textTransform:"uppercase",
              }}
            >
              MEDİKAL VE HASTA ÇÖZÜMLERİ
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display:"flex", flexDirection:"column", gap:"16px", maxWidth:"900px" }}>
          <div
            style={{
              display:"flex",
              alignItems:"center",
              padding:"8px 18px",
              borderRadius:"8px",
              backgroundColor:"rgba(16,185,129,0.15)",
              border:"1px solid rgba(16,185,129,0.3)",
              color:"#10B981",
              fontSize:"18px",
              fontWeight:"bold",
            }}
          >
            2 Yıl Garanti | Aynı Gün Sevkiyat | 7/24 Teknik Servis
          </div>
          <h1
            style={{
              fontSize:"48px",
              fontWeight:"bold",
              color:"#FFFFFF",
              lineHeight: 1.18,
              margin: 0,
            }}
          >
            Profesyonel Hasta Yatakları ve Medikal Bakım Ekipmanları
          </h1>
          <p
            style={{
              fontSize:"22px",
              color:"#94A3B8",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            2, 3 ve 4 motorlu elektrikli hasta karyolaları, transfer liftleri ve klinik çözümler.
          </p>
        </div>

        {/* Bottom Badges */}
        <div
          style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            width:"100%",
            borderTop:"1px solid rgba(255,255,255,0.1)",
            paddingTop:"24px",
          }}
        >
          <div style={{ display:"flex", gap:"24px" }}>
            <span style={{ fontSize:"16px", color:"#CBD5E1", fontWeight:"bold" }}>
              Platinum, Gold ve Silver Serileri
            </span>
            <span style={{ fontSize:"16px", color:"#CBD5E1", fontWeight:"bold" }}>
              CE ve ISO 9001 Sertifikalı
            </span>
            <span style={{ fontSize:"16px", color:"#CBD5E1", fontWeight:"bold" }}>
              256-Bit iyzico 3D Secure
            </span>
          </div>
          <span
            style={{
              fontSize:"18px",
              color:"#D4AF37",
              fontWeight:"bold",
            }}
          >
            shop.mcaris.com.tr
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
