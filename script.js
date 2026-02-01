// JavaScript for Lento Auto Repair website
// Last updated: September 4, 2025

// Language toggle
let currentLang = 'en';
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'pl' : 'en';
    langToggle.textContent = currentLang === 'en' ? 'EN' : 'PL';
    langToggle.setAttribute('title', currentLang === 'en' ? 'Switch to Polish' : 'Przełącz na angielski');
    
    document.querySelectorAll('[data-en][data-pl]').forEach(el => {
      const text = el.getAttribute(`data-${currentLang}`);
      if (text) el.textContent = text;
    });
    localStorage.setItem('lento-lang', currentLang);
  });
  
  // Load saved language preference
  const saved = localStorage.getItem('lento-lang');
  if (saved && saved !== 'en') {
    currentLang = saved;
    langToggle.click();
  }
}

const toolbar = document.querySelector('.filters');
toolbar?.addEventListener('keydown', (e) => {
  if (!['ArrowLeft','ArrowRight'].includes(e.key)) return;
  const buttons = Array.from(toolbar.querySelectorAll('[data-filter]'));
  const i = buttons.indexOf(document.activeElement);
  if (i === -1) return;
  e.preventDefault();
  const next = e.key === 'ArrowRight' ? (i + 1) % buttons.length : (i - 1 + buttons.length) % buttons.length;
  buttons[next].focus();
});
// Ensure first filter button is tabbable immediately
document.querySelector('.filters [data-filter]')?.setAttribute('tabindex','0');

const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll: if reduced motion, show immediately (no slide-in)
if (prefersReduced) {
  document.querySelectorAll('.reveal').forEach(t => t.classList.add('visible'));
} else if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
} else {
  // fallback
  document.querySelectorAll('.reveal').forEach(t => t.classList.add('visible'));
}

// Contact form handler (progressive enhancement)
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const data = new FormData(form);

    // Honeypot check
    if (data.get('website')) return;

    const hasFormspree = form.action.startsWith('https://formspree.io/');
    if (!hasFormspree) {
      alert('Thanks! We will contact you shortly.');
      form.reset();
      if (status) status.textContent = 'Form submitted (demo).';
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (res.ok) {
        form.reset();
        alert('Thanks! Your request has been sent.');
        if (status) status.textContent = 'Submission successful.';
      } else {
        alert('Sorry—there was a problem. Please call (847) 233-0397.');
        if (status) status.textContent = 'Submission failed.';
      }
    } catch {
      alert('Network error. Please try again or call us directly.');
      if (status) status.textContent = 'Network error.';
    }
  });
}

// Optional: only if a testimonials slider exists
if (!prefersReduced && window.slides && typeof showSlide === 'function') {
  setInterval(() => {
    if (document.hasFocus() && slides.length) {
      window.idx = (window.idx + 1) % slides.length;
      showSlide(window.idx);
    }
  }, 6000);
}