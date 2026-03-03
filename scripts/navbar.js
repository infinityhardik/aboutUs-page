(function () {
  'use strict';

  function initNavbar() {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
      // Breadcrumb visibility on scroll
      const breadcrumb = document.querySelector('.breadcrumb');
      let lastScrollY = window.scrollY;
      let ticking = false;

      // Sync breadcrumb top to actual navbar height so it never gets covered
      const syncBreadcrumbTop = () => {
        if (breadcrumb) {
          breadcrumb.style.top = navbar.offsetHeight + 'px';
        }
      };

      // Ensure sync on all navbar dimensions changes (e.g., class toggles, viewport resizes)
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
          syncBreadcrumbTop();
        });
        resizeObserver.observe(navbar);
      } else {
        // Fallback for older browsers
        syncBreadcrumbTop();
        window.addEventListener('resize', syncBreadcrumbTop, { passive: true });
      }

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = Math.max(0, window.scrollY);

            // Navbar Scrolled Effect
            if (currentScrollY > 50) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }

            // Breadcrumb Dynamic Visibility (Hide on scroll down, show on scroll up)
            if (breadcrumb) {
              const delta = currentScrollY - lastScrollY;
              const threshold = 80; // Minimum scroll position before hiding
              const minDelta = 5;   // Ignore jitter smaller than 5px (iOS momentum scroll)

              if (currentScrollY <= threshold) {
                // Always show near the top
                breadcrumb.classList.remove('breadcrumb-hidden');
              } else if (delta > minDelta) {
                // Scrolling down with enough movement — hide
                breadcrumb.classList.add('breadcrumb-hidden');
              } else if (delta < -minDelta) {
                // Scrolling up with enough movement — show
                breadcrumb.classList.remove('breadcrumb-hidden');
              }
              // If |delta| <= minDelta, do nothing (ignore jitter)
            }

            lastScrollY = currentScrollY;
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Hamburger Menu
      const hamburger = document.getElementById('hamburger');
      const menu = document.getElementById('menu');
      if (hamburger && menu) {
        const toggleMenu = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          hamburger.classList.toggle('active');
          menu.classList.toggle('active');
        };

        hamburger.addEventListener('click', toggleMenu, { passive: false });
        hamburger.addEventListener('touchstart', toggleMenu, { passive: false });

        document.querySelectorAll('.menu a').forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
          });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
          if (navbar && !navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
          }
        }, { passive: true });
      }

      // Scroll Reveal Animation
      const revealElements = document.querySelectorAll('.reveal');
      if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
      }

      // Bento Grid Mouse Effect
      const cards = document.querySelectorAll('.bento-card');
      if (cards.length > 0) {
        document.addEventListener('mousemove', (e) => {
          cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
          });
        });
      }

      // Accordion
      const accordions = document.querySelectorAll('.accordion-header');
      accordions.forEach(acc => {
        acc.addEventListener('click', () => {
          const item = acc.parentElement;
          item.classList.toggle('active');
          document.querySelectorAll('.accordion-item').forEach(i => {
            if (i !== item) {
              i.classList.remove('active');
            }
          });
        });
      });
    }
  }

  // Run immediately if DOM ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();