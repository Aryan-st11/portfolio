/* ═══════════════════════════════════════════════════════
   ARYAN CHOUDHARY PORTFOLIO — script.js
   Features: typing animation, scroll reveal, active nav,
   mobile menu, animated counters, form handler, progress bar
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── CONFIG ─────────────────────────────────────────── */
const TYPED_ROLES = [
  'Frontend Developer',
  'Fullstack Builder',
  'DSA Enthusiast',
  'React Developer',
  'Problem Solver',
];

const TYPE_SPEED   = 85;   // ms per character
const DELETE_SPEED = 45;
const PAUSE_AFTER  = 1800; // pause when word is complete

/* ─── DOM REFERENCES ─────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── SCROLL PROGRESS BAR ────────────────────────────── */
function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const docH    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docH) * 100;
    bar.style.width = Math.min(scrolled, 100) + '%';
  }, { passive: true });
}

/* ─── NAVBAR — scroll state + active section ─────────── */
function initNavbar() {
  const navbar   = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = navLinks.map(l => l.dataset.section).filter(Boolean);

  // Sticky shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Smooth scroll for all anchor links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });

  // Highlight active section on scroll
  const observerOpts = { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 };
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, observerOpts);

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObs.observe(el);
  });
}

/* ─── MOBILE MENU ────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });
}

function closeMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  if (!hamburger || !mobileMenu) return;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  mobileMenu.setAttribute('aria-hidden', true);
}

/* ─── TYPING ANIMATION ───────────────────────────────── */
function initTyping() {
  const el = $('#typedText');
  if (!el) return;

  let wordIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    const word   = TYPED_ROLES[wordIdx % TYPED_ROLES.length];
    const current = word.slice(0, charIdx);
    el.textContent = current;

    if (paused) {
      paused = false;
      deleting = true;
      setTimeout(tick, PAUSE_AFTER);
      return;
    }

    if (!deleting) {
      charIdx++;
      if (charIdx > word.length) {
        paused = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        charIdx  = 0;
        wordIdx++;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

/* ─── SCROLL REVEAL ─────────────────────────────────── */
function initReveal() {
  const revealEls = $$('.reveal');
  if (!revealEls.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => obs.observe(el));
}

/* ─── ANIMATED COUNTERS ─────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;

  const duration = 1500; // ms
  const steps    = 50;
  const step     = target / steps;
  const interval = duration / steps;
  let current    = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.round(current);
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, interval);
}

function initCounters() {
  const counterEls = $$('.counter, [data-counter]');
  if (!counterEls.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterEls.forEach(el => obs.observe(el));
}

/* ─── CONTACT FORM ───────────────────────────────────── */
function initContactForm() {
  const form    = $('#contactForm');
  if (!form) return;

  const btnText    = $('#btnText');
  const spinner    = $('#btnSpinner');
  const successMsg = $('#formSuccess');
  const submitBtn  = $('#submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name  = $('#f-name', form).value.trim();
    const email = $('#f-email', form).value.trim();
    const msg   = $('#f-msg', form).value.trim();

    if (!name || !email || !msg) {
      shakeForm(form);
      return;
    }

    // Loading state
    btnText.textContent = 'Sending…';
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;

    // Simulate send (replace with Netlify / EmailJS / etc.)
    await new Promise(r => setTimeout(r, 1800));

    // Success state
    btnText.textContent = 'Sent!';
    spinner.classList.add('hidden');
    successMsg.classList.remove('hidden');
    form.reset();

    setTimeout(() => {
      btnText.textContent = 'Send Message →';
      submitBtn.disabled  = false;
      successMsg.classList.add('hidden');
    }, 5000);
  });
}

function shakeForm(form) {
  form.style.animation = 'none';
  form.offsetHeight; // reflow
  form.style.animation = 'shake .4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

/* Add shake keyframes dynamically (avoids cluttering CSS) */
(function injectShake() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }
  `;
  document.head.appendChild(style);
})();

/* ─── STAGGER REVEAL DELAYS ─────────────────────────── */
/**
 * Auto-assign transition delays to sibling reveal elements
 * so they stagger nicely without manual class names.
 */
function initStaggerDelays() {
  const parents = $$('.skills-grid, .projects-grid, .gh-grid, .chip-group');
  parents.forEach(parent => {
    const children = $$('.reveal, .skill-cat, .proj-card, .gh-card, .chip', parent);
    children.forEach((child, i) => {
      if (!child.style.transitionDelay) {
        child.style.transitionDelay = `${i * 80}ms`;
      }
    });
  });
}

/* ─── ACTIVE LINK INDICATOR ON MOBILE ───────────────── */
function initMobileActiveSections() {
  const mobileLinks = $$('.mobile-link');
  const sections    = ['home','about','skills','projects','github','leetcode','freelance','contact'];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        mobileLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}

/* ─── CARD TILT EFFECT (subtle) ─────────────────────── */
function initCardTilt() {
  $$('.proj-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const tiltX  = y * 4;  // max 4deg
      const tiltY  = -x * 4;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── INIT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initTyping();
  initReveal();
  initCounters();
  initContactForm();
  initStaggerDelays();
  initMobileActiveSections();
  initCardTilt();

  console.log(
    '%c AC Portfolio %c Loaded ✓',
    'background:#8B5CF6;color:#fff;padding:4px 10px;border-radius:4px 0 0 4px;font-weight:700',
    'background:#2DD4BF;color:#0F0823;padding:4px 10px;border-radius:0 4px 4px 0;font-weight:700'
  );
});
