"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MegaMenuCategory } from "@/lib/mega-menu";

/**
 * Desktop "Products" mega menu.
 *
 * Structure: a disclosure (trigger button + panel) wrapping a vertical tablist.
 * The category rail is the tablist; the links/image/CTA on the right are the
 * tabpanel. That pairing is what lets hover *and* keyboard drive the same state
 * without inventing bespoke ARIA — arrow keys move between categories, Tab
 * walks into the product links, Escape closes and restores focus.
 *
 * The panel stays mounted and is toggled via `data-state`, so open/close is a
 * plain CSS transition on an element that already exists. Mount-then-animate
 * would need a rAF tick, which is exactly what breaks in frozen preview panes.
 * `inert` keeps the closed panel out of the tab order and off the a11y tree.
 */
export function ProductsMegaMenu({
  categories,
  glass,
  onOpenChange,
}: {
  categories: MegaMenuCategory[];
  /** Header is transparent over the hero — trigger text goes white. */
  glass?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const triggerId = `${baseId}-trigger`;

  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /** Grace period so a diagonal sweep from trigger to panel doesn't close it. */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * Blocks the hover/focus opener after a deliberate dismissal. Without it,
   * Escape restores focus to the trigger, the trigger's focus handler fires,
   * and the menu reopens the instant it was closed. Cleared once the pointer
   * leaves, so a fresh hover works normally.
   */
  const dismissed = useRef(false);
  /** Set when ArrowDown opened the menu, so focus lands in the rail on commit. */
  const focusRailOnOpen = useRef(false);

  const pathname = usePathname();

  const active =
    categories.find((c) => c.slug === activeSlug) ?? categories[0];
  const activeIndex = categories.findIndex((c) => c.slug === active?.slug);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  /** `force` is for explicit intent (click, ArrowDown), which ignores dismissal. */
  const openMenu = useCallback(
    (force = false) => {
      if (dismissed.current && !force) return;
      dismissed.current = false;
      cancelClose();
      setOpen(true);
    },
    [cancelClose],
  );

  const closeMenu = useCallback(
    (restoreFocus = false) => {
      dismissed.current = true;
      cancelClose();
      setOpen(false);
      if (restoreFocus) triggerRef.current?.focus();
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    // Pointer left the menu entirely: drop the dismissal so hovering back in
    // re-opens as usual.
    dismissed.current = false;
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, [cancelClose]);

  useEffect(() => onOpenChange?.(open), [open, onOpenChange]);

  // Moving focus has to wait for the commit that drops `inert` — an inert
  // subtree cannot take focus. An effect runs at exactly that point.
  useEffect(() => {
    if (!open || !focusRailOnOpen.current) return;
    focusRailOnOpen.current = false;
    tabRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);
  useEffect(() => cancelClose, [cancelClose]);

  // Navigating away closes the menu — a selected link should not leave the
  // panel hanging over the page it just loaded. Adjusted during render rather
  // than in an effect so it lands in the same commit as the route change.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };
    // Focus escaping the menu entirely (Tab off the last link) closes it.
    const onFocusIn = (event: FocusEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open, closeMenu]);

  /** Roving focus across the category rail, per the tablist pattern. */
  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = categories.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    setActiveSlug(categories[next].slug);
    tabRefs.current[next]?.focus();
  };

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="static"
      onMouseEnter={() => openMenu()}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => (open ? closeMenu() : openMenu(true))}
        onFocus={() => openMenu()}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (open) {
              // Already un-inert — focus can move right now.
              tabRefs.current[activeIndex]?.focus();
            } else {
              focusRailOnOpen.current = true;
              openMenu(true);
            }
          }
        }}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium transition",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
          glass
            ? "text-white/90 hover:text-white focus-visible:outline-white"
            : "text-foreground/80 hover:text-foreground",
        )}
      >
        Products
        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Anchored to the <header>, which is the nearest positioned ancestor —
          that is what makes the panel span the full viewport width without a
          horizontal overflow of its own. */}
      <div
        id={panelId}
        role="group"
        aria-labelledby={triggerId}
        data-state={open ? "open" : "closed"}
        inert={!open}
        onMouseEnter={cancelClose}
        className={cn(
          "absolute inset-x-0 top-full z-50 origin-top border-b border-border/60 bg-background shadow-xl shadow-black/5",
          "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          "data-[state=closed]:pointer-events-none data-[state=closed]:-translate-y-1 data-[state=closed]:opacity-0",
          "data-[state=open]:translate-y-0 data-[state=open]:opacity-100",
        )}
      >
        <div className="container-page grid grid-cols-12 gap-8 py-8">
          {/* Left: category rail */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Product categories"
            className="col-span-4 flex flex-col gap-0.5 xl:col-span-3"
          >
            {categories.map((category, index) => {
              const selected = category.slug === active.slug;
              return (
                <button
                  key={category.slug}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`${baseId}-tab-${category.slug}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-tabpanel`}
                  tabIndex={selected ? 0 : -1}
                  onMouseEnter={() => setActiveSlug(category.slug)}
                  onFocus={() => setActiveSlug(category.slug)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    selected
                      ? "bg-brand/10 text-brand"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span>{category.name}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "h-4 w-4 -rotate-90 shrink-0 transition",
                      selected
                        ? "text-brand opacity-100"
                        : "opacity-0 group-hover:opacity-60",
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Middle + right: the active category's panel */}
          <div
            id={`${baseId}-tabpanel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active.slug}`}
            tabIndex={-1}
            className="col-span-8 grid grid-cols-8 gap-8 xl:col-span-9"
          >
            <div className="col-span-5">
              <p className="eyebrow">{active.name}</p>
              <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                {active.description}
              </p>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1">
                {active.products.map((product) => (
                  <li key={product.href}>
                    <Link
                      href={product.href}
                      onClick={() => closeMenu()}
                      className={cn(
                        "block rounded-md py-1.5 text-sm text-foreground/80 transition",
                        "hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      )}
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3">
              <Link
                href={active.href}
                onClick={() => closeMenu()}
                className={cn(
                  "group block overflow-hidden rounded-xl border bg-secondary/30 transition hover:shadow-lg hover:shadow-black/5",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {active.image ? (
                    <Image
                      // Keyed so switching category swaps the image rather than
                      // cross-fading a stale one under the new alt text.
                      key={active.image}
                      src={active.image}
                      alt={active.imageAlt}
                      fill
                      sizes="320px"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="h-full w-full bg-gradient-to-br from-secondary via-accent to-cream"
                    />
                  )}
                </div>
                <span className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-brand">
                  View all {active.name}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>

              <Link
                href="/products"
                onClick={() => closeMenu()}
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-foreground/70 transition",
                  "hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                )}
              >
                Browse the full catalogue
                <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
