/* ==============================================
   ZenLyft - Animated Counters
   Scroll-triggered number animation
   ============================================== */

class AnimatedCounter {
  constructor(el, target, duration = 2000, suffix = '') {
    this.el = el;
    this.target = target;
    this.duration = duration;
    this.suffix = suffix;
    this.started = false;
    this.startValue = 0;
  }

  start() {
    if (this.started) return;
    this.started = true;

    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(this.startValue + (this.target - this.startValue) * eased);
      this.el.textContent = current + this.suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.el.textContent = this.target + this.suffix;
      }
    };

    requestAnimationFrame(animate);
  }
}

function initCounters() {
  const counterEls = document.querySelectorAll('[data-counter]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration || '2000', 10);
        const counter = new AnimatedCounter(el, target, duration, suffix);
        counter.start();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterEls.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initCounters);
