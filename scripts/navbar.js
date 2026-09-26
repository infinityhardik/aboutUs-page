(function () {
  'use strict';

  function initNavbar() {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (navbar.dataset.navbarInitialized === 'true') {
        return;
      }
      navbar.dataset.navbarInitialized = 'true';

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
        if (!hamburger.hasAttribute('tabindex') && hamburger.tagName !== 'BUTTON') {
          hamburger.setAttribute('tabindex', '0');
        }
        if (!hamburger.hasAttribute('role') && hamburger.tagName !== 'BUTTON') {
          hamburger.setAttribute('role', 'button');
        }
        hamburger.setAttribute('aria-controls', menu.id || 'menu');

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
        hamburger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleMenu(e);
          }
        });

        document.querySelectorAll('.menu a').forEach(link => {
          link.addEventListener('click', () => {
            closeMenu();
          });
        });

        window.addEventListener('pagehide', closeMenu);
        window.addEventListener('pageshow', closeMenu);

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

/* Motion: marks [data-animate] elements with .is-in the first time they scroll into
   view, keeps [data-animate="loop"] graphics playing only while visible, and turns the
   grade guide into tabs. Everything is readable without it: CSS only hides an element's
   start state under html.js, and reduced-motion users get the end state immediately. */
(function () {
  'use strict';

  function initMotion() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('[data-animate]');

    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            el.classList.add('is-playing');
          } else {
            el.classList.remove('is-playing');
          }
          if (entry.isIntersecting && el.getAttribute('data-animate') !== 'loop') {
            io.unobserve(el);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { io.observe(el); });
    }

    // Grade guide: plain stacked sections without JS, tabs with it.
    document.querySelectorAll('[data-tabs]').forEach(function (tool) {
      var tabs = Array.prototype.slice.call(tool.querySelectorAll('[role="tab"]'));
      var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
      if (!tabs.length) return;
      tool.classList.add('tabs-ready');

      function select(i, focus) {
        tabs.forEach(function (t, j) {
          var on = i === j;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          if (panels[j]) panels[j].hidden = !on;
        });
        tool.setAttribute('data-level', panels[i] ? panels[i].getAttribute('data-level') : '1');
        // Restart the water-drop demo for the newly chosen room.
        var demo = tool.querySelector('.drop-demo');
        if (demo && !reduce) {
          demo.classList.remove('is-in');
          void demo.getBoundingClientRect();
          demo.classList.add('is-in');
        }
        if (focus) tabs[i].focus();
      }

      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(i, false); });
        t.addEventListener('keydown', function (e) {
          var k = e.key, n = tabs.length, next = null;
          if (k === 'ArrowRight' || k === 'ArrowDown') next = (i + 1) % n;
          if (k === 'ArrowLeft' || k === 'ArrowUp') next = (i - 1 + n) % n;
          if (k === 'Home') next = 0;
          if (k === 'End') next = n - 1;
          if (next !== null) { e.preventDefault(); select(next, true); }
        });
      });
      select(0, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotion);
  } else {
    initMotion();
  }
})();
