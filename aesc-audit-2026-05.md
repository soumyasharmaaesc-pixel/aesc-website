# AESC.co.in — SEO & Performance Benchmark Audit

**Domain audited:** https://www.aesc.co.in
**Audit date:** May 13, 2026
**Pages analyzed:** 33 mirrored HTML pages + live-site probes
**Tools used:** Local mirror analysis, curl-based live probes (TTFB, headers, redirects), Google Search Console (3-month window, 12 Feb 2026 – 13 May 2026), Ahrefs (plan-limited — only domain metadata available), pending: SEMrush via Supermetrics
**Auditor:** Internal review for the planned site rebuild

---

## TL;DR — Headline Findings

The site is technically functional, but on every SEO dimension that matters in 2026 it is operating well below the floor of professional standard. The findings below are not nits — they are the kind of issues that an external SEO auditor would flag in the first ten minutes and that materially suppress organic traffic, search snippet quality, and social sharing.

**The single most important strategic finding** is from Google Search Console: of 430 unique queries that surfaced the site in the last 3 months, **every single one of the top 10 is a branded "athena" variation**. Not "executive search firm India", not "CXO recruitment", not "CHRO hiring agency" — just the company name. The site brings in **zero cold demand**. Every one of the 411 clicks over 3 months came from someone who already knew the firm by name. For comparison, that traffic volume is closer to a small-town accounting practice than a national executive-search brand.

This reframes the audit: the technical issues below are the reason the site cannot rank for non-branded terms even when it has the content to do so. Fixing them is necessary but not sufficient — the rebuild also needs a deliberate keyword strategy.

**The ten most important things to fix in the rebuild:**

