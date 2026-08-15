import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/sections";
import { LeadMagnet } from "@/components/forms/lead-magnet";
import { getBlogPosts, formatPostDate, readingTime } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Sustainable Packaging & Plantable Paper",
  description:
    "Guides and ideas on plantable seed paper, sustainable packaging and eco-friendly corporate gifting in Pakistan, from the Boxit team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getBlogPosts();
  // Newest post leads the page; the rest fill the grid below it.
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero height comes from its content — no fixed/min height — so the
          navbar, hero and the top of the featured post share the first screen. */}
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-blog pb-5 pt-6 sm:pb-6 sm:pt-8">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-2 font-[family-name:var(--font-heading)] text-[clamp(1.75rem,1rem+1.9vw,2.5rem)] font-bold leading-[1.15]">
            Ideas for greener packaging
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Practical guides on plantable paper, sustainable packaging and
            eco-conscious gifting.
          </p>
        </div>
      </section>

      {featured && (
        <section className="pt-2 sm:pt-3">
          <div className="container-blog">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-3xl border bg-card transition hover:shadow-lg hover:shadow-black/5 lg:grid-cols-2"
            >
              {/* Shorter frame while the card is stacked, so the excerpt clears
                  the sticky WhatsApp button in the bottom-right. */}
              {featured.cover && (
                <div className="relative aspect-[2/1] overflow-hidden bg-secondary/30 lg:aspect-auto lg:min-h-[16rem]">
                  <Image
                    src={featured.cover}
                    alt={featured.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
              <div className="flex flex-col justify-center p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Latest</Badge>
                  {featured.tags.slice(0, 2).map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
                <h2 className="mt-3 font-[family-name:var(--font-heading)] text-xl font-bold leading-tight sm:text-2xl">
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {featured.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatPostDate(featured.date)}</span>
                  <span aria-hidden>·</span>
                  <span>{readingTime(featured.body)} min read</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2">
                  Read article{" "}
                  <ArrowRight className="h-4 w-4 transition-all" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-blog grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5"
            >
              {/* 3:2 frame + object-cover: the image fills the tile edge to
                  edge with no letterboxing. 3:2 (rather than a wider frame)
                  keeps the crop shallow, since several covers are portrait. */}
              {post.cover && (
                <div className="relative aspect-[3/2] overflow-hidden bg-secondary/30">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
                <h2 className="mt-3 font-[family-name:var(--font-heading)] text-lg font-bold leading-tight">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {formatPostDate(post.date)} · {readingTime(post.body)} min
                    read
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-brand group-hover:gap-2">
                    Read <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOFU nurture: a gated guide captures readers who aren't ready for
          samples/quote yet, in exchange for a genuinely useful download. */}
      <section className="pb-4">
        <div className="container-blog">
          <LeadMagnet source="blog-index" />
        </div>
      </section>

      {/* Re-aligns CtaBand's own .container-page to the blog gutters. */}
      <div className="blog-cta">
        <CtaBand />
      </div>
    </>
  );
}
