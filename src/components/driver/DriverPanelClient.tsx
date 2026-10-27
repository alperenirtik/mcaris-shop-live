"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface OrderData {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  total: number | string | { toString(): string };
}


interface DriverPanelClientProps {
  orders: OrderData[];
}

export default function DriverPanelClient({ orders }: DriverPanelClientProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id ||"");
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [driverName, setDriverName] = useState("Murat Aksoy (Sürücü & Ekip Lideri)");
  const [driverPhone, setDriverPhone] = useState("0532 123 45 67");
  const [driverPhoto, setDriverPhoto] = useState<string>("");
  const [assistantName, setAssistantName] = useState("Ahmet Can (Şoför Yardımcısı & Kurulum)");
  const [assistantPhoto, setAssistantPhoto] = useState<string>("");
  const [vehiclePlate, setVehiclePlate] = useState("06 MCR 34");

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Load saved driver info from localStorage
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("mcaris_driver_name");
      const storedPhone = localStorage.getItem("mcaris_driver_phone");
      const storedPlate = localStorage.getItem("mcaris_driver_plate");
      const storedPhoto = localStorage.getItem("mcaris_driver_photo");
      const storedAssistantName = localStorage.getItem("mcaris_assistant_name");
      const storedAssistantPhoto = localStorage.getItem("mcaris_assistant_photo");

      if (storedName) setDriverName(storedName);
      if (storedPhone) setDriverPhone(storedPhone);
      if (storedPlate) setVehiclePlate(storedPlate);
      if (storedPhoto) setDriverPhoto(storedPhoto);
      if (storedAssistantName) setAssistantName(storedAssistantName);
      if (storedAssistantPhoto) setAssistantPhoto(storedAssistantPhoto);
    } catch {}
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target:"driver" |"assistant") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (target ==="driver") {
        setDriverPhoto(base64);
        try { localStorage.setItem("mcaris_driver_photo", base64); } catch {}
      } else {
        setAssistantPhoto(base64);
        try { localStorage.setItem("mcaris_assistant_photo", base64); } catch {}
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDriverInfo = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("mcaris_driver_name", driverName);
      localStorage.setItem("mcaris_driver_phone", driverPhone);
      localStorage.setItem("mcaris_driver_plate", vehiclePlate);
      if (driverPhoto) localStorage.setItem("mcaris_driver_photo", driverPhoto);
      if (assistantName) localStorage.setItem("mcaris_assistant_name", assistantName);
      if (assistantPhoto) localStorage.setItem("mcaris_assistant_photo", assistantPhoto);

      setSaveSuccessMsg("Ekip bilgileri ve fotoğrafları başarıyla kaydedildi!");
      setIsEditingInfo(false);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch {}
  };

  // Stop broadcasting on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const sendLocation = async (lat: number, lng: number) => {
    if (!selectedOrderId) return;
    try {
      await fetch("/api/driver/location", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({
          orderId: selectedOrderId,
          lat,
          lng,
          driverName,
          driverPhone,
          driverPhoto,
          assistantName,
          assistantPhoto,
          carrier: `MCARIS Özel Medikal Filo (${vehiclePlate})`,
        }),
      });
      setCurrentCoords({ lat, lng });
    } catch (err) {
      console.error("Konum gönderme hatası:", err);
    }
  };

  const startBroadcasting = () => {
    if (!selectedOrderId) {
      setStatusMessage("Lütfen önce teslim edilecek siparişi seçiniz.");
      return;
    }

    if (!navigator.geolocation) {
      setStatusMessage("Cihazınızda GPS/Konum desteği bulunamadı.");
      return;
    }

    setIsBroadcasting(true);
    setStatusMessage("Canlı konum paylaşımı başlatıldı. Müşteri haritada sizi takip ediyor.");

    // High accuracy GPS location watcher
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocation(latitude, longitude);
      },
      (error) => {
        console.error("GPS Hatası:", error);
        setStatusMessage(`GPS Uyarısı: ${error.message}. Tarayıcı konum iznini kontrol ediniz.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    watchIdRef.current = id;
  };

  const stopBroadcasting = async (completed = false) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsBroadcasting(false);

    if (completed && selectedOrderId) {
      try {
        await fetch("/api/driver/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: selectedOrderId,
            action: "complete",
          }),
        });
        setStatusMessage("Teslimat ve kurulum başarıyla tamamlandı olarak işaretlendi!");
      } catch (err) {
        console.error("Teslimat tamamlama hatası:", err);
      }
    } else {
      setStatusMessage("Canlı konum paylaşımı durduruldu.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-body">
      
      {/* Driver Header Card with Edit & Save */}
      <div className="bg-[#0F1E36] text-white rounded-2xl p-5 md:p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand flex items-center justify-center text-xl font-bold">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold font-inter">Şoför &amp; Kurulum Paneli</h1>
              <p className="text-xs text-slate-300 font-inter">MCARIS Özel Medikal Filo Mobil Arayüzü</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-xl border border-brand/30 transition-colors cursor-pointer"
          >
            {isEditingInfo ? "✕ Kapat" : "Bilgilerimi Düzenle"}
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            ✓ {saveSuccessMsg}
          </div>
        )}

        {/* Driver & Assistant Editable Form */}
        <form onSubmit={handleSaveDriverInfo} className="space-y-4 pt-2">
          {/* Photos Showcase Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            {/* Driver Photo Block */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {driverPhoto ? (
                  <Image
                    src={driverPhoto}
                    alt={driverName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Sürücü Fotoğrafı</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "driver")}
                  className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-slate-700 file:text-white cursor-pointer"
                />
              </div>
            </div>

            {/* Assistant Driver Photo Block */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {assistantPhoto ? (
                  <Image
                    src={assistantPhoto}
                    alt={assistantName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">Şoför Yardımcısı</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e,"assistant")}
                  className="w-full text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-brand file:text-white hover:file:bg-brand-dark cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                Şoför / Ekip Lideri Adı
              </label>
              <input
                type="text"
                disabled={!isEditingInfo}
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white border border-slate-700 focus:outline-none focus:border-gold disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                Sürücü Tel No
              </label>
              <input
                type="text"
                disabled={!isEditingInfo}
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-white border border-slate-700 focus:outline-none focus:border-gold font-mono disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                Şoför Yardımcısı (Teknik Eleman)
              </label>
              <input
                type="text"
                disabled={!isEditingInfo}
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                placeholder="Örn: Ahmet Can (Teknik Kurulum)"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-brand border border-slate-700 focus:outline-none focus:border-brand disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                Araç Plakası
              </label>
              <input
                type="text"
                disabled={!isEditingInfo}
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="Örn: 06 MCR 34"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-gold border border-slate-700 focus:outline-none focus:border-gold font-mono uppercase disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {isEditingInfo && (
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Bilgileri Kaydet
            </button>
          )}
        </form>
      </div>

      {/* Order Selection & Info Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 font-inter">
            Teslim Edilecek Siparişi Seçiniz *
          </label>
          {orders.length === 0 ? (
            <div className="p-4 bg-amber-50 text-amber-900 rounded-xl text-xs font-bold border border-amber-200">
              Henüz teslimat bekleyen aktif sipariş bulunmamaktadır.
            </div>
          ) : (
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              disabled={isBroadcasting}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand transition-all bg-slate-50 hover:bg-white cursor-pointer disabled:opacity-50"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.customerName} ({o.id.slice(-8).toUpperCase()}) — {o.shippingAddress.slice(0, 30)}...
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedOrder && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-inter">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Müşteri Adı:</span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">{selectedOrder.customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Müşteri Tel:</span>
              <a href={`tel:${selectedOrder.customerPhone}`} className="text-xs font-mono font-bold text-brand hover:underline">
                {selectedOrder.customerPhone}
              </a>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase block">Teslimat Adresi:</span>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {selectedOrder.shippingAddress}
              </p>
            </div>

            {/* Google Maps Navigation Link */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedOrder.shippingAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Google Maps İle Navigasyon Başlat</span>
              <span>&rarr;</span>
            </a>
          </div>
        )}
      </div>

      {/* Main Broadcast Control Buttons */}
      <div className="space-y-3 font-inter">
        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-[#0F1E36] text-white text-xs font-bold border border-slate-800 animate-in fade-in">
            {statusMessage}
          </div>
        )}

        {!isBroadcasting ? (
          <button
            onClick={startBroadcasting}
            disabled={!selectedOrderId}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>Sevkiyata Başla (Canlı Konum Paylaş)</span>
            <span>&rarr;</span>
          </button>
        ) : (
          <div className="space-y-2.5">
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold">Canlı Konum Müşteriye Aktarılıyor</span>
              </div>
              {currentCoords && (
                <span className="text-[10px] font-mono font-bold bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
                </span>
              )}
            </div>

            <button
              onClick={() => stopBroadcasting(false)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-colors cursor-pointer"
            >
              Canlı Konum Paylaşımını Duraklat
            </button>

            <button
              onClick={() => stopBroadcasting(true)}
              className="w-full bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Teslimat ve Kurulumu Tamamladım</span>
              <span>✓</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
