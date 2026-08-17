import { createClient } from '@sanity/client';

/**
 * Receives Talent Network submissions and stores them in Sanity.
 *
 * Requires these environment variables in Vercel (Project -> Settings -> Environment Variables):
 *   SANITY_PROJECT_ID    - same value already used for the site build
 *   SANITY_DATASET       - production
 *   SANITY_WRITE_TOKEN   - a token with Editor permissions (create it in sanity.io/manage)
 *
 * The write token must NEVER appear in client-side code. It only lives here, on the server.
 */

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

const MAX_LEN = 4000;
const clean = (v) => (typeof v === 'string' ? v.trim().slice(0, MAX_LEN) : '');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const projectId = process.env.SANITY_PROJECT_ID;
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !token) {
    console.error('[talent-submission] Sanity env vars missing');
    return res.status(500).json({ ok: false, error: 'Storage is not configured yet.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});

  // Honeypot: real people leave this hidden field empty. Bots fill it in.
  if (clean(body.company_website)) {
    return res.status(200).json({ ok: true });   // look successful, store nothing
  }

  const fullName = clean(body.name);
  const email = clean(body.email);
  if (!fullName || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'A name and a valid email are required.' });
  }

  const client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    token,
    apiVersion: '2024-01-01',
    useCdn: false
  });

  try {
    const doc = {
      _type: 'talentSubmission',
      fullName,
      email,
      phone: clean(body.phone),
      location: clean(body.location),
      company: clean(body.company),
      jobTitle: clean(body.title),
      experience: clean(body.experience),
      notice: clean(body.notice),
      areaOfInterest: clean(body.function),
      linkedin: clean(body.linkedin),
      note: clean(body.note),
      status: 'new',
      consent: true,
      source: clean(body.source) || 'career.html',
      submittedAt: new Date().toISOString()
    };

    // Optional CV, sent as a base64 data URL by the browser.
    if (typeof body.resume === 'string' && body.resume.startsWith('data:')) {
      const match = body.resume.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const buffer = Buffer.from(match[2], 'base64');
        if (buffer.length <= 5 * 1024 * 1024) {
          const asset = await client.assets.upload('file', buffer, {
            filename: clean(body.resumeName) || (fullName.replace(/\s+/g, '-') + '-cv'),
            contentType: match[1]
          });
          doc.resume = { _type: 'file', asset: { _type: 'reference', _ref: asset._id } };
        }
      }
    }

    await client.create(doc);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[talent-submission] failed:', err && err.message);
    return res.status(500).json({ ok: false, error: 'We could not save that. Please try again.' });
  }
}

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
