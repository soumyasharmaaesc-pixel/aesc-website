export default {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta title',
      description: 'Overrides page title in <title> and OG. Aim for ≤60 chars.',
      type: 'string',
      validation: (Rule) => Rule.max(70).warning('Longer titles get truncated in search results.'),
    },
    {
      name: 'metaDescription',
      title: 'Meta description',
      description: 'Shown in search results. Aim for ≤160 chars.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(180).warning('Longer descriptions get truncated.'),
    },
    {
      name: 'ogImage',
      title: 'Social share image',
      description: 'Defaults to heroImage if empty. 1200×630 recommended.',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    },
    {
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL override',
      description: 'Rare. Only use if this content is re-published elsewhere.',
      type: 'url',
    },
  ],
}
