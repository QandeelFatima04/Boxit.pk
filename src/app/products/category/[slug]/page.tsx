import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { CtaBand } from "@/components/sections";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import {
  getAllCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — Plantable Packaging`,
    description: cat.seo?.metaDescription ?? cat.description,
    keywords: cat.seo?.keywords,
    alternates: { canonical: `/products/category/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const products = getProductsByCategory(cat.slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: cat.name, url: `/products/category/${cat.slug}` },
        ]}
      />
      <section className="bg-gradient-to-b from-secondary/60 to-background">
        <div className="container-page py-16 sm:py-20">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/products" className="hover:text-brand">
              Products
            </Link>{" "}
            / <span className="text-foreground">{cat.name}</span>
          </nav>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold sm:text-5xl">
            {cat.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            {cat.description}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
