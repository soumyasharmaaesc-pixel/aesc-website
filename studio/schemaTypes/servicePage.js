export default {
  name: 'servicePage',
  title: 'Service page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      description: 'Internal + <title> fallback, e.g. "Retained CEO Search in India".',
      type: 'string',
      validation: (Rule) => Rule.required().min(4).max(160),
    },
    {
      name: 'slug',
      title: 'Slug',
      description: 'URL segment under /services/, e.g. "ceo-search".',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role focus',
      type: 'string',
      options: {
        list: [
          {title: 'CEO Search', value: 'ceo'},
          {title: 'CXO Search', value: 'cxo'},
          {title: 'CHRO Search', value: 'chro'},
          {title: 'Board Search', value: 'board'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heroHeading',
      title: 'Hero heading (H1)',
      description: 'The one visible <h1>. Human headline, not the brand name.',
      type: 'string',
      validation: (Rule) => Rule.required().min(8).max(120),
    },
    {
      name: 'intro',
      title: 'Intro paragraph',
      description: 'First body sentence must reinforce the India + executive-search identity.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(40),
    },
    {
      name: 'whoWeSearchFor',
      title: 'Who we search for',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    },
    {
      name: 'process',
      title: 'How we work (steps)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'step', title: 'Step', type: 'string', validation: (R) => R.required()},
            {name: 'detail', title: 'Detail', type: 'text', rows: 2, validation: (R) => R.required()},
          ],
          preview: {select: {title: 'step', subtitle: 'detail'}},
        },
      ],
    },
    {
      name: 'differentiators',
      title: 'Differentiators',
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
      name: 'sectors',
      title: 'Sectors we know',
      description: 'References to industry pages, for the cross-link strip.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'industryPage'}]}],
    },
    {
      name: 'faqs',
      title: 'FAQs',
      description: 'Critical for AI Overview citation (audit §9.3). Aim for 5–8.',
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
      name: 'relatedInsights',
      title: 'Related insights',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'blogPost'}]}],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'role'},
  },
}
