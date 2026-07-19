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
      "A full plantable CSR kit for Metro's sustainability team: seed-paper tote bag, laptop sleeve, seed balls and a planting guide, all branded and packed as one set. The tote and sleeve stay in daily use; the seed balls go straight into a pot.",
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
    purpose: "A branded carrier bag with a second life as a plant",
    result:
      "A seed-paper carrier bag for National Logistics Cell, branded with NLC's logo and 'In step with tomorrow'. A planting guide is printed on the bag itself, so whoever carries it home already knows how to soak and sow it.",
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
      "Custom plantable seed-paper greeting cards produced for Dawlance, Standard Chartered, Parco, Agha Steel and Reon Energy. Each run matched to that company's own colors and card format, printed on seed paper made in our facility.",
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
      "Plantable seed-paper Eid Mubarak cards for SNGPL (Sui Northern Gas Pipelines), tied to the Billion Tree programme. The card carries the Eid greeting on one side and a planting guide on the other, so the greeting itself becomes a contribution to the campaign.",
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
    purpose: "A branded card where the message and the material say the same thing",
    result:
      "A plantable seed-paper card for L'Oréal Pakistan carrying a 'we are rooting for you' message, with a planting guide alongside it. The wording and the material make the same point, and the recipient gets it in a second.",
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
      "A plantable seed-paper Independence Day card and matching branded envelope for Omoré, carrying the Omoré mark and a 'Happy Independence Day' message. Sown after 14 August, the card comes up as flowers a few weeks later.",
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
      "A custom seed-paper business card for Cayano's Managing Director, designed and made in Lahore and delivered to London. It gives him something to talk about the moment he hands it across the table.",
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
      "A plantable gifting set branded for JazzWorld: a seed-paper-cover notebook with cotton drawstring pouches of seed balls. Two pieces at two price points in one set, so the same design worked for both staff and client gifting.",
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
      "A custom plantable notebook branded for Lumovy Technology Solutions, with a seed-paper outer cover on a practical everyday notebook. It sits on a desk for months with the Lumovy name on it, and the cover plants into herbs or flowers once the pages run out.",
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
    purpose: "Summit cards that stand out in a stack of a hundred others",
    result:
      "Plantable seed-paper business cards and event materials produced for Ejad's tech summit. On a floor where every stall hands out the same glossy card, a textured seed-paper card is the one attendees stop to look at.",
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
      "Custom plantable seed-paper thank-you cards for Knisa, sized to drop into the existing retail packaging. The card is the last thing a customer touches when they open the parcel, and it gives them a reason to photograph the unboxing.",
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
      "Seed-paper invitations and matching confetti for a Lahore wedding, produced as one plastic-free suite. Guests took the confetti home along with the card, ready to sow. (Private client; named on request with permission.)",
    image: "/images/products/wedding-cards-1.jpg",
    gallery: ["/images/products/wedding-cards-1.jpg"],
  },
];
