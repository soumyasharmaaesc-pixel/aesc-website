# Content Brief — aesc.co.in Rebuild

**Project:** Full redesign of www.aesc.co.in, phase 1 (static site)
**Date:** 13 May 2026
**Author:** Bhavishya Sharma
**Status:** Draft v1
**Companion documents:** `aesc-audit-2026-05.docx` (full audit), `developer-brief-live-site-fixes.docx` (current-site fixes)

---

## How to use this document

This brief is the input for whoever writes the new copy and whoever designs/builds the rebuild. For each page on the new site you'll find: page purpose, target reader, primary keyword, title tag, meta description, H1, section outline, internal-link plan, schema spec, and conversion goal.

The first three sections (sitewide standards, URL strategy, sitewide schema) apply to every page and should be implemented as templates / partials in whatever stack the rebuild uses. The page-by-page section then specifies what each page does differently.

Where the audit (`aesc-audit-2026-05.docx`) produced specific data, that data is cited inline by section number. Particularly important sources:

- **GSC data** (§7 of audit) — which existing pages drive traffic and must keep their URLs
- **SEMrush data** (§9 of audit) — keyword opportunity and topical-identity issues
- **Ahrefs Site Audit** (§8 of audit) — template-level issues already catalogued

---

## 1. Sitewide standards

### 1.1 Brand naming and disambiguation

The single most important content rule comes from §9.2 of the audit: **the site has a topical identity problem.** Search engines and AI engines are partially confusing this domain with US-based companies named Athena and (per SEMrush) with apparel-sizing content. Every page on the new site must reinforce the unambiguous identity:

> **Athena Executive Search & Consulting is a retained executive search and leadership consulting firm headquartered in India.**

Repeat this positioning, in slight variations, in:

- The `<title>` tag of every page (suffix with `| Athena Executive Search`)
- The first sentence of every page's main body copy
- The H1 of the homepage and About page
- The Organization schema (covered in §3 below)
- The footer of every page

Avoid using "Athena" alone without the qualifying "Executive Search" anywhere in indexable content — including image alt text, anchor text, and meta descriptions. Every mention should make the firm's category and geography unambiguous.

### 1.2 Voice and tone

Audience is CHROs, CEOs, board members, and senior HR leadership in India and at multinationals operating in India. Voice should be:

- **Confident, not boastful.** No "world-class", "best-in-class", "leading", "premier" without specific substantiation.
- **Specific over generic.** "500+ CXO placements across BFSI, manufacturing, technology, and consumer sectors" is better than "extensive experience across industries."
- **Outcome-led.** Talk about what gets done for the client, not about the firm's history or process.
- **Plain English.** No jargon for jargon's sake. The reader is senior enough not to be impressed by it.
- **Indian context.** Use Indian examples, Indian regulatory references, Indian salary bands. Don't write copy that could plausibly come from a Connecticut firm.

### 1.3 Title tag format

| Pattern | Length | Example |
|---|---|---|
| `[Primary keyword] \| [Modifier] \| Athena Executive Search` | ≤60 chars | `Executive Search Firm in India \| CXO Hiring \| Athena Executive Search` |
| For Insights: `[Article title] \| Athena Insights` | ≤60 chars | `Why Internal Promotion Fails Above the VP Level \| Athena Insights` |

Avoid:

- Brand-first patterns (`Athena - Homepage` style — that's exactly what's broken now)
- Trailing whitespace (currently present on service pages)
- Identical titles across pages (currently a problem on insight pages)

### 1.4 Meta description format

- 150–160 characters
- Include the primary keyword once
- Make it a value proposition, not a description of the page contents
- End with an implicit call to action ("Talk to our partners", "See our case studies", etc.) when natural
- Never leave empty

### 1.5 H1 format

- Exactly one H1 per page
- Contains the primary keyword (or a near-variant)
- Is a human-readable headline, not the brand name
- Distinct from the `<title>` tag — same idea, different phrasing

### 1.6 Image standards

Every editorial image must have:

- Descriptive `alt` text (purely decorative images use `alt=""`)
- Explicit `width` and `height` attributes (prevents layout shift, fixes the PSI CLS findings)
- Optimised file: max 1920 px wide, WebP format with JPEG fallback, target <200 KB per image
- Lazy loading (`loading="lazy"`) on everything below the fold

### 1.7 Internal link standards

