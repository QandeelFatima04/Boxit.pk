// Single source of truth for brand/contact/config.
// Values marked TODO are placeholders confirmed during build (see plan "Open items").

export const site = {
  name: "Boxit",
  legalName: "Boxit Pakistan",
  tagline: "Pakistan's plantable seed paper manufacturer",
  heroHeadline:
    "Custom Plantable Seed Paper Products for CSR Campaigns, Events, Retail & Sustainable Brand Communication",
  heroSub:
    "Boxit manufactures plantable, seed-embedded paper in Lahore and turns it into your calendars, gift boxes, hang tags, invitations, business cards and giveaways — with your logo, your message, and seeds inside every sheet. When it's done its job, it grows into plants instead of going in the bin.",
  description:
    "Pakistan's first plantable seed-paper maker. Custom CSR gifts, event giveaways, branded hang tags, business cards and wholesale paper stock — made from recycled paper with seeds embedded inside.",
  url: "https://boxit.pk",
  // Contact — current site shows +92 332 3333654
  phoneDisplay: "+92 332 3333654",
  phoneE164: "+923323333654",
  whatsappNumber: "923323333654", // wa.me format, no +
  email: "info@boxit.pk",
  city: "Lahore",
  country: "Pakistan",
  address: "Lahore, Pakistan", // TODO confirm full address
  social: {
    instagram: "https://www.instagram.com/boxit.pk/",
    instagramAlt: "https://www.instagram.com/boxit.pk.co/",
    facebook: "https://www.facebook.com/boxit.pk",
    linkedin: "https://www.linkedin.com/company/boxit-pk",
  },
  // Analytics — fill from env at runtime (see analytics.tsx)
} as const;

// Default pre-filled WhatsApp message; pages can override the `text`.
export function whatsappLink(text?: string): string {
  const msg =
    text ??
    "Hi Boxit, I'm interested in plantable seed paper products. Can you share pricing and sample options?";
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export function telLink(): string {
  return `tel:${site.phoneE164}`;
}
