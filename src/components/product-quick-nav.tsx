"use client";

// Interactive, category-based product navigator shown under the products hero.
// Users pick one of five categories; the matching products appear immediately
// below in a horizontal card carousel that fades + slides on switch.
//
// Images come straight from the product data (looked up by slug) so they stay
// in sync with src/content/products.ts. Each product links to its detail page
// (/products/[slug]); the "View all" link jumps to the same product's card in
// the full listing further down this page (cards carry id={slug}).

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { products } from "@/content/products";

type NavItem = { slug: string; label: string };
type Category = {
  id: string;
  label: string;
  blurb: string;
  items: NavItem[];
};

// --- Category → product mapping (labels follow the client's product list) ---
const CATEGORIES: Category[] = [
  {
    id: "cards-tags",
    label: "Cards & Tags",
    blurb: "Business cards, greeting cards, tags & more",
    items: [
      { slug: "plantable-business-cards", label: "Business cards" },
      { slug: "hang-tags-price-tags", label: "Tags" },
      { slug: "plantable-greeting-cards-set", label: "Greeting cards" },
      { slug: "plantable-bookmarks", label: "Bookmarks" },
      { slug: "plantable-envelopes", label: "Envelopes (flap / V-shape)" },
      { slug: "plantable-pennants", label: "Pennants" },
    ],
  },
  {
    id: "stationery-print",
    label: "Stationery & Print",
    blurb: "Diaries, notebooks, letterheads & event print",
    items: [
      { slug: "plantable-diaries", label: "Diaries (A5) — outer seed paper" },
      { slug: "plantable-notebooks", label: "Notebooks — outer seed paper" },
      { slug: "plantable-letterheads", label: "Letterheads" },
      { slug: "plantable-brochures", label: "Brochures" },
      { slug: "plantable-event-stationery", label: "Event stationery" },
      { slug: "branded-sleeves-inserts", label: "Sleeves & inserts" },
      { slug: "seed-paper-calendars", label: "Calendars" },
    ],
  },
  {
    id: "writing-instruments",
    label: "Writing Instruments",
    blurb: "Seeded pencils & ballpoints",
    items: [
      { slug: "plantable-pencils", label: "Pencils" },
      { slug: "plantable-ball-points", label: "Ballpoints" },
    ],
  },
  {
    id: "seed-products-bags",
    label: "Seed Products & Bags",
    blurb: "Seed balls, pouches, bags & coasters",
    items: [
      { slug: "custom-seed-balls-bulk", label: "Seed balls" },
      { slug: "seed-ball-pouches", label: "Pouches for seed balls" },
      { slug: "custom-shopping-bags", label: "Shopping bags (small)" },
      { slug: "seed-paper-coasters", label: "Coasters (round)" },
    ],
  },
  {
    id: "paper-by-the-sheet",
    label: "Paper by the Sheet",
    blurb: "Seed paper, deckle edge & cotton stock",
    items: [
      { slug: "seed-paper-sheets-bulk", label: "Seed paper sheets" },
      { slug: "deckle-edge-seed-paper", label: "Deckle edge seed paper" },
      { slug: "deckle-edge-paper", label: "Deckle edge paper (without seeds)" },
      { slug: "cotton-paper", label: "Cotton paper" },
    ],
  },
];