- Anchor text should describe the destination (the "click here" / "read more" issue in PSI must not return)
- Every page should link to at least 3 other pages (avoids orphan-page problem from §8.2)
- Service pages should cross-link to relevant Insights articles
- Insights articles should link to relevant service pages and to 2–3 other Insights

### 1.8 What every page must have

A checklist that the templating system enforces for every page on the new site:

1. Unique `<title>` (50–60 chars)
2. Unique meta description (150–160 chars)
3. Exactly one `<h1>` containing the primary keyword
4. Canonical `<link rel="canonical">`
5. Open Graph tags (og:title, og:description, og:image, og:url, og:type)
6. Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
7. `<html lang="en-IN">`
8. Breadcrumb schema (except homepage)
9. Internal links to at least 3 other pages
10. All images have `alt`, `width`, `height`, lazy-loaded if below the fold

---

## 2. URL strategy

### 2.1 URLs to preserve verbatim

These URLs drive traffic and have inbound links. They must not change (or must 301 to their new home). Source: GSC top pages (§7.4 of audit).

| Current URL | Status | Action |
|---|---|---|
| `/` | 324 clicks / 90 days | **Preserve exactly** |
| `/career` | 57 clicks | **Preserve exactly** |
| `/contact-us` | 15 clicks | **Preserve exactly** |
| `/about-us` | 6 clicks | **Preserve exactly** |
| `/LeadershipTeam` | 6 clicks | Rename to `/our-team` and 301 redirect |
| `/Insights` | 1 click | Rename to `/insights` (lowercase) and 301 redirect |
| `/consulting-services` | 1 click | **Preserve exactly** |
| `/ScenarioExpertise` | 1 click | Rename to `/our-approach` and 301 redirect |
| `/search-services` | (in mirror, not GSC top 10) | **Preserve exactly** |
| `/differentiator` | (in mirror) | **Preserve exactly** |
| `/LifeatAthena` | (in mirror) | Rename to `/life-at-athena` and 301 redirect |
| `/index.php` | 409 impressions, 1 click | **301 to `/`** (canonicalisation) |

### 2.2 Insight article URLs

Current pattern: `/insight-details?id=NN` (query-string-based, non-semantic, all 21 share a duplicate `<title>`).

New pattern: `/insights/[slug]` where slug is a hyphenated lowercase phrase from the article title.

Migration approach: for every existing `insight-details?id=NN`, the developer must create a 301 redirect to the new slug URL. Map will be defined as part of the article rewrite work (separate sheet).

### 2.3 New URLs (v1)

| New URL | Page |
|---|---|
| `/our-team` | Leadership Team (renamed from LeadershipTeam) |
| `/life-at-athena` | Life at Athena (renamed from LifeatAthena) |
| `/our-approach` | Our Approach / Methodology (renamed from ScenarioExpertise) |
| `/insights` | Insights hub (renamed from Insights) |
| `/insights/[slug]` | Individual articles (replacing insight-details?id=NN) |

### 2.4 URLs to consider adding later (v2 — out of scope for static rebuild)

Mentioned for planning, not implementation now. These would address the SEMrush keyword-coverage gap (§9.1):

- `/services/cxo-search`
- `/services/ceo-search`
- `/services/chro-search`
- `/services/board-search`
- `/industries/bfsi`
- `/industries/manufacturing`
- `/industries/technology`
- `/industries/consumer`

---

## 3. Sitewide schema baseline

Every page on the new site must include the Organization schema below in the `<head>`. Service and article pages add their own type-specific schema on top.

### 3.1 Organization schema (in head of every page)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Athena Executive Search & Consulting",
  "alternateName": ["Athena Executive Search", "AESC India"],
  "url": "https://www.aesc.co.in",
  "logo": "https://www.aesc.co.in/assets/images/logo.png",
  "description": "Retained executive search and leadership consulting firm headquartered in India, specialising in CEO, CXO, CHRO, and board-level hiring across BFSI, manufacturing, technology, and consumer sectors.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[street]",
    "addressLocality": "[city]",
    "addressRegion": "[state]",
    "postalCode": "[postcode]",
    "addressCountry": "IN"
  },
  "areaServed": [{"@type":"Country","name":"India"}],
  "sameAs": [
    "https://www.linkedin.com/company/athena-executive-search",
    "https://www.crunchbase.com/organization/athena-executive-search",
    "[other directories the firm is listed in]"
  ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "[main number]",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["English","Hindi"]
  }],
  "foundingDate": "[YYYY]",
  "numberOfEmployees": {"@type":"QuantitativeValue","minValue":"[N]"}
}
```

This single block does more for the topical-identity problem (§9.2) than any other change.

### 3.2 WebSite schema (in head of every page, once)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Athena Executive Search & Consulting",
  "url": "https://www.aesc.co.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.aesc.co.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 3.3 BreadcrumbList schema (on every page except homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Home","item":"https://www.aesc.co.in/"},
    {"@type":"ListItem","position":2,"name":"[Section]","item":"https://www.aesc.co.in/[path]"}
  ]
}
```

