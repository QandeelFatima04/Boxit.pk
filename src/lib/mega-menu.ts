// Menu model for the Products mega menu.
//
// Built on the server from the content layer and handed to <SiteHeader /> as a
// prop, so the full 46-product catalogue (long descriptions, variants, SEO
// blocks) never ships to the browser — only the handful of fields the menu
// draws. Categories keep the order declared in `categories.ts`.

import { getAllCategories, getProductsByCategory } from "@/lib/content";

export type MegaMenuProduct = {
  name: string;
  href: string;
};

export type MegaMenuCategory = {
  slug: string;
  name: string;
  description: string;
  /** `/products/category/<slug>` — the real category route. */
  href: string;
  products: MegaMenuProduct[];
  /** Thumbnail for the panel's right column; undefined falls back to a placeholder. */
  image?: string;
  imageAlt: string;
};

/**
 * The category thumbnail. `Category.image` is declared on the type but unset
 * across the board, so the featured product's photo stands in — it is the one a
 * merchandiser already chose to lead with — and any product photo after that.
 */
function categoryImage(products: ReturnType<typeof getProductsByCategory>) {
  const featured = products.find((p) => p.featured && p.image);
  return (featured ?? products.find((p) => p.image))?.image;
}

export function buildProductsMenu(): MegaMenuCategory[] {
  return getAllCategories().map((category) => {
    const products = getProductsByCategory(category.slug);
    return {
      slug: category.slug,
      name: category.name,
      description: category.description,
      href: `/products/category/${category.slug}`,
      products: products.map((product) => ({
        name: product.name,
        href: `/products/${product.slug}`,
      })),
      image: category.image ?? categoryImage(products),
      imageAlt: `${category.name} by Boxit`,
    };
  });
}
