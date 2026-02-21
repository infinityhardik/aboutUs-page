// Theme Toggle Management
class ThemeManager {
  constructor() {
    this.THEME_KEY = 'theme-preference';
    this.LIGHT_THEME = 'light';
    this.DARK_THEME = 'dark';
    this.init();
  }

  init() {
    // Set dark theme as default by checking for saved preference
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const preferredTheme = savedTheme || this.DARK_THEME;
    this.setTheme(preferredTheme);
    this.attachToggleListener();
  }

  setTheme(theme) {
    // Validate theme
    if (![this.LIGHT_THEME, this.DARK_THEME].includes(theme)) {
      theme = this.DARK_THEME;
    }

    // Apply theme to HTML element
    document.documentElement.setAttribute('data-theme', theme);

    // Save preference to localStorage
    localStorage.setItem(this.THEME_KEY, theme);

    // Update toggle button state if it exists
    this.updateToggleButton(theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || this.DARK_THEME;
    const newTheme = currentTheme === this.LIGHT_THEME ? this.DARK_THEME : this.LIGHT_THEME;
    this.setTheme(newTheme);
  }

  attachToggleListener() {
    // Listen for theme toggle button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) {
        this.toggleTheme();
      }
    });
  }

  updateToggleButton(theme) {
    const buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(btn => {
      if (theme === this.LIGHT_THEME) {
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.innerHTML = '<i class="fas fa-moon"></i>';
        btn.title = 'Dark Mode';
      } else {
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.innerHTML = '<i class="fas fa-sun"></i>';
        btn.title = 'Light Mode';
      }
    });
  }

  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.DARK_THEME;
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}
