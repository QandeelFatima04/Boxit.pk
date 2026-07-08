// Instant estimator pricing model.
//
// The site strategy is "no fixed SKU prices — every project is custom", so this
// deliberately returns an *indicative range*, never a single committed price.
// It gives leads an immediate ballpark, then routes them to a real quote.
//
// NOTE: all rates below are PLACEHOLDERS to be confirmed with production before
// launch (same convention as products.ts). They are per-unit costs in PKR at the
// "standard" quantity tier (300–999), on seed paper, with no printing/finishing.
// Everything else is expressed as a multiplier on that base, so the numbers stay
// easy for non-technical staff to tune in one place.

export type EstimatorFormat = {
  key: string;
  label: string;
  /** Per-unit PKR at the standard tier, seed paper, no print, no finishing. */
  basePerUnit: number;
  /** Smallest order we'll take for this format. Qty is clamped up to this. */
  minQty: number;
  /** One-time setup / plate / die cost, spread across the run. */
  setupFee: number;
  /** What we're counting, for the UI ("cards", "sheets", "bags"…). */
  unitNoun: string;
  leadTime: string;
};

export type EstimatorOption = {
  key: string;
  label: string;
  /** Multiplier on per-unit cost (material / printing) or additive uplift (finishing). */
  factor: number;
  /** Short helper text shown under the option. */
  hint?: string;
};

// ---------------------------------------------------------------------------
// Formats — mirror the product catalogue so an estimate maps to a real product.
// ---------------------------------------------------------------------------
export const formats: EstimatorFormat[] = [
  { key: "business-cards", label: "Business cards", basePerUnit: 12, minQty: 250, setupFee: 1500, unitNoun: "cards", leadTime: "5–8 working days" },
  { key: "hang-tags", label: "Hang / price tags", basePerUnit: 15, minQty: 500, setupFee: 2000, unitNoun: "tags", leadTime: "7–10 working days" },
  { key: "greeting-cards", label: "Greeting / thank-you cards", basePerUnit: 45, minQty: 100, setupFee: 2500, unitNoun: "cards", leadTime: "7–10 working days" },
  { key: "bookmarks", label: "Bookmarks", basePerUnit: 18, minQty: 100, setupFee: 1500, unitNoun: "bookmarks", leadTime: "7–10 working days" },
  { key: "invitations", label: "Invitations (card + envelope)", basePerUnit: 90, minQty: 300, setupFee: 3500, unitNoun: "sets", leadTime: "10–15 working days" },
  { key: "coasters", label: "Coasters", basePerUnit: 35, minQty: 100, setupFee: 2000, unitNoun: "coasters", leadTime: "7–10 working days" },
  { key: "calendars", label: "Plantable calendars", basePerUnit: 250, minQty: 300, setupFee: 5000, unitNoun: "calendars", leadTime: "10–15 working days" },
  { key: "diaries", label: "Diaries / notebooks", basePerUnit: 350, minQty: 100, setupFee: 5000, unitNoun: "diaries", leadTime: "10–15 working days" },
  { key: "sheets-a4", label: "Seed paper sheets (A4, bulk)", basePerUnit: 22, minQty: 300, setupFee: 800, unitNoun: "sheets", leadTime: "5–10 working days" },
  { key: "shopping-bags", label: "Shopping bags", basePerUnit: 55, minQty: 300, setupFee: 3000, unitNoun: "bags", leadTime: "7–12 working days" },
  { key: "gift-boxes", label: "Corporate gift boxes", basePerUnit: 450, minQty: 50, setupFee: 5000, unitNoun: "boxes", leadTime: "10–15 working days" },
  { key: "seed-balls", label: "Seed balls", basePerUnit: 30, minQty: 100, setupFee: 800, unitNoun: "balls", leadTime: "5–10 working days" },
  { key: "sleeves-inserts", label: "Sleeves / inserts", basePerUnit: 25, minQty: 300, setupFee: 2000, unitNoun: "units", leadTime: "7–10 working days" },
  { key: "confetti", label: "Confetti / favours", basePerUnit: 60, minQty: 50, setupFee: 1000, unitNoun: "packs", leadTime: "5–10 working days" },
  { key: "pennants", label: "Pennants", basePerUnit: 35, minQty: 50, setupFee: 1500, unitNoun: "pennants", leadTime: "7–10 working days" },
];

