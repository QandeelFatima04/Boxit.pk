"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/submit-lead";
import { whatsappLink } from "@/lib/site";
import { track } from "@/lib/track";
import { useCart } from "@/components/cart/cart-context";

type Step = { key: string; question: string; options: string[] };

const STEPS: Step[] = [
  {
    key: "businessType",
    question: "What type of business are you?",
    options: [
      "Fashion / retail",
      "Cosmetics / wellness",
      "Food / FMCG",
      "Corporate / CSR",
      "Wedding / event",
      "Other",
    ],
  },
  {
    key: "product",
    question: "What do you need packaging for?",
    options: [
      "Shopping bags",
      "Tags / inserts",
      "Cards / stationery",
      "Calendars / diaries",
      "Invitations / giveaways",
      "Not sure yet",
    ],
  },
  {
    key: "quantity",
    question: "Roughly how many do you need?",
    options: ["300–500", "500–2,000", "2,000+", "Not sure"],
  },
  {
    key: "material",
    question: "Which material are you after?",
    options: [
      "Plantable seed paper",
      "Biodegradable (no seeds)",
      "Need guidance",
    ],
  },
  {
    key: "customization",
    question: "What customization do you need?",
    options: ["Printing only", "Embossing / finishing", "Both", "Plain / unsure"],
  },
  {
    key: "timeline",
    question: "When do you need it?",
    options: ["Within 1 week", "2–4 weeks", "Flexible"],
  },
  {
    key: "sampleKit",
    question: "Want a sample kit before bulk?",
    options: ["Yes, send a sample kit", "No, quote me directly"],
  },
];

export function PackagingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const { items, clear } = useCart();

  // Anything the visitor added via "Add to quote" must ride along with the
  // brief — otherwise those items are silently dropped from the request.
  const quoteListSummary = items
    .map((i) => {
      const size = i.variantLabel ? ` (${i.variantLabel})` : "";
      return `${i.name}${size}${i.qty > 1 ? ` ×${i.qty}` : ""}`;
    })
    .join(", ");

  const isContactStep = step === STEPS.length;
  const progress = Math.round((step / (STEPS.length + 1)) * 100);

  function choose(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  function buildWhatsAppText() {
    const lines = STEPS.map((s) => `${s.question} ${answers[s.key] ?? "—"}`);
    if (quoteListSummary) lines.push(`Items in my quote list: ${quoteListSummary}`);
    return `Hi Boxit, here's my packaging brief:\n${lines.join("\n")}\nName: ${contact.name}`;
  }

  async function finish() {
    if (!contact.phone && !contact.email) return;
    setSubmitting(true);
    const waText = buildWhatsAppText();
    const res = await submitLead({
      type: "quiz",
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      businessType: answers.businessType,
      // Fold the quote list into the product line so it reaches the sales inbox.
      product: [answers.product, quoteListSummary].filter(Boolean).join(" | "),
      quantity: answers.quantity,
      timeline: answers.timeline,
      answers: {
        ...answers,
        ...(quoteListSummary ? { quoteList: quoteListSummary } : {}),
      },
    });
    setSubmitting(false);
    // Only empty the list once the brief is actually recorded, so a failed
    // submit doesn't lose the items the visitor picked.
    if (res.ok) clear();
    setDone(whatsappLink(waText));
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-secondary/40 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-bold">
          Your brief is ready
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We have your details. Send the brief over on WhatsApp and we&apos;ll
          come back with pricing and sample options.
        </p>
        <a
          href={done}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { source: "quiz-finish" })}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1ebe5b]"
        >
          Send my brief on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8">
      {/* Progress */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>

      {!isContactStep ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Step {step + 1} of {STEPS.length + 1}
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold">
            {STEPS[step].question}
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {STEPS[step].options.map((opt) => (
              <button
                key={opt}
                onClick={() => choose(STEPS[step].key, opt)}
                className={cn(
                  "rounded-xl border p-4 text-left text-sm font-medium transition hover:border-brand hover:bg-secondary/50",
                  answers[STEPS[step].key] === opt && "border-brand bg-secondary",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          {step > 0 && (
            <Button
              variant="ghost"
              className="mt-6"
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Last step
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold">
            Where should we send your quote?
          </h3>

          {items.length > 0 && (
            <div className="mt-5 rounded-lg border border-brand/30 bg-secondary/40 p-4">
              <p className="text-sm font-semibold">Items in your quote list</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {items.map((i) => (
                  <li key={i.id}>
                    {i.name}
                    {i.variantLabel ? ` (${i.variantLabel})` : ""}
                    {i.qty > 1 ? ` × ${i.qty}` : ""}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                These are included with your brief.
              </p>
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="q-name">Name</Label>
              <Input
                id="q-name"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-phone">Phone / WhatsApp</Label>
                <Input
                  id="q-phone"
                  value={contact.phone}
                  onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="q-email">Email (optional)</Label>
                <Input
                  id="q-email"
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Provide a phone or email so we can reach you.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button
              size="lg"
              onClick={finish}
              disabled={submitting || (!contact.phone && !contact.email)}
            >
              {submitting ? "Submitting…" : "Get my quote"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
