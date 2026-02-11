/* ============================================================
   WORK PAGE - Dynamic Project Loading
   ============================================================ */

(function() {
  'use strict';
  
  const API_BASE = '/api';
  let allProjects = [];
  let currentFilter = 'all';
  
  // Load projects on page load
  document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setupFilters();
  });
  
  // ================================================== //
  // LOAD PROJECTS                                      //
  // ================================================== //
  
  async function loadProjects() {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        allProjects = data.data;
        renderProjects(allProjects);
      } else {
        showEmptyState();
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      showErrorState();
    }
  }
  
  // ================================================== //
  // RENDER PROJECTS                                    //
  // ================================================== //
  
  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    if (projects.length === 0) {
      showEmptyState();
      return;
    }
    
    grid.innerHTML = projects.map((project, index) => createProjectCard(project, index)).join('');
    
    // Trigger reveal animations
    setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.add('revealed');
      });
    }, 100);
  }
  
  // ================================================== //
  // CREATE PROJECT CARD                                //
  // ================================================== //
  
  function createProjectCard(project, index) {
    const delay = (index % 3) * 100;
    
    return `
      <article class="project-card-full" data-reveal style="animation-delay: ${delay}ms">
        ${project.imageUrl ? `
          <div class="project-image">
            <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
            <div class="image-overlay"></div>
          </div>
        ` : `
          <div class="project-image project-placeholder">
            <div class="placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" stroke-width="2"/>
                <path d="M16 24l8 8 16-16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        `}
        
        <div class="project-content">
          <div class="project-header">
            <div class="project-meta">
              <span class="project-year">${project.year || new Date(project.createdAt).getFullYear()}</span>
              <span class="project-status status-${project.status}">${formatStatus(project.status)}</span>
            </div>
            
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
          </div>
          
          ${project.technologies && project.technologies.length > 0 ? `
            <div class="project-tech">
              ${project.technologies.slice(0, 5).map(tech => `
                <span class="tech-badge">${tech}</span>
              `).join('')}
              ${project.technologies.length > 5 ? `
                <span class="tech-badge">+${project.technologies.length - 5}</span>
              ` : ''}
            </div>
          ` : ''}
          
          <div class="project-footer">
            <div class="project-stats">
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                ${project.stats?.views || 0}
              </span>
              <span class="stat">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                ${project.stats?.likes || 0}
              </span>
            </div>
            
            <div class="project-links">
              ${project.liveUrl ? `
                <a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener" title="View Live">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12m-6-6h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </a>
              ` : ''}
              ${project.githubUrl ? `
                <a href="${project.githubUrl}" class="project-link" target="_blank" rel="noopener" title="View Code">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2a8 8 0 00-2.5 15.6c.4 0 .5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5 0-.5 0-.5.8 0 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7 0-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2 0-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.4 7.4 0 014 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.7 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.5.4A8 8 0 0010 2z" fill="currentColor"/>
                  </svg>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </article>
    `;
  }
  
  // ================================================== //
  // FILTERS                                            //
  // ================================================== //
  
  function setupFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        
        // Update active state
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter projects
        currentFilter = filter;
        filterProjects(filter);
      });
    });
  }
  
  function filterProjects(filter) {
    let filtered = allProjects;
    
    if (filter !== 'all') {
      filtered = allProjects.filter(p => p.category === filter);
    }
    
    renderProjects(filtered);
  }
  
  // ================================================== //
  // UTILITY FUNCTIONS                                  //
  // ================================================== //
  
  function formatStatus(status) {
    const statusMap = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'planned': 'Planned'
    };
    return statusMap[status] || status;
  }
  
  function showEmptyState() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No projects yet</h3>
        <p>Check back soon for new work!</p>
      </div>
    `;
  }
  
  function showErrorState() {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Failed to load projects</h3>
        <p>Please try refreshing the page</p>
      </div>
    `;
  }
  
})();
