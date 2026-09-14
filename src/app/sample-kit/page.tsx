import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Sprout } from "lucide-react";
import { AddToQuoteButton } from "@/components/add-to-quote-button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Guarantees } from "@/components/sections";
import { ProductJsonLd } from "@/components/json-ld";
import { getProduct } from "@/lib/content";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqs } from "@/content/faqs";

const kit = getProduct("sample-kit");

// The questions a sample-kit buyer actually asks before ordering, pulled from
// the site's real FAQ list (samples/refund, delivery, MOQ, pricing, location).
const kitFaqQuestions = [
  "Can I see samples?",
  "How fast can you deliver?",
  "What is the MOQ?",
  "What is the price range?",
  "Where is your office located?",
];
const kitFaqs = kitFaqQuestions
  .map((q) => faqs.find((f) => f.question === q))
  .filter((f): f is (typeof faqs)[number] => Boolean(f));

export const metadata: Metadata = {
  title: kit?.seo?.seoTitle ?? "Sample Kit",
  description: kit?.seo?.metaDescription ?? kit?.description,
  keywords: kit?.seo?.keywords,
  alternates: { canonical: "/sample-kit" },
};

export default function SampleKitPage() {
  if (!kit) notFound();

  return (
    <>
      <ProductJsonLd
        name={kit.name}
        description={kit.description}
        slug={kit.slug}
      />

      <section className="bg-gradient-to-b from-secondary/60 to-background">
        {/* Text and photo share one screen on a ~670px-tall laptop: the
            column is tightened and the photo is height-capped, so nobody has
            to scroll to read what the kit is. */}
        <div className="container-page grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="eyebrow">
              <Sprout className="h-4 w-4" /> Start here
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              The Green Packaging Sample Kit
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {kit.description}
            </p>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-bold sm:text-3xl">
                Price on request
              </span>
              <span className="text-sm font-medium text-brand">
                Credited in full against your first bulk order
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <AddToQuoteButton
                size="lg"
                label="Request the kit"
                item={{
                  slug: kit.slug,
                  name: kit.name,
                  image: kit.image,
                }}
              />
              <WhatsAppButton
                source="sample-kit"
                label="Ask about the kit"
                text="Hi Boxit, I'd like to know more about the Green Packaging Sample Kit. What's included and how soon can it ship?"
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {kit.leadTime ? `${kit.leadTime} · ` : ""}Ships nationwide across
              Pakistan.
            </p>
          </div>

          {kit.image && (
            // The kit itself — the page asked people to request it without
            // ever showing them what lands on their desk.
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-secondary/30 lg:aspect-auto lg:h-[min(62svh,28rem)]">
              <Image
                src={kit.image}
                alt="The Boxit plantable sample kit: seed-paper swatches, printed cards, tags and calendar samples"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl space-y-8">
          <div className="rounded-3xl border bg-card p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">
              What&apos;s inside
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {kit.features?.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
              Why start with a kit?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Custom packaging has a lot of unknowns: which material, what
              thickness, whether seed paper suits your format, whether embossing
              is possible, and how premium the final product can look. The kit
              puts all of that in your hands before you commit to a bulk run.
            </p>
          </div>
          <Guarantees />

          {kitFaqs.length > 0 && (
            <div className="pt-4">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                Sample kit FAQs
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Still deciding? Here&apos;s what buyers ask most before ordering a
                kit.
              </p>
              <div className="mt-5">
                <FaqAccordion items={kitFaqs} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
