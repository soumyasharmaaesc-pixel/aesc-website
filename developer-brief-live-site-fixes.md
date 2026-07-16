# Developer Brief — Live-Site Emergency Fixes for aesc.co.in

**To:** Site developer / hosting administrator
**From:** Bhavishya Sharma, Athena Executive Search
**Date:** 13 May 2026
**Priority:** P0 (item 1 — today). Remainder this week.

---

## Summary

A full SEO and performance audit of `aesc.co.in` (full report `aesc-audit-2026-05.docx`) identified eight issues that need fixing on the live site immediately. **None of these require application code changes** — they are all config-level fixes (`.env`, `.htaccess`, hosting control panel, image optimisation). Total estimated effort: 3–4 hours.

The site rebuild is a separate, larger project. The items in this brief are the things we want corrected on the existing site before the rebuild ships, because they are either security risks, are actively suppressing search rankings, or are trivially cheap to fix.

Items are listed in priority order. After each fix, the **Verify** step shows exactly how to confirm it worked.

---

## 1. Disable the production debug bar (DO TODAY)

**Symptom.** Every page request on the live site loads `https://www.aesc.co.in/index.php?debugbar`. This is the application's debug-bar middleware (CodeIgniter / Laravel-style). It should never be enabled in production.

**Why it matters.**

- Exposes server-side state to anyone — route names, query traces, environment hints, view paths.
- Adds 450 ms of render-blocking time to every mobile page load (PageSpeed Insights confirmed).
- A clear sign the deployment was not hardened for production, which raises questions about what else is left enabled.

**Fix.** In the application's environment config:

```
APP_DEBUG=false
APP_ENV=production
```

For CodeIgniter 3, in `application/config/config.php`:

```php
$config['debug_bar'] = false;
```

For CodeIgniter 4, in `app/Config/Boot/production.php`, ensure `error_reporting(0)` and `display_errors = 'off'`.

**Verify.**

```
curl -s https://www.aesc.co.in/ | grep -c "debugbar"
```

Should return `0`. Also load any page in Chrome with DevTools Network tab open — no request to `index.php?debugbar` should appear.

---

## 2. Fix the broken HTTP → HTTPS redirect

**Symptom.** `http://www.aesc.co.in` currently 301-redirects to `https://www.www.aesc.co.in/` (note the double `www`). The TLS certificate does not cover `www.www.aesc.co.in`, so anyone following an old `http://` link gets a cert error.

**Test it now.**

```
curl -sI http://www.aesc.co.in/ | grep -i location
```

Currently returns `Location: https://www.www.aesc.co.in/`. Should return `Location: https://www.aesc.co.in/`.

**Fix (Apache `.htaccess`).** Replace any existing HTTP→HTTPS rewrite block with:

```apache
RewriteEngine On

# Force HTTPS and canonical www host
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^www\.aesc\.co\.in$ [NC]
RewriteRule ^(.*)$ https://www.aesc.co.in/$1 [R=301,L]
```

The bug in the current rule is almost certainly a `RewriteRule` that prepends `www.` to `%{HTTP_HOST}` regardless of whether `www.` is already there. The block above is hostname-explicit so it can't double-up.

**Verify.**

```
curl -sI http://www.aesc.co.in/
curl -sI http://aesc.co.in/
```

Both should return `Location: https://www.aesc.co.in/`.

---

## 3. Replace robots.txt

**Current content** (live):

```
User-agent: *
Crawl-Delay: 20
```

`Crawl-Delay: 20` instructs crawlers to wait 20 seconds between requests — Googlebot ignores this directive, but Bing honours it and is being artificially slowed. No sitemap reference. No disallow for `/admin`.

**Fix.** Replace `/robots.txt` with:

```
User-agent: *
Disallow: /admin/
Disallow: /admin
Disallow: /index.php?debugbar

Sitemap: https://www.aesc.co.in/sitemap.xml
```

**Verify.**

```
curl https://www.aesc.co.in/robots.txt
```

Should return the new content.

---

