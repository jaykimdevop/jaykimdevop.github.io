/**
 * Post Loader Module
 * Handles markdown loading, parsing, and Giscus comments
 */

(function() {
  'use strict';

  // DOM Elements
  const postTitle = document.getElementById('post-title');
  const postDate = document.getElementById('post-date');
  const postCategory = document.getElementById('post-category');
  const postTags = document.getElementById('post-tags');
  const postContent = document.getElementById('post-content');
  const giscusContainer = document.getElementById('giscus-container');

  /**
   * Get filename from URL query parameter
   */
  function getFilenameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('file');
  }

  /**
   * Parse Front Matter from markdown content
   */
  function parseFrontMatter(content) {
    // Handle different line endings (CRLF, LF)
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
    const match = normalizedContent.match(frontMatterRegex);

    if (!match) {
      return { metadata: {}, content };
    }

    const frontMatter = match[1];
    const postContent = match[2];
    const metadata = {};

    // Parse each line of front matter
    frontMatter.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Parse arrays (tags)
        if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value.slice(1, -1)
              .split(',')
              .map(tag => tag.trim().replace(/^['"]|['"]$/g, ''));
          }
        }

        metadata[key] = value;
      }
    });

    return { metadata, content: postContent };
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
   * Configure marked.js
   */
  function configureMarked() {
    if (typeof marked === 'undefined') {
      console.error('marked.js not loaded');
      return;
    }

    marked.setOptions({
      highlight: function(code, lang) {
        if (typeof Prism !== 'undefined' && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
      breaks: true,
      gfm: true
    });
  }

  /**
   * Render markdown content to HTML
   */
  function renderMarkdown(markdownContent) {
    if (typeof marked === 'undefined') {
      return `<p>마크다운 파서를 불러올 수 없습니다.</p><pre>${markdownContent}</pre>`;
    }
    return marked.parse(markdownContent);
  }

  /**
   * Render post metadata to DOM
   */
  function renderMetadata(metadata, filename) {
    // Title
    const title = metadata.title || filename.replace('.md', '');
    if (postTitle) {
      postTitle.textContent = title;
    }
    document.title = `${title} - jaykimdevop's Blog`;

    // Date
    if (postDate && metadata.date) {
      postDate.textContent = formatDate(metadata.date);
      postDate.setAttribute('datetime', metadata.date);
    }
  
    // Category
    if (postCategory && metadata.category) {
      postCategory.textContent = metadata.category;
    } else if (postCategory) {
      postCategory.style.display = 'none';
    }

    // Tags
    if (postTags && metadata.tags && Array.isArray(metadata.tags)) {
      postTags.innerHTML = metadata.tags
        .map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`)
        .join('');
    }

    // Update meta description
    if (metadata.description) {
      updateMetaDescription(metadata.description);
    }

    // Update og:title for Giscus title mapping
    updateMetaTag('og:title', title, true);
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
   * Update meta description tag
   */
  function updateMetaDescription(description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }

  /**
   * Update or create meta tag
   */
  function updateMetaTag(name, content, property = false) {
    const attr = property ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  /**
   * Load Giscus comments
   */
  function loadGiscus() {
    if (!giscusContainer) return;

    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const giscusTheme = currentTheme === 'dark' ? 'dark' : 'light';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'jaykimdevop/jaykimdevop.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOQec2DQ');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOQec2Dc4CzI0S');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'ko');
    script.crossOrigin = 'anonymous';
    script.async = true;

    giscusContainer.appendChild(script);
  }

  /**
   * Show error message
   */
  function showError(message) {
    if (postTitle) {
      postTitle.textContent = '오류';
    }
    if (postContent) {
      postContent.innerHTML = `
        <div class="error-message">
          <p>${message}</p>
          <a href="index.html">← 목록으로 돌아가기</a>
        </div>
      `;
    }
  }

  /**
   * Load and render post
   */
  async function loadPost() {
    const filename = getFilenameFromUrl();

    if (!filename) {
      showError('게시글을 찾을 수 없습니다.');
      return;
    }

    try {
      // Fetch markdown file
      const response = await fetch(`pages/${filename}`);
      
      if (!response.ok) {
        throw new Error('게시글을 불러올 수 없습니다.');
      }

      const markdownContent = await response.text();

      // Parse front matter and content
      const { metadata, content } = parseFrontMatter(markdownContent);

      // Configure marked
      configureMarked();

      // Render metadata
      renderMetadata(metadata, filename);

      // Render content
      if (postContent) {
        postContent.innerHTML = renderMarkdown(content);

        // Re-highlight code blocks
        if (typeof Prism !== 'undefined') {
          Prism.highlightAllUnder(postContent);
        }
      }

      // Load comments
      loadGiscus();

    } catch (error) {
      console.error('Error loading post:', error);
      showError(error.message || '게시글을 불러오는 중 오류가 발생했습니다.');
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', loadPost);
})();

