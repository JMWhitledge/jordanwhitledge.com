# Jordan M. Whitledge — Site Build Package

Personal-brand site for Jordan M. Whitledge, deploying to **Squarespace 7.1 (Fluid Engine)** at jordanwhitledge.com. Package contains hand-built HTML to paste into Squarespace Code Blocks plus a full-site visual preview.

## Compliance posture (do not violate)

The site positions Jordan as an **educator and thought leader**, not as someone soliciting clients. This is a hard rule for every piece of content:

- Use "professional inquiries" — never "become a client" or anything resembling client solicitation
- Every calculator gets an "educational purposes only, not personalized advice" disclaimer
- Tone: calm, confident, clear. Evidence over hype. Warm but professional.
- When introducing a critique of the industry (e.g., fee impact), include a counter-balancing acknowledgment that real advisors deliver real value — keeps the educator-first framing intact

## Brand specs

**Colors** (CSS vars used throughout):
- `--navy: #1B2A4A` · `--navy-deep: #111D33`
- `--gold: #C5A55A` · `--gold-light: #E8D5A3` · `--gold-hover: #B8943D`
- `--warm-gray: #F5F3EF` · `--charcoal: #2D2D2D` · `--slate: #6B6B6B`

**Fonts** (loaded via Squarespace Site Styles, not in block files):
- `'Playfair Display', Georgia, serif` — headings, wordmark. Weight 400 for elegant; 500 for emphasis.
- `'DM Sans', sans-serif` — body, UI, buttons. Weights 300–600.

**Brand element:** thin gold rule (1–2px tall, 36–48px wide) under section titles and the nav wordmark. Ties the design system together — use it.

**Name:** always include middle initial — "Jordan M. Whitledge"
**Tagline:** "Common Sense Finance, Uncommon Wealth"
**Credentials:** CFA® charterholder, CFP® professional, MBA, Adjunct Professor of Economics

## Platform constraints (Squarespace Code Blocks)

Every block file is **self-contained** and pasted into a Squarespace Code Block:
- Structure: `<style>…</style><div>…</div><script>…</script>`
- **No** `<html>`, `<head>`, or `<body>` tags
- **No external JS libraries** — vanilla JS only (calculators use IIFEs + native DOM/SVG)
- Fonts come from Squarespace's Google Fonts integration; don't reload them in block files

**What gets added separately as native Squarespace blocks (not code):**
- Newsletter Block — under home newsletter section + resources lead magnet
- Form Block — contact page (Name, Email, Subject dropdown [Speaking / Media / Educational Partnership / Professional Inquiry / Other], Message), lead magnet email capture
- Image Block — headshot on About page
- Native Blog page — "The Brief" at `/the-brief`
- Announcement Bar (Settings → Marketing) — for the Option B utility credential strip

## File conventions

```
blocks/NN-<name>.html               Section blocks (01–12, ship to Squarespace)
blocks/_v2-deferred/calc-*.html     v2 work, parked. Don't paste into Squarespace yet.
JMW_Site_Design_Reference.html  Visual reference (not for prod)
JMW_Site_Build_Handoff.html                Builder documentation
nav-options-preview.html                   Working scratch (deletable; led to Option B nav)
hero-options-preview.html                  Working scratch (deletable; led to keeping current hero)
v2-brief.md                                Architectural north star for v2 rebuild
CLAUDE.md                                  This file
```

## Decisions locked in

- **Email:** `jordan.whitledge@icloud.com` — placeholder until iCloud+ Custom Email Domain routes `jordan@jordanwhitledge.com` to his iCloud inbox. When set up, swap one `mailto:` line in `11-contact.html` and the preview footer.
- **LinkedIn:** `https://www.linkedin.com/in/jordanwhitledge/`
- **Calculators:** **deferred to v2.** Resources page in v1 is just the lead magnet. The Fee Impact prototype is preserved in `blocks/_v2-deferred/`. URL pattern reserved as `/calculators/<slug>` for when v2 happens.
- **Nav:** Option B — utility credential strip on top (`CFA® · CFP® · MBA · Adjunct Professor of Economics`) + clean Playfair 400 wordmark with 36px gold accent rule. Auto-hides utility strip on mobile (≤768px).
## Outstanding work

