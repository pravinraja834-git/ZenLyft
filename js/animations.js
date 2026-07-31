/* ==============================================
   ZenLyft - Animations JS
   IntersectionObserver, parallax, magnetic effects
   ============================================== */

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-fade'
  );
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* --- SVG Line Draw --- */
function initSVGDraw() {
  const svgEls = document.querySelectorAll('.svg-draw');
  if (!svgEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  svgEls.forEach(el => observer.observe(el));
}

/* --- Process Timeline Fill --- */
function initProcessLine() {
  const line = document.querySelector('.process-line-fill');
  if (!line) return;

  const steps = document.querySelectorAll('.process-step');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          line.style.height = '100%';
          steps.forEach((step, i) => {
            setTimeout(() => step.classList.add('active'), i * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const process = document.querySelector('.process-timeline');
  if (process) observer.observe(process);
}

/* --- Mouse Parallax (Hero) --- */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const layers = hero.querySelectorAll('[data-parallax]');
  if (!layers.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.parallax) || 0.02;
      const tx = dx * speed * 50;
      const ty = dy * speed * 50;
      layer.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });
}

/* --- Magnetic Buttons --- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.2;
      const dy = (e.clientY - cy) * 0.2;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });
}

/* --- Cursor Glow --- */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  let rafId;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateGlow() {
    currentX = lerp(currentX, targetX, 0.1);
    currentY = lerp(currentY, targetY, 0.1);
    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';
    rafId = requestAnimationFrame(updateGlow);
  }

  updateGlow();
}

/* --- Scroll Progress Bar --- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min((scrollTop / docHeight) * 100, 100);
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* --- Testimonials Slider --- */
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;

  const track = slider.querySelector('.testimonials-track');
  const cards = slider.querySelectorAll('.testimonial-card');
  const dots = slider.querySelectorAll('.slider-dot');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  if (!cards.length) return;

  let current = 0;
  let autoInterval;

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  function startAuto() {
    autoInterval = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx > 0 ? prev() : next();
      resetAuto();
    }
  });

  goTo(0);
  startAuto();
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });
      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --- Skill / Progress bars --- */
function initProgressBars() {
  const bars = document.querySelectorAll('[data-progress]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const pct = bar.dataset.progress;
          bar.style.width = pct + '%';
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* --- Ripple on buttons --- */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'btn-ripple';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* --- Init all on DOMContentLoaded --- */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSVGDraw();
  initProcessLine();
  initParallax();
  initMagneticButtons();
  initCursorGlow();
  initScrollProgress();
  initTestimonialsSlider();
  initFAQ();
  initProgressBars();
  initRipple();
});
