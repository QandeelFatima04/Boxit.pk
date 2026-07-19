// Single source of truth for brand/contact/config.
// Values marked TODO are placeholders confirmed during build (see plan "Open items").

export const site = {
  name: "Boxit",
  legalName: "Boxit Pakistan",
  tagline: "Pakistan's plantable seed paper manufacturer",
  heroHeadline: "Custom plantable seed paper, made in Pakistan",
  heroSub:
    "We manufacture seed-embedded paper and print it into your calendars, gift boxes, hang tags, invitations, business cards and giveaways. Your logo, your message, real seeds in every sheet. When the campaign is over, the paper goes into soil and grows.",
  description:
    "Pakistan's first plantable seed-paper maker. Custom CSR gifts, event giveaways, branded hang tags, business cards and wholesale paper stock, made from recycled paper with seeds embedded inside.",
  url: "https://boxit.pk",
  // Contact — current site shows +92 332 3333654
  phoneDisplay: "+92 332 3333654",
  phoneE164: "+923323333654",
  whatsappNumber: "923323333654", // wa.me format, no +
  email: "info@boxit.pk",
  city: "Pakistan",
  country: "Pakistan",
  address: "Pakistan", // City deliberately omitted sitewide (owner request)
  social: {
    instagram: "https://www.instagram.com/boxit.pk_plantable_products/",
    facebook: "https://www.facebook.com/boxit.pk",
    linkedin: "https://www.linkedin.com/company/boxit-pk",
  },
  // Analytics — fill from env at runtime (see analytics.tsx)
} as const;

// Default pre-filled WhatsApp message; pages can override the `text`.
export function whatsappLink(text?: string): string {
  const msg =
    text ??
    "Hi Boxit, I'm interested in your plantable seed paper products. Could you share pricing and sample options?";
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export function telLink(): string {
  return `tel:${site.phoneE164}`;
}
