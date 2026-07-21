"use client";

import { FilePlus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { toast } from "sonner";
import type { ButtonProps } from "@/components/ui/button";
import type { CartItem } from "@/components/cart/cart-context";

type Props = {
  item: { slug: string; name: string; price?: number; image?: string };
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  label?: string;
};

export function AddToQuoteButton({
  item,
  size = "default",
  variant = "default",
  className,
  label = "Add to quote",
}: Props) {
  const { add } = useCart();
  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() => {
        add(item);
        toast.success(`${item.name} added to your quote list`);
      }}
    >
      <FilePlus className="h-4 w-4" />
      {label}
    </Button>
  );
}

type CartProps = {
  /** A fully-priced line. `price` is per unit; `qty` defaults to 1. */
  item: Omit<CartItem, "qty" | "id"> & { price: number };
  qty?: number;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  label?: string;
  disabled?: boolean;
};

/**
 * Real add-to-cart, for the fixed-price SKUs that can be paid for online.
 * Everything custom or bulk still uses AddToQuoteButton above.
 */
export function AddToCartButton({
  item,
  qty = 1,
  size = "default",
  variant = "default",
  className,
  label = "Add to cart",
  disabled,
}: CartProps) {
  const { add } = useCart();
  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={() => {
        add(item, qty);
        const detail = item.variantLabel
          ? ` (${item.variantLabel}) × ${qty.toLocaleString("en-PK")}`
          : qty > 1
            ? ` × ${qty.toLocaleString("en-PK")}`
            : "";
        toast.success(`${item.name}${detail} added to your cart`);
      }}
    >
      <ShoppingBag className="h-4 w-4" />
      {label}
    </Button>
  );
}
