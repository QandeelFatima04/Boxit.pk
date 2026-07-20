import Link from "next/link";
import { Calculator, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getPricingTiers, guarantees } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="fluid-h2 mt-3 font-[family-name:var(--font-heading)] font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function TransparencyBlock({
  startingFrom,
  moq,
  leadTime,
}: {
  startingFrom: string;
  moq: string;
  leadTime: string;
}) {
  const items = [
    { label: "Pricing", value: startingFrom },
    { label: "MOQ", value: moq },
    { label: "Delivery", value: leadTime },
  ];
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="bg-card p-5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {it.label}
          </dt>
          <dd className="mt-1 text-lg font-bold text-foreground">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PricingTiers() {
  const tiers = getPricingTiers();
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "flex flex-col rounded-2xl border bg-card p-6",
            // Highlighted tier "pops" out slightly larger + raised on desktop.
            // Scale only at lg (side-by-side); the ~1.05 growth stays within the
            // gap-6 gutter so it never overlaps neighbours, and mobile is untouched.
            // `pricing-featured` (globals.css) handles the desktop-only ~1.05
            // "pop" + raise via an explicit media query — Tailwind v4's responsive
            // `scale` utilities don't gate reliably against a base value.
            tier.highlight &&
              "pricing-featured relative border-brand ring-2 ring-brand/20 shadow-xl",
          )}
        >
          {tier.highlight && (
            <span className="mb-3 inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Most popular
            </span>
          )}
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
            {tier.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{tier.bestFor}</p>
          <p className="mt-4 text-sm font-semibold text-brand">
            {tier.priceHint}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{tier.positioning}</p>
          <ul className="mt-5 flex-1 space-y-2.5">
            {tier.includes.map((inc) => (
              <li key={inc} className="flex gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
          <Button
            asChild
            className="mt-6 w-full"
            variant={tier.highlight ? "default" : "outline"}
          >
            <Link href={tier.cta.href}>{tier.cta.label}</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

export function Guarantees() {
  return (
    <div className="rounded-2xl border bg-secondary/40 p-6 sm:p-8">
      <div className="flex items-center gap-2 text-brand">
        <ShieldCheck className="h-5 w-5" />
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">
          What we commit to
        </h3>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {guarantees.map((g) => (
          <li key={g} className="flex gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{g}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CtaBand({
  title = "Tell us what you need",
  subtitle = "Send us the product and rough quantity on WhatsApp and we'll come back with pricing. Or start with a sample kit.",
  whatsappText,
}: {
  title?: string;
  subtitle?: string;
  whatsappText?: string;
}) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <div className="relative mx-auto max-w-2xl">
            <h2 className="fluid-h2 font-[family-name:var(--font-heading)] font-bold">
              {title}
            </h2>
            <p className="mt-4 text-primary-foreground/80">{subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppButton source="cta-band" text={whatsappText} />
              <Button asChild size="lg" variant="gold">
                <Link href="/sample-kit">Order a sample kit</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="/estimator">
                  <Calculator className="h-4 w-4" /> Estimate cost
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
