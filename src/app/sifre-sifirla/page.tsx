"use client";

import { useState, Suspense } from"react";
import { useSearchParams } from"next/navigation";
import Link from"next/link";
import { resetPasswordAction } from"@/app/actions/authActions";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ||"";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await resetPasswordAction({}, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-inter">
          Yeni Şifre Belirleyin
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
          Hesabınız için yeni bir şifre girin.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-inter">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-inter">
        <input type="hidden" name="token" value={token} />

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1">
            Yeni Şifre (en az 6 karakter)
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
            Yeni Şifre Tekrarı
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
          className="w-full py-3 px-4 bg-[#0F1E36] hover:bg-[#183158] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Şifre güncelleniyor..." : "Şifremi Güncelle"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 font-inter">
        <Link
          href="/giris"
          className="text-brand font-bold hover:underline"
        >
          &larr; Giriş Sayfasına Dön
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-50 font-body">
      <Suspense fallback={<div className="text-xs font-bold text-slate-500">Yükleniyor...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
