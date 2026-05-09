# v2 Brief — Jordan M. Whitledge

The strategic north star for the v2 site rebuild. v1 ships on Squarespace; v2 is a from-scratch rebuild on a better platform with a tightened information architecture and a single conversion goal.

This doc captures the architectural decisions made during the v1 build process. Read it before opening the visual editor.

---

## What v1 is

A clean, brand-on-point Squarespace 7.1 site built with hand-coded Code Blocks. It works, it looks good, and it ships the brand. But it carries known structural compromises — bloated information architecture, scattered conversion intent, no real CMS, no calculator infrastructure, hand-pasted updates.

## What v2 should be

The same brand, redesigned around what we now know about how visitors should move through the site. Specifically:

- **One conversion goal**, end-to-end: get the visitor on the newsletter list.
- **Three to four homepage sections**, not twelve.
- **Real interactive components** (the deferred calculators) embedded inline, not hand-pasted.
- **A platform that gets out of the way** so updates take 5 minutes, not 50.

---

## Platform

**Use Framer.** Decision rationale:

| | Framer | Webflow | Ghost | Custom (Astro/Vercel) |
|---|---|---|---|---|
| Visual editor (no dev required) | ✅ Best | ✅ Strong | ⚠️ Limited | ❌ |
| Real CMS for blog | ✅ | ✅ Best | ✅ Best for writing | ✅ |
| Calculators as native components | ✅ Best for non-devs | ✅ (more setup) | ❌ | ✅ Best (devs only) |
| Typography control | ✅ Best | ✅ Strong | ⚠️ | ✅ |
| Cost (Pro) | ~$25/mo | ~$23/mo | ~$11–30/mo | $0 hosting |

Framer wins for: (1) Jordan can manage it himself, (2) calculators in v2 can be embedded as native components without separate hosting, (3) typography control is best-in-class among visual builders, (4) emerging as the de facto choice for indie thought leaders / writers in 2024–25.

**Runner-up:** Webflow. Use it if Framer's CMS proves too thin once content scales.
**Skip:** Ghost (too writing-focused, weak for marketing pages); custom Astro/Vercel (devs only).

---

## Information Architecture

**Nav: 5 items max** (down from 8 in v1).

```
About  ·  The Brief  ·  Speak & Teach  ·  Resources  ·  Contact
```

Consolidations:
- **Speaking + Teaching → "Speak & Teach"** — both are external presentations; one page with two tabs/sections.
- **Reading demoted** — no longer a top-nav item. Lives at `/reading` and gets linked into About + Brief contexts (see Reading Strategy below).
- **"Start Here" removed as nav item** — redundant once the homepage is well-designed.

**Header CTA:** "Subscribe" button (gold). Only persistent CTA in the chrome.

---

## Homepage architecture

**Target: 3–4 sections.** The current 12-section homepage is a one-page-site impersonating a homepage. Cut to:

### 1. Hero
- Eyebrow: "Educator · Speaker · Advisor"
- H1: **Common Sense Finance. Uncommon Wealth.** (italic on second clause). Stays as-is — brand equity beats generic-tagline critique.
- Subtitle: 1 sentence, evidence/discipline framing.
- **Single primary CTA**: Subscribe to The Whitledge Brief.
- (Optional secondary): View latest essay.

### 2. One piece of editorial proof
*Replaces* the "What You'll Find" three-card feature grid (which was generic SaaS pattern).

Either:
- **Latest essay teaser** — title + first 2 sentences + "Read →"
- **Reader quote** — single pull-quote from a subscriber/student/event organizer
- **Cover-style editorial card** — like a magazine cover for the most important essay

Show, don't list. Demonstrate the voice instead of advertising it.

### 3. Trust strip
- "As Featured In" logo bar (Reuters, CNBC, Investopedia, Financial Planning) — already strong in v1, keep
- Single credential line below: "CFA® · CFP® · MBA · Adjunct Professor of Economics"

### 4. Newsletter signup (closer)
Same conversion ask as the hero. Repeat — most subscribers convert on the second, third, or fourth ask.

**Cut from homepage:**
- Start Here 4-step section → standalone `/start-here` page if we keep it at all
- About summary block → keep in nav, fully on `/about`
- Resources lead magnet card → keep in nav, fully on `/resources`
- Speaking topics preview → keep in nav, fully on `/speak-and-teach`

---

## Page-by-page direction

### `/about`
- **H1:** "Most financial advice is sold, not taught. I take the opposite approach." (Stronger visual treatment than v1 — large Playfair italic on the second clause, gold-light accent.)
- Headshot prominently placed (right column or full-bleed crop)
- Bio paragraphs (carry over from v1)
- 4 belief statements with gold left border (carry over from v1)
- One editorial line: *"See the full list of 21 books I recommend most"* → links to `/reading`
- "In the Media" section (carry over from v1)
- Single CTA at bottom: Subscribe

