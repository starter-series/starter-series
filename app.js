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
document.querySelectorAll('.pill').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.card').forEach(c => {
      c.classList.toggle('hidden', f !== 'all' && c.dataset.category !== f);
    });
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
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// === Card flashlight glow ===
document.querySelectorAll('.card').forEach(card => {
  const glow = card.querySelector('.card-glow');
  if (!glow) return;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    glow.style.left = (e.clientX - r.left) + 'px';
    glow.style.top = (e.clientY - r.top) + 'px';
  });
});
