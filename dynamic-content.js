/* ============================================================
   DYNAMIC CONTENT LOADER
   Loads real content from the admin panel API into homepage
   ============================================================ */

(function() {
  'use strict';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';
  const API_TIMEOUT = 6000;

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('home-poems')) loadHomePoems();
    if (document.getElementById('home-projects')) loadHomeProjects();
    if (document.getElementById('home-books')) loadHomeBooks();
  });

  async function fetchJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  // ---- POEMS ----
  async function loadHomePoems() {
    const container = document.getElementById('home-poems');
    try {
      const data = await fetchJSON(`${API_BASE}/poems`);
      if (!data.success || !data.data || data.data.length === 0) {
        container.innerHTML = emptyState('No writings published yet.', 'musings.html');
        return;
      }
      const poems = data.data.slice(0, 3);
      let html = '';

      poems.forEach((poem, i) => {
        const date = poem.createdAt ? new Date(poem.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '';
        const excerpt = poem.content ? poem.content.substring(0, 180).replace(/\n/g, '<br>') + '...' : '';
        const isFeatured = i === 0;

        html += `
          <article class="poem-card ${isFeatured ? 'featured' : ''}" data-reveal>
            <div class="poem-number">${String(i + 1).padStart(3, '0')}</div>
            <div class="poem-meta">
              <time>${date}</time>
              ${poem.mood ? `<span class="poem-tag">${poem.mood}</span>` : ''}
            </div>
            <h3 class="poem-title">${poem.title}</h3>
            ${isFeatured ? `<div class="poem-excerpt"><p>${excerpt}</p></div>` : `<p class="poem-preview">${excerpt}</p>`}
            <a href="musings.html" class="${isFeatured ? 'poem-link' : 'poem-link-small'}">
              ${isFeatured ? '<span>Read full poem</span><svg width="20" height="20" viewBox="0 0 20 20"><path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>' : 'Read →'}
            </a>
          </article>`;
      });

      container.innerHTML = html;
      triggerReveal();
    } catch (e) {
      container.innerHTML = emptyState('Writings will appear here once published.');
    }
  }

  // ---- PROJECTS ----
  async function loadHomeProjects() {
    const container = document.getElementById('home-projects');
    try {
      const data = await fetchJSON(`${API_BASE}/projects`);
      if (!data.success || !data.data || data.data.length === 0) {
        container.innerHTML = emptyState('No projects published yet.', 'work.html');
        return;
      }
      const projects = data.data.slice(0, 4);
      let html = '<div class="project-grid">';

      projects.forEach(proj => {
        const techs = proj.technologies ? proj.technologies.map(t => `<span class="tech-pill">${t}</span>`).join('') : '';
        html += `
          <article class="project-card" data-reveal>
            <div class="card-header">
              <h4 class="card-title">${proj.title}</h4>
              ${proj.liveUrl || proj.githubUrl ? `
                <a href="${proj.liveUrl || proj.githubUrl}" target="_blank" class="card-link">
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M13 2h3v3M16 2L8 10M6 2H2v14h14v-4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  </svg>
                </a>` : ''}
            </div>
            <p class="card-description">${proj.description || ''}</p>
            ${techs ? `<div class="project-tech">${techs}</div>` : ''}
            <div class="card-footer">
              <span class="card-year">${proj.year || new Date(proj.createdAt).getFullYear()}</span>
              <span class="card-tag">${proj.status || proj.category || ''}</span>
            </div>
          </article>`;
      });

      html += '</div>';
      container.innerHTML = html;
      triggerReveal();
    } catch (e) {
      container.innerHTML = emptyState('Projects will appear here once published.');
    }
  }

  // ---- BOOKS ----
  async function loadHomeBooks() {
    const container = document.getElementById('home-books');
    try {
      const data = await fetchJSON(`${API_BASE}/books`);
      if (!data.success || !data.data || data.data.length === 0) {
        container.innerHTML = emptyState('No books added yet.', 'shelf.html');
        return;
      }
      const books = data.data.slice(0, 6);
      const colors = ['#dc2626', '#2563eb', '#16a34a', '#ea580c', '#7c3aed', '#0891b2'];
      let html = '<div class="shelf-row">';

      books.forEach((book, i) => {
        const color = colors[i % colors.length];
        const tilt = (i % 5 - 2) + 'deg';
        const width = 38 + (i % 4) * 4;
        const stars = book.rating ? '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) : '';

        html += `
          <div class="book ${book.status === 'reading' ? 'reading' : ''}" style="--book-color: ${color}; --book-width: ${width}px; --book-tilt: ${tilt};">
            <div class="book-spine">
              <span class="spine-text">${book.title}</span>
              <div class="book-shine"></div>
              ${book.status === 'reading' ? '<div class="reading-marker"></div>' : ''}
            </div>
            <div class="book-tooltip">
              <h4>${book.title}</h4>
              <p>${book.author}</p>
              ${book.status === 'reading' ? '<div class="reading-badge">Currently Reading</div>' : (stars ? `<div class="rating">${stars}</div>` : '')}
              ${book.review ? `<span class="note">"${book.review.substring(0, 60)}"</span>` : ''}
            </div>
          </div>`;
      });

      html += '</div>';
      container.innerHTML = html;
      triggerReveal();
    } catch (e) {
      container.innerHTML = emptyState('Books will appear here once added.');
    }
  }

  // ---- Helpers ----
  function emptyState(text, linkHref) {
    return `
      <div class="empty-state" data-reveal>
        <p style="color: rgba(255,255,255,0.4); text-align: center; padding: 4rem 2rem; font-family: 'Fraunces', serif; font-style: italic; font-size: 1.1rem;">
          ${text}
        </p>
      </div>`;
  }

  function triggerReveal() {
    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => observer.observe(el));
    }, 100);
  }

})();
