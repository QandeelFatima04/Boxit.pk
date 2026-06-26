import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Boxit collects and uses your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 2026">
      <p>
        This policy explains what we collect and why. By using {site.url} you
        agree to it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          Details you give us in forms — name, email, phone, company and your
          message or order details.
        </li>
        <li>
          Basic analytics (e.g. pages viewed) and marketing attribution
          (UTM/campaign parameters) to understand which channels work.
        </li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To respond to enquiries, prepare quotes and fulfil orders.</li>
        <li>To improve our website and marketing.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We don&apos;t sell your data. We use trusted processors (e.g. analytics
        and email providers) only to run the site and contact you.
      </p>
      <h2>Contact</h2>
      <p>
        For any privacy request, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalLayout>
  );
}
