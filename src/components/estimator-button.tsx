import Link from "next/link";
import { Calculator } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Prominent CTA linking to the instant cost estimator.
 * Reused anywhere a quote / sample CTA appears so buyers can self-serve a
 * ballpark before requesting an exact quote.
 */
export function EstimatorButton({
  label = "Estimate cost",
  variant = "outline",
  size = "lg",
  className,
}: {
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href="/estimator">
        <Calculator className="h-4 w-4" /> {label}
      </Link>
    </Button>
  );
}
