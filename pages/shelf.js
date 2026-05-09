/* ============================================================
   SHELF PAGE — Book Collection
   Loads data dynamically from Admin Panel API
   ============================================================ */

(function() {
  'use strict';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';

  let allBooks = [];
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    setupFilters();
  });

  async function fetchBooks() {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;

    try {
      const response = await fetch(`${API_BASE}/books`);
      const data = await response.json();

      if (data.success && data.data) {
        allBooks = data.data;
        displayBooks(allBooks);
      } else {
        throw new Error('Failed to load books');
      }
    } catch (error) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center;">
          <div class="badge-dot" style="margin-bottom: 2rem;"></div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">Content coming soon</h3>
          <p style="color: var(--fog);">Books will appear here once published from the admin panel.</p>
        </div>
      `;
    }
  }

  function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;

    if (books.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center;">
          <div class="badge-dot" style="margin-bottom: 2rem;"></div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">No books match this category</h3>
          <p style="color: var(--fog);">Try selecting a different filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = books.map(book => createBookCard(book)).join('');

    setTimeout(() => {
      document.querySelectorAll('.book-card').forEach((card, index) => {
        setTimeout(() => card.classList.add('revealed'), index * 100);
      });
    }, 100);
  }

  function createBookCard(book) {
    const stars = book.rating ? '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) : 'Unrated';
    const statusBadge = getStatusBadge(book.readingStatus || book.status);
    const favoriteBadge = book.favorite ? '<span class="favorite-badge" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: var(--fire); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">Favorite</span>' : '';

    return `
      <article class="book-card" data-reveal>
        <div class="book-cover-wrapper" style="border: 1px solid rgba(250,250,248,0.1);">
          <div class="book-cover-placeholder">
            <div class="badge-dot" style="width: 12px; height: 12px; animation: none;"></div>
          </div>
          ${statusBadge}
          ${favoriteBadge}
        </div>
        
        <div class="book-info">
          <h3 class="book-title">${book.title || 'Untitled'}</h3>
          <p class="book-author">by ${book.author || 'Unknown'}</p>
          
          <div class="book-rating">
            <span class="stars">${stars}</span>
          </div>
          
          ${book.genre && book.genre.length > 0 ? `
            <div class="book-genres">
              ${book.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
            </div>
          ` : ''}
          
          <p class="book-review-excerpt">${truncateText(book.review, 150)}</p>
          
          ${book.review || book.notes ? `
          <button class="read-more-btn" onclick="window._shelfShowModal('${book._id}')">
            <span>Read Details</span>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
          ` : ''}
        </div>
      </article>
    `;
  }

  function getStatusBadge(status) {
    const badges = {
      'reading': '<span class="status-badge reading" style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">Reading</span>',
      'completed': '<span class="status-badge completed" style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">Completed</span>',
      'want-to-read': '<span class="status-badge want" style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">Want to Read</span>'
    };
    return badges[status] || '';
  }

  function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  function setupFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        filterBooks(currentFilter);
      });
    });
  }

  function filterBooks(filter) {
    let filtered = allBooks;
    switch(filter) {
      case 'reading':
        filtered = allBooks.filter(b => b.readingStatus === 'reading' || b.status === 'reading');
        break;
      case 'completed':
        filtered = allBooks.filter(b => b.readingStatus === 'completed' || b.status === 'completed');
        break;
      case 'favorite':
        filtered = allBooks.filter(b => b.favorite === true);
        break;
      case 'all':
      default:
        filtered = allBooks;
    }
    displayBooks(filtered);
  }

  // Expose modal function globally (needed for onclick)
  window._shelfShowModal = function(bookId) {
    const book = allBooks.find(b => b._id === bookId);
    if (!book) return;

    const modal = document.createElement('div');
    modal.className = 'book-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="window._shelfCloseModal()"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="window._shelfCloseModal()">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        
        <div class="modal-header">
          <div class="modal-cover-placeholder">
             <div class="badge-dot" style="width: 12px; height: 12px;"></div>
          </div>
          <div class="modal-title-section">
            <h2 class="modal-title">${book.title || 'Untitled'}</h2>
            <p class="modal-author">by ${book.author || 'Unknown'}</p>
            <div class="modal-rating">
               <span class="stars">${book.rating ? '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating) : 'Unrated'}</span>
            </div>
            ${book.genre && book.genre.length > 0 ? `
              <div class="modal-genres">
                ${book.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="modal-body">
          ${book.review ? `
            <h3>My Review</h3>
            <div class="modal-review">${book.review.replace(/\n/g, '<br>')}</div>
          ` : ''}
          
          ${book.notes ? `
            <h3>Personal Notes</h3>
            <div class="modal-notes">${book.notes.replace(/\n/g, '<br>')}</div>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('active'), 10);
  };

  window._shelfCloseModal = function() {
    const modal = document.querySelector('.book-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => modal.remove(), 300);
    }
  };

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window._shelfCloseModal();
  });

})();
