// Products Navigation - Category Tab Switching
document.querySelectorAll('.category-tab').forEach(button => {
  button.addEventListener('click', function() {
    const categoryId = this.getAttribute('data-category');
    
    // Remove active class from all buttons
    document.querySelectorAll('.category-tab').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    this.classList.add('active');
    
    // Scroll to category
    const categoryElement = document.getElementById(categoryId);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}

// Close menu when a link is clicked
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
  });
});
