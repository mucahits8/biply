"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ArrowIcon } from "@/components/icons";
import { MobileSwipeHint } from "@/components/ui/MobileSwipeHint";
import { products } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function ProductFamily() {
  return (
    <div>
      <MobileSwipeHint label={`${products.length} ürün seçeneği`} detail="Stand, Kare, Kişiselleştirilmiş Kare, Mini ve Kişiselleştirilmiş Mini kartlarını görmek için kaydırın." />
      <div className="no-scrollbar grid auto-cols-[100%] grid-flow-col snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:auto-cols-[48%] lg:grid-flow-row lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0">
        {products.map((product, index) => (
          <article key={product.id} className="group swipe-card overflow-hidden rounded-[1.45rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-950/12 lg:rounded-[1.8rem]">
            <div className="relative aspect-[1.16/1] overflow-hidden bg-[#f4f1eb] lg:aspect-[4/3]">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                loading="eager"
                fetchPriority={product.id === "product-stand" ? "high" : "auto"}
                sizes="(min-width: 1280px) 18vw, (min-width: 768px) 50vw, 100vw"
                className="object-contain p-2 transition duration-500 group-hover:scale-[1.02] lg:p-3"
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700 backdrop-blur lg:text-[11px]">
                {product.badge}
              </div>
              <div className="absolute bottom-3 left-3 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-950 shadow-lg shadow-zinc-950/15 lg:text-[11px]">
                {product.saleBadge}
              </div>
            </div>
            <div className="p-3 pt-4 lg:p-4 lg:pt-5">
              <p className="hidden text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 sm:block">{product.eyebrow}</p>
              <h3 className="text-2xl font-black tracking-[-0.05em] text-zinc-950 sm:mt-2">{product.name}</h3>
              <p className="mt-1 text-sm font-black text-blue-700">{product.subtitle}</p>
              <p className="mt-2 hidden min-h-14 text-sm leading-6 text-zinc-600 sm:block">{product.description}</p>
              <div className="mt-2 rounded-[0.9rem] bg-[#f7f3ed] p-2.5 text-xs font-bold leading-5 text-zinc-700 lg:mt-3 lg:p-3">
                {product.hierarchy}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 lg:mt-4">
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-emerald-700">Lansman fiyatı</span>
                  <span className="block text-xs font-bold text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span>
                  <strong className="text-xl text-zinc-950">{formatPrice(product.price)}</strong>
                </div>
              </div>
              <AddToCartButton
                item={{ id: product.id, kind: "product", name: product.name, price: product.price }}
                className="mt-3 min-h-11 w-full lg:mt-4"
              >
                {product.cta}
              </AddToCartButton>
              <div className="mt-3 flex items-center justify-between gap-2 rounded-full bg-[#f7f3ed] px-3 py-2 text-[11px] font-black text-zinc-600 lg:hidden">
                <span>{index + 1} / {products.length}</span>
                <span className="inline-flex items-center gap-1">
                  Diğer ürünler sağda <ArrowIcon className="h-3.5 w-3.5" />
                </span>
              </div>
              <Link href={`/urunler/${product.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-black text-zinc-500 transition hover:text-zinc-950 sm:text-sm">
                Detayları incele <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
