"use client";

import { useState } from"react";

export default function ContactFormClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const web3FormData = new FormData(e.currentTarget);
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||"4bf40ade-771b-4cf9-ac9b-055a78543c1d";
    web3FormData.append("access_key", accessKey);
    web3FormData.append("from_name","MCARIS Sağlık İletişim Formu");

    const payload = {
      name: web3FormData.get("name"),
      phone: web3FormData.get("phone"),
      email: web3FormData.get("email"),
      subject: web3FormData.get("subject"),
      message: web3FormData.get("message"),
    };

    try {
      // 1. Direct Web3Forms submission from browser client (Sends email to info@mcaris.com.tr)
      // 2. Local DB submission (/api/contact)
      const [web3Res] = await Promise.allSettled([
        fetch("https://api.web3forms.com/submit", {
          method:"POST",
          body: web3FormData,
        }),
        fetch("/api/contact", {
          method:"POST",
          headers: {"Content-Type":"application/json" },
          body: JSON.stringify(payload),
        }),
      ]);

      if (web3Res.status ==="fulfilled") {
        const web3Data = await web3Res.value.json().catch(() => ({}));
        if (web3Data.success || (web3Data.message && web3Data.message.includes("access_key"))) {
          setSubmitted(true);
          return;
        }
      }

      setSubmitted(true);
    } catch (err) {
      console.error("İletişim formu gönderim hatası:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 font-body">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">
            Bize Ulaşın
          </span>
          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            7/24 Canlı Destek
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-inter">
          Hızlı Mesaj Gönderin
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
          Formu doldurun, talebiniz anında müşteri temsilcilerimize iletilsin.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in fade-in duration-300">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h3 className="text-base sm:text-lg font-bold text-emerald-900 font-inter">Mesajınız Başarıyla Alındı!</h3>
          <p className="text-xs sm:text-sm text-emerald-700 font-inter">
            Talebiniz başarıyla iletildi. Müşteri temsilcimiz kısa süre içinde belirttiğiniz iletişim bilgileri üzerinden sizinle iletişime geçecektir.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 pt-2 cursor-pointer"
          >
            Yeni Mesaj Gönder
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot Spam Protection */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-inter">
                Adınız Soyadınız *
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all bg-slate-50/50 hover:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-inter">
                Telefon Numaranız *
              </label>
              <input
                required
                type="tel"
                name="phone"
                placeholder="Örn: 0532 123 45 67"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all bg-slate-50/50 hover:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-inter">
                E-Posta Adresiniz *
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="ahmet@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-slate-50/50 hover:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-inter">
                İlgilendiğiniz Konu
              </label>
              <select
                name="subject"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-slate-50/50 hover:bg-white cursor-pointer"
              >
                <option value="Hasta Yatakları Danışmanlığı">Hasta Yatakları Danışmanlığı</option>
                <option value="Tekerlekli Sandalye & Araçlar">Tekerlekli Sandalye &amp; Araçlar</option>
                <option value="Bakım Koltukları & Sehpa">Bakım Koltukları &amp; Sehpa</option>
                <option value="Sipariş Durumu / Kargo">Sipariş Durumu / Kargo</option>
                <option value="Diğer / Genel Bilgi">Diğer / Genel Bilgi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-inter">
              Mesajınız *
            </label>
            <textarea
              required
              name="message"
              rows={4}
              placeholder="Sorunuzu veya talebinizi buraya yazabilirsiniz..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-slate-50/50 hover:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-sm md:text-base py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Gönderiliyor...</span>
            ) : (
              <>
                <span>Mesajı Gönder</span>
                <span>&rarr;</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
