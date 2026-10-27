#!/bin/sh
# Depodaki ürün görsellerini kalıcı yükleme klasörünün üzerine yazar.
# Böylece daha önce yanlış kopyalanmış aynı adlı dosyalar düzelir.
set -eu
mkdir -p /app/public/uploads/products /app/public/uploads/invoices /app/public/uploads/blog
if [ -d /app/bundled-uploads/products ]; then
  # -a ownership koruması volume üzerinde hata/gecikme yaratıyor
  cp -rf /app/bundled-uploads/products/. /app/public/uploads/products/ || true
fi
exec "$@"
