/* ============================================================
   ZenLyft Official Startup Company Website : Core Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation scroll effect
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

  // Mobile navigation drawer toggle
  const hamburger = document.querySelector('.nav__hamburger');
  const drawer = document.getElementById('mobile-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      drawer.classList.toggle('nav__drawer--open');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close mobile drawer when clicking links
    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('nav__drawer--open');
        document.body.style.overflow = '';
      });
    });
  }

  // Interactive Ecosystem Flow in Hero
  const ecosystemNodes = document.querySelectorAll('.ecosystem-node');
  if (ecosystemNodes.length > 0) {
    ecosystemNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        ecosystemNodes.forEach(n => n.classList.remove('ecosystem-node--active'));
        node.classList.add('ecosystem-node--active');
      });
    });
  }

  // Contact form submission handling
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Received';
        submitBtn.style.backgroundColor = 'var(--color-success)';
        submitBtn.style.color = '#FFFFFF';
        submitBtn.disabled = true;
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  }
});
