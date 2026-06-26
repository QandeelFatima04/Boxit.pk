// Key-event tracking helper. Fires to GA4 (gtag) and Meta Pixel (fbq) if present.
// Key events per the diagnosis chat: WhatsApp click, form submit, sample-kit
// request, catalogue download, call click, begin/complete checkout.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type KeyEvent =
  | "whatsapp_click"
  | "call_click"
  | "form_submit"
  | "sample_kit_request"
  | "quote_request"
  | "quiz_complete"
  | "catalogue_download"
  | "begin_checkout"
  | "purchase";

// Map our events to Meta standard events where one fits.
const META_EVENT: Partial<Record<KeyEvent, string>> = {
  whatsapp_click: "Contact",
  call_click: "Contact",
  form_submit: "Lead",
  sample_kit_request: "Lead",
  quote_request: "Lead",
  quiz_complete: "Lead",
  catalogue_download: "ViewContent",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
};

export function track(event: KeyEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* noop */
  }
  try {
    const metaName = META_EVENT[event];
    if (metaName) window.fbq?.("track", metaName, params);
  } catch {
    /* noop */
  }
}
