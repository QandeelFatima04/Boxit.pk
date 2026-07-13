"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calculator,
  Leaf,
  Sprout,
  Recycle,
  Truck,
  Droplets,
  ShoppingBag,
  CalendarDays,
  Tag,
  Mail,
  Gift,
  Package,
  Pencil,
  Box,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductCard } from "@/components/product-card";
import { CaseStudyGallery } from "@/components/case-study-gallery";
import { FaqAccordion } from "@/components/faq-accordion";
import {
  SectionHeading,
  PricingTiers,
  CtaBand,
} from "@/components/sections";
import {
  FadeIn,
  StaggerIn,
  StaggerItem,
  AnimatedHeadline,
  AnimatedLine,
  PulseBadge,
  HoverCard,
} from "@/components/ui/animate";
import {
  getAllSegments,
  getFeaturedProducts,
  getFaqs,
} from "@/lib/content";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";
import { LogoMarquee } from "@/components/logo-marquee";

// Homepage category tiles — an explicit list so we can mix real category pages
// with tiles that link straight to a related product or the quote page.
// Full class strings (no interpolation) so Tailwind keeps them at build time.
type CategoryTile = {
  href: string; // where the tile links
  name: string;
  description: string;
  card: string; // card gradient background
  ring: string; // gradient ring around the photo circle
  badge: string; // small accent badge gradient
  link: string; // "Explore" link colour
  image: string; // product photo shown inside the circle
  badgeIcon: LucideIcon; // symbol inside the corner badge
};
// NOTE: "Souvenir Box" and "Cards & Stationery" are intentionally swapped in
// position (souvenir box sits in the cards slot, cards sits in the souvenir slot).
// "Souvenir Box" reuses a placeholder photo until a real one is supplied.
const categoryTiles: CategoryTile[] = [
  {
    href: "/products/category/seed-paper",
    name: "Seed Paper & Sheets",
    description: "Plantable, seed-embedded paper stock — the raw material behind everything we make.",
    card: "from-emerald-50",
    ring: "from-emerald-400 to-teal-500",
    badge: "from-emerald-500 to-teal-600",
    link: "text-emerald-600",
    image: "/images/products/artistic-sheets-1.jpg",
    badgeIcon: Sprout,
  },
  {
    href: "/products/category/bags-sleeves",
    name: "Bags & Sleeves",
    description: "Custom shopping bags, sleeves and wraps that make your brand's packaging plantable.",
    card: "from-amber-50",
    ring: "from-amber-400 to-orange-500",
    badge: "from-amber-500 to-orange-600",
    link: "text-amber-600",
    image: "/images/products/petal-bags-colorful.jpg",
    badgeIcon: ShoppingBag,
  },
  {
    // Swapped into the Cards & Stationery slot
    href: "/products/corporate-gift-boxes",
    name: "Souvenir Box",
    description: "Curated plantable souvenir and gift boxes — branded keepsakes people plant and remember.",
    card: "from-fuchsia-50",
    ring: "from-fuchsia-400 to-pink-500",
    badge: "from-fuchsia-500 to-pink-600",
    link: "text-fuchsia-600",
    image: "/images/products/artistic-sheets-1.jpg", // placeholder — real photo to come
    badgeIcon: Package,
  },
  {
    href: "/products/category/corporate",
    name: "Calendars, Diaries & Corporate",
    description: "Plantable calendars, diaries and gift packaging for corporate gifting and CSR.",
    card: "from-violet-50",
    ring: "from-violet-400 to-purple-500",
    badge: "from-violet-500 to-purple-600",
    link: "text-violet-600",
    image: "/images/products/calendars-1.jpg",
    badgeIcon: CalendarDays,
  },
  {
    href: "/products/category/tags-inserts",
    name: "Tags, Toppers & Inserts",
    description: "Hang tags, price tags, product toppers and inserts in seed paper.",
    card: "from-rose-50",
    ring: "from-rose-400 to-pink-500",
    badge: "from-rose-500 to-pink-600",
    link: "text-rose-600",
    image: "/images/products/tags-bookmarks-1.jpg",
    badgeIcon: Tag,
  },
  {
    href: "/products/category/event",
    name: "Weddings & Events",
    description: "Plantable invitations, envelopes, confetti and giveaways guests remember.",
    card: "from-teal-50",
    ring: "from-teal-400 to-cyan-500",
    badge: "from-teal-500 to-cyan-600",
    link: "text-teal-600",
    image: "/images/products/wedding-cards-1.jpg",
    badgeIcon: Gift,
  },
  {
    href: "/products/category/seed-balls",
    name: "Seed Balls",
    description: "Wildflower seed balls — toss-and-grow giveaways and CSR favourites.",
    card: "from-lime-50",
    ring: "from-lime-400 to-green-500",
    badge: "from-lime-500 to-green-600",
    link: "text-lime-600",
    image: "/images/products/seed-balls-1.jpg",
    badgeIcon: Sprout,
  },
  {
    href: "/quote",
    name: "Pen & Pencil",
    description: "Plantable pens and sprout pencils that grow into herbs after use.",
    card: "from-indigo-50",
    ring: "from-indigo-400 to-blue-500",
    badge: "from-indigo-500 to-blue-600",
    link: "text-indigo-600",
    image: "/images/products/pen-pencil.jpg",
    badgeIcon: Pencil,
  },
  {
    href: "/sample-kit",
    name: "Sample Kit",
    description: "Seed-paper swatches, print samples and a consult before you commit to bulk.",
    card: "from-sky-50",
    ring: "from-sky-400 to-blue-500",
    badge: "from-sky-500 to-blue-600",
    link: "text-sky-600",
    image: "/images/products/sample-kit-spread.jpg",
    badgeIcon: Box,
  },
  {
    href: "/products/custom-shopping-bags",
    name: "Tote Bags",
    description: "Reusable, brandable tote bags in biodegradable, plantable stock.",
    card: "from-orange-50",
    ring: "from-orange-400 to-amber-500",
    badge: "from-orange-500 to-amber-600",
    link: "text-orange-600",
    image: "/images/products/plantable-bags-1.jpg",
    badgeIcon: ShoppingBag,
  },
  {
    href: "/products/seed-paper-sheets-bulk",
    name: "Cotton Paper",
    description: "Tree-free cotton seed paper sheets — soft, textured and plantable.",
    card: "from-cyan-50",
    ring: "from-cyan-400 to-teal-500",
    badge: "from-cyan-500 to-teal-600",
    link: "text-cyan-600",
    image: "/images/products/cotton-paper-sheets.jpg",
    badgeIcon: FileText,
  },
  {
    // Swapped into the Souvenir Box slot
    href: "/products/category/cards-stationery",
    name: "Cards & Stationery",
    description: "Plantable business cards, greeting cards, bookmarks and stationery printed with your brand.",
    card: "from-blue-50",
    ring: "from-blue-400 to-indigo-500",
    badge: "from-blue-500 to-indigo-600",
    link: "text-blue-600",
    image: "/images/products/greeting-cards-1.jpg",
    badgeIcon: Mail,
  },
];

