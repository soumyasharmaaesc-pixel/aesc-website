# AESC Website — Project Handoff & Session Continuity

**Last updated:** 14 July 2026
**Repo:** `/Users/bhavishyasharma/www.aesc.co.in` (git, `main` branch)
**Live site:** https://www.aesc.co.in (Athena Executive Search & Consulting — legacy CodeIgniter/PHP site, still serving production)
**This repo:** the rebuild — Eleventy static site + Sanity CMS blog, not yet deployed to production.

---

## 1. What this project is

Rebuild of www.aesc.co.in as a static Eleventy site with a Sanity-driven Insights (blog) section and, later, programmatic SEO pages. Motivated by a May 2026 SEO audit that found the live site brings in **zero non-branded organic traffic** (all top queries are "athena" brand variations) and fails on basic on-page SEO across all 33 pages.

## 2. Timeline of work so far

### May 2026 — Audit & strategy (docs live in repo root)
- **`aesc-audit-2026-05.md/.docx`** — full SEO/performance audit. Headline findings: no H1s anywhere, zero meta descriptions, 21 insight articles sharing one duplicate title, no sitemap.xml, broken `http://` → `https://www.www.` redirect, 340 imgs without alt, no structured data, no security headers, PHP 7.4 disclosed, 1.3–1.4s TTFB.
- **`developer-brief-live-site-fixes.md/.docx`** — P0 config-level fixes for the *live* site (disable production debugbar, fix redirect, headers, etc.). Sent to the hosting developer; separate from the rebuild.
- **`content-brief-rebuild.md/.docx`** — content/SEO strategy for the rebuild: brand disambiguation ("Athena Executive Search", never bare "Athena"), URL migration map with 301s (`/LeadershipTeam` → `/our-team`, `insight-details?id=NN` → `/insights/[slug]`, etc.), per-page title/meta/H1 specs for 12 pages, required Organization/WebSite/BreadcrumbList schema.
- The repo itself started as a **mirror of the live site** (~247 files). The `insight-details?id=*.html` files and `admin/` at root are untouched legacy mirror artifacts.

### June 2026 — Visual work on static pages (pre-git, edits now in `src/`)
- TheHireHub.ai partnership page (`src/thehirehub-partnership.html`): hero text-visibility fixes (text was splitting across two gradients), several iterations.
- Header logo fix: full AESC logo shown from first paint instead of small icon.
- Hero banner image updates on Scenario Expertise and Insights pages; carousel updates.
- Penrhyn.com-inspired redesign was assessed and **not pursued** (reverted to original swiper hero).

### July 2026 — CMS build (all committed; see `git log`)
- **Design spec:** `docs/superpowers/specs/2026-07-01-blog-cms-design.md` — the master document. 14 sections: architecture, Sanity schemas, URL map, build pipeline, GitHub Actions → FTP deploy, legacy migration, SEO, and a 4-phase rollout.
- **Phase 1 plan:** `docs/superpowers/plans/2026-07-03-cms-phase-1-foundations.md` — task-by-task implementation plan. **Phase 1 is complete** (commit `42893bc` is the closeout).

Phase 1 delivered (16 commits, `d335ef4`..`b1222c9`):
1. npm/git bootstrap, Node 22 (`.nvmrc`), ESM, Vitest.
2. All legacy pages moved to `src/`, Eleventy pass-through build to `dist/` (byte-identical parity verified).
3. Sanity Studio scaffolded in `studio/` — project **w8786fu2 "Athena Blogs"**, dataset **production**, auth account info@thehirehub.ai.
4. Schemas: `author`, `category`, `blogPost` (with `seo` object) in `studio/schemaTypes/`.
5. `src/_lib/`: Sanity client wrapper (env-validated), Portable Text renderer, image URL helper.
6. `src/_data/blogPosts.js`: fetches published posts at build time.
7. Templates: base layout with extracted head/header/footer partials (`src/_includes/`), `/insights/` listing, `/insights/[slug]/` post detail, `Insights.html` legacy alias.
8. Seed content imported: author *Bhavishya Sharma*, category *Reports/Blogs*; a smoke-test post exists ("local-dev-smoke-test-post").
9. End-to-end build smoke test (Vitest, cleans `dist/` first), slug guard, UTC dates, favicon.
10. BlueSteps information band removed from contact page (`b1222c9`).

## 3. Current state

- **Dev server:** `npm run dev` → http://localhost:8080 (Eleventy `--serve --watch`). Builds 15 pages + insights posts. Was running at the end of the last session (background process — restart it in a new session).
- **Build:** `npm run build` → `dist/`. **Tests:** `npm test` (needs a real `.env`).
- **Env:** `.env` (git-ignored) needs `SANITY_PROJECT_ID=w8786fu2`, `SANITY_DATASET=production`, `SANITY_READ_TOKEN` (read-only token, label `aesc-eleventy-build`, ID `siVa022yYUEPnk` in Sanity dashboard — regenerate there if lost).
- **Studio:** `cd studio && npm run dev` → http://localhost:3333.
- **Not deployed anywhere.** Production is still the old PHP site.

## 4. Next up — Phase 2 and beyond (from spec §7, rollout plan)

- **Phase 2 — Programmatic templates (~2–3 days):** programmatic SEO page templates driven from Sanity, ~6 seed pages, local review + sign-off.
- **Phase 3 — Deploy pipeline (~1–2 days):** GitHub Actions → FTP/SFTP to the cPanel host, Sanity webhook to trigger rebuilds, first live push. **Blocker to confirm early:** whether the cPanel host supports SFTP/FTPS (spec open-question checklist, line ~450).
- **Phase 4 — Legacy migration (~2 days):** `scripts/migrate-legacy.js` to convert the 21 `insight-details?id=NN` articles to Sanity posts at `/insights/[slug]`, 301 redirect map, manual QA, team handoff.

## 5. Known issues / gotchas

- **Scraped debugbar markup:** `src/index.html` (and likely other mirrored pages) still contain live-site debug artifacts — `<!-- DEBUG-VIEW START -->`, `debugbar_loader` script, kint markup. They render on localhost. Cleanup pending (the May rebuild scripts stripped these in the old `~/aesc-rebuild` experiment, but the current `src/` pages were never cleaned).
- **Untracked clutter at repo root:** `insight-details?id=*.html`, `admin/`, and the .md/.docx briefs are intentionally uncommitted (mirror artifacts + working docs). Don't delete — the insight files are the Phase 4 migration source.
- **Superseded experiment:** `~/aesc-rebuild/` (separate folder, Astro-based, May 2026) was an earlier rebuild attempt — abandoned in favour of this Eleventy repo. Ignore it.
- **URL renames from the content brief** (`/our-team`, `/our-approach`, etc.) are **not yet applied** — current pages keep legacy names for parity. Apply during/after Phase 3–4 with 301s.
- `deploy-ready/`, `graphify-out/`, `studio/` node_modules etc. — scratch/build outputs, not source.

## 6. How to resume in a new session

```bash
cd /Users/bhavishyasharma/www.aesc.co.in
nvm use            # Node 22
npm run dev        # localhost:8080
```

Then read, in order:
1. This file.
2. `docs/superpowers/specs/2026-07-01-blog-cms-design.md` (the spec — source of truth).
3. `git log --oneline` (what's been built).
4. `content-brief-rebuild.md` (per-page SEO specs, when touching page content).

Likely next instruction: *"start Phase 2"* — write a Phase 2 plan from spec §7 (Programmatic templates) following the same pattern as `docs/superpowers/plans/2026-07-03-cms-phase-1-foundations.md`.
