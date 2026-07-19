import type { Metadata } from "next";
import { CtaBand } from "@/components/sections";
import { CaseStudyCard } from "@/components/case-study-card";
import { getCaseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Work — Plantable Packaging Case Studies",
  description:
    "Case studies from Boxit's press: seed-paper cards, carrier bags, wedding favors and CSR giveaways produced for brands across Pakistan.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const caseStudies = getCaseStudies();
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">Our work</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
            Projects we've run start to finish
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            A selection of real briefs: the format the client needed, the stock
            we chose, and how the finished piece was printed.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs} />
          ))}
        </div>
      </section>

      <CtaBand title="Have a similar project in mind?" />
    </>
  );
}
