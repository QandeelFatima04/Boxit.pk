import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import {
  getAllProducts,
  getAllCategories,
  getAllSegments,
  getCaseStudies,
  getBlogPosts,
} from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = [
    "",
    "/products",
    "/sample-kit",
    "/estimator",
    "/quote",
    "/work",
    "/about",
    "/faq",
    "/blog",
    "/contact",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
  ];

  const routes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r}`,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));

  for (const s of getAllSegments())
    routes.push({ url: `${base}/${s.slug}`, priority: 0.9 });
  for (const p of getAllProducts())
    routes.push({ url: `${base}/products/${p.slug}`, priority: 0.6 });
  for (const c of getAllCategories())
    routes.push({ url: `${base}/products/category/${c.slug}`, priority: 0.5 });
  for (const w of getCaseStudies())
    routes.push({ url: `${base}/work/${w.slug}`, priority: 0.5 });
  for (const b of getBlogPosts())
    routes.push({ url: `${base}/blog/${b.slug}`, priority: 0.5 });

  return routes;
}
