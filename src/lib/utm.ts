// First-touch attribution: capture UTM + click IDs on landing, persist them,
// and attach to every lead / quiz / order so sales are attributable to channel.
// This closes the measurement gap the diagnosis chat flagged.

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export const CLICK_ID_KEYS = ["fbclid", "gclid", "ttclid"] as const;

export type Attribution = Partial<
  Record<(typeof UTM_KEYS)[number] | (typeof CLICK_ID_KEYS)[number], string>
> & {
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
};

const STORAGE_KEY = "boxit_attribution";

/** Read attribution from URL params (returns only present keys). */
function fromUrl(search: string): Attribution {
  const params = new URLSearchParams(search);
  const out: Attribution = {};
  for (const k of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}

/**
 * Capture and persist first-touch attribution. Call once on first client load.
 * First-touch wins: if we already stored attribution, we keep it.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const existing = getAttribution();
  const incoming = fromUrl(window.location.search);

  // First-touch: only write if nothing stored yet, OR if a new campaign arrives
  // with no prior campaign recorded.
  const hasStored = existing && Object.keys(existing).length > 0;
  if (hasStored && existing.utm_source) return existing;

  const merged: Attribution = {
    ...existing,
    ...incoming,
    landing_page: existing?.landing_page ?? window.location.pathname,
    referrer: existing?.referrer ?? document.referrer ?? "",
    first_seen: existing?.first_seen ?? new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* storage blocked (private mode) — non-fatal */
  }
  return merged;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
