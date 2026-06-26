import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          {/* leaf / sprout mark */}
          <path
            d="M12 21v-7m0 0c0-3 2.5-5.5 6-5.5 0 3.5-2.7 5.5-6 5.5Zm0 0c0-2.6-2.2-4.8-5.2-4.8C6.8 11.4 8.9 14 12 14Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withText && (
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          Boxit
        </span>
      )}
    </Link>
  );
}
