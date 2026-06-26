// Content access layer. Today it reads typed local content; swapping to Sanity
// later means changing only this file (the page components stay the same).

import { products } from "@/content/products";
import { categories } from "@/content/categories";
import { segments } from "@/content/segments";
import { faqs, faqCategories } from "@/content/faqs";
import { caseStudies } from "@/content/case-studies";
import { pricingTiers, guarantees } from "@/content/pricing";
import { blogPosts } from "@/content/blog";
import type { Product, SegmentSlug } from "@/content/types";

// Products
export const getAllProducts = () => products;
export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
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
