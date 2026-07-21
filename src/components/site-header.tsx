"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
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
import { ProductsMegaMenu } from "@/components/nav/products-mega-menu";
import { ProductsMobileNav } from "@/components/nav/products-mobile-nav";
import type { MegaMenuCategory } from "@/lib/mega-menu";

export function SiteHeader({
  productsMenu,
}: {
  productsMenu: MegaMenuCategory[];
}) {
  const [open, setOpen] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
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

  // Stable identity: the menu reports its open state from an effect, so a fresh
  // callback each render would re-fire it on every render.
  const handleMegaOpenChange = useCallback(
    (value: boolean) => setMegaOpen(value),
    [],
  );

  // The mega menu is a white panel; leaving the bar transparent behind it would
  // strand the nav text over the hero photo, so an open menu forces the solid
  // treatment. The hero itself is untouched.
  const isGlass = isHomepage && !scrolled && !megaOpen;

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
              Solutions
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
          <ProductsMegaMenu
            categories={productsMenu}
            glass={isGlass}
            onOpenChange={handleMegaOpenChange}
          />
          {/* Products now has its own trigger above, so it is dropped here. */}
          {mainNav
            .slice(0, 6)
            .filter((link) => link.href !== "/products")
            .map((link) => (
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
            {/* The category accordion can outgrow short viewports — let it scroll. */}
            <SheetContent side="right" className="w-80 overflow-y-auto pb-8">
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
                  Products
                </p>
                <ProductsMobileNav
                  categories={productsMenu}
                  onNavigate={() => setOpen(false)}
                />

                <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Explore
                </p>
                {/* Products is covered by the accordion above. */}
                {mainNav
                  .filter((link) => link.href !== "/products")
                  .map((link) => (
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