## 4. Generate and submit a sitemap

**Symptom.** `https://www.aesc.co.in/sitemap.xml` returns 404. All standard sitemap paths (sitemap_index.xml, sitemaps.xml, etc.) also return 404.

**Why it matters.** Google relies on sitemaps to discover and prioritise pages. Without one, indexing and discovery rely entirely on link crawling.

**Fix.** Generate `sitemap.xml` and place it at the document root. If the CMS has a built-in generator, use it. Otherwise, a static sitemap is fine — the site changes infrequently. Minimum content for the homepage entry:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aesc.co.in/</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- repeat <url> block for every public page: about-us, consulting-services,
       search-services, ScenarioExpertise, differentiator, career, contact-us,
       LeadershipTeam, LifeatAthena, Insights, and each insight-details URL -->
</urlset>
```

After deploying, submit to Google Search Console: <https://search.google.com/search-console> → property `aesc.co.in` → Sitemaps → Add a new sitemap → enter `sitemap.xml` → Submit.

Do the same in Bing Webmaster Tools: <https://www.bing.com/webmasters>.

**Verify.**

```
curl -s https://www.aesc.co.in/sitemap.xml | head -5
```

Should return XML, not the 404 HTML page.

---

## 5. Upgrade PHP from 7.4 to 8.2

**Symptom.** Server response header reads `x-powered-by: PHP/7.4.33`. PHP 7.4 reached end of life on **28 November 2022** — no security patches for 3+ years.

**Why it matters.** Security compliance, faster runtime (PHP 8.2 is roughly 2× faster than 7.4 on typical workloads), and the version is publicly disclosed. **Upgrading PHP alone typically cuts the site's TTFB by 30–50%.**

**Fix.** In the hosting control panel (cPanel / Plesk / GoDaddy Hosting Manager / etc.), there will be a "PHP Version" or "MultiPHP Manager" option. Select **PHP 8.2** (or 8.3 if available).

**Risk.** The CodeIgniter / Laravel codebase may use deprecated function signatures. Smoke-test all key pages after the switch:

- `/` (homepage)
- `/about-us`
- `/consulting-services`
- `/search-services`
- `/career` (forms post to backend)
- `/contact-us` (forms post to backend)
- `/admin` login → admin dashboard
- One `insight-details?id=NN` page

If anything breaks, switch back to 7.4 immediately and report the specific errors — most issues with the upgrade are trivial (deprecated `each()`, type-juggling in `==` comparisons) and fixable in minutes.

Also add this line so the PHP version stops being publicly disclosed (security hardening):

In `php.ini`:

```ini
expose_php = Off
```

**Verify.**

```
curl -sI https://www.aesc.co.in/ | grep -i powered
```

Should return empty (header absent).

---

## 6. Add the missing security headers

**Symptom.** None of the six standard HTTP security headers are being sent. PageSpeed Insights and a manual `curl -I` confirm.

**Fix.** Add to Apache `.htaccess`:

```apache
<IfModule mod_headers.c>
    Header set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
    Header unset X-Powered-By
    Header unset Server
</IfModule>
```

A Content-Security-Policy is also recommended but needs auditing of the current inline scripts/styles first — leave for the rebuild.

**Verify.**

```
curl -sI https://www.aesc.co.in/ | grep -iE "strict-transport|x-frame|x-content|referrer|permissions"
```

Should return all five.

---

## 7. Add cache headers for static assets

**Symptom.** Current `Cache-Control` header on HTML is `no-store, max-age=0, no-cache` — meaning every visitor refresh = full server hit. Static assets (CSS, JS, images) need their own long-cache rules.

**Fix.** In Apache `.htaccess`:

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault                       "access plus 1 month"

    # Long cache for hashed/static assets
    ExpiresByType image/jpeg             "access plus 1 year"
    ExpiresByType image/png              "access plus 1 year"
    ExpiresByType image/webp             "access plus 1 year"
    ExpiresByType image/avif             "access plus 1 year"
    ExpiresByType image/svg+xml          "access plus 1 year"
    ExpiresByType image/x-icon           "access plus 1 year"

    ExpiresByType text/css               "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType font/woff2             "access plus 1 year"
    ExpiresByType font/woff              "access plus 1 year"

    # Short cache for HTML so content updates are visible quickly
    ExpiresByType text/html              "access plus 1 hour"
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\.(jpg|jpeg|png|webp|svg|ico|woff2|woff|css|js)$">
        Header set Cache-Control "public, max-age=31536000"
    </FilesMatch>
</IfModule>
```

