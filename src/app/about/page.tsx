import type { Metadata } from "next";
import { Leaf, Recycle, MapPin, Factory } from "lucide-react";
import { SectionHeading, CtaBand } from "@/components/sections";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — The Green Dream",
  description:
    "Boxit is Pakistan's first plantable seed-paper maker. We turn tree-free paper into custom biodegradable packaging, corporate gifts and event giveaways from Lahore.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Recycle,
    title: "Tree-free by default",
    text: "Our seed paper is made from post-consumer and post-industrial paper collected from local offices and schools. No new trees.",
  },
  {
    icon: Factory,
    title: "We make our own stock",
    text: "We produce our own paper stock and convert it — with a partner network — into bags, tags, cards, calendars and more.",
  },
  {
    icon: Leaf,
    title: "Built for customization",
    text: "No fixed catalogue mindset. We're flexible on material, print, embossing and finishing to match your brief.",
  },
  {
    icon: MapPin,
    title: "Made in Lahore",
    text: "We operate from Lahore and deliver across Pakistan, with seed paper tested for local climate conditions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow">
            <Leaf className="h-4 w-4" /> The Green Dream
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-5xl">
            We turn paper that would be thrown away into packaging that grows.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {site.name} is Pakistan&apos;s first plantable seed-paper maker. We
            started with a simple idea: packaging shouldn&apos;t end as waste. By
            embedding seeds into tree-free paper, we let brands turn bags, tags,
            cards and gifts into something people plant — not bin.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we stand for"
            title="A packaging partner, not just a paper seller"
            subtitle="Most green-packaging companies sell material. We help brands move from ordinary packaging to a custom biodegradable experience — from material selection to a finished, branded product."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-lg font-bold">
                  {v.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's make your packaging mean something"
        subtitle="Tell us what you're building. We'll suggest sustainable directions and get you a sample kit."
      />
    </>
  );
}
