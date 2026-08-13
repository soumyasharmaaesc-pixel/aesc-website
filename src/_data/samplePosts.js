/* ------------------------------------------------------------------
   SAMPLE / PLACEHOLDER POSTS  —  for layout preview only.
   These are NOT real Athena articles.
   Set SHOW_SAMPLES = false (or publish real posts in Sanity) before
   the site goes live, so placeholder content never reaches clients.
------------------------------------------------------------------- */
const SHOW_SAMPLES = false;   // flip to true only for local layout previews

const samples = [
  { title: "Why the strongest CXO candidates never apply",
    excerpt: "The leaders worth hiring are employed, discreet and not reading job posts. Reaching them changes how a search has to be run.",
    category: "Executive Search", readTime: 6, publishedAt: "2026-08-04",
    heroUrl: "/assets/images/about-hero.png", slug: "why-the-strongest-cxo-candidates-never-apply", topic: "talent-and-hiring" },
  { title: "Five questions that reveal how a leader handles dissent",
    excerpt: "Composure under challenge is the hardest thing to test in an interview, and the most predictive of what happens in year two.",
    category: "Assessment", readTime: 5, publishedAt: "2026-07-28",
    heroUrl: "/assets/images/differentiator-hero.png", slug: "questions-that-reveal-how-a-leader-handles-dissent", topic: "talent-and-hiring" },
  { title: "India entry: building the first leadership team",
    excerpt: "The first three hires set the ceiling for everything that follows. What global businesses consistently underestimate.",
    category: "India Entry", readTime: 7, publishedAt: "2026-07-21",
    heroUrl: "/assets/images/scenario-expertise-hero.png", slug: "india-entry-building-the-first-leadership-team", topic: "markets-and-expansion" },
  { title: "What boards get wrong about succession",
    excerpt: "Most succession plans are a list of names. A plan is a readiness assessment, a development path and a timeline.",
    category: "Board & Succession", readTime: 6, publishedAt: "2026-07-14",
    heroUrl: "/assets/images/consulting-services-hero.png", slug: "what-boards-get-wrong-about-succession", topic: "leadership-and-boards" },
  { title: "Pricing a role you have never hired before",
    excerpt: "Compensation benchmarking is not a salary survey. It is a comparator pool built for the specific mandate in front of you.",
    category: "Compensation", readTime: 5, publishedAt: "2026-07-07",
    heroUrl: "/assets/images/search-services-hero.png", slug: "pricing-a-role-you-have-never-hired-before", topic: "rewards-and-inclusion" },
  { title: "Diverse slates without lowering the bar",
    excerpt: "Widening the pool and holding the standard are not in tension. The tension sits in how early you start the mapping.",
    category: "Diversity", readTime: 5, publishedAt: "2026-06-30",
    heroUrl: "/assets/images/insights-hero.png", slug: "diverse-slates-without-lowering-the-bar", topic: "rewards-and-inclusion" },
  { title: "The landing plan that runs to month twelve",
    excerpt: "Most leadership hires fail long after the offer. What a proper onboarding plan covers, quarter by quarter.",
    category: "Onboarding", readTime: 6, publishedAt: "2026-06-23",
    heroUrl: "/assets/images/contact-us-hero.png", slug: "the-landing-plan-that-runs-to-month-twelve", topic: "leadership-and-boards" },
  { title: "Reading a market map before you open a search",
    excerpt: "Talent mapping tells you whether the role you have written can actually be filled, and what it will cost if it can.",
    category: "Talent Mapping", readTime: 5, publishedAt: "2026-06-16",
    heroUrl: "/assets/images/banner-slide-1.png", slug: "reading-a-market-map-before-you-open-a-search", topic: "markets-and-expansion" },
];

export default function () {
  if (!SHOW_SAMPLES) return [];
  return samples.map((p) => ({
    ...p,
    isSample: true,
    category: { title: p.category },
    url: "/insights/",
  }));
}
