"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ArrowIcon } from "@/components/icons";
import { ProductMockup } from "@/components/product/ProductMockup";
import { products } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function ProductFamily() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <article key={product.id} className="group rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/10">
          <div className="grid place-items-center rounded-[1.5rem] bg-[#f4f1eb] py-6">
            <ProductMockup shape={product.shape} tone={product.shape === "glass" ? "glass" : "light"} size="md" />
          </div>
          <div className="pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{product.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-zinc-950">{product.name}</h3>
            <p className="mt-2 min-h-16 text-sm leading-6 text-zinc-600">{product.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <strong className="text-lg text-zinc-950">{formatPrice(product.price)}</strong>
              <Link href={`/urunler/${product.slug}`} className="inline-flex items-center gap-1 text-sm font-black text-zinc-950">
                Detay <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
            <AddToCartButton
              item={{ id: product.id, kind: "product", name: product.name, price: product.price }}
              className="mt-4 w-full"
            />
          </div>
        </article>
      ))}
    </div>
  );
}
