"use client";

import { useState } from"react";
import Link from"next/link";
import { registerAction } from"@/app/actions/authActions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await registerAction({}, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-50 font-body">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-inter">
            Kayıt Ol
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
            Yeni bir MCARIS hesabı oluşturun
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-inter">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 font-inter">
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1">
              Ad Soyad *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder="Ahmet Yılmaz"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-xs sm:text-sm font-medium text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
              E-posta Adresi *
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

          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1">
              Telefon Numarası
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="+90 5XX XXX XX XX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-xs sm:text-sm font-medium text-slate-900 font-mono"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1">
              Şifre * (en az 6 karakter)
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-xs sm:text-sm font-medium text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-xs font-bold text-slate-700 mb-1">
              Şifre Tekrarı *
            </label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-xs sm:text-sm font-medium text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol ve Giriş Yap"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 font-inter">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/giris"
            className="text-brand font-bold hover:underline"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
