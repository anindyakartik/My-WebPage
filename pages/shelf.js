/* ============================================================
   SHELF PAGE — Book Collection
   Self-contained with embedded data
   ============================================================ */

(function() {
  'use strict';

  const STATIC_BOOKS = [
    {
      _id: '1',
      title: 'The Pragmatic Programmer',
      author: 'David Thomas & Andrew Hunt',
      rating: 5,
      readingStatus: 'completed',
      favorite: true,
      genre: ['Programming', 'Software Engineering'],
      review: 'Changed how I think about code. Every chapter is a masterclass in thinking clearly about software as craft. The "broken windows" metaphor alone is worth the read. This book makes you want to be a better programmer — not just a faster one.',
      coverImage: '',
      notes: 'Re-read annually. Always find something new.',
      startedReading: '2023-01-15',
      finishedReading: '2023-02-10'
    },
    {
      _id: '2',
      title: 'Dune',
      author: 'Frank Herbert',
      rating: 4,
      readingStatus: 'completed',
      favorite: true,
      genre: ['Science Fiction', 'Epic'],
      review: 'Desert power, political intrigue, ecological consciousness wrapped in the most immersive world-building I have ever encountered. Herbert created a universe so detailed you can feel the sand between your pages.',
      coverImage: '',
      startedReading: '2023-03-01',
      finishedReading: '2023-04-15'
    },
    {
      _id: '3',
      title: 'Atomic Habits',
      author: 'James Clear',
      rating: 4,
      readingStatus: 'reading',
      favorite: false,
      genre: ['Self-Help', 'Psychology'],
      review: 'Small changes, remarkable results. Clear writes with the precision of an engineer and the warmth of a coach. The systems-over-goals framework has genuinely changed my daily routines.',
      coverImage: ''
    },
    {
      _id: '4',
      title: 'Kafka on the Shore',
      author: 'Haruki Murakami',
      rating: 5,
      readingStatus: 'completed',
      favorite: true,
      genre: ['Literary Fiction', 'Magical Realism'],
      review: 'Surreal, haunting, perfect. Murakami has this ability to make the impossible feel mundane and the mundane feel impossible. Every sentence is a small universe.',
      coverImage: '',
      startedReading: '2023-06-01',
      finishedReading: '2023-07-20'
    },
    {
      _id: '5',
      title: 'Design Patterns',
      author: 'Gang of Four',
      rating: 4,
      readingStatus: 'completed',
      favorite: false,
      genre: ['Programming', 'Software Architecture'],
      review: 'Essential reference for any serious developer. Dense but rewarding. I keep coming back to the Observer and Strategy patterns. The examples are dated but the principles are timeless.',
      coverImage: '',
      startedReading: '2023-08-01',
      finishedReading: '2023-09-15'
    },
    {
      _id: '6',
      title: 'Bird by Bird',
      author: 'Anne Lamott',
      rating: 5,
      readingStatus: 'completed',
      favorite: true,
      genre: ['Writing', 'Memoir'],
      review: 'On writing and life. Lamott is genuinely funny and deeply wise. "Bird by bird, buddy. Just take it bird by bird." This book taught me that bad first drafts are mandatory, not optional.',
      coverImage: '',
      startedReading: '2023-10-01',
      finishedReading: '2023-10-20'
    },
    {
      _id: '7',
      title: 'The Art of Possibility',
      author: 'Rosamund & Benjamin Zander',
      rating: 4,
      readingStatus: 'completed',
      favorite: false,
      genre: ['Philosophy', 'Leadership'],
      review: 'Transformative thinking. The "giving an A" framework completely changed how I approach collaborative work. Equal parts philosophy and practical wisdom.',
      coverImage: '',
      startedReading: '2024-01-05',
      finishedReading: '2024-01-28'
    },
    {
      _id: '8',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      rating: 5,
      readingStatus: 'completed',
      favorite: true,
      genre: ['History', 'Anthropology'],
      review: 'A sweeping story of our species that makes you reconsider everything you thought you knew. The agricultural revolution chapter alone will keep you thinking for weeks.',
      coverImage: '',
      startedReading: '2024-02-01',
      finishedReading: '2024-03-10'
    },
    {
      _id: '9',
      title: 'Eloquent JavaScript',
      author: 'Marijn Haverbeke',
      rating: 4,
      readingStatus: 'completed',
      favorite: false,
      genre: ['Programming', 'JavaScript'],
      review: 'Far more than a language tutorial — it teaches you to think like a programmer. The exercises are challenging and the prose is surprisingly beautiful for a technical book.',
      coverImage: '',
      startedReading: '2024-04-01',
      finishedReading: '2024-05-15'
    },
    {
      _id: '10',
      title: 'Norwegian Wood',
      author: 'Haruki Murakami',
      rating: 5,
      readingStatus: 'reading',
      favorite: false,
      genre: ['Literary Fiction', 'Romance'],
      review: 'Currently reading — already enchanted by the melancholic beauty. Murakami captures loneliness and longing without sentimentality.',
      coverImage: ''
    }
  ];

  let allBooks = [];
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    allBooks = STATIC_BOOKS;
    displayBooks(allBooks);
    setupFilters();
  });

  function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;

    if (books.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>No books match this filter</h3>
          <p>Try selecting a different category</p>
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
    const stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
    const statusBadge = getStatusBadge(book.readingStatus);
    const favoriteBadge = book.favorite ? '<span class="favorite-badge">❤️ Favorite</span>' : '';

    return `
      <article class="book-card" data-reveal>
        <div class="book-cover-wrapper">
          <div class="book-cover-placeholder">
            <span class="book-icon">📖</span>
          </div>
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
          
          <button class="read-more-btn" onclick="window._shelfShowModal('${book._id}')">
            <span>Read Full Review</span>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  function getStatusBadge(status) {
    const badges = {
      'reading': '<span class="status-badge reading">📖 Reading</span>',
      'completed': '<span class="status-badge completed">✓ Completed</span>',
      'want-to-read': '<span class="status-badge want">📌 Want to Read</span>'
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
          <div class="modal-cover-placeholder">📖</div>
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
