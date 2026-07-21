"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPKR } from "@/lib/format";
import type { OrderResponse } from "@/app/api/order/route";
import type { CartItem } from "@/components/cart/cart-context";

type StoredOrder = OrderResponse & {
  items: CartItem[];
  customer: { name: string; phone: string };
  method: string;
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`boxit_order_${id}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setOrder(JSON.parse(raw) as StoredOrder);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [id]);

  return (
    <section className="section">
      <div className="container-page max-w-2xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground">
          <Check className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-center font-[family-name:var(--font-heading)] text-3xl font-bold">
          Order placed 🌱
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Order ID: <span className="font-mono font-semibold">{id}</span>
        </p>

        {loaded && !order && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            We&apos;ve received your order. If you don&apos;t get a confirmation
            shortly, message us on WhatsApp with your order ID.
          </p>
        )}

        {order && (
          <div className="mt-8 space-y-6">
            {order.payment?.instructions && (
              <div className="rounded-2xl border border-brand/30 bg-secondary/40 p-6">
                <h2 className="font-semibold">Next step</h2>
                <p className="mt-2 text-sm">{order.payment.instructions}</p>
                {order.method !== "cod" && (
                  <div className="mt-4">
                    <WhatsAppButton
                      source="order-confirmation"
                      label="Send payment receipt"
                      text={`Hi Boxit, here's my payment receipt for order ${id}.`}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="rounded-2xl border bg-card p-6">
              <h2 className="font-semibold">Summary</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {order.items.map((i) => (
                  <li key={i.id ?? i.slug} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {i.name}
                      {i.variantLabel ? ` (${i.variantLabel})` : ""} ×{" "}
                      {i.qty.toLocaleString("en-PK")}
                    </span>
                    <span>{formatPKR((i.price ?? 0) * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1.5 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPKR(order.subtotal ?? 0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>
                    {order.shipping === 0
                      ? "Free"
                      : formatPKR(order.shipping ?? 0)}
                  </dd>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <dt>Total</dt>
                  <dd>{formatPKR(order.total ?? 0)}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/products">Continue shopping</Link>
          </Button>
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
