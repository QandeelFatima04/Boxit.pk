"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, formatPKR } from "./cart-context";

export function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, count, subtotal, isPriced } =
    useCart();

  // A cart of fixed-price SKUs checks out; anything made-to-order goes to quote.
  const hasQuoteItems = items.some((i) => i.price == null);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isPriced ? "Your cart" : "Your quote list"} ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-muted-foreground">Nothing here yet.</p>
            <p className="text-sm text-muted-foreground">
              Browse products and tap{" "}
              <span className="font-medium text-brand">Add to quote</span>, or{" "}
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="font-medium text-brand underline"
              >
                request a quote
              </Link>{" "}
              directly.
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            {items.map((item) => {
              // Sized lines step by 50 sheets; single SKUs step by 1.
              const step = item.variant ? 50 : 1;
              return (
                <div key={item.id} className="flex gap-3 border-b pb-4">
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{item.name}</p>
                    {item.variantLabel && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.variantLabel}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm text-brand">
                      {item.price == null
                        ? "Custom-quoted"
                        : `${formatPKR(item.price)}${item.variant ? " / sheet" : ""}`}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.id, item.qty - step)}
                        className="grid h-7 w-7 place-items-center rounded-md border hover:bg-muted"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-10 text-center text-sm">
                        {item.qty.toLocaleString("en-PK")}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.id, item.qty + step)}
                        className="grid h-7 w-7 place-items-center rounded-md border hover:bg-muted"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      {item.price != null && (
                        <span className="ml-2 text-sm font-medium">
                          {formatPKR(item.price * item.qty)}
                        </span>
                      )}
                      <button
                        aria-label="Remove item"
                        onClick={() => remove(item.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="gap-3">
            {isPriced ? (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold">
                    {formatPKR(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping is calculated at checkout.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={() => setOpen(false)}>
                    Checkout
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/cart" onClick={() => setOpen(false)}>
                    View cart
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {hasQuoteItems
                    ? "Some items here are made to order. We'll send pricing, minimum order quantity and lead time. Nothing is charged now."
                    : "We'll send pricing, minimum order quantity and lead time for these items. Nothing is charged now."}
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/quote" onClick={() => setOpen(false)}>
                    Request a quote
                  </Link>
                </Button>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
