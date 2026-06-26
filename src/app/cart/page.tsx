"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";

export default function QuoteListPage() {
  const { items, setQty, remove } = useCart();

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
            Your quote list
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Set quantities, then send it to us — we&apos;ll reply with pricing,
            MOQ and lead time. No payment now.
          </p>
          <div className="mt-6 divide-y rounded-2xl border bg-card">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium hover:text-brand"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-brand">Custom-quoted</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Decrease"
                    onClick={() => setQty(item.slug, item.qty - 1)}
                    className="grid h-8 w-8 place-items-center rounded-md border hover:bg-muted"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button
                    aria-label="Increase"
                    onClick={() => setQty(item.slug, item.qty + 1)}
                    className="grid h-8 w-8 place-items-center rounded-md border hover:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  aria-label="Remove"
                  onClick={() => remove(item.slug)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">
              Ready for a quote?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Send us this list with your details and we&apos;ll come back with
              pricing, minimum order quantities and timelines.
            </p>
            <Button asChild size="lg" className="mt-5 w-full">
              <Link href="/quote">Request a quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
