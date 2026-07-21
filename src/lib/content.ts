// Content access layer. Today it reads typed local content; swapping to Sanity
// later means changing only this file (the page components stay the same).

import { products } from "@/content/products";
import { categories } from "@/content/categories";
import { segments } from "@/content/segments";
import { faqs, faqCategories } from "@/content/faqs";
import { caseStudies } from "@/content/case-studies";
import { pricingTiers, guarantees } from "@/content/pricing";
import { blogPosts } from "@/content/blog";
import { isCheckoutEnabled } from "@/lib/commerce";
import type { Product, ProductVariant, SegmentSlug } from "@/content/types";

// Products
export const getAllProducts = () => products;
export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

/** Look up a size option on a variant-priced product. */
export const getVariant = (
  product: Product,
  variantKey?: string,
): ProductVariant | undefined =>
  variantKey ? product.variants?.find((v) => v.key === variantKey) : undefined;

/**
 * The authoritative unit price and minimum quantity for a product line.
 * Used by the cart UI *and* by the order API, so a shopper can never be charged
 * a price the catalogue doesn't agree with.
 */
export function resolveUnitPrice(
  product: Product,
  variantKey?: string,
): { price: number; minQty: number } | null {
  // Priced in the catalogue is not the same as open for online payment.
  if (!product.purchasable || !isCheckoutEnabled(product.slug)) return null;
  if (product.variants?.length) {
    const variant = getVariant(product, variantKey);
    if (!variant) return null; // a size must be chosen
    return { price: variant.price, minQty: variant.minQty };
  }
  if (!product.price) return null;
  return { price: product.price, minQty: 1 };
}
export const getFeaturedProducts = () => products.filter((p) => p.featured);
export const getPurchasableProducts = () =>
  products.filter((p) => p.purchasable);
export const getProductsByCategory = (categorySlug: string) =>
  products.filter((p) => p.category === categorySlug);
export const getProductsBySegment = (segment: SegmentSlug) =>
  products.filter((p) => p.segments.includes(segment));
export const getProductsBySlugs = (slugs: string[]): Product[] =>
  slugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as Product[];

// Categories
export const getAllCategories = () => categories;
export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

// Segments
export const getAllSegments = () => segments;
export const getSegment = (slug: string) =>
  segments.find((s) => s.slug === slug);

// FAQ
export const getFaqs = () => faqs;
export { faqCategories };

// Case studies
export const getCaseStudies = () => caseStudies;
export const getCaseStudy = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);

// Pricing
export const getPricingTiers = () => pricingTiers;
export { guarantees };

// Blog
export const getBlogPosts = () =>
  [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
export const getBlogPost = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);

/** Posts sharing the most tags with `slug`, newest first. */
export const getRelatedBlogPosts = (slug: string, limit = 3) => {
  const post = getBlogPost(slug);
  if (!post) return [];
  return getBlogPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      shared: p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((r) => r.post);
};

export const formatPostDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/** Rounded reading time at ~200 wpm, floored at one minute. */
export const readingTime = (body: string) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
