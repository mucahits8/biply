export function formatPrice(price: number) {
  if (price === 0) return "Teklif al";

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

export function whatsappUrl(message: string) {
  const phone = "905551112233";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
