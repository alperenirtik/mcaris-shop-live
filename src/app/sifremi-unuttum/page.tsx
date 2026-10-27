"use client";

import { useState } from"react";
import Link from"next/link";
import { forgotPasswordAction } from"@/app/actions/authActions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await forgotPasswordAction({}, formData);

    if (result.error) {
      setError(result.error);
    } else if (result.message) {
      setMessage(result.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-50 font-body">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-inter">
            Şifremi Unuttum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
            E-posta adresinizi girin, sıfırlama bağlantısı e-posta adresinize gönderilsin.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-inter">
            {error}
          </div>
        )}

        {message ? (
          <div className="space-y-4 font-inter">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold leading-relaxed">
              {message}
            </div>

            <Link
              href="/giris"
              className="block w-full text-center py-3 px-4 bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-inter">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="ornek@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-xs sm:text-sm font-medium text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 font-inter">
          <Link
            href="/giris"
            className="text-brand font-bold hover:underline"
          >
            &larr; Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
