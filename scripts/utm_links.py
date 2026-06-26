#!/usr/bin/env python3
"""Generate the campaign UTM tagged-link sheet for every marketing channel.

Output: utm-links.csv — paste these into Meta ads, the Instagram bio/link-in-bio,
WhatsApp, email, printed QR codes, and partner referrals so every visit is
attributable in GA4 and on each lead/order record.

Usage:
    python utm_links.py --base https://boxit.pk
"""
from __future__ import annotations

import argparse
import csv
import urllib.parse

# (source, medium, campaign, content) per channel. Landing path is chosen to
# match the strategy: send each campaign to its use-case page, not the homepage.
CHANNELS = [
    # Meta / Instagram paid — one per buyer segment
    ("instagram", "paid_social", "corporate-gifting", "feed", "/corporate-gifting"),
    ("instagram", "paid_social", "sustainable-packaging", "feed", "/sustainable-packaging"),
    ("instagram", "paid_social", "weddings-events", "feed", "/weddings-events"),
    ("facebook", "paid_social", "corporate-gifting", "feed", "/corporate-gifting"),
    ("facebook", "paid_social", "sustainable-packaging", "feed", "/sustainable-packaging"),
    # Retargeting
    ("meta", "retargeting", "sample-kit", "carousel", "/sample-kit"),
    # Organic
    ("instagram", "bio", "always-on", "linkinbio", "/"),
    ("instagram", "social", "organic", "story", "/quote"),
    ("facebook", "social", "organic", "post", "/products"),
    ("linkedin", "social", "organic", "post", "/corporate-gifting"),
    # Direct messaging
    ("whatsapp", "messaging", "always-on", "status", "/sample-kit"),
    # Email / newsletter
    ("newsletter", "email", "monthly", "header", "/products"),
    ("email", "email", "quote-followup", "cta", "/quote"),
    # Offline
    ("qr", "print", "sample-kit-insert", "box", "/quote"),
    ("partner", "referral", "partners", "link", "/"),
]


def build(base: str, source: str, medium: str, campaign: str, content: str, path: str) -> str:
    params = {
        "utm_source": source,
        "utm_medium": medium,
        "utm_campaign": campaign,
        "utm_content": content,
    }
    return f"{base.rstrip('/')}{path}?{urllib.parse.urlencode(params)}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="https://boxit.pk")
    ap.add_argument("--out", default="utm-links.csv")
    args = ap.parse_args()

    rows = []
    for source, medium, campaign, content, path in CHANNELS:
        rows.append(
            {
                "channel": f"{source}/{medium}",
                "campaign": campaign,
                "landing_page": path,
                "tagged_url": build(args.base, source, medium, campaign, content, path),
            }
        )

    with open(args.out, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["channel", "campaign", "landing_page", "tagged_url"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} tagged links to {args.out}")
    for r in rows:
        print(f"  {r['channel']:24} -> {r['tagged_url']}")


if __name__ == "__main__":
    main()
