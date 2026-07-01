// === Theme toggle ===
const THEME_KEY = 'starter-series-theme';
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function readStored(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // Storage can be unavailable in strict browser modes.
  }
}

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeIcon.textContent = t === 'dark' ? '\u2600' : '\u263E';
  writeStored(THEME_KEY, t);
}
setTheme(readStored(THEME_KEY) || document.documentElement.getAttribute('data-theme') || 'dark');
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// === Language toggle ===
document.getElementById('langToggle').addEventListener('click', () => I18n.toggle());

// === Mobile nav ===
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
function setMobileNav(open) {
  navLinks.classList.toggle('open', open);
  mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}
mobileToggle.addEventListener('click', () => setMobileNav(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => setMobileNav(false))
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') setMobileNav(false);
});

// === Filter cards ===
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    btn.classList.add('active');

    const cards = document.querySelectorAll('.glass-card[data-category]');
    cards.forEach(c => {
      if (!c.classList.contains('hidden')) {
        c.style.opacity = '0';
        c.style.transform = 'translateY(8px)';
      }
    });

    setTimeout(() => {
      cards.forEach(c => {
        const match = f === 'all' || c.dataset.category === f;
        c.classList.toggle('hidden', !match);
        void c.offsetWidth;
        if (match) {
          c.style.opacity = '1';
          c.style.transform = 'none';
        }
      });
    }, 200);
  });
});

// === Modal ===
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDetail = document.getElementById('modalDetail');
const modalTags = document.getElementById('modalTags');
const modalRepo = document.getElementById('modalRepo');
const modalCommand = document.getElementById('modalCommand');
const modalClose = document.getElementById('modalClose');
let lastFocused = null;

function getFocusableInModal() {
  return modal.querySelectorAll('a[href], button:not([disabled])');
}

function openCard(card) {
  lastFocused = document.activeElement;
  const repoName = card.dataset.repo.split('/').filter(Boolean).pop();
  modalTitle.textContent = card.querySelector('h3').textContent;
  modalDetail.textContent = I18n.get(card.dataset.detail);
  modalTags.textContent = card.querySelector('code').textContent;
  modalRepo.href = card.dataset.repo;
  modalRepo.setAttribute('aria-label', `${modalTitle.textContent}: ${I18n.get('modal_repo_btn')}`);
  modalCommand.textContent = `gh repo create my-app --template starter-series/${repoName}`;
  modal.removeAttribute('inert');
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  requestAnimationFrame(() => modalClose.focus());
}

function closeModal() {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('inert', '');
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
  lastFocused = null;
}

document.querySelectorAll('.glass-card[data-repo]').forEach(card => {
  card.addEventListener('click', () => openCard(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCard(card);
    }
  });
});

document.querySelectorAll('[data-picker-template]').forEach(btn => {
  btn.addEventListener('click', () => {
    const template = btn.dataset.pickerTemplate;
    const card = Array.from(document.querySelectorAll('.glass-card[data-repo]'))
      .find(c => c.dataset.repo.endsWith(`/${template}`));
    if (card) openCard(card);
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') {
    closeModal();
    return;
  }
  if (e.key === 'Tab') {
    const focusable = getFocusableInModal();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    // If focus escaped the modal (e.g., tabbed in from browser chrome), pull it back.
    if (!modal.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// === Install section: tabs + copy ===
const installTabs = document.querySelectorAll('[data-install-tab]');
function activateInstallTab(tab) {
  const target = tab.dataset.installTab;
  installTabs.forEach(t => {
    const selected = t === tab;
    t.classList.toggle('active', selected);
    t.setAttribute('aria-selected', selected ? 'true' : 'false');
    // Roving tabindex: only the active tab is in the tab sequence.
    t.setAttribute('tabindex', selected ? '0' : '-1');
  });
  document.querySelectorAll('.install-panel').forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== `install-panel-${target}`);
  });
}
installTabs.forEach(tab => {
  tab.addEventListener('click', () => activateInstallTab(tab));
  tab.addEventListener('keydown', e => {
    const tabs = Array.from(installTabs);
    const i = tabs.indexOf(tab);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    activateInstallTab(tabs[next]);
    tabs[next].focus();
  });
});

function copyFromButton(btn) {
  const directSource = btn.dataset.copySource
    ? document.getElementById(btn.dataset.copySource)
    : null;
  if (directSource) return directSource.textContent || '';

  const panel = document.getElementById(btn.dataset.copyTarget);
  if (!panel) return '';
  const codes = panel.querySelectorAll('code');
  const idx = parseInt(btn.dataset.copyIndex || '0', 10);
  return (codes[idx] || codes[0])?.textContent || '';
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    ta.style.width = '1px';
    ta.style.height = '1px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    document.body.removeChild(ta);
    return copied;
  }
}

document.querySelectorAll('.copy-btn[data-copy-target], .copy-btn[data-copy-source]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = copyFromButton(btn);
    if (!text) return;
    const copied = await writeClipboard(text);
    const label = btn.querySelector('.copy-label');
    const original = label ? label.textContent : '';
    btn.classList.toggle('copied', copied);
    btn.classList.toggle('copy-failed', !copied);
    if (label) label.textContent = copied
      ? I18n.get('install_copied') || 'Copied'
      : I18n.get('install_copy_failed') || 'Copy failed';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.classList.remove('copy-failed');
      if (label) label.textContent = original;
    }, 2000);
  });
});

// === Scroll reveal with stagger ===
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || '0', 10);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    io.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
