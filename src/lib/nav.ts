export type NavLink = { label: string; href: string };

export const solutionsNav: NavLink[] = [
  { label: "Seed Paper Stock", href: "/seed-paper-stock" },
  { label: "CSR & Corporate Gifts", href: "/csr-corporate-gifts" },
  { label: "Plantable Brand Materials", href: "/plantable-brand-materials" },
  { label: "Weddings & Events", href: "/weddings-events" },
];

// The first six show in the desktop bar (see site-header); the mobile sheet lists all.
export const mainNav: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "Sample Kit", href: "/sample-kit" },
  { label: "Our Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  solutions: solutionsNav,
  explore: [
    { label: "Products", href: "/products" },
    { label: "Cost Estimator", href: "/estimator" },
    { label: "Sample Kit", href: "/sample-kit" },
    { label: "Our Work", href: "/work" },
    { label: "Request a quote", href: "/quote" },
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
