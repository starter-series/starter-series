const I18n = (() => {
  const STORAGE_KEY = 'starter-series-lang';
  const SUPPORTED = ['en', 'ko'];
  let locale = {};
  let currentLang = 'en';

  function detect() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      saved = null;
    }
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = navigator.language || '';
    if (nav.startsWith('ko')) return 'ko';
    return 'en';
  }

  async function load(lang) {
    const res = await fetch(`locales/${lang}.json`);
    if (!res.ok) throw new Error(`Failed to load ${lang}`);
    return res.json();
  }

  function apply(data) {
    locale = data;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (data[key] == null) return;

      if (el.hasAttribute('data-i18n-attr')) {
        el.setAttribute(el.getAttribute('data-i18n-attr'), data[key]);
      } else if (el.tagName === 'TITLE') {
        document.title = data[key];
      } else if (data[key].includes('\n')) {
        const frag = document.createDocumentFragment();
        data[key].split('\n').forEach((s, i) => {
          if (i > 0) frag.appendChild(document.createElement('br'));
          frag.appendChild(document.createTextNode(s));
        });
        el.textContent = '';
        el.appendChild(frag);
      } else {
        el.textContent = data[key];
      }
    });

    document.documentElement.lang = currentLang;
    window.dispatchEvent(new CustomEvent('starter-series:i18n', { detail: { lang: currentLang } }));
  }

  async function init() {
    currentLang = detect();
    const data = await load(currentLang);
    apply(data);
  }

  async function toggle() {
    currentLang = currentLang === 'en' ? 'ko' : 'en';
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (_) {
      // Storage can be unavailable in strict browser modes.
    }
    const data = await load(currentLang);
    apply(data);
  }

  function get(key) { return locale[key] || key; }
  function lang() { return currentLang; }

  return { init, toggle, get, lang };
})();

I18n.init().catch(err => console.error('I18n init failed:', err));
