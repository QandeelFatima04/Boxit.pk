"use client";

import { useState } from "react";
import { Download, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitLead } from "@/lib/submit-lead";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Gated lead magnet (TOFU). A visitor gives an email to unlock a downloadable
 * guide. On success we record the lead (type "lead_magnet" → `catalogue_download`
 * analytics event) via the existing /api/lead pipeline, email them the link as a
 * fallback, then reveal the download and start it automatically.
 *
 * This is a soft gate: the value (a real PDF) is delivered immediately on submit,
 * we don't withhold it or make them wait for a human — the email is the only ask.
 */

// The CSR guide is the default magnet; the props allow reusing this for others.
const DEFAULT_TITLE = "The Plantable CSR Gifting Guide";
const DEFAULT_FILE = "/downloads/boxit-plantable-csr-gifting-guide.pdf";
const DEFAULT_SLUG = "csr-gifting-guide";

export function LeadMagnet({
  title = DEFAULT_TITLE,
  file = DEFAULT_FILE,
  slug = DEFAULT_SLUG,
  source = "lead-magnet",
  className,
  bullets = [
    "10 plantable CSR gift ideas that work in Pakistan",
    "How to design a campaign people actually plant",
    "GSM guide, MOQs, lead times and a planning checklist",
  ],
}: {
  title?: string;
  file?: string;
  slug?: string;
  source?: string;
  className?: string;
  bullets?: string[];
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function startDownload() {
    // Programmatic click so the file downloads without leaving the page.
    const a = document.createElement("a");
    a.href = file;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!emailValid || loading) return;
    setLoading(true);
    const res = await submitLead({
      type: "lead_magnet",
      email: email.trim(),
      product: title,
      answers: {
        source,
        magnet: slug,
        // Absolute URL so the emailed fallback link works from any inbox.
        download: `${site.url}${file}`,
      },
    });
    setLoading(false);
    if (res.ok) {
      setUnlocked(true);
      startDownload();
      toast.success("Your guide is downloading — we've emailed you a copy too.");
    } else {
      toast.error(
        res.error ??
          "We couldn't start your download. Please try again, or message us on WhatsApp.",
      );
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border bg-secondary/40",
        className,
      )}
    >
      <div className="grid gap-0 sm:grid-cols-[1fr_1.1fr]">
        {/* Cover / value side */}
        <div className="flex flex-col justify-center gap-4 bg-primary p-6 text-primary-foreground sm:p-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <FileText className="h-3.5 w-3.5" /> Free guide · PDF
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight">
            {title}
          </h2>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Capture / unlock side */}
        <div className="flex flex-col justify-center p-6 sm:p-8">
          {unlocked ? (
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-brand">
                <Check className="h-4 w-4" /> Your guide is ready.
              </p>
              <p className="text-sm text-muted-foreground">
                The download should have started. We&apos;ve also emailed you the
                link — if it didn&apos;t start, use the button below.
              </p>
              <Button asChild size="lg">
                <a href={file} download>
                  <Download className="h-4 w-4" /> Download the guide
                </a>
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">
                Get it free
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send the guide straight to your
                inbox — and start the download now.
              </p>
              <form
                onSubmit={onSubmit}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
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
                  {loading ? "Preparing…" : "Get the guide"}
                </Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                No spam. Unsubscribe any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
