/* ============================================================
   ADMIN PANEL JAVASCRIPT
   ============================================================ */

(function() {
  'use strict';
  
  // API base: same-origin when served by the backend, Render URL when served from Vercel
  const RENDER_API = 'https://anindya-kartik.onrender.com';
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isServedByBackend = window.location.port === '3000' || window.location.port === '10000';
  
  const API_BASE = (isLocalDev || isServedByBackend)
    ? `${window.location.protocol}//${window.location.host}/api`
    : `${RENDER_API}/api`;
  
  let currentTab = 'projects';
  let authToken = null;
  
  // ================================================== //
  // AUTHENTICATION                                     //
  // ================================================== //
  
  const loginForm = document.getElementById('loginForm');
  const loginScreen = document.getElementById('loginScreen');
  const adminDashboard = document.getElementById('adminDashboard');
  const logoutBtn = document.getElementById('logoutBtn');
  
  checkAuth();
  
  async function checkAuth() {
    try {
      const response = await fetch(`${API_BASE}/admin/verify`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        authToken = data.token;
        showDashboard();
      }
    } catch (error) {
      console.log('Not authenticated');
    }
  }
  
  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('adminUsername').value.trim();
      const password = document.getElementById('adminPassword').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.querySelector('span').textContent;
      
      if (!username || !password) {
        showNotification('Please enter both username and password', 'error');
        return;
      }
      
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Unlocking...';
      
      try {
        const response = await fetch(`${API_BASE}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
          authToken = data.token;
          showNotification('Login successful!', 'success');
          showDashboard();
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (error) {
        showNotification(error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
      }
    });
  }
  
  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch(`${API_BASE}/admin/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        
        authToken = null;
        showLogin();
        showNotification('Logged out successfully', 'success');
      } catch (error) {
        showNotification('Logout failed', 'error');
      }
    });
  }
  
  function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    loadContent(currentTab);
  }
  
  function showLogin() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
  }
  
  // ================================================== //
  // TAB NAVIGATION                                     //
  // ================================================== //
  
  const navTabs = document.querySelectorAll('.nav-tab');
  const contentTabs = document.querySelectorAll('.content-tab');
  
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
  
  function switchTab(tabName) {
    currentTab = tabName;
    navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    contentTabs.forEach(tab => {
      tab.classList.toggle('active', tab.id === `${tabName}Tab`);
    });
    loadContent(tabName);
  }
  
  // ================================================== //
  // LOAD CONTENT                                       //
  // ================================================== //
  
  async function loadContent(type) {
    const listElement = document.getElementById(`${type}List`);
    if (!listElement) return;
    
    listElement.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    try {
      const response = await fetch(`${API_BASE}/admin/${type}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        renderContent(type, data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      listElement.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Failed to load content</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
  
  const typeLabels = {
    projects: 'project',
    poems: 'poem',
    books: 'book',
    blog: 'post',
    now: 'now card',
    guestbook: 'entry'
  };
  function singularLabel(type) {
    return typeLabels[type] || type.slice(0, -1);
  }

  function renderContent(type, items) {
    if (type === 'guestbook') {
      renderGuestbook(items);
      return;
    }

    const listElement = document.getElementById(`${type}List`);

    if (items.length === 0) {
      listElement.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>No ${type} yet</h3>
          <p>Click the "Add" button to create your first ${singularLabel(type)}</p>
        </div>
      `;
      return;
    }

    listElement.innerHTML = items.map(item => createContentCard(type, item)).join('');

    listElement.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => editContent(type, btn.dataset.id));
    });

    listElement.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteContent(type, btn.dataset.id));
    });
  }

  // ================================================== //
  // GUESTBOOK MODERATION                               //
  // ================================================== //

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderGuestbook(entries) {
    const listElement = document.getElementById('guestbookList');
    const pendingBadge = document.getElementById('gbPendingBadge');
    const pendingCountEl = document.getElementById('gbPendingCount');

    const pendingCount = entries.filter(e => !e.approved).length;
    if (pendingBadge) {
      pendingBadge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
    }
    if (pendingCountEl) {
      pendingCountEl.textContent = `${pendingCount} pending`;
    }

    if (entries.length === 0) {
      listElement.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📖</div>
          <h3>No entries yet</h3>
          <p>Guestbook signatures from visitors will show up here.</p>
        </div>
      `;
      return;
    }

    listElement.innerHTML = entries.map(entry => `
      <div class="content-item guestbook-entry-admin">
        <div class="item-header">
          <div>
            <h3 class="item-title">${escapeHtml(entry.name)}${entry.location ? ` <span class="gb-admin-location">· ${escapeHtml(entry.location)}</span>` : ''}</h3>
            <div class="item-meta">
              <span>${entry.approved ? '<span style="color: var(--forest)">✓ Approved</span>' : '<span class="badge badge-pending">Pending</span>'}</span>
              <span>${new Date(entry.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn-secondary btn-toggle-approve" data-id="${entry._id}">
              ${entry.approved ? 'Unapprove' : 'Approve'}
            </button>
            <button class="btn-secondary btn-delete-guestbook" data-id="${entry._id}" style="color: var(--fire)">
              Delete
            </button>
          </div>
        </div>
        <div class="item-content">${escapeHtml(entry.message)}</div>
      </div>
    `).join('');

    listElement.querySelectorAll('.btn-toggle-approve').forEach(btn => {
      btn.addEventListener('click', () => toggleGuestbookApproval(btn.dataset.id));
    });
    listElement.querySelectorAll('.btn-delete-guestbook').forEach(btn => {
      btn.addEventListener('click', () => deleteGuestbookEntry(btn.dataset.id));
    });
  }

  async function toggleGuestbookApproval(id) {
    try {
      const response = await fetch(`${API_BASE}/admin/guestbook/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${authToken}` },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        showNotification('Entry updated', 'success');
        loadContent('guestbook');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }

  async function deleteGuestbookEntry(id) {
    if (!confirm('Delete this guestbook entry?')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/guestbook/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        showNotification(data.message, 'success');
        loadContent('guestbook');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  function createContentCard(type, item) {
    const publishedStatus = item.published ? 
      '<span style="color: var(--forest)">✓ Published</span>' : 
      '<span style="color: var(--fog)">○ Draft</span>';
    
    return `
      <div class="content-item">
        <div class="item-header">
          <div>
            <h3 class="item-title">${item.title}</h3>
            <div class="item-meta">
              <span>${publishedStatus}</span>
              <span>${new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn-secondary btn-edit" data-id="${item._id}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11 2l3 3-9 9H2v-3l9-9z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Edit
            </button>
            <button class="btn-secondary btn-delete" data-id="${item._id}" style="color: var(--fire)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M4 4h8v9a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
        <div class="item-content">
          ${item.description || item.excerpt || (item.content ? item.content.substring(0, 200) + '...' : '') || (item.body?.[0] ? item.body[0].substring(0, 200) + '...' : '')}
        </div>
        ${item.stats ? `
        <div class="item-stats">
          <div class="stat-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="2"/>
              <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="2"/>
            </svg>
            ${item.stats?.views || 0} views
          </div>
          <div class="stat-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" stroke="currentColor" stroke-width="2"/>
            </svg>
            ${item.stats?.likes || 0} likes
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  // ================================================== //
  // ADD CONTENT BUTTONS                                //
  // ================================================== //
  
  document.getElementById('addProjectBtn')?.addEventListener('click', () => openModal('projects'));
  document.getElementById('addPoemBtn')?.addEventListener('click', () => openModal('poems'));
  document.getElementById('addBookBtn')?.addEventListener('click', () => openModal('books'));
  document.getElementById('addBlogBtn')?.addEventListener('click', () => openModal('blog'));
  document.getElementById('addNowBtn')?.addEventListener('click', () => openModal('now'));
  
  // ================================================== //
  // MODAL                                              //
  // ================================================== //
  
  const modal = document.getElementById('contentModal');
  const modalTitle = document.getElementById('modalTitle');
  const contentForm = document.getElementById('contentForm');
  const formFields = document.getElementById('formFields');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  
  let currentEditId = null;
  let currentContentType = null;
  
  function openModal(type, item = null) {
    currentContentType = type;
    currentEditId = item?._id || null;
    modalTitle.textContent = item ? `Edit ${singularLabel(type)}` : `Add ${singularLabel(type)}`;
    formFields.innerHTML = getFormFields(type, item);
    modal.classList.add('active');
  }
  
  function closeModalFn() {
    modal.classList.remove('active');
    contentForm.reset();
    currentEditId = null;
    currentContentType = null;
  }
  
  closeModal?.addEventListener('click', closeModalFn);
  cancelBtn?.addEventListener('click', closeModalFn);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFn();
  });
  
  function getFormFields(type, item) {
    const fields = {
      projects: `
        <div class="form-group">
          <label>Title *</label>
          <input type="text" name="title" value="${item?.title || ''}" required>
        </div>
        <div class="form-group">
          <label>Description *</label>
          <textarea name="description" required>${item?.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Technologies (comma-separated)</label>
          <input type="text" name="technologies" value="${item?.technologies?.join(', ') || ''}">
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="url" name="imageUrl" value="${item?.imageUrl || ''}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select name="category">
            <option value="web" ${item?.category === 'web' ? 'selected' : ''}>Web</option>
            <option value="mobile" ${item?.category === 'mobile' ? 'selected' : ''}>Mobile</option>
            <option value="design" ${item?.category === 'design' ? 'selected' : ''}>Design</option>
            <option value="other" ${item?.category === 'other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Live URL</label>
          <input type="url" name="liveUrl" value="${item?.liveUrl || ''}">
        </div>
        <div class="form-group">
          <label>GitHub URL</label>
          <input type="url" name="githubUrl" value="${item?.githubUrl || ''}">
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="completed" ${item?.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="in-progress" ${item?.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="planned" ${item?.status === 'planned' ? 'selected' : ''}>Planned</option>
          </select>
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="published" ${item?.published !== false ? 'checked' : ''}> Published</label>
        </div>
      `,
      poems: `
        <div class="form-group">
          <label>Title *</label>
          <input type="text" name="title" value="${item?.title || ''}" required>
        </div>
        <div class="form-group">
          <label>Content *</label>
          <textarea name="content" rows="10" required>${item?.content || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Tags (comma-separated)</label>
          <input type="text" name="tags" value="${item?.tags?.join(', ') || ''}">
        </div>
        <div class="form-group">
          <label>Mood</label>
          <select name="mood">
            <option value="contemplative" ${item?.mood === 'contemplative' ? 'selected' : ''}>Contemplative</option>
            <option value="melancholic" ${item?.mood === 'melancholic' ? 'selected' : ''}>Melancholic</option>
            <option value="joyful" ${item?.mood === 'joyful' ? 'selected' : ''}>Joyful</option>
            <option value="romantic" ${item?.mood === 'romantic' ? 'selected' : ''}>Romantic</option>
            <option value="dark" ${item?.mood === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="hopeful" ${item?.mood === 'hopeful' ? 'selected' : ''}>Hopeful</option>
          </select>
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="published" ${item?.published !== false ? 'checked' : ''}> Published</label>
        </div>
      `,
      books: `
        <div class="form-group">
          <label>Book Title *</label>
          <input type="text" name="title" value="${item?.title || ''}" required>
        </div>
        <div class="form-group">
          <label>Author *</label>
          <input type="text" name="author" value="${item?.author || ''}" required>
        </div>
        <div class="form-group">
          <label>Your Review *</label>
          <textarea name="review" rows="8" required>${item?.review || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Rating (1-5) *</label>
          <input type="number" name="rating" min="1" max="5" step="0.5" value="${item?.rating || 5}" required>
        </div>
        <div class="form-group">
          <label>Cover Image URL</label>
          <input type="url" name="coverImage" value="${item?.coverImage || ''}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>Genre (comma-separated)</label>
          <input type="text" name="genre" value="${item?.genre?.join(', ') || ''}">
        </div>
        <div class="form-group">
          <label>Reading Status</label>
          <select name="readingStatus">
            <option value="completed" ${item?.readingStatus === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="reading" ${item?.readingStatus === 'reading' ? 'selected' : ''}>Currently Reading</option>
            <option value="want-to-read" ${item?.readingStatus === 'want-to-read' ? 'selected' : ''}>Want to Read</option>
          </select>
        </div>
        <div class="form-group">
          <label>Personal Notes</label>
          <textarea name="notes" rows="3">${item?.notes || ''}</textarea>
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="published" ${item?.published !== false ? 'checked' : ''}> Published</label>
        </div>
      `,
      blog: `
        <div class="form-group">
          <label>Title *</label>
          <input type="text" name="title" value="${item?.title || ''}" required>
        </div>
        <div class="form-group">
          <label>Content *</label>
          <textarea name="content" rows="15" required>${item?.content || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Excerpt</label>
          <textarea name="excerpt" rows="3">${item?.excerpt || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Cover Image URL</label>
          <input type="url" name="coverImage" value="${item?.coverImage || ''}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select name="category">
            <option value="thoughts" ${item?.category === 'thoughts' ? 'selected' : ''}>Thoughts</option>
            <option value="tech" ${item?.category === 'tech' ? 'selected' : ''}>Tech</option>
            <option value="life" ${item?.category === 'life' ? 'selected' : ''}>Life</option>
            <option value="poetry" ${item?.category === 'poetry' ? 'selected' : ''}>Poetry</option>
            <option value="tutorial" ${item?.category === 'tutorial' ? 'selected' : ''}>Tutorial</option>
            <option value="other" ${item?.category === 'other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tags (comma-separated)</label>
          <input type="text" name="tags" value="${item?.tags?.join(', ') || ''}">
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="featured" ${item?.featured ? 'checked' : ''}> Featured</label>
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="published" ${item?.published !== false ? 'checked' : ''}> Published</label>
        </div>
      `,
      now: `
        <div class="form-group">
          <label>Title *</label>
          <input type="text" name="title" value="${item?.title || ''}" required>
        </div>
        <div class="form-group">
          <label>Tag</label>
          <input type="text" name="tag" value="${item?.tag || 'Now'}" placeholder="e.g. Reading, Building, Thinking about">
        </div>
        <div class="form-group">
          <label>Label <span style="opacity:0.6">(optional)</span></label>
          <input type="text" name="label" value="${item?.label || ''}">
        </div>
        <div class="form-group">
          <label>Body <span style="opacity:0.6">(separate paragraphs with a blank line)</span></label>
          <textarea name="body" rows="8">${item?.body?.join('\n\n') || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Books <span style="opacity:0.6">(optional, one per line: Title | Author | Note)</span></label>
          <textarea name="books" rows="4">${item?.books?.map(b => `${b.title || ''} | ${b.author || ''} | ${b.note || ''}`).join('\n') || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Order</label>
          <input type="number" name="order" value="${item?.order ?? 0}">
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="featured" ${item?.featured ? 'checked' : ''}> Featured (full width)</label>
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="published" ${item?.published !== false ? 'checked' : ''}> Published</label>
        </div>
      `
    };
    return fields[type] || '';
  }
  
  // Form submission
  contentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contentForm);
    const data = Object.fromEntries(formData);
    data.published = formData.has('published');

    if (currentContentType === 'now') {
      data.featured = formData.has('featured');
      data.body = (data.body || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      data.books = (data.books || '').split('\n').map(l => l.trim()).filter(Boolean).map(line => {
        const [title, author, note] = line.split('|').map(s => (s || '').trim());
        return { title, author, note };
      });
    }

    const submitBtn = contentForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    
    try {
      const url = currentEditId ? 
        `${API_BASE}/admin/${currentContentType}/${currentEditId}` :
        `${API_BASE}/admin/${currentContentType}`;
      
      const method = currentEditId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification(result.message, 'success');
        closeModalFn();
        loadContent(currentContentType);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
  
  // Edit content
  async function editContent(type, id) {
    try {
      const response = await fetch(`${API_BASE}/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        credentials: 'include'
      });
      const data = await response.json();
      const item = data.data.find(i => i._id === id);
      if (item) openModal(type, item);
    } catch (error) {
      showNotification('Failed to load content', 'error');
    }
  }
  
  // Delete content
  async function deleteContent(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        showNotification(data.message, 'success');
        loadContent(type);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }
  
  // Refresh
  document.getElementById('refreshBtn')?.addEventListener('click', () => {
    loadContent(currentTab);
    showNotification('Content refreshed', 'success');
  });
  
  // ================================================== //
  // NOTIFICATION SYSTEM                                //
  // ================================================== //
  
  function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
})();
