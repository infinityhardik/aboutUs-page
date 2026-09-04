// Theme Toggle Management
class ThemeManager {
  constructor() {
    this.THEME_KEY = 'theme-preference';
    this.LIGHT_THEME = 'light';
    this.DARK_THEME = 'dark';
    this.init();
  }

  init() {
    // An explicit saved choice wins; otherwise follow the OS, defaulting to dark.
    // The inline script in <head> already applied this before first paint, so this
    // only re-confirms it and wires up the toggle.
    this.setTheme(this.resolveInitialTheme());
    this.attachToggleListener();
    this.watchSystemPreference();
  }

  resolveInitialTheme() {
    let saved = null;
    try { saved = localStorage.getItem(this.THEME_KEY); } catch (e) { /* storage blocked */ }
    if (saved === this.LIGHT_THEME || saved === this.DARK_THEME) return saved;
    return this.prefersLight() ? this.LIGHT_THEME : this.DARK_THEME;
  }

  prefersLight() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  // Follow the OS while the visitor has not chosen a theme themselves.
  watchSystemPreference() {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      let saved = null;
      try { saved = localStorage.getItem(this.THEME_KEY); } catch (err) { /* storage blocked */ }
      if (saved === this.LIGHT_THEME || saved === this.DARK_THEME) return;
      this.applyTheme(e.matches ? this.LIGHT_THEME : this.DARK_THEME);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // Apply without persisting, so following the OS does not count as a choice.
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateToggleButton(theme);
  }

  setTheme(theme) {
    // Validate theme
    if (![this.LIGHT_THEME, this.DARK_THEME].includes(theme)) {
      theme = this.DARK_THEME;
    }

    // Apply theme to HTML element
    document.documentElement.setAttribute('data-theme', theme);

    // Save preference to localStorage (may throw in private mode)
    try { localStorage.setItem(this.THEME_KEY, theme); } catch (e) { /* storage blocked */ }

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
