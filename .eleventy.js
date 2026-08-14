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
  eleventyConfig.addPassthroughCopy({ "src/sitemap.xml": "sitemap.xml" });
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
    "src/thehirehub-partnership.html": "thehirehub-partnership.html"
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
