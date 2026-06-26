import type { Faq } from "./types";

// Sourced verbatim (cleaned) from the supplied FAQ document.
export const faqs: Faq[] = [
  {
    category: "Product",
    question: "Is this actually plantable?",
    answer:
      "Yes — our seed paper is completely plantable and biodegradable. Once used, it can be planted in soil, watered regularly, and it naturally grows into plants instead of creating waste.",
  },
  {
    category: "Product",
    question: "Which seeds are used in seed paper?",
    answer:
      "We offer multiple seed options depending on availability and season, including basil, chia, marigold, tomato, mint, coriander, sunflower, and mixed wildflower seeds. Custom seed selection is also possible for bulk orders.",
  },
  {
    category: "Product",
    question: "Will it germinate in Pakistani weather?",
    answer:
      "Absolutely. Our seed paper is tested for Pakistani climate conditions and works well in most cities when planted with the right balance of sunlight, soil, and proper watering.",
  },
  {
    category: "Product",
    question: "Is it durable enough for packaging?",
    answer:
      "Yes — our seed paper is suitable for lightweight packaging, tags, cards, sleeves, inserts, and promotional materials. We also offer different GSM/thickness options depending on the application.",
  },
  {
    category: "Product",
    question: "Is your plantable paper tree-free?",
    answer:
      "Yes. Seed paper is made from post-consumer and post-industrial paper collected from local offices and schools.",
  },
  {
    category: "Product",
    question: "What is the shelf life of seed paper?",
    answer:
      "For best germination results, seed paper should be planted within 2 years. It will still grow beyond that, but germination rates decline after that period. Store in a cool, dry place to preserve germination rates as long as possible.",
  },
  {
    category: "Printing",
    question: "Can you print my logo?",
    answer:
      "Yes, we provide fully customized printing including logos, brand colors, QR codes, and complete packaging designs.",
  },
  {
    category: "Printing",
    question: "What printing method do you recommend for plantable seed paper?",
    answer:
      "We recommend offset printing (for bulk orders), UV flatbed, inkjet printing, screen printing, letterpress printing, and UV DTF.",
  },
  {
    category: "Printing",
    question: "What kinds of pen can be used when writing on plantable paper?",
    answer:
      "Most writing instruments perform well on plantable seed paper, including ballpoint pens, rollerball pens, and calligraphy markers. We recommend testing any new pen on a sample sheet before starting your project to ensure the desired results.",
  },
  {
    category: "Ordering",
    question: "What is the MOQ?",
    answer:
      "MOQ depends on the product type and customization, but generally starts from low quantities — i.e. 300 A4 sheets for startups and SMEs — while larger volumes are available for corporate orders.",
  },
  {
    category: "Ordering",
    question: "What is the price range?",
    answer:
      "Pricing varies based on size, printing, GSM, seed type, and quantity. We offer economical solutions for both small businesses and large-scale corporate campaigns. Order a sample kit or request a quote for exact pricing.",
  },
  {
    category: "Ordering",
    question: "Can I see samples?",
    answer:
      "Yes, sample packs are available so you can check the paper quality, printing, and germination before placing a bulk order. The sample kit cost is adjusted against your bulk order.",
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
      "Standard production usually takes a few working days after design approval, while urgent orders can also be accommodated depending on quantity and customization requirements.",
  },
  {
    category: "Company",
    question: "Have brands used this before?",
    answer:
      "Yes — many corporate brands, event companies, FMCGs, and environmentally conscious businesses in Pakistan have already used our seed paper for packaging, invitations, marketing campaigns, and giveaways. See our work for examples.",
  },
  {
    category: "Company",
    question: "Where is your office located?",
    answer: "We operate from Lahore, Pakistan.",
  },
];

export const faqCategories = [
  "Product",
  "Printing",
  "Ordering",
  "Logistics",
  "Company",
] as const;
