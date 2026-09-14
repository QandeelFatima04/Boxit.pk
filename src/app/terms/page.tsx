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
        <li>
          Ready-made items are quoted too — tell us the quantity you need and we
          will send current pricing.
        </li>
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
        Nothing is sold or paid for on this website. Every order starts with a
        quote; once you approve it, we agree payment terms with you directly and
        invoice you for the order.
      </p>
      <h2>Liability</h2>
      <p>
        Our liability for any order is limited to the value of that order.
      </p>
    </LegalLayout>
  );
}
