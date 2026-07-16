import { toHTML } from '@portabletext/to-html';
import imageUrlBuilder from '@sanity/image-url';
import { getClient } from './sanityClient.js';

let cachedBuilder = null;
function builder() {
  if (cachedBuilder) return cachedBuilder;
  cachedBuilder = imageUrlBuilder(getClient());
  return cachedBuilder;
}

export function imageUrl(image, opts = {}) {
  if (!image || !image.asset) return '';
  let b = builder().image(image).auto('format');
  if (opts.w) b = b.width(opts.w);
  if (opts.q) b = b.quality(opts.q);
  return b.url();
}

const components = {
  block: {
    h2: ({ children }) => `<h2>${children}</h2>`,
    h3: ({ children }) => `<h3>${children}</h3>`,
    h4: ({ children }) => `<h4>${children}</h4>`,
    blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
    normal: ({ children }) => `<p>${children}</p>`
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || '#';
      const external = /^https?:\/\//.test(href) && !href.includes('aesc.co.in');
      const rel = external ? ' rel="noopener noreferrer"' : '';
      const target = external ? ' target="_blank"' : '';
      return `<a href="${href}"${rel}${target}>${children}</a>`;
    },
    strong: ({ children }) => `<strong>${children}</strong>`,
    em: ({ children }) => `<em>${children}</em>`
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return '';
      const src = imageUrl(value, { w: 1200 });
      const alt = value.alt || '';
      const caption = value.caption
        ? `<figcaption>${value.caption}</figcaption>`
        : '';
      return `<figure><img src="${src}" alt="${alt}" loading="lazy">${caption}</figure>`;
    }
  }
};

export function renderPortableText(blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return '';
  return toHTML(blocks, { components });
}
