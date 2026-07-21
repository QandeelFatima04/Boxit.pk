"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/submit-lead";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { useCart } from "@/components/cart/cart-context";

export function RfqForm({
  defaultProduct,
  defaultBuyerType,
}: {
  defaultProduct?: string;
  defaultBuyerType?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { items, clear } = useCart();

  // Items the visitor added, e.g. "Plantable Calendars ×2",
  // or with a chosen size: "Seed Paper Sheets (9\" × 12\") ×300"
  const quoteListSummary = items
    .map((i) => {
      const size = i.variantLabel ? ` (${i.variantLabel})` : "";
      return `${i.name}${size}${i.qty > 1 ? ` ×${i.qty}` : ""}`;
    })
    .join(", ");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const artworkFile = fd.get("artwork");
    const artworkName =
      artworkFile instanceof File && artworkFile.size > 0 ? artworkFile.name : "";
    const typedProduct = String(fd.get("product") || "");
    const product =
      [typedProduct, quoteListSummary].filter(Boolean).join(" | ") || "";
    const res = await submitLead({
      type: "quote",
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      businessType: String(fd.get("buyerType") || fd.get("businessType") || ""),
      product,
      quantity: String(fd.get("quantityRange") || fd.get("quantity") || ""),
      timeline: String(fd.get("timeline") || ""),
      message: String(fd.get("message") || ""),
      answers: {
        customPrinting: fd.get("customPrinting") === "yes" ? "Yes" : "No",
        productFormat: String(fd.get("productFormat") || ""),
        city: String(fd.get("city") || ""),
        ...(quoteListSummary ? { quoteList: quoteListSummary } : {}),
        ...(artworkName ? { artwork: artworkName } : {}),
      },
    });
    setLoading(false);
    if (res.ok) {
      clear();
      setDone(true);
      toast.success("Quote request sent. We'll reply with options.");
    } else {
      toast.error(
        res.error ?? "We couldn't send that. Please try again, or send your brief on WhatsApp.",
      );
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-secondary/40 p-8 text-center">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
          Request received
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We will come back with pricing and sample options, usually within a
          working day. WhatsApp is faster if your deadline is tight.
        </p>
        <div className="mt-5 flex justify-center">
          <WhatsAppButton source="rfq-success" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {items.length > 0 && (
        <div className="rounded-lg border border-brand/30 bg-secondary/40 p-4">
          <p className="text-sm font-semibold">Items in your quote list</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {items.map((i) => (
              <li key={i.id}>
                {i.name}
                {i.variantLabel ? ` (${i.variantLabel})` : ""}
                {i.qty > 1 ? ` × ${i.qty}` : ""}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            We will quote these along with anything you add below.
          </p>
        </div>
      )}

      {/* Buyer type selector */}
      <div className="space-y-1.5">
        <Label htmlFor="r-buyer-type">What are you buying for?</Label>
        <select
          id="r-buyer-type"
          name="buyerType"
          required
          defaultValue={defaultBuyerType ?? ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="" disabled>Choose one…</option>
          <option value="csr-corporate">CSR / Corporate Campaign</option>
          <option value="brand-tags-inserts">Brand Tags &amp; Inserts</option>
          <option value="events-weddings">Events / Weddings</option>
          <option value="paper-stock">Seed Paper Stock (for own printing)</option>
          <option value="reseller-wholesale">Reseller / Wholesale (resale)</option>
          <option value="other">Other / Not sure yet</option>
        </select>
      </div>

      {/* Quantity range */}
      <div className="space-y-1.5">
        <Label htmlFor="r-qty-range">Approximate quantity</Label>
        <select
          id="r-qty-range"
          name="quantityRange"
          defaultValue=""
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="" disabled>Choose a range…</option>
          <option value="300-500">300–500 units</option>
          <option value="500-2000">500–2,000 units</option>
          <option value="2000-plus">2,000+ units</option>
          <option value="not-sure">Not sure yet</option>
        </select>
      </div>

      {/* Product format */}
      <div className="space-y-1.5">
        <Label htmlFor="r-product-format">What product format do you need?</Label>
        <select
          id="r-product-format"
          name="productFormat"
          defaultValue=""
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="" disabled>Choose a format…</option>
          <option value="cards">Cards</option>
          <option value="tags">Tags</option>
          <option value="inserts">Inserts / sleeves</option>
          <option value="sheets">Paper sheets</option>
          <option value="seed-balls">Seed balls</option>
          <option value="invitations">Invitations</option>
          <option value="calendars">Calendars</option>
          <option value="diaries">Diaries / notebooks</option>
          <option value="gift-boxes">Gift boxes / kits</option>
          <option value="not-sure">Not sure yet</option>
        </select>
      </div>

      {/* Custom printing checkbox */}
      <div className="flex items-center gap-3">
        <input
          id="r-custom-print"
          name="customPrinting"
          type="checkbox"
          value="yes"
          className="h-4 w-4 rounded border-input accent-[oklch(var(--brand))]"
        />
        <Label htmlFor="r-custom-print" className="cursor-pointer font-normal">
          I need custom printing / logo on the product
        </Label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="r-name">Name</Label>
          <Input id="r-name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-company">Company</Label>
          <Input id="r-company" name="company" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-email">Email</Label>
          <Input id="r-email" name="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-phone">Phone / WhatsApp</Label>
          <Input id="r-phone" name="phone" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-business">Business type</Label>
          <Input
            id="r-business"
            name="businessType"
            placeholder="Fashion, cosmetics, corporate…"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-product">Product needed</Label>
          <Input
            id="r-product"
            name="product"
            defaultValue={defaultProduct}
            placeholder="Shopping bags, tags, calendars…"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-qty">Quantity</Label>
          <Input id="r-qty" name="quantity" placeholder="e.g. 1,000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-timeline">Timeline</Label>
          <Input id="r-timeline" name="timeline" placeholder="e.g. 3 weeks" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="r-city">City</Label>
          <Input id="r-city" name="city" placeholder="Where should we deliver?" />
        </div>
      </div>

      {/* Artwork / reference upload */}
      <div className="space-y-1.5">
        <Label htmlFor="r-artwork">Artwork or reference (optional)</Label>
        <Input
          id="r-artwork"
          name="artwork"
          type="file"
          accept="image/*,.pdf,.ai,.eps"
          className="cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Anything works: logo, sketch, or a photo of something similar. Send
          large files to us on WhatsApp instead.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="r-message">Tell us about the job</Label>
        <Textarea
          id="r-message"
          name="message"
          rows={3}
          placeholder="Printing, embossing, brand colors, deadline…"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Add an email or phone number so we can send your quote.
      </p>
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Sending…" : "Request my quote"}
      </Button>
    </form>
  );
}
