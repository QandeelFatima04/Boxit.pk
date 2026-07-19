"use client";

import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { toast } from "sonner";
import type { ButtonProps } from "@/components/ui/button";

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
