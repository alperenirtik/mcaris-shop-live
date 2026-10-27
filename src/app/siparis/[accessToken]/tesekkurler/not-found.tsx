export default function OrderNotFound() {
  return (
    <div className="max-w-container-max mx-auto px-6 py-large text-center">
      <h1 className="text-headline-h2">Sipariş bulunamadı</h1>
      <p className="text-body-main text-on-surface-variant mt-small">
        Bu bağlantı geçersiz veya sipariş artık mevcut değil.
      </p>
    </div>
  );
}
