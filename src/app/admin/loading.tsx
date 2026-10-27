export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Yönetim paneli yükleniyor"
      className="min-h-[55vh] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-sm rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-xs flex flex-col items-center text-center">
        {/* Minimalist Admin Spinner */}
        <div className="relative w-10 h-10 mb-4 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-neutral-900 animate-spin" />
        </div>

        <div className="font-bold text-neutral-900 text-sm tracking-tight">
          MCARIS ADMIN
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Panel verileri yükleniyor, lütfen bekleyiniz...
        </p>
      </div>
    </div>
  );
}
