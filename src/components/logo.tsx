import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Intrinsic size of the trimmed artwork. Passed to next/image so the aspect
// ratio is locked and the box is reserved before the file loads; the rendered
// size comes from the height utility below, with width left automatic.
const LOGO_W = 374;
const LOGO_H = 512;

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="Boxit home"
    >
      <Image
        src="/images/brand/boxit-logo.webp"
        alt=""
        width={LOGO_W}
        height={LOGO_H}
        // Slightly smaller on phones so the mark never crowds the 64px bar.
        className="h-8 w-auto sm:h-9"
        // Eager, not preloaded: the mark is above the fold on every page, but
        // the hero photo is the LCP element and should keep the preload slot.
        // (`priority` is deprecated as of Next 16.)
        loading="eager"
      />
      {withText && (
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          Boxit
        </span>
      )}
    </Link>
  );
}