---

## 4. Page-by-page brief

Twelve pages in v1. Each follows the same template below.

---

### 4.1 Home — `/`

| Field | Value |
|---|---|
| Page purpose | Single most important page. Establish who we are, what we do, who we do it for, and convert qualified visitors into inquiries. |
| Target reader | A CHRO or CEO who has heard the firm name and wants to verify legitimacy, OR a cold visitor evaluating the firm against competitors. |
| Page intent | Convince in 10 seconds that this is a serious Indian executive search firm; convert to "Book a call" or page deeper into a service. |
| Primary keyword | executive search firm in India |
| Secondary keywords | retained executive search, CXO hiring India, leadership consulting India, Athena Executive Search |
| Title tag | `Executive Search Firm in India \| Athena Executive Search & Consulting` (62 chars) |
| Meta description | `India's specialist executive search firm for CEO, CXO, and board hiring. 25+ years placing senior leaders across BFSI, manufacturing, technology, and consumer.` |
| H1 | `Senior Leadership Hiring, Done Right.` (or similar — H1 should be a hook, not the keyword verbatim) |
| Conversion goal | Click "Book a call" / "Talk to our partners" (primary), or scroll to one of the service pages (secondary) |
| Schema | Organization + WebSite + (optionally) Service summary blocks |
| GSC note | Drives 79% of all organic clicks. Receives 3,613 impressions for "athena company" — the title rewrite is the single most leveraged change in the audit. |

**Sections (top to bottom).**

1. Hero — Single H1, one supporting sentence, primary CTA ("Book a call"). India-explicit. Background image must be compressed (currently 1+ MB unoptimised — see audit §4.5).
2. The credibility line — 1-line stat: "25+ years. 500+ CXO placements. 4 offices across India." Pure numbers, no adjectives.
3. What we do — 3 cards, each a service: (a) Executive Search, (b) Leadership Consulting, (c) Scenario Expertise. Each card links to the relevant deeper page.
4. Industries we know — Sector strip: BFSI, Manufacturing, Technology, Consumer, Pharma/Healthcare, ER&D. Optional but high signal for the topical-identity problem.
5. Why Athena — 3 differentiators in plain English. Don't claim "best" — show specific operating differences.
6. Recent Insights — 3 featured insight cards, linking through to articles.
7. Trust signals — Logos of representative client companies (with permission), or membership in AESC (the global Association), or industry awards.
8. CTA block — Repeat the primary CTA with a sub-CTA ("Or browse our service offerings").
9. Footer — Address, contact, LinkedIn, sitemap, legal.

**Internal links from this page (minimum).**

- `/services/executive-search` (or `/search-services`)
- `/services/leadership-consulting` (or `/consulting-services`)
- `/our-approach`
- `/about-us`
- `/insights` (and 3 specific insight articles)
- `/contact-us`
- `/career`
- `/our-team`

---

### 4.2 About Us — `/about-us`

| Field | Value |
|---|---|
| Page purpose | Establish credibility, longevity, and team depth for visitors who are already on the funnel and want to know "who are these people." |
| Target reader | CHRO / CEO / talent partner researching the firm pre-engagement. |
| Page intent | Convert from "interested" to "qualified" — they should leave certain this is a legitimate, multi-decade Indian search firm with real partners. |
| Primary keyword | executive search firm India |
| Secondary keywords | about Athena Executive Search, retained search India |
| Title tag | `About Athena \| India's Specialist Executive Search Firm \| Athena Executive Search` (slightly long, trim to ~60) |
| Meta description | `Founded in [YYYY], Athena is an India-headquartered retained executive search firm with 25+ years and 500+ CXO placements. Meet the partners and the practice.` |
| H1 | `India's Specialist Executive Search & Leadership Consulting Firm` (or a more distinctive line — TBD) |
| Conversion goal | Click through to `/our-team` (partners) or `/contact-us` |
| Schema | Organization (sitewide) + Article (optional, for the narrative) |
| GSC note | 860 impressions but only 6 clicks (0.7% CTR). The current title is "Athena - About Us" (17 chars). Rewrite alone should 3–5× click rate. |

