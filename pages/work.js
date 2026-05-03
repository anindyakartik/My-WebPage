/* ============================================================
   WORK PAGE — Project Showcase
   Self-contained with embedded data + optional API enrichment
   ============================================================ */

(function() {
  'use strict';

  // Embedded project data — works without any backend
  const STATIC_PROJECTS = [
    {
      _id: '1',
      title: 'TaskCLI',
      description: 'A blazingly fast command-line task manager built in Rust. For developers who live in the terminal and refuse to context-switch to manage their day. Features natural language parsing, time tracking, and beautiful TUI interfaces.',
      technologies: ['Rust', 'SQLite', 'Tokio', 'Crossterm'],
      category: 'web',
      status: 'completed',
      year: 2024,
      featured: true,
      liveUrl: '',
      githubUrl: 'https://github.com/anindyakartik',
      stats: { views: 2400, likes: 180 }
    },
    {
      _id: '2',
      title: 'WanderLust API',
      description: 'High-performance travel API handling 1000+ requests per second with sub-10ms response times. Built with Node.js, Redis caching, and Docker containerization for seamless deployment and horizontal scaling.',
      technologies: ['Node.js', 'Redis', 'Docker', 'PostgreSQL', 'Express'],
      category: 'web',
      status: 'completed',
      year: 2024,
      liveUrl: '',
      githubUrl: 'https://github.com/anindyakartik',
      stats: { views: 1200, likes: 95 }
    },
    {
      _id: '3',
      title: 'CodeSnap',
      description: 'Beautiful code screenshot generator that turns your code into shareable visual art. Supports 50+ themes, custom fonts, and window chrome styles. Used by 10k+ developers monthly.',
      technologies: ['React', 'Canvas API', 'Vite', 'TypeScript'],
      category: 'web',
      status: 'completed',
      year: 2023,
      liveUrl: '',
      githubUrl: 'https://github.com/anindyakartik',
      stats: { views: 3100, likes: 240 }
    },
    {
      _id: '4',
      title: 'Neural Canvas',
      description: 'AI-powered design tool that transforms text descriptions into visual concepts. Fine-tuned Stable Diffusion models with a FastAPI backend and React frontend for real-time generation.',
      technologies: ['Python', 'FastAPI', 'Stable Diffusion', 'React', 'WebSocket'],
      category: 'design',
      status: 'in-progress',
      year: 2024,
      liveUrl: '',
      githubUrl: 'https://github.com/anindyakartik',
      stats: { views: 870, likes: 62 }
    },
    {
      _id: '5',
      title: 'Memex',
      description: 'Personal knowledge graph that connects books, notes, and projects into a searchable, visual network. Integrates with Obsidian for seamless note-taking workflows.',
      technologies: ['GraphQL', 'Neo4j', 'Next.js', 'D3.js'],
      category: 'web',
      status: 'in-progress',
      year: 2024,
      liveUrl: '',
      githubUrl: 'https://github.com/anindyakartik',
      stats: { views: 650, likes: 48 }
    },
    {
      _id: '6',
      title: 'Pocket Planner',
      description: 'A minimalist mobile app for daily planning with gesture-based interactions and haptic feedback. Designed for people who want less screen time but better productivity.',
      technologies: ['React Native', 'Expo', 'SQLite', 'Reanimated'],
      category: 'mobile',
      status: 'completed',
      year: 2023,
      liveUrl: '',
      githubUrl: 'https://github.com/anindyakartik',
      stats: { views: 920, likes: 73 }
    }
  ];

  let allProjects = [];
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    // Render static data immediately
    allProjects = STATIC_PROJECTS;
    renderProjects(allProjects);
    setupFilters();
  });

  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    if (projects.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No projects match this filter</h3>
          <p>Try selecting a different category</p>
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

    return `
      <article class="project-card-full" data-reveal data-category="${project.category}" style="animation-delay: ${delay}ms">
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
              <span class="project-year">${project.year}</span>
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
            </div>
          ` : ''}
          
          <div class="project-footer">
            <div class="project-stats-mini">
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
