/* ============================================================
   DYNAMIC CONTENT LOADER
   Fetches content from CMS API and updates homepage
   ============================================================ */

(function() {
  'use strict';
  
  const API_BASE = 'https://my-personal-website-tyhs.onrender.com/api';
  
  // ================================================== //
  // LOAD ALL CONTENT ON PAGE LOAD                     //
  // ================================================== //
  
  document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadPoems();
    loadBooks();
    loadBlogPosts();
  });
  
  // ================================================== //
  // LOAD PROJECTS (WORK SECTION)                      //
  // ================================================== //
  
  async function loadProjects() {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        renderProjects(data.data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }
  
  function renderProjects(projects) {
    const projectsShowcase = document.querySelector('.projects-showcase');
    if (!projectsShowcase) return;
    
    // Clear existing content
    projectsShowcase.innerHTML = '';
    
    // Render featured project (first one)
    const featured = projects.find(p => p.featured) || projects[0];
    if (featured) {
      projectsShowcase.innerHTML += createFeaturedProject(featured);
    }
    
    // Render other projects
    const others = projects.filter(p => p._id !== featured._id).slice(0, 5);
    if (others.length > 0) {
      projectsShowcase.innerHTML += `
        <div class="project-grid">
          ${others.map(createProjectCard).join('')}
        </div>
      `;
    }
  }
  
  function createFeaturedProject(project) {
    return `
      <article class="project-hero" data-reveal>
        <div class="project-visual">
          <div class="project-mockup">
            <div class="mockup-window">
              <div class="window-controls">
                <span></span><span></span><span></span>
              </div>
              <div class="window-content">
                <pre>${project.description.substring(0, 200)}...</pre>
              </div>
            </div>
          </div>
          <div class="project-glow"></div>
        </div>
        
        <div class="project-info">
          <div class="project-meta">
            <span class="project-year">${project.year || new Date(project.createdAt).getFullYear()}</span>
            <span class="project-status">${project.status || 'Completed'}</span>
          </div>
          
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          
          ${project.technologies && project.technologies.length > 0 ? `
            <div class="project-tech">
              ${project.technologies.map(tech => `<span class="tech-pill">${tech}</span>`).join('')}
            </div>
          ` : ''}
          
          <div class="project-links">
            ${project.liveUrl ? `
              <a href="${project.liveUrl}" class="project-btn primary" target="_blank" rel="noopener">
                <span>View Live</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12m-6-6h12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </a>
            ` : ''}
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" class="project-btn secondary" target="_blank" rel="noopener">
                <span>Source Code</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2a8 8 0 00-2.5 15.6c.4 0 .5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5 0-.5 0-.5.8 0 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7 0-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2 0-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.4 7.4 0 014 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.7 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.5.4A8 8 0 0010 2z" fill="currentColor"/>
                </svg>
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }
  
  function createProjectCard(project) {
    return `
      <article class="project-card" data-reveal>
        <div class="card-header">
          <h4 class="card-title">${project.title}</h4>
          ${project.liveUrl ? `
            <a href="${project.liveUrl}" class="card-link" target="_blank" rel="noopener">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12m-6-6h12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </a>
          ` : ''}
        </div>
        <p class="card-description">${project.description.substring(0, 150)}...</p>
        <div class="card-footer">
          <span class="card-year">${project.year || new Date(project.createdAt).getFullYear()}</span>
          <span class="card-tag">${project.category || 'Web'}</span>
        </div>
      </article>
    `;
  }
  
  // ================================================== //
  // LOAD POEMS (MUSINGS SECTION)                      //
  // ================================================== //
  
  async function loadPoems() {
    try {
      const response = await fetch(`${API_BASE}/poems`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        renderPoems(data.data);
      }
    } catch (error) {
      console.error('Failed to load poems:', error);
    }
  }
  
  function renderPoems(poems) {
    const poetryGrid = document.querySelector('.poetry-grid');
    if (!poetryGrid) return;
    
    // Clear existing content except quote block
    const quoteBlock = poetryGrid.querySelector('.quote-block');
    poetryGrid.innerHTML = '';
    
    // Render poems
    poems.slice(0, 6).forEach((poem, index) => {
      poetryGrid.innerHTML += createPoemCard(poem, index);
      
      // Add quote block after 3rd poem
      if (index === 2 && quoteBlock) {
        poetryGrid.appendChild(quoteBlock);
      }
    });
  }
  
  function createPoemCard(poem, index) {
    const isFeatured = poem.featured && index === 0;
    return `
      <article class="poem-card ${isFeatured ? 'featured' : ''}" data-reveal>
        <span class="poem-number">#${String(index + 1).padStart(2, '0')}</span>
        <div class="poem-meta">
          <time datetime="${poem.publishedAt}">${new Date(poem.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</time>
          ${poem.mood ? `<span class="poem-tag">${poem.mood}</span>` : ''}
        </div>
        <h3 class="poem-title">${poem.title}</h3>
        ${poem.excerpt ? `<p class="poem-excerpt">${poem.excerpt}</p>` : ''}
        <p class="poem-preview">${poem.content.substring(0, 200)}...</p>
        <a href="/poem.html?slug=${poem.slug}" class="poem-link">
          <span>Read full poem</span>
          <span class="link-arrow">→</span>
        </a>
      </article>
    `;
  }
  
  // ================================================== //
  // LOAD BOOKS (SHELF SECTION)                        //
  // ================================================== //
  
  async function loadBooks() {
    try {
      const response = await fetch(`${API_BASE}/books`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        renderBooks(data.data);
      }
    } catch (error) {
      console.error('Failed to load books:', error);
    }
  }
  
  function renderBooks(books) {
    const shelfRow = document.querySelector('.shelf-row');
    if (!shelfRow) return;
    
    // Clear existing books
    shelfRow.innerHTML = '';
    
    // Render books
    books.slice(0, 8).forEach((book, index) => {
      shelfRow.innerHTML += createBookSpine(book, index);
    });
    
    // Update stats
    updateBookStats(books);
  }
  
  function createBookSpine(book, index) {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    const color = colors[index % colors.length];
    const tilt = (Math.random() - 0.5) * 6;
    const width = 40 + Math.random() * 20;
    
    return `
      <div class="book" style="--book-color: ${color}; --book-tilt: ${tilt}deg; --book-width: ${width}px;">
        <div class="book-spine">
          <span class="spine-text">${book.title}</span>
          <div class="book-shine"></div>
          ${book.readingStatus === 'reading' ? '<div class="reading-marker"></div>' : ''}
        </div>
        <div class="book-tooltip">
          <h4>${book.title}</h4>
          <p>by ${book.author}</p>
          <div class="rating">${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5 - Math.floor(book.rating))}</div>
          ${book.readingStatus === 'reading' ? '<span class="reading-badge">Currently Reading</span>' : ''}
          <span class="note">${book.review.substring(0, 100)}...</span>
        </div>
      </div>
    `;
  }
  
  function updateBookStats(books) {
    const completedBooks = books.filter(b => b.readingStatus === 'completed').length;
    const currentlyReading = books.filter(b => b.readingStatus === 'reading').length;
    const avgRating = (books.reduce((sum, b) => sum + b.rating, 0) / books.length).toFixed(1);
    
    const statNums = document.querySelectorAll('.shelf-stat .stat-num');
    if (statNums[0]) statNums[0].textContent = completedBooks;
    if (statNums[1]) statNums[1].textContent = currentlyReading;
    if (statNums[2]) statNums[2].textContent = avgRating;
  }
  
  // ================================================== //
  // LOAD BLOG POSTS (OPTIONAL)                        //
  // ================================================== //
  
  async function loadBlogPosts() {
    try {
      const response = await fetch(`${API_BASE}/blog`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        // You can add a blog section to your homepage if needed
        console.log('Blog posts loaded:', data.data.length);
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    }
  }
  
  // ================================================== //
  // UTILITY FUNCTIONS                                  //
  // ================================================== //
  
  // Re-trigger reveal animations for dynamically loaded content
  function triggerRevealAnimations() {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('[data-reveal]').forEach(el => {
      revealObserver.observe(el);
    });
  }
  
  // Call after content is loaded
  setTimeout(triggerRevealAnimations, 100);
  
})();
