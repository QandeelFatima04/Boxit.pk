import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of the Boxit website and orders.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 2026">
      <p>
        These terms govern your use of our website and any orders you place with
        us.
      </p>
      <h2>Quotes & pricing</h2>
      <ul>
        <li>
          Custom work is priced per project. Quotes are valid for the period
          stated and depend on final specifications.
        </li>
        <li>Ready-made item prices are shown on the product page.</li>
      </ul>
      <h2>Orders & approval</h2>
      <ul>
        <li>Bulk production proceeds only after you approve a sample.</li>
        <li>
          Seed-paper germination depends on handling, soil, water and climate;
          we don&apos;t guarantee germination rates.
        </li>
      </ul>
      <h2>Payments</h2>
      <p>
        We accept Cash on Delivery, bank transfer, and JazzCash/Easypaisa. For
        manual methods, please share your receipt so we can confirm your order.
      </p>
      <h2>Liability</h2>
      <p>
        Our liability for any order is limited to the value of that order.
      </p>
    </LegalLayout>
  );
}
