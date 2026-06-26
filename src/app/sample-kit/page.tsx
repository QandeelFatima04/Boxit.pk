import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Sprout } from "lucide-react";
import { AddToQuoteButton } from "@/components/add-to-cart-button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPKR } from "@/lib/format";
import { Guarantees } from "@/components/sections";
import { ProductJsonLd } from "@/components/json-ld";
import { getProduct } from "@/lib/content";

const kit = getProduct("sample-kit");

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
              <Sprout className="h-4 w-4" /> The smartest first step
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
                Adjusted against your bulk order
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToQuoteButton
                size="lg"
                item={{ slug: kit.slug, name: kit.name }}
                label="Add sample kit to quote"
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
              turns those unknowns into something you can hold — before you spend
              on a bulk run.
            </p>
          </div>
          <Guarantees />
        </div>
      </section>
    </>
  );
}
