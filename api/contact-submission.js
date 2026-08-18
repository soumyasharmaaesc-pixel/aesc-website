import { createClient } from '@sanity/client';

/**
 * Contact + partnership enquiries.
 *
 * Two independent delivery paths, so an enquiry is never lost:
 *   1. Stored in Sanity as a contactSubmission document   (needs SANITY_WRITE_TOKEN)
 *   2. Emailed to info@aesc.co.in via Resend              (needs RESEND_API_KEY)
 *
 * If only one is configured the request still succeeds. If neither is, we return
 * an error so the browser falls back to opening the visitor's mail client.
 */

const TO = 'info@aesc.co.in';
const clean = (v) => (typeof v === 'string' ? v.trim().slice(0, 4000) : '');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  if (clean(body.company_website) || clean(body.fax_number)) {
    return res.status(200).json({ ok: true });          // honeypot: bot
  }

  const name = clean(body.name);
  const email = clean(body.email);
  if (!name || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'A name and a valid email are required.' });
  }

  const fields = {
    name,
    email,
    phone: clean(body.phone),
    company: clean(body.company),
    help: clean(body.help),
    role: clean(body.role),
    country: clean(body.country),
    website: clean(body.website),
    subject: clean(body.subject),
    model: clean(body.model),
    message: clean(body.message) || clean(body.note),
    source: clean(body.source) || 'contact-us.html'
  };

  let stored = false, mailed = false;

  // ---- 1. store ----
  if (process.env.SANITY_PROJECT_ID && process.env.SANITY_WRITE_TOKEN) {
    try {
      const client = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET || 'production',
        token: process.env.SANITY_WRITE_TOKEN,
        apiVersion: '2024-01-01',
        useCdn: false
      });
      await client.create({
        _type: 'contactSubmission',
        ...fields,
        status: 'new',
        submittedAt: new Date().toISOString()
      });
      stored = true;
    } catch (err) {
      console.error('[contact] sanity write failed:', err && err.message);
    }
  }

  // ---- 2. email ----
  if (process.env.RESEND_API_KEY) {
    try {
      const rows = Object.entries(fields)
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#5a6178">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`)
        .join('');
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'Athena Website <website@aesc.co.in>',
          to: [TO],
          reply_to: email,
          subject: `Website enquiry - ${name}${fields.company ? ' (' + fields.company + ')' : ''}`,
          html: `<h2 style="font-family:sans-serif">New enquiry from the website</h2>
                 <table style="font-family:sans-serif;font-size:14px">${rows}</table>`
        })
      });
      mailed = r.ok;
      if (!r.ok) console.error('[contact] resend failed:', r.status, await r.text());
    } catch (err) {
      console.error('[contact] resend error:', err && err.message);
    }
  }

  if (!stored && !mailed) {
    return res.status(500).json({ ok: false, error: 'Delivery is not configured yet.' });
  }
  return res.status(200).json({ ok: true, stored, mailed });
}

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
