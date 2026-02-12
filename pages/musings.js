/* ============================================================
   MUSINGS PAGE - Dynamic Poem Loading
   ============================================================ */

(function() {
  'use strict';
  
  const API_BASE = 'https://my-personal-website-tyhs.onrender.com/api';
  let allPoems = [];
  let currentFilter = 'all';
  
  document.addEventListener('DOMContentLoaded', () => {
    loadPoems();
    setupFilters();
  });
  
  async function loadPoems() {
    try {
      const response = await fetch(`${API_BASE}/poems`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        allPoems = data.data;
        renderPoems(allPoems);
      } else {
        showEmptyState();
      }
    } catch (error) {
      console.error('Failed to load poems:', error);
      showErrorState();
    }
  }
  
  function renderPoems(poems) {
    const grid = document.getElementById('poemsGrid');
    if (!grid) return;
    
    if (poems.length === 0) {
      showEmptyState();
      return;
    }
    
    grid.innerHTML = poems.map((poem, index) => createPoemCard(poem, index)).join('');
    
    setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('revealed');
      });
    }, 100);
  }
  
  function createPoemCard(poem, index) {
    const delay = (index % 3) * 100;
    const moodEmoji = getMoodEmoji(poem.mood);
    
    return `
      <article class="poem-card-full" data-reveal style="animation-delay: ${delay}ms">
        <div class="poem-header">
          <span class="poem-number">#${String(index + 1).padStart(3, '0')}</span>
          <div class="poem-mood">
            <span class="mood-emoji">${moodEmoji}</span>
            <span class="mood-text">${poem.mood || 'contemplative'}</span>
          </div>
        </div>
        
        <h3 class="poem-title">${poem.title}</h3>
        
        <div class="poem-content">
          ${formatPoemContent(poem.content)}
        </div>
        
        ${poem.tags && poem.tags.length > 0 ? `
          <div class="poem-tags">
            ${poem.tags.slice(0, 3).map(tag => `
              <span class="poem-tag">#${tag}</span>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="poem-footer">
          <div class="poem-meta">
            <time datetime="${poem.publishedAt}">
              ${new Date(poem.publishedAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </time>
          </div>
          
          <div class="poem-stats">
            <span class="stat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              ${poem.stats?.views || 0}
            </span>
            <span class="stat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2.5l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L3 6l3.5-.5 1.5-3z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              ${poem.stats?.likes || 0}
            </span>
          </div>
        </div>
      </article>
    `;
  }
  
  function formatPoemContent(content) {
    // Show first 6 lines or 300 characters
    const lines = content.split('\n').slice(0, 6);
    const preview = lines.join('\n');
    
    return preview.length < content.length ? 
      `<pre>${preview}...</pre>` : 
      `<pre>${preview}</pre>`;
  }
  
  function getMoodEmoji(mood) {
    const moods = {
      'contemplative': '🤔',
      'melancholic': '🌧️',
      'joyful': '✨',
      'romantic': '💕',
      'dark': '🌑',
      'hopeful': '🌅'
    };
    return moods[mood] || '📝';
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
  
  function showEmptyState() {
    const grid = document.getElementById('poemsGrid');
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✍️</div>
        <h3>No poems yet</h3>
        <p>The muse is gathering inspiration...</p>
      </div>
    `;
  }
  
  function showErrorState() {
    const grid = document.getElementById('poemsGrid');
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Failed to load poems</h3>
        <p>Please try refreshing the page</p>
      </div>
    `;
  }
  
})();
