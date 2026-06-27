"use client";

import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/commerce/CartProvider";

export function MobileStickyCta() {
  const { count, total, openCart } = useCart();

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-[1.6rem] border border-zinc-200 bg-white/92 p-2 shadow-2xl shadow-zinc-950/20 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <a
          href="#paketler"
          className="flex min-h-12 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-black text-white"
        >
          Paketini Oluştur
        </a>
        <button
          type="button"
          onClick={openCart}
          className="min-h-12 rounded-full border border-zinc-200 px-4 text-left text-xs font-bold text-zinc-950"
          aria-label="Sepeti aç"
        >
          <span className="block text-[10px] text-zinc-500">Sepet {count ? `(${count})` : ""}</span>
          {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}
