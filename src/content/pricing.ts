import type { PricingTier } from "./types";

// "Buying frames", not fixed SKU prices — per the Hormozi-style offer structure.
export const pricingTiers: PricingTier[] = [
  {
    name: "Starter Kit",
    positioning: "For brands trying plantable packaging for the first time.",
    bestFor: "Small brands and first-timers",
    priceHint: "Start with a sample kit",
    includes: [
      "A call to pick the right material",
      "One or two packaging formats",
      "Logo and single-color printing",
      "Our lowest minimum quantities",
      "Standard print options",
      "You approve a sample before we produce",
    ],
    cta: { label: "Order a sample kit", href: "/sample-kit" },
  },
  {
    name: "Brand Launch",
    positioning: "For brands putting a full packaging set into market at once.",
    bestFor: "Brands launching or rebranding",
    priceHint: "Priced to your brief",
    includes: [
      "Material chosen per item, not one-size-fits-all",
      "Bags, tags, cards, inserts, sleeves and toppers",
      "Print and finishing options",
      "A sampling round",
      "We coordinate the production run",
      "Bulk quote across the whole set",
    ],
    cta: { label: "Request a quote", href: "/quote" },
    highlight: true,
  },
  {
    name: "Corporate / CSR Campaign",
    positioning: "For gifting and CSR campaigns that need to land with staff, clients or media.",
    bestFor: "Corporate gifting and CSR teams",
    priceHint: "Priced to your brief",
    includes: [
      "Seed paper cards, calendars and gift packaging",
      "Your campaign message printed throughout",
      "Logo and brand-color printing",
      "Bulk production",
      "Delivery scheduled around your campaign date",
    ],
    cta: { label: "Plan a campaign", href: "/quote" },
  },
];

// Risk-reversal guarantees (safe ones only — no germination/sales guarantees).
export const guarantees: string[] = [
  "Your sample kit cost comes off your bulk order",
  "Nothing goes into bulk production until you approve a sample",
  "We recommend material based on how the packaging will actually be used",
  "Minimum quantity and timeline confirmed in writing before you commit",
  "One revision round included before production",
];
