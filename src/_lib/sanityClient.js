import { createClient } from '@sanity/client';
import 'dotenv/config';

let cached = null;

export function getClient() {
  if (cached) return cached;
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_READ_TOKEN;

  if (!projectId) {
    throw new Error('SANITY_PROJECT_ID is required (see .env.example)');
  }

  cached = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: true
  });
  return cached;
}

// Test hook — resets memoisation between tests.
export function _resetClientCache() {
  cached = null;
}
