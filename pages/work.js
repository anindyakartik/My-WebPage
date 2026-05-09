/* ============================================================
   WORK PAGE — Project Showcase
   Loads data dynamically from Admin Panel API
   ============================================================ */

(function() {
  'use strict';

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';

  let allProjects = [];
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    setupFilters();
  });

  async function fetchProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
      const response = await fetch(`${API_BASE}/projects`);
      const data = await response.json();

      if (data.success && data.data) {
        allProjects = data.data;
        renderProjects(allProjects);
      } else {
        throw new Error('Failed to load projects');
      }
    } catch (error) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="badge-dot" style="margin-bottom: 2rem;"></div>
          <h3>Content coming soon</h3>
          <p>Projects will appear here once published from the admin panel.</p>
        </div>
      `;
    }
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    if (projects.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center;">
          <div class="badge-dot" style="margin-bottom: 2rem;"></div>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 1rem;">No projects found</h3>
          <p style="color: var(--fog);">Nothing matches this category right now.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = projects.map((project, index) => createProjectCard(project, index)).join('');

    setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 80);
      });
    }, 50);
  }

  function createProjectCard(project, index) {
    const delay = (index % 3) * 100;
    const projectYear = project.year || (project.createdAt ? new Date(project.createdAt).getFullYear() : new Date().getFullYear());

    return `
      <article class="project-card-full" data-reveal data-category="${project.category || 'other'}" style="animation-delay: ${delay}ms">
        <div class="project-image project-placeholder">
          <div class="placeholder-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M16 32l8-10 6 7 4-5 6 8H16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="20" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
        
        <div class="project-content">
          <div class="project-header">
            <div class="project-meta">
              <span class="project-year">${projectYear}</span>
              <span class="project-status status-${project.status || 'planned'}">${formatStatus(project.status || 'planned')}</span>
            </div>
            
            <h3 class="project-title">${project.title || 'Untitled'}</h3>
            <p class="project-description">${project.description || ''}</p>
          </div>
          
          ${project.technologies && project.technologies.length > 0 ? `
            <div class="project-tech">
              ${project.technologies.slice(0, 5).map(tech => `
                <span class="tech-badge">${tech}</span>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="project-footer">
            <div class="project-stats-mini">
              <!-- Stats currently hidden as they are not dynamic for now -->
            </div>
            
            <div class="project-links">
              ${project.liveUrl ? `
                <a href="${project.liveUrl}" class="project-link" target="_blank" rel="noopener" title="Live Site">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13 3h4v4M9 11l8-8M3 9s1-5 6-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
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

  function setupFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
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

  function formatStatus(status) {
    const statusMap = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'planned': 'Planned'
    };
    return statusMap[status] || status;
  }

})();