### `/the-brief`
- **Newsletter archive on-site.** Critical addition vs. v1. Visitors should be able to read 3 past issues before deciding to subscribe.
- Categories: Behavioral Finance · Investing · Tax Strategy · Economics · Planning
- Each post links to a dedicated essay page (real CMS, not Squarespace blog)
- Subscribe form prominent on every essay page (top + bottom)
- "Posts you might also like" cross-linking, including reading-list items where relevant

### `/speak-and-teach`
- Merged from v1's separate Speaking + Teaching pages
- Two tabs/sections on one page: "Speaking Topics" (3 talks from v1) + "Teaching" (university + workshops + philosophy quote)
- Inquiry CTA at bottom

### `/reading`
- The 21 books, organized into 4 categories (carry over from v1)
- Each book becomes a page over time with Jordan's notes/why-it-matters (long-term play)
- "Get the full reading list as a PDF" — second lead magnet (free, email-gated)
- Annual "Books I Read in [Year]" essay format

### `/resources`
- **Split from v1's mashed-together Resources:**
  - **Free Tools** (no email gate, builds trust): the calculators when they ship
  - **Get the Guide** (email-gated): the lead magnet PDF
- "Free Tools" treats calculators as a real product surface — not a feature grid

### `/contact`
- Carry over from v1 — info + Squarespace-equivalent form
- Subject dropdown: Speaking Inquiry · Media Request · Educational Partnership · Professional Inquiry · Other

---

## Calculators (v2 deliverable)

Six planned calculators, designed during v1 and parked in `blocks/_v2-deferred/` (Fee Impact prototype only). Pattern is locked.

1. Fee Impact Analyzer (prototype exists)
2. Retirement Readiness Scorecard
3. Portfolio Visualizer
4. Tax-Loss Harvesting Estimator
5. Roth Conversion Analysis
6. Social Security Optimizer

URL pattern: `/calculators/<slug>`. Each calculator: input column → results column → SVG chart → "How this works" → compliance disclaimer → newsletter CTA. See `blocks/_v2-deferred/calc-fee-impact.html` for the locked design pattern.

In Framer, build each as a native component. The math stays the same; the embedding gets clean.

---

## Conversion strategy

**Single primary CTA across the entire site: Subscribe to The Whitledge Brief.**

Every page ends with the same ask. Every secondary CTA (lead magnet, reading list PDF, calculators) is an *acquisition vector* into the newsletter list. The newsletter is the long-game asset; everything else is a funnel into it.

Secondary CTAs (in order of value):
1. Subscribe (newsletter)
2. Get the Guide (lead magnet PDF → email capture → newsletter)
3. Get the Reading List PDF (second lead magnet → email capture → newsletter)
4. Speaking inquiry (lower-volume, higher-value)

---

## Brand & voice — DO NOT CHANGE

Carry over from v1 exactly:

- **Name:** Jordan M. Whitledge (always with middle initial)
- **Tagline:** Common Sense Finance, Uncommon Wealth
- **Credentials:** CFA® · CFP® · MBA · Adjunct Professor of Economics
- **Colors:** navy `#1B2A4A`, gold `#C5A55A`, full palette in `CLAUDE.md`
- **Fonts:** Playfair Display (heading 400–500) + DM Sans (body 300–600)
- **Voice:** calm, confident, clear. Evidence over hype. Warm but professional.
- **Compliance:** education and thought leadership, never client solicitation. "Professional inquiries," not "become a client."

---

## Migration approach (suggested order)

1. **Lock the v1 site live for analytics.** Need 90 days of real data to know what visitors actually engage with.
2. **Set up Framer site under a staging URL** while v1 stays public.
3. **Build in this order:** brand styles → nav + footer → About → The Brief (with newsletter archive) → Speak & Teach → Reading → Resources → Calculators (1–2 to start) → Homepage (last, since it's the synthesis).
4. **Switch DNS** when staging is parity + analytics-informed homepage is ready.
5. **Run Framer + Squarespace in parallel for 30 days** as a fallback.

---

## Success metrics for v2

The site exists to grow the newsletter. v2 success looks like:

- **Newsletter signup rate:** baseline from v1 → measure improvement after v2 ships. Target: 2x.
- **Time to subscribe:** how many sessions before a visitor subscribes. Target: lower.
- **Calculator engagement → newsletter:** % of calculator users who subscribe in same session.
- **Reading list traffic:** does it become a meaningful traffic source via search?

If newsletter growth doesn't accelerate after 90 days on v2, the platform isn't the bottleneck — the content cadence is.

---

## Things explicitly NOT in v2 scope

- Client onboarding flows
- Booking/scheduling integrations
- E-commerce / paid courses (yet)
- AI chat or "ask Jordan" features
- Client portal

These would be a v3 conversation.
