// Performance Optimization: Lazy-load non-critical resources
if ('IntersectionObserver' in window) {
  // Lazy-load images more intelligently
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  images.forEach(img => imageObserver.observe(img));
}

// Defer non-critical animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!prefersReducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Optimize font loading
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
}

// Remove render-blocking scripts that aren't needed immediately
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navbar only after DOM is ready
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.navbar .menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
});

// Preload critical resources
function preloadCriticalResources() {
  const criticalImages = document.querySelectorAll('img:not([loading="lazy"])');
  const link = document.createElement('link');
  link.rel = 'prefetch';
  
  criticalImages.forEach(img => {
    if (img.src && img.src.includes('.webp')) {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = img.src;
      document.head.appendChild(prefetchLink);
    }
  });
}

if (window.requestIdleCallback) {
  requestIdleCallback(preloadCriticalResources);
} else {
  setTimeout(preloadCriticalResources, 2000);
}
