"use client";

// Reusable image-gallery tile for a product grid (main image + thumbnails).
// Robust to missing files: if an image 404s (even before hydration, caught via
// the ref check), it swaps to a branded fallback so the tile never looks broken.
// Drop the real files into /public/images/products/ and they appear automatically.

import { useState } from "react";

export type GalleryImage = { src: string; alt: string };

function Fallback() {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-secondary via-accent to-cream">
      <svg viewBox="0 0 24 24" className="h-1/3 w-1/3 max-h-10 max-w-10 text-brand/70" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M4 13c3-2 5 2 8 0s5-2 8 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** <img> that falls back gracefully, catching errors that fire before hydration. */
function SafeImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return <Fallback />;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      // Catches loads that already failed before React attached the handler.
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setBroken(true);
      }}
      onError={() => setBroken(true)}
    />
  );
}

export function GalleryTile({
  title,
  subtitle,
  images,
  badge = "Gallery",
  defaultIndex = 0,
}: {
  title: string;
  subtitle: string;
  images: GalleryImage[];
  badge?: string;
  /** Which image to show first (0-based). Defaults to the first image. */
  defaultIndex?: number;
}) {
  const [active, setActive] = useState(defaultIndex);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImg
          key={images[active].src}
          src={images[active].src}
          alt={images[active].alt}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold leading-tight">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

        {images.length > 1 && (
          <div className="mt-auto flex gap-2 pt-4">
            {images.map((g, i) => (
              <button
                key={g.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={active === i}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                  active === i
                    ? "border-brand"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <SafeImg src={g.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
