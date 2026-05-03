/* ============================================================
   MUSINGS PAGE — Poetry & Thoughts
   Self-contained with embedded data
   ============================================================ */

(function() {
  'use strict';

  const STATIC_POEMS = [
    {
      _id: '1',
      title: 'Entropy & The Machine',
      content: 'Code rots like fruit left in the sun—\neach function call a little less elegant,\neach variable name a whisper of intention\nnow fading into legacy.\n\nWe build monuments to impermanence,\ncathedrals of logic that outlive their makers\nbut not their purpose.\n\nSomewhere between the semicolons,\na poem hides—waiting for the compiler\nto mistake beauty for syntax.',
      mood: 'contemplative',
      tags: ['code', 'time', 'philosophy'],
      publishedAt: '2024-10-02',
      featured: true,
      stats: { views: 340, likes: 52 }
    },
    {
      _id: '2',
      title: 'Blue Light Morning',
      content: 'On waking before the sun,\nwhen the world is still compiling\nand dreams linger in terminal windows—\n\nI reach for the warmth of coffee,\nthe cold glow of a screen,\nand wonder which one wakes me\nand which one keeps me sleeping.\n\nThe cursor blinks.\nThe world waits.\nI type the first line of the day.',
      mood: 'contemplative',
      tags: ['morning', 'routine', 'code'],
      publishedAt: '2024-09-14',
      stats: { views: 280, likes: 41 }
    },
    {
      _id: '3',
      title: 'Digital Gardens',
      content: 'Why I chose to build a garden\ninstead of a blog—\non tending to ideas\nand letting them grow wild.\n\nA blog is a timeline.\nA garden is a topology.\nOne demands chronology;\nthe other, only connection.\n\nI plant seeds in markdown,\nwater them with hyperlinks,\nand watch them bloom into\nsomething I never planned.',
      mood: 'joyful',
      tags: ['writing', 'web', 'creativity'],
      publishedAt: '2024-08-28',
      stats: { views: 520, likes: 78 }
    },
    {
      _id: '4',
      title: 'Midnight Refactor',
      content: 'At 2 AM the code speaks differently—\nfunction names become confessions,\ncomments turn to love letters\naddressed to the future self\nwho will read them and wonder.\n\nI delete more than I write.\nEvery removed line is a liberation,\nevery simplified function\na small act of kindness\nfor someone I haven\'t met.',
      mood: 'melancholic',
      tags: ['code', 'night', 'reflection'],
      publishedAt: '2024-08-10',
      stats: { views: 190, likes: 33 }
    },
    {
      _id: '5',
      title: 'To The Compiler',
      content: 'Dear compiler,\nI know I ask too much of you—\nto understand my half-formed thoughts,\nmy naming conventions born\nfrom exhaustion and caffeine.\n\nYou are more patient than any reader,\nmore honest than any critic.\nWhen you say "error on line 47,"\nyou mean "I believe in you,\nbut not this version of you."',
      mood: 'joyful',
      tags: ['code', 'humor', 'letter'],
      publishedAt: '2024-07-22',
      stats: { views: 410, likes: 89 }
    },
    {
      _id: '6',
      title: 'The Weight of Tabs',
      content: 'Forty-seven tabs open—\neach one a promise I made\nto my curiosity\nand couldn\'t keep.\n\nArticles on quantum computing,\na recipe for dal makhani,\nthree Stack Overflow answers\nto a question I forgot.\n\nI close them one by one\nlike doors in a house\nI\'m not sure I live in anymore.',
      mood: 'melancholic',
      tags: ['technology', 'overwhelm', 'modern-life'],
      publishedAt: '2024-07-05',
      stats: { views: 360, likes: 67 }
    },
    {
      _id: '7',
      title: 'First Deploy',
      content: 'The button says "Deploy"\nbut it means something else—\nit means: release your work\ninto the wild, imperfect\nand trembling.\n\nEvery first deploy\nis a small act of courage,\na declaration that says\n"this is good enough\nto exist in the world."\n\nAnd the world, mostly,\ndoesn\'t notice.\nBut you do. And that\'s enough.',
      mood: 'contemplative',
      tags: ['code', 'courage', 'shipping'],
      publishedAt: '2024-06-18',
      stats: { views: 290, likes: 55 }
    },
    {
      _id: '8',
      title: 'Ode to Sunset',
      content: 'The sky writes poetry\nin colors I can\'t name—\nsomewhere between hexadecimal\nand heartbreak.\n\n#FF6B35 fading into #1A1A2E,\na gradient no CSS can capture,\nno screen can reproduce.\n\nI close my laptop\nand watch the real render engine\ndo what it does best:\nremind me that beauty\ndoesn\'t need a framework.',
      mood: 'romantic',
      tags: ['nature', 'beauty', 'perspective'],
      publishedAt: '2024-06-01',
      stats: { views: 440, likes: 91 }
    }
  ];

  let allPoems = [];
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    allPoems = STATIC_POEMS;
    renderPoems(allPoems);
    setupFilters();
  });

  function renderPoems(poems) {
    const grid = document.getElementById('poemsGrid');
    if (!grid) return;

    if (poems.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✍️</div>
          <h3>No poems match this mood</h3>
          <p>Try selecting a different filter</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = poems.map((poem, index) => createPoemCard(poem, index)).join('');

    setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 80);
      });
    }, 50);
  }

  function createPoemCard(poem, index) {
    const delay = (index % 3) * 100;
    const moodEmoji = getMoodEmoji(poem.mood);

    return `
      <article class="poem-card-full" data-reveal style="animation-delay: ${delay}ms">
        <div class="poem-header">
          <span class="poem-number">#${String(index + 1).padStart(3, '0')}</span>
          <div class="poem-mood">
            <span class="mood-emoji">${moodEmoji}</span>
            <span class="mood-text">${poem.mood || 'contemplative'}</span>
          </div>
        </div>
        
        <h3 class="poem-title">${poem.title}</h3>
        
        <div class="poem-content">
          <pre>${poem.content}</pre>
        </div>
        
        ${poem.tags && poem.tags.length > 0 ? `
          <div class="poem-tags">
            ${poem.tags.map(tag => `<span class="poem-tag">#${tag}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="poem-footer">
          <div class="poem-meta">
            <time datetime="${poem.publishedAt}">
              ${new Date(poem.publishedAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </time>
          </div>
          
          <div class="poem-stats">
            <span class="stat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              ${poem.stats?.views || 0}
            </span>
            <span class="stat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2.5l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L3 6l3.5-.5 1.5-3z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              ${poem.stats?.likes || 0}
            </span>
          </div>
        </div>
      </article>
    `;
  }

  function getMoodEmoji(mood) {
    const moods = {
      'contemplative': '🤔',
      'melancholic': '🌧️',
      'joyful': '✨',
      'romantic': '💕',
      'dark': '🌑',
      'hopeful': '🌅'
    };
    return moods[mood] || '📝';
  }

  function setupFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = filter;
        filterPoems(filter);
      });
    });
  }

  function filterPoems(filter) {
    let filtered = allPoems;
    if (filter !== 'all') {
      filtered = allPoems.filter(p => p.mood === filter);
    }
    renderPoems(filtered);
  }

})();
