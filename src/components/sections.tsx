import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
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
      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
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
            tier.highlight && "border-brand ring-2 ring-brand/20 shadow-lg",
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
          <ul className="mt-5 space-y-2.5">
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
          Low-risk by design
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
  title = "Not sure where to start?",
  subtitle = "Order a sample kit, or send us your product and quantity on WhatsApp for a 10-minute quote.",
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
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-primary-foreground/80">{subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppButton source="cta-band" text={whatsappText} />
              <Button asChild size="lg" variant="gold">
                <Link href="/sample-kit">Order a sample kit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
