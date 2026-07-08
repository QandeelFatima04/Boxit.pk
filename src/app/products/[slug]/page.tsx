import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Sprout, Truck, Package } from "lucide-react";
import { AddToQuoteButton } from "@/components/add-to-cart-button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { EstimatorButton } from "@/components/estimator-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import {
  getAllProducts,
  getProduct,
  getCategory,
  getProductsByCategory,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.seo?.seoTitle ?? p.name,
    description: p.seo?.metaDescription ?? p.description,
    keywords: p.seo?.keywords,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: p.seo?.seoTitle ?? p.name,
      description: p.seo?.metaDescription ?? p.description,
      url: `/products/${p.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image}
        price={undefined}
        slug={product.slug}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          ...(category
            ? [{ name: category.name, url: `/products/category/${category.slug}` }]
            : []),
          { name: product.name, url: `/products/${product.slug}` },
        ]}
      />

      <section className="container-page py-12 sm:py-16">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-brand">
            Products
          </Link>
          {category && (
            <>
              {" / "}
              <Link
                href={`/products/category/${category.slug}`}
                className="hover:text-brand"
              >
                {category.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Media */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-gradient-to-br from-secondary via-accent to-cream">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <Sprout className="h-20 w-20 text-brand/60" />
              </div>
            )}
            {product.featured && (
              <Badge className="absolute left-4 top-4 bg-gold text-gold-foreground">
                Popular
              </Badge>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {product.tagline}
            </p>

            <div className="mt-6">
              <span className="text-xl font-bold text-brand">Custom-quoted</span>
            </div>

            <p className="mt-5 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* facts */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {product.moq && (
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand" /> MOQ: {product.moq}
                </span>
              )}
              {product.leadTime && (
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-brand" /> {product.leadTime}
                </span>
              )}
            </div>

            {product.features && product.features.length > 0 && (
              <ul className="mt-6 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToQuoteButton
                size="lg"
                item={{
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                }}
              />
              <Button asChild size="lg" variant="outline">
                <Link href={`/quote?product=${product.slug}`}>
                  Request a quote
                </Link>
              </Button>
              <EstimatorButton />
              <WhatsAppButton
                source={`product-${product.slug}`}
                label="Get a quote on WhatsApp"
                text={`Hi Boxit, I'd like a quote for "${product.name}". Quantity: ___.`}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.segments.map((seg) => (
                <Link key={seg} href={`/${seg}`}>
                  <Badge variant="secondary" className="capitalize">
                    {seg.replace("-", " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
              You might also like
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
