import type { Metadata } from "next";
import { Calculator } from "lucide-react";
import { Estimator } from "@/components/forms/estimator";
import { Guarantees } from "@/components/sections";

export const metadata: Metadata = {
  title: "Instant Cost Estimator — Custom Plantable Packaging",
  description:
    "Get an instant ballpark price for custom plantable seed paper products — cards, tags, calendars, bags and more. Pick your format, quantity and finishing, then request an exact quote.",
  keywords: [
    "plantable packaging cost estimator",
    "seed paper price calculator Pakistan",
    "custom packaging quote Pakistan",
  ],
  alternates: { canonical: "/estimator" },
};

export default function EstimatorPage() {
  return (
    <section className="section">
      <div className="container-page max-w-5xl">
        <p className="eyebrow">
          <Calculator className="h-4 w-4" /> Instant estimator
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
          Estimate your packaging cost in seconds
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Choose a format, quantity and finishing to see a live ballpark. It&apos;s
          an indicative range — because every project is custom — so use it to plan
          your budget, then get an exact quote from our team.
        </p>

        <div className="mt-10">
          <Estimator />
        </div>

        <div className="mt-14 max-w-3xl">
          <Guarantees />
        </div>
      </div>
    </section>
  );
}
