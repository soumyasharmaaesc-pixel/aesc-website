import { getClient } from '../_lib/sanityClient.js';

const QUERY = `
  *[_type == "industryPage" && !(_id in path("drafts.**")) && defined(slug.current)]
  | order(title asc) {
    _id,
    title,
    slug,
    sector,
    heroHeading,
    intro,
    challenges,
    "roles": roles[]->{title, "slug": slug.current},
    faqs,
    seo
  }
`;

export default async function () {
  const client = getClient();
  let pages;
  try {
    pages = await client.fetch(QUERY);
  } catch (err) {
    throw new Error(`industryPages: Sanity fetch failed — ${err.message}`);
  }
  return pages.map((p) => ({
    ...p,
    url: `/industries/${p.slug.current}/`,
  }));
}
