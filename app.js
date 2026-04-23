// === Theme toggle ===
const THEME_KEY = 'starter-series-theme';
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeIcon.textContent = t === 'dark' ? '\u2600' : '\u263E';
  localStorage.setItem(THEME_KEY, t);
}
setTheme(localStorage.getItem(THEME_KEY) || 'dark');
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// === Language toggle ===
document.getElementById('langToggle').addEventListener('click', () => I18n.toggle());

// === Mobile nav ===
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// === Filter cards ===
document.querySelectorAll('[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
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
const modalClose = document.getElementById('modalClose');
let lastFocused = null;

function getFocusableInModal() {
  return modal.querySelectorAll('a[href], button:not([disabled])');
}

function openCard(card) {
  lastFocused = document.activeElement;
  modalTitle.textContent = card.querySelector('h3').textContent;
  modalDetail.textContent = I18n.get(card.dataset.detail);
  modalTags.textContent = card.querySelector('code').textContent;
  modalRepo.href = card.dataset.repo;
  modal.classList.add('open');
  requestAnimationFrame(() => modalClose.focus());
}

function closeModal() {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
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
installTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.installTab;
    installTabs.forEach(t => {
      const selected = t === tab;
      t.classList.toggle('active', selected);
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    document.querySelectorAll('.install-panel').forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== `install-panel-${target}`);
    });
  });
  tab.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const tabs = Array.from(installTabs);
    const i = tabs.indexOf(tab);
    const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    tabs[next].click();
  });
});

document.querySelectorAll('.copy-btn[data-copy-target]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const panel = document.getElementById(btn.dataset.copyTarget);
    if (!panel) return;
    const codes = panel.querySelectorAll('code');
    const idx = parseInt(btn.dataset.copyIndex || '0', 10);
    const text = (codes[idx] || codes[0])?.textContent || '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      // Fallback for insecure contexts.
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (_) { /* noop */ }
      document.body.removeChild(ta);
    }
    const label = btn.querySelector('.copy-label');
    const original = label ? label.textContent : '';
    btn.classList.add('copied');
    if (label) label.textContent = I18n.get('install_copied') || 'Copied';
    setTimeout(() => {
      btn.classList.remove('copied');
      if (label) label.textContent = original;
    }, 1500);
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
