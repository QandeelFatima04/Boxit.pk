import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Sprout } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPKR } from "@/lib/format";
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
  if (!kit || !kit.price) notFound();

  return (
    <>
      <ProductJsonLd
        name={kit.name}
        description={kit.description}
        price={kit.price}
        slug={kit.slug}
      />

      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">
              <Sprout className="h-4 w-4" /> Start here
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-5xl">
              The Green Packaging Sample Kit
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              {kit.description}
            </p>

            <div className="mt-7 flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPKR(kit.price)}</span>
              <span className="text-sm font-medium text-brand">
                Credited in full against your first bulk order
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                size="lg"
                item={{
                  slug: kit.slug,
                  name: kit.name,
                  price: kit.price,
                  image: kit.image,
                }}
              />
              <WhatsAppButton
                source="sample-kit"
                label="Ask about the kit"
                text="Hi Boxit, I'd like to know more about the Green Packaging Sample Kit. What's included and how soon can it ship?"
              />
            </div>
            {kit.leadTime && (
              <p className="mt-3 text-sm text-muted-foreground">{kit.leadTime}</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Ships nationwide across Pakistan.
            </p>
          </div>

          <div className="rounded-3xl border bg-card p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold">
              What&apos;s inside
            </h2>
            <ul className="mt-5 space-y-3">
              {kit.features?.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl space-y-8">
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
