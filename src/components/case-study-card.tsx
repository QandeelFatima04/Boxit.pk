"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { CaseStudy } from "@/content/types";

export function CaseStudyCard({ caseStudy: cs }: { caseStudy: CaseStudy }) {
  // Image set: an explicit gallery (main image first) or just the single image.
  const gallery =
    cs.gallery && cs.gallery.length > 0
      ? cs.gallery
      : cs.image
        ? [cs.image]
        : [];
  const [active, setActive] = useState(0);
  const activeSrc = gallery[active];
  const href = `/work/${cs.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5">
      {activeSrc && (
        <Link
          href={href}
          className="relative aspect-[4/3] overflow-hidden bg-secondary/30"
        >
          <Image
            key={activeSrc}
            src={activeSrc}
            alt={`${cs.client} — ${cs.product}`}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-7">
        {gallery.length > 1 && (
          <div className="mb-4 flex gap-2">
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

        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {cs.clientType}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-bold">
          <Link href={href} className="hover:text-brand">
            {cs.client}
          </Link>
        </h2>
        <p className="mt-3 flex-1 text-sm text-muted-foreground">{cs.result}</p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2"
        >
          Read the story <ArrowRight className="h-4 w-4 transition-all" />
        </Link>
      </div>
    </div>
  );
}
