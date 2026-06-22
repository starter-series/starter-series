import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const i18nSource = fs.readFileSync(path.join(root, 'i18n.js'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

function localeFor(url) {
  const lang = String(url).includes('/ko.json') ? 'ko' : 'en';
  return JSON.parse(fs.readFileSync(path.join(root, 'locales', `${lang}.json`), 'utf8'));
}

async function setupDom() {
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    runScripts: 'outside-only',
    url: 'http://localhost/starter-series/',
  });

  const { window } = dom;
  const copied = [];

  window.fetch = async (url) => ({
    ok: true,
    json: async () => localeFor(url),
  });
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.requestAnimationFrame = (fn) => {
    fn();
    return 1;
  };
  window.navigator.clipboard = {
    writeText: async (text) => {
      copied.push(text);
    },
  };
  window.document.execCommand = () => true;

  const i18nReady = new Promise((resolve) => {
    window.addEventListener('starter-series:i18n', resolve, { once: true });
  });

  const context = dom.getInternalVMContext();
  vm.runInContext(i18nSource, context, { filename: 'i18n.js' });
  vm.runInContext(appSource, context, { filename: 'app.js' });
  await i18nReady;

  return { dom, window, copied };
}

function click(window, element) {
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function keydown(window, element, key, options = {}) {
  element.dispatchEvent(new window.KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
    ...options,
  }));
}

function visibleCards(document) {
  return [...document.querySelectorAll('.glass-card[data-category]')]
    .filter((card) => !card.classList.contains('hidden'));
}

test('filter buttons update pressed state and hide nonmatching starter cards', async () => {
  const { window } = await setupDom();
  const { document } = window;

  const webFilter = document.querySelector('[data-filter="web"]');
  click(window, webFilter);
  await new Promise((resolve) => window.setTimeout(resolve, 220));

  assert.equal(webFilter.getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelector('[data-filter="all"]').getAttribute('aria-pressed'), 'false');
  assert.ok(visibleCards(document).length > 0);
  assert.ok(visibleCards(document).every((card) => card.dataset.category === 'web'));
});

test('starter cards open a modal from keyboard and Escape closes back to the card', async () => {
  const { window } = await setupDom();
  const { document } = window;

  const card = document.querySelector('.glass-card[data-repo][data-detail="detail_ext"]');
  card.focus();
  keydown(window, card, 'Enter');

  const modal = document.getElementById('modal');
  assert.equal(modal.classList.contains('open'), true);
  assert.equal(modal.getAttribute('aria-hidden'), 'false');
  assert.equal(document.getElementById('modalTitle').textContent, 'Browser Extension');
  assert.match(document.getElementById('modalRepo').href, /browser-extension-starter/);
  assert.equal(document.activeElement, document.getElementById('modalClose'));

  keydown(window, document, 'Escape');

  assert.equal(modal.classList.contains('open'), false);
  assert.equal(modal.getAttribute('aria-hidden'), 'true');
  assert.equal(document.activeElement, card);
});

test('install tabs support keyboard navigation and copy the active command', async () => {
  const { window, copied } = await setupDom();
  const { document } = window;

  const cliTab = document.getElementById('install-tab-cli');
  keydown(window, cliTab, 'ArrowRight');

  const pluginTab = document.getElementById('install-tab-plugin');
  assert.equal(pluginTab.getAttribute('aria-selected'), 'true');
  assert.equal(pluginTab.getAttribute('tabindex'), '0');
  assert.equal(document.getElementById('install-panel-cli').classList.contains('hidden'), true);
  assert.equal(document.getElementById('install-panel-plugin').classList.contains('hidden'), false);
  assert.equal(document.activeElement, pluginTab);

  const secondCopyButton = document.querySelector(
    '#install-panel-plugin .copy-btn[data-copy-index="1"]',
  );
  click(window, secondCopyButton);
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  assert.deepEqual(copied, ['/plugin install create-starter@starter-series']);
  assert.equal(secondCopyButton.classList.contains('copied'), true);
  assert.equal(secondCopyButton.querySelector('.copy-label').textContent, 'Copied');
});
