import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagingQuiz } from "@/components/forms/packaging-quiz";
import { RfqForm } from "@/components/forms/rfq-form";
import { getProduct } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request a Quote — Custom Plantable Packaging",
  description:
    "Get a custom quote for plantable packaging, corporate gifts or event giveaways. Take the 60-second packaging-fit quiz or fill the quick form.",
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

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; type?: string }>;
}) {
  const { product, type } = await searchParams;
  const productName = product ? getProduct(product)?.name : undefined;
  const defaultBuyerType = type ? BUYER_TYPE_BY_PARAM[type] : undefined;

  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Request a quote</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
          Tell us your brief — get options back
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          We don&apos;t sell fixed prices because every project is custom. Answer
          a few questions and we&apos;ll come back with material recommendations,
          MOQ, timeline and pricing.
        </p>

        <Tabs
          defaultValue={defaultBuyerType || productName ? "form" : "quiz"}
          className="mt-10"
        >
          <TabsList className="h-10 w-full max-w-md">
            <TabsTrigger value="quiz">Packaging-fit quiz</TabsTrigger>
            <TabsTrigger value="form">Quick form</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="mt-6">
            <PackagingQuiz />
          </TabsContent>

          <TabsContent value="form" className="mt-6">
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
      </div>
    </section>
  );
}
