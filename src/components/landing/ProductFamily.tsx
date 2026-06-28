"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ArrowIcon } from "@/components/icons";
import { products } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function ProductFamily() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <article key={product.id} className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-950/10">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f1eb]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-700 backdrop-blur">
              NFC + QR
            </div>
          </div>
          <div className="p-4 pt-5">
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
