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
