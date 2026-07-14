// Clickable index of every product, shown just under the products hero.
// Each chip is an in-page anchor that jumps to the matching product card
// (cards carry id={slug} + scroll-mt in product-card.tsx).
//
// Order and labels follow the client's product list. To add/rename an entry,
// edit QUICK_NAV — `slug` must match a product slug in src/content/products.ts.

const QUICK_NAV: { slug: string; label: string }[] = [
  { slug: "plantable-business-cards", label: "Business cards" },
  { slug: "hang-tags-price-tags", label: "Tags" },
  { slug: "plantable-greeting-cards-set", label: "Greeting cards" },
  { slug: "plantable-bookmarks", label: "Bookmarks" },
  { slug: "plantable-envelopes", label: "Envelopes (flap / v-shape)" },
  { slug: "seed-paper-coasters", label: "Coasters (round)" },
  { slug: "seed-paper-calendars", label: "Calendars" },
  { slug: "plantable-diaries", label: "Diaries (A5) — outer seed paper" },
  { slug: "plantable-notebooks", label: "Notebooks — outer seed paper" },
  { slug: "seed-paper-sheets-bulk", label: "Seed paper sheets" },
  { slug: "custom-shopping-bags", label: "Shopping bags (small)" },
  { slug: "custom-seed-balls-bulk", label: "Seed balls" },
  { slug: "seed-ball-pouches", label: "Pouches for seed balls" },
  { slug: "branded-sleeves-inserts", label: "Sleeves & inserts" },
  { slug: "plantable-pennants", label: "Pennants" },
  { slug: "plantable-letterheads", label: "Letterheads" },
  { slug: "plantable-pencils", label: "Pencils" },
  { slug: "plantable-ball-points", label: "Ball points" },
  { slug: "plantable-brochures", label: "Brochures" },
  { slug: "plantable-event-stationery", label: "Event stationery" },
  { slug: "deckle-edge-seed-paper", label: "Deckle edge seed paper" },
  { slug: "deckle-edge-paper", label: "Deckle edge paper (without seeds)" },
  { slug: "cotton-paper", label: "Cotton paper" },
];

export function ProductQuickNav() {
  return (
    <section
      aria-label="Jump to a product"
      className="scroll-smooth border-b bg-secondary/30"
    >
      <div className="container-page py-8 sm:py-10">
        <p className="eyebrow">Browse products</p>
        <h2 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-bold sm:text-2xl">
          Tap a product to jump straight to it
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {QUICK_NAV.map((item) => (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                className="inline-flex items-center rounded-full border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand hover:bg-brand hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
