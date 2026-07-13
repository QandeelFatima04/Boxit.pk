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
  return (
    <div
      id={product.slug}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:shadow-lg hover:shadow-black/5 scroll-mt-28"
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold leading-tight">
            <Link href={`/products/${product.slug}`} className="hover:text-brand">
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {product.moq && <span>MOQ: {product.moq}</span>}
          {product.leadTime && <span>{product.leadTime}</span>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="text-sm font-semibold text-brand">Custom-quoted</span>
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
