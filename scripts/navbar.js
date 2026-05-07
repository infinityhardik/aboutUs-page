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
        const closeMenu = () => {
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.setAttribute('aria-label', 'Open navigation menu');
          menu.classList.remove('active');
        };

        const toggleMenu = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          const isOpen = hamburger.classList.toggle('active');
          menu.classList.toggle('active', isOpen);
          hamburger.setAttribute('aria-expanded', String(isOpen));
          hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        };

        hamburger.addEventListener('click', toggleMenu, { passive: false });

        document.querySelectorAll('.menu a').forEach(link => {
          link.addEventListener('click', () => {
            closeMenu();
          });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
          if (navbar && !navbar.contains(e.target)) {
            closeMenu();
          }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            closeMenu();
          }
        });
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
      const accordionItems = document.querySelectorAll('.accordion-item');
      const closeAccordion = (item) => {
        const trigger = item.querySelector('.accordion-header');
        const panel = item.querySelector('.accordion-body');
        if (!trigger || !panel) return;

        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = panel.scrollHeight + 'px';

        window.requestAnimationFrame(() => {
          panel.style.maxHeight = '0px';
        });

        window.setTimeout(() => {
          if (!item.classList.contains('active')) {
            panel.hidden = true;
          }
        }, 260);
      };

      const openAccordion = (item) => {
        const trigger = item.querySelector('.accordion-header');
        const panel = item.querySelector('.accordion-body');
        if (!trigger || !panel) return;

        accordionItems.forEach(otherItem => {
          if (otherItem !== item) {
            closeAccordion(otherItem);
          }
        });

        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        panel.style.maxHeight = panel.scrollHeight + 'px';
      };

      accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-header');
        const panel = item.querySelector('.accordion-body');
        if (!trigger || !panel) return;

        panel.style.maxHeight = '0px';
        trigger.addEventListener('click', () => {
          if (item.classList.contains('active')) {
            closeAccordion(item);
          } else {
            openAccordion(item);
          }
        });
      });

      window.addEventListener('resize', () => {
        accordionItems.forEach(item => {
          const panel = item.querySelector('.accordion-body');
          if (item.classList.contains('active') && panel) {
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        });
      }, { passive: true });

      // Product and service page FAQ accordions. A capture-phase handler prevents
      // older inline page scripts from double-toggling the same click.
      const faqItems = document.querySelectorAll('.faq-item');
      const closeFaq = (item) => {
        const trigger = item.querySelector('.faq-question');
        const panel = item.querySelector('.faq-answer');
        if (!trigger || !panel) return;

        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');

        if (!panel.hidden) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
          window.requestAnimationFrame(() => {
            panel.style.maxHeight = '0px';
          });
        }

        window.setTimeout(() => {
          if (!item.classList.contains('active')) {
            panel.hidden = true;
          }
        }, 320);
      };

      const openFaq = (item) => {
        const trigger = item.querySelector('.faq-question');
        const panel = item.querySelector('.faq-answer');
        const section = item.closest('.faq-section');
        if (!trigger || !panel || !section) return;

        section.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            closeFaq(otherItem);
          }
        });

        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        panel.style.maxHeight = panel.scrollHeight + 'px';
      };

      faqItems.forEach((item, index) => {
        const trigger = item.querySelector('.faq-question');
        const panel = item.querySelector('.faq-answer');
        if (!trigger || !panel) return;

        const questionId = trigger.id || `faq-question-auto-${index + 1}`;
        const answerId = panel.id || `faq-answer-auto-${index + 1}`;
        trigger.id = questionId;
        panel.id = answerId;
        trigger.setAttribute('type', 'button');
        trigger.setAttribute('aria-controls', answerId);
        trigger.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', questionId);

        if (item.classList.contains('active')) {
          panel.hidden = false;
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.hidden = true;
          panel.style.maxHeight = '0px';
        }
      });

      if (faqItems.length > 0) {
        document.addEventListener('click', (event) => {
          const trigger = event.target.closest('.faq-question');
          if (!trigger) return;

          const item = trigger.closest('.faq-item');
          if (!item) return;

          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          if (item.classList.contains('active')) {
            closeFaq(item);
          } else {
            openFaq(item);
          }
        }, true);

        window.addEventListener('resize', () => {
          faqItems.forEach(item => {
            const panel = item.querySelector('.faq-answer');
            if (item.classList.contains('active') && panel) {
              panel.style.maxHeight = panel.scrollHeight + 'px';
            }
          });
        }, { passive: true });
      }
    }
  }

  // Run immediately if DOM ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();
