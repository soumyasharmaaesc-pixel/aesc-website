# Phase 2 — Programmatic SEO Templates

**Plan date:** 16 July 2026
**Author:** Bhavishya Sharma (with Claude)
**Status:** Draft for sign-off
**Predecessor:** Phase 1 (CMS Foundations) — complete, closeout commit `42893bc`
**Companion docs:** `content-brief-rebuild.md` (§2.4 target URLs, §3 schema baseline), `.superpowers/sdd/` (Phase 1 record)

> **Note on provenance.** The master design spec (`docs/superpowers/specs/2026-07-01-blog-cms-design.md`)
> and the Phase 1 plan were lost in a truncated file transfer (see `/RECOVERY-REPORT.md`).
> This Phase 2 plan is reconstructed from the surviving content brief, the Phase 1 SDD
> record, and the current codebase. Where the original spec §7 would have been the source of
> truth, the relevant decisions are re-derived and stated inline in §2 below. **Re-validate §2
> against the master spec if it is recovered.**

---

## 1. Goal

Phase 1 delivered a Sanity-driven Insights (blog) section on an Eleventy static build. Phase 2 adds
**programmatic SEO page types** — the function-specific and industry-specific landing pages the
content brief lists in §2.4 as the answer to the audit's core finding (zero non-branded organic
traffic; topical-identity confusion). These pages are generated from Sanity documents through the
same build-time-fetch → Eleventy-pagination → static-HTML pipeline the blog already uses.

Scope, from `content-brief-rebuild.md` §2.4 and the Phase 1 "what Phase 2 delivers" note
(`.superpowers/sdd/task-12-brief.md`):

- **Service (role) pages** — `/services/[slug]`: CXO Search, CEO Search, CHRO Search, Board Search
- **Industry pages** — `/industries/[slug]`: BFSI, Manufacturing, Technology, Consumer
- **Sitewide SEO plumbing** these pages depend on: `sitemap.xml`, JSON-LD (Organization + WebSite
  sitewide, Service/BreadcrumbList/FAQPage per page), and the 301 redirect map scaffold.
