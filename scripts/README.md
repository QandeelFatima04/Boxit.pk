# Boxit automation scripts (Python)

Back-office automation that supports the website. These run offline or on a
cron — the public site stays pure Next.js.

## Setup

```bash
cd scripts
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Scripts

| Script | What it does |
| --- | --- |
| `utm_links.py` | Generates the campaign UTM tagged-link sheet (CSV) for every channel — Meta/IG ads, IG bio, WhatsApp, email, QR codes, partners. |
| `optimize_seo.py` | The recurring (≈90-day) product/listing optimization run. Reads a product export and drafts improved titles, meta descriptions and keywords (AI-assisted via the Claude API when `ANTHROPIC_API_KEY` is set) for human review before publishing. |

These implement the meeting requirements: an AI-assisted, copy-paste-friendly
optimization workflow with a human approving changes, plus channel-tagged links
so every visit is attributable.
