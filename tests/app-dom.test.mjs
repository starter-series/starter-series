import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('legacy landing page points to the canonical starter-series site', () => {
  const dom = new JSDOM(html, { url: 'https://starter-series.github.io/landing-page/' });
  const { document } = dom.window;

  assert.equal(document.querySelector('meta[name="robots"]')?.content, 'noindex,follow');
  assert.equal(
    document.querySelector('link[rel="canonical"]')?.href,
    'https://starter-series.github.io/starter-series/',
  );
  assert.equal(
    document.querySelector('main a')?.href,
    'https://starter-series.github.io/starter-series/',
  );
  assert.match(document.body.textContent, /redirect notice/i);
});

test('legacy page no longer advertises create-starter or shotkit flows', () => {
  assert.doesNotMatch(html, /npx starter-series proof-report/);
  assert.doesNotMatch(html, /create-starter/);
  assert.doesNotMatch(html, /shotkit/);
  assert.doesNotMatch(html, /@starter-series/);
});
