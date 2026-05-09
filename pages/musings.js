/* ============================================================
   MUSINGS PAGE — Poetry & Thoughts
   Loads data dynamically from Admin Panel API
   ============================================================ */

(function() {
  'use strict';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';

  let allPoems = [];
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    fetchPoems();
    setupFilters();
  });

  async function fetchPoems() {
    const grid = document.getElementById('poemsGrid');
    if (!grid) return;

    try {
      const response = await fetch(`${API_BASE}/poems`);
      const data = await response.json();

      if (data.success && data.data) {
        allPoems = data.data;
        renderPoems(allPoems);
      } else {
        throw new Error('Failed to load poems');
      }
    } catch (error) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center;">
          <div class="badge-dot" style="margin-bottom: 2rem;"></div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">Content coming soon</h3>
          <p style="color: var(--fog);">Writings will appear here once published from the admin panel.</p>
        </div>
      `;
    }
  }

  function renderPoems(poems) {
    const grid = document.getElementById('poemsGrid');
    if (!grid) return;

    if (poems.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center;">
          <div class="badge-dot" style="margin-bottom: 2rem;"></div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">No entries match this mood</h3>
          <p style="color: var(--fog);">Try selecting a different filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = poems.map((poem, index) => createPoemCard(poem, index)).join('');

    setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 80);
      });
    }, 50);
  }

  function createPoemCard(poem, index) {
    const delay = (index % 3) * 100;
    const pubDate = poem.publishedAt || poem.createdAt || new Date();

    return `
      <article class="poem-card-full" data-reveal style="animation-delay: ${delay}ms">
        <div class="poem-header">
          <span class="poem-number">#${String(index + 1).padStart(3, '0')}</span>
          <div class="poem-mood" style="background: rgba(250,250,248,0.03); padding: 4px 12px; border-radius: 100px; border: 1px solid rgba(250,250,248,0.1);">
            <div class="badge-dot" style="width: 4px; height: 4px; margin-right: 6px; display: inline-block; vertical-align: middle;"></div>
            <span class="mood-text">${poem.mood || 'contemplative'}</span>
          </div>
        </div>
        
        <h3 class="poem-title">${poem.title || 'Untitled'}</h3>
        
        <div class="poem-content">
          <pre>${poem.content || ''}</pre>
        </div>
        
        ${poem.tags && poem.tags.length > 0 ? `
          <div class="poem-tags">
            ${poem.tags.map(tag => `<span class="poem-tag">#${tag}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="poem-footer">
          <div class="poem-meta">
            <time datetime="${pubDate}">
              ${new Date(pubDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </time>
          </div>
        </div>
      </article>
    `;
  }

  function setupFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = filter;
        filterPoems(filter);
      });
    });
  }

  function filterPoems(filter) {
    let filtered = allPoems;
    if (filter !== 'all') {
      filtered = allPoems.filter(p => p.mood === filter);
    }
    renderPoems(filtered);
  }

})();
