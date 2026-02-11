/* ============================================================
   ANINDYA KARTIK — INTERACTIVE MAGIC
   Cinematic animations and unforgettable interactions
   ============================================================ */

// ================================================== //
// PARTICLE CANVAS BACKGROUND                         //
// ================================================== //
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      const angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * force * 2;
      this.y -= Math.sin(angle) * force * 2;
    }
    
    // Boundary check
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  
  draw() {
    ctx.fillStyle = `rgba(250, 250, 248, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  connectParticles();
  requestAnimationFrame(animateParticles);
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 120) {
        const opacity = (1 - distance / 120) * 0.2;
        ctx.strokeStyle = `rgba(250, 250, 248, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  initCanvas();
  initParticles();
});

initCanvas();
initParticles();
animateParticles();

// ================================================== //
// REAL-TIME CLOCK                                    //
// ================================================== //
function updateClock() {
  const timeDisplay = document.querySelector('.time-display');
  if (timeDisplay) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}`;
  }
}

updateClock();
setInterval(updateClock, 1000);

// ================================================== //
// SCROLL REVEAL ANIMATIONS                           //
// ================================================== //
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
);

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});

// ================================================== //
// SMOOTH SCROLL FOR ANCHOR LINKS                     //
// ================================================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const navHeight = document.querySelector('.nav-float').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 40;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ================================================== //
// CURSOR TRAIL EFFECT                                //
// ================================================== //
class CursorTrail {
  constructor() {
    this.trail = [];
    this.maxLength = 20;
    this.init();
  }
  
  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.addPoint(e.clientX, e.clientY));
    
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  addPoint(x, y) {
    this.trail.push({ x, y, life: 1 });
    if (this.trail.length > this.maxLength) {
      this.trail.shift();
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.trail.forEach((point, index) => {
      point.life -= 0.05;
      
      if (point.life > 0) {
        const size = point.life * 3;
        const opacity = point.life * 0.3;
        
        this.ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    this.trail = this.trail.filter(point => point.life > 0);
    
    requestAnimationFrame(() => this.animate());
  }
}

if (window.innerWidth > 768) {
  new CursorTrail();
}

// ================================================== //
// MAGNETIC BUTTONS                                   //
// ================================================== //
const magneticElements = document.querySelectorAll('.cta-primary, .project-btn.primary, .contact-btn');

magneticElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

// ================================================== //
// PROJECT CARD 3D TILT                               //
// ================================================== //
const projectCards = document.querySelectorAll('.project-card, .poem-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ================================================== //
// HERO PARALLAX (dreamy mouse-follow)                //
// ================================================== //
const heroContent = document.querySelector('.hero-content');
if (heroContent && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    heroContent.style.transform = `translate(${x}px, ${y}px)`;
  });
  document.addEventListener('mouseleave', () => {
    heroContent.style.transform = '';
  });
}

// ================================================== //
// TYPEWRITER EFFECT FOR HERO                         //
// ================================================== //
function typeWriter(element, text, speed = 100) {
  let i = 0;
  const originalText = element.textContent;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ================================================== //
// SOUND TOGGLE (AMBIENT AUDIO)                       //
// ================================================== //
const soundToggle = document.querySelector('.sound-toggle');
let audioPlaying = false;

// Create ambient audio element (placeholder)
const ambientAudio = new Audio();
ambientAudio.loop = true;
ambientAudio.volume = 0.2;

soundToggle.addEventListener('click', () => {
  audioPlaying = !audioPlaying;
  
  if (audioPlaying) {
    // ambientAudio.play(); // Uncomment when you have an audio file
    soundToggle.style.color = '#ef4444';
  } else {
    // ambientAudio.pause(); // Uncomment when you have an audio file
    soundToggle.style.color = '';
  }
  
  // Animate sound waves
  const soundWave = soundToggle.querySelector('.sound-wave');
  if (soundWave) {
    soundWave.style.animation = audioPlaying ? 'soundWave 0.5s ease-in-out infinite' : '';
  }
});

// Add sound wave animation
const soundWaveStyle = document.createElement('style');
soundWaveStyle.textContent = `
  @keyframes soundWave {
    0%, 100% { opacity: 1; transform: scaleY(1); }
    50% { opacity: 0.7; transform: scaleY(0.8); }
  }