**Sections.**

1. H1 + one-paragraph positioning statement.
2. Our story — Brief history (founding year, founders, evolution to current scale). One short narrative paragraph.
3. By the numbers — 4 stats: years in business, CXO placements, industries served, offices.
4. Our practice areas — Brief description of executive search vs leadership consulting (each links to deeper page).
5. The team — Tile/grid linking through to `/our-team`. Show 4–6 most senior partners with name, role, brief bio.
6. Where we are — Offices (cities and full addresses for the schema). Particularly important for the India-identity signal.
7. Memberships / affiliations — Industry bodies, AESC (global association), Mastermind, etc.
8. CTA — "Talk to our partners" → `/contact-us`.

---

### 4.3 Executive Search — `/search-services`

| Field | Value |
|---|---|
| Page purpose | The primary money page. Explains retained executive search at Athena and converts qualified prospects. |
| Target reader | CHRO / CEO / Board member with a senior hire to make in the next 0–9 months. |
| Page intent | Communicate methodology, accountability, and outcomes; book a discovery call. |
| Primary keyword | retained executive search in India |
| Secondary keywords | CEO search, CXO search, CHRO recruitment, board search, C-suite hiring |
| Title tag | `Retained Executive Search in India \| CEO & CXO Hiring \| Athena` (61 chars) |
| Meta description | `Retained executive search for CEO, CXO, and board positions in India. Confidential, research-led, accountable to outcome. 25+ years and 500+ placements.` |
| H1 | `Retained Executive Search for CEO, CXO & Board Roles` |
| Conversion goal | Book a discovery call. |
| Schema | Service schema (`@type: Service`, `serviceType`, `provider`, `areaServed`) + FAQPage |
| GSC note | Currently 213 impressions / 1 click. Title is "Athena - Service Page " (note duplicate with consulting-services and trailing space). |

**Sections.**

1. H1 + positioning sentence.
2. Who we search for — CEO, COO, CFO, CHRO, CMO, CTO, business unit heads, board members. Bulleted or grid.
3. How we work — 4-step process: scoping → research → assessment → placement & beyond. Be specific. Each step gets 2–3 sentences of substance.
4. What's different about Athena — Concrete operating choices: e.g. "Every search is led by a partner — we don't hand searches off to associates", "Off-limits commitment", "Outcome-tied retainer structure", etc. 3–5 differentiators.
5. Sectors we know — Same sector strip as homepage, with sector-specific examples.
6. FAQ — 5–8 buyer questions (e.g. "How long does an executive search take?", "What's the difference between retained and contingent search?", "Do you guarantee placement?"). **This block is critical for AI Overview citation** (audit §9.3).
7. CTA — Book a call.
8. Related insights — 2–3 articles relevant to executive search.

---

### 4.4 Leadership Consulting — `/consulting-services`

| Field | Value |
|---|---|
| Page purpose | Money page #2. Describes the consulting practice — succession planning, leadership development, assessment, advisory. |
| Target reader | CHRO / Talent Head with a non-search problem (succession, capability gap, board advisory). |
| Page intent | Establish that Athena does more than search; book a discovery call. |
| Primary keyword | leadership consulting in India |
| Secondary keywords | succession planning, executive assessment, leadership development, board advisory |
| Title tag | `Leadership Consulting in India \| Succession & Advisory \| Athena Executive Search` (trim to ~60) |
| Meta description | `Leadership consulting, succession planning, executive assessment, and board advisory for Indian enterprises and multinationals in India. Talk to our partners.` |
| H1 | `Leadership Consulting Built for the Indian Context` |
| Conversion goal | Book a discovery call. |
| Schema | Service + FAQPage |
| Audit note | Currently the term "leadership consulting" appears on only 2 of 33 pages despite being a named service (§6.2). |

**Sections.**

1. H1 + positioning sentence.
2. Our consulting offerings — 4 clear offerings, each with 2-3 sentences:
   - Succession planning
   - Executive assessment
   - Leadership development & coaching
   - Board advisory
