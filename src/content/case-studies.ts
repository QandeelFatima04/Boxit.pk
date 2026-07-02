import type { CaseStudy } from "./types";

// Real client work, aligned with the named clients shown on the homepage.
// Factual fields only — NO testimonial quotes are included until real,
// permission-cleared quotes are collected from each client. Do not attach
// invented quotes to a named company (the detail page prints the quote
// author alongside the client name).
export const caseStudies: CaseStudy[] = [
  {
    slug: "metro-csr-kit",
    client: "Metro Pakistan",
    clientType: "CSR / Corporate gifting",
    segment: "csr-corporate-gifts",
    product: "Seed-paper tote, laptop sleeve, seed balls & planting guide",
    quantity: "Corporate bulk run",
    purpose: "A branded CSR kit for Metro's sustainability campaign",
    result:
      "A full plantable CSR kit — seed-paper tote bag, laptop sleeve, seed balls and a planting guide — branded for Metro's sustainability team. A giveaway recipients could actually use, then plant.",
    image: "/images/clients/client-metro-kit-flatlay.jpg",
    gallery: [
      "/images/clients/client-metro-kit-flatlay.jpg",
      "/images/clients/client-metro-flatlay.jpg",
    ],
  },
  {
    slug: "corporate-plantable-cards",
    client: "Dawlance · Standard Chartered · Parco",
    clientType: "Corporate seed-paper cards",
    segment: "csr-corporate-gifts",
    product: "Branded plantable greeting cards",
    quantity: "Multi-brand card runs",
    purpose: "Plantable greeting cards for corporate gifting and campaigns",
    result:
      "Custom plantable seed-paper greeting cards produced for Dawlance, Standard Chartered, Parco, Agha Steel and Reon Energy — branded corporate cards that recipients plant instead of bin.",
    image: "/images/clients/client-corporate-cards.jpg",
    gallery: [
      "/images/clients/client-corporate-cards.jpg",
      "/images/products/greeting-cards-1.jpg",
    ],
  },
  {
    slug: "cayano-plantable-business-card",
    client: "Cayano — London",
    clientType: "Brand materials",
    segment: "plantable-brand-materials",
    product: "Plantable seed-paper business card",
    quantity: "Custom business-card order",
    purpose: "A plantable business card for Cayano's Managing Director",
    result:
      "A custom seed-paper business card for Cayano's Managing Director — designed and made in Lahore, delivered to London. Most business cards get binned; this one gets planted.",
    image: "/images/clients/client-cayano-bizcard.jpg",
    gallery: [
      "/images/clients/client-cayano-bizcard.jpg",
      "/images/products/tags-bookmarks-1.jpg",
    ],
  },
  {
    slug: "plantable-wedding-invitations",
    client: "Private wedding, Lahore",
    clientType: "Wedding / private event",
    segment: "weddings-events",
    product: "Plantable invitations & confetti",
    quantity: "Invitation suite",
    purpose: "A plastic-free invitation guests would remember",
    result:
      "Seed-paper invitations and confetti for a Lahore wedding — a plastic-free suite that guests could plant after the event. (Private client; named on request with permission.)",
    image: "/images/products/wedding-cards-1.jpg",
    gallery: ["/images/products/wedding-cards-1.jpg"],
  },
];
