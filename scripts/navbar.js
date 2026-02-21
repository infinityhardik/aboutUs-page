(function () {
  'use strict';

  function initNavbar() {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
      // Breadcrumb visibility on scroll
      const breadcrumb = document.querySelector('.breadcrumb');
      let lastScrollY = window.scrollY;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Navbar Scrolled Effect
        if (currentScrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Breadcrumb Dynamic Visibility (Hide on scroll down, show on scroll up)
        if (breadcrumb) {
          // Lower threshold (50px) for mobile responsiveness
          const threshold = 50;

          if (currentScrollY > lastScrollY && currentScrollY > threshold) {
            // Scrolling down - Hide
            breadcrumb.classList.add('breadcrumb-hidden');
          } else {
            // Scrolling up or at the top - Show
            breadcrumb.classList.remove('breadcrumb-hidden');
          }
        }

        lastScrollY = Math.max(0, currentScrollY);
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