import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { Estimator } from "@/components/forms/estimator";
import { Guarantees } from "@/components/sections";

export const metadata: Metadata = {
  title: "Cost Estimator — Custom Plantable Packaging",
  description:
    "Pick a format, quantity and finishing to see a ballpark price range for seed-paper cards, tags, calendars and bags before you request a full quote.",
  keywords: [
    "plantable packaging cost estimator",
    "seed paper price calculator Pakistan",
    "custom packaging quote Pakistan",
  ],
  alternates: { canonical: "/estimator" },
};

export default function EstimatorPage() {
  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="container-page max-w-5xl">
        <p className="eyebrow">
          <Calculator className="h-4 w-4" /> Cost estimator
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl lg:text-4xl">
          Estimate your packaging cost
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Choose a format, quantity and finishing to see a ballpark range. Every
          project is custom, so treat this as a planning figure — for a firm
          price, request a quote from our team.
        </p>

        <div className="mt-4">
          <Estimator />
        </div>

        <div className="mt-14 max-w-3xl">
          <Guarantees />
        </div>
      </div>
    </section>
  );
}