3. How we work — Brief methodology.
4. Who we work with — Sector strip + client-archetype description (mid-cap Indian enterprises, MNCs in India, family-owned businesses, PE portfolios).
5. Why Athena for consulting — Operating differentiators (similar pattern to the search page).
6. FAQ — Buyer questions specific to consulting (e.g. "How is succession planning different from search?", "What does a leadership assessment include?").
7. CTA.
8. Related insights.

---

### 4.5 Our Approach — `/our-approach` (was `/ScenarioExpertise`)

| Field | Value |
|---|---|
| Page purpose | The "how we think" page. Differentiates by methodology and intellectual approach. |
| Target reader | A sophisticated buyer who wants to understand Athena's actual operating model before engaging. |
| Page intent | Establish thought leadership and methodological depth. |
| Primary keyword | executive search methodology |
| Secondary keywords | scenario-based hiring, leadership assessment framework, executive search process |
| Title tag | `Our Approach to Executive Search \| Athena Executive Search` |
| Meta description | `Scenario-based research, structured assessment, and partner-led delivery. The methodology behind every search and consulting engagement at Athena.` |
| H1 | `How We Approach Senior Leadership Hiring` |
| Conversion goal | Read deeper / book a call. |
| Audit note | Current URL `/ScenarioExpertise` is non-semantic; rename to `/our-approach` with 301 redirect. |

**Sections.**

1. H1 + framing — "Every senior hire is unique; our method is consistent."
2. Our framework — Whatever the firm's actual methodology is. Likely 3–5 named steps with substance behind each.
3. Scenario expertise — If this is genuinely a unique IP, explain it. If it's a positioning concept, treat it as such honestly.
4. Tools and frameworks — Assessment frameworks, research approaches, etc.
5. CTA.

---

### 4.6 Our Team — `/our-team` (was `/LeadershipTeam`)

| Field | Value |
|---|---|
| Page purpose | Establish that real partners back the brand promise. Each partner is a credibility unit. |
| Target reader | Buyer doing diligence before engaging. |
| Page intent | Make the team feel substantive, specific, and senior. |
| Primary keyword | Athena Executive Search team |
| Secondary keywords | executive search partners India, [partner names] |
| Title tag | `Our Team \| Partners at Athena Executive Search` |
| Meta description | `Meet the partners and consultants leading senior executive search and consulting engagements across India. 4 offices, [N] partners, decades of practice.` |
| H1 | `The Partners Behind Every Search` |
| Conversion goal | Visit individual partner page (v2) or click through to `/contact-us`. |
| Schema | Per-person `Person` schema with `worksFor: Organization` |
| GSC note | 495 impressions, 6 clicks. Renaming to `/our-team` is friendlier; redirect from `/LeadershipTeam`. |

**Sections.**

1. H1 + one-paragraph framing — what role the team plays in the firm's work.
2. Partners grid — Each partner: photo, name, role, location, 2-3 line bio, LinkedIn link. **All photos must have alt text and explicit width/height** (audit §3.7, §4.9).
3. Consultants grid (separate from partners) — similar format, shorter bios.
4. (v2) Individual partner pages at `/our-team/[name-slug]` — out of scope for v1 unless explicitly desired.
5. CTA — Talk to a partner → `/contact-us`.

---

### 4.7 Career — `/career`

| Field | Value |
|---|---|
| Page purpose | Recruit researchers, consultants, and partners. Distinct audience from buyer pages. |
| Target reader | A consultant or researcher in another search firm considering a move; or a senior corporate HR professional looking to move into search. |
| Page intent | Sell the firm as a place to work; capture applications. |
| Primary keyword | careers at Athena Executive Search |
| Secondary keywords | executive search jobs India, search consultant career India |
| Title tag | `Careers at Athena \| Join India's Leading Executive Search Firm` (61 chars) |
| Meta description | `Build your career in executive search. Open roles for researchers, consultants, and engagement partners across our Mumbai, Delhi, and Bengaluru offices.` |
| H1 | `Build a Career in Executive Search` |
| Conversion goal | Click "View open roles" or submit an application. |
| Schema | JobPosting per role |
| GSC note | **Highest-leverage page in the audit.** 7,802 impressions, 0.7% CTR (§7.4). Title/meta rewrite alone should 3–5× clicks. |

**Sections.**

1. H1 + one-paragraph framing.
2. Why Athena — Compensation philosophy, culture, growth path. Specific.
3. Open roles — Each role: title, location, team, 3-bullet summary, "Apply" CTA. Use JobPosting schema.
4. Life at Athena cross-link — Card linking to `/life-at-athena`.
5. How we hire — Brief sketch of the firm's own hiring process (irony aside, this is information candidates want).
6. CTA — Submit a general application.

