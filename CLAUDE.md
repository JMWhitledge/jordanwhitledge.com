# Jordan M. Whitledge — jordanwhitledge.com

Personal-brand site for Jordan M. Whitledge. **Static HTML on Vercel**, deployed automatically from `main`. Canonical address is `https://www.jordanwhitledge.com` (the bare domain 308-redirects to `www`). Squarespace was canceled in July 2026; anything in this repo that mentions Squarespace is historical.

## Positioning and compliance (do not violate)

Identity is **advisor + educator, with the practice as the anchor**: "The practice keeps the teaching real. The teaching keeps the advice clear." The site is education and thought leadership. It is not a client-acquisition funnel.

- Use "professional inquiries." Never "become a client," "work with me," or anything resembling solicitation.
- Every page carries the footer disclaimer (educational only, not personalized advice, subscribing or contacting does not create an advisory relationship). Keep it.
- Any future calculator gets an "educational purposes only, not personalized advice" note.
- When critiquing the industry (e.g., fees), acknowledge that good advisors deliver real value.
- Honesty over overclaiming: press is "Featured & Quoted In" (one byline, the rest are quotes). Don't promise downloads that don't exist; label unfinished resources "Coming soon."
- Tone: calm, confident, clear. Evidence over hype. Warm but professional.

## Brand

**Name:** always "Jordan M. Whitledge"
**Tagline:** "Common Sense Finance. Uncommon Wealth." (hero H1; do not change)
**Newsletter line:** "Good things come to those who start."
**Credentials:** CFA® charterholder, CFP® professional, MBA, Adjunct Professor of Economics. Based in Evansville, Indiana.

**Design system** (defined as CSS variables in `styles.css`):
- Navy `#1B2A4A` · Navy deep `#111D33` (nav, constant, no scroll color-swap)
- Gold `#B5823F` (hairlines and accents only) · Gold light `#D6AF72` · Gold hover `#916835`
- Paper `#F8F3EA` · Warm gray `#ECE2CE` · Charcoal ink `#46403A` · Slate `#6F675C`
- Fonts (Google Fonts, linked in each page `<head>`): **Newsreader** for headings and Brief essays (`--heading`, `--essay`), **Source Sans 3** for body and UI (`--body`)
- Signature element: thin gold rule under section titles and the nav wordmark
- Keep visually distinct from DCM's brand (`#212e52` / `#c4b082`)

## Structure

```
index.html, about.html, the-brief.html, speaking.html, teaching.html,
resources.html, contact.html, subscribe.html     Public pages (cleanUrls: /about, etc.)
privacy.html, disclaimers.html, 404.html         Legal + error pages (noindex)
the-brief/<slug>.html                            Brief essays
the-brief/_TEMPLATE.html                         Copy this to publish a new essay (instructions inside)
the-brief/og/<slug>.png                          Share image per essay
styles.css                                       Shared stylesheet for every page
logos/                                           Press logos (Reuters, Investopedia, Yahoo Finance)
favicon.ico, favicon.svg, apple-touch-icon.png   Site icons
sitemap.xml, robots.txt, vercel.json             SEO + hosting config
logs/sessions/                                   Dated session logs
blocks/, v2-brief.md                             Historical (Squarespace-era); not deployed content
```

Each page is self-contained HTML sharing `styles.css`; nav and footer are duplicated per page, so a nav or footer change must be made in every file (including `the-brief/*.html` and `_TEMPLATE.html`).

## Live integrations

- **Newsletter:** Kit form `9657065` (home + `/subscribe`), first name + email, double opt-in
- **Contact:** Formspree endpoint `xaqgzbaz` (AJAX + honeypot). Topics: Speaking, Media, Educational Partnership, Professional Inquiry, Other
- **Analytics:** Google Analytics 4 `G-DJ2QN7E8K4` on every page, plus Vercel Web Analytics. The privacy policy names both; update it if analytics change.
- **SEO:** canonical tags on indexable pages, Person + WebSite JSON-LD, Google Search Console Domain property `jordanwhitledge.com`
- **Email:** no public email address on the site; all contact goes through the form
- **LinkedIn:** `https://www.linkedin.com/in/jordanwhitledge/`

## Publishing checklist

When adding or changing a page: update `sitemap.xml` (`lastmod`), keep the canonical tag and GA tag, and add new Brief essays to `the-brief.html`.

## Open items

- Advisor's Alpha Checklist PDF + second Kit form for delivery, then wire Resources and the home "free checklist" card
- Five worksheets on Resources (Net Worth, Cash Flow, Goal Planning, Interview an Advisor, Wellness Assessment) are labeled "Coming soon"; swap each link for its download when ready
- Kit welcome sequence (welcome → signature idea day 3 → reading list/reply invite day 7)
- Recent Engagements section on `speaking.html` is commented out; fill with real talks
- CFA Institute + Financial Planning press logos (currently text wordmarks)
- Confirm CFP® mark usage against CFP Board's current guide (credential bar uses mixed-case "Certified Financial Planner™")
- Confirm firm compliance review of the site given the advisory references

## Parking lot

- Interactive calculators (Fee Impact prototype in `blocks/_v2-deferred/calc-fee-impact.html`); URL pattern `/calculators/<slug>`
- Newsletter archive on-site; reading-list cross-links from About and Brief essays
- `v2-brief.md` (Framer rebuild, 5-item nav, 3–4 section homepage) predates the move to Vercel; its IA and conversion ideas still apply, its platform recommendation does not
