import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionHeading, CtaBand } from "@/components/sections";
import { ProductsHero } from "@/components/products-hero";
import { getAllCategories, getProductsByCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Products — Plantable & Biodegradable Packaging",
  description:
    "Browse Boxit's plantable seed-paper products: bags, tags, cards, calendars, invitations, seed balls and more. Buy ready-made items or request a custom quote.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const categories = getAllCategories();

  return (
    <>
      <ProductsHero />

      {categories.map((cat) => {
        const products = getProductsByCategory(cat.slug);
        if (products.length === 0) return null;
        return (
          <section key={cat.slug} className="section" id={cat.slug}>
            <div className="container-page">
              <div className="flex items-end justify-between gap-4">
                <SectionHeading title={cat.name} subtitle={cat.description} />
                <Link
                  href={`/products/category/${cat.slug}`}
                  className="hidden whitespace-nowrap text-sm font-semibold text-brand hover:underline sm:inline"
                >
                  View category →
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Lite reseller / wholesale enquiry — no published pricing */}
      <section className="section">
        <div className="container-page">
          <div className="rounded-3xl border bg-secondary/40 p-8 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">Resellers &amp; wholesale</p>
                <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold">
                  Stocking or reselling plantable products?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Gift shops, eco-stores and corporate gifting vendors — talk to
                  us about reseller and private-label supply. Tell us what you
                  want to stock and we&apos;ll share terms.
                </p>
              </div>
              <Link
                href="/quote?type=reseller"
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Enquire about wholesale
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