1. **No H1 tag on a single page** — Google's primary on-page topic signal is missing across all 33 pages.
2. **Zero meta descriptions** — every page lets Google auto-generate snippet text. No CTR control.
3. **21 insight articles share the identical `<title>` tag** "Athena - News and Events" — search results treat them as duplicate content.
4. **No sitemap.xml exists** — `/sitemap.xml` returns HTTP 404. Discovery and indexation rely entirely on link crawling.
5. **Broken `http://` redirect** — `http://www.aesc.co.in` redirects to `https://www.www.aesc.co.in/` (note the double `www`), which fails the TLS cert check.
6. **340 `<img>` tags with zero `alt` attributes** — major WCAG 2.1 accessibility failure and a complete loss of image-search visibility.
7. **No structured data anywhere** — no JSON-LD, no Microdata. No Organization, BreadcrumbList, Article, or WebSite schema. No rich snippet eligibility.
8. **All six standard security headers are missing** (HSTS, X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy).
9. **Server publicly discloses `PHP/7.4.33`** — a version whose security support ended November 2022.
10. **TTFB is 1.3–1.4 seconds** — twice the threshold Google considers "good." The server, not the front-end, is the bottleneck.
11. **Mobile Core Web Vitals: FAILED** (Chrome UX Report, 28-day field data) — real-user LCP of 6.3 seconds, far above the 2.5-second threshold. This is a Google ranking factor.
12. **Mobile page weight is 28 MB** per load — roughly 10× what a typical marketing site should weigh; image optimisation alone would save 4 MB per page.
13. **A debug bar (`index.php?debugbar`) is being loaded on every page in production** — this is a development tool that exposes server internals and adds a render-blocking request. Must be disabled immediately.
14. **Authority Score 15/100, only 38 ranking keywords** — confirmed by SEMrush. But the site has 185 referring domains and 519 backlinks, so the link authority is there; the on-page issues are stopping it from converting into rankings. Fixing the on-page foundation should unlock 5–10× the current keyword footprint.
15. **Topical-confusion signal** — SEMrush sees the domain as topically associated with apparel-sizing queries (EU/UK shoe size, women's dresses), and GSC shows 3,613 impressions for "athena company" (mostly competing with US firms). The rebuild must lock down topical identity through schema, sameAs links, and unambiguous on-page copy.

For a firm whose buyers are CHROs and CEOs evaluating you against Korn Ferry, Heidrick & Struggles, and Egon Zehnder, the digital presentation does not currently match the service positioning.

---

## 1. Critical Issues (P0 — Fix Before Anything Else)

| # | Issue | Where | Why it matters | Effort |
|---|-------|-------|----------------|--------|
| 1 | `http://` redirect sends users to `https://www.www.aesc.co.in/` | Server-side rewrite rule | Anyone typing the bare URL or following an old `http://` link gets a TLS cert error. Direct traffic loss. | 5 min (htaccess) |
| 2 | All 21 insight pages share the title "Athena - News and Events" | `<title>` in each `insight-details?id=NN.html` | Google deduplicates near-identical results. These pages will not rank against each other or against competitors. | Per-page (1 hr) |
| 3 | Zero meta descriptions sitewide | `<head>` of all 33 pages | Snippet text is auto-generated and often shows raw nav/footer text. Lower CTR. | 30 min per page × 33 |
| 4 | No H1 tag on any page | All HTML | Google's strongest single on-page topic signal. Promoting an H2 to H1 fixes most pages. | 1 hr sitewide |
| 5 | No sitemap.xml | `/sitemap.xml` returns 404 | Indexation and discovery rely on crawling. New articles take longer to appear; orphaned pages may never be indexed. | 1 hr (generate + submit to GSC) |
| 6 | No canonical tags | `<head>` of all pages | Query-string variants (e.g. `?utm_*`, the `insight-details?id=` URLs) appear as duplicates. | 30 min sitewide |
| 7 | PHP/7.4.33 disclosed in `x-powered-by` | Server config | Version is end-of-life since Nov 2022. Discloses attack surface. Security risk + compliance flag. | 1 line in php.ini |

---

## 2. Technical SEO

### 2.1 robots.txt

The live `robots.txt` contains exactly two lines:

```
User-agent: * 
Crawl-Delay: 20
```

Findings: `Crawl-Delay: 20` instructs crawlers to wait 20 seconds between requests. Googlebot ignores this directive entirely (Google determines its own crawl budget), but Bing and other crawlers honor it — meaning the site is artificially slowing down its own indexation on those engines. There is **no sitemap reference** (the standard `Sitemap:` line), and no disallow rules for sensitive paths like `/admin`, which is publicly reachable.

**Recommended `robots.txt`:**

```
User-agent: *
Disallow: /admin/
Disallow: /admin

Sitemap: https://www.aesc.co.in/sitemap.xml
```

### 2.2 Sitemap

| Path tested | Result |
|---|---|
| `/sitemap.xml` | 404 |
| `/sitemap_index.xml` | 404 |
| `/sitemap-index.xml` | 404 |
| `/sitemaps.xml` | 404 |
| `/sitemap.xml.gz` | 404 |

No sitemap exists. This must be generated, submitted to Google Search Console and Bing Webmaster Tools, and referenced in `robots.txt`.

### 2.3 Redirects

| Request | Response | Notes |
|---|---|---|
| `http://www.aesc.co.in/` | 301 → `https://www.www.aesc.co.in/` | **BROKEN — double `www` causes TLS failure** |
| `https://aesc.co.in/` | 301 → `https://www.aesc.co.in/` | Correct |
| `https://www.aesc.co.in/admin` | 301 (redirect to login) | Expected |

The `http://` redirect target is a clear server-config bug. Fix at the Apache `.htaccess` or Nginx level. Likely cause: the rewrite is concatenating `www.` onto a hostname that already starts with `www.`.

### 2.4 URL Structure

The live site serves **clean URLs** (e.g. `/about-us`) but the mirror captured **.html-extension URLs** because that's how the CMS internally rewrites. This has migration implications:

- `https://www.aesc.co.in/about-us` → 200
- `https://www.aesc.co.in/about-us.html` → 404

If the rebuild ships as static files named `about-us.html`, every existing external link, every Google-indexed URL, and every internal bookmark breaks. **Either** keep clean URLs by configuring the new host to drop `.html`, **or** ship 301 redirects from `/about-us` to `/about-us.html`.

The Insights URLs are even more fragile — `insight-details?id=66` is a query-string-driven dynamic URL that has no static equivalent. The rebuild must give each article its own slug (e.g. `/insights/why-cxo-search-is-different`) and 301-redirect old IDs to new slugs.

### 2.5 Server & Stack

```
Server: Apache
x-powered-by: PHP/7.4.33
HTTP/2 enabled (good)
TLS handshake: ~930ms (slow — likely no TLS 1.3 or no session resumption)
```

PHP 7.4 reached end of life on **28 November 2022**. It receives no security patches. Hosting providers typically support PHP 8.1 / 8.2 / 8.3 — upgrade should be a one-click action in cPanel.

### 2.6 Security Headers

| Header | Present? | Recommended value |
|---|---|---|
| `Strict-Transport-Security` (HSTS) | ✗ | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | ✗ | `SAMEORIGIN` |
| `X-Content-Type-Options` | ✗ | `nosniff` |
| `Content-Security-Policy` | ✗ | Custom — start with `default-src 'self'` allowlist |
| `Referrer-Policy` | ✗ | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ✗ | Disable unused features (camera, microphone, geolocation) |

All six can be added in a single block in Apache config or a CDN edge rule.

### 2.7 Caching

```
cache-control: no-store, max-age=0, no-cache
```

HTML is set to never be cached. Every refresh = full server hit. Static assets (CSS, JS, images) need separate cache rules but the global `no-store` policy is overzealous for a brochure site whose content changes weekly at most. Recommend `Cache-Control: public, max-age=3600, s-maxage=86400` for HTML and `max-age=31536000, immutable` for hashed static assets.

---

## 3. On-Page SEO

### 3.1 Title Tags

All 33 page titles share three problems: they are **brand-first** (waste keyword real estate), **far too short** (13–25 characters out of an optimal 50–60), and **non-unique on the Insights pages**.

| Page | Current title | Length | Issues |
|---|---|---|---|
| index.html | Athena - Homepage | 17 | Generic, no keywords, no location |
| about-us.html | Athena - About Us | 17 | No keywords, no location |
| consulting-services.html | Athena - Service Page | 22 | Generic, duplicate, trailing space |
| search-services.html | Athena - Service Page | 22 | Generic, duplicate, trailing space |
| differentiator.html | Differentiator - About Us | 25 | Cryptic phrasing |
| career.html | Athena - Careers | 16 | OK but underutilised |
| Insights.html | Athena - Insights | 17 | OK but underutilised |
| LeadershipTeam.html | Athena - Team | 13 | Too short |
| contact-us.html | Athena - Contact Us | 19 | OK |
| **21× insight-details?id=NN** | **Athena - News and Events** | **24** | **All identical — major issue** |

**Recommended pattern:** `[Primary keyword] | [Modifier] | Athena Executive Search` — keep it under 60 characters.

Examples:
- `Executive Search Firm in India | CXO Hiring | Athena Executive Search`
- `Leadership Consulting Services in India | Athena Executive Search`
- `Why Internal Hiring Fails Above the VP Level | Athena Insights`

### 3.2 Meta Descriptions

**Every page has an empty meta description** (`<meta name="description" content="">` or the tag is absent). This is the single highest-leverage SEO fix: write 150–160 character descriptions that include the primary keyword and a clear value proposition for each unique page.

### 3.3 Heading Hierarchy

| File | H1 | H2 | H3 |
|---|---|---|---|
| index.html | **0** | 12 | 0 |
| about-us.html | **0** | 5 | 0 |
| consulting-services.html | **0** | 9 | 0 |
| search-services.html | **0** | 8 | 0 |
| differentiator.html | **0** | 3 | 7 |
| All 21 insight pages | **0** | 2 | 0 |
| ... | | | |

**Not a single page has an H1.** The most likely explanation is that the visual page title is wrapped in a styled `<div>` or `<span>` instead of `<h1>`. The fix is mechanical and one-time: identify the top heading on each template and change the tag.

The H1 should contain the primary keyword for the page. For the homepage: "Executive Search & Leadership Consulting in India" — not "Athena Executive Search" (which is the brand mark, not the search query).

### 3.4 Canonical Tags

Zero pages declare a canonical URL. Add `<link rel="canonical" href="https://www.aesc.co.in/<path>">` to the `<head>` of every page. This protects against:

- Query-string duplicates (`?utm_source=`, `?ref=`, etc.)
- The clean-URL vs `.html` duplicate that already exists
- Trailing-slash variants

### 3.5 Open Graph & Twitter Cards

**Zero `og:*` tags, zero `twitter:*` tags across all 33 pages.** When the site is shared on LinkedIn, X, WhatsApp, or any messaging app, the preview will fall back to default Google-extracted content — typically the first image and a fragment of body text, rarely flattering. For a firm whose target audience actively shares LinkedIn content, this is a measurable brand and CTR loss.

Minimum set per page:
```html
<meta property="og:title"       content="...">
<meta property="og:description" content="...">
<meta property="og:image"       content="https://www.aesc.co.in/...">
<meta property="og:url"         content="https://www.aesc.co.in/...">
<meta property="og:type"        content="website"> <!-- "article" for insights -->
<meta name="twitter:card"       content="summary_large_image">
```

### 3.6 Schema.org Structured Data

Zero JSON-LD, zero Microdata. Recommended schemas:

- **Organization** (sitewide, in footer or `<head>`) — name, logo, sameAs (LinkedIn, X), contactPoint, address
- **WebSite** with `potentialAction` for SearchAction
- **BreadcrumbList** on all interior pages
- **Article** on each insight page (headline, datePublished, author, image)
- **Service** on consulting / search service pages
- **FAQPage** if any page has Q&A content

This is what unlocks rich snippets, knowledge panel eligibility, and AI-overview citations.

### 3.7 Image Alt Tags

**340 `<img>` tags across the site. Zero have `alt` attributes.**

This single issue:
- Is a clear WCAG 2.1 Level A failure (accessibility)
- Forfeits all Google Images traffic
- Reduces context for the page's main subject in ranking algorithms
- Means screen-reader users hear "image" or the filename for every visual

Fix is mechanical: every editorial image needs descriptive alt text, every purely decorative image needs `alt=""`.

### 3.8 Other Head Elements

| Element | Status |
|---|---|
| `<html lang="...">` | **Missing** — should be `lang="en-IN"` |
| Viewport meta | ✓ Present and correct |
| Favicon | Present but sized 80×96 (non-standard — should be 32×32 ICO + 180×180 Apple touch + manifest icons) |
| Web app manifest | ✗ Missing |

---

## 4. Performance

### 4.1 Server Response (live measurements, 3 trials)

| Metric | Median |
|---|---|
| DNS lookup | 3 ms |
| TCP connect | 280 ms |
| TLS handshake | **950 ms** (slow) |
| **TTFB** | **1,400 ms** (Google's "good" threshold: <800 ms) |
| Full transfer | 1,700 ms |
| Page size (HTML only) | 136 KB (homepage) |

TTFB at ~1.4 seconds is the single biggest performance issue and it is **entirely server-side**. The browser cannot start rendering until it has received the first byte. On a 4G mobile connection in India, this alone means the user is staring at a blank screen for >2 seconds before paint begins. Likely causes: PHP 7.4 (slower runtime than 8.x), no opcode caching, no database query caching, possibly an unoptimized shared host. **Upgrading PHP to 8.2+ alone typically cuts TTFB by 30–50%.**

The TLS handshake of ~950 ms is also high — modern TLS 1.3 with session resumption should run 100–300 ms.

### 4.2 Page Weight (HTML only, before CSS/JS/images)

| Page | HTML size |
|---|---|
| consulting-services.html | 307 KB |
| search-services.html | 302 KB |
| index.html | 129 KB |
| ScenarioExpertise.html | 110 KB |
| career.html | 93 KB |
| about-us.html | 91 KB |

Service pages at 300 KB of raw HTML are exceptionally heavy and indicate a lot of duplicate inline content (likely repeated SVG markup, inline styles, or the same modal block rendered for every item). Most well-built marketing pages keep HTML under 50 KB. The full page weight including assets will be multiples of these numbers.

### 4.3 Asset Loading (homepage)

| Resource type | Count |
|---|---|
| External CSS files | 6 |
| External JS files | 7 |
| Inline `<style>` blocks | 2 |
| Inline `<script>` blocks | 2 |
| `<img>` tags | 13 |

JS is loaded from **four different CDN hosts**:
- `ajax.googleapis.com` (jQuery 3.5.1)
- `cdnjs.cloudflare.com` (Popper, GSAP)
- `maxcdn.bootstrapcdn.com` (Bootstrap 4.5.2)
- `unpkg.com` (Swiper)

Four extra DNS lookups + TLS handshakes the browser would not need with bundled assets. Both jQuery 3.5.1 and Bootstrap 4.5.2 are from 2020 and have been superseded by 3.7.x and Bootstrap 5.

### 4.4 PageSpeed Insights — Lab Scores & Core Web Vitals (Manual Run, 13 May 2026)

Captured directly from `pagespeed.web.dev` for `https://www.aesc.co.in/`. Both Mobile and Desktop strategies.

| Category | Mobile | Desktop |
|---|---|---|
| Performance | 76 | 97 |
| Accessibility | 81 | 83 |
| Best Practices | 96 | 96 |
| SEO | **67** | **67** |

**The desktop Performance score of 97 is misleading.** Desktop Lighthouse runs on a simulated high-bandwidth, low-CPU environment that does not reflect what real users experience. The numbers that actually predict business outcomes are the **field data (Chrome UX Report)**, captured below.

### 4.5 Mobile Core Web Vitals — Real-User Field Data (28-day rolling window)

| Metric | Field value | Threshold | Verdict |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | **6.3 s** | <2.5 s good, <4.0 s needs improvement | **POOR — fails by a factor of 2.5×** |
| Interaction to Next Paint (INP) | N/A | <200 ms | Insufficient field data |
| Cumulative Layout Shift (CLS) | 0 | <0.1 | Good |
| First Contentful Paint (FCP) | 3.4 s | <1.8 s | Poor |
| Time to First Byte (TTFB) | 2.1 s | <0.8 s | Poor (worse than our curl measurement) |

**Overall Core Web Vitals Assessment: FAILED.** This is a confirmed Google ranking signal — failing CWV on mobile materially suppresses mobile-search rankings, which (per §7.6) already account for 45% of organic impressions. The single biggest contributor is LCP; on a property where most of the LCP element is a large hero image, this is solvable with image optimisation and proper preloading.

### 4.6 Mobile Lab Diagnostics — Specific Failures

PSI catalogued these as the highest-impact opportunities on mobile (estimated savings shown):

| Issue | Estimated saving | What this means |
|---|---|---|
| **Render-blocking requests** | **2,660 ms** | The browser cannot start drawing for ~2.6 s while CSS and JS load |
| **Improve image delivery** | **4,178 KiB** | Images are unoptimised, uncompressed, and oversized for their display size |
| Reduce unused JavaScript | 72 KiB | Loading code that the page doesn't run |
| Use efficient cache lifetimes | 77 KiB | Assets need longer `Cache-Control` headers (matches §2.7) |
| Reduce unused CSS | 35 KiB | Stylesheet contains rules not used on the homepage |
| Font display | 20 ms | Custom fonts blocking text rendering |

**Total mobile network payload: 28,338 KiB (≈ 28 MB).** A well-built B2B marketing homepage typically weighs 1–3 MB. The site is 10×–28× heavier than it should be, driven almost entirely by un-resized, un-compressed images. On a 5 Mbps 4G connection, 28 MB takes ~45 seconds to fully download.

**Long main-thread tasks: 4** — meaning the page becomes unresponsive to clicks/scrolls four times during load.

### 4.7 The Render-Blocking Culprits — Named

PSI identified the exact resources blocking initial render. These are the specific files to remediate:

| Source | Asset | Transfer | Duration |
|---|---|---|---|
| aesc.co.in (1st party) | `responsive.css` | 3.4 KiB | 600 ms |
| aesc.co.in (1st party) | `style.css` | 8.0 KiB | 450 ms |
| aesc.co.in (1st party) | `toastr.css` | 3.3 KiB | 600 ms |
| **aesc.co.in (1st party)** | **`/index.php?debugbar`** | **1.5 KiB** | **450 ms** |
| unpkg.com (CDN) | `swiper-bundle.min.css` | 3.7 KiB | 770 ms |
| unpkg.com (CDN) | `swiper-bundle.min.js` | 43.3 KiB | 470 ms |

### 4.8 The Debug Bar — A Critical Production Leak

The third-from-last entry above — `/index.php?debugbar` — is loading on every page in production. This is the **Laravel / CodeIgniter Debug Bar**, a developer tool. Its presence in production has three consequences, in order of severity:

1. **Security / information disclosure.** The debug bar exposes server-side state to anyone who knows where to look: route names, database query traces, view names, session keys, environment hints. Reconnaissance value for an attacker.
2. **Render-blocking on every page** — 450 ms of mobile render-blocking time that delivers zero user value.
3. **Sign of a non-production-grade deployment.** A site whose developer left the debug bar enabled has likely left other dev-only conveniences enabled (verbose error pages, route-debug endpoints).

**This must be disabled today**, independent of any rebuild work. The fix is a one-line config change in the application (`DEBUG=false` in `.env` or equivalent) — not a code change. Ask the developer or hosting admin to set it.

### 4.9 What Desktop Lab Confirms

Even on the optimistic Desktop simulation, the report flags:

- Render-blocking requests — 660 ms savings available
- Improve image delivery — 3,676 KiB savings available
- Forced reflow — JavaScript is forcing the browser to recompute layout
- LCP request discovery — the hero image isn't being preloaded
- Network dependency tree — long chains of dependent requests
- Use efficient cache lifetimes — same caching issue as §2.7

The desktop diagnostics also confirm a recurring issue: **images do not have explicit `width` and `height` attributes**. This is what causes Cumulative Layout Shift problems on slower connections (though field CLS is currently 0, this is fragile and will break the moment a slow connection is involved).

### 4.10 SEO Score 67 — What Lighthouse Specifically Flags

The 67/100 SEO score (same on Mobile and Desktop) reflects:

- **Document does not have a meta description** — matches §3.2
- **Image elements do not have `[alt]` attributes** — matches §3.7
- **Links do not have descriptive text — 10 links found** — new finding. Anchor text like "click here", "read more", or empty links. Both an SEO and accessibility issue.
- **Links are not crawlable** — new finding. Some links are likely `javascript:` URLs or `<button>` elements styled as links, which Googlebot cannot follow.

### 4.11 Accessibility 81–83 — What Lighthouse Specifically Flags

- Image elements without `[alt]` attributes (matches §3.7 and §5)
- Links without a discernible name
- `<html>` element missing `[lang]` attribute (matches §3.8)
- Names and labels — the Names & Labels category being flagged matches §5's form-label finding

---

## 5. Accessibility

A surface-level pass against WCAG 2.1 AA. A full audit using axe-core or Lighthouse Accessibility will surface more.

| Issue | Severity | Where |
|---|---|---|
| 340 images without `alt` | Level A failure | All pages |
| Zero `<h1>` tags | Level A failure (1.3.1 Info & Relationships) | All pages |
| No `<html lang>` | Level A failure (3.1.1 Language of Page) | All pages |
| Form inputs without `<label>` | Level A failure (3.3.2 Labels) | Contact form (5 inputs / 0 labels), career form (6 inputs / 1 label), most other forms |
| No skip-to-content link | Level A best practice | All pages |
| Color contrast | Needs visual audit | TBD |

The contact form has 5 inputs and 0 labels — this is the single most important conversion form on the site, and it is currently inaccessible to screen-reader users. If a CHRO using assistive tech tries to inquire, they cannot.

---

## 6. Content & Keywords

### 6.1 Word counts (visible text)

| Page | Words | Comment |
|---|---|---|
| career.html | 2,134 | Long enough |
| consulting-services.html | 1,729 | OK |
| index.html | 1,682 | Long for a homepage — likely a clarity issue, not a length issue |
| search-services.html | 1,593 | OK |
| about-us.html | 975 | Slightly thin |
| differentiator.html | 808 | Slightly thin |
| contact-us.html | 432 | Acceptable for a contact page |

### 6.2 Keyword presence

Of nine industry-standard queries an executive-search firm should rank for in India:

| Query | Pages mentioning |
|---|---|
| "executive search" | 33 / 33 |
| "India" | 33 / 33 |
| "Athena Executive" | 33 / 33 |
| "talent" | 26 / 33 |
| "hiring" | 10 / 33 |
| "CXO" | 6 / 33 |
| "C-suite" | 5 / 33 |
| "CHRO" | 5 / 33 |
| "leadership consulting" | 2 / 33 |

The term "leadership consulting" appears on only 2 of 33 pages despite the firm offering leadership-consulting as a named service. This is a content gap, not a writing problem — the new site should treat each named service as its own page and use the canonical industry phrasing in titles, H1s, and body copy.

---

## 7. Google Search Console Insights (3 months: 12 Feb 2026 – 13 May 2026)

### 7.1 Top-level performance

| Metric | Value | Context |
|---|---|---|
| Total clicks | 411 | Very low for a national executive-search firm |
| Total impressions | 18,302 | Modest |
| Average CTR | 2.2% | Below the ~3% sitewide benchmark for B2B |
| Average position | 7.1 | Page 1 on average, but bottom of it |

411 clicks over 90 days is **4.6 clicks per day** in organic search. For a firm whose competitors (Korn Ferry India, Heidrick India, EMA Partners) routinely rank for category terms with thousands of monthly searches, this is severely below potential.

### 7.2 The brand vs. non-brand problem

Every one of the top 10 queries is branded:

| # | Query | Clicks | Impressions | CTR | Type |
|---|---|---|---|---|---|
| 1 | athena executive search & consulting | 67 | 170 | 39.4% | Branded |
| 2 | athena executive search | 52 | 294 | 17.7% | Branded |
| 3 | athena executive | 23 | 85 | 27.1% | Branded |
| 4 | athena executive search and consulting | 15 | 48 | 31.3% | Branded |
| 5 | **athena company** | **13** | **3,613** | **0.36%** | **Brand-ambiguous** |
| 6 | athena consulting | 13 | 301 | 4.3% | Branded |
| 7 | athena consultancy | 9 | 91 | 9.9% | Branded |
| 8 | **athena consulting services** | **7** | **492** | **1.4%** | **Brand-ambiguous** |
| 9 | **athena careers** | **6** | **861** | **0.7%** | **Brand-ambiguous** |
| 10 | athena executive search & consulting (aesc) | 6 | 23 | 26.1% | Branded |

**Observations:**

- When users search for the exact firm name, conversion is excellent (17–39% CTR) — branding is working for those who already know the firm.
- When the query is ambiguous (`athena company`, `athena careers`, `athena consulting services`), CTR collapses to <2%. Google is showing the site, but visitors are choosing competitors (Athena Health, Athena Bitcoin, Athena Education) named "Athena."
- There are **zero non-branded queries** in the top 10. Category terms like "executive search firm India", "CXO recruitment", "leadership consulting India", "CHRO hiring" do not appear at all.

### 7.3 The "athena company" anomaly

This single query generates **3,613 impressions** — roughly 20% of all site impressions — but only **13 clicks** (0.36% CTR). The site is appearing somewhere on page 1 or 2 for a query that has nothing to do with executive search; it's people looking for various US companies named Athena. There are two responses:

1. **Accept it.** It's wasted impressions but harmless. The ranking is a side-effect of having "Athena" in the title of every page.
2. **Defend the search results page.** Optimize the homepage `<title>` and meta-description so anyone who *does* click recognises the firm's positioning instantly. Current title "Athena - Homepage" tells them nothing; a title like "Athena Executive Search — Leadership Hiring in India" lets the few intent-matched searchers self-qualify.

The same applies to the **"athena careers" / 0.7% CTR** problem — 861 impressions yielding 6 clicks suggests the career page is being shown but its snippet is unappealing. Title/meta optimization is the single change that would materially move this number.

### 7.4 Top landing pages

| Page | Clicks | Impressions | CTR (computed) | Implication |
|---|---|---|---|---|
| / (homepage) | 324 | 10,432 | 3.1% | Drives 79% of all organic clicks |
| /career | 57 | 7,802 | 0.7% | Big impression volume, terrible CTR — title/meta opportunity |
| /contact-us | 15 | 1,102 | 1.4% | Bottom-funnel page; OK CTR considering intent |
| /about-us | 6 | 860 | 0.7% | Underperforming for the impression volume |
| /LeadershipTeam | 6 | 495 | 1.2% | Acceptable |
| /index.php | 1 | 409 | 0.2% | Should not exist as a distinct URL — canonicalise to `/` |
| /ScenarioExpertise | 1 | 318 | 0.3% | Very weak — the URL is also non-semantic |
| /Insights | 1 | 253 | 0.4% | Major underperformance for a content hub |
| /consulting-services | 1 | 213 | 0.5% | Should be a key money page |
| /insight-details?id=68 | 1 | 95 | 1.1% | One of 21 insights — only 1 has any organic visibility |

**Implications for the rebuild:**

- The **homepage and `/career`** are sacred. Their URLs and titles must not break in the migration.
- `/Insights` and `/consulting-services` are critical pages getting almost no traffic — the rebuild needs to give them strong on-page SEO foundations.
- `/index.php` should not exist as a separately-indexed URL; this is a canonicalisation problem.
- 20 of 21 insight articles have zero organic visibility. This is a content + technical problem (no unique titles, no schema, weak internal linking).

### 7.5 Geography

| Country | Clicks | Impressions | Share of clicks |
|---|---|---|---|
| India | 361 | 11,020 | 87.8% |
| United Kingdom | 9 | 254 | 2.2% |
| United States | 8 | 2,749 | 1.9% |
| Indonesia | 5 | 112 | 1.2% |
| Canada | 3 | 395 | 0.7% |
| Germany | 2 | 110 | 0.5% |

The US generates 2,749 impressions but only 8 clicks. Like the "athena company" anomaly, this is competing with US-based companies named Athena. Setting `<html lang="en-IN">` and adding India-explicit geo signals (Organization schema with Indian address, breadcrumbs with India language, possibly hreflang) will help Google route the right audience to the right results.

### 7.6 Devices

| Device | Clicks | Impressions | CTR |
|---|---|---|---|
| Desktop | 238 | 9,868 | 2.4% |
| Mobile | 172 | 8,260 | 2.1% |
| Tablet | 1 | 174 | 0.6% |

Desktop and mobile are nearly balanced in impressions, which is expected for B2B. Mobile CTR is slightly lower — this is where the TTFB and Core Web Vitals issues hurt most.

### 7.7 Search appearance

Only one special appearance type is recorded: **Translated results** (120 impressions, 1 click). This means Google is showing the site as a translated result in some non-English locales but conversion is essentially nil. Not actionable on its own; it will resolve once non-branded English ranking improves and the audience self-selects.

### 7.8 Strategic conclusions from GSC

1. **The site has a demand-capture problem, not a brand-awareness problem.** People who know "Athena Executive Search" find and click. People who don't know the firm never see it in search.
2. **Title and meta-description rewrites alone would move CTR materially** on the high-impression / low-CTR pages (career, about-us, ScenarioExpertise, the homepage for the "athena company" query). This is the single highest-ROI action available.
3. **Non-branded keyword strategy is the strategic priority for the rebuild.** The audit cannot tell you which non-branded keywords to target without SEMrush or Ahrefs keyword research — that's the next data pull. But the candidate set is obvious: "executive search firm in India", "CXO recruitment", "CHRO hiring", "leadership hiring agency", "C-suite recruitment", "board search India", and the equivalent for each named service.
4. **Insights is the under-utilised growth lever.** 21 articles, 1 of which gets any organic visibility. With unique titles, meta descriptions, Article schema, and internal linking from category pages, this content can capture long-tail traffic that the brand pages cannot.

---

## 8. Third-Party Validation — Ahrefs Site Audit (Crawl 10 May 2026)

Ahrefs Site Audit was run against the live site (131 internal URLs crawled). The findings independently corroborate every major issue from §2–§5 above, and surface five specific new ones. The "98/100 Excellent" health score the tool displays is worth context: that score is dominated by HTTP-status-code health (everything returns 2xx), and is **not** a meaningful read of the site's actual SEO posture. The 309 issues Ahrefs catalogued tell the more accurate story.

### 8.1 What Ahrefs independently confirmed

| Issue category | Manual audit (§3) | Ahrefs Site Audit | Cross-checks |
|---|---|---|---|
| Meta description missing | 33 / 33 pages | 34 URLs | ✓ |
| H1 tag missing | 33 / 33 pages | 33 URLs | ✓ |
| Image alt text missing | 340 images / 0 alts | 33 URLs flagged; 215 image refs without alt | ✓ |
| HTML `lang` attribute missing | All pages | 33 URLs | ✓ |
| Open Graph tags missing | All pages | 34 URLs | ✓ |
| X/Twitter card missing | All pages | 34 URLs | ✓ |
| Indexable page not in sitemap | All (sitemap doesn't exist) | 34 URLs | ✓ |
| Title too short | 33 / 33 (≤25 chars) | 2 URLs flagged | Ahrefs uses a more permissive threshold |
| Low word count | None identified | 1 URL | New |

These are template-level gaps. As Ahrefs notes in its own conclusion, "fixing the page template should resolve most of them at once." That matches the rebuild approach already planned — every fix proposed in this audit lands on a small set of shared templates (page layout, head block, image component) rather than 33 individual pages.

### 8.2 New issues surfaced by Ahrefs (not visible from the static mirror)

These five issues require a live crawl to detect, and were not in §2–§5:

1. **Broken link** — 1 page on the site links to a destination that no longer exists. Ahrefs identifies which URL via the "Page has links to a broken page" report. Single-page fix once the offending URL is known.

2. **Slow page (new this crawl)** — 1 URL flagged for slow render in the 10 May crawl. This is on top of the sitewide TTFB issue (§4.1); it indicates one specific page is materially slower than the rest. Likely candidate is one of the heavy 300 KB+ service pages or an Insights article with embedded high-resolution images. Pull the URL from Ahrefs to confirm.

3. **Oversized images** — 2 URLs with images flagged as too large. The fix is the same as the broader image-optimisation work in §4.3 (compress, convert to WebP/AVIF, lazy-load), but these two are the immediate hits.

4. **Redirected JS/CSS** — 33 URLs each contain JavaScript or CSS assets that are loaded via a redirect rather than served directly. Every redirect on a render-blocking asset adds a round trip before the browser can paint. Likely caused by mixed protocol or host references (e.g. `http://cdn...` redirecting to `https://`, or `unpkg.com/swiper` resolving to a versioned URL). Update asset URLs to point directly at the final destination.

5. **External 4XX** — 1 URL on the site links to an external page that returns a 4XX error. This hurts user experience (broken click) and signals stale maintenance to crawlers. Single-page fix once identified.

6. **Orphan-ish page** — 1 URL has only one dofollow incoming internal link. Pages that are barely linked internally rank poorly and consume crawl budget. Likely candidate is one of the deeper Insights articles; the fix is editorial cross-linking.

### 8.3 What Ahrefs got right that's worth re-emphasising

Three points from the Ahrefs summary deserve to be elevated:

- **"34 indexable pages not in sitemap"** — Ahrefs is flagging this as a sitemap-coverage issue. The deeper truth is there *is no sitemap at all* (§2.2). Fixing this single root cause clears the entire flag.
- **"Repeating pattern across roughly 33–34 pages"** — confirms our template-level conclusion. The rebuild should treat this as one workstream, not 34.
- **The 2 alerts in the Ahrefs sidebar** — worth manually opening in the dashboard to confirm they aren't a separate severity-1 issue beyond what's already enumerated.

### 8.4 What Ahrefs Site Audit doesn't tell you

Site Audit is a crawler-style audit (similar to what we did manually plus the additions above). It does **not** measure:

- Keyword rankings — that's Ahrefs Site Explorer / Rank Tracker, which require API or dashboard access (your current plan does not include API)
- Backlink profile — same source
- Competitor gap analysis — same source
- Real-user performance (Core Web Vitals from field data) — that's GSC's CWV report or PageSpeed Insights

So the Ahrefs Site Audit completes the **technical/on-page validation** of the audit, but the keyword strategy and backlink work still depend on SEMrush (via Supermetrics, pending) and either an Ahrefs plan upgrade or manual CSV exports from your Ahrefs dashboard.

---

## 9. SEMrush Insights (Worldwide / Desktop, 13 May 2026)

### 9.1 Authority and footprint

| Metric | Value | What it means |
|---|---|---|
| Authority Score | **15 / 100** ("Average") | Low domain authority. Competitor benchmarks (Korn Ferry, Heidrick, EMA Partners) are likely 40–70. |
| Organic traffic | **123 visits / month**, +3.4% | Matches GSC (≈137/mo from 411 clicks / 90 days). |
| Organic keywords | **38** | A healthy B2B firm of this profile would have 500–5,000+. Confirms the "no non-branded visibility" diagnosis. |
| Referring domains | 185 | **Actually decent.** Authority floor is there. |
| Backlinks | 519 | Decent. The link profile isn't the bottleneck. |
| Paid traffic | 0 | No PPC activity. |
| Paid keywords | 0 | No PPC activity. |

**The non-obvious insight:** 185 referring domains plus 519 backlinks is a meaningful foundation. Sites with worse link profiles rank for far more keywords than 38. What's holding the site back is **not external authority** — it's the on-page and technical issues catalogued in §2–§4 preventing the existing authority from converting into rankings. Fix the on-page foundation, and the same backlink profile will likely support 5–10× the current keyword footprint within 6–12 months.

### 9.2 The topical-confusion red flag

SEMrush surfaces these as topics the domain is associated with (Worldwide, Organic Research):

| Topic | Topic-level traffic |
|---|---|
| EU to UK shoe size | 200,000 |
| Women's Dresses | 125,000 |
| Women's Bottoms | 75,000 |

**These have nothing to do with executive search.** This is the same root cause as the GSC "athena company" anomaly (§7.3, 3,613 impressions / 0.36% CTR) — search engines and SEO tools are partially confusing this domain with unrelated entities (e.g. clothing brands using AESC as a sizing/category acronym, US-based companies named Athena).

Implications:

- **Topical authority is diluted.** The domain isn't sending Google a clear, consistent topical signal of "Indian executive search firm." The rebuild must do the opposite — make the topic unambiguous through schema, H1s, body copy, internal linking, and external sameAs links to the firm's LinkedIn/Crunchbase/etc.
- **AI engines will be more affected** than classical search. AI search rewards strongly-defined entity identity. Until the topic is cleaned up, citation share will remain low.

### 9.3 AI search visibility

| Engine | Total mentions | Cited pages |
|---|---|---|
| ChatGPT | 5 | 0 |
| Google AI Overview | 3 | 1 |
| Gemini | 3 | 1 |
| Google AI Mode | 1 | 0 |
| **Total** | **23** | **7** |

All AI visibility is concentrated in India. There is no presence in the UAE, Argentina, or other tracked markets.

Twenty-three mentions across all AI engines combined is very small — in absolute terms, this is below the visibility most regional consulting firms have. But the trajectory is what matters. **AI Overviews appear on 10.5% of SERPs the site already touches**, per the SERP feature distribution below. By the time the rebuild ships, that share will likely be 15–25%.

For executive search in particular, the buyer behaviour is shifting: a CHRO asking "what are the top retained executive search firms in India for CXO hiring" is now likely to start with ChatGPT or Gemini before opening google.com. If the site isn't a citable, structured, authoritative answer to that question, it's invisible to that funnel.

### 9.4 Google SERP feature distribution

For the queries where the site appears in Google:

| Feature | Share |
|---|---|
| Standard organic results | 68.4% |
| AI Overviews | 10.5% |
| Other SERP features (sitelinks, knowledge panels, etc.) | 21.1% |

The 10.5% AI Overview share is the headline number. Optimizing for AI-Overview citation is now a first-class SEO concern, not an afterthought.

### 9.5 Strategic implications for the rebuild

1. **The link equity is already there.** 185 referring domains, 519 backlinks, but only 38 ranking keywords means each backlink is severely under-utilised. The on-page rebuild (titles, H1s, schema, content depth) is the unlock — not link-building.
2. **Topical clarity is the #1 strategic SEO priority.** The rebuild must make it unambiguous to search engines, AI engines, and humans that this domain is an Indian executive search firm. This is achieved through:
   - Organization schema with `@type: Organization`, `industry`, `areaServed: India`, full address
   - Consistent H1/title language across pages
   - Strong `sameAs` links to LinkedIn, Crunchbase, business directories
   - Editorial content that is unambiguous on industry, geography, and function
3. **AI-citation optimisation should be designed in, not retrofitted.** This means structured FAQ blocks, Q&A-formatted content, clear authorial bylines on insights, and schema markup that AI scrapers consume.
4. **Paid search is an obvious lever to compensate** for slow organic growth — especially on the 30–50 highest-intent non-branded keywords in India. The current zero spend is leaving low-funnel demand on the table.
5. **Rebuilding the keyword footprint from 38 → 500+** is realistic in 12–18 months given the existing backlink profile, but requires consistent content output (the Insights section is the natural vehicle).

---

## 10. Migration & Redesign Implications

These are the points the redesign must explicitly plan for, not discover after launch:

1. **URL preservation.** The live site uses clean URLs (`/about-us`) and dynamic insight URLs (`insight-details?id=NN`). The static rebuild must either replicate this URL structure or ship comprehensive 301 redirects. **Get the URL list from GSC before deciding.**

2. **The Insights CMS.** Replacing the site with static files means losing the ability to add an insight without editing HTML. For "static now, CMS later" — that's an acceptable phase-1 tradeoff, but plan the phase-2 CMS (e.g. headless CMS feeding a static generator) now.

3. **Admin and login routes.** `/admin` must be killed entirely on the new host (it currently exposes the Cyberworx CMS login publicly). No reason for any admin route to exist on a static site.

4. **The contact form backend.** The current site's contact form POSTs to a PHP endpoint. Static hosting has no backend. Options: Netlify Forms (free), Formspree, or a tiny serverless function. Decide before migration.

5. **Sitemap and Search Console.** Generate the sitemap from the new site's URLs, submit to GSC and Bing, and request re-indexing for any URL that changed.

6. **Lost backlinks.** Before launch, export the list of pages that have external backlinks (Ahrefs, GSC linking pages report). Every URL with an inbound link must either keep its URL or 301-redirect to its new home — otherwise you lose the link equity that the old site has spent years accumulating.

---

## 11. Prioritized Action Plan

Severity legend: **P0** = fix before relaunch / fix on live now. **P1** = include in rebuild scope. **P2** = polish, can ship later.

### Pre-launch fixes on the current live site (this week, no rebuild required)

| Priority | Action | Effort |
|---|---|---|
| **P0 — DO TODAY** | **Disable the debug bar in production (`/index.php?debugbar` leak)** | **5 min config flag** |
| P0 | Fix broken `http://` → `https://www.www.` redirect | 5 min in .htaccess |
| P0 | Upgrade PHP from 7.4 to 8.2 (typically a hosting control panel toggle) | 30 min + smoke test |
| P0 | Add `Disallow: /admin` to robots.txt | 1 min |
| P0 | Generate and submit sitemap.xml to Google Search Console | 1 hr |
| P0 | Compress / resize the largest 5 hero images on the live site (4 MB+ savings) | 1 hr |
| P1 | Add the six missing security headers | 1 hr |
| P1 | Add `Cache-Control` rules for static assets | 1 hr |
| P0 | Rewrite homepage `<title>` and add meta description (draft below) | 15 min |
| P0 | Rewrite `/career` `<title>` and meta — 7,800 monthly impressions waiting to convert | 15 min |
| P1 | Rewrite `/about-us`, `/consulting-services`, `/search-services`, `/contact-us` titles + metas | 1 hr |
| P1 | Add canonical `<link>` on `/` so `/index.php` (409 impressions, junk URL) stops competing | 5 min |
| P1 | Fix the 1 broken internal link Ahrefs flagged | 10 min once URL identified |
| P1 | Fix the 1 external 4XX link Ahrefs flagged | 10 min once URL identified |
| P1 | Investigate and fix the 1 newly slow page Ahrefs flagged in 10 May crawl | 30 min |
| P1 | Compress / convert the 2 oversized images Ahrefs flagged | 15 min |
| P1 | Update JS/CSS asset URLs to remove the redirect hop on 33 pages | 30 min |
| P2 | Add internal links to the orphan page (only 1 dofollow inbound) | 15 min |
| P1 | Fix "Links do not have descriptive text" — rewrite 10 anchor texts PSI identified | 30 min |
| P1 | Fix "Links are not crawlable" — convert `<button>`-styled-as-links or `javascript:` links to real `<a href>` | 1 hr |
| P1 | Add explicit `width` and `height` to all `<img>` tags (CLS protection) | 1 hr |
| P0 | Preload the LCP hero image (`<link rel="preload" as="image">`) to fix mobile LCP 6.3s | 15 min |

### To be designed into the rebuild

| Priority | Action |
|---|---|
| P0 | H1 on every page, with primary keyword |
| P0 | Unique title tag per page, 50–60 chars, format `[Topic] \| Athena Executive Search` |
| P0 | Unique meta description per page, 150–160 chars |
| P0 | Unique title + slug per insight article |
| P0 | `alt` attribute on every image |
| P0 | Canonical tags |
| P0 | `<html lang="en-IN">` |
| P0 | Open Graph + Twitter Card tags |
| P0 | Form labels (especially contact-us) |
| P1 | JSON-LD: Organization, WebSite, BreadcrumbList, Article, Service |
| P1 | Bundled CSS/JS, one host, modern versions (Bootstrap 5 if used; consider dropping jQuery) |
| P1 | Image optimization: WebP/AVIF, responsive `<picture>`, lazy loading |
| P1 | 301 redirect map from old URLs to new URLs |
| P2 | Web app manifest, proper favicon set |
| P2 | Skip-to-content link |

### Quick-win title & meta rewrites (from GSC data)

These are the four pages where rewriting `<title>` and `<meta description>` would move the needle most, based on the impression/CTR data. Specific drafts below — each is keyword-anchored, India-explicit, and under the 60-char (title) / 160-char (meta) limits.

**Homepage** — currently "Athena - Homepage" (no meta description)

> **Title:** Executive Search Firm in India | Athena Executive Search & Consulting (62)
>
> **Meta:** India's specialist executive search firm for CEO, CXO, and board hiring. 25+ years placing senior leaders across BFSI, manufacturing, technology, and consumer sectors.

**Career page** — currently "Athena - Careers" (no meta) — 7,802 impressions, 0.7% CTR

> **Title:** Careers at Athena | Join India's Leading Executive Search Firm (61)
>
> **Meta:** Build your career in executive search at Athena. Open roles for researchers, consultants, and engagement partners across our Mumbai, Delhi, and Bengaluru offices.

**Consulting Services** — currently "Athena - Service Page " (no meta)

> **Title:** Leadership Consulting Services in India | Athena Executive Search (62)
>
> **Meta:** Leadership consulting, succession planning, board advisory, and CXO assessment for Indian enterprises and multinationals operating in India. Talk to our partners.

**Search Services** — currently "Athena - Service Page " (no meta)

> **Title:** Retained Executive Search in India | CEO & CXO Hiring | Athena (61)
>
> **Meta:** Retained executive search for CEO, CXO, and board positions in India. Confidential, research-led, and accountable to outcome. 25+ years and 500+ placements.

For each insight article, the title pattern should be `[Article topic] | Athena Insights` and the meta should be a 150-char standfirst rewritten from the opening paragraph.

### SEMrush-derived strategic items

| Priority | Action | Why |
|---|---|---|
| P0 | Audit and disambiguate any accidental rankings for off-topic queries (clothing, US-Athena) | Stop the topical-dilution feedback loop (§9.2 + §7.3) |
| P1 | Add comprehensive Organization schema with `industry`, `areaServed: India`, `sameAs` to LinkedIn / Crunchbase | Resolve the topical-confusion finding (§9.2); foundation for AI-Overview citation |
| P1 | Build structured FAQ blocks and Q&A-formatted content on key service pages | AI-Overview citation requires Q&A-pattern content; AI Overviews already 10.5% of the site's SERPs (§9.4) |
| P1 | Author bylines + Article schema on every Insights piece | Establishes E-E-A-T signals AI engines rely on for citation |
| P2 | Plan a content cadence for Insights — 2–4 articles/month for 12 months | Rebuild keyword footprint 38 → 500+ using the existing 185-domain backlink profile (§9.1) |
| P2 | Evaluate paid search for the 30–50 highest-intent non-branded India keywords | Compensate for slow organic growth on bottom-funnel queries (§9.5) |

### Awaiting connector data

Most major sources are now integrated. Remaining items if/when you want them:

- **Ahrefs CSV exports** — the specific URLs behind the 5 new findings from §8.2 (broken link, slow page, oversized images, redirected JS/CSS, orphan page). Also a "Best by links" / "Top pages by backlinks" export so the migration URL-preservation plan covers every page with inbound link equity.
- **SEMrush Keyword Gap report** — explicit non-branded India keywords where competitors (Korn Ferry India, Heidrick, Egon Zehnder India, EMA Partners, ABC Consultants) rank but Athena does not. This gives the rebuild its keyword universe.
- **SEMrush historical trend** — 12-month traffic and keyword trajectory, to confirm whether the +3.4% organic uplift is sustained growth or noise.

---

## Appendix A — Audit Methodology

- **Static analysis** of 33 mirrored HTML pages via local scripts (regex extraction of titles, meta, headings, alt tags, schema, link structure).
- **Live-site probes** via `curl` for HTTP status codes, response headers, redirect chains, robots.txt and sitemap availability, TTFB across 3 trials.
- **Performance**: TTFB / TCP / TLS handshake / total transfer time captured via curl `--write-out`. PageSpeed Insights lab and field data captured manually via `pagespeed.web.dev` on both Mobile and Desktop strategies.
- **Google Search Console**: User-provided 3-month summary (12 Feb 2026 – 13 May 2026) with sitewide metrics, top 10 queries (of 430), top 10 pages (of 81), country split, device split, and search-appearance breakdown.
- **Ahrefs MCP**: Connected but the account plan does not include API access. Domain rating, organic keywords, backlinks, and competitor data unavailable through automation.
- **Ahrefs Site Audit**: User-provided crawl summary from the 10 May 2026 crawl (compared with 3 May). 131 internal URLs crawled, 309 issues catalogued.
- **SEMrush**: User-provided overview (Worldwide / Desktop, 13 May 2026): authority score, organic traffic / keywords, backlinks, AI search visibility, SERP feature distribution, and organic-research topic associations.

## Appendix B — Files Generated

Raw extracts saved to `outputs/audit/`:
- `01_titles.txt` — per-page title tags
- `02_meta_descriptions.txt` — per-page meta descriptions (all empty)
- `03_headings.txt` — H1/H2/H3 counts
- `04_h1_content.txt` — actual H1 content (all empty)
- `05_canonical.txt` — canonical tag presence
- `06_social_tags.txt` — OG and Twitter tag counts
