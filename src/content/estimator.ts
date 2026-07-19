// Instant estimator pricing model.
//
// The site strategy is "no fixed SKU prices — every project is custom", so this
// deliberately returns an *indicative range*, never a single committed price.
// It gives leads an immediate ballpark, then routes them to a real quote.
//
// PRICING SOURCE: figures below come from the production pricing sheet
// (pricing.xlsx, noman@eslpk.com, 10 Jul 2026):
//   • perUnit1c = "01 colour screen printing" price per unit (PKR)
//   • perUnit4c = "04 colour printing" price per unit (PKR), where the sheet lists one
//   • minQty    = the sheet MOQ (the least order we take for that item)
// The estimator never quotes below minQty. Material and quantity-tier multipliers
// are the estimator's own adjustment mechanism; finishing is a flat Rs-per-unit add.

export type EstimatorFormat = {
  key: string;
  label: string;
  /** 01-colour screen-printing price per unit (PKR) at MOQ — the sheet's base column. */
  perUnit1c: number;
  /** 04-colour printing price per unit (PKR), where the sheet gives one. */
  perUnit4c?: number;
  /**
   * 01-colour price per unit (PKR) for the LARGE size, where the sheet lists a
   * separate large figure. When absent, Large costs the same as Small.
   */
  perUnit1cLarge?: number;
  /** Sheet MOQ — the least order we take. The quantity field is clamped to this. */
  minQty: number;
  /** What we're counting, for the UI ("cards", "sheets", "bags"…). */
  unitNoun: string;
  leadTime: string;
  /**
   * Whether "Biodegradable (no seeds)" is a valid material for this item. Only the
   * raw paper sheets can be bought without seeds; every finished product is
   * plantable seed paper by definition.
   */
  allowNoSeeds?: boolean;
};

export type EstimatorOption = {
  key: string;
  label: string;
  /** Multiplier on the per-unit price. */
  factor: number;
  /** Short helper text shown under the option. */
  hint?: string;
};

// ---------------------------------------------------------------------------
// Formats — exact products, prices and MOQs from the pricing sheet.
// ---------------------------------------------------------------------------
export const formats: EstimatorFormat[] = [
  { key: "business-cards", label: "Business cards", perUnit1c: 22, perUnit4c: 25, minQty: 1200, unitNoun: "cards", leadTime: "5–8 working days" },
  { key: "tags", label: "Tags", perUnit1c: 35, perUnit4c: 30, minQty: 500, unitNoun: "tags", leadTime: "7–10 working days" },
  { key: "greeting-cards", label: "Greeting cards", perUnit1c: 100, perUnit4c: 80, minQty: 300, unitNoun: "cards", leadTime: "7–10 working days" },
  { key: "bookmarks", label: "Bookmarks", perUnit1c: 45, perUnit4c: 75, minQty: 500, unitNoun: "bookmarks", leadTime: "7–10 working days" },
  { key: "envelopes", label: "Envelopes (flap / v-shape)", perUnit1c: 100, minQty: 300, unitNoun: "envelopes", leadTime: "7–10 working days" },
  { key: "coasters", label: "Coasters (round)", perUnit1c: 40, minQty: 500, unitNoun: "coasters", leadTime: "7–10 working days" },
  { key: "calendars", label: "Calendars", perUnit1c: 750, perUnit4c: 800, minQty: 200, unitNoun: "calendars", leadTime: "10–15 working days" }, // sheet 01-colour range Rs 750–1500
  { key: "diaries", label: "Diaries, A5 (seed paper cover)", perUnit1c: 600, perUnit4c: 750, minQty: 300, unitNoun: "diaries", leadTime: "10–15 working days" }, // sheet range Rs 600–1100
  { key: "notebooks", label: "Notebooks (seed paper cover)", perUnit1c: 400, perUnit4c: 600, minQty: 300, unitNoun: "notebooks", leadTime: "10–15 working days" }, // sheet range Rs 400–700
  { key: "seed-paper-sheets", label: "Seed paper sheets", perUnit1c: 100, perUnit1cLarge: 200, minQty: 300, unitNoun: "sheets", leadTime: "5–10 working days", allowNoSeeds: true }, // small 9"×12", large 15"×20"
  { key: "shopping-bags", label: "Shopping bags", perUnit1c: 200, perUnit4c: 230, perUnit1cLarge: 350, minQty: 200, unitNoun: "bags", leadTime: "7–12 working days" }, // small 8"×6.5"×2.5", large 10"×13"×3.5"; sheet 04-colour range Rs 230–400
  { key: "gift-boxes", label: "Corporate gift boxes (unfilled)", perUnit1c: 100, perUnit4c: 150, minQty: 300, unitNoun: "boxes", leadTime: "10–15 working days" },
  { key: "seed-balls", label: "Seed balls", perUnit1c: 35, minQty: 500, unitNoun: "balls", leadTime: "5–10 working days" },
  { key: "seed-ball-pouches", label: "Pouches for seed balls", perUnit1c: 80, perUnit4c: 100, minQty: 250, unitNoun: "pouches", leadTime: "5–10 working days" },
  { key: "sleeves-inserts", label: "Sleeves & inserts", perUnit1c: 50, minQty: 500, unitNoun: "units", leadTime: "7–10 working days" },
  { key: "pennants", label: "Pennants", perUnit1c: 25, perUnit4c: 30, minQty: 500, unitNoun: "pennants", leadTime: "7–10 working days" },
  { key: "letterheads", label: "Letterheads", perUnit1c: 100, perUnit4c: 125, minQty: 500, unitNoun: "sheets", leadTime: "7–10 working days" },
  { key: "pencils", label: "Pencils", perUnit1c: 100, minQty: 300, unitNoun: "pencils", leadTime: "7–10 working days" },
  { key: "ball-points", label: "Ball points", perUnit1c: 100, minQty: 300, unitNoun: "ball points", leadTime: "7–10 working days" },
  { key: "brochures", label: "Brochures", perUnit1c: 50, perUnit4c: 50, minQty: 500, unitNoun: "brochures", leadTime: "7–10 working days" },
  { key: "event-stationery", label: "Event stationery", perUnit1c: 50, minQty: 500, unitNoun: "items", leadTime: "7–10 working days" },
  { key: "boxes-seed-paper", label: "Boxes (outer seed paper)", perUnit1c: 400, perUnit4c: 450, minQty: 300, unitNoun: "boxes", leadTime: "10–15 working days" },
  { key: "deckle-seed-paper", label: "Deckle edge seed paper", perUnit1c: 75, minQty: 300, unitNoun: "sheets", leadTime: "7–10 working days", allowNoSeeds: true },
  { key: "deckle-paper", label: "Deckle edge paper (without seeds)", perUnit1c: 70, minQty: 300, unitNoun: "sheets", leadTime: "7–10 working days", allowNoSeeds: true },
  { key: "cotton-paper", label: "Cotton paper", perUnit1c: 150, minQty: 100, unitNoun: "sheets", leadTime: "7–10 working days", allowNoSeeds: true },
  { key: "recyclable-diary", label: "Recyclable diary (fabric cover)", perUnit1c: 800, perUnit4c: 800, minQty: 300, unitNoun: "diaries", leadTime: "10–15 working days" },
  { key: "souvenir-economical", label: "Corporate souvenir set — Economical", perUnit1c: 1000, minQty: 200, unitNoun: "sets", leadTime: "10–15 working days" },
  { key: "souvenir-executive", label: "Corporate souvenir set — Executive", perUnit1c: 3000, minQty: 100, unitNoun: "sets", leadTime: "10–15 working days" },
  { key: "souvenir-premium", label: "Corporate souvenir set — Premium", perUnit1c: 5000, minQty: 100, unitNoun: "sets", leadTime: "10–15 working days" },
];

