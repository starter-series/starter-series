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
    
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => {
        if (!c.classList.contains('hidden')) {
            c.style.opacity = '0';
            c.style.transform = 'translateY(10px)';
        }
    });

    setTimeout(() => {
        cards.forEach(c => {
          const match = f === 'all' || c.dataset.category === f;
          c.classList.toggle('hidden', !match);
          // Force reflow
          void c.offsetWidth; 
          
          if (match) {
              c.style.opacity = '1';
              c.style.transform = 'none';
          }
        });
    }, 200);
  });
});

// === Scroll reveal with stagger ===
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    
    // Terminal animation trigger
    if (entry.target.classList.contains('hero-terminal')) {
       animateTerminal(entry.target);
    }

    const delay = parseInt(entry.target.dataset.delay || '0', 10);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    io.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function animateTerminal(terminal) {
  const lines = terminal.querySelectorAll('.term-line');
  lines.forEach((line, index) => {
    setTimeout(() => {
      line.classList.add('visible');
    }, 400 + (index * 800)); 
  });
}

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
