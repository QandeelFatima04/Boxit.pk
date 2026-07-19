"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Calculator, Menu, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, solutionsNav } from "@/lib/nav";
import { useCart } from "@/components/cart/cart-context";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    // Non-homepage pages always show solid header
    if (!isHomepage) {
      setScrolled(true);
      return;
    }
    const handler = () => setScrolled(window.scrollY > 80);
    handler(); // run immediately on mount
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isHomepage]);

  const isGlass = isHomepage && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isGlass
          ? "border-transparent bg-transparent"
          : "border-b border-border/60 bg-background/90 backdrop-blur"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo — white text when over hero, brand-colored otherwise */}
        <div className={isGlass ? "[&_*]:!text-white [&_svg_*]:!fill-white" : ""}>
          <Logo />
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          <div className="group relative">
            <button
              className={`text-sm font-medium transition ${
                isGlass ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              What we do
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-xl border bg-popover p-2 shadow-lg">
                {solutionsNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-2 text-sm text-popover-foreground transition hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {mainNav.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                isGlass ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Open quote list"
            title="Your quote list"
            onClick={() => setCartOpen(true)}
            className={`relative grid h-10 w-10 place-items-center rounded-full transition ${
              isGlass ? "text-white hover:bg-white/15" : "hover:bg-muted"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[11px] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className={`hidden lg:inline-flex transition-all ${
              isGlass
                ? "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60"
                : ""
            }`}
          >
            <Link href="/estimator">
              <Calculator className="h-4 w-4" /> Estimate cost
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className={`hidden sm:inline-flex transition-all ${
              isGlass
                ? "bg-white text-black hover:bg-white/90 border-0 shadow-none"
                : ""
            }`}
          >
            <Link href="/quote">Request a quote</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={`grid h-10 w-10 place-items-center rounded-full transition lg:hidden ${
                isGlass ? "text-white hover:bg-white/15" : "hover:bg-muted"
              }`}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Solutions
                </p>
                {solutionsNav.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    {link.label}
                  </Link>
                ))}
                <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Explore
                </p>
                {mainNav.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                    {link.label}
                  </Link>
                ))}
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/estimator" onClick={() => setOpen(false)}>
                    <Calculator className="h-4 w-4" /> Estimate cost
                  </Link>
                </Button>
                <Button asChild className="mt-2">
                  <Link href="/quote" onClick={() => setOpen(false)}>Request a quote</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
