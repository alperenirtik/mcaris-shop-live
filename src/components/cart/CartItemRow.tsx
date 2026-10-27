import Image from"next/image";
import { formatPrice } from"@/lib/format";
import { updateQuantityAction, removeFromCartAction } from"@/app/sepet/actions";
import type { ProductWithCategory } from"@/lib/types";

export default function CartItemRow({
  itemId,
  product,
  quantity,
}: {
  itemId: string;
  product: ProductWithCategory;
  quantity: number;
}) {
  return (
    <div className="flex gap-base items-center border-b border-border py-base">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image src={product.images[0] ??"/placeholder-product.png"} alt={product.name} fill className="object-cover rounded-sm" />
      </div>
      <div className="flex-grow">
        <p className="text-headline-h4">{product.name}</p>
        <p className="text-body-main tabular-nums">{formatPrice(product.price)}</p>
      </div>
      <form action={updateQuantityAction} className="flex items-center gap-small">
        <input type="hidden" name="itemId" value={itemId} />
        <input
          type="number"
          name="quantity"
          defaultValue={quantity}
          min={1}
          max={product.stock}
          className="w-16 border border-border rounded-sm px-2 py-1 text-center"
        />
        <button type="submit" className="text-sm text-primary underline">
          Güncelle
        </button>
      </form>
      <form action={removeFromCartAction}>
        <input type="hidden" name="itemId" value={itemId} />
        <button type="submit" className="text-sm text-danger underline">
          Çıkar
        </button>
      </form>
    </div>
  );
}