`;
document.head.appendChild(soundWaveStyle);

// ================================================== //
// BOOK INTERACTION ENHANCEMENTS                      //
// ================================================== //
const books = document.querySelectorAll('.book');

books.forEach(book => {
  book.addEventListener('mouseenter', () => {
    // Slightly scale down neighbor books
    const allBooks = Array.from(books);
    const index = allBooks.indexOf(book);
    
    allBooks.forEach((b, i) => {
      if (Math.abs(i - index) === 1) {
        b.style.transform = `rotate(${b.style.getPropertyValue('--book-tilt')}) scale(0.95)`;
      }
    });
  });
  
  book.addEventListener('mouseleave', () => {
    books.forEach(b => {
      b.style.transform = `rotate(${b.style.getPropertyValue('--book-tilt')}) scale(1)`;
    });
  });
});

// ================================================== //
// EASTER EGG: KONAMI CODE                            //
// ================================================== //
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join('') === konamiSequence.join('')) {
    activateEasterEgg();
  }
});

function activateEasterEgg() {
  // Add rainbow animation to the entire page
  document.body.style.animation = 'rainbow 10s ease-in-out';
  
  const rainbowStyle = document.createElement('style');
  rainbowStyle.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(rainbowStyle);
  
  // Show message
  const message = document.createElement('div');
  message.textContent = '🎉 You found the secret!';
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--paper);
    background: rgba(239, 68, 68, 0.95);
    padding: 2rem 4rem;
    border-radius: 16px;
    z-index: 10000;
    animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
      message.remove();
      document.body.style.animation = '';
    }, 500);
  }, 3000);
}

// ================================================== //
// CONSOLE ART                                        //
// ================================================== //
console.log('%c███████╗███████╗███████╗██╗  ██╗', 'color: #ef4444; font-weight: bold; font-size: 12px;');
console.log('%c╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝', 'color: #ef4444; font-weight: bold; font-size: 12px;');
console.log('%c👋 Hey there, curious mind!', 'color: #fafaf8; font-size: 18px; font-weight: bold;');
console.log('%cI see you peeking under the hood. Like what you see?', 'color: #a1a1aa; font-size: 14px;');
console.log('%cLet\'s build something together: hello@anindya.com', 'color: #71717a; font-size: 12px;');
console.log('%c✨ Built with intention, not templates', 'color: #ef4444; font-size: 11px; font-style: italic;');

// ================================================== //
// LOADING COMPLETE                                   //
// ================================================== //
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger initial reveals for visible elements
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('revealed');
    }
  });
});

// ================================================== //
// PERFORMANCE MONITORING                             //
// ================================================== //
if ('PerformanceObserver' in window) {
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.renderTime || entry.loadTime);
      }
    }
  });
  
  perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

// ================================================== //
// ANONYMOUS LETTER FEATURE                           //
// ================================================== //
(function() {
  const letterToggle = document.getElementById('letterToggle');
  const letterContainer = document.getElementById('letterContainer');
  const letterEnvelope = document.getElementById('letterEnvelope');
  const letterPaper = document.getElementById('letterPaper');
  const anonymousForm = document.getElementById('anonymousForm');
  const anonymousMessage = document.getElementById('anonymousMessage');
  const charCount = document.getElementById('charCount');
  const expectReply = document.getElementById('expectReply');
  const optionalEmailGroup = document.getElementById('optionalEmailGroup');
  const sealLetter = document.getElementById('sealLetter');
  const sendAnonymous = document.getElementById('sendAnonymous');
  const letterPreview = document.getElementById('letterPreview');
  const previewContent = document.getElementById('previewContent');
  const closePreview = document.getElementById('closePreview');
  const editLetter = document.getElementById('editLetter');
  const confirmSend = document.getElementById('confirmSend');
  const letterSentAnimation = document.getElementById('letterSentAnimation');
  const sendAnother = document.getElementById('sendAnother');

  if (!letterToggle) return;

  // Toggle letter container
  letterToggle.addEventListener('click', function() {
    const isOpen = letterContainer.classList.contains('open');
    
    if (isOpen) {
      letterContainer.classList.remove('open');
      letterToggle.classList.remove('active');
      letterToggle.querySelector('.toggle-text').textContent = 'Open';
    } else {
      letterContainer.classList.add('open');
      letterToggle.classList.add('active');
      letterToggle.querySelector('.toggle-text').textContent = 'Close';
      
      // Animate envelope opening after a delay
      setTimeout(() => {
        letterEnvelope.classList.add('opening');
      }, 600);
    }
  });

  // Character counter
  if (anonymousMessage && charCount) {
    anonymousMessage.addEventListener('input', function() {
      const count = this.value.length;
      charCount.textContent = count;
      
      if (count > 1000) {
        charCount.style.color = 'var(--fire)';
        this.value = this.value.substring(0, 1000);
      } else if (count > 900) {
        charCount.style.color = 'var(--gold)';
      } else {
        charCount.style.color = 'var(--fire)';
      }
    });
  }

  // Toggle optional email field
  if (expectReply && optionalEmailGroup) {
    expectReply.addEventListener('change', function() {
      if (this.checked) {
        optionalEmailGroup.style.display = 'block';
      } else {
        optionalEmailGroup.style.display = 'none';
      }
    });
  }

  // Seal & Preview letter
  if (sealLetter) {
    sealLetter.addEventListener('click', function() {
      const message = anonymousMessage.value.trim();
      
      if (!message) {
        // Shake animation for empty message
        anonymousMessage.style.animation = 'shake 0.5s';
        setTimeout(() => {
          anonymousMessage.style.animation = '';
        }, 500);
        anonymousMessage.focus();
        return;
      }
      
      // Show preview
      previewContent.textContent = message;
      anonymousForm.style.display = 'none';
      letterPreview.style.display = 'block';
      
      // Add typing effect to preview
      const text = message;
      previewContent.textContent = '';
      let i = 0;
      const typeSpeed = 20;
      
      function typePreview() {
        if (i < text.length) {
          previewContent.textContent += text.charAt(i);
          i++;
          setTimeout(typePreview, typeSpeed);
        }
      }
      
      typePreview();
    });
  }

  // Close preview
  if (closePreview || editLetter) {
    const closeHandler = function() {
      letterPreview.style.display = 'none';
      anonymousForm.style.display = 'flex';
    };
    
    if (closePreview) closePreview.addEventListener('click', closeHandler);
    if (editLetter) editLetter.addEventListener('click', closeHandler);
  }

  // Confirm and send
  if (confirmSend) {
    confirmSend.addEventListener('click', function() {
      sendLetterAnimation();
    });
  }

  // Form submission
  if (anonymousForm) {
    anonymousForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const message = anonymousMessage.value.trim();
      if (!message) {
        anonymousMessage.focus();
        return;
      }
      
      await sendLetterToBackend();
    });
  }

  // Confirm and send
  if (confirmSend) {
    confirmSend.addEventListener('click', async function() {
      await sendLetterToBackend();
    });
  }

  // Send letter to backend
  async function sendLetterToBackend() {
    const message = anonymousMessage.value.trim();
    const expectReplyChecked = expectReply.checked;
    const replyEmailValue = document.getElementById('replyEmail').value.trim();
    
    // Validate
    if (!message) {
      if (typeof showNotification === 'function') {
        showNotification('Please write a message', 'error');
      }
      return;
    }
    
    if (expectReplyChecked && !replyEmailValue) {
      if (typeof showNotification === 'function') {
        showNotification('Please provide an email for reply', 'error');
      }
      return;
    }
    
    // Prepare data
    const formData = {
      message: message,
      expectReply: expectReplyChecked,
      replyEmail: expectReplyChecked ? replyEmailValue : null
    };
    
    // Show loading state
    const sendBtn = document.getElementById('sendAnonymous');
    const confirmBtn = document.getElementById('confirmSend');
    const activeBtn = letterPreview.style.display === 'none' ? sendBtn : confirmBtn;
    
    const originalText = activeBtn.querySelector('span:not(.btn-icon)').textContent;
    activeBtn.disabled = true;
    activeBtn.querySelector('span:not(.btn-icon)').textContent = 'Sending...';
    activeBtn.style.opacity = '0.7';
    
    try {
      const response = await fetch('/api/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Success - trigger animation
        sendLetterAnimation();
        if (typeof showNotification === 'function') {
          showNotification(data.message, 'success');
        }
      } else {
        throw new Error(data.message || 'Failed to send letter');
      }
    } catch (error) {
      console.error('Anonymous letter error:', error);
      activeBtn.disabled = false;
      activeBtn.querySelector('span:not(.btn-icon)').textContent = originalText;
      activeBtn.style.opacity = '1';
      
      if (typeof showNotification === 'function') {
        showNotification(error.message || 'Failed to send letter. Please try again.', 'error');
      }
    }
  }

  // Send letter animation
  function sendLetterAnimation() {
    // Hide form/preview
    anonymousForm.style.display = 'none';
    letterPreview.style.display = 'none';
    
    // Create flying letter animation
    const flyingLetter = document.createElement('div');
    flyingLetter.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 40px;
      background: var(--fire);
      border-radius: 8px;
      z-index: 10000;
      animation: flyAway 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      box-shadow: 0 8px 32px rgba(239, 68, 68, 0.6);
    `;
    
    const flyAnimation = document.createElement('style');
    flyAnimation.textContent = `
      @keyframes flyAway {
        0% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: translate(-50%, -150%) scale(0.8) rotate(180deg);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -300%) scale(0.3) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(flyAnimation);
    document.body.appendChild(flyingLetter);
    
    // Create particle burst
    createParticleBurst();
    
    setTimeout(() => {
      flyingLetter.remove();
      flyAnimation.remove();
      
      // Show success animation
      letterSentAnimation.style.display = 'block';
      
      // Reset form
      anonymousMessage.value = '';
      charCount.textContent = '0';
      expectReply.checked = false;
      optionalEmailGroup.style.display = 'none';
      document.getElementById('replyEmail').value = '';
    }, 1200);
  }

  // Particle burst effect
  function createParticleBurst() {
    const colors = ['#ef4444', '#fbbf24', '#10b981', '#0ea5e9', '#a855f7'];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 100 + Math.random() * 100;
      const size = 4 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        box-shadow: 0 0 10px ${color};
      `;
      
      document.body.appendChild(particle);
      
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.animate([
        {
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 800 + Math.random() * 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }).onfinish = () => particle.remove();
    }
  }

  // Send another letter
  if (sendAnother) {
    sendAnother.addEventListener('click', function() {
      letterSentAnimation.style.display = 'none';
      anonymousForm.style.display = 'flex';
      letterEnvelope.classList.remove('opening');
      
      // Re-animate envelope
      setTimeout(() => {
        letterEnvelope.classList.add('opening');
      }, 300);
    });
  }

  // Add shake animation
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // Add sparkle effect on hover
  if (letterPaper) {
    letterPaper.addEventListener('mousemove', function(e) {
      if (Math.random() > 0.95) {
        const sparkle = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        sparkle.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 4px;
          height: 4px;
          background: var(--gold);
          border-radius: 50%;
          pointer-events: none;
          z-index: 100;
          box-shadow: 0 0 10px var(--gold);
        `;
        
        this.appendChild(sparkle);
        
        sparkle.animate([
          {
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 1
          },
          {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1
          },
          {
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0
          }
        ], {
          duration: 600,
          easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
      }
    });
  }

  // Console easter egg for anonymous letter
  console.log('%c📨 Anonymous Letter Feature Activated!', 'color: #ef4444; font-size: 16px; font-weight: bold;');
  console.log('%cYour secrets are safe with us... 🤫', 'color: #fbbf24; font-size: 12px;');
})();
