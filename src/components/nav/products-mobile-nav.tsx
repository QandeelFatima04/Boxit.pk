"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MegaMenuCategory } from "@/lib/mega-menu";

/**
 * Tablet/mobile stand-in for the desktop mega menu: the same category → product
 * tree as a single-open accordion inside the existing nav sheet.
 *
 * Hand-rolled rather than built on <Accordion> because each row needs two
 * targets — a disclosure toggle *and* a link straight to the category page —
 * and the shared trigger owns its whole row.
 */
export function ProductsMobileNav({
  categories,
  onNavigate,
}: {
  categories: MegaMenuCategory[];
  /** Closes the sheet once a destination is chosen. */
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <Link
        href="/products"
        onClick={onNavigate}
        className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        All products
      </Link>

      {categories.map((category) => {
        const isOpen = expanded === category.slug;
        const panelId = `mobile-cat-${category.slug}`;
        return (
          <div key={category.slug}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setExpanded(isOpen ? null : category.slug)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                isOpen ? "text-brand" : "hover:bg-muted",
              )}
            >
              <span>{category.name}</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <ul
                id={panelId}
                className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-3"
              >
                {category.products.map((product) => (
                  <li key={product.href}>
                    <Link
                      href={product.href}
                      onClick={onNavigate}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground/75 hover:bg-muted hover:text-foreground"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={category.href}
                    onClick={onNavigate}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-muted"
                  >
                    View all {category.name}
                  </Link>
                </li>
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
