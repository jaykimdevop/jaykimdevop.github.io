/**
 * Search Module
 * Handles client-side search functionality with debouncing
 */
(function() {
  'use strict';

  // DOM Elements
  const searchInput = document.getElementById('search-input');

  // Debounce timer
  let debounceTimer = null;
  const DEBOUNCE_DELAY = 300;

  /**
   * Debounce function to limit search frequency
   */
  function debounce(func, delay) {
    return function(...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Handle search input
   */
  function handleSearch(event) {
    const query = event.target.value.trim();
    
    // Call the filter function from BlogApp
    if (window.BlogApp && typeof window.BlogApp.filterAndRenderPosts === 'function') {
      window.BlogApp.filterAndRenderPosts(query);
    }
  }

  /**
   * Clear search input
   */
  function clearSearch() {
    if (searchInput) {
      searchInput.value = '';
      handleSearch({ target: { value: '' } });
    }
  }

  /**
   * Initialize search functionality
   */
  function init() {
    if (!searchInput) return;

    // Add input event listener with debouncing
    searchInput.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

    // Clear search on Escape key
    searchInput.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        clearSearch();
        searchInput.blur();
      }
    });

    // Focus search on '/' key (like GitHub)
    document.addEventListener('keydown', function(event) {
      // Don't trigger if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (event.key === '/') {
        event.preventDefault();
        searchInput.focus();
      }
    });
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  // Expose for external use
  window.BlogSearch = {
    clear: clearSearch
  };
})();

