export default {
  name: 'contactSubmission',
  title: 'Website Enquiry',
  type: 'document',
  fields: [
    { name: 'name',    title: 'Name',    type: 'string' },
    { name: 'email',   title: 'Email',   type: 'string' },
    { name: 'phone',   title: 'Phone',   type: 'string' },
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'help',    title: 'How can we help', type: 'string' },
    { name: 'role',    title: 'Role',    type: 'string' },
    { name: 'country', title: 'Country', type: 'string' },
    { name: 'website', title: 'Website', type: 'string' },
    { name: 'subject', title: 'Subject', type: 'string' },
    { name: 'model',   title: 'Partnership model', type: 'string' },
    { name: 'message', title: 'Message', type: 'text', rows: 5 },
    { name: 'status', title: 'Status', type: 'string', initialValue: 'new',
      options: { list: [
        { title: 'New', value: 'new' },
        { title: 'Replied', value: 'replied' },
        { title: 'Qualified', value: 'qualified' },
        { title: 'Closed', value: 'closed' }
      ]}},
    { name: 'submittedAt', title: 'Submitted at', type: 'datetime', readOnly: true },
    { name: 'source', title: 'Source page', type: 'string', readOnly: true }
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', company: 'company', status: 'status' },
    prepare: ({ title, company, status }) => ({
      title: title || '(no name)',
      subtitle: [company, status].filter(Boolean).join('  \u00b7  ')
    })
  }
}
