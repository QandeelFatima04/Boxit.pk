import type { PricingTier } from "./types";

// "Buying frames", not fixed SKU prices — per the Hormozi-style offer structure.
export const pricingTiers: PricingTier[] = [
  {
    name: "Starter Packaging Kit",
    positioning: "For brands testing sustainable packaging for the first time.",
    bestFor: "Small brands & first-timers",
    priceHint: "Start with a Sample Kit",
    includes: [
      "Material consultation",
      "1–2 packaging formats",
      "Basic customization",
      "Small MOQ",
      "Standard print options",
      "Sample approval before production",
    ],
    cta: { label: "Order a Sample Kit", href: "/sample-kit" },
  },
  {
    name: "Brand Launch Packaging System",
    positioning: "For brands that want a complete eco-conscious packaging experience.",
    bestFor: "Brands launching or rebranding",
    priceHint: "Custom-quoted",
    includes: [
      "Material strategy",
      "Multiple packaging elements (bags, tags, cards, inserts, sleeves, toppers)",
      "Print & finishing options",
      "Sampling round",
      "Production coordination",
      "Bulk quote",
    ],
    cta: { label: "Request a quote", href: "/quote" },
    highlight: true,
  },
  {
    name: "Corporate / CSR Campaign",
    positioning: "For companies that want sustainable gifting or campaign material people remember.",
    bestFor: "Corporate gifting & CSR teams",
    priceHint: "Custom-quoted",
    includes: [
      "Seed-paper products (cards, calendars, gift packaging)",
      "Campaign message integration",
      "Logo customization",
      "Bulk production",
      "Delivery timeline planning",
    ],
    cta: { label: "Plan a campaign", href: "/quote" },
  },
];

// Risk-reversal guarantees (safe ones only — no germination/sales guarantees).
export const guarantees: string[] = [
  "Sample-kit cost adjusted against your bulk order",
  "No bulk production before you approve a sample",
  "Material recommendation based on your actual packaging use-case",
  "Transparent MOQ and timeline before you confirm",
  "A revision round included before production",
];
