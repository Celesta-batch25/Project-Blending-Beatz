// ============================================================
// BLENDING BEATZ — main.js
// ============================================================

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('siteNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ---------- Hero embers ---------- */
const emberField = document.getElementById('heroEmbers');
if (emberField) {
  const EMBER_COUNT = 26;
  for (let i = 0; i < EMBER_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'ember-particle';
    p.style.left = Math.random() * 100 + '%';
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 10;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = delay + 's';
    p.style.width = p.style.height = (2 + Math.random() * 2) + 'px';
    emberField.appendChild(p);
  }
}

/* ---------- Countdown ----------
   EDIT THIS DATE: set to the real event date/time. Format: "YYYY-MM-DDTHH:MM:SS+05:30" (Sri Lanka time) */
const EVENT_DATE = new Date("2026-10-30T14:30:00+05:30");

function updateCountdown() {
  const now = new Date();
  let diff = EVENT_DATE - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(2, '0');
  };
  set('cd-days', days);
  set('cd-hours', hours);
  set('cd-mins', mins);
  set('cd-secs', secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const ans = item.querySelector('.faq-a');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    ans.style.maxHeight = !isOpen ? ans.scrollHeight + 'px' : null;
  });
});

/* ---------- Gallery filter tabs (client-side, expects data-category on items) ---------- */
const galleryTabs = document.querySelectorAll('.gallery-tab');
const galleryItems = document.querySelectorAll('.gallery-item');
galleryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    galleryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.textContent.trim().toLowerCase();
    galleryItems.forEach(item => {
      const itemCat = (item.dataset.category || 'all').toLowerCase();
      item.style.display = (cat === 'all' || itemCat === cat) ? '' : 'none';
    });
  });
});

/* ---------- Smooth-scroll offset for fixed nav on anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});
