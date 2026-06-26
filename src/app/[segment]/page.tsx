import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductCard } from "@/components/product-card";
import {
  SectionHeading,
  TransparencyBlock,
  PricingTiers,
  Guarantees,
  CtaBand,
} from "@/components/sections";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { getAllSegments, getSegment, getProductsBySlugs } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSegments().map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment } = await params;
  const s = getSegment(segment as never);
  if (!s) return {};
  return {
    title: s.seo?.seoTitle ?? s.heroHeadline,
    description: s.seo?.metaDescription ?? s.heroSub,
    keywords: s.seo?.keywords,
    alternates: { canonical: `/${s.slug}` },
    openGraph: {
      title: s.seo?.seoTitle ?? s.heroHeadline,
      description: s.seo?.metaDescription ?? s.heroSub,
      url: `/${s.slug}`,
    },
  };
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment } = await params;
  const s = getSegment(segment as never);
  if (!s) notFound();

  const products = getProductsBySlugs(s.productSlugs);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: s.label, url: `/${s.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-20">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>{" "}
            / <span className="text-foreground">{s.label}</span>
          </nav>
          <p className="eyebrow">{s.audience}</p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {s.heroHeadline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {s.heroSub}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              source={`segment-${s.slug}`}
              label={s.cta.label}
              text={s.cta.whatsappText}
            />
            <Button asChild size="lg" variant="outline">
              <Link href="/sample-kit">Order a sample kit</Link>
            </Button>
          </div>
          <div className="mt-10 max-w-2xl">
            <TransparencyBlock
              startingFrom={s.startingFrom}
              moq={s.moq}
              leadTime={s.leadTime}
            />
          </div>
        </div>
      </section>

      {/* Pains + offer */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
              Sound familiar?
            </h2>
            <ul className="mt-5 space-y-3">
              {s.pains.map((p) => (
                <li key={p} className="flex gap-2 text-sm">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand/30 bg-secondary/40 p-7">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              How Boxit helps
            </p>
            <p className="mt-3 text-lg font-medium leading-relaxed">{s.offer}</p>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-card p-4 text-sm">
              <Check className="h-5 w-5 shrink-0 text-brand" />
              <span className="font-medium">{s.hook}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we make"
            title={`Popular for ${s.label.toLowerCase()}`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/products">
                See all products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing + guarantees */}
      <section className="section">
        <div className="container-page space-y-12">
          <SectionHeading
            eyebrow="How we work"
            title="Three ways to start"
            align="center"
          />
          <PricingTiers />
          <Guarantees />
        </div>
      </section>

      <CtaBand whatsappText={s.cta.whatsappText} />
    </>
  );
}
