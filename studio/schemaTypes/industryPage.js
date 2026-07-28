export default {
  name: 'industryPage',
  title: 'Industry page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      description: 'Internal + <title> fallback, e.g. "Executive Search for BFSI in India".',
      type: 'string',
      validation: (Rule) => Rule.required().min(4).max(160),
    },
    {
      name: 'slug',
      title: 'Slug',
      description: 'URL segment under /industries/, e.g. "bfsi".',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sector',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          {title: 'BFSI', value: 'bfsi'},
          {title: 'Manufacturing', value: 'manufacturing'},
          {title: 'Technology', value: 'technology'},
          {title: 'Consumer', value: 'consumer'},
          {title: 'Pharma / Healthcare', value: 'pharma'},
          {title: 'ER&D', value: 'erd'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heroHeading',
      title: 'Hero heading (H1)',
      type: 'string',
      validation: (Rule) => Rule.required().min(8).max(120),
    },
    {
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(40),
    },
    {
      name: 'challenges',
      title: 'Sector leadership challenges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string', validation: (R) => R.required()},
            {name: 'body', title: 'Body', type: 'text', rows: 2, validation: (R) => R.required()},
          ],
          preview: {select: {title: 'heading', subtitle: 'body'}},
        },
      ],
    },
    {
      name: 'roles',
      title: 'Roles we place in this sector',
      description: 'References to service pages, for the cross-link strip.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'servicePage'}]}],
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'question', title: 'Question', type: 'string', validation: (R) => R.required()},
            {name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (R) => R.required()},
          ],
          preview: {select: {title: 'question'}},
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'sector'},
  },
}
