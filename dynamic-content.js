/* ============================================================
   DYNAMIC CONTENT LOADER
   Non-destructive: only enriches if API succeeds
   Falls back gracefully to existing static HTML content
   ============================================================ */

(function() {
  'use strict';
  
  // Use relative path (Vercel rewrites proxy to Render backend)
  // Falls back to direct Render URL for local dev
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_BASE = isLocal
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';
  const API_TIMEOUT = 4000;
  
  // Only attempt API calls; never destroy existing content on failure
  document.addEventListener('DOMContentLoaded', () => {
    // Don't fetch if elements don't exist on the page
    if (document.querySelector('.projects-showcase')) tryLoadProjects();
    if (document.querySelector('.poetry-grid')) tryLoadPoems();
    // Books and blog are optional enrichments
  });

  async function fetchWithTimeout(url, timeout = API_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  async function tryLoadProjects() {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/projects`);
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        console.log('✓ Projects enriched from API:', data.data.length);
      }
    } catch (error) {
      // Silently fall back to static content — no error shown to user
      console.log('ℹ Using static project content (API unavailable)');
    }
  }

  async function tryLoadPoems() {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/poems`);
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        console.log('✓ Poems enriched from API:', data.data.length);
      }
    } catch (error) {
      console.log('ℹ Using static poem content (API unavailable)');
    }
  }

  // Re-trigger reveal animations for any dynamically loaded content
  setTimeout(() => {
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
    
    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
      revealObserver.observe(el);
    });
  }, 200);
  
})();
