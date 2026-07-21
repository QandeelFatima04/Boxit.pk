export const SHIPPING_FLAT = 250; // PKR
export const FREE_SHIPPING_OVER = 5000; // PKR

/**
 * The only products that can be paid for online today. Several other items are
 * flagged `purchasable` in the catalogue with prices attached, but they are NOT
 * live for checkout — they keep the Request-a-quote flow until we deliberately
 * switch them on here. Add a slug to this list to open it for direct payment.
 */
export const CHECKOUT_ENABLED_SLUGS: readonly string[] = [
  "sample-kit",
  "seed-paper-sheets-bulk",
  "seed-paper-a5-pack",
];

export const isCheckoutEnabled = (slug: string) =>
  CHECKOUT_ENABLED_SLUGS.includes(slug);

export function computeShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
}
