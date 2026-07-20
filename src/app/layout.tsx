import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Analytics } from "@/components/analytics";
import { UtmCapture } from "@/components/utm-capture";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationJsonLd } from "@/components/json-ld";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const heading = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "seed paper manufacturer Pakistan",
    "plantable packaging Pakistan",
    "eco corporate gifts Pakistan",
    "plantable wedding invitations",
    "seed paper business cards",
    "wholesale seed paper stock",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/images/products/artistic-sheets-1.jpg",
        width: 1200,
        height: 630,
        alt: "Boxit plantable seed paper products — CSR gifts, greeting cards, bags and calendars",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

// Emits `width=device-width, initial-scale=1, viewport-fit=cover`.
// `viewport-fit=cover` is required for the CSS `env(safe-area-inset-*)` values
// (used by the sticky WhatsApp button) to resolve to real insets on notched devices.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${heading.variable} h-full scroll-smooth`}
    >
      <body className="flex min-h-full flex-col">
        <Analytics />
        <UtmCapture />
        <OrganizationJsonLd />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <WhatsAppButton variant="sticky" />
        </CartProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
