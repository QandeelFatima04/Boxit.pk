"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/submit-lead";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const res = await submitLead({
      type: "contact",
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      message: String(fd.get("message") || ""),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      toast.success("Thanks, we've got your message.");
    } else {
      toast.error(
        res.error ?? "We couldn't send that. Please try again, or message us on WhatsApp.",
      );
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-secondary/40 p-8 text-center">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
          Message received
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We usually reply the same working day. WhatsApp is faster if you are in a hurry.
        </p>
        <div className="mt-5 flex justify-center">
          <WhatsAppButton source="contact-success" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" name="company" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input id="phone" name="phone" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">What do you need?</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Tell us the product, rough quantity and when you need it."
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Add an email or phone number so we can reply.
      </p>
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Sending…" : "Send my message"}
      </Button>
    </form>
  );
}
