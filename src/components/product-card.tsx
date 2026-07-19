"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AddToQuoteButton } from "@/components/add-to-cart-button";
import type { Product } from "@/content/types";

function Placeholder({ name }: { name: string }) {
  // No broken images — a branded gradient with a sprout mark stands in.
  return (
    <div className="relative grid h-full w-full place-items-center bg-gradient-to-br from-secondary via-accent to-cream">
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-brand/70" fill="none" aria-hidden>
        <path
          d="M12 21v-7m0 0c0-3 2.5-5.5 6-5.5 0 3.5-2.7 5.5-6 5.5Zm0 0c0-2.6-2.2-4.8-5.2-4.8C6.8 11.4 8.9 14 12 14Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">{name}</span>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  // Image set: an explicit gallery (main image first) or just the single image.
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : product.image
        ? [product.image]
        : [];
  const [active, setActive] = useState(0);
  const activeSrc = gallery[active];

  return (
    <div
      id={product.slug}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5 scroll-mt-28"
    >
      <Link
        href={`/products/${product.slug}`}
        className={`relative ${
          product.imageFrame === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"
        } overflow-hidden bg-secondary/30`}
      >
        {activeSrc ? (
          <Image
            key={activeSrc}
            src={activeSrc}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <Placeholder name={product.name} />
        )}
        {product.featured && (
          <Badge className="absolute left-3 top-3 bg-gold text-gold-foreground">
            Popular
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {gallery.length > 1 && (
          <div className="mb-3 flex gap-2">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={active === i}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
                  active === i
                    ? "border-brand"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold leading-tight">
            <Link href={`/products/${product.slug}`} className="hover:text-brand">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {product.moq && <span>Min. order: {product.moq}</span>}
          {product.leadTime && <span>{product.leadTime}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="text-sm font-semibold text-brand">Priced to your brief</span>
          <AddToQuoteButton
            size="sm"
            item={{
              slug: product.slug,
              name: product.name,
              image: product.image,
            }}
          />
        </div>
      </div>
    </div>
  );
}
