#!/usr/bin/env python3
"""Recurring (~90-day) product/listing SEO optimization run.

Reads a product export (JSON), and for each product drafts an improved SEO
title, meta description and keywords. With ANTHROPIC_API_KEY set it uses the
Claude API; otherwise it falls back to a simple heuristic. Output is written for
a human to review and paste into the CMS — nothing is published automatically.

The product JSON is a list of objects with at least: slug, name, tagline,
description. Export it from the site/CMS, or hand-author it.

Usage:
    python optimize_seo.py --in products.json --out seo-suggestions.json
"""
from __future__ import annotations

import argparse
import json
import os
import sys

MODEL = "claude-opus-4-8"

PROMPT = """You are an SEO copywriter for Boxit, Pakistan's plantable seed-paper
and sustainable-packaging maker (B2B, Lahore). For the product below, write:
- seoTitle: <=60 chars, include the main keyword and "Pakistan" or "Boxit" if it fits
- metaDescription: 140-160 chars, benefit-led, one clear CTA
- keywords: 4-6 short search phrases a Pakistani buyer would use

Return ONLY JSON: {{"seoTitle":"","metaDescription":"","keywords":[]}}

Product:
name: {name}
tagline: {tagline}
description: {description}
"""


def heuristic(p: dict) -> dict:
    name = p.get("name", "").strip()
    tagline = p.get("tagline", "").strip()
    title = f"{name} — Boxit Pakistan"[:60]
    desc = (f"{name}: {tagline}. Custom plantable & biodegradable packaging in "
            f"Pakistan. Request a quote or order a sample kit.")[:160]
    base = name.lower()
    keywords = [
        base,
        f"{base} pakistan",
        "plantable packaging",
        "seed paper",
        "sustainable packaging pakistan",
    ]
    return {"seoTitle": title, "metaDescription": desc, "keywords": keywords}


def with_claude(client, p: dict) -> dict:
    msg = client.messages.create(
        model=MODEL,
        max_tokens=400,
        messages=[{
            "role": "user",
            "content": PROMPT.format(
                name=p.get("name", ""),
                tagline=p.get("tagline", ""),
                description=p.get("description", ""),
            ),
        }],
    )
    text = "".join(block.text for block in msg.content if block.type == "text")
    try:
        return json.loads(text[text.index("{"): text.rindex("}") + 1])
    except (ValueError, json.JSONDecodeError):
        return heuristic(p)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="infile", default="products.json")
    ap.add_argument("--out", dest="outfile", default="seo-suggestions.json")
    args = ap.parse_args()

    try:
        with open(args.infile, encoding="utf-8") as f:
            products = json.load(f)
    except FileNotFoundError:
        sys.exit(f"Input file not found: {args.infile}. Export products to JSON first.")

    client = None
    if os.getenv("ANTHROPIC_API_KEY"):
        try:
            import anthropic  # type: ignore
            client = anthropic.Anthropic()
            print("Using Claude API for drafting.")
        except ImportError:
            print("anthropic not installed; using heuristic. (pip install anthropic)")
    else:
        print("ANTHROPIC_API_KEY not set; using heuristic drafting.")

    suggestions = []
    for p in products:
        draft = with_claude(client, p) if client else heuristic(p)
        suggestions.append({
            "slug": p.get("slug"),
            "current": p.get("seo", {}),
            "suggested": draft,
        })
        print(f"  drafted: {p.get('slug')}")

    with open(args.outfile, "w", encoding="utf-8") as f:
        json.dump(suggestions, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {len(suggestions)} suggestions to {args.outfile}. Review before publishing.")


if __name__ == "__main__":
    main()
