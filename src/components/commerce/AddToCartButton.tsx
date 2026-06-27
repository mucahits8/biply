"use client";

import { useCart } from "@/components/commerce/CartProvider";

type AddToCartButtonProps = {
  item: {
    id: string;
    kind: "package" | "product" | "upsell";
    name: string;
    price: number;
  };
  children?: React.ReactNode;
  className?: string;
};

export function AddToCartButton({ item, children = "Sepete ekle", className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(item)}
      className={`inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-bold text-white shadow-lg shadow-zinc-950/15 transition hover:-translate-y-0.5 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300 ${className}`}
    >
      {children}
    </button>
  );
}
