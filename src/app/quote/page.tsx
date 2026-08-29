import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MessageCircle, Sprout } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagingQuiz } from "@/components/forms/packaging-quiz";
import { RfqForm } from "@/components/forms/rfq-form";
import { getProduct } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request a Quote — Custom Plantable Packaging",
  description:
    "Send us your brief and get back material options, MOQ, timeline and pricing. Answer a few guided questions or fill the short form directly.",
  alternates: { canonical: "/quote" },
};

const BUYER_TYPE_BY_PARAM: Record<string, string> = {
  reseller: "reseller-wholesale",
  wholesale: "reseller-wholesale",
  csr: "csr-corporate",
  brand: "brand-tags-inserts",
  events: "events-weddings",
  stock: "paper-stock",
};

const REASSURANCE = [
  { icon: Clock, text: "We usually reply the same working day." },
  { icon: Sprout, text: "You get material options, MOQ, timeline and pricing." },
  { icon: MessageCircle, text: "Prefer chat? Finish the brief on WhatsApp." },
];

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; type?: string }>;
}) {
  const { product, type } = await searchParams;
  const productName = product ? getProduct(product)?.name : undefined;
  const defaultBuyerType = type ? BUYER_TYPE_BY_PARAM[type] : undefined;

  return (
    <section className="py-6 sm:py-10 lg:py-12">
      <div className="container-page max-w-6xl">
        {/* The form has to be reachable without scrolling, so nothing but the
            headline is allowed above it. On phones the supporting copy follows
            the form (DOM order); from lg up it moves into a left column beside
            the form, which keeps the first question in the fold even on a
            short 1440x630-ish laptop viewport. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-12 lg:gap-y-6">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="eyebrow">Request a quote</p>
            <h1 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl lg:text-4xl">
              Tell us your brief, get options back
            </h1>
          </div>

          <Tabs
            defaultValue={defaultBuyerType || productName ? "form" : "quiz"}
            className="lg:col-start-2 lg:row-start-1 lg:row-span-2"
          >
            <TabsList className="h-10 w-full max-w-md">
              <TabsTrigger value="quiz">Guided questions</TabsTrigger>
              <TabsTrigger value="form">Short form</TabsTrigger>
            </TabsList>

            <TabsContent value="quiz" className="mt-4">
              <PackagingQuiz />
            </TabsContent>

            <TabsContent value="form" className="mt-4">
              <div className="rounded-2xl border bg-card p-6 sm:p-8">
                {productName && (
                  <p className="mb-4 rounded-lg bg-secondary px-4 py-2 text-sm">
                    Quoting for: <strong>{productName}</strong>
                  </p>
                )}
                <RfqForm
                  defaultProduct={productName}
                  defaultBuyerType={defaultBuyerType}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="lg:col-start-1 lg:row-start-2">
            <p className="text-sm text-muted-foreground sm:text-base">
              Every project is custom, so we quote rather than publish fixed
              prices. Answer a few questions and we&apos;ll come back with
              materials, MOQ, timeline and pricing.{" "}
              <Link
                href="/estimator"
                className="font-semibold text-brand underline underline-offset-4"
              >
                Try the cost estimator
              </Link>{" "}
              for a ballpark first.
            </p>

            <ul className="mt-6 space-y-3">
              {REASSURANCE.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex gap-3 text-sm text-muted-foreground"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
