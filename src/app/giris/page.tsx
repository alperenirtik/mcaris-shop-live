"use client";

import { useState, Suspense } from"react";
import { useSearchParams } from"next/navigation";
import Link from"next/link";
import { loginAction } from"@/app/actions/authActions";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") ||"";
  const resetSuccess = searchParams.get("reset") ==="success";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction({}, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-inter">
          Giriş Yap
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-inter">
          MCARIS hesabınıza erişmek için giriş yapın
        </p>
      </div>

      {resetSuccess && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-inter">
          Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
        </div>
      )}

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-inter">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-inter">
        <input type="hidden" name="redirect" value={redirectUrl} />

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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-xs font-bold text-slate-700">
              Şifre
            </label>
            <Link
              href="/sifremi-unuttum"
              className="text-xs text-brand hover:underline font-bold"
            >
              Şifremi Unuttum?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            name="password"
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
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 font-inter">
        Hesabınız yok mu?{" "}
        <Link
          href="/kayit-ol"
          className="text-brand font-bold hover:underline"
        >
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-50 font-body">
      <Suspense fallback={<div className="text-xs font-bold text-slate-500">Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
