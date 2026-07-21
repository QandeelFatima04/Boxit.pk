"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart, formatPKR } from "@/components/cart/cart-context";
import { computeShipping, FREE_SHIPPING_OVER } from "@/lib/commerce";
import { paymentMethods, type PaymentMethod } from "@/lib/payments";
import { cn } from "@/lib/utils";
import type { OrderResponse } from "@/app/api/order/route";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isPriced, clear } = useCart();
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);

  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;

  // Custom/bulk lines can't be paid for online — those go through the quote flow.
  const unpriced = items.filter((i) => i.price == null);

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container-page max-w-xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <ShoppingBag className="h-7 w-7 text-brand" />
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-heading)] text-3xl font-bold">
            Your cart is empty
          </h1>
          <p className="mt-3 text-muted-foreground">
            Add the sample kit or seed paper sheets to check out, or request a
            quote for a custom run.
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isPriced) return;
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            qty: i.qty,
            variant: i.variant,
          })),
          customer: {
            name: String(fd.get("name") || ""),
            email: String(fd.get("email") || ""),
            phone: String(fd.get("phone") || ""),
          },
          address: {
            line1: String(fd.get("address") || ""),
            city: String(fd.get("city") || ""),
            notes: String(fd.get("notes") || ""),
          },
          method,
        }),
      });
      const data = (await res.json()) as OrderResponse;

      if (!res.ok || !data.ok || !data.orderId) {
        toast.error(data.error ?? "We couldn't place that order. Please try again.");
        return;
      }

      // The confirmation page reads the order back from here.
      try {
        localStorage.setItem(
          `boxit_order_${data.orderId}`,
          JSON.stringify({
            ...data,
            items,
            customer: {
              name: String(fd.get("name") || ""),
              phone: String(fd.get("phone") || ""),
            },
            method,
          }),
        );
      } catch {
        /* ignore — the confirmation page degrades gracefully without this */
      }

      clear();
      router.push(`/order/${data.orderId}`);
    } catch {
      toast.error(
        "Something went wrong placing the order. Please try again, or send it on WhatsApp.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container-page">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold">
          Checkout
        </h1>

        {unpriced.length > 0 && (
          <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
            <p className="text-sm font-medium">
              Some items are made to order and can&apos;t be paid for online:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              {unpriced.map((i) => (
                <li key={i.id}>{i.name}</li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/quote">Request a quote for these</Link>
            </Button>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-8 grid gap-10 lg:grid-cols-3">
          {/* Details */}
          <div className="space-y-8 lg:col-span-2">
            <fieldset className="rounded-2xl border bg-card p-6">
              <legend className="px-2 font-semibold">Your details</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="03XX-XXXXXXX"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" name="email" type="email" className="mt-1.5" />
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border bg-card p-6">
              <legend className="px-2 font-semibold">Delivery address</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required className="mt-1.5" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Delivery notes (optional)</Label>
                  <Textarea id="notes" name="notes" rows={3} className="mt-1.5" />
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border bg-card p-6">
              <legend className="px-2 font-semibold">Payment method</legend>
              <div className="space-y-3">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
                      method === m.id
                        ? "border-brand bg-secondary/50 ring-1 ring-brand"
                        : "hover:bg-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="mt-1 accent-[var(--brand)]"
                    />
                    <span>
                      <span className="block font-medium">{m.label}</span>
                      <span className="block text-sm text-muted-foreground">
                        {m.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-card p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">
                Order summary
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {i.name}
                      {i.variantLabel && (
                        <span className="block text-xs">{i.variantLabel}</span>
                      )}
                      <span className="block text-xs">
                        × {i.qty.toLocaleString("en-PK")} {i.unitNoun ?? ""}
                      </span>
                    </span>
                    <span className="shrink-0">
                      {i.price == null
                        ? "Quoted"
                        : formatPKR(i.price * i.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-1.5 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPKR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : formatPKR(shipping)}</dd>
                </div>
                <div className="flex justify-between pt-1 text-base font-bold">
                  <dt>Total</dt>
                  <dd>{formatPKR(total)}</dd>
                </div>
              </dl>
              {subtotal > 0 && subtotal < FREE_SHIPPING_OVER && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Spend {formatPKR(FREE_SHIPPING_OVER - subtotal)} more for free
                  delivery.
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="mt-5 w-full"
                disabled={loading || !isPriced}
              >
                {loading ? "Placing order…" : "Place order"}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                We&apos;ll confirm your order on WhatsApp before dispatch.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
