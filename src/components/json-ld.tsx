import { site } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness"],
        name: site.legalName,
        url: site.url,
        description: site.description,
        telephone: site.phoneE164,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          addressCountry: "PK",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phoneE164,
          contactType: "customer service",
          availableLanguage: ["English", "Urdu"],
          contactOption: "TollFree",
        },
        areaServed: "PK",
        sameAs: [
          site.social.instagram,
          site.social.facebook,
          site.social.linkedin,
        ],
      }}
    />
  );
}

export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.question,
          acceptedAnswer: { "@type": "Answer", text: i.answer },
        })),
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  slug,
}: {
  name: string;
  description: string;
  image?: string;
  price?: number;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image: image ? `${site.url}${image}` : undefined,
        brand: { "@type": "Brand", name: site.name },
        url: `${site.url}/products/${slug}`,
        ...(price
          ? {
              offers: {
                "@type": "Offer",
                priceCurrency: "PKR",
                price,
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${site.url}${it.url}`,
        })),
      }}
    />
  );
}
