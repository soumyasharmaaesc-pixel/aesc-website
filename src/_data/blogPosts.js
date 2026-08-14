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
  let client;
  try {
    client = getClient();
  } catch (err) {
    console.warn('[blogPosts] Sanity is not configured, continuing without posts:', err.message);
    return [];
  }

  let posts;
  try {
    posts = await client.fetch(QUERY);
  } catch (err) {
    // A transient Sanity/network failure must never take the build (or the dev
    // server) down. Return an empty list and let the templates render without posts.
    console.warn('[blogPosts] Sanity fetch failed, continuing without posts:', err.message);
    return [];
  }

  if (!Array.isArray(posts)) return [];

  return posts
    .filter((p) => p && p.slug && p.slug.current)
    .map((p) => ({
      ...p,
      url: `/insights/${p.slug.current}/`
    }));
}
