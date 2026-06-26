import { getAttribution } from "@/lib/utm";
import { track, type KeyEvent } from "@/lib/track";
import type { LeadPayload } from "@/app/api/lead/route";

const EVENT_BY_TYPE: Record<LeadPayload["type"], KeyEvent> = {
  contact: "form_submit",
  quote: "quote_request",
  quiz: "quiz_complete",
  sample_kit: "sample_kit_request",
};

export async function submitLead(
  payload: Omit<LeadPayload, "attribution">,
): Promise<{ ok: boolean; error?: string }> {
  const body: LeadPayload = {
    ...payload,
    attribution: getAttribution() as Record<string, string>,
  };

  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    if (data.ok) track(EVENT_BY_TYPE[payload.type], { type: payload.type });
    return data;
  } catch {
    return { ok: false, error: "Network error. Please try WhatsApp instead." };
  }
}
