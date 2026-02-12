/* ============================================================
   SHELF PAGE - Dynamic Book Loading
   ============================================================ */

const API_BASE = 'https://my-personal-website-tyhs.onrender.com/api';
let allBooks = [];
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  setupFilters();
  initRevealAnimations();
});

// Load books from API
async function loadBooks() {
  try {
    const response = await fetch(`${API_BASE}/books`);
    const data = await response.json();
    
    if (data.success) {
      allBooks = data.data;
      displayBooks(allBooks);
    } else {
      showError('Failed to load books');
    }
  } catch (error) {
    console.error('Error loading books:', error);
    showError('Unable to connect to server');
  }
}

// Display books in grid
function displayBooks(books) {
  const grid = document.getElementById('booksGrid');
  
  if (books.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>No books found</h3>
        <p>Check back soon for book reviews and recommendations</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = books.map(book => createBookCard(book)).join('');
  
  // Add reveal animations
  setTimeout(() => {
    document.querySelectorAll('.book-card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('revealed');
      }, index * 100);
    });
  }, 100);
}

// Create book card HTML
function createBookCard(book) {
  const stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
  const statusBadge = getStatusBadge(book.readingStatus);
  const favoriteBadge = book.favorite ? '<span class="favorite-badge">❤️ Favorite</span>' : '';
  
  return `
    <article class="book-card" data-reveal>
      <div class="book-cover-wrapper">
        ${book.coverImage ? 
          `<img src="${book.coverImage}" alt="${book.title}" class="book-cover">` :
          `<div class="book-cover-placeholder">
            <span class="book-icon">📖</span>
          </div>`
        }
        ${statusBadge}
        ${favoriteBadge}
      </div>
      
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        
        <div class="book-rating">
          <span class="stars">${stars}</span>
          <span class="rating-value">${book.rating}/5</span>
        </div>
        
        ${book.genre && book.genre.length > 0 ? `
          <div class="book-genres">
            ${book.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
          </div>
        ` : ''}
        
        <p class="book-review-excerpt">${truncateText(book.review, 150)}</p>
        
        <button class="read-more-btn" onclick="showBookModal('${book._id}')">
          <span>Read Full Review</span>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
      </div>
    </article>
  `;
}

// Get status badge HTML
function getStatusBadge(status) {
  const badges = {
    'reading': '<span class="status-badge reading">📖 Reading</span>',
    'completed': '<span class="status-badge completed">✓ Completed</span>',
    'want-to-read': '<span class="status-badge want">📌 Want to Read</span>'
  };
  return badges[status] || '';
}

// Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Setup filter tabs
function setupFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter books
      currentFilter = tab.dataset.filter;
      filterBooks(currentFilter);
    });
  });
}

// Filter books
function filterBooks(filter) {
  let filtered = allBooks;
  
  switch(filter) {
    case 'reading':
      filtered = allBooks.filter(b => b.readingStatus === 'reading');
      break;
    case 'completed':
      filtered = allBooks.filter(b => b.readingStatus === 'completed');
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

// Show book modal (full review)
function showBookModal(bookId) {
  const book = allBooks.find(b => b._id === bookId);
  if (!book) return;
  
  const modal = document.createElement('div');
  modal.className = 'book-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeBookModal()"></div>
    <div class="modal-content">
      <button class="modal-close" onclick="closeBookModal()">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      
      <div class="modal-header">
        ${book.coverImage ? 
          `<img src="${book.coverImage}" alt="${book.title}" class="modal-cover">` :
          `<div class="modal-cover-placeholder">📖</div>`
        }
        <div class="modal-title-section">
          <h2 class="modal-title">${book.title}</h2>
          <p class="modal-author">by ${book.author}</p>
          <div class="modal-rating">
            <span class="stars">${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</span>
            <span class="rating-value">${book.rating}/5</span>
          </div>
          ${book.genre && book.genre.length > 0 ? `
            <div class="modal-genres">
              ${book.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="modal-body">
        <h3>My Review</h3>
        <div class="modal-review">${book.review.replace(/\n/g, '<br>')}</div>
        
        ${book.notes ? `
          <h3>Personal Notes</h3>
          <div class="modal-notes">${book.notes.replace(/\n/g, '<br>')}</div>
        ` : ''}
        
        ${book.startedReading || book.finishedReading ? `
          <div class="modal-dates">
            ${book.startedReading ? `<p><strong>Started:</strong> ${new Date(book.startedReading).toLocaleDateString()}</p>` : ''}
            ${book.finishedReading ? `<p><strong>Finished:</strong> ${new Date(book.finishedReading).toLocaleDateString()}</p>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);
}

// Close book modal
function closeBookModal() {
  const modal = document.querySelector('.book-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

// Show error message
function showError(message) {
  const grid = document.getElementById('booksGrid');
  grid.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Oops!</h3>
      <p>${message}</p>
      <button class="retry-btn" onclick="loadBooks()">Try Again</button>
    </div>
  `;
}

// Initialize reveal animations
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
  });
}