---

### 4.8 Life at Athena — `/life-at-athena` (was `/LifeatAthena`)

| Field | Value |
|---|---|
| Page purpose | Culture and atmosphere — supports the Career page; humanises the firm. |
| Target reader | Candidate considering applying; potential client wanting to "feel" the culture. |
| Page intent | Show, don't tell — photos, employee voices, day-in-the-life. |
| Primary keyword | life at Athena Executive Search (long-tail / branded) |
| Title tag | `Life at Athena \| Inside Our Practice` |
| Meta description | `The teams, offices, and rhythm of practice at Athena Executive Search. A look inside how we work, what we value, and the people who make it happen.` |
| H1 | `Inside Athena` |

**Sections.**

1. Hero photo + 1-paragraph framing.
2. Our values — 4–6 values, each with 1 specific behaviour that illustrates it.
3. Office moments — Photo grid, well-cropped.
4. Voices — 3–5 short quotes from team members.
5. CTA — View open roles → `/career`.

---

### 4.9 Our Differentiator — `/differentiator`

| Field | Value |
|---|---|
| Page purpose | Single page that argues "why Athena vs the alternatives." |
| Target reader | Comparison shopper evaluating Athena against Korn Ferry, Heidrick, EMA, ABC. |
| Page intent | Provide the substantive reasons for choice in one place. |
| Primary keyword | why choose Athena Executive Search |
| Secondary keywords | retained vs contingent search, partner-led search India |
| Title tag | `Why Athena \| What Makes Our Executive Search Different` |
| Meta description | `Partner-led searches, outcome-tied retainers, off-limits commitments, and an India-deep network. The four substantive differences in how Athena delivers.` |
| H1 | `What Makes Athena Different` |

**Sections.**

1. H1 + 1-paragraph framing.
2. The 4 differentiators — Each as its own section with substance:
   - Partner-led, not associate-led
   - Outcome-tied commercial model
   - Off-limits commitment
   - India-deep network and intelligence
3. What we don't do — Optional but strong: explicit "no" list (e.g. "We don't take contingent assignments", "We don't run high-volume mid-management recruiting", "We don't represent candidates").
4. CTA.

---

### 4.10 Insights Hub — `/insights` (was `/Insights`)

| Field | Value |
|---|---|
| Page purpose | Index page for all editorial content. Drives long-tail organic. |
| Target reader | Buyer doing pre-engagement research; ICP coming from social/LinkedIn share. |
| Page intent | Discoverability — give every article its best chance to be found. |
| Primary keyword | executive search insights India |
| Title tag | `Insights on Senior Leadership Hiring \| Athena Executive Search` |
| Meta description | `Research, perspectives, and commentary on CEO, CXO, and board hiring in India. From the partners at Athena Executive Search.` |
| H1 | `Insights from the Practice` |
| Schema | CollectionPage + each article-card has microdata-style attribution |
| Audit note | Currently 21 articles, only 1 has any organic visibility (§7.4). Hub-page rebuild + per-article rewrites is a high-impact workstream. |

**Sections.**

1. H1 + 1-sentence framing.
2. Featured article — Most recent or editorially elevated.
3. Recent articles — Grid, paginated.
4. Topic filter — Tags / categories (e.g. CEO, CHRO, Succession, Sector-specific).
5. Newsletter capture — Lightweight email opt-in.

---

### 4.11 Insight Article (template) — `/insights/[slug]`

This is one page-type with N instances (currently 21, growing).

| Field | Value |
|---|---|
| Page purpose | Long-tail organic traffic + thought-leadership credibility. |
| Title tag | `[Article title] \| Athena Insights` — must be unique per article |
| Meta description | 150-char standfirst rewritten from the opening paragraph — unique per article |
| H1 | The article title (also unique) |
| Schema | Article (with `headline`, `author`, `datePublished`, `image`, `publisher`) + BreadcrumbList |
| Audit note | All 21 current articles share the title `Athena - News and Events` (§3.1) — fixing this is one of the top items in the audit. |

**Per-article required elements.**

