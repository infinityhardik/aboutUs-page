// Services Navigation Script
// Handles breadcrumb, active states, and service page navigation

document.addEventListener('DOMContentLoaded', function() {
  // Set active service in breadcrumb/navigation
  const currentPath = window.location.pathname;
  
  // Highlight current service in navigation
  const serviceLinks = document.querySelectorAll('a[href*="/services/"]');
  serviceLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });

  // Service page metadata for breadcrumbs
  const servicePages = {
    'plywood-wholesaler-rajkot.html': {
      name: 'Plywood Wholesaler',
      silo: 'Plywood',
      parent: '../services/'
    },
    'marine-plywood-710-grade-rajkot.html': {
      name: 'Marine Plywood 710',
      silo: 'Plywood',
      parent: 'plywood-wholesaler-rajkot.html'
    },
    'commercial-plywood-mr-grade.html': {
      name: 'Commercial Plywood',
      silo: 'Plywood',
      parent: 'plywood-wholesaler-rajkot.html'
    },
    'gurjan-plywood-dealer.html': {
      name: 'Gurjan Plywood',
      silo: 'Plywood',
      parent: 'plywood-wholesaler-rajkot.html'
    },
    'shuttering-plywood-construction.html': {
      name: 'Shuttering Plywood',
      silo: 'Plywood',
      parent: 'plywood-wholesaler-rajkot.html'
    },
    'flexible-plywood-supplier.html': {
      name: 'Flexible Plywood',
      silo: 'Plywood',
      parent: 'plywood-wholesaler-rajkot.html'
    },
    'flush-doors-manufacturer-supplier.html': {
      name: 'Flush Doors',
      silo: 'Flush Doors',
      parent: '../services/'
    },
    'waterproof-flush-doors-bwp.html': {
      name: 'Waterproof Doors',
      silo: 'Flush Doors',
      parent: 'flush-doors-manufacturer-supplier.html'
    },
    'laminated-flush-doors-designs.html': {
      name: 'Laminated Doors',
      silo: 'Flush Doors',
      parent: 'flush-doors-manufacturer-supplier.html'
    },
    'pine-wood-flush-doors.html': {
      name: 'Pine Wood Doors',
      silo: 'Flush Doors',
      parent: 'flush-doors-manufacturer-supplier.html'
    },
    'waterproof-bathroom-doors.html': {
      name: 'Bathroom Doors',
      silo: 'Flush Doors',
      parent: 'flush-doors-manufacturer-supplier.html'
    },
    'block-board-dealer-rajkot.html': {
      name: 'Block Board Dealer',
      silo: 'Block Boards',
      parent: '../services/'
    },
    'pine-wood-block-board.html': {
      name: 'Pine Wood Block Board',
      silo: 'Block Boards',
      parent: 'block-board-dealer-rajkot.html'
    },
    'poplar-block-board.html': {
      name: 'Poplar Block Board',
      silo: 'Block Boards',
      parent: 'block-board-dealer-rajkot.html'
    },
    'bwp-waterproof-block-board.html': {
      name: 'BWP Waterproof Block Board',
      silo: 'Block Boards',
      parent: 'block-board-dealer-rajkot.html'
    },
    'decorative-laminates-sheets.html': {
      name: 'Decorative Laminates',
      silo: 'Laminates',
      parent: '../services/'
    },
    'sunmica-dealers-rajkot.html': {
      name: 'Sunmica Dealers',
      silo: 'Laminates',
      parent: 'decorative-laminates-sheets.html'
    },
    'liner-laminates-inner.html': {
      name: 'Liner Laminates',
      silo: 'Laminates',
      parent: 'decorative-laminates-sheets.html'
    }
  };

  // Enhance breadcrumbs with silo information
  const breadcrumbs = document.querySelector('.breadcrumb');
  if (breadcrumbs) {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const serviceInfo = servicePages[currentFile];
    
    if (serviceInfo && serviceInfo !== 'index.html') {
      // Find the last breadcrumb item and add silo info
      const lastSpan = breadcrumbs.querySelector('span:last-of-type');
      if (lastSpan && !lastSpan.textContent.includes('Services')) {
        const siloLink = document.createElement('a');
        siloLink.href = '../services/';
        siloLink.innerHTML = '<i class="fas fa-folder-open"></i> ' + serviceInfo.silo;
        
        const separator = document.createElement('span');
        separator.textContent = '/';
        
        breadcrumbs.appendChild(separator);
        breadcrumbs.appendChild(siloLink);
      }
    }
  }

  // Add smooth scroll behavior for service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('a')) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          window.location.href = href;
        }
      }
    });
  });

  // Silo tab functionality
  const siloTabs = document.querySelectorAll('.silo-tab');
  siloTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      siloTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Add keyboard navigation for service cards
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close any open service details
      const openModals = document.querySelectorAll('.service-modal.active');
      openModals.forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });

  // Track service page views for analytics
  function trackServiceView() {
    const currentFile = window.location.pathname.split('/').pop();
    const serviceInfo = servicePages[currentFile];
    
    if (serviceInfo) {
      // Send custom event to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'service_page_view', {
          'service_name': serviceInfo.name,
          'service_silo': serviceInfo.silo
        });
      }
    }
  }

  // Call tracking function
  trackServiceView();

  // Add copy-to-clipboard for contact info
  const contactInfo = document.querySelectorAll('.cta-phone');
  contactInfo.forEach(info => {
    info.addEventListener('click', function(e) {
      e.preventDefault();
      const phone = this.textContent.match(/\+\d+/)[0];
      navigator.clipboard.writeText(phone).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      });
    });
  });
});

