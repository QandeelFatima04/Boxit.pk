"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/content/types";

/**
 * Size + quantity picker for products priced per unit (seed paper sheets).
 * The buyer chooses a sheet size and how many sheets; the line total is
 * variant.price × qty. The order API recomputes both from the catalogue, so
 * nothing here is trusted server-side.
 */
export function SheetConfigurator({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const [variantKey, setVariantKey] = useState(variants[0]?.key ?? "");
  const selected = variants.find((v) => v.key === variantKey) ?? variants[0];
  const [qty, setQty] = useState(selected?.minQty ?? 1);
  // Empty string while the shopper is mid-edit, so the field can be cleared.
  const [qtyText, setQtyText] = useState(String(selected?.minQty ?? 1));

  if (!selected) return null;

  const unit = product.unitNoun ?? "units";
  const belowMoq = qty < selected.minQty;
  const total = selected.price * qty;

  function chooseVariant(key: string) {
    const next = variants.find((v) => v.key === key);
    if (!next) return;
    setVariantKey(key);
    // Bump the count up if the new size has a higher minimum.
    if (qty < next.minQty) {
      setQty(next.minQty);
      setQtyText(String(next.minQty));
    }
  }

  function commitQty(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    const next = Number.isFinite(parsed) ? Math.max(parsed, selected.minQty) : selected.minQty;
    setQty(next);
    setQtyText(String(next));
  }

  return (
    <div className="mt-6 rounded-2xl border bg-card p-5">
      {/* Size */}
      <fieldset>
        <legend className="text-sm font-medium">Sheet size</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {variants.map((v) => {
            const active = v.key === variantKey;
            return (
              <button
                key={v.key}
                type="button"
                aria-pressed={active}
                onClick={() => chooseVariant(v.key)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  active
                    ? "border-brand bg-secondary/50 ring-1 ring-brand"
                    : "hover:bg-muted",
                )}
              >
                <span className="block font-medium">{v.label}</span>
                <span className="mt-0.5 block text-sm text-brand">
                  {formatPKR(v.price)} / sheet
                </span>
                {v.hint && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {v.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Quantity */}
      <div className="mt-5">
        <label htmlFor="sheet-qty" className="text-sm font-medium">
          Number of {unit}
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id="sheet-qty"
            type="number"
            inputMode="numeric"
            min={selected.minQty}
            step={50}
            value={qtyText}
            onChange={(e) => {
              setQtyText(e.target.value);
              const parsed = Number.parseInt(e.target.value, 10);
              if (Number.isFinite(parsed)) setQty(parsed);
            }}
            onBlur={(e) => commitQty(e.target.value)}
            className="h-11 w-36 rounded-md border bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          <span className="text-sm text-muted-foreground">
            Minimum {selected.minQty.toLocaleString("en-PK")} {unit}
          </span>
        </div>
        {belowMoq && (
          <p className="mt-2 text-sm text-destructive">
            We produce these from {selected.minQty.toLocaleString("en-PK")}{" "}
            {unit} up. Raise the quantity, or request a quote for a smaller run.
          </p>
        )}
      </div>

      {/* Total */}
      <div className="mt-5 flex items-baseline justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">
          {formatPKR(selected.price)} × {qty.toLocaleString("en-PK")} {unit}
        </span>
        <span className="text-2xl font-bold">{formatPKR(total)}</span>
      </div>

      <AddToCartButton
        size="lg"
        className="mt-4 w-full"
        disabled={belowMoq}
        qty={qty}
        item={{
          slug: product.slug,
          name: product.name,
          price: selected.price,
          image: product.image,
          variant: selected.key,
          variantLabel: selected.label,
          minQty: selected.minQty,
          unitNoun: unit,
        }}
      />
      <p className="mt-3 text-xs text-muted-foreground">
        Excludes printing. Need artwork printed on these sheets?{" "}
        <span className="font-medium">Request a quote</span> instead.
      </p>
    </div>
  );
}
