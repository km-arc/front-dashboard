/** Whole percent saved when `compareAtPrice` (the old price) is higher than `price`, otherwise null. */
export function discountPercent(price: number, compareAtPrice?: number): number | null {
  if (compareAtPrice === undefined || compareAtPrice <= price || compareAtPrice <= 0) return null;
  const percent = Math.round((1 - price / compareAtPrice) * 100);
  return percent >= 1 ? Math.min(percent, 99) : null;
}
