import type { Faq } from "./types";

// Sourced verbatim (cleaned) from the supplied FAQ document.
export const faqs: Faq[] = [
  {
    category: "Product",
    question: "Is this actually plantable?",
    answer:
      "Yes. Our seed paper is fully plantable and biodegradable. Once it has been used, press it into soil, water it regularly, and the seeds inside will germinate.",
  },
  {
    category: "Product",
    question: "Which seeds are used in seed paper?",
    answer:
      "Basil, chia, marigold, tomato, mint, coriander, sunflower and mixed wildflower, subject to season and availability. For bulk orders we can source a specific seed if you have one in mind.",
  },
  {
    category: "Product",
    question: "Will it germinate in Pakistani weather?",
    answer:
      "Yes. We select seed varieties that suit Pakistani conditions, and they germinate reliably given decent soil, regular water and a few hours of sun. Summer planting needs more frequent watering than winter.",
  },
  {
    category: "Product",
    question: "Is it durable enough for packaging?",
    answer:
      "Yes, for lightweight packaging: tags, cards, sleeves, inserts and promotional material. We stock a range of GSM weights, so tell us the application and we will recommend a thickness.",
  },
  {
    category: "Product",
    question: "Is your seed paper tree-free?",
    answer:
      "Yes. Our seed paper is made from post-consumer and post-industrial waste paper collected from local offices and schools. No new trees are pulped for it.",
  },
  {
    category: "Product",
    question: "What is the shelf life of seed paper?",
    answer:
      "Plant it within two years for the best results. It will still grow after that, but germination rates drop off. Keep it somewhere cool and dry in the meantime.",
  },
  {
    category: "Printing",
    question: "Can you print my logo?",
    answer:
      "Yes. We print logos, brand colors, QR codes and full packaging artwork. Send us what you have and we will tell you how it will sit on seed paper.",
  },
  {
    category: "Printing",
    question: "What printing method do you recommend for plantable seed paper?",
    answer:
      "Offset for bulk runs. For shorter runs and specialty finishes we use UV flatbed, inkjet, screen printing, letterpress and UV DTF. We will recommend one based on your quantity and artwork.",
  },
  {
    category: "Printing",
    question: "What kind of pen can I use to write on seed paper?",
    answer:
      "Ballpoints, rollerballs and calligraphy markers all work well. The surface is textured, so test a new pen on a sample sheet first, especially for wedding calligraphy.",
  },
  {
    category: "Ordering",
    question: "What is the minimum order quantity?",
    answer:
      "It depends on the product and the printing. Plain sheets start at 300 A4, which suits most startups and SMEs. Printed items carry their own minimums, listed on each product page.",
  },
  {
    category: "Ordering",
    question: "What is the price range?",
    answer:
      "Price depends on size, printing method, GSM, seed type and quantity. We quote small runs and large corporate campaigns alike. Use the cost estimator for a ballpark, or request a quote for an exact figure.",
  },
  {
    category: "Ordering",
    question: "Can I see samples?",
    answer:
      "Yes. A sample kit lets you check paper quality, print finish and germination before you commit to a bulk run. What you pay for the kit is credited against your first order.",
  },
  {
    category: "Ordering",
    question: "What's the largest size of paper that you have?",
    answer:
      "Our largest stocked size is 15\" × 20\" in deckle edge.",
  },
  {
    category: "Logistics",
    question: "How fast can you deliver?",
    answer:
      "Most orders run 7 to 15 working days after artwork approval, depending on the product. Each product page lists its own lead time. Tell us your deadline early and we will say honestly whether we can meet it.",
  },
  {
    category: "Company",
    question: "Have brands used this before?",
    answer:
      "Yes. Corporate brands, FMCGs, event companies and eco-conscious businesses across Pakistan have used our seed paper for packaging, invitations, campaigns and giveaways. Our work page has the specifics.",
  },
  {
    category: "Company",
    question: "Where is your office located?",
    answer:
      "We manufacture and print in Pakistan, and ship nationwide. Message us on WhatsApp and we can arrange a visit or a call.",
  },
];

export const faqCategories = [
  "Product",
  "Printing",
  "Ordering",
  "Logistics",
  "Company",
] as const;
