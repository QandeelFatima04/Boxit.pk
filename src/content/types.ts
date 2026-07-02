// Content model. Mirrors the planned Sanity schema 1:1 so migration is trivial.
// Every editable document carries SEO fields ("backend elements") so non-technical
// staff can run the recurring optimization workflow without code changes.

export type Seo = {
  /** Optional override; falls back to the document title. */
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
};

export type SegmentSlug =
  | "csr-corporate-gifts"
  | "weddings-events"
  | "plantable-brand-materials"
  | "seed-paper-stock";

export type Product = {
  slug: string;
  name: string;
  /** Short marketing line shown on cards. */
  tagline: string;
  description: string;
  category: string; // category slug
  segments: SegmentSlug[];
  image?: string;
  /** Fixed-price productized item → purchasable. Otherwise → request a quote. */
  purchasable: boolean;
  price?: number; // PKR, required when purchasable
  moq?: string; // e.g. "300 A4 sheets"
  leadTime?: string; // e.g. "5–7 working days"
  features?: string[];
  seo?: Seo;
  featured?: boolean;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image?: string;
  seo?: Seo;
};

export type PricingTier = {
  name: string;
  positioning: string;
  bestFor: string;
  priceHint: string; // we don't expose fixed SKU prices — these are frames
  includes: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
};

export type CaseStudy = {
  slug: string;
  client: string;
  clientType: string;
  segment: SegmentSlug;
  product: string;
  quantity: string;
  purpose: string;
  result: string;
  quote?: { text: string; author: string };
  image?: string;
  /** Extra related images shown as a small gallery on the case-study tile. */
  gallery?: string[];
  logo?: string;
  seo?: Seo;
};

export type Faq = {
  question: string;
  answer: string;
  category: "Product" | "Printing" | "Ordering" | "Logistics" | "Company";
};

export type SegmentPage = {
  slug: SegmentSlug;
  label: string;
  audience: string;
  heroHeadline: string;
  heroSub: string;
  /** Landing image shown in the hero, relevant to the segment. */
  heroImage: string;
  /** Alt text for the hero image. */
  heroImageAlt: string;
  pains: string[];
  offer: string;
  hook: string;
  productSlugs: string[];
  startingFrom: string;
  moq: string;
  leadTime: string;
  cta: { label: string; whatsappText: string };
  seo?: Seo;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  tags: string[];
  /** Markdown-ish body (rendered as paragraphs). */
  body: string;
  cover?: string;
  seo?: Seo;
};
