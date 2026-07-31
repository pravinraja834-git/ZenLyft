/* ==============================================
   ZenLyft - Main JavaScript
   Navbar, loader, smooth scroll, contact form,
   toast notifications, back-to-top
   ============================================== */

'use strict';

/* =====================
   Loading Screen
   ===================== */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after page loads
  const hide = () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 600);
  };

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
    // Fallback: always hide after 3s
    setTimeout(hide, 3000);
  }
}

/* =====================
   Navbar
   ===================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  const overlay = document.querySelector('.nav-overlay');

  if (!navbar) return;

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      toggle.classList.toggle('active', !isOpen);
      mobileMenu.classList.toggle('open', !isOpen);
      overlay?.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    const closeMenu = () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      overlay?.classList.remove('open');
      document.body.style.overflow = '';
    };

    overlay?.addEventListener('click', closeMenu);

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* =====================
   Back to Top
   ===================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================
   Toast Notification
   ===================== */
function showToast(message, type = 'info', duration = 4000) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* =====================
   Contact Form
   ===================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    first_name: { min: 2, message: 'First name must be at least 2 characters.' },
    last_name: { min: 2, message: 'Last name must be at least 2 characters.' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
    phone: { min: 10, message: 'Please enter a valid phone number.' },
    country: { min: 2, message: 'Please enter your country.' },
    looking_for: { required: true, message: 'Please select what you are looking for.' },
    message: { min: 20, message: 'Message must be at least 20 characters.' },
  };

  function validateField(name, value) {
    const rule = fields[name];
    if (!rule) return true;
    if (rule.required && !value.trim()) return rule.message;
    if (rule.min && value.trim().length < rule.min) return rule.message;
    if (rule.pattern && !rule.pattern.test(value.trim())) return rule.message;
    return true;
  }

  function setFieldState(input, valid, message = '') {
    const group = input.closest('.form-group');
    const errEl = group?.querySelector('.form-error');
    group?.classList.toggle('error', !valid);
    group?.classList.toggle('success', valid);
    if (errEl) errEl.textContent = message;
  }

  // Real-time validation on blur
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', () => {
      if (!input.name) return;
      const result = validateField(input.name, input.value);
      setFieldState(input, result === true, result === true ? '' : result);
    });

    input.addEventListener('input', () => {
      if (input.closest('.form-group')?.classList.contains('error')) {
        const result = validateField(input.name, input.value);
        if (result === true) setFieldState(input, true);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('input, textarea').forEach(input => {
      if (!input.name) return;
      const result = validateField(input.name, input.value);
      setFieldState(input, result === true, result === true ? '' : result);
      if (result !== true) valid = false;
    });

    if (!valid) {
      showToast('Please fix the errors above.', 'error');
      return;
    }

    // Set reply-to address so company can reply to client
    const replytoField = document.getElementById('replyto-field');
    const emailInput = form.querySelector('[name="email"]');
    if (replytoField && emailInput) {
      replytoField.value = emailInput.value;
    }

    // Let the form submit naturally to FormSubmit.co
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        Sending...
      `;
    }

    form.submit();
  });
}

/* =====================
   Newsletter Form
   ===================== */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      input.value = '';
      showToast('Subscribed! Thank you for joining us.', 'success');
    });
  });
}

/* =====================
   Smooth Scroll for Anchor Links
   ===================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = document.querySelector('.navbar')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* =====================
   Lazy Images
   ===================== */
function initLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
}

/* =====================
   Floating Action Button Tooltip
   ===================== */
function initFAB() {
  const fab = document.querySelector('.fab');
  if (!fab) return;

  fab.addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const navH = document.querySelector('.navbar')?.offsetHeight || 80;
      window.scrollTo({
        top: contactSection.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth'
      });
    }
  });
}

/* =====================
   Hero Mouse Parallax
   ===================== */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;

    const blobs = hero.querySelectorAll('.hero-blob');
    blobs.forEach((blob, i) => {
      const speed = (i + 1) * 8;
      blob.style.transform = `translate(${dx * speed}px, ${dy * speed}px)`;
    });

    const illustration = hero.querySelector('.hero-illustration');
    if (illustration) {
      illustration.style.transform = `translate(${dx * 12}px, ${dy * 12}px)`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    hero.querySelectorAll('.hero-blob').forEach(blob => {
      blob.style.transform = '';
    });
    const illustration = hero.querySelector('.hero-illustration');
    if (illustration) illustration.style.transform = '';
  });
}

/* =====================
   Init Everything
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initBackToTop();
  initContactForm();
  initNewsletter();
  initSmoothScroll();
  initLazyImages();
  initFAB();
  initHeroParallax();
});

// Expose toast globally
window.showToast = showToast;
