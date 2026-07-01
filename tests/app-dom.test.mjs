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

test('every goal picker template maps to a rendered starter card', () => {
  const { document } = new JSDOM(html).window;
  const starterCards = new Set(
    [...document.querySelectorAll('.glass-card[data-repo]')]
      .map((card) => card.dataset.repo.split('/').pop()),
  );
  const pickerTemplates = [...document.querySelectorAll('[data-picker-template]')]
    .map((button) => button.dataset.pickerTemplate);

  assert.ok(pickerTemplates.length > 0);
  assert.deepEqual(
    pickerTemplates.filter((template) => !starterCards.has(template)),
    [],
  );
});

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

test('template panel copy and goal picker expose direct GitHub template commands', async () => {
  const { window, copied } = await setupDom();
  const { document } = window;

  const defaultCopyButton = document.querySelector('#install-panel-cli .copy-btn');
  click(window, defaultCopyButton);
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  assert.equal(copied[0], 'gh repo create my-app --template starter-series/docker-deploy-starter');
  assert.equal(defaultCopyButton.classList.contains('copied'), true);

  const webGoal = document.querySelector('[data-picker-template="cloudflare-pages-starter"]');
  click(window, webGoal);

  const modal = document.getElementById('modal');
  assert.equal(modal.classList.contains('open'), true);
  assert.equal(document.getElementById('modalTitle').textContent, 'Cloudflare Pages');
  assert.equal(
    document.getElementById('modalCommand').textContent,
    'gh repo create my-app --template starter-series/cloudflare-pages-starter',
  );

  const modalCopyButton = document.querySelector('.modal-command .copy-btn[data-copy-source="modalCommand"]');
  click(window, modalCopyButton);
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  assert.equal(copied[1], 'gh repo create my-app --template starter-series/cloudflare-pages-starter');
  assert.equal(modalCopyButton.classList.contains('copied'), true);
});
