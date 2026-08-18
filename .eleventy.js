import { renderPortableText, imageUrl } from './src/_lib/portableText.js';

// Node 15+ terminates the process on an unhandled promise rejection. During
// `--serve` that silently kills the dev server mid-session, so a transient
// network blip while fetching CMS data takes the whole preview down. Log and
// keep running instead.
process.on('unhandledRejection', (reason) => {
  console.warn('[eleventy] Unhandled rejection (kept alive):', reason && reason.message ? reason.message : reason);
});


export default function (eleventyConfig) {
  // Nunjucks filters for blog templates
  eleventyConfig.addFilter('portableText', renderPortableText);
  eleventyConfig.addFilter('imageUrl', (img, opts) => imageUrl(img, opts || {}));
  eleventyConfig.addFilter('date', (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images/favicon.ico": "favicon.ico" });

  eleventyConfig.setTemplateFormats(["njk", "html"]);

  // Pass-through hand-authored HTML pages (they contain {{ }} in JS strings
  // that would confuse Nunjucks — treat them as raw copies for now).
  eleventyConfig.addPassthroughCopy({
    "src/about-us.html": "about-us.html",
    "src/career.html": "career.html",
    "src/case-studies.html": "case-studies.html",
    "src/resources.html": "resources.html",
    "src/consulting-services.html": "consulting-services.html",
    "src/contact-us.html": "contact-us.html",
    "src/differentiator.html": "differentiator.html",
    "src/index.html": "index.html",
    "src/LeadershipTeam.html": "LeadershipTeam.html",
    "src/LifeatAthena.html": "LifeatAthena.html",
    "src/news.html": "news.html",
    "src/executive-search.html": "executive-search.html",
    "src/board-member-search.html": "board-member-search.html",
    "src/diversity-search.html": "diversity-search.html",
    "src/talent-mapping.html": "talent-mapping.html",
    "src/market-intelligence.html": "market-intelligence.html",
    "src/compensation-benchmarking.html": "compensation-benchmarking.html",
    "src/persona-due-diligence.html": "persona-due-diligence.html",
    "src/india-entry.html": "india-entry.html",
    "src/international-expansion.html": "international-expansion.html",
    "src/transformation-transition.html": "transformation-transition.html",
    "src/ScenarioExpertise.html": "ScenarioExpertise.html",
    "src/search-services.html": "search-services.html",
    "src/thehirehub-partnership.html": "thehirehub-partnership.html",
    "src/partnerships.html": "partnerships.html"
  });


  // ---- Generated sitemap -------------------------------------------------
  // Built from what actually shipped, deduplicated by each page's own canonical
  // URL. Eleventy writes every .html twice (foo.html and foo/index.html), so
  // trusting the canonical is what keeps one entry per real page.
  eleventyConfig.on('eleventy.after', async ({ dir, results }) => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { execSync } = await import('node:child_process');

    const SITE = 'https://www.aesc.co.in';
    const OUT = dir.output;

    // On the dev server Eleventy rebuilds only the changed template. Regenerating
    // from a partial result set would overwrite the sitemap with a single URL,
    // so only rebuild it on a full build.
    const isFullBuild = !results || results.length === 0 || results.length > 5;
    if (!isFullBuild) return;

    // Never index: build leftovers, internal previews, placeholder content.
    const SKIP = [/_map-preview/i, /^Insights\.html$/, /smoke-test/i, /local-dev/i];

    const walk = (d, acc = []) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) walk(f, acc);
        else if (e.name.endsWith('.html')) acc.push(f);
      }
      return acc;
    };

    const lastmod = (rel) => {
      for (const cand of ['src/' + rel, 'src/' + rel.replace(/\/index\.html$/, '.html')]) {
        try {
          const iso = execSync(`git log -1 --format=%cs -- "${cand}"`, { encoding: 'utf8' }).trim();
          if (iso) return iso;
        } catch (e) {}
      }
      return new Date().toISOString().slice(0, 10);
    };

    const pages = new Map();   // canonical -> lastmod
    for (const file of walk(OUT)) {
      const rel = path.relative(OUT, file);
      if (SKIP.some((re) => re.test(rel))) continue;
      const html = fs.readFileSync(file, 'utf8');
      if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html)) continue;
      const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
      const url = m ? m[1] : SITE + '/' + rel.replace(/index\.html$/, '');
      if (!pages.has(url)) pages.set(url, lastmod(rel));
    }

    const priority = (u) =>
      u === SITE + '/' ? '1.0'
      : /(search-services|consulting-services|contact-us|partnerships)/.test(u) ? '0.9'
      : /(about-us|differentiator|ScenarioExpertise|career)/.test(u) ? '0.8'
      : '0.7';

    const body = [...pages.entries()].sort()
      .map(([u, d]) =>
        `  <url>\n    <loc>${u}</loc>\n    <lastmod>${d}</lastmod>\n    <priority>${priority(u)}</priority>\n  </url>`)
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
    try {
      const target = path.join(OUT, 'sitemap.xml');
      const tmp = target + '.tmp';
      fs.writeFileSync(tmp, xml);          // write then rename, so a reader never sees a half file
      fs.renameSync(tmp, target);
      console.log(`[sitemap] ${pages.size} unique pages written`);
    } catch (err) {
      // A sitemap failure must never take the build down.
      console.warn('[sitemap] could not write sitemap.xml:', err && err.message);
    }
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
