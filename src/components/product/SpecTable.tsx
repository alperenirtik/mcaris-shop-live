const HIDDEN_SPEC_KEYS = new Set([
  "seoTitle",
  "seoDescription",
  "metaTitle",
  "metaDescription",
  "sku",
  "SKU",
  "Ürün Kodu",
  "Urun Kodu",
  "ürün kodu",
  "urun kodu",
  "Model Kodu",
  "model kodu",
  "code",
  "Code",
  "Kod",
]);

export default function SpecTable({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs || {}).filter(([k]) => !HIDDEN_SPEC_KEYS.has(k));
  if (entries.length === 0) return null;

  return (
    <div className="border border-neutral-200/90 rounded-xl overflow-hidden shadow-2xs bg-white font-inter">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200/90 text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 sm:px-6 w-1/3">Parametre / Donanım</th>
            <th className="py-3 px-4 sm:px-6">Teknik Değer / Detay</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 text-neutral-700">
          {entries.map(([key, value], index) => {
            const displayValue = typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
            return (
              <tr
                key={key}
                itemProp="additionalProperty"
                itemScope
                itemType="https://schema.org/PropertyValue"
                className={index % 2 === 1 ? "bg-neutral-50/50 hover:bg-neutral-100/50" : "bg-white hover:bg-neutral-50/60"}
              >
                <td itemProp="name" className="py-3 px-4 sm:px-6 font-bold text-neutral-900">
                  {key}
                </td>
                <td itemProp="value" className="py-3 px-4 sm:px-6 text-neutral-700 font-medium">
                  {displayValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
