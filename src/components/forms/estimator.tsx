"use client";

import { useMemo, useState } from "react";
import { Calculator, Check, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/format";
import { submitLead } from "@/lib/submit-lead";
import { WhatsAppButton } from "@/components/whatsapp-button";
import {
  estimate,
  formats,
  materials,
  printingOptions,
  sizes,
  finishingOptions,
} from "@/content/estimator";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function Estimator() {
  const [format, setFormat] = useState(formats[0].key);
  const [quantity, setQuantity] = useState(formats[0].minQty);
  const [material, setMaterial] = useState(materials[0].key);
  const [printing, setPrinting] = useState(printingOptions[0].key);
  const [size, setSize] = useState(sizes[0].key);
  const [finishing, setFinishing] = useState<string[]>([]);

  // Lead capture (optional — mirrors the quiz's "send me this" flow).
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const result = useMemo(
    () => estimate({ format, quantity, material, printing, size, finishing }),
    [format, quantity, material, printing, size, finishing],
  );

  const fmt = formats.find((f) => f.key === format)!;
  // "Biodegradable (no seeds)" only applies to raw paper sheets; everything else
  // is plantable seed paper. Plantable is always available.
  const availableMaterials = materials.filter(
    (m) => m.key === "seed-paper" || fmt.allowNoSeeds,
  );
  const materialLabel = materials.find((m) => m.key === material)?.label ?? "";
  const printingLabel = printingOptions.find((p) => p.key === printing)?.label ?? "";
  const sizeLabel = sizes.find((s) => s.key === size)?.label ?? "";
  const finishingLabels = finishing
    .map((k) => finishingOptions.find((o) => o.key === k)?.label)
    .filter(Boolean)
    .join(", ");

  // Switching product resets the quantity to that product's sheet MOQ.
  function changeFormat(key: string) {
    setFormat(key);
    const next = formats.find((f) => f.key === key);
    if (next) {
      setQuantity(next.minQty);
      // Drop the no-seeds material if the new product doesn't support it.
      if (!next.allowNoSeeds && material !== "seed-paper") {
        setMaterial("seed-paper");
      }
    }
  }

  function toggleFinishing(key: string) {
    setFinishing((cur) =>
      cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key],
    );
  }

  function buildSummary() {
    if (!result) return "";
    return [
      `Product: ${fmt.label}`,
      `Quantity: ${result.quantity.toLocaleString("en-PK")} ${result.unitNoun}`,
      `Size: ${sizeLabel}`,
      `Material: ${materialLabel}`,
      `Printing: ${printingLabel}`,
      finishingLabels ? `Finishing: ${finishingLabels}` : `Finishing: none`,
      `Estimated total: ${formatPKR(result.totalLow)} – ${formatPKR(result.totalHigh)}`,
    ].join("\n");
  }

  const whatsappText = result
    ? `Hi Boxit, I used your estimator:\n${buildSummary()}\nCan you confirm an exact quote?`
    : undefined;

  // Prefill the real quote form with the chosen product.
  const quoteHref = `/quote?product=${encodeURIComponent(fmt.label)}`;

  async function sendEstimate() {
    if (!contact.phone && !contact.email) return;
    setSending(true);
    await submitLead({
      type: "quote",
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      product: fmt.label,
      quantity: String(result?.quantity ?? quantity),
      message: `Estimator request —\n${buildSummary()}`,
      answers: {
        source: "estimator",
        size: sizeLabel,
        material: materialLabel,
        printing: printingLabel,
        finishing: finishingLabels || "none",
        estimateLow: String(result?.totalLow ?? ""),
        estimateHigh: String(result?.totalHigh ?? ""),
      },
    });
    setSending(false);
    setSent(true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      {/* ---------------- Inputs ---------------- */}
      <div className="space-y-5 rounded-2xl border bg-card p-6 sm:p-8">
        <div className="space-y-1.5">
          <Label htmlFor="e-format">Product</Label>
          <select
            id="e-format"
            className={selectClass}
            value={format}
            onChange={(e) => changeFormat(e.target.value)}
          >
            {formats.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="e-qty">
            Quantity{" "}
            <span className="font-normal text-muted-foreground">
              (MOQ {fmt.minQty.toLocaleString("en-PK")})
            </span>
          </Label>
          <Input
            id="e-qty"
            type="number"
            min={fmt.minQty}
            step={50}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            onBlur={(e) =>
              setQuantity(Math.max(fmt.minQty, Number(e.target.value) || 0))
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((s) => {
              const active = size === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSize(s.key)}
                  className={cn(
                    "rounded-lg border p-3 text-center text-sm font-medium transition hover:border-brand",
                    active && "border-brand bg-secondary text-brand",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="e-material">Material</Label>
          <select
            id="e-material"
            className={selectClass}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            {availableMaterials.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="e-printing">Printing</Label>
          <select
            id="e-printing"
            className={selectClass}
            value={printing}
            onChange={(e) => setPrinting(e.target.value)}
          >
            {printingOptions.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Finishing (optional)</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {finishingOptions.map((o) => {
              const active = finishing.includes(o.key);
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => toggleFinishing(o.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-left text-sm font-medium transition hover:border-brand",
                    active && "border-brand bg-secondary",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded border",
                      active && "border-brand bg-brand text-brand-foreground",
                    )}
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  <span className="flex-1">{o.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    +{formatPKR(o.perUnitAdd)}/unit
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- Result ---------------- */}
      <div className="space-y-4 rounded-2xl border bg-secondary/30 p-6 sm:p-8 lg:sticky lg:top-24">
        <p className="eyebrow">
          <Calculator className="h-4 w-4" /> Estimated cost
        </p>

        {result && (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Estimated total</p>
              <p className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight">
                {formatPKR(result.totalLow)}{" "}
                <span className="text-muted-foreground">–</span>{" "}
                {formatPKR(result.totalHigh)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                ≈ {formatPKR(result.perUnitLow)}–{formatPKR(result.perUnitHigh)}{" "}
                per {result.unitNoun.replace(/s$/, "")}
              </p>
            </div>

            {result.belowMoq && (
              <p className="flex items-start gap-2 rounded-lg bg-gold/15 p-3 text-xs text-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                Below our minimum for this item — estimate shown for the{" "}
                {result.minQty.toLocaleString("en-PK")}-unit MOQ.
              </p>
            )}

            <p className="text-sm text-muted-foreground">{result.leadTime}</p>

            <p className="flex items-start gap-2 border-t pt-4 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Indicative only. Every project is custom — your exact quote depends
              on artwork, size and seed selection. We confirm the final price
              before any production.
            </p>

            {/* CTAs */}
            {!sent ? (
              <div className="space-y-3 border-t pt-4">
                <p className="text-sm font-semibold">Get your exact quote</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Phone / WhatsApp"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact({ ...contact, phone: e.target.value })
                    }
                  />
                  <Input
                    type="email"
                    placeholder="Email (optional)"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                  />
                </div>
                <Input
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) =>
                    setContact({ ...contact, name: e.target.value })
                  }
                />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={sendEstimate}
                  disabled={sending || (!contact.phone && !contact.email)}
                >
                  {sending ? "Sending…" : "Send me this estimate"}
                </Button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <WhatsAppButton
                    source="estimator"
                    label="Confirm on WhatsApp"
                    text={whatsappText}
                    className="flex-1"
                  />
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={quoteHref}>Full quote form</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 border-t pt-4 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand text-brand-foreground">
                  <Check className="h-6 w-6" />
                </div>
                <p className="font-semibold">Estimate sent 🌱</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll come back with an exact quote. For the fastest reply,
                  ping us on WhatsApp.
                </p>
                <WhatsAppButton
                  source="estimator-sent"
                  label="Send on WhatsApp"
                  text={whatsappText}
                  className="w-full"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
