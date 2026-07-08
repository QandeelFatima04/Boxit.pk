import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { EstimatorButton } from "@/components/estimator-button";
import { FadeIn } from "@/components/ui/animate";
import type { SegmentPage } from "@/content/types";

export function SegmentHero({ segment: s }: { segment: SegmentPage }) {
  const facts = [
    { label: "Pricing", value: s.startingFrom },
    { label: "MOQ", value: s.moq },
    { label: "Lead time", value: s.leadTime },
  ];

  return (
    <section className="bg-gradient-to-b from-secondary/60 to-background">
      <div className="container-page pt-5 pb-12 sm:pt-6 sm:pb-16 lg:pb-20">
        {/* Breadcrumb */}
        <nav className="mb-5 text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-brand">
            Home
          </Link>{" "}
          / <span className="text-foreground">{s.label}</span>
        </nav>

        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Image — left. Tile matches the text height; full image shown (no crop).
              A blurred copy fills the tile so there are no empty bands. */}
          <FadeIn className="lg:h-full">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border bg-card shadow-sm lg:aspect-auto lg:h-full lg:min-h-[420px]">
              <Image
                src={s.heroImage}
                alt=""
                aria-hidden
                fill
                className="scale-110 object-cover blur-2xl"
              />
              <Image
                src={s.heroImage}
                alt={s.heroImageAlt}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>

          {/* Text — right */}
          <FadeIn delay={0.12}>
            <p className="eyebrow">{s.audience}</p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {s.heroHeadline}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {s.heroSub}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm">
              {facts.map((f) => (
                <li key={f.label} className="flex items-center gap-2.5">
                  <Sprout className="h-4 w-4 shrink-0 text-brand" />
                  <span>
                    <span className="font-semibold text-foreground">
                      {f.label}:
                    </span>{" "}
                    {f.value}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton
                source={`segment-${s.slug}`}
                label={s.cta.label}
                text={s.cta.whatsappText}
              />
              <EstimatorButton />
              <Button asChild size="lg" variant="outline">
                <Link href="/sample-kit">
                  Order a sample kit <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
