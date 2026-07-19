import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq-accordion";
import { FaqJsonLd } from "@/components/json-ld";
import { CtaBand } from "@/components/sections";
import { getFaqs, faqCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ — Plantable Seed Paper & Packaging",
  description:
    "How seed paper germinates, which seeds we use, what printing it takes, plus MOQ, durability, delivery and sample answers from the Boxit team.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqs = getFaqs();

  return (
    <>
      <FaqJsonLd items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />

      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">FAQ</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
            Everything buyers ask first
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Plantable packaging is new to most people. Here are straight
            answers. If your question isn&apos;t covered, message us on WhatsApp.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page space-y-12">
          {faqCategories.map((cat) => {
            const items = faqs.filter((f) => f.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                    {cat}
                  </h2>
                </div>
                <div className="lg:col-span-9">
                  <FaqAccordion items={items} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Still have a question?"
        subtitle="Ask us directly on WhatsApp. Most queries about seeds, printing or lead time are answered the same working day."
      />
    </>
  );
}
