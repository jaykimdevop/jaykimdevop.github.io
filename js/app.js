/**
 * Main Application Module
 * Handles post listing, tag filtering, and rendering
 */
(function() {
  'use strict';

  // State
  let allPosts = [];
  let activeTag = null;

  // DOM Elements
  const postsContainer = document.getElementById('posts-container');
  const tagFilter = document.getElementById('tag-filter');
  const loadingEl = document.getElementById('loading');
  const noResultsEl = document.getElementById('no-results');

  /**
   * Fetch posts data from posts.json
   */
  async function fetchPosts() {
    try {
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  /**
   * Format date string to localized format
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Create post card HTML
   */
  function createPostCard(post) {
    const tagsHtml = post.tags.map(tag => 
      `<span class="post-tag">${tag}</span>`
    ).join('');

    return `
      <a href="post.html?file=${encodeURIComponent(post.file)}" class="post-card">
        <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
        <div class="post-card-meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          ${post.category ? `<span>· ${escapeHtml(post.category)}</span>` : ''}
        </div>
        <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
        ${tagsHtml ? `<div class="post-card-tags">${tagsHtml}</div>` : ''}
      </a>
    `;
  }

  /**
   * Escape HTML special characters
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Render posts to container
   */
  function renderPosts(posts) {
    if (posts.length === 0) {
      postsContainer.innerHTML = '';
      noResultsEl.style.display = 'block';
      return;
    }

    noResultsEl.style.display = 'none';
    postsContainer.innerHTML = posts.map(createPostCard).join('');
  }

  /**
   * Get unique tags from all posts
   */
  function getAllTags(posts) {
    const tagSet = new Set();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }

  /**
   * Create tag filter buttons
   */
  function renderTagFilter(tags) {
    if (!tagFilter || tags.length === 0) return;

    const allBtn = `<button class="tag-btn active" data-tag="">전체</button>`;
    const tagBtns = tags.map(tag => 
      `<button class="tag-btn" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
    ).join('');

    tagFilter.innerHTML = allBtn + tagBtns;

    // Add click event listeners
    tagFilter.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', handleTagClick);
    });
  }

  /**
   * Handle tag button click
   */
  function handleTagClick(event) {
    const tag = event.target.dataset.tag;
    
    // Update active state
    tagFilter.querySelectorAll('.tag-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter posts
    activeTag = tag || null;
    filterAndRenderPosts();
  }

  /**
   * Filter posts by active tag and search query
   */
  function filterAndRenderPosts(searchQuery = '') {
    let filtered = allPosts;

    // Filter by tag
    if (activeTag) {
      filtered = filtered.filter(post => post.tags.includes(activeTag));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (post.category && post.category.toLowerCase().includes(query))
      );
    }

    renderPosts(filtered);
  }

  /**
   * Initialize application
   */
  async function init() {
    if (!postsContainer) return;

    try {
      // Fetch posts
      allPosts = await fetchPosts();

      // Hide loading
      if (loadingEl) {
        loadingEl.style.display = 'none';
      }

      // Render posts
      renderPosts(allPosts);

      // Render tag filter
      const tags = getAllTags(allPosts);
      renderTagFilter(tags);

    } catch (error) {
      console.error('Error initializing app:', error);
      if (loadingEl) {
        loadingEl.innerHTML = '<p>게시글을 불러오는 중 오류가 발생했습니다.</p>';
      }
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  // Expose for search module
  window.BlogApp = {
    filterAndRenderPosts,
    getAllPosts: () => allPosts
  };
})();