**Verify.**

```
curl -sI https://www.aesc.co.in/assets/css/style.css | grep -i cache
```

Should show `Cache-Control: public, max-age=31536000`.

---

## 8. Compress the 5 largest hero/banner images

**Symptom.** PageSpeed Insights reports mobile total network payload of 28 MB per page load, of which ~4 MB is unoptimised images. A well-built marketing page is 1–3 MB total.

**Where to find them.** Hero / slider / banner images are stored under `/admin/upload/home/banner/` and `/admin/upload/slider/`. The 5 largest by file size are the priority. Examples spotted in the mirror:

- `1637666049banner image 3.jpg`
- `1637672686banner-image-2.jpg`
- `1637666049banner imag1 .jpg`
- `1696926599_875156d4f7cd2cfbbf95.png`
- `1707399861_1c346daa871add79fedf.png`

**Fix.** For each large image:

1. Resize to a maximum of 1920 px wide (anything larger is wasted on a screen).
2. Re-export as JPEG at 80% quality, or convert to WebP at 80% quality (smaller and modern browsers all support it).
3. Upload the new file, replacing the original (keep an off-site backup of the originals).

Command-line option (ImageMagick):

```bash
convert "1637666049banner image 3.jpg" -resize 1920x -quality 80 "1637666049banner-image-3.jpg"
```

Web option (no install needed): <https://squoosh.app> — drag in, adjust, download.

Target: each image under 200 KB after compression.

**Verify.** Re-run PageSpeed Insights at <https://pagespeed.web.dev/analysis?url=https://www.aesc.co.in/>. The "Improve image delivery" estimated saving should drop from 4,178 KiB toward 500 KiB or less.

---

## Acceptance criteria — how we'll know everything worked

After all 8 items are deployed, the following should all hold:

| Check | Expected result |
|---|---|
| `curl -s https://www.aesc.co.in/ | grep -c debugbar` | `0` |
| `curl -sI http://www.aesc.co.in/ | grep -i location` | `Location: https://www.aesc.co.in/` |
| `curl https://www.aesc.co.in/robots.txt` | Returns the new robots.txt above, with sitemap reference |
| `curl -s https://www.aesc.co.in/sitemap.xml | head -1` | `<?xml version="1.0" ...>` |
| `curl -sI https://www.aesc.co.in/ | grep -i powered` | empty (no `x-powered-by` header) |
| `curl -sI https://www.aesc.co.in/ | grep -i strict-transport` | `Strict-Transport-Security: max-age=...` present |
| Sitemap submitted in GSC | "Success" status |
| PSI mobile Performance score | ≥85 (currently 76) |
| PSI mobile Best Practices score | ≥96 (no change expected) |
| PSI mobile SEO score | ≥75 (currently 67) — full 95+ comes with the rebuild |

---

## Suggested timeline

| When | Items |
|---|---|
| **Today** | 1 (debug bar), 2 (redirect), 3 (robots.txt) |
| **This week** | 4 (sitemap), 5 (PHP upgrade), 6 (security headers) |
| **Next week** | 7 (caching), 8 (image compression) |

Total developer time: ~3–4 hours of work. None of it touches application code; all are config-level changes that can be rolled back trivially if anything goes wrong.

---

## Questions / blockers

If any of the above is blocked by hosting-plan limits, current developer involvement, or backwards-compatibility concerns, flag specifically which item and why — most have a workaround. The debug bar (#1) is the only one with no acceptable delay.
