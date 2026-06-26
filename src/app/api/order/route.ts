import { NextResponse } from "next/server";
import { getProduct } from "@/lib/content";
import { computeShipping } from "@/lib/commerce";
import {
  getPaymentInstruction,
  type PaymentMethod,
  type PaymentInstruction,
} from "@/lib/payments";

type IncomingItem = { slug: string; qty: number };

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
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
  }
  if (!body.customer?.name || !body.customer?.phone) {
    return NextResponse.json(
      { ok: false, error: "Name and phone are required" },
      { status: 400 },
    );
  }
  if (!body.address?.line1 || !body.address?.city) {
    return NextResponse.json(
      { ok: false, error: "Delivery address is required" },
      { status: 400 },
    );
  }

  // Recompute totals server-side from the catalogue (never trust client prices).
  let subtotal = 0;
  const resolved: { slug: string; name: string; qty: number; price: number }[] = [];
  for (const it of body.items) {
    const p = getProduct(it.slug);
    if (!p || !p.purchasable || !p.price) {
      return NextResponse.json(
        { ok: false, error: `Item not purchasable: ${it.slug}` },
        { status: 400 },
      );
    }
    const qty = Math.max(1, Math.floor(it.qty));
    subtotal += p.price * qty;
    resolved.push({ slug: p.slug, name: p.name, qty, price: p.price });
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