const steps = [
  { icon: Recycle, title: "Paper and cotton's waste", text: "We start with post-consumer paper and cotton off-cuts headed for the bin.", image: "/images/products/artistic-sheets-1.jpg" },
  { icon: Leaf,    title: "Paper made from waste",     text: "That waste is pulped and pressed into new seed-embedded paper — no new trees.", image: "/images/products/artistic-sheets-2.jpg" },
  { icon: ShoppingBag, title: "Moderate into products", text: "The seed paper is made into bags, tags, cards and calendars for your brand.", image: "/images/products/product-spread-grass.jpg" },
  { icon: Droplets, title: "Need water and little sunshine", text: "Plant it in soil, water it, and give it a little sunshine.", image: "/images/steps/step-plant-it.jpg" },
  { icon: Sprout,  title: "Here it grows",             text: "Instead of waste, it grows into herbs and flowers.", image: "/images/steps/step-it-grows-6.jpg" },
];

const clientWork = [
  {
    image: "/images/clients/client-metro-kit-flatlay.jpg",
    gallery: [
      "/images/clients/client-metro-kit-flatlay.jpg",
      "/images/clients/client-metro-flatlay.jpg",
      "/images/clients/client-metro-bag.jpg",
    ],
    brand: "Metro Pakistan",
    type: "CSR Corporate Gift",
    desc: "Seed paper tote bag, laptop sleeve, seed balls & planting guide for Metro's sustainability campaign.",
  },
  {
    image: "/images/clients/client-pm-csr-box.jpg",
    gallery: ["/images/clients/client-pm-csr-box.jpg"],
    brand: "Philip Morris International (PM)",
    type: "New Year CSR Gift",
    desc: "Plantable calendar, gift bag & seed ball hamper — 'Happy New Year, Green Start' campaign.",
  },
  {
    image: "/images/clients/client-corporate-cards.jpg",
    gallery: [
      "/images/clients/client-corporate-cards.jpg",
      "/images/clients/client-dawlance-ptc.jpg",
    ],
    brand: "Dawlance · Parco · Standard Chartered",
    type: "Branded Seed Paper Cards",
    desc: "Plantable greeting cards for Dawlance, Standard Chartered, Parco, Agha Steel and Reon Energy.",
  },
  {
    image: "/images/clients/client-bkk-giftset.jpg",
    gallery: [
      "/images/clients/client-bkk-giftset.jpg",
      "/images/clients/client-bkk-seedballs.jpg",
    ],
    brand: "Bakhabar Kissan (BKK)",
    type: "New Year CSR Kit",
    desc: "Full branded CSR gift set — seed balls, calendar, bottles and plantable accessories.",
  },
  {
    image: "/images/clients/client-3pol-calendar.jpg",
    gallery: ["/images/clients/client-3pol-calendar.jpg"],
    brand: "3POL by Rapidev",
    type: "Seed Paper Calendar",
    desc: "Custom-branded seed paper desk calendar with full planting instructions.",
  },
  {
    image: "/images/clients/client-cayano-bizcard.jpg",
    gallery: ["/images/clients/client-cayano-bizcard.jpg"],
    brand: "Cayano — London",
    type: "Plantable Business Card",
    desc: "Custom seed paper business card for Cayano's Managing Director — made in Lahore, delivered to London.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePage() {
  const segments = getAllSegments();
  const featured = getFeaturedProducts();
  const faqs = getFaqs().slice(0, 6);

  // Parallax for hero image — image moves at 30% of scroll speed
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────
          HERO — Full-bleed image, transparent nav, centered text
          Pull -mt-16 to go behind the sticky transparent header
      ────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative -mt-16 flex min-h-screen items-center justify-center overflow-hidden"
      >
        {/* Parallax image layer — CSS background for reliable full-bleed rendering */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/hero-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
            y: heroImageY,
          }}
        />
        {/* Hidden Next.js Image so the browser preloads / CDN optimises it */}
        <Image
          src="/images/hero-banner.jpg"
          alt=""
          fill
          priority
          aria-hidden
          className="invisible absolute"
          sizes="100vw"
        />

        {/* Gradient overlays — readable text on any part of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        {/* ── Centered hero content ── */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">

          {/* Eyebrow pill */}
          <AnimatedLine delay={0.15}>
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                <Leaf className="h-4 w-4 text-green-400" />
                Pakistan&apos;s first plantable seed-paper maker
                <PulseBadge label="Lahore" />
              </span>
            </div>
          </AnimatedLine>

          {/* Headline — word-by-word reveal */}
          <h1 className="mt-6 font-[family-name:var(--font-heading)] text-5xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <AnimatedHeadline text="Seed paper that" delay={0.3} />
            <br />
            <AnimatedHeadline
              text="grows."
              delay={0.7}
              className="italic text-green-400"
            />
          </h1>

          {/* Subline */}
          <AnimatedLine delay={1.05} className="mt-6 text-lg text-white/75 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Custom plantable products for CSR campaigns, events, retail brands and
            bulk paper supply — manufactured in Lahore with real seeds inside every sheet.
          </AnimatedLine>

          {/* CTAs */}
          <AnimatedLine delay={1.25} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <WhatsAppButton source="hero" label="Get a quote on WhatsApp" />
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/60"
            >
              <Link href="/estimator">
                <Calculator className="h-4 w-4" /> Estimate cost
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/60"
            >
              <Link href="/sample-kit">
                Request samples <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </AnimatedLine>

          {/* Stats strip */}
          <AnimatedLine delay={1.45}>
            <dl className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-5">
              {[
                { label: "MOQ from",     value: "300 units" },
                { label: "Lead time",    value: "7–15 days" },
                { label: "Made in",      value: site.city },
                { label: "Seed options", value: "Seasonal" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-2xl font-bold text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </AnimatedLine>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/40 pt-2">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-white/70"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── PARTNERS IN SUSTAINABILITY — logo wall ── */}
      <section className="border-y bg-background">
        <div className="container-page section">
          <FadeIn>
            <SectionHeading
              eyebrow="Brands we work with"
              title="Partners in sustainability"
              subtitle="From global names to homegrown brands — these are some of the teams that chose plantable seed paper for their CSR gifts, events and brand materials."
              align="center"
            />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-12">
            <LogoMarquee />
          </FadeIn>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY — circular-icon grid, just under hero ── */}
      <section className="section">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="View our popular"
              title="Plantable paper categories"
              subtitle="Every category is custom-made, seed-embedded and printed with your brand."
              align="center"
            />
          </FadeIn>
          <StaggerIn
            className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            delay={0.1}
          >
            {categoryTiles.map((tile) => {
              const BadgeIcon = tile.badgeIcon;
              return (
                <StaggerItem key={tile.name}>
                  <Link
                    href={tile.href}
                    className={`group flex h-full flex-col items-center rounded-2xl border border-black/5 bg-gradient-to-b ${tile.card} to-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div className="relative">
                      <span
                        className={`block h-28 w-28 rounded-full bg-gradient-to-br ${tile.ring} p-[3px] transition-transform duration-300 group-hover:scale-105`}
                      >
                        <span className="relative block h-full w-full overflow-hidden rounded-full bg-white">
                          <Image
                            src={tile.image}
                            alt={tile.name}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </span>
                      </span>
                      <span
                        className={`absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${tile.badge} text-white shadow-sm ring-4 ring-white`}
                      >
                        <BadgeIcon className="h-4 w-4" strokeWidth={2} />
                      </span>
                    </div>
                    <h3 className="mt-5 font-[family-name:var(--font-heading)] text-lg font-bold">
                      {tile.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {tile.description}
                    </p>
                    <span
                      className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${tile.link} transition-all group-hover:gap-2`}
                    >
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerIn>
          <FadeIn delay={0.2} className="mt-12 flex justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                View all products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ── SEGMENTS ── */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Who we work with"
              title="Find your brief — we'll handle the rest"
              subtitle="CSR campaigns, events, brand materials or bulk paper stock — each segment has its own products, MOQ and lead time. Start where you are."
            />
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" delay={0.1}>
            {segments.map((s) => (
              <StaggerItem key={s.slug}>
                <HoverCard className="h-full">
                  <Link
                    href={`/${s.slug}`}
                    className="group flex h-full flex-col rounded-2xl border bg-card p-7 transition"
                  >
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
                      {s.label}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-brand">{s.audience}</p>
                    <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.hook}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:gap-2">
                      Explore <ArrowRight className="h-4 w-4 transition-all" />
                    </span>
                  </Link>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="What is plantable paper?"
              title="Tree-free paper with seeds inside — plant it and it grows"
              subtitle="Our seed paper is made from post-consumer and post-industrial paper. No new trees. When its job is done, it doesn't become waste — it becomes a plant."
            />
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5" delay={0.1}>
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="rounded-2xl border bg-card h-full overflow-hidden">
                  <div className="relative aspect-[3/2] w-full overflow-hidden border-b bg-brand/5">
                    <Image
                      src={step.image}
                      alt={`${step.title} — ${step.text}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-xs font-bold text-brand">Step {i + 1}</p>
                    <h3 className="mt-1 font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <FadeIn>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Popular"
                title="Start with these"
                subtitle="Ready-made formats or fully custom bulk orders — we handle both."
              />
              <Button asChild variant="outline" className="hidden sm:inline-flex shrink-0">
                <Link href="/products">All products <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" delay={0.1}>
            {featured.map((p) => (
              <StaggerItem key={p.slug} className="h-full">
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── PETAL BAGS — two-column: image left, text + buttons right ── */}
      <section className="section">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <FadeIn>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card">
                <Image
                  src="/images/products/petal-bags-wide.jpg"
                  alt="Seed Paper & Petal Bags — colorful plantable bags in purple, peach, pink and blue, flower garden background by Boxit"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="eyebrow">Seed paper &amp; petal bags</p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
                Colourful plantable bags, embedded with real petals
              </h2>
              <p className="mt-4 text-muted-foreground">
                Handmade seed-paper gift bags in soft pastels — purple, peach,
                pink and blue — flecked with marigold petals and embedded with
                seeds. Branded with your logo, carried home by your customer, and
                planted into flowers when they&apos;re done. The first offline ad
                your customer keeps.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {[
                  "Custom sizes, handles & brand-colour printing",
                  "Seed-embedded, 100% biodegradable stock",
                  "Made in Lahore — bulk lead times, no imports",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/quote?product=custom-shopping-bags">
                    Request a quote
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/plantable-brand-materials">
                    Explore brand materials <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CLIENT WORK ── */}
      <section className="section bg-secondary/40">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="Real projects"
              title="Brands that turned gifts into growing things"
              subtitle="From corporate CSR kits to personalised event giveaways — here's what plantable seed paper did for real campaigns."
            />
          </FadeIn>
          <StaggerIn className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.1}>
            {clientWork.map((cw) => (
              <StaggerItem key={cw.brand}>
                <HoverCard className="h-full">
                  <div className="flex flex-col rounded-2xl border bg-card overflow-hidden h-full">
                    <CaseStudyGallery
                      images={cw.gallery}
                      alt={`${cw.brand} — ${cw.type}`}
                      fit="cover"
                      className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/30"
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-brand">{cw.type}</p>
                      <h3 className="mt-1 font-[family-name:var(--font-heading)] font-bold text-base">{cw.brand}</h3>
                      <p className="mt-2 text-sm text-muted-foreground flex-1">{cw.desc}</p>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerIn>
        </div>
      </section>

      {/* ── PRICING TIERS ── */}
      <section className="section">
        <div className="container-page">
          <FadeIn>
            <SectionHeading
              eyebrow="How we work"
              title="Pick a starting point, not a price list"
              subtitle="We don't sell fixed SKUs — every project is custom. These are the three ways brands usually start with us."
              align="center"
            />
          </FadeIn>
          <FadeIn delay={0.15} className="mt-12">
            <PricingTiers />
          </FadeIn>
        </div>
      </section>

      {/* ── SAMPLE KIT CTA ── */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-wide text-gold">The smartest first step</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
              Get a sample kit before you commit to bulk
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Feel the seed paper, see the printing and finishing samples, and get a 15-minute consultation
              on which format fits your brief. The kit cost is adjusted against your first bulk order.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="gold">
                <Link href="/sample-kit">Request a sample kit</Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/quote">Take the product quiz</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <ul className="grid gap-3 rounded-2xl bg-primary-foreground/10 p-6">
              {[
                "Seed-paper + biodegradable stock swatches",
                "Print, embossing & finishing examples",
                "Bag, tag, card & sleeve formats",
                "15-minute packaging consultation",
                "Cost adjusted against your bulk order",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Sprout className="h-4 w-4 text-gold shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section bg-secondary/40">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <FadeIn className="lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title="Answers buyers ask first" />
            <p className="mt-4 text-sm text-muted-foreground">
              Still unsure? See the full list, or ask us directly.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button asChild variant="outline">
                <Link href="/faq">See all FAQs</Link>
              </Button>
              <WhatsAppButton source="faq-teaser" label="Ask on WhatsApp" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-8">
            <FaqAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>

      <CtaBand />

      <FadeIn className="flex items-center justify-center gap-2 pb-12 text-sm text-muted-foreground">
        <Truck className="h-4 w-4" /> Nationwide delivery across Pakistan
      </FadeIn>
    </>
  );
}
