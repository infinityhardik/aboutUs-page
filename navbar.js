/**
 * Navbar Scroll & Hamburger Menu Functionality
 *
 * - Changes the navbar background based on scroll position.
 * - Toggles the hamburger menu on click.
 * - Closes the menu when clicking a menu link or clicking outside.
 */

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

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
hamburger.addEventListener('click', (event) => {
  // Prevent the click event from propagating to the document
  event.stopPropagation();
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
});

// Close the menu when clicking any link inside it
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  });
});

// Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
  if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  }
});