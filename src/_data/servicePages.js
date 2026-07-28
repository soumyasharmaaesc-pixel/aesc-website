import { getClient } from '../_lib/sanityClient.js';

const QUERY = `
  *[_type == "servicePage" && !(_id in path("drafts.**")) && defined(slug.current)]
  | order(title asc) {
    _id,
    title,
    slug,
    role,
    heroHeading,
    intro,
    whoWeSearchFor,
    process,
    differentiators,
    "sectors": sectors[]->{title, "slug": slug.current},
    faqs,
    "relatedInsights": relatedInsights[]->{title, "slug": slug.current},
    seo
  }
`;

export default async function () {
  const client = getClient();
  let pages;
  try {
    pages = await client.fetch(QUERY);
  } catch (err) {
    throw new Error(`servicePages: Sanity fetch failed — ${err.message}`);
  }
  return pages.map((p) => ({
    ...p,
    url: `/services/${p.slug.current}/`,
  }));
}
