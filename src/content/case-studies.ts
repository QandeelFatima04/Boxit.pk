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
      "/images/products/shopping-bag-metro.jpg",
      "/images/clients/client-metro-bag.jpg",
    ],
  },
  {
    slug: "nlc-plantable-carrier-bag",
    client: "NLC — National Logistics Cell",
    clientType: "Corporate branded packaging",
    segment: "csr-corporate-gifts",
    product: "Plantable seed-paper carrier bag",
    quantity: "Corporate bulk run",
    purpose: "A branded carrier bag that ends as a plant, not landfill",
    result:
      "A seed-paper carrier bag for National Logistics Cell — branded with NLC's logo and 'In step with tomorrow', and printed with a step-by-step planting guide so the bag itself can be planted after use instead of thrown away.",
    image: "/images/clients/client-nlc-seed-bag.jpg",
    gallery: ["/images/clients/client-nlc-seed-bag.jpg"],
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
      "/images/clients/client-dawlance-ptc.jpg",
      "/images/products/agha-steel-invite.png",
    ],
  },
  {
    slug: "sngpl-plantable-eid-cards",
    client: "SNGPL",
    clientType: "Seasonal corporate cards",
    segment: "csr-corporate-gifts",
    product: "Plantable Eid greeting cards",
    quantity: "Corporate seasonal run",
    purpose: "Eid greetings that support a greener Pakistan",
    result:
      "Plantable seed-paper Eid Mubarak cards for SNGPL (Sui Northern Gas Pipelines) — a seasonal greeting tied to the Billion Tree programme, printed with a soak-and-plant guide so every card grows instead of being thrown away.",
    image: "/images/clients/client-sngpl-eid-card.jpg",
    gallery: [
      "/images/clients/client-sngpl-eid-card.jpg",
      "/images/clients/client-sngpl-billion-tree.jpg",
    ],
  },
  {
    slug: "loreal-plantable-cards",
    client: "L'Oréal Pakistan",
    clientType: "Brand materials",
    segment: "plantable-brand-materials",
    product: "Plantable seed-paper cards",
    quantity: "Brand campaign run",
    purpose: "A branded card recipients keep and plant",
    result:
      "A plantable seed-paper card for L'Oréal Pakistan — a 'we are rooting for you' message on seed-embedded paper with soak-and-plant instructions, turning a brand card into a plant recipients keep instead of bin.",
    image: "/images/clients/client-loreal-rooting-card.jpg",
    gallery: ["/images/clients/client-loreal-rooting-card.jpg"],
  },
  {
    slug: "omore-plantable-independence-cards",
    client: "Omoré",
    clientType: "Seasonal brand cards",
    segment: "csr-corporate-gifts",
    product: "Plantable Independence Day cards & envelopes",
    quantity: "Campaign run",
    purpose: "An Independence Day giveaway that outlives the campaign",
    result:
      "A plantable seed-paper Independence Day card and branded envelope for Omoré — carrying the Omoré mark and a 'Happy Independence Day' message, then planting into flowers instead of ending in the bin.",
    image: "/images/clients/client-omore-independence-card.jpg",
    gallery: ["/images/clients/client-omore-independence-card.jpg"],
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
    slug: "jazz-plantable-notebook",
    client: "Jazz",
    clientType: "Corporate gifting",
    segment: "csr-corporate-gifts",
    product: "Plantable notebook & seed-ball pouches",
    quantity: "Corporate gifting run",
    purpose: "A branded plantable gifting set for JazzWorld's teams and clients",
    result:
      "A plantable gifting set branded for JazzWorld — a seed-paper-cover notebook alongside cotton drawstring pouches of seed balls. Practical branded giveaways recipients actually use, then plant into herbs or flowers.",
    image: "/images/products/jazzworld-notebook.jpg",
    gallery: [
      "/images/products/jazzworld-notebook.jpg",
      "/images/products/seed-ball-bags-1.jpg",
      "/images/products/seed-ball-bags-2.jpg",
    ],
  },
  {
    slug: "lumovy-plantable-notebook",
    client: "Lumovy — Technology Solutions",
    clientType: "Corporate gifting",
    segment: "csr-corporate-gifts",
    product: "Plantable branded notebook",
    quantity: "Corporate gifting run",
    purpose: "A branded plantable notebook for Lumovy's team and clients",
    result:
      "A custom plantable notebook branded for Lumovy Technology Solutions — a seed-paper outer cover on a practical everyday notebook. When the pages run out, the cover plants into herbs or flowers instead of going in the bin.",
    image: "/images/products/lumovy-notebook.jpg",
    gallery: ["/images/products/lumovy-notebook.jpg"],
  },
  {
    slug: "ejad-tech-summit-cards",
    client: "Ejad — Tech Summit",
    clientType: "Brand materials / event",
    segment: "plantable-brand-materials",
    product: "Plantable business cards & event materials",
    quantity: "Event print run",
    purpose: "Plantable cards attendees would keep instead of bin",
    result:
      "Plantable seed-paper business cards and event materials produced for Ejad's tech summit — branded cards attendees plant instead of pocket and forget.",
    image: "/images/products/ejad-tech-summit-a.png",
    gallery: [
      "/images/products/ejad-tech-summit-a.png",
      "/images/products/ejad-tech-summit-b.png",
    ],
  },
  {
    slug: "knisa-thank-you-cards",
    client: "Knisa",
    clientType: "Brand materials / unboxing",
    segment: "plantable-brand-materials",
    product: "Plantable thank-you cards & inserts",
    quantity: "Retail unboxing run",
    purpose: "A thank-you card that turns into a plant",
    result:
      "Custom plantable seed-paper thank-you cards for Knisa — branded unboxing inserts that turn a simple thank-you into something the customer can plant and keep.",
    image: "/images/products/knisa-thankyou-a.png",
    gallery: [
      "/images/products/knisa-thankyou-a.png",
      "/images/products/knisa-thankyou-b.png",
      "/images/products/knisa-thankyou-c.png",
      "/images/products/knisa-thankyou-d.png",
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
