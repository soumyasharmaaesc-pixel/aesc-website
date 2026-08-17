export default {
  name: 'talentSubmission',
  title: 'Talent Network Submission',
  type: 'document',
  // Submissions are written by the website, not authored by hand.
  __experimental_actions: ['update', 'publish', 'delete'],
  fields: [
    { name: 'fullName',   title: 'Full name',        type: 'string' },
    { name: 'email',      title: 'Email',            type: 'string' },
    { name: 'phone',      title: 'Phone / WhatsApp', type: 'string' },
    { name: 'location',   title: 'Current location', type: 'string' },
    { name: 'company',    title: 'Current company',  type: 'string' },
    { name: 'jobTitle',   title: 'Current title',    type: 'string' },
    { name: 'experience', title: 'Total experience', type: 'string' },
    { name: 'notice',     title: 'Notice period',    type: 'string' },
    { name: 'areaOfInterest', title: 'Area of interest', type: 'string' },
    { name: 'linkedin',   title: 'LinkedIn profile', type: 'url' },
    { name: 'note',       title: 'Candidate note',   type: 'text', rows: 4 },
    { name: 'resume',     title: 'Resume / CV',      type: 'file' },
    {
      name: 'status', title: 'Status', type: 'string',
      initialValue: 'new',
      options: { list: [
        { title: 'New',        value: 'new' },
        { title: 'Reviewed',   value: 'reviewed' },
        { title: 'Shortlisted',value: 'shortlisted' },
        { title: 'Placed',     value: 'placed' },
        { title: 'Archived',   value: 'archived' }
      ]}
    },
    { name: 'submittedAt', title: 'Submitted at', type: 'datetime', readOnly: true },
    { name: 'source',      title: 'Source page',  type: 'string',  readOnly: true },
    { name: 'consent',     title: 'Consented to Talent Network', type: 'boolean', readOnly: true }
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'fullName', subtitle: 'jobTitle', company: 'company', status: 'status' },
    prepare({ title, subtitle, company, status }) {
      return {
        title: title || '(no name)',
        subtitle: [subtitle, company].filter(Boolean).join(' at ') + (status ? '  ·  ' + status : '')
      }
    }
  }
}
