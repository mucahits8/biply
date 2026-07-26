"use client";

import { CheckIcon, PlusIcon } from "@/components/icons";
import Image from "next/image";
import { products, promotions } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { formatDiscountRate } from "@/lib/pricing";
import { useCart } from "@/components/commerce/CartProvider";

export function CartDrawer() {
  const { items, subtotal, discountAmount, discountRate, total, isCartOpen, closeCart, updateQuantity, removeItem, addItem } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Biply sepeti">
      <button className="absolute inset-0 bg-zinc-950/35 backdrop-blur-sm" onClick={closeCart} aria-label="Sepeti kapat" />
      <aside className="absolute bottom-0 right-0 top-auto max-h-[88vh] w-full overflow-y-auto rounded-t-[2rem] bg-[#fbfaf7] p-5 shadow-2xl md:bottom-4 md:right-4 md:top-4 md:max-h-none md:w-[420px] md:rounded-[2rem]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Lansman sepeti</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-zinc-950">Sipariş özeti</h2>
          </div>
          <button type="button" onClick={closeCart} className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-bold">
            Kapat
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
            Henüz ürün seçilmedi. Paket oluşturucudan adet seçtiğinde sipariş özeti burada netleşir.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-[1.3rem] border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-zinc-950">{item.name}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{item.kind === "package" ? "paket" : "ürün"}</p>
                  </div>
                  <strong className="text-sm text-zinc-950">{formatPrice(item.price * item.quantity)}</strong>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-zinc-200">
                    <button className="px-3 py-1.5 font-bold" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Azalt">
                      −
                    </button>
                    <span className="min-w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <button className="px-3 py-1.5 font-bold" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Artır">
                      +
                    </button>
                  </div>
                  <button className="text-xs font-bold text-zinc-500 underline" onClick={() => removeItem(item.id)}>
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length ? (
          <section className="mt-5 rounded-[1.5rem] border border-zinc-200 bg-white p-4" aria-label="Sepet promosyon önerileri">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Bunu alanlar genelde ekliyor</p>
            <h3 className="mt-1 text-lg font-black tracking-[-0.04em] text-zinc-950">Eksik temas noktası kalmasın.</h3>
            <p className="mt-1 text-xs font-bold leading-5 text-zinc-500">Birkaç ek nokta ekleyince birim fiyatınız düşebilir.</p>
            <div className="mt-4 space-y-2">
              {promotions.map((promotion) => {
                const product = products.find((item) => item.slug === promotion.productSlug);

                if (!product) return null;

                return (
                <div key={promotion.id} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl bg-[#f7f3ed] p-2.5">
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-zinc-100">
                    <Image src={promotion.image} alt={promotion.imageAlt} fill sizes="44px" className="object-contain p-0.5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-zinc-950">{promotion.name}</p>
                    <p className="text-[11px] font-bold text-zinc-500">{promotion.quantity} adet | {formatPrice(product.price * promotion.quantity)}</p>
                  </div>
                  <button
                    type="button"
                    data-testid={`drawer-extra-${promotion.id}`}
                    onClick={() => addItem({ id: product.id, kind: "product", name: product.name, price: product.price, quantity: promotion.quantity })}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-white"
                    aria-label={`${promotion.name} sepete ekle`}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="mt-5 rounded-[1.5rem] bg-zinc-950 p-5 text-white">
          <div className="space-y-2 text-sm text-zinc-300">
            <div className="flex items-center justify-between">
              <span>Ara toplam</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-300">
              <span>Çoklu alım indirimi</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-amber-300">
              <span>Tasarruf avantajı</span>
              <span>{formatDiscountRate(discountRate)}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <strong className="text-3xl font-black tracking-[-0.05em]">{formatPrice(total)}</strong>
            <CheckIcon className="h-7 w-7 text-emerald-300" />
          </div>
          <a href="#checkout" onClick={closeCart} className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-white text-sm font-black text-zinc-950">
            Sipariş talebine geç
          </a>
        </div>
      </aside>
    </div>
  );
}
