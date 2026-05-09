# jordanwhitledge.com

Personal-brand site for **Jordan M. Whitledge** — CFA charterholder, CFP® professional, MBA, Adjunct Professor of Economics. Educator, speaker, and author of *The Whitledge Brief*.

> *"Common Sense Finance. Uncommon Wealth."*

## What's in this repo

This is the **v1 build package** — modular HTML blocks designed to paste into Squarespace 7.1 (Fluid Engine) Code Blocks, plus reference and planning documentation.

```
.
├── blocks/                              # 12 paste-ready HTML blocks for Squarespace Code Blocks
│   ├── 01-home-hero.html                # Home: hero
│   ├── 02-home-logos.html               # Home: As Featured In logo bar
│   ├── 03-home-offerings.html           # Home: What You'll Find (3 cards)
│   ├── 04-home-newsletter.html          # Home: Newsletter CTA (with brand tagline)
│   ├── 05-about-bio.html                # About: bio + beliefs
│   ├── 06-about-media.html              # About: From Recent Interviews (pull quotes)
│   ├── 07-speaking.html                 # Speaking: 3 talk topics + custom CTA
│   ├── 08-teaching.html                 # Teaching: university + workshops + philosophy
│   ├── 09-reading.html                  # Reading: 11 recommended books, 2 categories
│   ├── 10-resources.html                # Resources: lead magnet (Advisor's Alpha Checklist)
│   ├── 11-contact.html                  # Contact: info block (form added separately)
│   ├── 12-credentials.html              # Credentials bar (use anywhere)
│   └── _v2-deferred/                    # v2 work parked here — DO NOT paste into Squarespace yet
│       └── calc-fee-impact.html         # v2 calculator prototype (design pattern locked)
│
├── JMW_Site_Design_Reference.html       # Visual reference: every section stacked on one scrollable page
├── JMW_Site_Build_Handoff.html          # Build documentation for whoever assembles the Squarespace site
├── headshot.jpg                         # Professional headshot (used on About page)
│
├── CLAUDE.md                            # Project memory: brand specs, conventions, decisions
├── v2-brief.md                          # Architectural north star for the v2 rebuild (Framer-targeted)
└── README.md                            # This file
```

## Brand specs (quick reference)

- **Colors:** Navy `#1B2A4A` · Gold `#C5A55A` · Warm Gray `#F5F3EF` (full palette in `CLAUDE.md`)
- **Fonts:** Playfair Display (headings) + DM Sans (body) — loaded via Squarespace's Google Fonts integration
- **Compliance posture:** Education and thought leadership only — never client solicitation. Use "professional inquiries," not "become a client."

## Status

- **v1:** Content complete. Ready for Squarespace deployment.
- **v2:** Planned rebuild on **Framer** with calculators-as-components, IA simplified to 5 nav items, single-CTA homepage, on-site newsletter archive. See `v2-brief.md`.

## Deployment notes

The 12 block files paste into Squarespace **Code Blocks** on their respective pages. Native Squarespace blocks need to be added separately:
- **Newsletter Block** under home newsletter section + on resources page
- **Form Block** for contact page + lead magnet email capture
- **Image Block** for the headshot on About
- **Native Blog page** for The Brief
- **Announcement Bar** (Settings → Marketing) for the credential strip across the top

Full build instructions are in `JMW_Site_Build_Handoff.html`.

---

© 2026 Jordan M. Whitledge. All rights reserved.