// Simple outline icons (inline SVG, matching the project's icon convention).
const ICONS: Record<string, ReactNode> = {
  "cards-tags": (
    <>
      <rect x="2.5" y="6" width="14" height="11" rx="2" />
      <path d="M8 3.5h9.2a2 2 0 0 1 2 2V15" />
    </>
  ),
  "stationery-print": (
    <>
      <path d="M5 3.5h10a2 2 0 0 1 2 2v15l-3-2-2 2-2-2-2 2-2-2-2 2v-15a2 2 0 0 1 2-2Z" />
      <path d="M8 8h6M8 11.5h6" />
    </>
  ),
  "writing-instruments": (
    <>
      <path d="M4 20l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" />
      <path d="M13.5 7.5l3 3" />
    </>
  ),
  "seed-products-bags": (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c0-3 2.2-5.2 5.5-5.2 0 3.3-2.5 5.2-5.5 5.2Z" />
      <path d="M12 13.5c0-2.5-2-4.6-5-4.6 0 2.7 2 4.6 5 4.6Z" />
    </>
  ),
  "paper-by-the-sheet": (
    <>
      <rect x="6" y="3.5" width="12" height="15" rx="1.6" />
      <path d="M3.5 6.5v12A2 2 0 0 0 5.5 20.5h10" />
    </>
  ),
};

const imageBySlug = new Map(products.map((p) => [p.slug, p.image]));

