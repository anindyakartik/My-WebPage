/* ============================================================
   NOW PAGE — Current Focus Cards
   Loads data dynamically from Admin Panel API
   ============================================================ */

(function() {
  'use strict';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';

  document.addEventListener('DOMContentLoaded', fetchNowCards);

  async function fetchNowCards() {
    const container = document.getElementById('nowCardsContainer');
    if (!container) return;

    try {
      const response = await fetch(`${API_BASE}/now`);
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        renderNowCards(data.data);
        updateLastUpdated(data.data);
      } else {
        renderEmptyState();
      }
    } catch (error) {
      renderEmptyState();
    }
  }

  function renderEmptyState() {
    const container = document.getElementById('nowCardsContainer');
    container.innerHTML = `
      <p class="empty-state-text" style="color: rgba(255,255,255,0.5); text-align: center; padding: 4rem 2rem; grid-column: 1/-1; font-family: 'Fraunces', serif; font-style: italic;">
        Content coming soon — check back later.
      </p>
    `;
  }

  function renderNowCards(cards) {
    const container = document.getElementById('nowCardsContainer');
    container.innerHTML = cards.map(createNowCard).join('');

    setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 80);
      });
    }, 50);
  }

  function createNowCard(card) {
    const bodyHtml = (card.body || []).map(p => `<p class="now-card__body">${p}</p>`).join('');

    const booksHtml = (card.books && card.books.length > 0) ? `
      <div class="now-card__books">
        <p class="now-card__books-label">On the stack right now —</p>
        <ul class="now-card__booklist">
          ${card.books.map(b => `
            <li>
              <span class="now-card__book-title">${b.title || ''}</span>
              <span class="now-card__book-author">— ${b.author || ''}</span>
              <span class="now-card__book-note">${b.note || ''}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <div class="now-card ${card.featured ? 'now-card--featured' : ''}">
        <div class="now-card__eyebrow">
          <span class="now-card__tag">${card.tag || 'Now'}</span>
          ${card.label ? `<span class="now-card__dot"></span><span class="now-card__label">${card.label}</span>` : ''}
        </div>
        <h3 class="now-card__title">${card.title}</h3>
        ${bodyHtml}
        ${booksHtml}
      </div>
    `;
  }

  function updateLastUpdated(cards) {
    const el = document.getElementById('nowUpdated');
    if (!el) return;
    const latest = cards.reduce((acc, c) => {
      const t = new Date(c.updatedAt || c.createdAt).getTime();
      return t > acc ? t : acc;
    }, 0);
    if (latest > 0) {
      const formatted = new Date(latest).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      el.textContent = `Last updated: ${formatted}`;
    }
  }

})();
