import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getClient, _resetClientCache } from '../../src/_lib/sanityClient.js';

describe('getClient', () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    _resetClientCache();
    process.env.SANITY_PROJECT_ID = 'testproj';
    process.env.SANITY_DATASET = 'production';
    process.env.SANITY_READ_TOKEN = 'sk-test';
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns a client configured with env vars', () => {
    const client = getClient();
    expect(client.config().projectId).toBe('testproj');
    expect(client.config().dataset).toBe('production');
    expect(client.config().useCdn).toBe(true);
    expect(client.config().apiVersion).toBe('2024-01-01');
  });

  it('throws if SANITY_PROJECT_ID is missing', () => {
    delete process.env.SANITY_PROJECT_ID;
    expect(() => getClient()).toThrow(/SANITY_PROJECT_ID/);
  });
});
