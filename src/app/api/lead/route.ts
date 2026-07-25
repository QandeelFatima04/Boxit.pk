import { NextResponse } from "next/server";
import { sendMailLocal } from "@/lib/mailer";

// Node runtime required: the mailer opens a TCP socket to the local SMTP relay.
export const runtime = "nodejs";

// Lead intake: contact form, RFQ, and packaging-fit quiz all post here.
// Emails the team inbox AND sends the lead a confirmation, via the co-located
// Mailcow relay; always logs. Attribution (UTMs) is included so every lead is
// attributable to a channel.

export type LeadPayload = {
  type: "contact" | "quote" | "quiz" | "sample_kit";
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  businessType?: string;
  message?: string;
  product?: string;
  quantity?: string;
  timeline?: string;
  answers?: Record<string, string>;
  attribution?: Record<string, string>;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const MAIL_FROM = process.env.MAIL_FROM_ADDR || "info@boxit.pk";
const NOTIFY_TO = process.env.LEADS_NOTIFY_EMAIL || "info@boxit.pk";

const LABELS: Record<LeadPayload["type"], string> = {
  contact: "message",
  quote: "quote request",
  quiz: "packaging quiz",
  sample_kit: "sample kit request",
};

// Notify the team inbox, and (if we have their address) confirm to the lead.
async function sendEmail(payload: LeadPayload) {
  const lines = Object.entries(payload)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
    .join("\n");

  // 1) Internal notification — Reply-To the lead so a reply reaches them.
  try {
    await sendMailLocal({
      fromName: "Boxit Website",
      fromAddr: MAIL_FROM,
      to: NOTIFY_TO,
      replyTo: payload.email && isEmail(payload.email) ? payload.email : undefined,
      subject: `New ${payload.type} lead${payload.company ? ` — ${payload.company}` : ""}`,
      text: lines,
    });
  } catch (err) {
    console.error("[lead] notify email failed", err);
  }

  // 2) Confirmation to the lead.
  if (payload.email && isEmail(payload.email)) {
    const label = LABELS[payload.type] ?? "request";
    const hello = payload.name ? `Hi ${payload.name},` : "Hi,";
    const body =
      `${hello}\n\n` +
      `Thanks for reaching out to Boxit — we've received your ${label} and our team will get back to you shortly.\n\n` +
      (payload.product ? `Product: ${payload.product}\n` : "") +
      (payload.quantity ? `Quantity: ${payload.quantity}\n` : "") +
      (payload.message ? `Your message: ${payload.message}\n` : "") +
      `\nIf it's urgent, reply to this email or message us on WhatsApp.\n\n` +
      `— Boxit\nhttps://boxit.pk`;
    try {
      await sendMailLocal({
        fromName: "Boxit",
        fromAddr: MAIL_FROM,
        to: payload.email,
        replyTo: NOTIFY_TO,
        subject: "We've received your request — Boxit",
        text: body,
      });
    } catch (err) {
      console.error("[lead] confirmation email failed", err);
    }
  }
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't read that request. Please try again, or send us the details on WhatsApp." },
      { status: 400 },
    );
  }

  if (!payload.type) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong at our end. Please try again, or message us on WhatsApp." },
      { status: 400 },
    );
  }
  if (payload.email && !isEmail(payload.email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right. Please check it and resend." },
      { status: 400 },
    );
  }
  // Need at least one way to reach the lead.
  if (!payload.email && !payload.phone) {
    return NextResponse.json(
      { ok: false, error: "Please add an email or phone number so we can send your quote." },
      { status: 400 },
    );
  }

  // TODO: persist to Supabase/Postgres. For now: log + email notify.
  console.log("[lead]", JSON.stringify(payload));
  await sendEmail(payload);

  return NextResponse.json({ ok: true });
}
