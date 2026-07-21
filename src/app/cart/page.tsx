"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, formatPKR } from "@/components/cart/cart-context";
import { computeShipping } from "@/lib/commerce";

export default function CartPage() {
  const { items, setQty, remove, subtotal, isPriced } = useCart();
  const shipping = computeShipping(subtotal);

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container-page max-w-xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <FileText className="h-7 w-7 text-brand" />
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-heading)] text-3xl font-bold">
            Your quote list is empty
          </h1>
          <p className="mt-3 text-muted-foreground">
            Browse our products and tap <strong>Add to Quote</strong> to build a
            list, or request a quote directly for a custom or bulk order.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button asChild>
              <Link href="/products">Browse products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/quote">Request a quote</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-page grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold">
            {isPriced ? "Your cart" : "Your quote list"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPriced
              ? "Set quantities, then checkout. Shipping is added at the next step."
              : "Set quantities, then send it to us — we'll reply with pricing, MOQ and lead time. No payment now."}
          </p>
          <div className="mt-6 divide-y rounded-2xl border bg-card">
            {items.map((item) => {
              const step = item.variant ? 50 : 1;
              return (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    {item.variantLabel && (
                      <p className="text-xs text-muted-foreground">
                        {item.variantLabel}
                      </p>
                    )}
                    <p className="text-sm text-brand">
                      {item.price == null
                        ? "Custom-quoted"
                        : `${formatPKR(item.price)}${item.variant ? " / sheet" : ""}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Decrease"
                      onClick={() => setQty(item.id, item.qty - step)}
                      className="grid h-8 w-8 place-items-center rounded-md border hover:bg-muted"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-12 text-center text-sm">
                      {item.qty.toLocaleString("en-PK")}
                    </span>
                    <button
                      aria-label="Increase"
                      onClick={() => setQty(item.id, item.qty + step)}
                      className="grid h-8 w-8 place-items-center rounded-md border hover:bg-muted"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {item.price != null && (
                    <span className="w-28 text-right font-medium">
                      {formatPKR(item.price * item.qty)}
                    </span>
                  )}
                  <button
                    aria-label="Remove"
                    onClick={() => remove(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-card p-6">
            {isPriced ? (
              <>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">
                  Order summary
                </h2>
                <dl className="mt-5 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatPKR(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>{shipping === 0 ? "Free" : formatPKR(shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <dt>Total</dt>
                    <dd>{formatPKR(subtotal + shipping)}</dd>
                  </div>
                </dl>
                <Button asChild size="lg" className="mt-5 w-full">
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="mt-3 w-full">
                  <Link href="/quote">Request a quote instead</Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">
                  Ready for a quote?
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Send us this list with your details and we&apos;ll come back
                  with pricing, minimum order quantities and timelines.
                </p>
                <Button asChild size="lg" className="mt-5 w-full">
                  <Link href="/quote">Request a quote</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
