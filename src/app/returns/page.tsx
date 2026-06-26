import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Boxit's returns and refunds policy for plantable packaging.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <LegalLayout title="Returns & Refunds" updated="June 2026">
      <p>
        Because most of our work is custom-printed and made to order, our policy
        balances fairness with the realities of bespoke production.
      </p>
      <h2>Custom & bulk orders</h2>
      <ul>
        <li>We don&apos;t start bulk production until you approve a sample.</li>
        <li>A revision round is included before production.</li>
        <li>
          Custom-printed items can&apos;t be returned for change of mind, but we
          will remake or refund items that arrive defective or not as approved.
        </li>
      </ul>
      <h2>Ready-made items</h2>
      <ul>
        <li>
          Unused ready-made items can be returned within 7 days of delivery in
          original condition.
        </li>
        <li>Refunds are issued once the returned item is received.</li>
      </ul>
      <h2>Damaged in transit</h2>
      <p>
        If an order arrives damaged, contact us within 48 hours with photos and
        your order ID and we&apos;ll make it right.
      </p>
    </LegalLayout>
  );
}
