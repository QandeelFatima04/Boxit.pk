export const SHIPPING_FLAT = 250; // PKR
export const FREE_SHIPPING_OVER = 5000; // PKR

export function computeShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
}
