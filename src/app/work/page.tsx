import type { Metadata } from "next";
import { CtaBand } from "@/components/sections";
import { CaseStudyCard } from "@/components/case-study-card";
import { getCaseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Work — Plantable Packaging Case Studies",
  description:
    "How Pakistani brands, FMCGs and event companies used Boxit's plantable packaging, corporate gifts and invitations to stand out.",
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
            Packaging that became the story
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Real campaigns where plantable packaging did more than hold a product
            — it got photographed, planted and remembered.
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

      <CtaBand title="Want results like these?" />
    </>
  );
}
