export default function ProductNotFound() {
  return (
    <div className="max-w-container-max mx-auto px-6 py-large text-center">
      <h1 className="text-headline-h2">Ürün bulunamadı</h1>
      <p className="text-body-main text-on-surface-variant mt-small">
        Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
      </p>
    </div>
  );
}
