import 'dotenv/config';
import { getClient } from './src/_lib/sanityClient.js';
const client = getClient();
const posts = await client.fetch(`*[_type=="blogPost" && defined(slug.current)]|order(publishedAt desc){title,"cat":category->title,"tags":tags,"slug":slug.current,publishedAt,excerpt}`);
console.log("TOTAL:", posts.length);
for (const p of posts) {
  console.log("----");
  console.log("title:", p.title);
  console.log("cat  :", p.cat, "| tags:", (p.tags||[]).join(", "));
  console.log("slug :", p.slug, "| date:", p.publishedAt);
  if (p.excerpt) console.log("exc  :", String(p.excerpt).slice(0,120));
}
