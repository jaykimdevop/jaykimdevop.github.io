/**
 * Theme Toggle Module
 * Handles dark/light mode switching with localStorage persistence
 */
(function() {
  'use strict';

  const THEME_KEY = 'blog-theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  /**
   * Get the user's preferred theme
   * Priority: localStorage > system preference > light (default)
   */
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_THEME;
    }
    
    return LIGHT_THEME;
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update Giscus theme if it exists
    updateGiscusTheme(theme);
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }

  /**
   * Update Giscus comment theme
   */
  function updateGiscusTheme(theme) {
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) {
      const giscusTheme = theme === DARK_THEME ? 'dark' : 'light';
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        'https://giscus.app'
      );
    }
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    // Apply theme immediately to prevent flash
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Set up toggle button event listener
    document.addEventListener('DOMContentLoaded', function() {
      const toggleBtn = document.getElementById('theme-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
      }
    });

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        }
      });
    }
  }

  // Initialize theme immediately
  initTheme();

  // Expose for external use
  window.ThemeManager = {
    toggle: toggleTheme,
    apply: applyTheme,
    get: getPreferredTheme
  };
})();

