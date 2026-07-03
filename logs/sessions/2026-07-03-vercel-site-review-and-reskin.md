# Session Log — 2026-07-03

**Focus:** Full review + overhaul of the Vercel single-page personal site (`index.html`): platform reconciliation, content pass, resources hub, and a complete design-system reskin.

## Decisions
- Canonical site is the Vercel single-page `index.html`; **Squarespace is being canceled and the domain moved**. (Resolves the two-track drift; CLAUDE.md now stale.)
- Identity is **advisor + educator, practitioner as anchor**; hero adopts "The practice keeps the teaching real. The teaching keeps the advice clear." Supersedes educator-only posture.
- Design system swapped to **Warm Practitioner** (Fraunces / Source Sans 3, cream paper `#F8F3EA`, warm-grey ink `#46403A`, gold `#B5823F` hairline-only (warmed from an initial `#C0956C` that read mustard)) + **The Essayist** (Newsreader for the Brief). Kept distinct from DCM (`#212e52` / `#c4b082`).
- Reading list folded under Resources; top nav trimmed to 7 items.
- Forms stack: **Beehiiv** (newsletter + lead-magnet delivery) + **Formspree** (contact) recommended.
- Em-dash rule relaxed to "sparing."

## Completed
- Content/copy + compliance review; fixed dead links, added footer disclaimer, mobile hamburger nav, SEO/OG meta + favicon.
- Created `privacy.html`, `disclaimers.html`, `vercel.json` (cleanUrls).
- Fixed reveal-on-scroll bug (JS-gated + no-JS fallback); mobile pass (no overflow, 2-up reading, tighter rhythm); unified press logos; gold portrait frame.
- Built "How I Think" section (replaced "What You'll Find"); full Speaking rewrite (3-talk slate, no takeaways); "Plan. Don't predict." editorial band.
- Resources hub: 5 free-tool cards (Net Worth, Cash Flow, Goal Planning, Interview-an-Advisor, Financial Wellness) + folded-in reading list.
- Full reskin applied to `index.html` + `privacy.html` + `disclaimers.html`; removed dead takeaway-collapse code.
- Emailed Jordan the create-and-drop-in pull-list (Gmail draft).

## Open tasks
- [ ] Update `CLAUDE.md` — stale (Squarespace framing, educator-only, Playfair/DM Sans).
- [ ] Decide page-split scope (Resources → own page, or split Speaking/Teaching too, or keep single-page) — raised, not resolved.
- [ ] Jordan to create/drop in: 6 PDFs (Advisor's Alpha + 5 worksheets), Beehiiv embed, Formspree form ID, real email, DNS to Vercel.
- [ ] Wire form/worksheet CTAs (placeholder → `#newsletter`) to gated downloads once PDFs + provider exist.
- [ ] Compliance review of privacy/disclaimers against the new advisor positioning.

## Notes
- Preview served from a scratchpad copy — macOS TCC blocks the sandboxed preview process from reading `~/Downloads`; `blocks/.claude/launch.json` points at a scratchpad `serve.py`.
- Reading: Behavior Gap removed; Winning the Loser's Game already present, so not duplicated (behavioral section now 4 books).
- `headshot-options-mockup.html` is a pre-existing untracked scratch file, not part of this work — left uncommitted.