v1 site is content-complete. Remaining items are user-side (assets, page creation in Squarespace) — see "Pending user input" below.

## Pending user input

- **Headshot** — preview markup expects `headshot.jpg` at project root for local rendering. For Squarespace prod, upload via Image Block on About page.
- **Custom domain email** — when iCloud+ Custom Email Domain is configured, swap `mailto:` line in `11-contact.html` and preview footer.
- **Lead magnet PDF** — "The Advisor's Alpha Checklist" (Vanguard-research-based framework for evaluating good financial advice). Wire to Squarespace Form Block on Resources page once ready.
- **Privacy Policy + Disclaimers content** — Squarespace pages at `/privacy`, `/disclaimers`
- **Squarespace pages to create** so internal links don't 404: `/the-brief`, `/privacy`, `/disclaimers`, `/about`, `/speaking`, `/teaching`, `/reading`, `/resources`, `/contact`

## Deferred / parking lot (v2 candidates)

Explicitly cut from v1 scope. Revisit after launch when analytics show what visitors actually engage with:

- **Interactive calculators** — 6 planned (Fee Impact, Retirement Readiness, Portfolio Visualizer, Tax-Loss Harvesting, Roth Conversion, Social Security). Fee Impact prototype preserved in `blocks/_v2-deferred/calc-fee-impact.html` — pattern is locked, just rehydrate when ready. URL pattern: `/calculators/<slug>`.
- **Worksheet downloads** — Goal Planning, Net Worth, Cash Flow, Interview an Advisor, Tax Drag Audit, Financial Wellness Assessment. Pattern: gated PDFs at `/resources/<slug>`.
- **IA simplification** — 8 nav items → 5 max; consolidate Speaking + Teaching; demote Reading.
- **Homepage cut** — current home has 12 sections; v2 target is 3–4 (hero / one editorial proof / trust strip / newsletter signup). Everything else lives on dedicated pages.
- **Conversion focus** — pick newsletter as the single primary CTA across the entire site.
- **Newsletter archive** displayed on-site (read 3 past issues before subscribing).
- **Replace "What You'll Find" feature grid** with actual editorial content (essay excerpt, reader quote).
- **Reading list promotion** — instead of putting on homepage scroll (would bloat it), heavily link from (a) one editorial line in About: "*See the full list of 21 books I recommend most*", and (b) "From the reading list" sidebar/footnote on Brief articles when relevant.
- **Split Resources** into "Free Tools" (no gate, trust-building) vs "Get the Guide" (email-gated).

## v2 platform direction (in motion)

Jordan is actively planning to move off Squarespace.

- **Recommended:** **Framer**. Reasoning: visual editor he can manage himself; calculators in v2 can be built as embedded components (no separate hosting); typography control is best-in-class among visual builders; de facto choice for indie thought leaders / writers in 2024–25; easy migration from Squarespace.
- **Runner-up:** Webflow (more CMS power, slightly steeper curve).
- **Skip:** Ghost (too writing-only, weak for marketing pages); custom Astro/Vercel route (devs only).

## v2 design decisions made (for the rebuild brief)

- **Hero H1:** **stays "Common Sense Finance. Uncommon Wealth."** — brand equity beats category-generic critique. Don't change.
- **"Most financial advice is sold, not taught. I take the opposite approach."** — relocate from About bio to the **About page H1** (or as a pull-quote/subhead on the About section of homepage). Too good a line to keep buried.
- **Reading list strategy:** dedicated /reading page (not on homepage scroll), heavily linked from About + Brief contexts.
- **Nav treatment:** keep Option B (utility credential strip + clean Playfair wordmark with gold accent rule).
- **Brand tagline "Good things come to those who start.":** wired into the newsletter section as an italic Playfair lead-in above the eyebrow. Lives in `blocks/04-home-newsletter.html` and the design reference newsletter section. In v2 consider expanding placement (footer signature, About page, etc.) once the line proves itself in context.
