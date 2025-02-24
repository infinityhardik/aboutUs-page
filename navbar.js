/**
 * Navbar Scroll & Hamburger Menu Functionality
 *
 * - Changes the navbar background based on scroll position.
 * - Toggles the hamburger menu on click.
 * - Closes the menu when clicking a menu link or clicking outside.
 * - Provides keyboard accessibility and updates ARIA attributes.
 */

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

// Update the aria-expanded attribute on the hamburger
function updateHamburgerAria() {
  const expanded = hamburger.classList.contains('active');
  hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.remove('transparent');
    navbar.classList.add('solid');
  } else {
    navbar.classList.remove('solid');
    navbar.classList.add('transparent');
  }
});

// Hamburger Menu Toggle
function toggleHamburger(event) {
  event.stopPropagation();
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
  updateHamburgerAria();
}

hamburger.addEventListener('click', toggleHamburger);
// Allow toggling via keyboard (Enter or Space)
hamburger.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    toggleHamburger(event);
  }
});

// Close the menu when clicking any link inside it
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
    updateHamburgerAria();
  });
});

// Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
    updateHamburgerAria();
  }
});

// FAQ Accordion functionality with keyboard accessibility
document.querySelectorAll('.accordion .accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const parentItem = header.parentElement;
    const isActive = parentItem.classList.contains('active');
    parentItem.classList.toggle('active');
    header.setAttribute('aria-expanded', !isActive);
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      header.click();
    }
  });
});