// Runs synchronously at commit in the browser (correct scroll metrics, no
// dependence on throttled timers/rAF); falls back to useEffect during SSR.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ProductQuickNav() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);

  // Restore the last-picked category when the user comes back to the page.
  // Initialised after mount to avoid a hydration mismatch.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("boxit:productCategory");
      // Restore selection from storage on mount — the canonical client-only pattern.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && CATEGORIES.some((c) => c.id === saved)) setActiveId(saved);
    } catch {
      /* sessionStorage unavailable — fall back to the default */
    }
  }, []);

  const selectCategory = useCallback((id: string) => {
    setActiveId(id);
    try {
      sessionStorage.setItem("boxit:productCategory", id);
    } catch {
      /* ignore */
    }
  }, []);

  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  return (
    <section
      aria-label="Browse products by category"
      className="scroll-smooth border-b bg-secondary/30"
    >
      {/* Enter animation for the product panel. The keyframe's start frame is
          never fully transparent, so if the animation clock is frozen (a
          backgrounded/throttled tab) the content is still visible — it just
          isn't animated. Real browsers play the subtle fade + horizontal slide.
          Reduced motion drops the slide. */}
      <style>{`
        .boxit-panel-in {
          animation: boxitPanelIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .boxit-panel-in[data-reduce="true"] {
          animation-name: boxitPanelFade;
        }
        @keyframes boxitPanelIn {
          from { opacity: 0.4; transform: translateX(22px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes boxitPanelFade {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .boxit-panel-in { animation-name: boxitPanelFade; animation-duration: 0.15s; }
        }
      `}</style>
      {/* Compact vertical rhythm so the whole browse section — heading,
          category row, recommended carousel and the view-all link — fits a
          ~670px laptop viewport at 100% zoom. */}
      <div className="container-page pb-4 pt-5 sm:pb-4 sm:pt-6">
        <p className="eyebrow">Browse products</p>
        <h2 className="mt-1.5 font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
          Shop by product category
        </h2>
        <p className="mt-1.5 max-w-xl text-muted-foreground">
          Choose a category to explore the available products.
        </p>

        {/* Category selectors: horizontal scroll on mobile, grid on larger screens */}
        <div
          role="tablist"
          aria-label="Product categories"
          className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-3 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((cat) => {
            const selected = cat.id === active.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${cat.id}`}
                id={`tab-${cat.id}`}
                onClick={() => selectCategory(cat.id)}
                className={`group flex min-h-[44px] min-w-[220px] shrink-0 snap-start flex-col gap-1.5 rounded-2xl border p-3 text-left transition-[border-color,box-shadow] sm:min-w-0 ${
                  selected
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-border bg-card text-foreground hover:border-brand/60 hover:bg-brand/5"
                }`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    selected
                      ? "bg-white/15 text-white"
                      : "bg-brand/10 text-brand group-hover:bg-brand/15"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {ICONS[cat.id]}
                  </svg>
                </span>
                <span className="text-sm font-semibold leading-tight">
                  {cat.label}
                </span>
                <span
                  className={`text-xs leading-snug ${
                    selected ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {cat.blurb}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products for the selected category */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold sm:text-xl">
              Recommended products in {active.label}
            </h3>
          </div>

          {/* Keyed so it re-mounts on category change; a CSS keyframe replays
              the subtle fade + horizontal slide each switch. The resting state
              is fully visible, so content shows even if the animation doesn't
              run (unlike a JS enter animation stuck at its initial frame). */}
          <div
            key={active.id}
            id={`panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            className="boxit-panel-in mt-3"
            style={{ animationDuration: reduceMotion ? "0.15s" : undefined }}
            data-reduce={reduceMotion ? "true" : undefined}
          >
            <ProductCarousel category={active} reduceMotion={!!reduceMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Horizontal product carousel with prev/next, wheel + drag scrolling ---
function ProductCarousel({
  category,
  reduceMotion,
}: {
  category: Category;
  reduceMotion: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  // Recompute arrow state when the category (and therefore the item count)
  // changes, and reset the scroll position to the start. Layout can settle
  // slightly after mount (hydration, images loading), so we re-measure on a
  // ResizeObserver, on a few short timeouts, and whenever an image loads —
  // a single mount-time measurement is unreliable on first paint.
  useIsoLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    updateArrows();

    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    const imgs = Array.from(el.querySelectorAll("img"));
    imgs.forEach((img) => img.addEventListener("load", updateArrows));
    window.addEventListener("resize", updateArrows);

    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", updateArrows));
      window.removeEventListener("resize", updateArrows);
    };
  }, [category.id, updateArrows]);

  const scrollByCards = useCallback(
    (dir: 1 | -1) => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollBy({
        left: dir * el.clientWidth * 0.8,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion],
  );

  // Mouse-wheel → horizontal scroll (only when the row can actually move that
  // way, so vertical page scrolling is never trapped). Native listener so we
  // can preventDefault.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaX !== 0) return; // trackpads already scroll horizontally
      const delta = e.deltaY;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;
      e.preventDefault();
      el.scrollLeft += delta;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [category.id]);

  // Pointer drag-to-scroll. Suppresses the click that follows a real drag so
  // the user doesn't accidentally navigate to a product.
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el || e.pointerType === "touch") return; // native touch scroll is fine
    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: false,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={updateArrows}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {category.items.map((item) => (
          <ProductTile key={item.slug} item={item} />
        ))}
      </div>

      {/* Prev / next controls (desktop). Rendered only when there's room to
          scroll that way — a plain conditional, not an opacity transition, so
          they can't get stuck by a frozen animation clock. */}
      {canPrev && (
        <button
          type="button"
          aria-label="Previous products"
          onClick={() => scrollByCards(-1)}
          className="absolute -left-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-card text-foreground shadow-md transition-colors hover:border-brand hover:text-brand md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      {canNext && (
        <button
          type="button"
          aria-label="Next products"
          onClick={() => scrollByCards(1)}
          className="absolute -right-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-card text-foreground shadow-md transition-colors hover:border-brand hover:text-brand md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}

      <div className="mt-4">
        <Link
          href={`#${category.items[0]?.slug ?? ""}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          View all products in {category.label}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function ProductTile({ item }: { item: NavItem }) {
  const src = imageBySlug.get(item.slug);
  return (
    <Link
      href={`/products/${item.slug}`}
      draggable={false}
      className="group flex w-[68%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card transition hover:border-brand hover:shadow-lg hover:shadow-black/5 sm:w-56 lg:w-60"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary/30">
        {src ? (
          <Image
            src={src}
            alt={item.label}
            fill
            draggable={false}
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 72vw, 240px"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-secondary via-accent to-cream">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand/70" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 21v-7m0 0c0-3 2.5-5.5 6-5.5 0 3.5-2.7 5.5-6 5.5Zm0 0c0-2.6-2.2-4.8-5.2-4.8C6.8 11.4 8.9 14 12 14Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-between gap-2 p-3">
        <span className="text-sm font-semibold leading-tight">{item.label}</span>
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
