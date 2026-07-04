/* ============================================================
   MUSINGS PAGE — Poetry & Blog
   Loads poems + blog posts dynamically from Admin Panel API
   ============================================================ */

(function() {
  'use strict';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';

  let allEntries = [];
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    fetchEntries();
    setupFilters();
  });

  async function fetchEntries() {
    const grid = document.getElementById('poemsGrid');
    if (!grid) return;

    try {
      const [poemsRes, blogRes] = await Promise.all([
        fetch(`${API_BASE}/poems`),
        fetch(`${API_BASE}/blog`)
      ]);
      const poemsData = await poemsRes.json();
      const blogData = await blogRes.json();

      const poems = (poemsData.success && poemsData.data ? poemsData.data : []).map(p => ({ ...p, type: 'poetry' }));
      const posts = (blogData.success && blogData.data ? blogData.data : []).map(p => ({ ...p, type: 'blog' }));

      allEntries = [...poems, ...posts].sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt);
        const dateB = new Date(b.publishedAt || b.createdAt);
        return dateB - dateA;
      });

      if (allEntries.length === 0) throw new Error('No content');
      renderEntries(allEntries);
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

  function renderEntries(entries) {
    const grid = document.getElementById('poemsGrid');
    if (!grid) return;

    if (entries.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center;">
          <div class="badge-dot" style="margin-bottom: 2rem;"></div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">Nothing here yet</h3>
          <p style="color: var(--fog);">Try a different filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = entries.map((entry, index) =>
      entry.type === 'poetry' ? createPoemCard(entry, index) : createBlogCard(entry, index)
    ).join('');

    grid.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.blog-card-full');
        const isExpanded = card.classList.toggle('blog-card-full--expanded');
        btn.textContent = isExpanded ? 'Show less' : 'Read more';
      });
    });

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

        ${poem.imageUrl ? `<img src="${poem.imageUrl}" alt="" class="poem-image">` : ''}

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

  function createBlogCard(post, index) {
    const delay = (index % 3) * 100;
    const pubDate = post.publishedAt || post.createdAt || new Date();
    const paragraphs = (post.content || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    return `
      <article class="blog-card-full" data-reveal style="animation-delay: ${delay}ms">
        ${post.coverImage ? `<img src="${post.coverImage}" alt="" class="blog-card-full__cover">` : ''}

        <div class="poem-header">
          <span class="poem-number">#${String(index + 1).padStart(3, '0')}</span>
          <div class="poem-mood" style="background: rgba(250,250,248,0.03); padding: 4px 12px; border-radius: 100px; border: 1px solid rgba(250,250,248,0.1);">
            <div class="badge-dot" style="width: 4px; height: 4px; margin-right: 6px; display: inline-block; vertical-align: middle;"></div>
            <span class="mood-text">${post.category || 'thoughts'}</span>
          </div>
        </div>

        <h3 class="poem-title">${post.title || 'Untitled'}</h3>

        <p class="blog-card-full__excerpt">${post.excerpt || ''}</p>

        <div class="blog-card-full__full">
          ${paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>

        <button type="button" class="read-more-btn">Read more</button>

        ${post.tags && post.tags.length > 0 ? `
          <div class="poem-tags">
            ${post.tags.map(tag => `<span class="poem-tag">#${tag}</span>`).join('')}
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
          <div class="poem-stats">
            <span class="stat">${post.readTime || 5} min read</span>
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
        filterEntries(filter);
      });
    });
  }

  function filterEntries(filter) {
    let filtered = allEntries;
    if (filter !== 'all') {
      filtered = allEntries.filter(e => e.type === filter);
    }
    renderEntries(filtered);
  }

})();
