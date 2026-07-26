export type PriceLine = {
  price: number;
  quantity: number;
};

export function getBulkDiscountRate(lines: PriceLine[]) {
  const maxQuantity = Math.max(0, ...lines.map((line) => line.quantity));

  if (maxQuantity >= 10) return 0.2;
  if (maxQuantity >= 5) return 0.15;
  if (maxQuantity >= 3) return 0.1;
  if (maxQuantity >= 2) return 0.05;
  return 0;
}

export function calculateSubtotal(lines: PriceLine[]) {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function calculateBulkPricing(lines: PriceLine[]) {
  const subtotal = calculateSubtotal(lines);
  const discountRate = getBulkDiscountRate(lines);
  const discountAmount = Math.round(subtotal * discountRate);
  const total = Math.max(0, subtotal - discountAmount);

  return {
    subtotal,
    discountRate,
    discountAmount,
    total,
  };
}

export function formatDiscountRate(rate: number) {
  return `%${Math.round(rate * 100)}`;
}