export const materials: EstimatorOption[] = [
  { key: "seed-paper", label: "Plantable seed paper", factor: 1.0, hint: "Grows into herbs & wildflowers" },
  { key: "biodegradable", label: "Biodegradable (no seeds)", factor: 0.82, hint: "Tree-free, lower cost" },
  { key: "premium-handmade", label: "Premium handmade / deckle edge", factor: 1.2, hint: "Textured, gift-grade finish" },
];

export const printingOptions: EstimatorOption[] = [
  { key: "none", label: "None / plain", factor: 1.0 },
  { key: "single-1side", label: "Single colour, one side", factor: 1.1 },
  { key: "full-1side", label: "Full colour, one side", factor: 1.22 },
  { key: "full-2side", label: "Full colour, both sides", factor: 1.4 },
];

// Finishing is additive and multi-select — each adds to the per-unit uplift.
export const finishingOptions: EstimatorOption[] = [
  { key: "embossing", label: "Embossing", factor: 0.18 },
  { key: "foil", label: "Foil stamping", factor: 0.28 },
  { key: "die-cut", label: "Custom die-cut shape", factor: 0.14 },
  { key: "string-eyelet", label: "String / eyelet", factor: 0.05 },
];

// Quantity tiers — bigger runs get a lower per-unit multiplier (economies of scale).
const quantityTiers: { min: number; factor: number }[] = [
  { min: 10000, factor: 0.7 },
  { min: 3000, factor: 0.78 },
  { min: 1000, factor: 0.88 },
  { min: 300, factor: 1.0 },
  { min: 0, factor: 1.25 },
];

function tierFactor(qty: number): number {
  return quantityTiers.find((t) => qty >= t.min)!.factor;
}

// ± band on the computed per-unit, so we present a range not a fixed price.
const RANGE_BAND = 0.1;

export type EstimatorInput = {
  format: string;
  quantity: number;
  material: string;
  printing: string;
  /** finishing option keys */
  finishing: string[];
};

export type EstimateResult = {
  /** True if the requested qty was below the format's MOQ and was clamped up. */
  belowMoq: boolean;
  /** Quantity actually used for the estimate (clamped to MOQ). */
  quantity: number;
  minQty: number;
  unitNoun: string;
  leadTime: string;
  perUnitLow: number;
  perUnitHigh: number;
  setupFee: number;
  totalLow: number;
  totalHigh: number;
};

/** Pure estimation function — no side effects, easy to test and tune. */
export function estimate(input: EstimatorInput): EstimateResult | null {
  const fmt = formats.find((f) => f.key === input.format);
  if (!fmt) return null;

  const material = materials.find((m) => m.key === input.material) ?? materials[0];
  const printing = printingOptions.find((p) => p.key === input.printing) ?? printingOptions[0];
  const finishingUplift = input.finishing.reduce((sum, key) => {
    const opt = finishingOptions.find((o) => o.key === key);
    return sum + (opt?.factor ?? 0);
  }, 0);

  const belowMoq = input.quantity < fmt.minQty;
  const qty = Math.max(input.quantity, fmt.minQty);

  // Per-unit = base × material × printing × (1 + finishing) × quantity-tier
  const perUnit =
    fmt.basePerUnit *
    material.factor *
    printing.factor *
    (1 + finishingUplift) *
    tierFactor(qty);

  const perUnitLow = Math.round(perUnit * (1 - RANGE_BAND));
  const perUnitHigh = Math.round(perUnit * (1 + RANGE_BAND));

  return {
    belowMoq,
    quantity: qty,
    minQty: fmt.minQty,
    unitNoun: fmt.unitNoun,
    leadTime: fmt.leadTime,
    perUnitLow,
    perUnitHigh,
    setupFee: fmt.setupFee,
    totalLow: perUnitLow * qty + fmt.setupFee,
    totalHigh: perUnitHigh * qty + fmt.setupFee,
  };
}
