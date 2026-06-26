import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: "How Boxit ships plantable packaging and gifts across Pakistan.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <LegalLayout title="Shipping & Delivery" updated="June 2026">
      <p>
        We deliver across Pakistan. The details below are general guidance —
        confirm exact timelines for your order on WhatsApp or your quote.
      </p>
      <h2>Production & dispatch</h2>
      <ul>
        <li>Ready-made items typically ship in 2–3 working days.</li>
        <li>
          Custom and bulk orders are produced after design approval; timelines
          are shared in your quote (usually 5–15 working days).
        </li>
        <li>Urgent orders may be accommodated depending on quantity.</li>
      </ul>
      <h2>Shipping charges</h2>
      <ul>
        <li>A flat shipping fee applies to small ready-made orders.</li>
        <li>Free shipping over PKR 5,000.</li>
        <li>Bulk order delivery is quoted per project.</li>
      </ul>
      <h2>Questions?</h2>
      <p>
        Message us on WhatsApp or email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalLayout>
  );
}
