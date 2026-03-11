const I18n = (() => {
  const STORAGE_KEY = 'starter-series-lang';
  const SUPPORTED = ['en', 'ko'];
  let locale = {};
  let currentLang = 'en';

  function detect() {
    const saved = localStorage.getItem(STORAGE_KEY);
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
      } else {
        el.textContent = data[key];
      }
    });

    renderDynamic(data);
    document.documentElement.lang = currentLang;
  }

  function renderDynamic(data) {
    const pointsEl = document.getElementById('whyPoints');
    if (pointsEl && data.why_points) {
      pointsEl.innerHTML = data.why_points.map(p => `<li>${p}</li>`).join('');
    }

    const stepsEl = document.getElementById('howSteps');
    if (stepsEl && data.how_steps) {
      stepsEl.innerHTML = data.how_steps.map(s => `
        <div class="step">
          <div class="step-num">${s.num}</div>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
        </div>
      `).join('');
    }
  }

  async function init() {
    currentLang = detect();
    const data = await load(currentLang);
    apply(data);
  }

  async function toggle() {
    currentLang = currentLang === 'en' ? 'ko' : 'en';
    localStorage.setItem(STORAGE_KEY, currentLang);
    const data = await load(currentLang);
    apply(data);
  }

  function get(key) { return locale[key] || key; }
  function lang() { return currentLang; }

  return { init, toggle, get, lang };
})();

I18n.init();
