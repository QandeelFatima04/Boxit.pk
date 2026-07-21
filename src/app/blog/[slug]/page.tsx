import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/sections";
import { PostBody } from "@/components/post-body";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import {
  getBlogPosts,
  getBlogPost,
  getRelatedBlogPosts,
  formatPostDate,
  readingTime,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.seo?.seoTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    keywords: post.seo?.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      images: post.seo?.ogImage ?? post.cover,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(post.slug);

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.seo?.metaDescription ?? post.excerpt}
        slug={post.slug}
        date={post.date}
        author={post.author}
        image={post.cover}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <header className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page max-w-3xl py-12 sm:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <p className="mt-5 text-sm text-muted-foreground">
            {formatPostDate(post.date)} · {post.author} ·{" "}
            {readingTime(post.body)} min read
          </p>
        </div>
      </header>

      {post.cover && (
        <div className="container-page max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border bg-secondary/30">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 56rem"
              priority
            />
          </div>
        </div>
      )}

      <article className="container-page max-w-3xl py-12 sm:py-16">
        <PostBody body={post.body} />
      </article>

      {related.length > 0 && (
        <section className="border-t bg-secondary/30">
          <div className="container-page py-16">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
              Keep reading
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5"
                >
                  {p.cover && (
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                      <Image
                        src={p.cover}
                        alt={p.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2">
                      Read <ArrowRight className="h-3.5 w-3.5 transition-all" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
