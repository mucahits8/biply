"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ArrowIcon } from "@/components/icons";
import { products } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function ProductFamily() {
  return (
    <div className="grid auto-cols-[84%] grid-flow-col gap-4 overflow-x-auto pb-2 sm:auto-cols-[48%] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:pb-0">
      {products.map((product) => (
        <article key={product.id} className="group overflow-hidden rounded-[1.8rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-950/12">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f1eb]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="object-contain p-3 transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700 backdrop-blur">
              {product.badge}
            </div>
            <div className="absolute bottom-3 left-3 rounded-full bg-amber-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950 shadow-lg shadow-zinc-950/15">
              {product.saleBadge}
            </div>
          </div>
          <div className="p-4 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{product.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-zinc-950">{product.name}</h3>
            <p className="mt-1 text-sm font-black text-blue-700">{product.subtitle}</p>
            <p className="mt-2 min-h-14 text-sm leading-6 text-zinc-600">{product.description}</p>
            <div className="mt-3 rounded-[1rem] bg-[#f7f3ed] p-3 text-xs font-bold leading-5 text-zinc-700">
              {product.hierarchy}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-emerald-700">Lansman fiyatı</span>
                <span className="block text-xs font-bold text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span>
                <strong className="text-xl text-zinc-950">{formatPrice(product.price)}</strong>
              </div>
            </div>
            <AddToCartButton
              item={{ id: product.id, kind: "product", name: product.name, price: product.price }}
              className="mt-4 w-full"
            >
              {product.cta}
            </AddToCartButton>
            <Link href={`/urunler/${product.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-black text-zinc-500 transition hover:text-zinc-950">
              Görselleri ve detayları incele <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
