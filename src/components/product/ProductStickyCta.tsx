"use client";

import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import type { CatalogItem } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

type ProductStickyCtaProps = {
  product: Pick<CatalogItem, "id" | "name" | "price" | "oldPrice">;
};

export function ProductStickyCta({ product }: ProductStickyCtaProps) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-[1.6rem] border border-zinc-200 bg-white/94 p-2 shadow-2xl shadow-zinc-950/20 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">Lansman fiyatı</p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-xs font-bold text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span>
            <strong className="text-lg font-black text-zinc-950">{formatPrice(product.price)}</strong>
          </div>
        </div>
        <AddToCartButton
          item={{ id: product.id, kind: "product", name: product.name, price: product.price }}
          className="min-h-12 px-5 text-xs"
        >
          Sepete Ekle
        </AddToCartButton>
      </div>
    </div>
  );
}
