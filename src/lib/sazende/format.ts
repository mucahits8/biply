export function formatPrice(price: number | null) {
  if (price === null || Number.isNaN(price)) {
    return "";
  }

  return `${new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(price)} ₺`;
}

export function formatKcal(kcal: number | null, estimated = true) {
  if (kcal === null || Number.isNaN(kcal)) {
    return "";
  }

  return `${estimated ? "≈ " : ""}${kcal} kcal`;
}