- **~6 seed pages** authored in Sanity for local review and sign-off (2 service + 2 industry minimum,
  plus 2 more of Bhavishya's choice).

Out of scope for Phase 2 (unchanged from brief §6 / Phase 3–4): deploy pipeline, analytics, and the
21-article legacy migration.

## 2. Architecture decisions (re-derived — validate vs master spec)

**2.1 One schema per page type, not one generic "page".** Add two Sanity schema types,
`servicetemplate` and `industryPage`, mirroring the `blogPost` pattern in
`studio/schemaTypes/`. Each embeds the existing reusable `seo` object
(`studio/schemaTypes/objects/seo.js`) so the SEO contract is identical across all page types.

**2.2 Build-time fetch via `_data`, one file per type.** Add `src/_data/servicePages.js` and
`src/_data/industryPages.js`, each following `src/_data/blogPosts.js` exactly: GROQ filter with
`!(_id in path("drafts.**"))`, `defined(slug.current)` guard, `order(...)`, and a `.map()` that
attaches `url`. Fold in the Phase 1 deferred hardening here: wrap `client.fetch` in try/catch so a
CMS outage yields a readable build error, not a stack trace.

**2.3 Pagination templates, one per type.** Add `src/services/service.njk` and
`src/industries/industry.njk`, each using Eleventy `pagination` with `size: 1` over the data file and
`permalink` of `/services/{{ slug }}/index.html` (resp. `/industries/...`). Both extend
`layouts/base.njk` and reuse the existing header/footer partials.

**2.4 Structured data as an includable partial.** Add `src/_includes/partials/schema.njk`
parameterised by page type, emitting the JSON-LD from brief §3 (Organization + WebSite sitewide;
BreadcrumbList on every non-home page; `Service` on service pages; `FAQPage` when a page has FAQs).
`head.njk` includes it. This is the highest-leverage change for the topical-identity problem (brief §3.1).

**2.5 Serializer HTML-escaping (Phase 1 deferred, MUST land now).** `src/_lib/portableText.js`
interpolates CMS values without escaping. Programmatic pages take more structured CMS input, so escape
interpolated text in the serializer before Phase 4 migration relies on it. Tracked as its own task.

**2.6 Sitemap from collections.** Generate `sitemap.xml` from all Eleventy collections
(pages + blogPosts + servicePages + industryPages) via a `src/sitemap.njk` template, excluding the
legacy-alias redirect page.

## 3. Prerequisites

- Phase 1 working tree present and building (`npm run build` green). ✅ verified on restore.
- `.env` with `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN`. ✅ present.
- Bhavishya's sign-off on the §2 architecture (esp. schema shape) before task 4 authoring begins.
- Confirm the four differentiators, office locations, and partner roster (brief "Open questions"
  1–3) — needed for real Service-page copy and Organization schema completeness.

## 4. Tasks

Each task = one focused, reviewable commit, matching the Phase 1 SDD cadence (conventional commit,
brief → implement → review, ledger entry in `.superpowers/sdd/progress.md`).

### Task 1 — `serviceType` + `industryPage` schemas
- **Files:** `studio/schemaTypes/servicePage.js`, `industryPage.js`, `index.js` (register both).
- **Shape (service):** `title`, `slug`, `role` (CEO/CXO/CHRO/Board), `heroHeading`, `intro` (text),
  `whoWeSearchFor` (array of string), `process` (array of {step, detail}), `differentiators`
  (array of {heading, body}), `sectors` (array of ref → industryPage), `faqs` (array of {q, a}),
  `relatedInsights` (array of ref → blogPost), `seo` (object).
- **Shape (industry):** `title`, `slug`, `sector`, `heroHeading`, `intro`, `challenges`
  (array of {heading, body}), `roles` (array of ref → servicePage), `faqs`, `seo`.
- **Acceptance:** Studio starts (`cd studio && npm run dev`), both types appear, seo object renders.
- **Commit:** `feat(studio): add servicePage and industryPage schemas`

### Task 2 — Build-time data files
- **Files:** `src/_data/servicePages.js`, `src/_data/industryPages.js`.
- **Steps:** Clone `blogPosts.js` GROQ+map pattern; resolve refs (`sectors`, `roles`,
  `relatedInsights`) to `{title, slug}`; attach `url`; wrap `client.fetch` in try/catch (2.2/2.5 defer).
- **Acceptance:** Unit test (Vitest) mocking the Sanity client asserts `url` shape and empty-result
  safety, mirroring the Phase 1 data-file tests.
- **Commit:** `feat(data): fetch service and industry pages at build time`

### Task 3 — Pagination templates
- **Files:** `src/services/service.njk`, `src/industries/industry.njk`.
- **Steps:** Eleventy `pagination size:1`, `permalink` per 2.3, extend `base.njk`, render sections per
  brief §4.3–4.5 (hero, who/challenges, process, differentiators, sectors strip, FAQ, CTA, related).
- **Acceptance:** `npm run build` emits `/services/[slug]/index.html` and `/industries/[slug]/...`
  for every published seed doc; header/footer identical to blog pages.
- **Commit:** `feat(templates): programmatic service and industry page templates`

### Task 4 — Seed content (~6 pages) in Sanity
- **Files:** none in repo (Sanity content). Record IDs/slugs in `.superpowers/sdd/`.
- **Steps:** Author 2 service (CEO Search, CHRO Search) + 2 industry (BFSI, Technology) + 2 more;
  real copy to brief voice (§1.2), unique title/meta/H1 (§1.3–1.5), 5–8 FAQs each (§4.3 "critical
  for AI Overview citation").
- **Acceptance:** Pages build and render with real content; `<title>`/meta/H1 all unique and ≤ limits.
- **Commit:** n/a (content) — note in ledger.

### Task 5 — JSON-LD schema partial
- **Files:** `src/_includes/partials/schema.njk`, wired into `head.njk`.
- **Steps:** Emit Organization + WebSite sitewide (brief §3.1–3.2); BreadcrumbList non-home (§3.3);
  `Service` on service pages; `FAQPage` when `faqs` present. Drive from page front-matter/data.
- **Acceptance:** Google Rich Results / schema validator passes on one service + one industry page;
  no duplicate Organization block; valid JSON.
- **Commit:** `feat(seo): sitewide + per-type JSON-LD structured data`

### Task 6 — Serializer HTML-escaping (deferred from Phase 1)
- **Files:** `src/_lib/portableText.js`, `tests/`.
- **Steps:** Escape interpolated text nodes/marks; add tests for `<`, `&`, `"` in CMS strings.
- **Acceptance:** New tests pass; existing blog render tests still green.
- **Commit:** `fix(portable-text): escape interpolated CMS values`

### Task 7 — sitemap.xml
- **Files:** `src/sitemap.njk` (permalink `/sitemap.xml`), `.eleventy.js` (collections if needed).
- **Steps:** Iterate all collections; `<lastmod>` from `publishedAt`/`_updatedAt`; exclude
  `Insights.html` redirect alias.
- **Acceptance:** Valid XML, every service/industry/blog/static URL present, absolute `https://www.` URLs.
- **Commit:** `feat(seo): generate sitemap.xml`

### Task 8 — Redirect-map scaffold
- **Files:** `redirects.csv` (old→new), `docs/` note. (Applied in Phase 3 deploy; scaffolded now.)
- **Steps:** Seed with brief §2.1 renames (`/LeadershipTeam`→`/our-team`, etc.) and reserve rows for
  the Phase 4 `insight-details?id=NN` map.
- **Acceptance:** CSV parses; every §2.1 rename present.
- **Commit:** `chore(seo): add redirect map scaffold`

### Task 9 — Phase 2 smoke test + closeout
- **Files:** `tests/build/phase2.smoke.test.js`, `.superpowers/sdd/progress.md`.
- **Steps:** Extend the Phase 1 smoke test: assert a service page, an industry page, and
  `sitemap.xml` are emitted and non-empty; run full `npm test`.
- **Acceptance:** 100% tests pass; ledger updated; Bhavishya reviews local dev output.
- **Commit:** `test: phase 2 end-to-end build smoke test`

## 5. Completion checklist
- [ ] §2 architecture signed off before Task 4 authoring
- [ ] `npm run build` emits all seed service + industry pages
- [ ] Schema validator passes on one page of each type
- [ ] `sitemap.xml` valid and complete
- [ ] `npm test` green (unit + both smoke tests)
- [ ] Bhavishya has viewed local dev output and signed off before Phase 3 planning
- [ ] `.env` still never committed

## 6. Open questions for sign-off
1. Confirm the initial page set — which 4 service + 4 industry pages ship in Phase 2 vs later.
2. Confirm the four differentiators, offices, and partner roster (brief open Qs 1–3) for real copy.
3. Service/industry URL shape: `/services/[slug]` (brief §2.4) vs `/services/cxo-search` explicit — confirm slugs.
4. Do FAQs live per-page in Sanity, or in a shared reusable FAQ document referenced by pages?
