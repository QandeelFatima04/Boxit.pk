import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile exists in the home dir).
  turbopack: {
    root: path.resolve("."),
  },
  images: {
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
