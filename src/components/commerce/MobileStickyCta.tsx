"use client";

import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/commerce/CartProvider";

export function MobileStickyCta() {
  const { count, total, openCart } = useCart();

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-[1.35rem] border border-zinc-200 bg-white/94 p-2 shadow-2xl shadow-zinc-950/20 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-[1fr_112px] items-center gap-2">
        <a
          href={count ? "#checkout" : "#mobil-urunler"}
          className="flex min-h-11 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-black text-white"
        >
          {count ? "Siparişi Tamamla" : "Hızlı Fiyat Al"}
        </a>
        <button
          type="button"
          onClick={openCart}
          className="min-h-11 rounded-full border border-zinc-200 px-3 text-left text-[11px] font-black leading-tight text-zinc-950"
          aria-label="Sepeti aç"
        >
          <span className="block text-[9px] font-black uppercase tracking-[0.1em] text-emerald-700">
            {count ? `${count} ürün` : "Lansman"}
          </span>
          {count ? formatPrice(total) : "750 TL'den başlar"}
        </button>
      </div>
    </div>
  );
}
