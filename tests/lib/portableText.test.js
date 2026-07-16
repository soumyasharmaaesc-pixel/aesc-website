import { describe, it, expect } from 'vitest';
import { renderPortableText, imageUrl } from '../../src/_lib/portableText.js';

describe('renderPortableText', () => {
  it('renders a simple paragraph', () => {
    const blocks = [{
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: 'Hello world' }]
    }];
    const html = renderPortableText(blocks);
    expect(html).toContain('<p>Hello world</p>');
  });

  it('renders h2 headings', () => {
    const blocks = [{
      _type: 'block',
      style: 'h2',
      children: [{ _type: 'span', text: 'A heading' }]
    }];
    expect(renderPortableText(blocks)).toContain('<h2>A heading</h2>');
  });

  it('renders external links with rel=noopener', () => {
    const blocks = [{
      _type: 'block',
      style: 'normal',
      markDefs: [{ _key: 'l1', _type: 'link', href: 'https://example.com' }],
      children: [{ _type: 'span', text: 'click', marks: ['l1'] }]
    }];
    const html = renderPortableText(blocks);
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('returns empty string for empty input', () => {
    expect(renderPortableText([])).toBe('');
    expect(renderPortableText(null)).toBe('');
  });
});

describe('imageUrl', () => {
  const asset = {
    _type: 'image',
    asset: { _ref: 'image-abc123-800x600-jpg' }
  };

  it('builds a Sanity CDN URL with default query', () => {
    // Configure test env for image URL builder
    process.env.SANITY_PROJECT_ID = 'testproj';
    process.env.SANITY_DATASET = 'production';
    const url = imageUrl(asset);
    expect(url).toMatch(/cdn\.sanity\.io\/images\/testproj\/production\/abc123-800x600\.jpg/);
    expect(url).toContain('auto=format');
  });

  it('applies width override', () => {
    process.env.SANITY_PROJECT_ID = 'testproj';
    process.env.SANITY_DATASET = 'production';
    const url = imageUrl(asset, { w: 400 });
    expect(url).toContain('w=400');
  });
});
