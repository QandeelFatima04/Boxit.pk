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
import { useCart } from "./cart-context";

export function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, count } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your quote list ({count})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-muted-foreground">Your quote list is empty.</p>
            <p className="text-sm text-muted-foreground">
              Browse products and tap{" "}
              <span className="font-medium text-brand">Add to Quote</span>, or{" "}
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
            {items.map((item) => (
              <div key={item.slug} className="flex gap-3 border-b pb-4">
                <div className="flex-1">
                  <p className="font-medium leading-tight">{item.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.slug, item.qty - 1)}
                      className="grid h-7 w-7 place-items-center rounded-md border hover:bg-muted"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.slug, item.qty + 1)}
                      className="grid h-7 w-7 place-items-center rounded-md border hover:bg-muted"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      aria-label="Remove item"
                      onClick={() => remove(item.slug)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="gap-3">
            <p className="text-xs text-muted-foreground">
              We&apos;ll quote pricing, MOQ and lead time for these items — no
              payment now.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/quote" onClick={() => setOpen(false)}>
                Request a quote
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
