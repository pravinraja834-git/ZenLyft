/* ============================================================
   ZENLYFT — script.js
   Navbar · Mobile menu · Scroll-reveal · Counter · Back-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Year ─────────────────────────────────────────────── */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Navbar scroll shrink ─────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const handleNavbar = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleNavbar, { passive: true });
    handleNavbar();

    /* ── Active nav link highlight ────────────────────────── */
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');
    const setActive = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };
    window.addEventListener('scroll', setActive, { passive: true });

    /* ── Mobile menu ──────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    /* ── Smooth scroll ────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id     = anchor.getAttribute('href');
            const target = id === '#' ? document.body : document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ── Scroll-reveal (IntersectionObserver) ─────────────── */
    const revealEls = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-fade'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target); // fire once
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        // Skip hero elements — they use CSS animation
        revealEls.forEach(el => {
            if (!el.closest('.hero')) {
                revealObserver.observe(el);
            }
        });
    } else {
        // Fallback: show everything immediately
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* ── Animated counter ─────────────────────────────────── */
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const animateCounter = (el) => {
        const target   = +el.dataset.target;
        const duration = 1800; // ms
        const step     = 16;   // ~60fps
        const increment = target / (duration / step);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                counters.forEach(animateCounter);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObserver.observe(c));

    /* ── Back-to-top button ───────────────────────────────── */
    const backBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ── Magnetic hover effect on buttons ────────────────── */
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx   = e.clientX - (rect.left + rect.width  / 2);
            const dy   = e.clientY - (rect.top  + rect.height / 2);
            btn.style.transform = `translate(${dx * 0.12}px, ${dy * 0.16}px) translateY(-2px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ── Cursor tilt + 3D Glare effect on cards ─────────────────────── */
    document.querySelectorAll('.card, .team-showcase-card, .project-showcase-card').forEach(card => {
        // Dynamically create glare layer if it doesn't exist
        let glare = card.querySelector('.card-glare');
        if (!glare) {
            glare = document.createElement('div');
            glare.className = 'card-glare';
            card.appendChild(glare);
        }

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const cx   = x / rect.width  - 0.5;  // -0.5 to 0.5
            const cy   = y / rect.height - 0.5;

            const rx   = cy * -10;  // Rotate X (vertical tilt)
            const ry   = cx *  10;  // Rotate Y (horizontal tilt)

            card.style.transform    = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
            card.style.transition   = 'transform 0.08s ease';

            // Calculate percentage position of the light reflection glare
            const px = (x / rect.width) * 100;
            const py = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle 140px at ${px}% ${py}%, rgba(255, 255, 255, 0.08), transparent)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s';
            glare.style.background = 'transparent';
        });
    });

    /* ── Stagger children of grids on first reveal ────────── */
    document.querySelectorAll('.services-grid, .team-grid, .contact-cards').forEach(grid => {
        const items = grid.querySelectorAll('.reveal-up');
        items.forEach((item, i) => {
            item.style.setProperty('--d', `${i * 0.12}s`);
        });
    });

    /* ── Custom Cursor Logic ──────────────────────────────── */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', e => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;

            // Modern, smooth keyframe animation following effect for the outer circle
            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 240, fill: 'forwards' });
        });

        // Toggle state class for hovers
        const interactiveSelector = 'a, button, .card, .team-showcase-card, .btn-live-project, .hamburger';
        document.querySelectorAll(interactiveSelector).forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

});