- Unique slug derived from headline (e.g. `/insights/why-internal-promotion-fails-above-the-vp-level`)
- Unique `<title>` ≤60 chars
- Unique meta description 150–160 chars
- Visible byline (author name + role)
- Visible publication date
- Reading time estimate
- 2–3 internal links to other Insights and at least 1 to a service page
- Social share buttons (no JS-redirected ones — see audit §8.2)
- Article schema with all required fields

**Migration plan.**

For each of the 21 existing `insight-details?id=NN` URLs, the new site must:

1. Create the new `/insights/[slug]` page.
2. 301 redirect the old URL to the new one.
3. Update internal links in other pages to point to the new URL.

A separate worksheet should map each `id=NN` → headline → slug → status, and that map is the spec for the developer.

---

### 4.12 Contact Us — `/contact-us`

| Field | Value |
|---|---|
| Page purpose | Convert. Capture inquiries. |
| Target reader | Qualified prospect ready to talk. |
| Page intent | Make it trivially easy to reach the right person. |
| Primary keyword | contact Athena Executive Search |
| Title tag | `Contact Athena Executive Search \| Talk to Our Partners` |
| Meta description | `Reach Athena Executive Search & Consulting in Mumbai, Delhi, Bengaluru, and [city]. Phone, email, or contact form — we respond within one business day.` |
| H1 | `Talk to Our Partners` |
| Conversion goal | Form submission. |
| Schema | ContactPage + LocalBusiness (one per office) |
| GSC note | Currently 5 inputs and 0 labels (§5) — the audit's worst accessibility finding. Must be fixed. |
| Audit note | The form must POST to a real backend on the new static host (Netlify Forms, Formspree, or a small serverless function — see audit §9.4 of migration). |

**Sections.**

1. H1 + framing.
2. Inquiry form — Fields: name, email, company, phone (optional), nature of inquiry (dropdown: executive search / consulting / careers / press / other), message. **Every field must have a real `<label>`** (audit §5).
3. Offices — Card per office: address, phone, email, map link (Google Maps embed or static map image).
4. Press / media — Separate email address for press.
5. LinkedIn block — Link to firm page.
6. Acknowledgement — "We respond within one business day."

---

## 5. Implementation sequence

Suggested order for the rebuild work, once this brief is approved:

1. **Set up the new static host** (Netlify or Cloudflare Pages) and deploy the current mirror as v0 baseline. This gives a real preview URL to share with stakeholders.
2. **Build the template system** — header / footer / nav / `<head>` block with all the sitewide schema, OG/Twitter tags, canonical, lang attribute. Once the template is right, applying it to every page is trivial.
3. **Build the homepage first.** Highest-traffic page. Validate the design system on the page that matters most.
4. **Build the two service pages** (Executive Search, Leadership Consulting). These are the money pages.
5. **Build the rest of the static pages** (About, Differentiator, Our Approach, Our Team, Life at Athena, Career, Contact).
6. **Build the Insights hub + the article template** — then rewrite the 21 existing articles into the new template (this is a content workstream, not just a build workstream).
7. **Build the 301 redirect map** — every old URL → new URL.
8. **Smoke test** — every page, every link, all forms, mobile + desktop, PageSpeed Insights on each page.
9. **DNS cutover** — point `aesc.co.in` at the new host.
10. **Submit new sitemap to GSC**, request reindexing of the homepage and `/career`.

---

## 6. Out of scope (deliberately deferred to v2)

- Industry-specific landing pages (BFSI, Manufacturing, Technology, Consumer)
- Function-specific landing pages (CEO Search, CXO Search, CHRO Search, Board Search)
- Individual partner profile pages at `/our-team/[name-slug]`
- A proper headless CMS for the Insights section
- Multi-language support (Hindi)
- Live chat / inquiry widget
- Case studies / engagement stories (most search firms can't publish these — confidentiality)
- Compensation benchmark tool, talent-market reports, or other lead magnets

If any of these become must-have for v1, scope and timeline will shift accordingly.

---

## Open questions for sign-off

Before writing copy to this brief:

1. **Confirm office locations** for the schema and contact page.
2. **Confirm partner roster** for `/our-team`.
3. **Confirm the 4 differentiators** — what does the firm actually want to claim as differentiated?
4. **Decide the v2 cutoff** — anything in §6 that should move into v1?
5. **Decide CMS path for Insights** — static HTML for v1 is fine, but the long-term plan should be defined now (Sanity / Contentful / Hugo / Astro markdown / etc.).
6. **Decide the contact-form backend** — Netlify Forms, Formspree, or a serverless function.