// Service page specific features

// Related products sidebar (if exists)
function initRelatedProducts() {
  const relatedLinks = document.querySelectorAll('.quick-links a');
  relatedLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
}

// FAQ Accordion enhancement
function enhanceFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.setAttribute('data-index', index);
      question.addEventListener('click', function() {
        // Close other FAQs in same section
        const section = this.closest('.faq-section');
        section.querySelectorAll('.faq-item').forEach(i => {
          if (i !== item) {
            i.classList.remove('active');
          }
        });
      });
    }
  });
}

// Spec table enhancements
function enhanceSpecTables() {
  const tables = document.querySelectorAll('.specs-table');
  tables.forEach(table => {
    // Add hover effects
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(59, 130, 246, 0.08)';
      });
      row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
      });
    });
  });
}

// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initRelatedProducts();
  enhanceFAQs();
  enhanceSpecTables();
});

// Utility function: Get service info from current page
function getCurrentServiceInfo() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const servicePages = {
    'plywood-wholesaler-rajkot.html': 'Plywood',
    'marine-plywood-710-grade-rajkot.html': 'Marine Plywood',
    'commercial-plywood-mr-grade.html': 'Commercial Plywood',
    'gurjan-plywood-dealer.html': 'Gurjan Plywood',
    'shuttering-plywood-construction.html': 'Shuttering Plywood',
    'flexible-plywood-supplier.html': 'Flexible Plywood',
    'flush-doors-manufacturer-supplier.html': 'Flush Doors',
    'waterproof-flush-doors-bwp.html': 'Waterproof Doors',
    'laminated-flush-doors-designs.html': 'Laminated Doors',
    'pine-wood-flush-doors.html': 'Pine Wood Doors',
    'waterproof-bathroom-doors.html': 'Bathroom Doors',
    'block-board-dealer-rajkot.html': 'Block Board',
    'pine-wood-block-board.html': 'Pine Wood Block Board',
    'poplar-block-board.html': 'Poplar Block Board',
    'bwp-waterproof-block-board.html': 'Waterproof Block Board',
    'decorative-laminates-sheets.html': 'Decorative Laminates',
    'sunmica-dealers-rajkot.html': 'Sunmica',
    'liner-laminates-inner.html': 'Liner Laminates'
  };
  
  return servicePages[currentFile] || null;
}

// SEO optimization: Add structured data for current service
function addServiceStructuredData() {
  const serviceInfo = getCurrentServiceInfo();
  if (!serviceInfo) return;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': serviceInfo,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Mahadev Traders',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Nr. S.T. Workshop, Gondal Road',
        'addressLocality': 'Rajkot',
        'addressRegion': 'Gujarat',
        'postalCode': '360004',
        'addressCountry': 'IN'
      },
      'telephone': '+916355360702'
    },
    'areaServed': ['Rajkot', 'Gujarat', 'India'],
    'url': window.location.href
  };

  // Add or update structured data script tag
  let schemaScript = document.querySelector('script[data-service-schema]');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.setAttribute('data-service-schema', 'true');
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(schema);
}

// Call on page load
window.addEventListener('load', addServiceStructuredData);
