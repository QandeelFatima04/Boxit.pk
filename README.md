# Boxit.pk

The new Boxit website — Pakistan's first plantable seed-paper & sustainable-packaging maker. Rebuilt from a brochure-style catalogue into a **conversion funnel**: buyer-segmented landing pages, a paid (refundable) sample-kit entry offer, WhatsApp-first CTAs, transparent MOQ/pricing/timeline, proof via case studies, a guided packaging-fit quiz, full SEO + structured data, channel UTM tracking, and lightweight e-commerce for ready-made items.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (base-ui primitives)
- **Python** automation layer in `scripts/`
- Analytics: **GA4 + Meta Pixel** with key events and **first-touch UTM attribution**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have (all optional in dev)
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run lint
```

## Environment

See `.env.example`. Everything is optional in development:
- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_FB_PIXEL_ID` — analytics (no-op if unset)
- `RESEND_API_KEY`, `LEADS_NOTIFY_EMAIL` — email notifications for leads/orders
- `PAYMENT_PROVIDER` + gateway keys — JazzCash/Easypaisa/cards (COD + bank transfer work without any gateway)
- `NEXT_PUBLIC_SANITY_*` — optional CMS (local content is the default)

## Structure

```
src/
  app/                 # routes (home, segments, products, sample-kit, quote, work, blog, legal, api)
  components/          # UI: header/footer, cart, forms, sections, product card, analytics, json-ld
  content/             # typed content (products, categories, segments, faqs, case studies, pricing, blog)
  lib/                 # site config, content access, payments, commerce, tracking, utm, format
scripts/               # Python: utm_links.py (channel links), optimize_seo.py (90-day SEO run)
```

## Content & the optimization workflow

Content lives in `src/content/*` as typed objects, each with **SEO fields** (`seoTitle`, `metaDescription`, `keywords`). The access layer (`src/lib/content.ts`) is the single seam — swapping to Sanity later means changing only that file. Editing an item's SEO fields re-renders its page metadata and JSON-LD with no other code change. `scripts/optimize_seo.py` drafts improved SEO copy (AI-assisted via the Claude API) for human review — the recurring ~90-day optimization cadence.

## Marketing attribution (UTMs)

`scripts/utm_links.py` generates a tagged-link sheet for every channel (Meta/IG ads, IG bio, WhatsApp, email, QR, partners). On landing, the site captures first-touch UTM/click-IDs (`src/lib/utm.ts`) and attaches them to **every lead and order**, plus forwards campaigns to GA4.

## Commerce

- Cart (context + localStorage), checkout, order confirmation.
- Server recomputes order totals from the catalogue (never trusts client prices).
- Payments: **COD** and **bank transfer** work today; **JazzCash/Easypaisa** is behind an adapter (`src/lib/payments.ts`) that switches on once merchant keys are set.
- Standard SKUs are purchasable; custom/bulk routes to **Request a Quote**.

## Before launch (open items)

Real prices/MOQs/timelines, sample-kit price, WhatsApp number, payee/bank details (`src/lib/payments.ts`), product photography, and (optionally) a Sanity project + payment-gateway credentials. See the build plan for the full list.
