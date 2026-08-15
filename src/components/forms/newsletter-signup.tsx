"use client";

import { useState } from "react";
import { Leaf, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitLead } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";

/**
 * TOFU nurture capture. A light email opt-in for visitors who are reading /
 * browsing but not ready to request samples or a quote yet — the top of the
 * funnel that the sample-kit, estimator and quote forms don't catch.
 *
 * Reuses the existing /api/lead pipeline (type "newsletter"), so every signup
 * emails the team inbox via the Mailcow relay and sends the subscriber a
 * confirmation — no new infrastructure.
 *
 * `variant`:
 *   - "card"   full-width panel for the blog index and article pages
 *   - "inline" compact single-row form for the site footer
 * `source` is passed through to attribution so we can see which placement
 * converts.
 */
export function NewsletterSignup({
  variant = "card",
  source = "newsletter",
  className,
}: {
  variant?: "card" | "inline";
  source?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailValid || loading) return;
    setLoading(true);
    const res = await submitLead({
      type: "newsletter",
      email: email.trim(),
      answers: { source },
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      toast.success("You're on the list — check your inbox.");
    } else {
      toast.error(
        res.error ??
          "We couldn't sign you up. Please try again, or message us on WhatsApp.",
      );
    }
  }

  // ── Footer variant: compact, sits in a single column ──
  if (variant === "inline") {
    return (
      <div className={className}>
        <h3 className="text-sm font-semibold text-foreground">
          Plantable ideas, now and then
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Occasional tips on seed paper, sustainable packaging and CSR gifting.
          No spam.
        </p>
        {done ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand">
            <Check className="h-4 w-4" /> Subscribed — check your inbox.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-label="Email address"
              required
              className="bg-background"
            />
            <Button type="submit" disabled={loading || !emailValid}>
              {loading ? "…" : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    );
  }

  // ── Card variant: full panel for blog surfaces ──
  return (
    <div
      className={cn(
        "rounded-3xl border bg-secondary/40 p-6 sm:p-10",
        className,
      )}
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-semibold text-brand">
          <Leaf className="h-3.5 w-3.5" /> Newsletter
        </span>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
          Greener packaging ideas, straight to your inbox
        </h2>
        <p className="mt-3 text-muted-foreground">
          Join brands and printers across Pakistan getting occasional guides on
          plantable seed paper, sustainable packaging and CSR gifting. No spam,
          unsubscribe any time.
        </p>

        {done ? (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-medium text-brand">
            <Check className="h-4 w-4" /> You&apos;re subscribed — check your inbox to
            confirm.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-label="Email address"
              required
              className="bg-background"
            />
            <Button type="submit" size="lg" disabled={loading || !emailValid}>
              {loading ? "Signing up…" : "Subscribe"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
