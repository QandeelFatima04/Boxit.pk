import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Sprout, Truck, Package } from "lucide-react";
import { AddToQuoteButton, AddToCartButton } from "@/components/add-to-cart-button";
import { SheetConfigurator } from "@/components/sheet-configurator";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { EstimatorButton } from "@/components/estimator-button";
import { formatPKR } from "@/lib/format";
import { isCheckoutEnabled } from "@/lib/commerce";
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

  // Sized stock (seed paper sheets) is priced per unit via the configurator;
  // flat SKUs (the sample kit, the A5 pack) get a straight Add-to-cart.
  // Everything else stays on the quote flow — see CHECKOUT_ENABLED_SLUGS.
  const buyable = product.purchasable && isCheckoutEnabled(product.slug);
  const sizedVariants = buyable ? product.variants : undefined;
  const hasSizes = Boolean(sizedVariants?.length);
  const flatPrice = buyable && !hasSizes ? product.price : undefined;
  const cheapestVariant = sizedVariants?.length
    ? Math.min(...sizedVariants.map((v) => v.price))
    : undefined;

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image}
        // Only flat SKUs get an Offer price. Sized stock has a 300-sheet MOQ, so
        // advertising its per-sheet rate as a buyable price would be inaccurate.
        price={flatPrice}
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

      {/* Tightened so the image, details and all four CTAs share the first
          screen on a ~670px-tall laptop viewport. */}
      <section className="container-page py-6 sm:py-8">
        <nav className="mb-4 text-sm text-muted-foreground">
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

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Media — square on phones, height-capped on laptops so a tall
              viewport isn't consumed by the photo alone. */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-gradient-to-br from-secondary via-accent to-cream lg:aspect-auto lg:h-[min(62svh,30rem)]">
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

            <div className="mt-4">
              {flatPrice ? (
                <span className="text-3xl font-bold">{formatPKR(flatPrice)}</span>
              ) : cheapestVariant ? (
                <span className="text-3xl font-bold">
                  From {formatPKR(cheapestVariant)}
                  <span className="ml-1 text-base font-medium text-muted-foreground">
                    / sheet
                  </span>
                </span>
              ) : (
                <span className="text-xl font-bold text-brand">
                  Custom-quoted
                </span>
              )}
            </div>

            <p className="mt-3 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* facts */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
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

            {hasSizes && <SheetConfigurator product={product} />}

            {/* 2×2 grid: equal-width CTAs that never overflow the column (a
                flex row pushed the page into horizontal scroll). Stacks on
                phones; each cell stretches so all four share one size. */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:w-full">
              {flatPrice ? (
                <AddToCartButton
                  size="lg"
                  item={{
                    slug: product.slug,
                    name: product.name,
                    price: flatPrice,
                    image: product.image,
                  }}
                />
              ) : hasSizes ? null : (
                <AddToQuoteButton
                  size="lg"
                  item={{
                    slug: product.slug,
                    name: product.name,
                    image: product.image,
                  }}
                />
              )}
              <Button asChild size="lg" variant="outline">
                <Link href={`/quote?product=${product.slug}`}>
                  Request a quote
                </Link>
              </Button>
              <EstimatorButton />
              {/* Matches Button size="lg" (h-12/px-7/text-base) so all four
                  CTAs share one height and baseline. */}
              <WhatsAppButton
                source={`product-${product.slug}`}
                label="WhatsApp us"
                text={`Hi Boxit, I'd like a quote for "${product.name}". Quantity: ___.`}
                className="h-12 shrink-0 whitespace-nowrap px-7 text-base"
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
