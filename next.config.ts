import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile exists in the home dir).
  turbopack: {
    root: path.resolve("."),
  },
  images: {
    // AVIF first, WebP as the fallback: on this catalogue AVIF lands roughly
    // 25-30% smaller than the WebP the optimiser served before. Order matters
    // — the first entry matching the browser's Accept header wins.
    formats: ["image/avif", "image/webp"],
    // The catalogue photos are immutable once published, so let the optimiser
    // keep each derivative for a year instead of re-encoding on cache misses.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      { source: "/seed-paper-for-csr", destination: "/csr-corporate-gifts", permanent: true },
      { source: "/eco-corporate-gifts", destination: "/csr-corporate-gifts", permanent: true },
      { source: "/seed-paper-for-events", destination: "/weddings-events", permanent: true },
      { source: "/plantable-tags", destination: "/plantable-brand-materials", permanent: true },
      { source: "/sustainable-packaging", destination: "/plantable-brand-materials", permanent: true },
      { source: "/corporate-gifting", destination: "/csr-corporate-gifts", permanent: true },
    ];
  },
};

export default nextConfig;
