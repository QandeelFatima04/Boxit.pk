import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/sections";
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
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="group flex flex-col rounded-2xl border bg-card p-7 transition hover:shadow-lg hover:shadow-black/5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                {cs.clientType}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-bold">
                {cs.client}
              </h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">
                {cs.result}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2">
                Read the story <ArrowRight className="h-4 w-4 transition-all" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand title="Want results like these?" />
    </>
  );
}
