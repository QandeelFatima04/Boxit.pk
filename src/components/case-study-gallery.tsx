"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Auto-advancing crossfade slideshow for a case-study tile.
 * Shows one image at a time and rotates to the next every few seconds.
 */
export function CaseStudyGallery({
  images,
  alt,
  interval = 3500,
  fit = "cover",
  className = "relative mt-4 aspect-[4/3] overflow-hidden rounded-lg border bg-secondary/30",
}: {
  images: string[];
  alt: string;
  interval?: number;
  /** How the image sits in its frame. "contain" shows the full image uncropped. */
  fit?: "cover" | "contain";
  className?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className={className}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} — image ${i + 1}`}
          fill
          className={`${fitClass} transition-opacity duration-700 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 1024px) 100vw, 33vw"
          priority={i === 0}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-4 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
