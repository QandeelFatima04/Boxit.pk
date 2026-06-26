import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { CtaBand } from "@/components/sections";
import { getCaseStudies, getCaseStudy } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.client} — ${cs.product}`,
    description: cs.result,
    alternates: { canonical: `/work/${cs.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const facts = [
    { label: "Client", value: cs.client },
    { label: "Type", value: cs.clientType },
    { label: "Product", value: cs.product },
    { label: "Quantity", value: cs.quantity },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Our Work", url: "/work" },
          { name: cs.client, url: `/work/${cs.slug}` },
        ]}
      />

      <article className="container-page py-16 sm:py-20">
        <Link
          href="/work"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> All work
        </Link>

        <p className="eyebrow mt-6">{cs.clientType}</p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-5xl">
          {cs.purpose}
        </h1>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="bg-card p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {f.label}
              </dt>
              <dd className="mt-1 font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>{cs.result}</p>
        </div>

        {cs.quote && (
          <blockquote className="mt-10 max-w-2xl rounded-2xl border-l-4 border-brand bg-secondary/40 p-6 text-xl font-medium italic">
            “{cs.quote.text}”
            <footer className="mt-3 text-sm font-normal not-italic text-muted-foreground">
              — {cs.quote.author}, {cs.client}
            </footer>
          </blockquote>
        )}

        <div className="mt-10">
          <WhatsAppButton
            source={`case-study-${cs.slug}`}
            label="Start a project like this"
          />
        </div>
      </article>

      <CtaBand />
    </>
  );
}
