import { NextResponse } from "next/server";
import { getProduct, getVariant, resolveUnitPrice } from "@/lib/content";
import { computeShipping } from "@/lib/commerce";
import {
  getPaymentInstruction,
  type PaymentMethod,
  type PaymentInstruction,
} from "@/lib/payments";

type IncomingItem = { slug: string; qty: number; variant?: string };

export type OrderRequest = {
  items: IncomingItem[];
  customer: { name: string; email?: string; phone: string };
  address: { line1: string; city: string; notes?: string };
  method: PaymentMethod;
  attribution?: Record<string, string>;
};

export type OrderResponse = {
  ok: boolean;
  error?: string;
  orderId?: string;
  subtotal?: number;
  shipping?: number;
  total?: number;
  payment?: PaymentInstruction;
};

function makeOrderId() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `BX-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

export async function POST(request: Request): Promise<NextResponse<OrderResponse>> {
  let body: OrderRequest;
  try {
    body = (await request.json()) as OrderRequest;
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't read that request. Please try again, or send your order on WhatsApp." },
      { status: 400 },
    );
  }

  if (!body.items?.length) {
    return NextResponse.json(
      { ok: false, error: "Your quote list is empty. Add a product before placing the order." },
      { status: 400 },
    );
  }
  if (!body.customer?.name || !body.customer?.phone) {
    return NextResponse.json(
      { ok: false, error: "Please add your name and a phone number so we can confirm the order." },
      { status: 400 },
    );
  }
  if (!body.address?.line1 || !body.address?.city) {
    return NextResponse.json(
      { ok: false, error: "Please add a delivery address, including the city." },
      { status: 400 },
    );
  }

  // Recompute totals server-side from the catalogue (never trust client prices).
  let subtotal = 0;
  const resolved: {
    slug: string;
    name: string;
    qty: number;
    price: number;
    variant?: string;
    variantLabel?: string;
  }[] = [];
  for (const it of body.items) {
    const p = getProduct(it.slug);
    if (!p) {
      return NextResponse.json(
        { ok: false, error: `We couldn't find "${it.slug}" in our catalogue.` },
        { status: 400 },
      );
    }

    // Sized products must name a size we actually sell.
    if (p.variants?.length && !getVariant(p, it.variant)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Please choose a size for "${p.name}" before checking out.`,
        },
        { status: 400 },
      );
    }

    const pricing = resolveUnitPrice(p, it.variant);
    if (!pricing) {
      return NextResponse.json(
        {
          ok: false,
          error: `"${p.name}" is made to order, so it can't be checked out directly. Request a quote for it instead.`,
        },
        { status: 400 },
      );
    }

    const qty = Math.floor(it.qty);
    if (!Number.isFinite(qty) || qty < pricing.minQty) {
      return NextResponse.json(
        {
          ok: false,
          error: `"${p.name}" has a minimum order of ${pricing.minQty.toLocaleString("en-PK")} ${p.unitNoun ?? "units"}.`,
        },
        { status: 400 },
      );
    }

    const variant = getVariant(p, it.variant);
    subtotal += pricing.price * qty;
    resolved.push({
      slug: p.slug,
      name: p.name,
      qty,
      price: pricing.price,
      variant: variant?.key,
      variantLabel: variant?.label,
    });
  }

  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;
  const orderId = makeOrderId();
  const payment = getPaymentInstruction(body.method, orderId, total);

  // TODO: persist order to Supabase/Postgres + email confirmation (Resend).
  console.log(
    "[order]",
    JSON.stringify({ orderId, resolved, subtotal, shipping, total, method: body.method, customer: body.customer, address: body.address, attribution: body.attribution }),
  );

  return NextResponse.json({
    ok: true,
    orderId,
    subtotal,
    shipping,
    total,
    payment,
  });
}
