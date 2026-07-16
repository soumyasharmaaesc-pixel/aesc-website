import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import { load } from 'cheerio';

describe('Phase 1 build smoke', () => {
  beforeAll(() => {
    // Rebuild fresh. Requires .env with real SANITY_* values.
    rmSync('dist', { recursive: true, force: true });
    execSync('npm run build', { stdio: 'inherit' });
  }, 120_000);

  it('emits pass-through pages unchanged', () => {
    expect(existsSync('dist/about-us.html')).toBe(true);
    expect(existsSync('dist/index.html')).toBe(true);
    expect(existsSync('dist/differentiator.html')).toBe(true);
    expect(existsSync('dist/assets/css/style.css')).toBe(true);
    expect(existsSync('dist/Insights.html')).toBe(true);
  });

  it('emits the Insights listing page', () => {
    const path = 'dist/insights/index.html';
    expect(existsSync(path)).toBe(true);
    const $ = load(readFileSync(path, 'utf8'));
    expect($('title').text()).toMatch(/Insights/i);
    expect($('.insights-div').length).toBeGreaterThan(0);
    expect($('header nav li').length).toBeGreaterThan(3); // nav rendered
  });

  it('emits at least one blog post detail page', () => {
    // The seed post from Task 6 should be present.
    const path = 'dist/insights/local-dev-smoke-test-post/index.html';
    expect(existsSync(path)).toBe(true);
    const $ = load(readFileSync(path, 'utf8'));
    expect($('h2').first().text()).toContain('Local Dev Smoke Test');
    expect($('link[rel="canonical"]').attr('href'))
      .toBe('https://www.aesc.co.in/insights/local-dev-smoke-test-post/');
    expect($('meta[property="og:type"]').attr('content')).toBe('article');
  });

  it('does NOT touch admin/upload legacy tree', () => {
    // admin/ lives at repo root and is not in src/, so it must not appear in dist/
    expect(existsSync('dist/admin')).toBe(false);
  });
});
