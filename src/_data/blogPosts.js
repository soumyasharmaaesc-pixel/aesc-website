import { getClient } from '../_lib/sanityClient.js';

const QUERY = `
  *[_type == "blogPost" && !(_id in path("drafts.**")) && publishedAt <= now() && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    heroImage,
    "category": category->{title, "slug": slug.current},
    tags,
    "author": author->{name, "slug": slug.current, headshot},
    body,
    seo
  }
`;

export default async function () {
  const client = getClient();
  const posts = await client.fetch(QUERY);
  return posts.map((p) => ({
    ...p,
    url: `/insights/${p.slug.current}/`
  }));
}
