export const SHOPIER_URL = process.env.NEXT_PUBLIC_SHOPIER_URL ?? "https://www.shopier.com/biply";

export function shopierUrlForProduct(product?: { shopierUrl?: string }) {
  return product?.shopierUrl ?? SHOPIER_URL;
}

export function formatPrice(price: number) {
  if (price === 0) return "Teklif al";

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

export function whatsappUrl(message: string) {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "905551112233").replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