export const materials: EstimatorOption[] = [
  { key: "seed-paper", label: "Plantable seed paper", factor: 1.0, hint: "Herbs and wildflowers, seasonal" },
  { key: "biodegradable", label: "Biodegradable (no seeds)", factor: 0.82, hint: "Tree-free, lower cost" },
];

// Two printing options, exactly as the sheet lists them (single-select).
export const printingOptions: { key: string; label: string }[] = [
  { key: "screen-1c", label: "1-color screen printing" },
  { key: "print-4c", label: "4-color printing" },
];

// Two sizes (single-select). Large uses the sheet's large price where listed,
// otherwise it matches the Small price.
export const sizes: { key: string; label: string }[] = [
  { key: "small", label: "Small" },
  { key: "large", label: "Large" },
];

// Finishing is a flat PKR-per-unit add (Rs 5 each), multi-select.
export type FinishingOption = { key: string; label: string; perUnitAdd: number };
export const finishingOptions: FinishingOption[] = [
  { key: "die-cut", label: "Custom die-cut shape", perUnitAdd: 5 },
  { key: "string-eyelet", label: "String / eyelet", perUnitAdd: 5 },
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
  /** "small" | "large" */
  size: string;
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
  totalLow: number;
  totalHigh: number;
};

/** Pure estimation function — no side effects, easy to test and tune. */
export function estimate(input: EstimatorInput): EstimateResult | null {
  const fmt = formats.find((f) => f.key === input.format);
  if (!fmt) return null;

  const material = materials.find((m) => m.key === input.material) ?? materials[0];

  // Size picks the Small vs Large 01-colour price (Large falls back to Small when
  // the sheet lists no separate large figure).
  const isLarge = input.size === "large";
  const base1c = isLarge ? (fmt.perUnit1cLarge ?? fmt.perUnit1c) : fmt.perUnit1c;

  // Printing swaps which sheet price we base on; 04-colour falls back to the
  // 01-colour price for items the sheet doesn't give a 04-colour rate for.
  const is4c = input.printing === "print-4c";
  const base = is4c && fmt.perUnit4c != null ? fmt.perUnit4c : base1c;

  // Finishing is a flat Rs-per-unit add per selected option.
  const finishingAdd = input.finishing.reduce((sum, key) => {
    const opt = finishingOptions.find((o) => o.key === key);
    return sum + (opt?.perUnitAdd ?? 0);
  }, 0);

  const belowMoq = input.quantity < fmt.minQty;
  const qty = Math.max(input.quantity, fmt.minQty);

  // Per-unit = sheet price × material × quantity-tier, then + flat finishing.
  const printed = base * material.factor * tierFactor(qty);
  const perUnitLow = Math.round(printed * (1 - RANGE_BAND)) + finishingAdd;
  const perUnitHigh = Math.round(printed * (1 + RANGE_BAND)) + finishingAdd;

  return {
    belowMoq,
    quantity: qty,
    minQty: fmt.minQty,
    unitNoun: fmt.unitNoun,
    leadTime: fmt.leadTime,
    perUnitLow,
    perUnitHigh,
    totalLow: perUnitLow * qty,
    totalHigh: perUnitHigh * qty,
  };
}
