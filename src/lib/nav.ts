export type NavLink = { label: string; href: string };

export const solutionsNav: NavLink[] = [
  { label: "Seed Paper Stock", href: "/seed-paper-stock" },
  { label: "CSR & Corporate Gifts", href: "/csr-corporate-gifts" },
  { label: "Plantable Brand Materials", href: "/plantable-brand-materials" },
  { label: "Weddings & Events", href: "/weddings-events" },
];

export const mainNav: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "Sample Kit", href: "/sample-kit" },
  { label: "Our Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  solutions: solutionsNav,
  explore: [
    { label: "Products", href: "/products" },
    { label: "Sample Kit", href: "/sample-kit" },
    { label: "Our Work", href: "/work" },
    { label: "Request a Quote", href: "/quote" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};
